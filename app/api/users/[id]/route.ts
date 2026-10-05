import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import prisma from '@/lib/db/prisma';

async function getSessionAndCheckAccess(requestedId: string) {
  const session = await auth();
  if (!session?.user) return { error: 'Unauthorized: Authentication required', status: 401, session: null };
  const role = (session.user as any)?.role;
  const currentUserId = (session.user as any)?.id;
  const isAdmin = role === 'Admin' || role === 'Manager';
  const isSelf = currentUserId === requestedId;
  return { session, isAdmin, isSelf, currentUserId, error: null, status: null };
}

// GET /api/users/[id]
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { error, status, isAdmin, isSelf } = await getSessionAndCheckAccess(id);
    if (error) return NextResponse.json({ error }, { status: status! });
    // Users can only view their own profile; Admins can view any
    if (!isAdmin && !isSelf) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const user = await prisma.user.findUnique({
      where: { id },
      include: { userRoles: { include: { role: true } } },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    // Remove password from response
    const { password: _pw, ...safeUser } = user as any;
    return NextResponse.json({ data: safeUser });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id]
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { error, status, isAdmin, isSelf } = await getSessionAndCheckAccess(id);
    if (error) return NextResponse.json({ error }, { status: status! });
    // Users can update their own profile; Admins can update any
    if (!isAdmin && !isSelf) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    // Non-admins cannot change their own role
    if (!isAdmin) {
      delete body.role;
      delete body.isActive;
    }

    const user = await prisma.user.update({
      where: { id },
      data: body,
    });

    const { password: _pw, ...safeUser } = user as any;
    return NextResponse.json({ data: safeUser });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(
      { error: 'Failed to update user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] (Admin only)
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { error, status, isAdmin } = await getSessionAndCheckAccess(id);
    if (error) return NextResponse.json({ error }, { status: status! });
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden: Administrative privilege required' }, { status: 403 });

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(
      { error: 'Failed to delete user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
