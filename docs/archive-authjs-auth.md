# Archive note: authjs-auth branch

Archiving this branch in favor of a custom auth implementation.

## What's implemented here

- NextAuth v5 (beta) with a `Credentials` provider and `@auth/prisma-adapter`.
- JWT session strategy (30-day `maxAge`), with a `session` callback that
  attaches `user.id` onto the session.
- Edge-safe middleware split: `auth.config.ts` (shared config, no Prisma)
  → `auth.edge.ts` (used by `proxy.ts` middleware) and `auth.ts` (full
  NextAuth instance with the Prisma adapter, used in route handlers).
- Route groups: `(auth)` for login/register pages, `(protected)` for
  dashboard and other gated routes.
- `next-auth.d.ts` module augmentation to add `id` to `Session.user`.

## Why archived instead of merged

Wanted to implement auth/session/cookie handling manually — cookie
creation/parsing, session storage and invalidation, CSRF, refresh — to
build that knowledge directly, instead of relying on Auth.js to own all
of it.

Keeping this branch around as a reference for the Auth.js approach.

## What to reuse when building custom auth

- The edge/node split pattern for middleware (`auth.config.ts` /
  `auth.edge.ts`) — avoids pulling Prisma into the edge runtime.
- The route group structure: `(auth)` vs `(protected)`.
- `userLoginSchema` / `authService.authenticateUser` — unchanged, still
  used as-is.
- The matcher list in `proxy.ts` for which routes require auth.

## What Auth.js was handling that custom auth will need to do explicitly

- Cookie signing/encryption.
- Session JWT rotation.
- CSRF token handling.
- Adapter-based DB session linkage (only relevant if moving off the JWT
  strategy to a database session strategy).

## Reference

Branch: `archive/authjs-auth`
