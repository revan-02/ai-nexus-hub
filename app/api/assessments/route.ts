import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const type = searchParams.get('type') || '';
    const difficulty = searchParams.get('difficulty') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = (searchParams.get('order') || 'desc') as 'asc' | 'desc';

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status) where.status = status;
    if (type) where.type = type;
    if (difficulty) where.difficulty = difficulty;

    const [assessments, total] = await Promise.all([
      prisma.assessment.findMany({
        where,
        include: { course: { select: { id: true, title: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: order },
      }),
      prisma.assessment.count({ where }),
    ]);

    return NextResponse.json({
      data: assessments,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch assessments', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, type, category, difficulty, questionsCount, duration } = body;

    if (!name || !description || !type || !category || !difficulty || !duration) {
      return NextResponse.json({ error: 'name, description, type, category, difficulty, and duration are required' }, { status: 400 });
    }

    const assessment = await prisma.assessment.create({
      data: { name, description, type, category, difficulty, questionsCount: questionsCount || 0, duration, courseId: body.courseId },
    });

    return NextResponse.json({ data: assessment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create assessment', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
