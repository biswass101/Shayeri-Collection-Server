import { Request, Response } from "express";
import { VideoLikeService } from "../services/videoLikeService";

export class VideoLikeController {
  private service: VideoLikeService;

  constructor(service: VideoLikeService) {
    this.service = service;
  }

  async likeVideo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const like = await this.service.likeVideo(Number(id), userId);
      res.status(201).json({ success: true, data: like });
    } catch (error: any) {
      const message = error.message || "Server error";
      const status = message === "Video not found" ? 404 : 400;
      res.status(status).json({ error: message });
    }
  }

  async unlikeVideo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const like = await this.service.unlikeVideo(Number(id), userId);
      res.json({ success: true, data: like });
    } catch (error: any) {
      const message = error.message || "Server error";
      const status = message === "Like not found" ? 404 : 400;
      res.status(status).json({ error: message });
    }
  }

  async getLikeStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const liked = await this.service.isLiked(Number(id), userId);
      res.json({ success: true, data: { liked } });
    } catch (error: any) {
      const message = error.message || "Server error";
      const status = message === "Video not found" ? 404 : 400;
      res.status(status).json({ error: message });
    }
  }
}
