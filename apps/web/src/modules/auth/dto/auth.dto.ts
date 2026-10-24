export interface CreateRefreshTokenInputDTO {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}
