import { PrismaClient } from '@prisma/client';

declare global {
  var database: PrismaClient | undefined;
}

export const prisma =
  globalThis.database ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalThis.database = prisma;
