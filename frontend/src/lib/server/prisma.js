import { PrismaClient } from '@prisma/client';

// Avoid creating multiple PrismaClient instances in dev/hot-reload
const prismaClientSingleton = () => new PrismaClient();

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}