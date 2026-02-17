import { Request, Response } from "express";
import { VideoService, VideoTextSectionInput } from "../services/videoService";

export class VideoController {
  private videoService: VideoService;

  constructor(videoService: VideoService) {
    this.videoService = videoService;
  }

  private buildHlsUrl(publicId?: string | null): string | null {
    if (!publicId) return null;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    if (!cloudName) return null;
    return `https://res.cloudinary.com/${cloudName}/video/upload/sp_auto/${publicId}.m3u8`;
  }

  private buildThumbnailUrl(publicId?: string | null): string | null {
    if (!publicId) return null;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    if (!cloudName) return null;
    return `https://res.cloudinary.com/${cloudName}/video/upload/so_2,w_640,h_360,c_fill/${publicId}.jpg`;
  }

  async listVideos(req: Request, res: Response): Promise<void> {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
      const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
      const categorySlug = req.query.categorySlug ? String(req.query.categorySlug) : undefined;
      const search = req.query.search ? String(req.query.search) : undefined;

      const result = await this.videoService.listVideos({
        page,
        limit,
        categoryId,
        categorySlug,
        search,
        includeUnpublished: false,
      });

      const ids = result.items.map((video) => video.id);
      const counts = await this.videoService.getShareDownloadCounts(ids);

      const data = result.items.map((video) => ({
        ...video,
        hlsUrl: this.buildHlsUrl(video.cloudinaryPublicId),
        thumbnailUrl:
          video.thumbnailUrl ?? this.buildThumbnailUrl(video.cloudinaryPublicId),
        likesCount: (video as any)?._count?.likes ?? 0,
        sharesCount: counts.shares[video.id] ?? (video as any)?._count?.shares ?? 0,
        downloadsCount: counts.downloads[video.id] ?? (video as any)?._count?.downloads ?? 0,
      }));

      res.json({ success: true, data, meta: { total: result.total, page, limit } });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async listLikedVideos(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));

      const result = await this.videoService.listLikedVideos({
        userId,
        page,
        limit,
      });

      const ids = result.items.map((video) => video.id);
      const counts = await this.videoService.getShareDownloadCounts(ids);

      const data = result.items.map((video) => ({
        ...video,
        hlsUrl: this.buildHlsUrl(video.cloudinaryPublicId),
        thumbnailUrl:
          video.thumbnailUrl ?? this.buildThumbnailUrl(video.cloudinaryPublicId),
        likesCount: (video as any)?._count?.likes ?? 0,
        sharesCount: counts.shares[video.id] ?? (video as any)?._count?.shares ?? 0,
        downloadsCount: counts.downloads[video.id] ?? (video as any)?._count?.downloads ?? 0,
      }));

      res.json({ success: true, data, meta: { total: result.total, page, limit } });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getVideoById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const video = await this.videoService.getVideoById(Number(id), false);

      if (!video) {
        res.status(404).json({ error: "Video not found" });
        return;
      }

      const counts = await this.videoService.getShareDownloadCounts([video.id]);

      res.json({
        success: true,
        data: {
          ...video,
          hlsUrl: this.buildHlsUrl(video.cloudinaryPublicId),
          thumbnailUrl:
            video.thumbnailUrl ?? this.buildThumbnailUrl(video.cloudinaryPublicId),
          likesCount: (video as any)?._count?.likes ?? 0,
          sharesCount: counts.shares[video.id] ?? (video as any)?._count?.shares ?? 0,
          downloadsCount: counts.downloads[video.id] ?? (video as any)?._count?.downloads ?? 0,
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createVideo(req: Request, res: Response): Promise<void> {
    try {
      const { title, description, categoryId, isPublished, textSections } = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      const videoFile = files?.video?.[0];
      const thumbnailFile = files?.thumbnail?.[0];
      console.log("tile", title, "categoryId", categoryId, "videoFile", videoFile);
      if (!title || !categoryId || !videoFile) {
        res.status(400).json({ error: "title, categoryId, and video file are required" });
        return;
      }

      const parsedSections = this.parseTextSections(textSections);

      const createdByAdminId = req.user?.id;
      if (!createdByAdminId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const video = await this.videoService.createVideo({
        title: String(title),
        description: description ? String(description) : null,
        categoryId: Number(categoryId),
        isPublished: isPublished === "false" ? false : Boolean(isPublished ?? true),
        createdByAdminId,
        videoFile: videoFile.buffer,
        thumbnailFile: thumbnailFile?.buffer,
        textSections: parsedSections,
      });

      const counts = await this.videoService.getShareDownloadCounts([video.id]);

      res.status(201).json({
        success: true,
        data: {
          ...video,
          hlsUrl: this.buildHlsUrl(video.cloudinaryPublicId),
          thumbnailUrl:
            video.thumbnailUrl ?? this.buildThumbnailUrl(video.cloudinaryPublicId),
          likesCount: (video as any)?._count?.likes ?? 0,
          sharesCount: counts.shares[video.id] ?? (video as any)?._count?.shares ?? 0,
          downloadsCount: counts.downloads[video.id] ?? (video as any)?._count?.downloads ?? 0,
        },
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateVideo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { title, description, categoryId, isPublished, textSections } = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      const videoFile = files?.video?.[0];
      const thumbnailFile = files?.thumbnail?.[0];

      if (
        title === undefined &&
        description === undefined &&
        categoryId === undefined &&
        isPublished === undefined &&
        !videoFile &&
        !thumbnailFile &&
        textSections === undefined
      ) {
        res.status(400).json({ error: "At least one field is required" });
        return;
      }

      const parsedSections = this.parseTextSections(textSections);

      const video = await this.videoService.updateVideo({
        id: Number(id),
        title: title !== undefined ? String(title) : undefined,
        description: description !== undefined ? String(description) : undefined,
        categoryId: categoryId !== undefined ? Number(categoryId) : undefined,
        isPublished: isPublished !== undefined ? isPublished !== "false" : undefined,
        videoFile: videoFile?.buffer,
        thumbnailFile: thumbnailFile?.buffer,
        textSections: parsedSections,
      });

      const counts = await this.videoService.getShareDownloadCounts([video.id]);

      res.json({
        success: true,
        data: {
          ...video,
          hlsUrl: this.buildHlsUrl(video.cloudinaryPublicId),
          thumbnailUrl:
            video.thumbnailUrl ?? this.buildThumbnailUrl(video.cloudinaryPublicId),
          likesCount: (video as any)?._count?.likes ?? 0,
          sharesCount: counts.shares[video.id] ?? (video as any)?._count?.shares ?? 0,
          downloadsCount: counts.downloads[video.id] ?? (video as any)?._count?.downloads ?? 0,
        },
      });
    } catch (error: any) {
      const message = error.message || "Server error";
      const status = message === "Video not found" ? 404 : 400;
      res.status(status).json({ error: message });
    }
  }

  async deleteVideo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const video = await this.videoService.deleteVideo(Number(id));

      res.json({ success: true, message: "Video deleted successfully", data: video });
    } catch (error: any) {
      const message = error.message || "Server error";
      const status = message === "Video not found" ? 404 : 400;
      res.status(status).json({ error: message });
    }
  }

  async incrementViews(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const video = await this.videoService.incrementViews(Number(id));

      res.json({
        success: true,
        data: {
          id: video.id,
          viewsCount: video.viewsCount,
        },
      });
    } catch (error: any) {
      const message = error.message || "Server error";
      const status = message === "Video not found" ? 404 : 400;
      res.status(status).json({ error: message });
    }
  }

  private parseTextSections(input: any): VideoTextSectionInput[] | undefined {
    if (input === undefined || input === null || input === "") {
      return undefined;
    }

    if (Array.isArray(input)) {
      return input as VideoTextSectionInput[];
    }

    if (typeof input === "string") {
      try {
        const parsed = JSON.parse(input);
        if (Array.isArray(parsed)) {
          return parsed as VideoTextSectionInput[];
        }
      } catch (error) {
        throw new Error("Invalid textSections JSON");
      }
    }

    throw new Error("textSections must be an array or JSON string");
  }
}
