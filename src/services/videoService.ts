import { PrismaClient, Prisma, Video } from "@prisma/client";
import { VideoRepository } from "../repositories/videoRepository";
import { cloudinary } from "../config/cloudinary";

export type VideoTextSectionInput = {
  position?: number;
  heading?: string;
  body: string;
};

export class VideoService {
  private prisma: PrismaClient;
  private videoRepository: VideoRepository;

  constructor(prisma: PrismaClient, videoRepository: VideoRepository) {
    this.prisma = prisma;
    this.videoRepository = videoRepository;
  }

  async listVideos(params: {
    page: number;
    limit: number;
    categoryId?: number;
    categorySlug?: string;
    search?: string;
    includeUnpublished?: boolean;
  }): Promise<{ items: Video[]; total: number; page: number; limit: number }> {
    const where: Prisma.VideoWhereInput = {};

    if (!params.includeUnpublished) {
      where.isPublished = true;
    }

    if (params.categoryId) {
      where.categoryId = params.categoryId;
    }

    if (params.categorySlug) {
      where.category = { slug: params.categorySlug };
    }

    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: "insensitive" } },
        { description: { contains: params.search, mode: "insensitive" } },
      ];
    }

    const skip = (params.page - 1) * params.limit;
    const take = params.limit;

    const [items, total] = await Promise.all([
      this.videoRepository.findMany({ skip, take, where }),
      this.videoRepository.count(where),
    ]);

    return { items, total, page: params.page, limit: params.limit };
  }

  async listLikedVideos(params: {
    userId: number;
    page: number;
    limit: number;
  }): Promise<{ items: Video[]; total: number; page: number; limit: number }> {
    const where: Prisma.VideoWhereInput = {
      isPublished: true,
      likes: { some: { userId: params.userId } },
    };

    const skip = (params.page - 1) * params.limit;
    const take = params.limit;

    const [items, total] = await Promise.all([
      this.videoRepository.findMany({ skip, take, where }),
      this.videoRepository.count(where),
    ]);

    return { items, total, page: params.page, limit: params.limit };
  }

  async getVideoById(id: number, includeUnpublished = false): Promise<Video | null> {
    const video = await this.videoRepository.findById(id);
    if (!video) return null;

    if (!includeUnpublished && !video.isPublished) {
      return null;
    }

    return video;
  }

  async createVideo(params: {
    title: string;
    description?: string | null;
    categoryId: number;
    isPublished: boolean;
    createdByAdminId: number;
    videoFile: Buffer;
    thumbnailFile?: Buffer;
    textSections?: VideoTextSectionInput[];
  }): Promise<Video> {
    const uploadResult = await this.uploadVideo(params.videoFile);
    const thumbnailResult = params.thumbnailFile
      ? await this.uploadThumbnail(params.thumbnailFile)
      : null;
    const fallbackThumbnailUrl = thumbnailResult?.secure_url
      ? null
      : this.buildDefaultThumbnailUrl(uploadResult.public_id);

    const sections = this.normalizeSections(params.textSections);

    return await this.prisma.$transaction(async (tx) => {
      const video = await tx.video.create({
        data: {
          title: params.title,
          description: params.description ?? null,
          category: { connect: { id: params.categoryId } },
          cloudinaryPublicId: uploadResult.public_id,
          videoUrl: uploadResult.secure_url,
          thumbnailUrl: thumbnailResult?.secure_url ?? fallbackThumbnailUrl,
          durationSeconds: uploadResult.duration
            ? Math.round(uploadResult.duration)
            : null,
          isPublished: params.isPublished,
          viewsCount: 0,
          createdByAdminId: params.createdByAdminId,
          textSections: sections
            ? {
                create: sections,
              }
            : undefined,
        },
        include: {
          category: true,
          textSections: { orderBy: { position: "asc" } },
        },
      });
      await this.createVideoNotifications(tx, {
        type: "video_created",
        videoId: video.id,
        title: video.title,
      });
      return video;
    });
  }

  async updateVideo(params: {
    id: number;
    title?: string;
    description?: string | null;
    categoryId?: number;
    isPublished?: boolean;
    videoFile?: Buffer;
    thumbnailFile?: Buffer;
    textSections?: VideoTextSectionInput[];
  }): Promise<Video> {
    const existing = await this.videoRepository.findById(params.id);
    if (!existing) {
      throw new Error("Video not found");
    }

    let uploadResult: { public_id: string; secure_url: string; duration?: number } | null = null;
    let thumbnailResult: { secure_url: string } | null = null;

    if (params.videoFile) {
      uploadResult = await this.uploadVideo(params.videoFile);
    }

    if (params.thumbnailFile) {
      thumbnailResult = await this.uploadThumbnail(params.thumbnailFile);
    }

    const sections = this.normalizeSections(params.textSections);

    return await this.prisma.$transaction(async (tx) => {
      if (uploadResult) {
        await this.deleteCloudinaryVideo(existing.cloudinaryPublicId);
      }

      if (sections) {
        await tx.videoTextSection.deleteMany({
          where: { videoId: existing.id },
        });
      }

      const video = await tx.video.update({
        where: { id: existing.id },
        data: {
          title: params.title ?? undefined,
          description: params.description ?? undefined,
          category: params.categoryId ? { connect: { id: params.categoryId } } : undefined,
          cloudinaryPublicId: uploadResult?.public_id ?? undefined,
          videoUrl: uploadResult?.secure_url ?? undefined,
          thumbnailUrl: thumbnailResult?.secure_url ?? undefined,
          durationSeconds:
            uploadResult?.duration !== undefined
              ? Math.round(uploadResult.duration)
              : undefined,
          isPublished: params.isPublished ?? undefined,
          textSections: sections
            ? {
                create: sections,
              }
            : undefined,
        },
        include: {
          category: true,
          textSections: { orderBy: { position: "asc" } },
        },
      });
      await this.createVideoNotifications(tx, {
        type: "video_updated",
        videoId: video.id,
        title: video.title,
      });
      return video;
    });
  }

  async deleteVideo(id: number): Promise<Video> {
    const existing = await this.videoRepository.findById(id);
    if (!existing) {
      throw new Error("Video not found");
    }

    const deleted = await this.videoRepository.delete(id);
    await this.deleteCloudinaryVideo(existing.cloudinaryPublicId);
    return deleted;
  }

  async incrementViews(id: number): Promise<Video> {
    const existing = await this.videoRepository.findById(id);
    if (!existing) {
      throw new Error("Video not found");
    }
    return await this.videoRepository.incrementViews(id);
  }

  async getShareDownloadCounts(
    videoIds: number[]
  ): Promise<{ shares: Record<number, number>; downloads: Record<number, number> }> {
    if (!videoIds.length) {
      return { shares: {}, downloads: {} };
    }

    const [shareRows, downloadRows] = await Promise.all([
      this.prisma.videoShareEvent.groupBy({
        by: ["videoId"],
        where: { videoId: { in: videoIds } },
        _count: { _all: true },
      }),
      this.prisma.videoDownloadEvent.groupBy({
        by: ["videoId"],
        where: { videoId: { in: videoIds } },
        _count: { _all: true },
      }),
    ]);

    const shares = shareRows.reduce<Record<number, number>>((acc, row) => {
      acc[row.videoId] = row._count._all;
      return acc;
    }, {});

    const downloads = downloadRows.reduce<Record<number, number>>((acc, row) => {
      acc[row.videoId] = row._count._all;
      return acc;
    }, {});

    return { shares, downloads };
  }

  private normalizeSections(
    sections?: VideoTextSectionInput[]
  ): { position: number; heading?: string | null; body: string }[] | null {
    if (!sections) return null;

    const normalized = sections.map((section, index) => {
      const body = section.body?.trim();
      if (!body) {
        throw new Error("Each text section must include body");
      }

      const heading = section.heading?.trim();
      const position = section.position ?? index + 1;

      return {
        position,
        heading: heading || null,
        body,
      };
    });

    return normalized;
  }

  private uploadVideo(fileBuffer: Buffer): Promise<{ public_id: string; secure_url: string; duration?: number }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "sayeri/videos",
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Failed to upload video"));
            return;
          }
          resolve({
            public_id: result.public_id,
            secure_url: result.secure_url,
            duration: result.duration,
          });
        }
      );

      uploadStream.end(fileBuffer);
    });
  }

  private uploadThumbnail(fileBuffer: Buffer): Promise<{ secure_url: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "sayeri/thumbnails",
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Failed to upload thumbnail"));
            return;
          }
          resolve({
            secure_url: result.secure_url,
          });
        }
      );

      uploadStream.end(fileBuffer);
    });
  }

  private buildDefaultThumbnailUrl(publicId: string): string | null {
    if (!publicId) return null;
    return cloudinary.url(publicId, {
      resource_type: "video",
      format: "jpg",
      transformation: [
        { so: 2 },
        { width: 640, height: 360, crop: "fill" },
      ],
    });
  }

  private async deleteCloudinaryVideo(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
    } catch (error) {
      // Ignore cloud delete failures to avoid blocking DB cleanup
    }
  }

  private async createVideoNotifications(
    tx: Prisma.TransactionClient,
    params: { type: "video_created" | "video_updated"; videoId: number; title: string }
  ): Promise<void> {
    const users = await tx.user.findMany({
      select: { id: true },
    });

    if (!users.length) return;

    const title =
      params.type === "video_created" ? "New video uploaded" : "Video updated";
    const body =
      params.type === "video_created"
        ? `New video: ${params.title}`
        : `${params.title} was updated.`;

    await tx.notification.createMany({
      data: users.map((user) => ({
        userId: user.id,
        videoId: params.videoId,
        type: params.type,
        title,
        body,
      })),
    });
  }
}
