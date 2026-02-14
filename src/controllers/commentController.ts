import { Request, Response } from "express";
import { CommentService } from "../services/commentService";

export class CommentController {
  private service: CommentService;

  constructor(service: CommentService) {
    this.service = service;
  }

  async listComments(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const comments = await this.service.listComments(Number(id));
      res.json({ success: true, data: comments });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createComment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { body, parentId } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      if (!body) {
        res.status(400).json({ error: "Body is required" });
        return;
      }

      const comment = await this.service.createComment(
        Number(id),
        userId,
        body,
        parentId ? Number(parentId) : null
      );
      res.status(201).json({ success: true, data: comment });
    } catch (error: any) {
      const message = error.message || "Server error";
      const status =
        message === "Video not found" || message === "Parent comment not found"
          ? 404
          : 400;
      res.status(status).json({ error: message });
    }
  }

  async updateComment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { body } = req.body;
      const userId = req.user?.id;
      const userRole = req.user?.role;

      if (!userId || !userRole) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      if (!body) {
        res.status(400).json({ error: "Body is required" });
        return;
      }

      const comment = await this.service.updateComment({
        commentId: Number(id),
        userId,
        userRole,
        body,
      });

      res.json({ success: true, data: comment });
    } catch (error: any) {
      const message = error.message || "Server error";
      const status = message === "Comment not found" ? 404 : message === "Forbidden" ? 403 : 400;
      res.status(status).json({ error: message });
    }
  }

  async deleteComment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const userRole = req.user?.role;

      if (!userId || !userRole) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const comment = await this.service.deleteComment({
        commentId: Number(id),
        userId,
        userRole,
      });

      res.json({ success: true, message: "Comment deleted successfully", data: comment });
    } catch (error: any) {
      const message = error.message || "Server error";
      const status = message === "Comment not found" ? 404 : message === "Forbidden" ? 403 : 400;
      res.status(status).json({ error: message });
    }
  }
}
