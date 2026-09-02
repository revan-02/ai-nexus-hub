import { NextRequest, NextResponse } from 'next/server';
import { ProjectService } from '@/services';
import { auth } from '@/lib/auth/auth';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const project = await ProjectService.getProjectById(id);
    return NextResponse.json({ data: project });
  } catch (error) {
    return NextResponse.json(
      { error: 'Project not found', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 404 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const { id } = await params;
    const body = await request.json();
    const project = await ProjectService.updateProject(id, body, session?.user?.id);
    return NextResponse.json({ data: project });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update project', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const { id } = await params;
    const result = await ProjectService.deleteProject(id, session?.user?.id);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete project', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
