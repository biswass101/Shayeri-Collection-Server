import { PrismaClient, VideoLike } from "@prisma/client";

export class VideoLikeRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findByUserAndVideo(userId: number, videoId: number): Promise<VideoLike | null> {
    return await this.prisma.videoLike.findUnique({
      where: {
        videoId_userId: { videoId, userId },
      },
    });
  }

  async create(userId: number, videoId: number): Promise<VideoLike> {
    return await this.prisma.videoLike.create({
      data: { userId, videoId },
    });
  }

  async delete(userId: number, videoId: number): Promise<VideoLike> {
    return await this.prisma.videoLike.delete({
      where: {
        videoId_userId: { videoId, userId },
      },
    });
  }

  async isLiked(userId: number, videoId: number): Promise<boolean> {
    const like = await this.findByUserAndVideo(userId, videoId);
    return Boolean(like);
  }
}
