import { NextRequest, NextResponse } from 'next/server';
import { RoomService } from '@/services';
import { createTaskSchema } from '@/schemas/room';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: roomId } = await params;
    const body = await request.json();

    const parsed = createTaskSchema.safeParse({ ...body, roomId });
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Task validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const task = await RoomService.createTask(parsed.data);
    return NextResponse.json({ data: task }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create task', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: roomId } = await params;
    const body = await request.json();

    // Check if reordering request
    if (Array.isArray(body.taskIds)) {
      const result = await RoomService.reorderTasks(roomId, body.taskIds);
      return NextResponse.json({ data: result });
    }

    const { taskId, ...taskData } = body;
    if (!taskId) {
      return NextResponse.json({ error: 'taskId is required' }, { status: 400 });
    }

    const updated = await RoomService.updateTask(taskId, taskData);
    return NextResponse.json({ data: updated });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update task', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json({ error: 'taskId query param required' }, { status: 400 });
    }

    const deleted = await RoomService.deleteTask(taskId);
    return NextResponse.json({ data: deleted });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete task', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
