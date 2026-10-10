import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { ProjectService } from '@/services';

// GET /api/projects/[id]/comments — Fetch project reviews / feedback
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params;
    const project = await ProjectService.getProjectById(projectId);
    return NextResponse.json({
      data: project.comments || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch project reviews', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/projects/[id]/comments — Submit project review / rating
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params;
    const session = await auth();
    const body = await request.json();
    const { text, rating = 5 } = body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json({ error: 'Review text cannot be empty.' }, { status: 400 });
    }

    const userId = session?.user?.id || 'usr-1';
    const comment = await ProjectService.createProjectComment(projectId, userId, text.trim(), Number(rating) || 5);

    return NextResponse.json({ data: comment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to submit review', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
