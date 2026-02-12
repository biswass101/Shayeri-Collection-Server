import { Request, Response } from "express";
import { UserService } from "../services/userService";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  // Create a new user
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, name } = req.body;

      if (!email || !name) {
        res.status(400).json({ error: "Email and name are required" });
        return;
      }

      const user = await this.userService.createUser(email, name);
      res.status(201).json({ success: true, data: user });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get all users
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      res.json({ success: true, data: users });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get user by ID
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(Number(id));

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update user
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { email, name } = req.body;

      if (!email && !name) {
        res.status(400).json({ error: "At least one field is required" });
        return;
      }

      const user = await this.userService.updateUser(Number(id), {
        email,
        name,
      });

      res.json({ success: true, data: user });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete user
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.userService.deleteUser(Number(id));

      res.json({
        success: true,
        message: "User deleted successfully",
        data: user,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
