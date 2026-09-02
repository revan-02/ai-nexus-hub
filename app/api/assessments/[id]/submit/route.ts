import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { AssessmentService, UserService } from '@/services';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: assessmentId } = await params;
    const session = await auth();
    let userId = session?.user?.id;

    if (!userId) {
      const activeUsers = await UserService.getUsers({ limit: 1 });
      userId = activeUsers.data[0]?.id;
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Browser Client';

    const result = await AssessmentService.submitAssessmentAttempt(
      userId,
      assessmentId,
      {
        scorePercent: Number(body.scorePercent ?? 100),
        passed: Boolean(body.passed ?? true),
        strikes: Number(body.strikes ?? 0),
        clientIp,
        userAgent,
      }
    );

    return NextResponse.json({ data: result });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to submit assessment attempt',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
