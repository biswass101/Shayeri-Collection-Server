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
   * /api/downloads/total:
   *   get:
   *     summary: Get total downloads
   *     description: Retrieve total download count (optionally by videoId)
   *     tags:
   *       - Download
   *     parameters:
   *       - in: query
   *         name: videoId
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Total download count
   */
  app.get("/api/downloads/total", (req: Request, res: Response) =>
    controller.getTotalDownloads(req, res)
  );

  /**
   * @swagger
   * /api/downloads:
   *   get:
   *     summary: Get user downloads
   *     description: Retrieve the current user's downloaded videos (Authenticated users)
   *     tags:
   *       - Download
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of downloads
   *       401:
   *         description: Unauthorized
   */
  app.get("/api/downloads", authenticate, (req: Request, res: Response) =>
    controller.listUserDownloads(req, res)
  );

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
