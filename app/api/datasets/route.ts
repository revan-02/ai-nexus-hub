import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
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

    const [datasets, total] = await Promise.all([
      prisma.dataset.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: order },
      }),
      prisma.dataset.count({ where }),
    ]);

    return NextResponse.json({
      data: datasets,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch datasets', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, category, domain, size, format, license } = body;

    if (!name || !description || !category || !domain || !size || !format || !license) {
      return NextResponse.json({ error: 'name, description, category, domain, size, format, and license are required' }, { status: 400 });
    }

    const dataset = await prisma.dataset.create({ data: body });
    return NextResponse.json({ data: dataset }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create dataset', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
