import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { withAccelerate } from '@prisma/extension-accelerate';

const databaseUrl = process.env.PRISMA_DATABASE_URL;
if (!databaseUrl && process.env.NEXT_PHASE !== 'phase-production-build') {
  throw new Error(
    'PRISMA_DATABASE_URL is not set. Provide a PostgreSQL or Prisma Accelerate URL.'
  );
}

function createPrismaClient() {
  if (
    databaseUrl?.startsWith('prisma:') ||
    databaseUrl?.startsWith('prisma+postgres:')
  ) {
    return new PrismaClient({ accelerateUrl: databaseUrl }).$extends(
      withAccelerate()
    );
  }
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
  }).$extends(withAccelerate());
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};
export const prisma = globalForPrisma.prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
