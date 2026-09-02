import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

// GET /api/courses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const level = searchParams.get('level') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = (searchParams.get('order') || 'desc') as 'asc' | 'desc';

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status) where.status = status;
    if (level) where.level = level;

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: { instructor: { select: { id: true, name: true, avatar: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: order },
      }),
      prisma.course.count({ where }),
    ]);

    return NextResponse.json({
      data: courses,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch courses', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/courses
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, category, level, price, instructorId } = body;

    if (!title || !description || !category || !level || !instructorId) {
      return NextResponse.json({ error: 'title, description, category, level, and instructorId are required' }, { status: 400 });
    }

    const course = await prisma.course.create({
      data: { title, description, category, level, price, instructorId },
      include: { instructor: { select: { id: true, name: true, avatar: true } } },
    });

    return NextResponse.json({ data: course }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create course', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
