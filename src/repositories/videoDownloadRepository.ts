import { PrismaClient, VideoDownloadEvent } from "@prisma/client";

export class VideoDownloadRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(data: { videoId: number; userId: number }): Promise<VideoDownloadEvent> {
    return await this.prisma.videoDownloadEvent.create({
      data: {
        videoId: data.videoId,
        userId: data.userId,
      },
    });
  }
}
