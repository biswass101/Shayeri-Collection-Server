import { Request, Response } from "express";
import { VideoDownloadService } from "../services/videoDownloadService";

export class VideoDownloadController {
  private service: VideoDownloadService;

  constructor(service: VideoDownloadService) {
    this.service = service;
  }

  async downloadVideo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const result = await this.service.recordDownload({
        videoId: Number(id),
        userId,
      });

      res.json({
        success: true,
        data: {
          downloadUrl: result.videoUrl,
          event: result.event,
        },
      });
    } catch (error: any) {
      const message = error.message || "Server error";
      const status = message === "Video not found" ? 404 : 400;
      res.status(status).json({ error: message });
    }
  }

  async getTotalDownloads(req: Request, res: Response): Promise<void> {
    try {
      const videoId = req.query.videoId ? Number(req.query.videoId) : undefined;
      const total = await this.service.countDownloads(videoId);
      res.json({ success: true, data: { total, videoId: videoId ?? null } });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Server error" });
    }
  }

  async listUserDownloads(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const downloads = await this.service.listUserDownloads(userId);
      res.json({ success: true, data: downloads });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Server error" });
    }
  }
}
