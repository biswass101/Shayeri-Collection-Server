import { Request, Response } from "express";
import { AdminDashboardService } from "../services/adminDashboardService";

export class AdminDashboardController {
  private service: AdminDashboardService;

  constructor(service: AdminDashboardService) {
    this.service = service;
  }

  async getDashboard(req: Request, res: Response): Promise<void> {
    try {
      const days = req.query.days ? Number(req.query.days) : 10;
      const summary = await this.service.getDashboardSummary(Number.isFinite(days) ? days : 10);
      res.json({ success: true, data: summary });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Server error" });
    }
  }
}
