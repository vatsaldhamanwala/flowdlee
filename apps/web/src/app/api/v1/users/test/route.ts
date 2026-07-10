import { USER } from '@/constants/api-response-error-messages';
import { findUserByEmail } from '@/modules/users/user.service';
import { successResponse } from '@/server/helpers/api-response';
import { handleApiError } from '@/server/helpers/handle-api-error';
import { StatusCodes } from 'http-status-codes';

export async function GET() {
  try {
    const usersWithEmailExist = await findUserByEmail('test@flowdlee.com');

    return successResponse(
      {
        users: usersWithEmailExist,
      },
      USER.TEST,
      StatusCodes.OK,
    );
  } catch (error) {
    return handleApiError(error);
  }
}
