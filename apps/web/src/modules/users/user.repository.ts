import { CreateUserInputDTO, UpdateUserInputDTO } from './dto/user.dto';
import { DbClient } from '@/server/db/prisma';

export class UserRepository {
  constructor(private readonly prisma: DbClient) {}

  // create new user
  async createUser(data: CreateUserInputDTO) {
    return await this.prisma.user.create({
      data,
    });
  }

  // find user by email
  async findUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  // find user by id
  async findUserById(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  //update user
  async updateUser(id: string, data: UpdateUserInputDTO) {
    return await this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  // mark onboarding response as -> true
  async markOnboardingCompleted(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { onboardingCompleted: true },
    });
  }
}
