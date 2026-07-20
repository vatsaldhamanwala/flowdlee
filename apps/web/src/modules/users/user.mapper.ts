import { User } from '@/generated/prisma';
import { UserRegisterDTO } from './dto/user.dto';

export function toUserResponseDTO(user: User): UserRegisterDTO {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl || undefined,
    onboardingCompleted: user.onboardingCompleted,
    createdAt: user.createdAt,
  };
}
