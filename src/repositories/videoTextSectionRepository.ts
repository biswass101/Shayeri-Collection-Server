import { PrismaClient, VideoTextSection } from "@prisma/client";

export class VideoTextSectionRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findById(id: number): Promise<VideoTextSection | null> {
    return await this.prisma.videoTextSection.findUnique({
      where: { id },
    });
  }

  async create(data: {
    videoId: number;
    position: number;
    heading?: string | null;
    body: string;
  }): Promise<VideoTextSection> {
    return await this.prisma.videoTextSection.create({
      data: {
        videoId: data.videoId,
        position: data.position,
        heading: data.heading ?? null,
        body: data.body,
      },
    });
  }

  async update(
    id: number,
    data: { position?: number; heading?: string | null; body?: string }
  ): Promise<VideoTextSection> {
    return await this.prisma.videoTextSection.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<VideoTextSection> {
    return await this.prisma.videoTextSection.delete({
      where: { id },
    });
  }
}
