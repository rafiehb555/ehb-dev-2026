import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __ehbPrisma: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  global.__ehbPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") global.__ehbPrisma = prisma;

