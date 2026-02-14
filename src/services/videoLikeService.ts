import { PrismaClient, VideoLike } from "@prisma/client";
import { VideoLikeRepository } from "../repositories/videoLikeRepository";

export class VideoLikeService {
  private prisma: PrismaClient;
  private repository: VideoLikeRepository;

  constructor(prisma: PrismaClient, repository: VideoLikeRepository) {
    this.prisma = prisma;
    this.repository = repository;
  }

  async likeVideo(videoId: number, userId: number): Promise<VideoLike> {
    const video = await this.prisma.video.findUnique({
      where: { id: videoId },
      select: { id: true },
    });
    if (!video) {
      throw new Error("Video not found");
    }

    const existing = await this.repository.findByUserAndVideo(userId, videoId);
    if (existing) {
      throw new Error("Video already liked");
    }

    return await this.repository.create(userId, videoId);
  }

  async unlikeVideo(videoId: number, userId: number): Promise<VideoLike> {
    const existing = await this.repository.findByUserAndVideo(userId, videoId);
    if (!existing) {
      throw new Error("Like not found");
    }

    return await this.repository.delete(userId, videoId);
  }

  async isLiked(videoId: number, userId: number): Promise<boolean> {
    const video = await this.prisma.video.findUnique({
      where: { id: videoId },
      select: { id: true },
    });
    if (!video) {
      throw new Error("Video not found");
    }

    return await this.repository.isLiked(userId, videoId);
  }
}
