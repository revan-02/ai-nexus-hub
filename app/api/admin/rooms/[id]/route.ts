import { NextRequest, NextResponse } from 'next/server';
import { RoomService } from '@/services';
import { updateRoomSchema } from '@/schemas/room';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const room = await RoomService.getRoomById(id);
    return NextResponse.json({ data: room });
  } catch (error) {
    return NextResponse.json(
      { error: 'Room not found', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 404 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateRoomSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const updated = await RoomService.updateRoom(id, parsed.data);
    return NextResponse.json({ data: updated });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update room', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const deleted = await RoomService.deleteRoom(id);
    return NextResponse.json({ data: deleted });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete room', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
