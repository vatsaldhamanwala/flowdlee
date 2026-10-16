import { TOKEN } from '@/constants/api-response-error-messages';
import { authService } from '@/modules/auth';
import { clearAuthCookies, getRefreshTokenFromRequest, setAuthCookies } from '@/modules/auth/auth.cookies';
import { ApiError } from '@/server/helpers/api-error';
import { successResponse } from '@/server/helpers/api-response';
import { handleApiError } from '@/server/helpers/handle-api-error';
import { StatusCodes } from 'http-status-codes';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token, source } = await getRefreshTokenFromRequest(request);

    if (!token) throw new ApiError(StatusCodes.UNAUTHORIZED, TOKEN.INVALID_REFRESH_TOKEN);

    const refreshSessionTokens = await authService.refreshSession(token);

    const response = successResponse({ data: source === 'body' ? refreshSessionTokens : null });

    setAuthCookies(response, refreshSessionTokens);

    return response;
  } catch (error) {
    const response = handleApiError(error);

    if (error instanceof ApiError && error.statusCode === StatusCodes.UNAUTHORIZED) clearAuthCookies(response);

    return response;
  }
}
