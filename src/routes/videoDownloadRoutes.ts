import { Express, Request, Response } from "express";
import { VideoDownloadController } from "../controllers/videoDownloadController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { AuthService } from "../services/authService";

export function videoDownloadRoutes(
  app: Express,
  controller: VideoDownloadController,
  authService: AuthService
) {
  const authenticate = authMiddleware(authService);

  /**
   * @swagger
   * /api/videos/{id}/download:
   *   get:
   *     summary: Download a video
   *     description: Track download event and return download URL (Authenticated users)
   *     tags:
   *       - Download
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
   *         description: Download URL returned
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/VideoDownloadResponse'
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Video not found
   */
  app.get(
    "/api/videos/:id/download",
    authenticate,
    (req: Request, res: Response) => controller.downloadVideo(req, res)
  );
}
