import { PrismaClient } from '@/generated/prisma';
import { UpdateUserPreferenceInputDTO, UpsertUserPreferenceInputDTO } from './dto/user-preferences.dto';

export class UserPreferenceRepository {
  constructor(private readonly prisma: PrismaClient) {}

  // find user preference -> null if user have not onboarded yet
  async findUserById(userId: string) {
    return this.prisma.userPreference.findUnique({ where: { userId } });
  }

  // create if not and update if already exist
  async upsertByUserId(userId: string, data: UpsertUserPreferenceInputDTO) {
    return this.prisma.userPreference.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
  }

  // update preference only some fields
  async updateByUserId(userId: string, data: UpdateUserPreferenceInputDTO & { source: 'USER' }) {
    return this.prisma.userPreference.update({
      where: { userId },
      data,
    });
  }
}
