import { PrismaClient, VideoShareEvent } from "@prisma/client";

export class VideoShareRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(data: {
    videoId: number;
    userId: number;
    channel?: string | null;
  }): Promise<VideoShareEvent> {
    return await this.prisma.videoShareEvent.create({
      data: {
        videoId: data.videoId,
        userId: data.userId,
        channel: data.channel ?? null,
      },
    });
  }
}
