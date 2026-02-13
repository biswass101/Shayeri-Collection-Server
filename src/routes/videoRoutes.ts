import { Express, Request, Response } from "express";
import multer from "multer";
import { VideoController } from "../controllers/videoController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { AuthService } from "../services/authService";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 200 * 1024 * 1024 },
});

export function videoRoutes(
  app: Express,
  videoController: VideoController,
  authService: AuthService
) {
  const authenticate = authMiddleware(authService);

  /**
   * @swagger
   * /api/videos:
   *   get:
   *     summary: Get all videos
   *     description: Retrieve list of published videos (Public)
   *     tags:
   *       - Videos
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *       - in: query
   *         name: categoryId
   *         schema:
   *           type: integer
   *       - in: query
   *         name: categorySlug
   *         schema:
   *           type: string
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: List of videos retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/VideosListResponse'
   */
  app.get("/api/videos", (req: Request, res: Response) =>
    videoController.listVideos(req, res)
  );

  /**
   * @swagger
   * /api/videos/{id}:
   *   get:
   *     summary: Get video by ID
   *     description: Retrieve video details by ID (Public)
   *     tags:
   *       - Videos
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Video retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/VideoResponse'
   *       404:
   *         description: Video not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  app.get("/api/videos/:id", (req: Request, res: Response) =>
    videoController.getVideoById(req, res)
  );

  /**
   * @swagger
   * /api/videos:
   *   post:
   *     summary: Create a new video
   *     description: Upload video and create metadata (Admin only)
   *     tags:
   *       - Videos
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             $ref: '#/components/schemas/VideoCreateRequest'
   *     responses:
   *       201:
   *         description: Video created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/VideoResponse'
   *       400:
   *         description: Invalid input
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       403:
   *         description: Forbidden - Admin access required
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  app.post(
    "/api/videos",
    authenticate,
    roleMiddleware(["admin"]),
    upload.fields([
      { name: "video", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
    ]),
    (req: Request, res: Response) => videoController.createVideo(req, res)
  );

  /**
   * @swagger
   * /api/videos/{id}:
   *   put:
   *     summary: Update a video
   *     description: Update video metadata or media (Admin only)
   *     tags:
   *       - Videos
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
   *         multipart/form-data:
   *           schema:
   *             $ref: '#/components/schemas/VideoUpdateRequest'
   *     responses:
   *       200:
   *         description: Video updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/VideoResponse'
   *       400:
   *         description: Invalid input
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       403:
   *         description: Forbidden - Admin access required
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       404:
   *         description: Video not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  app.put(
    "/api/videos/:id",
    authenticate,
    roleMiddleware(["admin"]),
    upload.fields([
      { name: "video", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
    ]),
    (req: Request, res: Response) => videoController.updateVideo(req, res)
  );

  /**
   * @swagger
   * /api/videos/{id}:
   *   delete:
   *     summary: Delete a video
   *     description: Delete a video by ID (Admin only)
   *     tags:
   *       - Videos
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
   *         description: Video deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 data:
   *                   $ref: '#/components/schemas/Video'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       403:
   *         description: Forbidden - Admin access required
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       404:
   *         description: Video not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  app.delete(
    "/api/videos/:id",
    authenticate,
    roleMiddleware(["admin"]),
    (req: Request, res: Response) => videoController.deleteVideo(req, res)
  );
}
