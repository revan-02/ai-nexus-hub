import prisma from '@/lib/db/prisma';
import type { QueryParams, PaginatedResponse } from '@/types/api';
import type { AuditLogType } from '@prisma/client';

export interface CreateAuditLogInput {
  userId: string;
  action: string;
  target?: string;
  type: AuditLogType;
}

export async function createAuditLog(data: CreateAuditLogInput) {
  try {
    return await prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        target: data.target || '',
        type: data.type,
      },
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
      },
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // Non-blocking log creation to prevent interrupting core user actions
    return null;
  }
}

export async function getAuditLogs(params?: QueryParams): Promise<PaginatedResponse<any>> {
  const page = Number(params?.page || 1);
  const limit = Number(params?.limit || 20);
  const search = String(params?.search || '');
  const type = params?.type ? String(params.type) : undefined;
  const sortBy = String(params?.sortBy || 'timestamp');
  const order = (params?.order || 'desc') as 'asc' | 'desc';

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { action: { contains: search, mode: 'insensitive' } },
      { target: { contains: search, mode: 'insensitive' } },
      { user: { name: { contains: search, mode: 'insensitive' } } },
    ];
  }
  if (type) {
    where.type = type;
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: order },
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    data: logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}
