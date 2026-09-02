import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const assessment = await prisma.assessment.findUnique({
      where: { id },
      include: { course: { select: { id: true, title: true } } },
    });
    if (!assessment) return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    return NextResponse.json({ data: assessment });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch assessment', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const assessment = await prisma.assessment.update({ where: { id }, data: body });
    return NextResponse.json({ data: assessment });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update assessment', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.assessment.delete({ where: { id } });
    return NextResponse.json({ message: 'Assessment deleted successfully' });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete assessment', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
