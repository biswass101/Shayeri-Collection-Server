import { PrismaClient, Comment } from "@prisma/client";
import { CommentRepository } from "../repositories/commentRepository";

export class CommentService {
  private prisma: PrismaClient;
  private repository: CommentRepository;

  constructor(prisma: PrismaClient, repository: CommentRepository) {
    this.prisma = prisma;
    this.repository = repository;
  }

  async listComments(videoId: number): Promise<Comment[]> {
    return await this.repository.findByVideo(videoId);
  }

  async createComment(videoId: number, userId: number, body: string): Promise<Comment> {
    const video = await this.prisma.video.findUnique({
      where: { id: videoId },
      select: { id: true },
    });
    if (!video) {
      throw new Error("Video not found");
    }

    const trimmed = body.trim();
    if (!trimmed) {
      throw new Error("Body is required");
    }

    return await this.repository.create({
      videoId,
      userId,
      body: trimmed,
    });
  }

  async updateComment(params: {
    commentId: number;
    userId: number;
    userRole: string;
    body: string;
  }): Promise<Comment> {
    const existing = await this.repository.findById(params.commentId);
    if (!existing || existing.isDeleted) {
      throw new Error("Comment not found");
    }

    if (existing.userId !== params.userId && params.userRole !== "admin") {
      throw new Error("Forbidden");
    }

    const trimmed = params.body.trim();
    if (!trimmed) {
      throw new Error("Body cannot be empty");
    }

    return await this.repository.update(params.commentId, { body: trimmed });
  }

  async deleteComment(params: {
    commentId: number;
    userId: number;
    userRole: string;
  }): Promise<Comment> {
    const existing = await this.repository.findById(params.commentId);
    if (!existing || existing.isDeleted) {
      throw new Error("Comment not found");
    }

    if (existing.userId !== params.userId && params.userRole !== "admin") {
      throw new Error("Forbidden");
    }

    return await this.repository.update(params.commentId, { isDeleted: true });
  }
}
