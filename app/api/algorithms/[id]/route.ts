import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const algorithm = await prisma.algorithm.findUnique({ where: { id } });
    if (!algorithm) return NextResponse.json({ error: 'Algorithm not found' }, { status: 404 });
    return NextResponse.json({ data: algorithm });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch algorithm', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const algorithm = await prisma.algorithm.update({ where: { id }, data: body });
    return NextResponse.json({ data: algorithm });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json({ error: 'Algorithm not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update algorithm', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.algorithm.delete({ where: { id } });
    return NextResponse.json({ message: 'Algorithm deleted successfully' });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json({ error: 'Algorithm not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete algorithm', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
