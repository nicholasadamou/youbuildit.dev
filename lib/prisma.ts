import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

// Prisma 7 removed the implicit datasource URL. This app connects to Prisma
// Postgres over Accelerate (a `prisma+postgres://` URL via HTTPS), so the
// client is given `accelerateUrl` and extended with the Accelerate extension.
const accelerateUrl = process.env.PRISMA_DATABASE_URL;

// Fail fast with a clear message at runtime when the connection string is
// missing, but don't break `next build`'s page-data collection (which imports
// this module before the env is necessarily available).
if (!accelerateUrl && process.env.NEXT_PHASE !== 'phase-production-build') {
  throw new Error(
    'PRISMA_DATABASE_URL is not set. Provide the Prisma Postgres connection string.'
  );
}

const createPrismaClient = () =>
  new PrismaClient({ accelerateUrl }).$extends(withAccelerate());

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
