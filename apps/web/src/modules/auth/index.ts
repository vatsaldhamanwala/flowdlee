import { prisma } from '@/server/db/prisma';
import { UserRepository } from '../users/user.repository';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';

const userRepository = new UserRepository(prisma);
const authRepository = new AuthRepository(prisma);

const authService = new AuthService(userRepository, authRepository);

export { authService };

export * from './validators/auth.schema';
