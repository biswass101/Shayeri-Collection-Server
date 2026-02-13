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
}
