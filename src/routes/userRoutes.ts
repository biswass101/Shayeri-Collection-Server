import { Express, Request, Response } from "express";
import { UserController } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { AuthService } from "../services/authService";

export function userRoutes(
  app: Express,
  userController: UserController,
  authService: AuthService
) {
  // Apply auth middleware to all user routes
  const authenticate = authMiddleware(authService);

  // Create a new user (Admin only)
  app.post(
    "/api/users",
    authenticate,
    roleMiddleware(["admin"]),
    (req: Request, res: Response) => userController.createUser(req, res)
  );

  // Get all users (Admin only)
  app.get(
    "/api/users",
    authenticate,
    roleMiddleware(["admin"]),
    (req: Request, res: Response) => userController.getAllUsers(req, res)
  );

  // Get user by ID (Admin or own user)
  app.get("/api/users/:id", authenticate, (req: Request, res: Response) =>
    userController.getUserById(req, res)
  );

  // Update user (Admin or own user)
  app.put("/api/users/:id", authenticate, (req: Request, res: Response) =>
    userController.updateUser(req, res)
  );

  // Delete user (Admin only)
  app.delete(
    "/api/users/:id",
    authenticate,
    roleMiddleware(["admin"]),
    (req: Request, res: Response) => userController.deleteUser(req, res)
  );
}
