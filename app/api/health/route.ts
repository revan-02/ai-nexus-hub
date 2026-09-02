import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET() {
  const timestamp = new Date().toISOString();
  let dbStatus = 'healthy';
  let dbLatencyMs = 0;

  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - start;
  } catch (error) {
    dbStatus = 'unhealthy';
  }

  const isHealthy = dbStatus === 'healthy';

  return NextResponse.json(
    {
      status: isHealthy ? 'ok' : 'degraded',
      timestamp,
      services: {
        application: 'healthy',
        database: {
          status: dbStatus,
          latencyMs: dbLatencyMs,
        },
      },
    },
    { status: isHealthy ? 200 : 503 }
  );
}
