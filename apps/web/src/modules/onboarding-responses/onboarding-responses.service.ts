import { Prisma, PrismaClient, UserPreferenceSource } from '@/generated/prisma';
import { OnboardingResponseDTO } from './dto/onboarding-responses.dto';
import { toOnboardingResponseDTO } from './onboarding-responses.mapper';
import { OnboardingResponsesRepository } from './onboarding-responses.repository';
import { OnboardingResponseInput } from './validators/onboarding-responses.schema';
import { ApiError } from '@/server/helpers/api-error';
import { StatusCodes } from 'http-status-codes';
import { USER } from '@/constants/api-response-error-messages';
import { UserPreferenceResponseDTO } from '../user-preferences';
import { UserPreferenceRepository } from '../user-preferences/user-preferences.repository';
import { UserRepository } from '../users/user.repository';
import { recommendPreferences } from '../user-preferences/user-preferences.recommendation';
import { toUserPreferenceResponseDTO } from '../user-preferences/user-preferences.mapper';

export interface SubmitOnboardingResponseResultDTO {
  onboarding: OnboardingResponseDTO;
  preferences: UserPreferenceResponseDTO;
  onboardingCompleted: true;
}

export class OnboardingResponseService {
  constructor(
    private readonly onboardingResponseRepository: OnboardingResponsesRepository,
    private readonly prisma: PrismaClient,
  ) {}

  // get onboarding responses answers -> if null than not onboarded yet
  async getMyOnboardingResponse(userId: string): Promise<OnboardingResponseDTO | null> {
    const onboardingResponseExist = await this.onboardingResponseRepository.findByUserId(userId);

    return onboardingResponseExist ? toOnboardingResponseDTO(onboardingResponseExist) : null;
  }

  //save onboarding answers (create if not exists, update if exists)
  async saveMyOnboardingResponse(userId: string, data: OnboardingResponseInput): Promise<OnboardingResponseDTO> {
    try {
      const onboardingResponse = await this.onboardingResponseRepository.upsertByUserId(userId, data);

      return toOnboardingResponseDTO(onboardingResponse);
    } catch (error) {
      // The token was valid, but the account was deleted before we saved (foreign key failed)
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new ApiError(StatusCodes.UNAUTHORIZED, USER.UNAUTHORIZED);
      }

      throw error;
    }
  }

  // 1. finished setup your onboarding answers
  // 2. calculate and save preference
  // 3. mark user -> onboardingCompleted -> true
  // all three step should be successful or rollback if fail
  async submitMyOnboarding(userId: string, data: OnboardingResponseInput): Promise<SubmitOnboardingResponseResultDTO> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const onboardingRepository = new OnboardingResponsesRepository(tx);
        const preferenceRepository = new UserPreferenceRepository(tx);
        const userRepository = new UserRepository(tx);

        // 1. save user onboarding response answer
        const onboardingResponse = await onboardingRepository.upsertByUserId(userId, data);

        // 2. calculate preference from the those answers
        const recommendedPreferences = recommendPreferences(onboardingResponse);

        // 3. save preferences after calculating
        const preferences = await preferenceRepository.upsertByUserId(userId, {
          ...recommendedPreferences,
          source: UserPreferenceSource.RECOMMENDED,
        });

        // 4. mark user -> onboardingCompleted -> true
        await userRepository.markOnboardingCompleted(userId);

        return {
          onboarding: toOnboardingResponseDTO(onboardingResponse),
          preferences: toUserPreferenceResponseDTO(preferences),
          onboardingCompleted: true,
        };
      });
    } catch (error) {
      // the account was deleted while the token was still valid
      if (error instanceof Prisma.PrismaClientKnownRequestError && (error.code === 'P2003' || error.code === 'P2025')) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, USER.UNAUTHORIZED);
      }

      throw error;
    }
  }
}
