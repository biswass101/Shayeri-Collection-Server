import { PrismaClient, Category } from "@prisma/client";

export class CategoryRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findAll(): Promise<Category[]> {
    return await this.prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: number): Promise<Category | null> {
    return await this.prisma.category.findUnique({
      where: { id },
    });
  }

  async findByName(name: string): Promise<Category | null> {
    return await this.prisma.category.findUnique({
      where: { name },
    });
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return await this.prisma.category.findUnique({
      where: { slug },
    });
  }

  async create(data: {
    name: string;
    slug: string;
    description?: string | null;
  }): Promise<Category> {
    return await this.prisma.category.create({ data });
  }

  async update(
    id: number,
    data: { name?: string; slug?: string; description?: string | null }
  ): Promise<Category> {
    return await this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Category> {
    return await this.prisma.category.delete({
      where: { id },
    });
  }
}
