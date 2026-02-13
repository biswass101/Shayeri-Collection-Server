import { PrismaClient, VideoTextSection } from "@prisma/client";
import { VideoTextSectionRepository } from "../repositories/videoTextSectionRepository";

export class VideoTextSectionService {
  private prisma: PrismaClient;
  private repository: VideoTextSectionRepository;

  constructor(prisma: PrismaClient, repository: VideoTextSectionRepository) {
    this.prisma = prisma;
    this.repository = repository;
  }

  async createSection(params: {
    videoId: number;
    position?: number;
    heading?: string;
    body: string;
  }): Promise<VideoTextSection> {
    const video = await this.prisma.video.findUnique({
      where: { id: params.videoId },
      select: { id: true },
    });
    if (!video) {
      throw new Error("Video not found");
    }

    const body = params.body?.trim();
    if (!body) {
      throw new Error("Body is required");
    }

    const heading = params.heading?.trim() ?? null;

    const position = await this.resolvePosition(params.videoId, params.position);

    return await this.repository.create({
      videoId: params.videoId,
      position,
      heading,
      body,
    });
  }

  async updateSection(params: {
    videoId: number;
    sectionId: number;
    position?: number;
    heading?: string;
    body?: string;
  }): Promise<VideoTextSection> {
    const existing = await this.repository.findById(params.sectionId);
    if (!existing || existing.videoId !== params.videoId) {
      throw new Error("Text section not found");
    }

    const updates: { position?: number; heading?: string | null; body?: string } = {};

    if (params.body !== undefined) {
      const body = params.body.trim();
      if (!body) {
        throw new Error("Body cannot be empty");
      }
      updates.body = body;
    }

    if (params.heading !== undefined) {
      const heading = params.heading.trim();
      updates.heading = heading ? heading : null;
    }

    if (params.position !== undefined) {
      if (!Number.isInteger(params.position) || params.position <= 0) {
        throw new Error("Position must be a positive integer");
      }
      updates.position = params.position;
    }

    return await this.repository.update(params.sectionId, updates);
  }

  async deleteSection(params: { videoId: number; sectionId: number }): Promise<VideoTextSection> {
    const existing = await this.repository.findById(params.sectionId);
    if (!existing || existing.videoId !== params.videoId) {
      throw new Error("Text section not found");
    }

    return await this.repository.delete(params.sectionId);
  }

  private async resolvePosition(videoId: number, position?: number): Promise<number> {
    if (position !== undefined) {
      if (!Number.isInteger(position) || position <= 0) {
        throw new Error("Position must be a positive integer");
      }
      return position;
    }

    const last = await this.prisma.videoTextSection.findFirst({
      where: { videoId },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    return (last?.position ?? 0) + 1;
  }
}
