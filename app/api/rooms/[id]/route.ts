import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { RoomService } from '@/services';
import { getFallbackRoom } from '@/services/fallback-rooms';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    const userId = session?.user?.id;

    try {
      const room = await RoomService.getRoomById(id, userId);
      if (room) {
        return NextResponse.json({ data: room });
      }
    } catch (roomErr) {
      console.warn(`RoomService error for room ${id}, using fallback:`, roomErr);
    }

    const fallback = getFallbackRoom(id);
    return NextResponse.json({
      data: {
        id: fallback.id,
        title: fallback.title,
        description: fallback.description,
        level: fallback.level,
        tier: fallback.tier,
        category: fallback.category,
        estimatedTime: fallback.estimatedTime,
        xpReward: fallback.xpReward,
        iconName: fallback.iconName,
        ageGroup: fallback.ageGroup,
        isPublished: true,
        tasks: fallback.tasks.map((t) => ({
          id: t.id,
          orderNumber: t.orderNumber,
          title: t.title,
          instructions: t.instructions,
          taskType: t.taskType,
          codeSnippet: t.codeSnippet || null,
          hint: t.hint || null,
          questionText: t.questionText,
          options: t.options,
          taskContent: null,
          imageUrl: null,
          difficulty: t.difficulty,
          ageGroup: fallback.ageGroup,
          isRequired: true,
          passingScore: t.passingScore,
          xpReward: t.xpReward,
          completed: false,
          passed: false,
          score: 0,
          attempts: 0,
          xpEarned: 0,
          locked: false,
        })),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Learning room not found', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 404 }
    );
  }
}
