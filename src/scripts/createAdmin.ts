import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import * as readline from "readline";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

async function createAdmin() {
  console.log("\n========================================");
  console.log("   Create System Admin");
  console.log("========================================\n");

  try {
    const email = await question("Email: ");
    const name = await question("Name: ");
    const password = await question("Password: ");

    console.log("\n⏳ Creating admin...");
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const admin = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash: hashedPassword,
        role: "admin",
      },
    });

    console.log("\n✅ Admin created successfully!");
    console.log(`ID: ${admin.id}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Name: ${admin.name}`);
    console.log(`Role: ${admin.role}\n`);
  } catch (error: any) {
    console.log(`\n❌ Error: ${error.message}\n`);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

createAdmin();
