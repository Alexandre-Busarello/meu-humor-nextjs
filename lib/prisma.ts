import { PrismaClient } from '@prisma/client';

// PrismaClient singleton to prevent multiple instances in serverless environment
const globalForPrisma = globalThis as unknown as { 
  prisma: PrismaClient;
  prismaConnectionCount: number;
};

// Track connections for debugging
if (!globalForPrisma.prismaConnectionCount) {
  globalForPrisma.prismaConnectionCount = 0;
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// In serverless, connections should be closed after response
// But keep singleton for reuse within same instance
prisma.$connect().then(() => {
  globalForPrisma.prismaConnectionCount++;
  console.log('✅ Prisma connected (count:', globalForPrisma.prismaConnectionCount, ')');
}).catch((err) => {
  console.error('❌ Prisma connection error:', err);
});

// Export disconnect function for manual cleanup
export const disconnectPrisma = async () => {
  try {
    await prisma.$disconnect();
    globalForPrisma.prismaConnectionCount = Math.max(0, globalForPrisma.prismaConnectionCount - 1);
    console.log('Prisma disconnected (remaining:', globalForPrisma.prismaConnectionCount, ')');
  } catch (error) {
    console.error('Error disconnecting Prisma:', error);
  }
};

