import { USER } from '@/constants/api-response-error-messages';
import { authService, userLoginSchema } from '@/modules/auth';
import { setAuthCookies } from '@/modules/auth/auth.cookies';
import { successResponse } from '@/server/helpers/api-response';
import { handleApiError } from '@/server/helpers/handle-api-error';
import { validateRequest } from '@/server/helpers/validate-request';
import { StatusCodes } from 'http-status-codes';

export async function POST(request: Request) {
  try {
    const input = await validateRequest(request, userLoginSchema);

    const { user, accessToken, refreshToken } = await authService.loginUser(input);

    // Tokens go in the body only for non-browser clients that option (mobile version)
    const wantsTokenInBody = request.headers.get('x-client-type') === 'mobile';

    const response = successResponse({
      data: wantsTokenInBody ? { user, accessToken, refreshToken } : { user },
      message: USER.LOGIN_SUCCESS,
      status: StatusCodes.OK,
    });

    setAuthCookies(response, { accessToken, refreshToken });

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
