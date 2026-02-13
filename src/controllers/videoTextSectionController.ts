import { Request, Response } from "express";
import { VideoTextSectionService } from "../services/videoTextSectionService";

export class VideoTextSectionController {
  private service: VideoTextSectionService;

  constructor(service: VideoTextSectionService) {
    this.service = service;
  }

  async createSection(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { position, heading, body } = req.body;

      if (!body) {
        res.status(400).json({ error: "Body is required" });
        return;
      }

      const section = await this.service.createSection({
        videoId: Number(id),
        position: position !== undefined ? Number(position) : undefined,
        heading,
        body,
      });

      res.status(201).json({ success: true, data: section });
    } catch (error: any) {
      const message = error.message || "Server error";
      const status = message === "Video not found" ? 404 : 400;
      res.status(status).json({ error: message });
    }
  }

  async updateSection(req: Request, res: Response): Promise<void> {
    try {
      const { id, sectionId } = req.params;
      const { position, heading, body } = req.body;

      if (position === undefined && heading === undefined && body === undefined) {
        res.status(400).json({ error: "At least one field is required" });
        return;
      }

      const section = await this.service.updateSection({
        videoId: Number(id),
        sectionId: Number(sectionId),
        position: position !== undefined ? Number(position) : undefined,
        heading,
        body,
      });

      res.json({ success: true, data: section });
    } catch (error: any) {
      const message = error.message || "Server error";
      const status = message === "Text section not found" ? 404 : 400;
      res.status(status).json({ error: message });
    }
  }

  async deleteSection(req: Request, res: Response): Promise<void> {
    try {
      const { id, sectionId } = req.params;
      const section = await this.service.deleteSection({
        videoId: Number(id),
        sectionId: Number(sectionId),
      });

      res.json({ success: true, message: "Text section deleted successfully", data: section });
    } catch (error: any) {
      const message = error.message || "Server error";
      const status = message === "Text section not found" ? 404 : 400;
      res.status(status).json({ error: message });
    }
  }
}
