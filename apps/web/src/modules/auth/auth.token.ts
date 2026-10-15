import { createHash, randomBytes } from 'node:crypto';
import { SignJWT } from 'jose';
import { AUTH } from '@/constants/auth.constants';

function getAccessSecret(): Uint8Array {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_ACCESS_SECRET must be set and at least 32 characters');
  }
  return new TextEncoder().encode(secret);
}

export async function signAccessToken(userId: string): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuer('flowdlee')
    .setIssuedAt()
    .setExpirationTime(AUTH.ACCESS_TOKEN_EXPIRY)
    .sign(getAccessSecret());
}

// Random opaque token. This is what goes in the cookie.
export function generateRefreshToken(): string {
  return randomBytes(32).toString('base64url');
}

// Only this hash is stored in the database, never the raw token.
export function hashToken(raw: string): string {
  return createHash('sha256').update(raw).digest('hex');
}
