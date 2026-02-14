import { Request, Response } from "express";
import { VideoShareService } from "../services/videoShareService";

export class VideoShareController {
  private service: VideoShareService;

  constructor(service: VideoShareService) {
    this.service = service;
  }

  async shareVideo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { channel } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const share = await this.service.shareVideo({
        videoId: Number(id),
        userId,
        channel,
      });

      res.status(201).json({ success: true, data: share });
    } catch (error: any) {
      const message = error.message || "Server error";
      const status = message === "Video not found" ? 404 : 400;
      res.status(status).json({ error: message });
    }
  }

  async getTotalShares(req: Request, res: Response): Promise<void> {
    try {
      const videoId = req.query.videoId ? Number(req.query.videoId) : undefined;
      const total = await this.service.countShares(videoId);
      res.json({ success: true, data: { total, videoId: videoId ?? null } });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Server error" });
    }
  }
}
