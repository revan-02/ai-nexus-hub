import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const module = searchParams.get('module') || '';
    const type = searchParams.get('type') || '';
    const search = searchParams.get('search') || '';

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { key: { contains: search, mode: 'insensitive' } },
        { resource: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (module) where.module = module;
    if (type) where.type = type;

    const permissions = await prisma.permission.findMany({
      where,
      include: {
        rolePermissions: {
          include: { role: { select: { id: true, name: true } } },
        },
      },
      orderBy: { module: 'asc' },
    });

    return NextResponse.json({ data: permissions });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch permissions', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, name, module, resource, action } = body;

    if (!key || !name || !module || !resource || !action) {
      return NextResponse.json({ error: 'key, name, module, resource, and action are required' }, { status: 400 });
    }

    const permission = await prisma.permission.create({ data: { key, name, module, resource, action, type: body.type || 'Custom' } });
    return NextResponse.json({ data: permission }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json({ error: 'Permission key already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create permission', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
