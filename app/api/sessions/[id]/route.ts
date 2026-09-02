import { NextRequest, NextResponse } from 'next/server';
import { SessionService } from '@/services';
import { updateSessionSchema } from '@/schemas/session';

// GET /api/sessions/[id]
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await SessionService.getSessionById(id);
    return NextResponse.json({ data: session });
  } catch (error) {
    return NextResponse.json(
      { error: 'Session not found', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 404 }
    );
  }
}

// PUT /api/sessions/[id] — Update / Revoke session
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validation = updateSessionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Validation failed', details: validation.error.flatten() }, { status: 400 });
    }

    const session = await SessionService.updateSession(id, validation.data as any);
    return NextResponse.json({ data: session });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update session', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE /api/sessions/[id] — Delete session record
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await SessionService.deleteSession(id);
    return NextResponse.json({ data: result });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete session', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
