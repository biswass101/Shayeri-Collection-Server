import { Express, Request, Response } from "express";
import { CommentController } from "../controllers/commentController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { AuthService } from "../services/authService";

export function commentRoutes(
  app: Express,
  controller: CommentController,
  authService: AuthService
) {
  const authenticate = authMiddleware(authService);

  /**
   * @swagger
   * /api/videos/{id}/comments:
   *   get:
   *     summary: Get comments for a video
   *     description: Retrieve comments for a video (Public)
   *     tags:
   *       - Comments
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Comments retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CommentsListResponse'
   */
  app.get("/api/videos/:id/comments", (req: Request, res: Response) =>
    controller.listComments(req, res)
  );

  /**
   * @swagger
   * /api/videos/{id}/comments:
   *   post:
   *     summary: Add a comment to a video
   *     description: Add a comment to a video (Authenticated users)
   *     tags:
   *       - Comments
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
   *             $ref: '#/components/schemas/CommentCreateRequest'
   *     responses:
   *       201:
   *         description: Comment created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CommentResponse'
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
    "/api/videos/:id/comments",
    authenticate,
    (req: Request, res: Response) => controller.createComment(req, res)
  );

  /**
   * @swagger
   * /api/comments/{id}:
   *   put:
   *     summary: Update a comment
   *     description: Update a comment (Owner or Admin)
   *     tags:
   *       - Comments
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
   *             $ref: '#/components/schemas/CommentUpdateRequest'
   *     responses:
   *       200:
   *         description: Comment updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CommentResponse'
   *       400:
   *         description: Invalid input
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Comment not found
   */
  app.put(
    "/api/comments/:id",
    authenticate,
    (req: Request, res: Response) => controller.updateComment(req, res)
  );

  /**
   * @swagger
   * /api/comments/{id}:
   *   delete:
   *     summary: Delete a comment
   *     description: Delete a comment (Owner or Admin)
   *     tags:
   *       - Comments
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
   *         description: Comment deleted successfully
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
   *                   $ref: '#/components/schemas/Comment'
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Comment not found
   */
  app.delete(
    "/api/comments/:id",
    authenticate,
    (req: Request, res: Response) => controller.deleteComment(req, res)
  );
}
