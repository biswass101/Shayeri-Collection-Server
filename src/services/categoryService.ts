import { Category } from "@prisma/client";
import { CategoryRepository } from "../repositories/categoryRepository";

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor(categoryRepository: CategoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async listCategories(): Promise<Category[]> {
    return await this.categoryRepository.findAll();
  }

  async createCategory(data: {
    name: string;
    slug?: string;
    description?: string | null;
  }): Promise<Category> {
    const name = data.name.trim();
    if (!name) {
      throw new Error("Name is required");
    }

    const slug = this.normalizeSlug(data.slug ?? name);
    if (!slug) {
      throw new Error("Slug is required");
    }

    const existingByName = await this.categoryRepository.findByName(name);
    if (existingByName) {
      throw new Error("Category with this name already exists");
    }

    const existingBySlug = await this.categoryRepository.findBySlug(slug);
    if (existingBySlug) {
      throw new Error("Category with this slug already exists");
    }

    return await this.categoryRepository.create({
      name,
      slug,
      description: data.description ?? null,
    });
  }

  async updateCategory(
    id: number,
    data: { name?: string; slug?: string; description?: string | null }
  ): Promise<Category> {
    const existing = await this.categoryRepository.findById(id);
    if (!existing) {
      throw new Error("Category not found");
    }

    const updates: { name?: string; slug?: string; description?: string | null } = {};

    if (data.name !== undefined) {
      const name = data.name.trim();
      if (!name) {
        throw new Error("Name cannot be empty");
      }
      if (name !== existing.name) {
        const existingByName = await this.categoryRepository.findByName(name);
        if (existingByName && existingByName.id !== id) {
          throw new Error("Category with this name already exists");
        }
      }
      updates.name = name;
    }

    if (data.slug !== undefined) {
      const slug = this.normalizeSlug(data.slug);
      if (!slug) {
        throw new Error("Slug cannot be empty");
      }
      if (slug !== existing.slug) {
        const existingBySlug = await this.categoryRepository.findBySlug(slug);
        if (existingBySlug && existingBySlug.id !== id) {
          throw new Error("Category with this slug already exists");
        }
      }
      updates.slug = slug;
    } else if (updates.name && updates.name !== existing.name) {
      const slug = this.normalizeSlug(updates.name);
      if (!slug) {
        throw new Error("Slug cannot be empty");
      }
      if (slug !== existing.slug) {
        const existingBySlug = await this.categoryRepository.findBySlug(slug);
        if (existingBySlug && existingBySlug.id !== id) {
          throw new Error("Category with this slug already exists");
        }
      }
      updates.slug = slug;
    }

    if (data.description !== undefined) {
      updates.description = data.description ?? null;
    }

    return await this.categoryRepository.update(id, updates);
  }

  async deleteCategory(id: number): Promise<Category> {
    const existing = await this.categoryRepository.findById(id);
    if (!existing) {
      throw new Error("Category not found");
    }

    return await this.categoryRepository.delete(id);
  }

  private normalizeSlug(input: string): string {
    const slug = input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/--+/g, "-");

    return slug;
  }
}
