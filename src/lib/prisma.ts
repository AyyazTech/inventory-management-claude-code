import { PrismaClient } from "@prisma/client";

// Reuse a single PrismaClient across hot reloads in development. Without this,
// `next dev` would instantiate a new client on every reload and exhaust
// database connections.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
