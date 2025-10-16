import { PrismaClient } from '@prisma/client';

// PrismaClient singleton to prevent multiple instances in development
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Export disconnect function for manual cleanup
export const disconnectPrisma = async () => {
  await prisma.$disconnect();
  console.log('Prisma disconnected');
};

