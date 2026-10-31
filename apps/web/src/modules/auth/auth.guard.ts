import { USER } from '@/constants/api-response-error-messages';
import { AUTH } from '@/constants/auth.constants';
import { ApiError } from '@/server/helpers/api-error';
import { StatusCodes } from 'http-status-codes';
import { NextRequest } from 'next/server';
import { verifyAccessToken } from './auth.token';

// get token from web/mobile request
function getAccessToken(request: NextRequest): string | undefined {
  const header = request.headers.get('authorization');

  if (header?.startsWith(AUTH.BEARER_PREFIX)) {
    return header.slice(AUTH.BEARER_PREFIX.length).trim() || undefined;
  }

  return request.cookies.get(AUTH.COOKIES.ACCESS_TOKEN)?.value;
}

// to check user is authenticate or not on every request with tokens
export async function requireAuth(request: NextRequest): Promise<{ userId: string }> {
  const token = getAccessToken(request);

  if (!token) throw new ApiError(StatusCodes.UNAUTHORIZED, USER.UNAUTHORIZED);

  try {
    return { userId: await verifyAccessToken(token) };
  } catch {
    throw new ApiError(StatusCodes.UNAUTHORIZED, USER.UNAUTHORIZED);
  }
}
