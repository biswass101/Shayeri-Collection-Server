import { Request, Response } from "express";
import { CategoryService } from "../services/categoryService";

export class CategoryController {
  private categoryService: CategoryService;

  constructor(categoryService: CategoryService) {
    this.categoryService = categoryService;
  }

  async listCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await this.categoryService.listCategories();
      res.json({ success: true, data: categories });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const { name, slug, description } = req.body;

      if (!name) {
        res.status(400).json({ error: "Name is required" });
        return;
      }

      const category = await this.categoryService.createCategory({
        name,
        slug,
        description,
      });

      res.status(201).json({ success: true, data: category });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, slug, description } = req.body;

      if (name === undefined && slug === undefined && description === undefined) {
        res.status(400).json({ error: "At least one field is required" });
        return;
      }

      const category = await this.categoryService.updateCategory(Number(id), {
        name,
        slug,
        description,
      });

      res.json({ success: true, data: category });
    } catch (error: any) {
      const message = error.message || "Server error";
      const status = message === "Category not found" ? 404 : 400;
      res.status(status).json({ error: message });
    }
  }

  async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const category = await this.categoryService.deleteCategory(Number(id));

      res.json({
        success: true,
        message: "Category deleted successfully",
        data: category,
      });
    } catch (error: any) {
      const message = error.message || "Server error";
      const status = message === "Category not found" ? 404 : 400;
      res.status(status).json({ error: message });
    }
  }
}
