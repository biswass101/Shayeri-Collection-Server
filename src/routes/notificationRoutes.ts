import { Express, Request, Response } from "express";
import { NotificationController } from "../controllers/notificationController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { AuthService } from "../services/authService";

export function notificationRoutes(
  app: Express,
  controller: NotificationController,
  authService: AuthService
) {
  const authenticate = authMiddleware(authService);

  /**
   * @swagger
   * /api/notifications:
   *   get:
   *     summary: Get notifications
   *     description: List notifications for the authenticated user
   *     tags:
   *       - Notifications
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Notifications retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/NotificationsListResponse'
   *       401:
   *         description: Unauthorized
   */
  app.get(
    "/api/notifications",
    authenticate,
    (req: Request, res: Response) => controller.listNotifications(req, res)
  );

  /**
   * @swagger
   * /api/notifications/{id}/read:
   *   put:
   *     summary: Mark notification as read
   *     description: Mark a notification as read for the authenticated user
   *     tags:
   *       - Notifications
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Notification marked as read
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/NotificationResponse'
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Notification not found
   */
  app.put(
    "/api/notifications/:id/read",
    authenticate,
    (req: Request, res: Response) => controller.markRead(req, res)
  );
}
