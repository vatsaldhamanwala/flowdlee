import { prisma } from '@/server/db/prisma';
import { UserRepository } from '../users/user.repository';
import { AuthService } from './auth.service';

const userRepository = new UserRepository(prisma);

const authService = new AuthService(userRepository);

export { authService };

export * from './validators/auth.schema';
