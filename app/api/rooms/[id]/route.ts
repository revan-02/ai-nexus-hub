import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { RoomService } from '@/services';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    const userId = session?.user?.id;

    const room = await RoomService.getRoomById(id, userId);
    return NextResponse.json({ data: room });
  } catch (error) {
    return NextResponse.json(
      { error: 'Learning room not found', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 404 }
    );
  }
}
