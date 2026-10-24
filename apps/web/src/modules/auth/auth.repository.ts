import { PrismaClient } from '@/generated/prisma';
import { CreateRefreshTokenInputDTO } from './dto/auth.dto';

export class AuthRepository {
  constructor(private readonly prisma: PrismaClient) {}

  // create refresh token
  async createRefreshToken(data: CreateRefreshTokenInputDTO) {
    return this.prisma.refreshToken.create({ data });
  }

  // find refresh token by hash
  async findRefreshTokenByHash(tokenHash: string) {
    return this.prisma.refreshToken.findUnique({ where: { tokenHash } });
  }

  // revoke refresh token
  async revokeRefreshToken(id: string): Promise<boolean> {
    const result = await this.prisma.refreshToken.updateMany({ where: { id, revokedAt: null }, data: { revokedAt: new Date() } });

    return result.count === 1;
  }

  // revoke all user tokens
  async revokeAllUserTokens(userId: string) {
    return this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
