import { Express, Request, Response } from "express";
import { AuthController } from "../controllers/authController";

export function authRoutes(app: Express, authController: AuthController) {
  // Register new user
  app.post("/api/auth/register", (req: Request, res: Response) =>
    authController.register(req, res)
  );

  // Login user
  app.post("/api/auth/login", (req: Request, res: Response) =>
    authController.login(req, res)
  );
}
