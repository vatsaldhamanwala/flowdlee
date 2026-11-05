import { prisma } from '@/server/db/prisma';
import { OnboardingResponsesRepository } from './onboarding-responses.repository';
import { OnboardingResponseService } from './onboarding-responses.service';

const onboardingRepository = new OnboardingResponsesRepository(prisma);

const onboardingService = new OnboardingResponseService(onboardingRepository);

export { onboardingService };

export * from './validators/onboarding-responses.schema';
export * from './dto/onboarding-responses.dto';
