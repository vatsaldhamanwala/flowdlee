import { PrismaClient } from '@/generated/prisma';
import { CreateUserInputDTO, UpdateUserInputDTO } from './dto/user.dto';

export class UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

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
}
