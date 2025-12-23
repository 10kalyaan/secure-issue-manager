import { PrismaClient, RefreshToken } from "@prisma/client";
import { PrismaClientProvider } from "../db/PrismaClientProvider";

export class RefreshTokenRepository {
  private db: PrismaClient;

  constructor() {
    this.db = PrismaClientProvider.getClient();
  }

  async create(userId: string, tokenHash: string, expiresAt: Date): Promise<RefreshToken> {
    return this.db.refreshToken.create({ data: { userId, tokenHash, expiresAt } });
  }

  async deleteAllForUser(userId: string): Promise<void> {
    await this.db.refreshToken.deleteMany({ where: { userId } });
  }

  async findByUser(userId: string): Promise<RefreshToken[]> {
    return this.db.refreshToken.findMany({ where: { userId } });
  }
}
