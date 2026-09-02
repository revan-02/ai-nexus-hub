import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const dataset = await prisma.dataset.findUnique({ where: { id } });
    if (!dataset) return NextResponse.json({ error: 'Dataset not found' }, { status: 404 });
    return NextResponse.json({ data: dataset });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch dataset', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const dataset = await prisma.dataset.update({ where: { id }, data: body });
    return NextResponse.json({ data: dataset });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json({ error: 'Dataset not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update dataset', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.dataset.delete({ where: { id } });
    return NextResponse.json({ message: 'Dataset deleted successfully' });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json({ error: 'Dataset not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete dataset', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
