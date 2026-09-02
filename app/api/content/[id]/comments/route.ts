import { NextRequest, NextResponse } from 'next/server';
import { InteractionService } from '@/services';

// GET /api/content/[id]/comments — Fetch comment thread
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: contentId } = await params;
    const comments = await InteractionService.getComments(contentId);
    return NextResponse.json({ data: comments });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch comments', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/content/[id]/comments — Add comment (Registered Users Only)
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: contentId } = await params;
    const body = await request.json();
    const { text, userId = 'usr-1' } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Only registered users can post comments' }, { status: 401 });
    }

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Comment text is required' }, { status: 400 });
    }

    const comment = await InteractionService.addComment(userId, contentId, text);
    return NextResponse.json({ data: comment }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to post comment', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    );
  }
}
