import { PrismaClient, VideoShareEvent } from "@prisma/client";
import { VideoShareRepository } from "../repositories/videoShareRepository";

export class VideoShareService {
  private prisma: PrismaClient;
  private repository: VideoShareRepository;

  constructor(prisma: PrismaClient, repository: VideoShareRepository) {
    this.prisma = prisma;
    this.repository = repository;
  }

  async shareVideo(params: {
    videoId: number;
    userId: number;
    channel?: string;
  }): Promise<VideoShareEvent> {
    const video = await this.prisma.video.findUnique({
      where: { id: params.videoId },
      select: { id: true },
    });
    if (!video) {
      throw new Error("Video not found");
    }

    const channel = params.channel?.trim();

    return await this.repository.create({
      videoId: params.videoId,
      userId: params.userId,
      channel: channel || null,
    });
  }

  async countShares(videoId?: number): Promise<number> {
    return await this.prisma.videoShareEvent.count({
      where: videoId ? { videoId } : undefined,
    });
  }
}
