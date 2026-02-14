import { Express, Request, Response } from "express";
import { VideoLikeController } from "../controllers/videoLikeController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { AuthService } from "../services/authService";

export function videoLikeRoutes(
  app: Express,
  controller: VideoLikeController,
  authService: AuthService
) {
  const authenticate = authMiddleware(authService);

  /**
   * @swagger
   * /api/videos/{id}/likes:
   *   post:
   *     summary: Like a video
   *     description: Like a video (Authenticated users)
   *     tags:
   *       - Likes
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Video ID
   *     responses:
   *       201:
   *         description: Video liked successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/VideoLikeResponse'
   *       400:
   *         description: Invalid input
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Video not found
   */
  app.post(
    "/api/videos/:id/likes",
    authenticate,
    (req: Request, res: Response) => controller.likeVideo(req, res)
  );

  /**
   * @swagger
   * /api/videos/{id}/likes:
   *   delete:
   *     summary: Unlike a video
   *     description: Remove like from a video (Authenticated users)
   *     tags:
   *       - Likes
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Video ID
   *     responses:
   *       200:
   *         description: Video unliked successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/VideoLikeResponse'
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Like not found
   */
  app.delete(
    "/api/videos/:id/likes",
    authenticate,
    (req: Request, res: Response) => controller.unlikeVideo(req, res)
  );

  /**
   * @swagger
   * /api/videos/{id}/likes/me:
   *   get:
   *     summary: Get like status for current user
   *     description: Check if the authenticated user liked the video
   *     tags:
   *       - Likes
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Video ID
   *     responses:
   *       200:
   *         description: Like status
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: object
   *                   properties:
   *                     liked:
   *                       type: boolean
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Video not found
   */
  app.get(
    "/api/videos/:id/likes/me",
    authenticate,
    (req: Request, res: Response) => controller.getLikeStatus(req, res)
  );
}
