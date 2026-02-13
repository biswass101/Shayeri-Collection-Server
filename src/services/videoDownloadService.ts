import { PrismaClient, VideoDownloadEvent } from "@prisma/client";
import { VideoDownloadRepository } from "../repositories/videoDownloadRepository";

export class VideoDownloadService {
  private prisma: PrismaClient;
  private repository: VideoDownloadRepository;

  constructor(prisma: PrismaClient, repository: VideoDownloadRepository) {
    this.prisma = prisma;
    this.repository = repository;
  }

  async recordDownload(params: {
    videoId: number;
    userId: number;
  }): Promise<{ event: VideoDownloadEvent; videoUrl: string }> {
    const video = await this.prisma.video.findUnique({
      where: { id: params.videoId },
      select: { id: true, videoUrl: true, isPublished: true },
    });
    if (!video || !video.isPublished) {
      throw new Error("Video not found");
    }

    const event = await this.repository.create({
      videoId: params.videoId,
      userId: params.userId,
    });

    return { event, videoUrl: video.videoUrl };
  }
}
