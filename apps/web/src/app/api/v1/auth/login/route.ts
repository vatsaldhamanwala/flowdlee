import { USER } from '@/constants/api-response-error-messages';
import { authService, userLoginSchema } from '@/modules/auth';
import { successResponse } from '@/server/helpers/api-response';
import { handleApiError } from '@/server/helpers/handle-api-error';
import { validateRequest } from '@/server/helpers/validate-request';
import { StatusCodes } from 'http-status-codes';

export async function POST(request: Request) {
  try {
    const input = await validateRequest(request, userLoginSchema);

    const user = await authService.loginUser(input);

    return successResponse({
      user,
      message: USER.LOGIN,
      status: StatusCodes.OK,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
