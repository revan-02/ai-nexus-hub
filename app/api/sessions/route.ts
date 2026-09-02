import { NextRequest, NextResponse } from 'next/server';
import { SessionService } from '@/services';
import { createSessionSchema } from '@/schemas/session';

// GET /api/sessions — List sessions with search & filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    const result = await SessionService.getSessions(params);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch sessions', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/sessions — Create new session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = createSessionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Validation failed', details: validation.error.flatten() }, { status: 400 });
    }

    const session = await SessionService.createSession(validation.data as any);
    return NextResponse.json({ data: session }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create session', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE /api/sessions — Revoke ALL active sessions
export async function DELETE() {
  try {
    const result = await SessionService.revokeAllSessions();
    return NextResponse.json({ data: result });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to revoke sessions', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
