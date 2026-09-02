import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        rolePermissions: { include: { permission: true } },
        userRoles: { include: { user: { select: { id: true, name: true, avatar: true, email: true } } } },
      },
    });
    if (!role) return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    return NextResponse.json({ data: role });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch role', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const role = await prisma.role.update({ where: { id }, data: body });
    return NextResponse.json({ data: role });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update role', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const role = await prisma.role.findUnique({ where: { id } });
    if (!role) return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    if (role.isProtected) return NextResponse.json({ error: 'Cannot delete protected system role' }, { status: 403 });

    await prisma.role.delete({ where: { id } });
    return NextResponse.json({ message: 'Role deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete role', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
