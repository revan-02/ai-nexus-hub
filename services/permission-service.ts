import prisma from '@/lib/db/prisma';
import { createAuditLog } from './audit-service';
import type { QueryParams, PaginatedResponse } from '@/types/api';
import type { PermissionState } from '@prisma/client';

export async function getPermissions(params?: QueryParams): Promise<PaginatedResponse<any>> {
  const page = Number(params?.page || 1);
  const limit = Number(params?.limit || 20);
  const search = String(params?.search || '');
  const moduleName = params?.module ? String(params.module) : undefined;
  const sortBy = String(params?.sortBy || 'module');
  const order = (params?.order || 'asc') as 'asc' | 'desc';

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { key: { contains: search, mode: 'insensitive' } },
      { resource: { contains: search, mode: 'insensitive' } },
      { action: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (moduleName && moduleName !== 'All Modules') {
    where.module = moduleName;
  }

  const [permissions, total] = await Promise.all([
    prisma.permission.findMany({
      where,
      include: {
        _count: { select: { rolePermissions: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: order },
    }),
    prisma.permission.count({ where }),
  ]);

  const formattedPermissions = permissions.map((perm) => ({
    ...perm,
    rolesUsing: perm._count.rolePermissions,
    status: 'Active',
  }));

  return {
    data: formattedPermissions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function getPermissionMatrix() {
  const [roles, permissions, rolePermissions] = await Promise.all([
    prisma.role.findMany({
      select: { id: true, name: true, type: true },
      orderBy: { name: 'asc' },
    }),
    prisma.permission.findMany({
      orderBy: [{ module: 'asc' }, { resource: 'asc' }],
    }),
    prisma.rolePermissionMap.findMany(),
  ]);

  const map = new Map<string, PermissionState>();
  rolePermissions.forEach((rp) => {
    map.set(`${rp.roleId}:${rp.permissionId}`, rp.state);
  });

  return {
    roles,
    permissions,
    matrix: Array.from(map.entries()).reduce((acc, [key, state]) => {
      acc[key] = state;
      return acc;
    }, {} as Record<string, PermissionState>),
  };
}

export async function updateRolePermissionState(
  roleId: string,
  permissionId: string,
  state: PermissionState,
  actorUserId?: string
) {
  const role = await prisma.role.findUnique({ where: { id: roleId } });
  if (!role) throw new Error(`Role ${roleId} not found`);

  const updated = await prisma.rolePermissionMap.upsert({
    where: {
      roleId_permissionId: { roleId, permissionId },
    },
    update: { state },
    create: { roleId, permissionId, state },
  });

  if (actorUserId) {
    await createAuditLog({
      userId: actorUserId,
      action: `Updated permission state for role '${role.name}'`,
      target: `${roleId}:${permissionId}`,
      type: 'security',
    });
  }

  return updated;
}
