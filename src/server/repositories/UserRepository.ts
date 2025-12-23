import { PrismaClient, User } from "@prisma/client";
import { PrismaClientProvider } from "../db/PrismaClientProvider";

export class UserRepository {
  private db: PrismaClient;

  constructor() {
    this.db = PrismaClientProvider.getClient();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { id } });
  }

  async create(data: { email: string; name?: string | null; passwordHash: string }): Promise<User> {
    return this.db.user.create({ data });
  }

  async updateProfile(userId: string, data: { name?: string | null }): Promise<User> {
    return this.db.user.update({ where: { id: userId }, data });
  }
}
