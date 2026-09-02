import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { ProjectService } from '@/services';
import prisma from '@/lib/db/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id: projectId } = await params;
    const body = await request.json();
    const { text, rating } = body;

    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'Comment text is required' }, { status: 400 });
    }

    let userId = session?.user?.id;
    if (!userId) {
      const firstUser = await prisma.user.findFirst();
      if (!firstUser) {
        return NextResponse.json({ error: 'User authentication required' }, { status: 401 });
      }
      userId = firstUser.id;
    }

    const comment = await ProjectService.createProjectComment(
      projectId,
      userId,
      text.trim(),
      Number(rating) || 5
    );

    return NextResponse.json({ data: comment }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to post comment', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
