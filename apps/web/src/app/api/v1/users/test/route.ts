import { USER } from '@/constants/api-response-error-messages';
import { findUserById } from '@/modules/users/user.service';
import { successResponse } from '@/server/helpers/api-response';
import { handleApiError } from '@/server/helpers/handle-api-error';
import { StatusCodes } from 'http-status-codes';

export async function GET() {
  try {
    const usersWithEmailExist = await findUserById('1'); // Replace '1' with the actual user ID you want to test

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
