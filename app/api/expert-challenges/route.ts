import { NextRequest, NextResponse } from 'next/server';
import {
  getAllExpertChallenges,
  getExpertChallengeById,
  submitChallengeSolution
} from '@/services/expert-challenges-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain') || undefined;
    const difficulty = searchParams.get('difficulty') || undefined;
    const search = searchParams.get('search') || undefined;
    const id = searchParams.get('id') || undefined;

    if (id) {
      const challenge = await getExpertChallengeById(id);
      if (!challenge) {
        return NextResponse.json({ success: false, error: 'Challenge not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: challenge });
    }

    const list = await getAllExpertChallenges({ domain, difficulty, search });
    return NextResponse.json({ success: true, data: list, count: list.length });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch challenges' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { challengeId, codeSolution } = body;

    if (!challengeId) {
      return NextResponse.json(
        { success: false, error: 'challengeId is required' },
        { status: 400 }
      );
    }

    const result = submitChallengeSolution(challengeId, codeSolution || '');
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to evaluate challenge submission' },
      { status: 500 }
    );
  }
}
