import { ONBOARDING_RESPONSE } from '@/constants/api-response-error-messages';
import { requireAuth } from '@/modules/auth/auth.guard';
import { onboardingResponsesSchema, onboardingService } from '@/modules/onboarding-responses';
import { successResponse } from '@/server/helpers/api-response';
import { handleApiError } from '@/server/helpers/handle-api-error';
import { validateRequest } from '@/server/helpers/validate-request';
import { StatusCodes } from 'http-status-codes';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await requireAuth(request);

    const input = await validateRequest(request, onboardingResponsesSchema);

    const result = await onboardingService.submitMyOnboarding(userId, input);

    return successResponse(result, ONBOARDING_RESPONSE.SUBMITTED, StatusCodes.OK);
  } catch (error) {
    return handleApiError(error);
  }
}
