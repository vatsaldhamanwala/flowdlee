import { Prisma, PrismaClient } from '@/generated/prisma';

export class UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  // create new user
  async createUser(data: Prisma.UserCreateInput) {
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
  async updateUser(id: string, data: Prisma.UserUpdateInput) {
    return await this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }
}
