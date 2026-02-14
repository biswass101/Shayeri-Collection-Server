import { PrismaClient, Comment } from "@prisma/client";

export class CommentRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findById(id: number): Promise<Comment | null> {
    return await this.prisma.comment.findUnique({
      where: { id },
    });
  }

  async findByVideo(videoId: number): Promise<Comment[]> {
    return await this.prisma.comment.findMany({
      where: { videoId, isDeleted: false, parentId: null },
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        replies: {
          where: { isDeleted: false },
          orderBy: { createdAt: "asc" },
          include: { user: true },
        },
      },
    });
  }

  async create(data: {
    videoId: number;
    userId: number;
    body: string;
    parentId?: number | null;
  }): Promise<Comment> {
    return await this.prisma.comment.create({
      data: {
        videoId: data.videoId,
        userId: data.userId,
        body: data.body,
        parentId: data.parentId ?? null,
      },
      include: {
        user: true,
        replies: {
          where: { isDeleted: false },
          orderBy: { createdAt: "asc" },
          include: { user: true },
        },
      },
    });
  }

  async update(id: number, data: { body?: string; isDeleted?: boolean }): Promise<Comment> {
    return await this.prisma.comment.update({
      where: { id },
      data,
      include: {
        user: true,
      },
    });
  }
}
