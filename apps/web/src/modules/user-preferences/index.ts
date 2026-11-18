import { prisma } from '@/server/db/prisma';
import { UserPreferenceRepository } from './user-preferences.repository';
import { UserPreferenceService } from './user-preferences.service';

const preferenceRepository = new UserPreferenceRepository(prisma);

const preferenceService = new UserPreferenceService(preferenceRepository);

export { preferenceService };

export * from './dto/user-preferences.dto';
