import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { DashboardService } from '@/services';

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const data = await DashboardService.getLearnerDashboardData(userId);
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to fetch learner dashboard data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
