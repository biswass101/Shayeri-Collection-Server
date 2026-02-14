import { PrismaClient, Video, Prisma } from "@prisma/client";

export class VideoRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findMany(params: {
    skip: number;
    take: number;
    where?: Prisma.VideoWhereInput;
  }): Promise<Video[]> {
    return await this.prisma.video.findMany({
      skip: params.skip,
      take: params.take,
      where: params.where,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        _count: { select: { likes: true } },
      },
    });
  }

  async count(where?: Prisma.VideoWhereInput): Promise<number> {
    return await this.prisma.video.count({ where });
  }

  async findById(id: number): Promise<Video | null> {
    return await this.prisma.video.findUnique({
      where: { id },
      include: {
        category: true,
        textSections: { orderBy: { position: "asc" } },
        _count: { select: { likes: true } },
      },
    });
  }

  async create(data: Prisma.VideoCreateInput): Promise<Video> {
    return await this.prisma.video.create({
      data,
      include: {
        category: true,
        textSections: { orderBy: { position: "asc" } },
        _count: { select: { likes: true } },
      },
    });
  }

  async update(id: number, data: Prisma.VideoUpdateInput): Promise<Video> {
    return await this.prisma.video.update({
      where: { id },
      data,
      include: {
        category: true,
        textSections: { orderBy: { position: "asc" } },
        _count: { select: { likes: true } },
      },
    });
  }

  async delete(id: number): Promise<Video> {
    return await this.prisma.video.delete({
      where: { id },
    });
  }

  async incrementViews(id: number): Promise<Video> {
    return await this.prisma.video.update({
      where: { id },
      data: { viewsCount: { increment: 1 } },
    });
  }
}
