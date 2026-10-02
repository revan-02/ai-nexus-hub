import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { AdminService } from '@/services';

// GET /api/admin/metrics — Aggregated dashboard metrics (Admin only)
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Authentication required' }, { status: 401 });
    }
    const role = (session.user as any)?.role;
    if (role !== 'Admin' && role !== 'Manager') {
      return NextResponse.json({ success: false, error: 'Forbidden: Administrative privilege required' }, { status: 403 });
    }

    const metrics = await AdminService.getAdminMetrics();
    return NextResponse.json({ data: metrics });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch metrics', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
