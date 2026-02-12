import express, { Express, Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { UserRepository } from "./repositories/userRepository";
import { UserService } from "./services/userService";
import { UserController } from "./controllers/userController";
import { AuthService } from "./services/authService";
import { AuthController } from "./controllers/authController";
import { userRoutes } from "./routes/userRoutes";
import { authRoutes } from "./routes/authRoutes";

dotenv.config();

const app: Express = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Initialize repository, service, and controller
const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);
const userController = new UserController(userService);
const authService = new AuthService(prisma);
const authController = new AuthController(authService);

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "Server is running" });
});

// Auth routes (public)
authRoutes(app, authController);

// User routes (protected)
userRoutes(app, userController, authService);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`📊 Database connected via Prisma`);
  console.log(`🔐 Authentication system initialized`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
