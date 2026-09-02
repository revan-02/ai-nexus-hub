import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { RoomService } from '@/services';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { id: roomId } = await params;
    const progress = await RoomService.getRoomProgress(roomId, session.user.id);
    return NextResponse.json({ data: progress });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch progress', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
