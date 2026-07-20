import { handleApiError } from '@/server/helpers/handle-api-error';
import { validateRequest } from '@/server/helpers/validate-request';
import { userRegisterSchema } from '@/modules/auth/validators/auth.schema';
import { authService } from '@/modules/auth';
import { successResponse } from '@/server/helpers/api-response';
import { USER } from '@/constants/api-response-error-messages';
import { StatusCodes } from 'http-status-codes';

export async function POST(request: Request) {
  try {
    const input = await validateRequest(request, userRegisterSchema);

    const user = await authService.registerUser(input);

    return successResponse({
      data: user,
      message: USER.ACCOUNT_CREATED,
      status: StatusCodes.CREATED,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
