import { Express, Request, Response } from "express";
import { CategoryController } from "../controllers/categoryController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { AuthService } from "../services/authService";

export function categoryRoutes(
  app: Express,
  categoryController: CategoryController,
  authService: AuthService
) {
  const authenticate = authMiddleware(authService);

  /**
   * @swagger
   * /api/categories:
   *   get:
   *     summary: Get all categories
   *     description: Retrieve list of all categories (Public)
   *     tags:
   *       - Categories
   *     responses:
   *       200:
   *         description: List of categories retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CategoriesListResponse'
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  app.get("/api/categories", (req: Request, res: Response) =>
    categoryController.listCategories(req, res)
  );

  /**
   * @swagger
   * /api/categories:
   *   post:
   *     summary: Create a new category
   *     description: Create a new category (Admin only)
   *     tags:
   *       - Categories
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CategoryCreateRequest'
   *     responses:
   *       201:
   *         description: Category created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CategoryResponse'
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
    "/api/categories",
    authenticate,
    roleMiddleware(["admin"]),
    (req: Request, res: Response) => categoryController.createCategory(req, res)
  );

  /**
   * @swagger
   * /api/categories/{id}:
   *   put:
   *     summary: Update a category
   *     description: Update a category by ID (Admin only)
   *     tags:
   *       - Categories
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Category ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CategoryUpdateRequest'
   *     responses:
   *       200:
   *         description: Category updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CategoryResponse'
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
   *         description: Category not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  app.put(
    "/api/categories/:id",
    authenticate,
    roleMiddleware(["admin"]),
    (req: Request, res: Response) => categoryController.updateCategory(req, res)
  );

  /**
   * @swagger
   * /api/categories/{id}:
   *   delete:
   *     summary: Delete a category
   *     description: Delete a category by ID (Admin only)
   *     tags:
   *       - Categories
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Category ID
   *     responses:
   *       200:
   *         description: Category deleted successfully
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
   *                   $ref: '#/components/schemas/Category'
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
   *         description: Category not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  app.delete(
    "/api/categories/:id",
    authenticate,
    roleMiddleware(["admin"]),
    (req: Request, res: Response) => categoryController.deleteCategory(req, res)
  );
}
