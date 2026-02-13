import { Notification } from "@prisma/client";
import { NotificationRepository } from "../repositories/notificationRepository";

export class NotificationService {
  private repository: NotificationRepository;

  constructor(repository: NotificationRepository) {
    this.repository = repository;
  }

  async listNotifications(userId: number): Promise<Notification[]> {
    return await this.repository.findByUser(userId);
  }

  async markRead(notificationId: number, userId: number): Promise<Notification> {
    const existing = await this.repository.findById(notificationId);
    if (!existing || existing.userId !== userId) {
      throw new Error("Notification not found");
    }

    if (existing.isRead) {
      return existing;
    }

    return await this.repository.markRead(notificationId);
  }
}
