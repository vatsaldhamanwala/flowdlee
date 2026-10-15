import { AuthProvider } from '@/generated/prisma';

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
