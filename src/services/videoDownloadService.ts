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

  async countDownloads(videoId?: number): Promise<number> {
    return await this.prisma.videoDownloadEvent.count({
      where: videoId ? { videoId } : undefined,
    });
  }

  async listUserDownloads(userId: number): Promise<
    Array<{
      id: number;
      downloadedAt: Date;
      video: {
        id: number;
        title: string;
        description: string | null;
        thumbnailUrl: string | null;
      };
    }>
  > {
    const rows = await this.prisma.videoDownloadEvent.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      distinct: ["videoId"],
      include: {
        video: {
          select: {
            id: true,
            title: true,
            description: true,
            thumbnailUrl: true,
          },
        },
      },
    });

    return rows.map((row) => ({
      id: row.id,
      downloadedAt: row.createdAt,
      video: row.video,
    }));
  }
}
