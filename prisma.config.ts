import path from 'node:path';
import { defineConfig } from 'prisma/config';

// Prisma 7 moves the connection URL out of schema.prisma. The CLI (migrate,
// db push, studio) reads it from here; the runtime client connects via
// Accelerate (see lib/prisma.ts).
//
// Read process.env directly rather than Prisma's `env()` helper: `env()` throws
// when the variable is unset, which would break `prisma generate` (run by
// postinstall without a DB URL, e.g. in CI). The URL is only needed by the
// migrate commands, which run with the secret set.
export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  migrations: {
    path: path.join('prisma', 'migrations'),
  },
  datasource: {
    url: process.env.PRISMA_DATABASE_URL ?? '',
  },
});
