import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { RoomService } from '@/services';
import { submitAnswerSchema } from '@/schemas/room';
import { checkRateLimit, rateLimitResponse } from '@/lib/rate-limit';
import { logEvent } from '@/lib/logger';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      logEvent('security', { event: 'UNAUTHENTICATED_TASK_SUBMISSION_ATTEMPT', target: request.url });
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // User-aware Rate Limiting Security Check
    const rateCheck = await checkRateLimit(request, session.user.id, 20, 60000);
    if (!rateCheck.success) {
      logEvent('security', {
        event: 'TASK_SUBMISSION_RATE_LIMITED',
        userId: session.user.id,
        target: request.url,
      });
      return rateLimitResponse(rateCheck.reset);
    }

    const { id: roomId, taskId } = await params;
    const body = await request.json();

    const parsed = submitAnswerSchema.safeParse(body);
    if (!parsed.success) {
      logEvent('warn', {
        event: 'INVALID_TASK_SUBMISSION_PAYLOAD',
        userId: session.user.id,
        target: taskId,
      });
      return NextResponse.json(
        { error: 'Invalid submission', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { answer, timeSpentSec } = parsed.data;

    const result = await RoomService.submitTaskAnswer(
      roomId,
      taskId,
      answer,
      session.user.id,
      timeSpentSec
    );

    logEvent('info', {
      event: 'TASK_SUBMITTED',
      userId: session.user.id,
      target: taskId,
      metadata: { isCorrect: result.isCorrect, xpEarned: result.xpEarned },
    });

    return NextResponse.json({ data: result });
  } catch (error) {
    logEvent('error', {
      event: 'TASK_SUBMISSION_ERROR',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return NextResponse.json(
      { error: 'Task submission failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
