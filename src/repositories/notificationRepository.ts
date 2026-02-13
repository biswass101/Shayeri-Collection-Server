import { PrismaClient, Notification } from "@prisma/client";

export class NotificationRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findByUser(userId: number): Promise<Notification[]> {
    return await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: number): Promise<Notification | null> {
    return await this.prisma.notification.findUnique({
      where: { id },
    });
  }

  async markRead(id: number): Promise<Notification> {
    return await this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }
}
