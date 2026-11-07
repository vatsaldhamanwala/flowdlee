import { ONBOARDING_RESPONSE } from '@/constants/api-response-error-messages';
import { requireAuth } from '@/modules/auth/auth.guard';
import { onboardingResponsesSchema, onboardingService } from '@/modules/onboarding-responses';
import { successResponse } from '@/server/helpers/api-response';
import { handleApiError } from '@/server/helpers/handle-api-error';
import { validateRequest } from '@/server/helpers/validate-request';
import { StatusCodes } from 'http-status-codes';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await requireAuth(request);

    const onboardingResponse = await onboardingService.getMyOnboardingResponse(userId);

    return successResponse(onboardingResponse, ONBOARDING_RESPONSE.FETCHED, StatusCodes.OK);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await requireAuth(request);

    const input = await validateRequest(request, onboardingResponsesSchema);

    const onboardingResponse = await onboardingService.saveMyOnboardingResponse(userId, input);

    return successResponse(onboardingResponse, ONBOARDING_RESPONSE.SAVED, StatusCodes.OK);
  } catch (error) {
    return handleApiError(error);
  }
}
