import { Express, Request, Response } from "express";
import { VideoTextSectionController } from "../controllers/videoTextSectionController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { AuthService } from "../services/authService";

export function videoTextSectionRoutes(
  app: Express,
  controller: VideoTextSectionController,
  authService: AuthService
) {
  const authenticate = authMiddleware(authService);

  /**
   * @swagger
   * /api/videos/{id}/text-sections:
   *   post:
   *     summary: Add a text section to a video
   *     description: Add a text section to a video (Admin only)
   *     tags:
   *       - Video Text Sections
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/VideoTextSectionCreateRequest'
   *     responses:
   *       201:
   *         description: Text section created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/VideoTextSectionResponse'
   *       400:
   *         description: Invalid input
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - Admin access required
   *       404:
   *         description: Video not found
   */
  app.post(
    "/api/videos/:id/text-sections",
    authenticate,
    roleMiddleware(["admin"]),
    (req: Request, res: Response) => controller.createSection(req, res)
  );

  /**
   * @swagger
   * /api/videos/{id}/text-sections/{sectionId}:
   *   put:
   *     summary: Update a text section
   *     description: Update a text section (Admin only)
   *     tags:
   *       - Video Text Sections
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *       - in: path
   *         name: sectionId
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/VideoTextSectionUpdateRequest'
   *     responses:
   *       200:
   *         description: Text section updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/VideoTextSectionResponse'
   *       400:
   *         description: Invalid input
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - Admin access required
   *       404:
   *         description: Text section not found
   */
  app.put(
    "/api/videos/:id/text-sections/:sectionId",
    authenticate,
    roleMiddleware(["admin"]),
    (req: Request, res: Response) => controller.updateSection(req, res)
  );

  /**
   * @swagger
   * /api/videos/{id}/text-sections/{sectionId}:
   *   delete:
   *     summary: Delete a text section
   *     description: Delete a text section (Admin only)
   *     tags:
   *       - Video Text Sections
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *       - in: path
   *         name: sectionId
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Text section deleted successfully
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
   *                   $ref: '#/components/schemas/VideoTextSection'
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - Admin access required
   *       404:
   *         description: Text section not found
   */
  app.delete(
    "/api/videos/:id/text-sections/:sectionId",
    authenticate,
    roleMiddleware(["admin"]),
    (req: Request, res: Response) => controller.deleteSection(req, res)
  );
}
