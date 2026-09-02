import prisma from '@/lib/db/prisma';
import { createAuditLog } from './audit-service';
import type { QueryParams, PaginatedResponse } from '@/types/api';
import type { SessionStatus } from '@prisma/client';

export interface CreateSessionInput {
  userId: string;
  ip: string;
  location: string;
  device: string;
  authMethod?: string;
  duration?: string;
  status?: SessionStatus;
  lastActive?: string;
}

export interface UpdateSessionInput {
  status?: SessionStatus;
  lastActive?: string;
  duration?: string;
}

export async function getSessions(params?: QueryParams): Promise<PaginatedResponse<any>> {
  const page = Number(params?.page || 1);
  const limit = Number(params?.limit || 20);
  const search = String(params?.search || '');
  const status = params?.status ? String(params.status) : undefined;
  const sortBy = String(params?.sortBy || 'createdAt');
  const order = (params?.order || 'desc') as 'asc' | 'desc';

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { ip: { contains: search, mode: 'insensitive' } },
      { location: { contains: search, mode: 'insensitive' } },
      { device: { contains: search, mode: 'insensitive' } },
      { user: { name: { contains: search, mode: 'insensitive' } } },
      { user: { email: { contains: search, mode: 'insensitive' } } },
    ];
  }
  if (status && status !== 'All Status') where.status = status as SessionStatus;

  const [sessions, total] = await Promise.all([
    prisma.userSession.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: order },
    }),
    prisma.userSession.count({ where }),
  ]);

  return {
    data: sessions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function getSessionById(id: string) {
  const session = await prisma.userSession.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, avatar: true } },
    },
  });

  if (!session) throw new Error(`Session with ID ${id} not found`);
  return session;
}

export async function createSession(data: CreateSessionInput, actorUserId?: string) {
  const session = await prisma.userSession.create({
    data: {
      userId: data.userId,
      ip: data.ip,
      location: data.location,
      device: data.device,
      authMethod: data.authMethod || 'Password',
      duration: data.duration || '0m',
      status: data.status || 'Active',
      lastActive: data.lastActive || 'Just now',
    },
    include: {
      user: { select: { id: true, name: true, email: true, avatar: true } },
    },
  });

  if (actorUserId) {
    await createAuditLog({
      userId: actorUserId,
      action: `Created new session for user ${session.user.name} (${session.ip})`,
      target: session.id,
      type: 'security',
    });
  }

  return session;
}

export async function updateSession(id: string, data: UpdateSessionInput, actorUserId?: string) {
  const session = await prisma.userSession.findUnique({ where: { id } });
  if (!session) throw new Error(`Session with ID ${id} not found`);

  const updated = await prisma.userSession.update({
    where: { id },
    data: {
      ...(data.status && { status: data.status }),
      ...(data.lastActive && { lastActive: data.lastActive }),
      ...(data.duration && { duration: data.duration }),
    },
    include: {
      user: { select: { id: true, name: true, email: true, avatar: true } },
    },
  });

  if (actorUserId) {
    await createAuditLog({
      userId: actorUserId,
      action: `Updated session ${session.id} status to ${updated.status}`,
      target: session.id,
      type: 'security',
    });
  }

  return updated;
}

export async function revokeSession(id: string, actorUserId?: string) {
  return updateSession(id, { status: 'Revoked' }, actorUserId);
}

export async function revokeAllSessions(actorUserId?: string) {
  const result = await prisma.userSession.updateMany({
    where: { status: { in: ['Active', 'Idle'] } },
    data: { status: 'Revoked' },
  });

  if (actorUserId) {
    await createAuditLog({
      userId: actorUserId,
      action: `Revoked all active user sessions (${result.count} sessions)`,
      target: 'global_revoke',
      type: 'security',
    });
  }

  return { success: true, count: result.count };
}

export async function deleteSession(id: string, actorUserId?: string) {
  const session = await prisma.userSession.findUnique({ where: { id } });
  if (!session) throw new Error(`Session with ID ${id} not found`);

  await prisma.userSession.delete({ where: { id } });

  if (actorUserId) {
    await createAuditLog({
      userId: actorUserId,
      action: `Deleted session record ${session.id}`,
      target: session.id,
      type: 'security',
    });
  }

  return { success: true, message: `Session ${session.id} deleted` };
}
