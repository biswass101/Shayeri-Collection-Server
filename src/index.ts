import express, { Express, Request, Response } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { swaggerSpec } from "./swagger";
import { UserRepository } from "./repositories/userRepository";
import { UserService } from "./services/userService";
import { UserController } from "./controllers/userController";
import { CategoryRepository } from "./repositories/categoryRepository";
import { CategoryService } from "./services/categoryService";
import { CategoryController } from "./controllers/categoryController";
import { VideoRepository } from "./repositories/videoRepository";
import { VideoService } from "./services/videoService";
import { VideoController } from "./controllers/videoController";
import { VideoTextSectionRepository } from "./repositories/videoTextSectionRepository";
import { VideoTextSectionService } from "./services/videoTextSectionService";
import { VideoTextSectionController } from "./controllers/videoTextSectionController";
import { VideoLikeRepository } from "./repositories/videoLikeRepository";
import { VideoLikeService } from "./services/videoLikeService";
import { VideoLikeController } from "./controllers/videoLikeController";
import { CommentRepository } from "./repositories/commentRepository";
import { CommentService } from "./services/commentService";
import { CommentController } from "./controllers/commentController";
import { VideoShareRepository } from "./repositories/videoShareRepository";
import { VideoShareService } from "./services/videoShareService";
import { VideoShareController } from "./controllers/videoShareController";
import { VideoDownloadRepository } from "./repositories/videoDownloadRepository";
import { VideoDownloadService } from "./services/videoDownloadService";
import { VideoDownloadController } from "./controllers/videoDownloadController";
import { NotificationRepository } from "./repositories/notificationRepository";
import { NotificationService } from "./services/notificationService";
import { NotificationController } from "./controllers/notificationController";
import { AdminDashboardService } from "./services/adminDashboardService";
import { AdminDashboardController } from "./controllers/adminDashboardController";
import { AuthService } from "./services/authService";
import { AuthController } from "./controllers/authController";
import { userRoutes } from "./routes/userRoutes";
import { authRoutes } from "./routes/authRoutes";
import { categoryRoutes } from "./routes/categoryRoutes";
import { videoRoutes } from "./routes/videoRoutes";
import { videoTextSectionRoutes } from "./routes/videoTextSectionRoutes";
import { videoLikeRoutes } from "./routes/videoLikeRoutes";
import { commentRoutes } from "./routes/commentRoutes";
import { videoShareRoutes } from "./routes/videoShareRoutes";
import { videoDownloadRoutes } from "./routes/videoDownloadRoutes";
import { notificationRoutes } from "./routes/notificationRoutes";
import { adminDashboardRoutes } from "./routes/adminDashboardRoutes";

dotenv.config();

const app: Express = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

// Initialize repository, service, and controller
const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);
const userController = new UserController(userService);
const categoryRepository = new CategoryRepository(prisma);
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);
const videoRepository = new VideoRepository(prisma);
const videoService = new VideoService(prisma, videoRepository);
const videoController = new VideoController(videoService);
const videoTextSectionRepository = new VideoTextSectionRepository(prisma);
const videoTextSectionService = new VideoTextSectionService(prisma, videoTextSectionRepository);
const videoTextSectionController = new VideoTextSectionController(videoTextSectionService);
const videoLikeRepository = new VideoLikeRepository(prisma);
const videoLikeService = new VideoLikeService(prisma, videoLikeRepository);
const videoLikeController = new VideoLikeController(videoLikeService);
const commentRepository = new CommentRepository(prisma);
const commentService = new CommentService(prisma, commentRepository);
const commentController = new CommentController(commentService);
const videoShareRepository = new VideoShareRepository(prisma);
const videoShareService = new VideoShareService(prisma, videoShareRepository);
const videoShareController = new VideoShareController(videoShareService);
const videoDownloadRepository = new VideoDownloadRepository(prisma);
const videoDownloadService = new VideoDownloadService(prisma, videoDownloadRepository);
const videoDownloadController = new VideoDownloadController(videoDownloadService);
const notificationRepository = new NotificationRepository(prisma);
const notificationService = new NotificationService(notificationRepository);
const notificationController = new NotificationController(notificationService);
const adminDashboardService = new AdminDashboardService(prisma);
const adminDashboardController = new AdminDashboardController(adminDashboardService);
const authService = new AuthService(prisma);
const authController = new AuthController(authService);

// Middleware
app.use(cors());
app.use(express.json());

// Swagger UI
app.use("/api-docs", swaggerUi.serve);
app.get("/api-docs", swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    url: "/api-docs/swagger.json",
  },
}));

// Swagger JSON endpoint
app.get("/api-docs/swagger.json", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "Server is running" });
});

// Auth routes (public)
authRoutes(app, authController);

// User routes (protected)
userRoutes(app, userController, authService);

// Category routes (public + admin)
categoryRoutes(app, categoryController, authService);

// Video routes (public + admin)
videoRoutes(app, videoController, authService);

// Video text sections (admin)
videoTextSectionRoutes(app, videoTextSectionController, authService);

// Video likes (auth users)
videoLikeRoutes(app, videoLikeController, authService);

// Comments (public + auth)
commentRoutes(app, commentController, authService);

// Share (auth)
videoShareRoutes(app, videoShareController, authService);

// Download (auth)
videoDownloadRoutes(app, videoDownloadController, authService);

// Notifications (auth)
notificationRoutes(app, notificationController, authService);

// Admin dashboard (admin only)
adminDashboardRoutes(app, adminDashboardController, authService);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`📚 Swagger UI available at http://localhost:${PORT}/api-docs`);
  console.log(`📊 Database connected via Prisma`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
