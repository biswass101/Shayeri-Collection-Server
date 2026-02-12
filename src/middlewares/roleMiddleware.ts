import { Request, Response, NextFunction } from "express";

export function roleMiddleware(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      if (!allowedRoles.includes(req.user.role)) {
        res.status(403).json({
          error: "Access denied. Insufficient permissions.",
        });
        return;
      }

      next();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
