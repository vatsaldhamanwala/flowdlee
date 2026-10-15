import { AUTH } from '@/constants/auth.constants';
import { NextResponse } from 'next/server';

export function setAuthCookies(response: NextResponse, tokens: { accessToken: string; refreshToken: string }) {
  const base = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
  };

  // set access token in cookie
  response.cookies.set(AUTH.COOKIES.ACCESS_TOKEN, tokens.accessToken, {
    ...base,
    path: AUTH.COOKIE_PATH.ACCESS_TOKEN,
    maxAge: AUTH.COOKIE_MAX_AGE.ACCESS_TOKEN,
  });

  // set refresh token in cookie
  response.cookies.set(AUTH.COOKIES.REFRESH_TOKEN, tokens.refreshToken, {
    ...base,
    path: AUTH.COOKIE_PATH.REFRESH_TOKEN,
    maxAge: AUTH.COOKIE_MAX_AGE.REFRESH_TOKEN,
  });
}
