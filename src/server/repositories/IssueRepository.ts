import { Issue, IssueType, PrismaClient } from "@prisma/client";
import { PrismaClientProvider } from "../db/PrismaClientProvider";

export class IssueRepository {
  private db: PrismaClient;

  constructor() {
    this.db = PrismaClientProvider.getClient();
  }

  async listByUser(userId: string, type?: IssueType): Promise<Issue[]> {
    return this.db.issue.findMany({
      where: { userId, ...(type ? { type } : {}) },
      orderBy: { createdAt: "desc" },
    });
  }

  async findByIdForUser(id: string, userId: string): Promise<Issue | null> {
    return this.db.issue.findFirst({ where: { id, userId } });
  }

  async create(userId: string, data: {
    type: IssueType;
    title: string;
    description: string;
    priority?: any;
    status?: any;
  }): Promise<Issue> {
    return this.db.issue.create({ data: { userId, ...data } });
  }

  async updateForUser(id: string, userId: string, data: Partial<Issue>): Promise<Issue> {
    // secure update: ensure the issue belongs to the user first
    await this.db.issue.findFirstOrThrow({ where: { id, userId } });
    return this.db.issue.update({ where: { id }, data });
  }

  async deleteForUser(id: string, userId: string): Promise<void> {
    await this.db.issue.findFirstOrThrow({ where: { id, userId } });
    await this.db.issue.delete({ where: { id } });
  }
}
