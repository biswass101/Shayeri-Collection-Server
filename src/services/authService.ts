import { PrismaClient, User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

export class AuthService {
  private prisma: PrismaClient;
  private readonly JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
  private readonly JWT_EXPIRE = "24h";
  private readonly SALT_ROUNDS = 10;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // Register a new user
  async register(
    email: string,
    name: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    // Validate email format
    if (!this.isValidEmail(email)) {
      throw new Error("Invalid email format");
    }

    // Validate password strength
    if (!this.isStrongPassword(password)) {
      throw new Error(
        "Password must be at least 8 characters with uppercase, lowercase, number and symbol"
      );
    }

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        passwordHash: hashedPassword,
        role: "user",
      },
    });

    // Generate token
    const token = this.generateToken(user);

    return { user, token };
  }

  // Login user
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Generate token
    const token = this.generateToken(user);

    return { user, token };
  }

  // Verify JWT token
  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }

  // Generate JWT token
  private generateToken(user: User): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRE }
    );
  }

  // Validate email format
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  private isStrongPassword(password: string): boolean {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }
}
