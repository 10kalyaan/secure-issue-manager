import { PrismaClient } from "@prisma/client";

export class PrismaClientProvider {
  private static prisma: PrismaClient | null = null;

  public static getClient(): PrismaClient {
    if (!PrismaClientProvider.prisma) {
      PrismaClientProvider.prisma = new PrismaClient();
    }
    return PrismaClientProvider.prisma;
  }
}
