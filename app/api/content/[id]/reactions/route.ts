import { NextRequest, NextResponse } from 'next/server';
import { InteractionService } from '@/services';

// GET /api/content/[id]/reactions — Get reaction summary and user state
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: contentId } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'usr-1';

    const summary = await InteractionService.getInteractionSummary(contentId, userId);
    return NextResponse.json({ data: summary });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch reaction summary', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/content/[id]/reactions — Toggle Reaction or Rating (Registered Users Only)
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: contentId } = await params;
    const body = await request.json();
    const { reaction, rating, userId = 'usr-1' } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Only registered users can rate or react to content' }, { status: 401 });
    }

    let summary;
    if (rating !== undefined) {
      summary = await InteractionService.rateContent(userId, contentId, Number(rating));
    } else if (reaction) {
      summary = await InteractionService.toggleReaction(userId, contentId, reaction);
    } else {
      return NextResponse.json({ error: 'Provide either reaction or rating' }, { status: 400 });
    }

    return NextResponse.json({ data: summary });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update reaction', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
