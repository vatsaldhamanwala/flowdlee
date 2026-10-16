import { USER } from '@/constants/api-response-error-messages';
import { authService } from '@/modules/auth';
import { requireAuth } from '@/modules/auth/auth.guard';
import { successResponse } from '@/server/helpers/api-response';
import { handleApiError } from '@/server/helpers/handle-api-error';
import { StatusCodes } from 'http-status-codes';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await requireAuth(request);

    const userExist = await authService.getCurrentUser(userId);

    return successResponse({ data: userExist }, USER.FETCHED, StatusCodes.OK);
  } catch (error) {
    return handleApiError(error);
  }
}
