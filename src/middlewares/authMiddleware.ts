import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: string;
      };
    }
  }
}

export function authMiddleware(authService: AuthService) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Get token from Authorization header
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "No token provided" });
        return;
      }

      const token = authHeader.substring(7); // Remove "Bearer " prefix

      // Verify token
      const decoded = authService.verifyToken(token);
      req.user = decoded;

      next();
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  };
}
