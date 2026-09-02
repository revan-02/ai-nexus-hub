import { NextResponse } from 'next/server';
import { AdminService } from '@/services';

// GET /api/admin/metrics — Aggregated dashboard metrics
export async function GET() {
  try {
    const metrics = await AdminService.getAdminMetrics();
    return NextResponse.json({ data: metrics });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch metrics', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

