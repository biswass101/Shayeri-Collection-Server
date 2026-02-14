import { Express, Request, Response } from "express";
import { VideoShareController } from "../controllers/videoShareController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { AuthService } from "../services/authService";

export function videoShareRoutes(
  app: Express,
  controller: VideoShareController,
  authService: AuthService
) {
  const authenticate = authMiddleware(authService);

  /**
   * @swagger
   * /api/shares/total:
   *   get:
   *     summary: Get total shares
   *     description: Retrieve total share count (optionally by videoId)
   *     tags:
   *       - Share
   *     parameters:
   *       - in: query
   *         name: videoId
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Total share count
   */
  app.get("/api/shares/total", (req: Request, res: Response) =>
    controller.getTotalShares(req, res)
  );

  /**
   * @swagger
   * /api/videos/{id}/share:
   *   post:
   *     summary: Share a video
   *     description: Track a share event for a video (Authenticated users)
   *     tags:
   *       - Share
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: false
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/VideoShareRequest'
   *     responses:
   *       201:
   *         description: Share event created
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/VideoShareResponse'
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Video not found
   */
  app.post(
    "/api/videos/:id/share",
    authenticate,
    (req: Request, res: Response) => controller.shareVideo(req, res)
  );
}
