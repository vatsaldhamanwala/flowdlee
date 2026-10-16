import { AUTH } from '@/constants/auth.constants';
import { NextRequest, NextResponse } from 'next/server';

const baseCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
};

export function setAuthCookies(response: NextResponse, tokens: { accessToken: string; refreshToken: string }) {
  // set access token in cookie
  response.cookies.set(AUTH.COOKIES.ACCESS_TOKEN, tokens.accessToken, {
    ...baseCookieOptions,
    path: AUTH.COOKIE_PATH.ACCESS_TOKEN,
    maxAge: AUTH.COOKIE_MAX_AGE.ACCESS_TOKEN,
  });

  // set refresh token in cookie
  response.cookies.set(AUTH.COOKIES.REFRESH_TOKEN, tokens.refreshToken, {
    ...baseCookieOptions,
    path: AUTH.COOKIE_PATH.REFRESH_TOKEN,
    maxAge: AUTH.COOKIE_MAX_AGE.REFRESH_TOKEN,
  });
}

// clear cookies to logout from devices (web/mobile)
export function clearAuthCookies(response: NextResponse) {
  response.cookies.set(AUTH.COOKIES.ACCESS_TOKEN, '', {
    ...baseCookieOptions,
    path: AUTH.COOKIE_PATH.ACCESS_TOKEN,
    maxAge: 0,
  });

  response.cookies.set(AUTH.COOKIES.REFRESH_TOKEN, '', {
    ...baseCookieOptions,
    path: AUTH.COOKIE_PATH.REFRESH_TOKEN,
    maxAge: 0,
  });
}

// get the refresh token from web/ mobile request
export async function getRefreshTokenFromRequest(request: NextRequest) {
  const requestCookieFromWeb = request.cookies.get(AUTH.COOKIES.REFRESH_TOKEN)?.value;

  if (requestCookieFromWeb) return { token: requestCookieFromWeb, source: 'cookie' as const };

  // mobile version
  const requestCookieFromMobile = await request.json().catch(() => null);

  if (requestCookieFromMobile && typeof requestCookieFromMobile.refreshToken === 'string' && requestCookieFromMobile.refreshToken) {
    return { token: requestCookieFromMobile.refreshToken as string, source: 'body' as const };
  }

  // if refresh token request neither coming from web/mobile than -> undefined token and source
  return { token: undefined, source: undefined };
}
