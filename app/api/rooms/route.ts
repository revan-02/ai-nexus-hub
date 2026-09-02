import { NextRequest, NextResponse } from 'next/server';
import { RoomService } from '@/services';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    const result = await RoomService.getRooms(params);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch learning rooms', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
