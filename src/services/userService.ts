import { User } from "@prisma/client";
import { UserRepository } from "../repositories/userRepository";

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  // Create a new user
  async createUser(email: string, name: string, password: string): Promise<User> {
    // Validate email format
    if (!this.isValidEmail(email)) {
      throw new Error("Invalid email format");
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    return await this.userRepository.create(email, name, password);
  }

  // Get user by ID
  async getUserById(id: number): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  // Get all users
  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  // Update user
  async updateUser(
    id: number,
    data: { email?: string; name?: string }
  ): Promise<User> {
    // Validate email if provided
    if (data.email && !this.isValidEmail(data.email)) {
      throw new Error("Invalid email format");
    }

    // Check if new email already exists (if email is being changed)
    if (data.email) {
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser && existingUser.id !== id) {
        throw new Error("User with this email already exists");
      }
    }

    return await this.userRepository.update(id, data);
  }

  // Delete user
  async deleteUser(id: number): Promise<User> {
    return await this.userRepository.delete(id);
  }

  // Validate email format
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
