import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const complexity = searchParams.get('complexity') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = (searchParams.get('order') || 'desc') as 'asc' | 'desc';

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status) where.status = status;
    if (complexity) where.complexity = complexity;

    const [algorithms, total] = await Promise.all([
      prisma.algorithm.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: order },
      }),
      prisma.algorithm.count({ where }),
    ]);

    return NextResponse.json({
      data: algorithms,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch algorithms', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, category, complexity, topic, languages } = body;

    if (!name || !description || !category || !complexity || !topic) {
      return NextResponse.json({ error: 'name, description, category, complexity, and topic are required' }, { status: 400 });
    }

    const algorithm = await prisma.algorithm.create({
      data: { name, description, category, complexity, topic, languages: languages || [], implementationsCount: body.implementationsCount || 0 },
    });

    return NextResponse.json({ data: algorithm }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create algorithm', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
