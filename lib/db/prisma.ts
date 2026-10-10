import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://amithks:amithks@localhost:5432/ai_nexus_db?schema=public';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const isSsl =
    connectionString.includes('sslmode=require') ||
    connectionString.includes('ssl=true') ||
    connectionString.includes('neon.tech') ||
    connectionString.includes('supabase.co') ||
    (process.env.NODE_ENV === 'production' &&
      !connectionString.includes('localhost') &&
      !connectionString.includes('127.0.0.1'));

  const pool = new pg.Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 15000,
    ssl: isSsl ? { rejectUnauthorized: false } : undefined,
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = (() => {
  if (globalForPrisma.prisma) {
    // If Prisma schema was updated with new models during dev, invalidate stale global singleton
    if (!('learningPhase' in globalForPrisma.prisma)) {
      globalForPrisma.prisma = createPrismaClient();
    }
    return globalForPrisma.prisma;
  }
  const client = createPrismaClient();
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client;
  }
  return client;
})();

export default prisma;
