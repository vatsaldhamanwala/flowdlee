import { Prisma, UserPreferenceSource } from '@/generated/prisma';
import { UpdateUserPreferenceInputDTO, UpsertUserPreferenceInputDTO, UserPreferenceResponseDTO } from './dto/user-preferences.dto';
import { toUserPreferenceResponseDTO } from './user-preferences.mapper';
import { UserPreferenceRepository } from './user-preferences.repository';
import { ApiError } from '@/server/helpers/api-error';
import { StatusCodes } from 'http-status-codes';
import { USER, USER_PREFERENCES } from '@/constants/api-response-error-messages';

export class UserPreferenceService {
  constructor(private readonly userPreferenceRepository: UserPreferenceRepository) {}

  // get my user preference -> null if not onboarded yet
  async getMyPreferences(userId: string): Promise<UserPreferenceResponseDTO | null> {
    const myPreferenceExist = await this.userPreferenceRepository.findUserById(userId);

    return myPreferenceExist ? toUserPreferenceResponseDTO(myPreferenceExist) : null;
  }

  // save user preference recommended by user
  async saveRecommendedPreferences(userId: string, data: Omit<UpsertUserPreferenceInputDTO, 'source'>): Promise<UserPreferenceResponseDTO> {
    try {
      const isPreferencesSaved = await this.userPreferenceRepository.upsertByUserId(userId, {
        ...data,
        source: UserPreferenceSource.RECOMMENDED,
      });

      return toUserPreferenceResponseDTO(isPreferencesSaved);
    } catch (error) {
      // token was valid but the account was deleted before we saved
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new ApiError(StatusCodes.UNAUTHORIZED, USER.UNAUTHORIZED);
      }

      throw error;
    }
  }

  // update user preference
  async updateMyPreferences(userId: string, data: UpdateUserPreferenceInputDTO): Promise<UserPreferenceResponseDTO> {
    try {
      const myPreferenceExist = await this.userPreferenceRepository.updateByUserId(userId, {
        ...data,
        source: UserPreferenceSource.USER,
      });

      return toUserPreferenceResponseDTO(myPreferenceExist);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new ApiError(StatusCodes.NOT_FOUND, USER_PREFERENCES.NOT_FOUND);
      }

      throw error;
    }
  }
}
