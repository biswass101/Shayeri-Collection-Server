import { PrismaClient, User } from "@prisma/client";

export class UserRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // Create a new user
  async create(email: string, name: string): Promise<User> {
    return await this.prisma.user.create({
      data: {
        email,
        name,
      },
    });
  }

  // Get user by ID
  async findById(id: number): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  // Get all users
  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany({
      include: {
        posts: true,
      },
    });
  }

  // Get user by email
  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  // Update user
  async update(
    id: number,
    data: { email?: string; name?: string }
  ): Promise<User> {
    return await this.prisma.user.update({
      where: { id },
      data,
    });
  }

  // Delete user
  async delete(id: number): Promise<User> {
    return await this.prisma.user.delete({
      where: { id },
    });
  }
}
