import { Express, Request, Response } from "express";
import { AdminDashboardController } from "../controllers/adminDashboardController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { AuthService } from "../services/authService";

export function adminDashboardRoutes(
  app: Express,
  controller: AdminDashboardController,
  authService: AuthService
) {
  const authenticate = authMiddleware(authService);

  /**
   * @swagger
   * /api/admin/dashboard:
   *   get:
   *     summary: Admin dashboard summary
   *     description: Get totals and trend analytics for admin dashboard (Admin only)
   *     tags:
   *       - Admin
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: days
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Dashboard summary
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   */
  app.get(
    "/api/admin/dashboard",
    authenticate,
    roleMiddleware(["admin"]),
    (req: Request, res: Response) => controller.getDashboard(req, res)
  );
}
