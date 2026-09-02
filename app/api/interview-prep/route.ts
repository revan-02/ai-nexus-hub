import { NextRequest, NextResponse } from 'next/server';
import {
  getInterviewQuestions,
  evaluateMockInterviewAnswer,
  ExperienceBracket
} from '@/services/interview-prep-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const experienceBracket = (searchParams.get('experience') as ExperienceBracket) || 'all';
    const category = searchParams.get('category') || 'all';
    const search = searchParams.get('search') || undefined;

    const questions = await getInterviewQuestions({
      experienceBracket,
      category,
      search,
    });

    return NextResponse.json({
      success: true,
      questions,
      count: questions.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch interview questions' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { questionId, candidateAnswer } = body;

    if (!questionId || !candidateAnswer) {
      return NextResponse.json(
        { success: false, error: 'questionId and candidateAnswer are required' },
        { status: 400 }
      );
    }

    const allQuestions = await getInterviewQuestions();
    const question = allQuestions.find((q) => q.id === questionId);

    if (!question) {
      return NextResponse.json({ success: false, error: 'Question not found' }, { status: 404 });
    }

    const evaluation = evaluateMockInterviewAnswer(question, candidateAnswer);

    return NextResponse.json({
      success: true,
      evaluation,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to evaluate interview answer' },
      { status: 500 }
    );
  }
}
