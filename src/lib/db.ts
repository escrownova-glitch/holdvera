import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create new PrismaClient for each serverless invocation to avoid prepared statement conflicts
export const db = process.env.NODE_ENV === "production"
  ? new PrismaClient()
  : (globalForPrisma.prisma ?? new PrismaClient());

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export const prisma = db;
