import { Prisma } from '@/generated/prisma';
import { OnboardingResponseDTO } from './dto/onboarding-responses.dto';
import { toOnboardingResponseDTO } from './onboarding-responses.mapper';
import { OnboardingResponsesRepository } from './onboarding-responses.repository';
import { OnboardingResponseInput } from './validators/onboarding-responses.schema';
import { ApiError } from '@/server/helpers/api-error';
import { StatusCodes } from 'http-status-codes';
import { USER } from '@/constants/api-response-error-messages';

export class OnboardingResponseService {
  constructor(private readonly onboardingResponseRepository: OnboardingResponsesRepository) {}

  // get onboarding responses answers -> if null than not onboarded yet
  async getMyOnboardingResponse(userId: string): Promise<OnboardingResponseDTO | null> {
    const onboardingResponseExist = await this.onboardingResponseRepository.findByUserId(userId);

    return onboardingResponseExist ? toOnboardingResponseDTO(onboardingResponseExist) : null;
  }

  //save onboarding answers (create if not exists, update if exists)
  async saveMyOnboardingResponse(userId: string, data: OnboardingResponseInput): Promise<OnboardingResponseDTO> {
    try {
      const isOnboardingSavedOrCreated = await this.onboardingResponseRepository.upsertByUserId(userId, data);

      return toOnboardingResponseDTO(isOnboardingSavedOrCreated);
    } catch (error) {
      // The token was valid, but the account was deleted before we saved (foreign key failed)
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new ApiError(StatusCodes.UNAUTHORIZED, USER.UNAUTHORIZED);
      }

      throw error;
    }
  }
}
