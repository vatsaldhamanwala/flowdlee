import { USER } from '@/constants/api-response-error-messages';
import { prisma } from '@/server/db/prisma';
import { ApiError } from 'next/dist/server/api-utils';
import { updateUserProfileInput } from './validators/user.schema';

export async function findUserById(userId: string) {
  const userExist = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!userExist) throw new ApiError(404, USER.NOT_FOUND);

  return userExist;
}

export async function findUserByEmail(email: string) {
  const userExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!userExist) throw new ApiError(404, USER.NOT_FOUND);

  return userExist;
}

export async function updateProfile(userId: string, data: updateUserProfileInput) {
  const userExist = await findUserById(userId);

  if (!userExist) throw new ApiError(404, USER.NOT_FOUND);

  const updatedUserData = await prisma.user.update({
    where: {
      id: userId,
    },
    data,
  });

  return {
    id: updatedUserData.id,
    name: updatedUserData.name,
    email: updatedUserData.email,
    avatarUrl: updatedUserData.avatarUrl,
    onboardingCompleted: updatedUserData.onboardingCompleted,
    updatedAt: updatedUserData.updatedAt,
  };
}
