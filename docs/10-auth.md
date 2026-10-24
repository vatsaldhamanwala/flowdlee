# Authentication

Custom JWT + refresh token auth, built from scratch (no NextAuth/Clerk/Auth0). Built for the web app, with mobile support designed in from the start.

## Overview

- **Access token** — a JWT (`HS256`), expires in `15 minutes`. Only carries the user's id. Never stored anywhere — the server just re-verifies the signature on every request.
- **Refresh token** — not a JWT. Just 32 random bytes. The raw value goes to the client; only its `SHA-256` hash is stored in the database. Expires in `7 days`. Because it's a real DB row, the server can revoke it or check if it's been used before.
- **Storage** — both tokens live in `httpOnly` cookies, so JavaScript in the browser can never read them (blocks token theft via XSS). The access token cookie goes out on every request (`path: /`), but the refresh token cookie is scoped to `path: /api/v1/auth`, so it's only ever sent to the auth endpoints, not every API call.

## Endpoints

| Method | Path                  | What it does                                                            | Auth needed   |
| ------ | --------------------- | ----------------------------------------------------------------------- | ------------- |
| POST   | /api/v1/auth/register | Creates a new user, then immediately logs them in (see below)           | No            |
| POST   | /api/v1/auth/login    | Checks email + password, issues a fresh access + refresh token pair     | No            |
| POST   | /api/v1/auth/refresh  | Swaps a valid refresh token for a brand-new access + refresh token pair | Refresh token |
| POST   | /api/v1/auth/logout   | Revokes the refresh token so it can't be used again                     | Refresh token |
| GET    | /api/v1/auth/me       | Returns the currently logged-in user, based on the access token         | Access token  |

## How it works

### Login

1. Client sends `email` + `password` to `POST /auth/login`.
2. Server finds the user by email and checks the password against the stored `argon2id` hash.
   - Even if the email doesn't exist, the server still runs one password check (against a dummy hash) — so a failed login takes the same amount of time either way, and an attacker can't tell "wrong password" apart from "no such email" just by measuring response time.
3. On success, the server creates a new access token (signed JWT) and a new refresh token (random bytes), then saves only the _hash_ of the refresh token in the `refresh_tokens` table.
4. Both tokens are set as `httpOnly` cookies on the response. The user object is also returned in the response body, so the frontend can show the logged-in UI immediately without an extra round trip to `/auth/me`.

### Staying logged in (refresh)

1. Every protected request carries the access token (from the cookie, or an `Authorization: Bearer` header for non-browser clients). The server just verifies the JWT signature — no database lookup needed, which keeps things fast.
2. After 15 minutes, the access token expires and the next request gets a `401 Unauthorized`.
3. The frontend's `apiFetch()` helper catches that `401` automatically, calls `POST /auth/refresh` (which sends the refresh token cookie), and retries the original request once.
4. `/auth/refresh` looks up the refresh token by its hash. If it's valid (not expired, not already used), the server:
   - marks that refresh token as used (`revokedAt` set), and
   - issues a brand-new access + refresh token pair.
     This is called **rotation** — a refresh token can only ever be used once.
5. New cookies are set on the response, and the original request is retried with the fresh access token — the user never notices.
6. If the refresh token itself is invalid or expired, `/auth/refresh` returns `401`. The frontend then treats the user as logged out and redirects to `/login`.

### Reuse detection

Because every refresh token can only be used once, there should only ever be one "live" refresh token per login session. If someone steals an _old_ refresh token (say, from a leaked log or an old backup) and tries to use it after the real user has already refreshed past it, the server notices: `revokeRefreshToken()` only flips a token to "used" if it isn't already used (this check happens in the database itself, so two requests racing on the same token can't both "win"). If that flip fails — meaning the token was already used — the server assumes the token was stolen and immediately revokes **every** refresh token that user has, anywhere. That forces a fresh login on every device, which locks out the thief (and, as a side effect, the real user too — a reasonable trade-off for catching a stolen token early).

## Design decisions

- **Access token is a stateless JWT, not checked against the DB.** Verifying a signature is fast and needs no database round trip. The short 15-minute lifetime limits how long a stolen access token is actually useful.
- **Refresh token is a random string, hashed before storage — not a JWT.** If the database ever leaks, attackers get unusable hashes (same idea as password hashing), and because each one is a real row, it can be checked, revoked, or rotated — something a stateless JWT refresh token couldn't support.
- **Cookies instead of localStorage.** `httpOnly` cookies can't be read by JavaScript, so a malicious script injected via XSS can't just grab the tokens. Scoping the refresh token cookie to `/api/v1/auth` also means it isn't leaked to every single API call.
- **Rotate the refresh token on every use.** Combined with reuse detection above, this shrinks how much damage a stolen refresh token can do — from "valid for the full 7 days" down to "valid until it's used once."
- **Register logs the user in automatically.** `/auth/register` only creates the account — it doesn't set any cookies. Right after that call succeeds, the frontend calls `/auth/login` with the same credentials, so the user only has to type their password once, not twice.

## Web and mobile clients

- **Web (default):** tokens never leave `httpOnly` cookies. The browser sends them automatically; the frontend JavaScript never sees the raw token values.
- **Mobile:** mobile apps don't have a browser cookie jar, so they identify themselves with an `X-Client-Type: mobile` header on login/register. The server then _also_ includes the raw `accessToken`/`refreshToken` in the JSON response body, so the app can store them itself (e.g. in secure device storage) and send the refresh token back in the request body (instead of a cookie) on `/auth/refresh` and `/auth/logout`. `getRefreshTokenFromRequest()` checks for a cookie first and falls back to the request body — so the same endpoint works for both web and mobile without branching logic everywhere.

## Frontend

- **`AuthProvider`** (`providers/auth-provider.tsx`) holds the logged-in user in React state (`user`, `status: 'loading' | 'authenticated' | 'unauthenticated'`). On first mount it calls `GET /auth/me` once to check if there's already a valid session (e.g. page refresh) and sets `status` from that. `login()` and `register()` update this state directly from the response instead of making an extra call.
- **`apiFetch()`** (`lib/api/client.ts`) is the one place that talks to the API. If a request comes back `401`, it automatically calls `/auth/refresh` and retries the original request once — so the rest of the app never has to think about expired access tokens.
- **`ProtectedRoute` / `GuestRoute`** (`components/auth/route-guards.tsx`) read `status` from `AuthProvider` to redirect: `ProtectedRoute` sends logged-out users to `/login`, `GuestRoute` sends logged-in users away from `/login` and `/register` to `/dashboard`.

## Known limitations

- No email verification flow yet. `isEmailVerified` exists on the user model, but nothing ever sets it to `true`.
- No rate limiting on `/auth/login` or `/auth/register` — nothing stops brute-force login attempts or spam signups at the API layer today.
- No "log out of all devices" button for users. `revokeAllUserTokens()` already exists (used internally for reuse detection), it's just not exposed anywhere in the UI yet.
- A stolen access token can't be revoked early. Since it's a stateless JWT, there's no way to invalidate it before it naturally expires in 15 minutes.

## Running and testing

- Required env vars (validated at startup in `env.ts` — the app refuses to boot if any are missing): `DATABASE_URL`, `JWT_ACCESS_SECRET` (32+ characters), `NEXT_PUBLIC_APP_URL`.
- Manual test flow: `POST /auth/register` → `POST /auth/login` → `GET /auth/me` (should return the user) → delete/expire the access token cookie → `GET /auth/me` again and confirm `apiFetch` silently calls `/auth/refresh` behind the scenes and the request still succeeds.

## Tested manually

**API (Postman / curl)** (Y -> means I tested scenarios , N -> not )

- [Y] Register with valid data returns 201
- [Y] Register with an existing email returns 409
- [Y] Login sets both cookies (web) and returns tokens in the body with `X-Client-Type: mobile`
- [Y] Wrong password and unknown email return the same 401 message
- [Y] `GET /auth/me` works with the cookie and with a bearer token
- [Y] Tampered, expired and `alg: none` tokens return 401
- [Y] Refresh rotates the token: the old one is revoked and a new row is created
- [Y] Reusing a revoked refresh token returns 401 and revokes all of the user's tokens
- [Y] Logout revokes the token and clears the cookies

**Browser**

- [Y] Register and login land on the dashboard
- [Y] Reload keeps the session
- [Y] Deleting the access cookie still keeps the user logged in (silent refresh)
- [Y] Logged-out users are redirected from `/dashboard` to `/login`
- [Y] Logged-in users are redirected from `/login` to `/dashboard`
