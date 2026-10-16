import { USER } from '@/constants/api-response-error-messages';
import { authService } from '@/modules/auth';
import { clearAuthCookies, getRefreshTokenFromRequest } from '@/modules/auth/auth.cookies';
import { successResponse } from '@/server/helpers/api-response';
import { handleApiError } from '@/server/helpers/handle-api-error';
import { StatusCodes } from 'http-status-codes';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token } = await getRefreshTokenFromRequest(request);

    await authService.logoutUser(token);

    const response = successResponse({ data: null, message: USER.LOGOUT_SUCCESS, status: StatusCodes.OK });

    clearAuthCookies(response);

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
