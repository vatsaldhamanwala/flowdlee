import { UpsertOnboardingResponseInputDTO } from './dto/onboarding-responses.dto';
import { DbClient } from '@/server/db/prisma';

export class OnboardingResponsesRepository {
  constructor(private readonly prisma: DbClient) {}

  // find the user's answers (null if they haven't onboarded yet)
  async findByUserId(userId: string) {
    return this.prisma.onboardingResponse.findUnique({ where: { userId } });
  }

  // create the answers the first time -> update them every time after
  async upsertByUserId(userId: string, data: UpsertOnboardingResponseInputDTO) {
    return this.prisma.onboardingResponse.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
  }
}
