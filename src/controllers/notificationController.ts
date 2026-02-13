import { Request, Response } from "express";
import { NotificationService } from "../services/notificationService";

export class NotificationController {
  private service: NotificationService;

  constructor(service: NotificationService) {
    this.service = service;
  }

  async listNotifications(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const notifications = await this.service.listNotifications(userId);
      res.json({ success: true, data: notifications });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async markRead(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const notification = await this.service.markRead(Number(id), userId);
      res.json({ success: true, data: notification });
    } catch (error: any) {
      const message = error.message || "Server error";
      const status = message === "Notification not found" ? 404 : 400;
      res.status(status).json({ error: message });
    }
  }
}
