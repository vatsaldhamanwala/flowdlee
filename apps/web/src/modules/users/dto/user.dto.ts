import { AuthProvider } from '@/generated/prisma';

export interface CreateUserInputDTO {
  name: string;
  email: string;
  passwordHash: string;
}

export interface UpdateUserInputDTO {
  name?: string;
}

export interface UserResponseDTO {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  authProvider: AuthProvider;
  isEmailVerified: boolean;
  onboardingCompleted: boolean;
  createdAt: string;
}
