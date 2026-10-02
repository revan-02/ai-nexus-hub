import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';

// Helper: require admin role on server-side
async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    return { session: null, error: 'Unauthorized: Authentication required', status: 401 };
  }
  const role = (session.user as any)?.role;
  if (role !== 'Admin' && role !== 'Manager') {
    return { session, error: 'Forbidden: Administrative privilege required', status: 403 };
  }
  return { session, error: null, status: null };
}

// GET /api/admin/audit-logs
export async function GET(request: NextRequest) {
  const { error, status } = await requireAdmin();
  if (error) return NextResponse.json({ success: false, error }, { status: status! });

  try {
    const { default: prisma } = await import('@/lib/db/prisma');
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '20'));
    const type = searchParams.get('type') || '';
    const order = (searchParams.get('order') || 'desc') as 'asc' | 'desc';

    const where: Record<string, unknown> = {};
    if (type) where.type = type;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { timestamp: order },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return NextResponse.json({
      data: logs,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to fetch audit logs',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

// POST /api/admin/audit-logs — create an audit log entry (server-side identity only)
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, target, type } = body;

    if (!action || !target || !type) {
      return NextResponse.json({ error: 'action, target, and type are required' }, { status: 400 });
    }

    const { default: prisma } = await import('@/lib/db/prisma');

    // Derive identity from the authenticated session — never trust the body for userId
    const userId = (session.user as any).id || session.user.id;

    const log = await prisma.auditLog.create({
      data: {
        userId,
        action,
        target,
        type,
        timestamp: new Date(),
      },
    });

    return NextResponse.json({ success: true, data: log });
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to create audit log',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
