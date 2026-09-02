import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { RoomService } from '@/services';
import { createRoomSchema } from '@/schemas/room';
import prisma from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    const result = await RoomService.getRooms(params);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch rooms', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    // Verify admin role if present
    const userRole = (session?.user as { role?: string })?.role;
    if (session?.user && userRole !== 'Admin' && userRole !== 'Super Admin' && userRole !== 'Instructor' && userRole !== 'Editor') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const parsed = createRoomSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const room = await RoomService.createRoom(parsed.data);
    return NextResponse.json({ data: room }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create learning room', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
