import prisma from '@/lib/db/prisma';
import { createAuditLog } from './audit-service';
import type { QueryParams, PaginatedResponse } from '@/types/api';
import type { CreateRoleInput, UpdateRoleInput } from '@/lib/api/endpoints/roles';
import type { RoleType, RoleStatus } from '@prisma/client';

export async function getRoles(params?: QueryParams): Promise<PaginatedResponse<any>> {
  const page = Number(params?.page || 1);
  const limit = Number(params?.limit || 20);
  const search = String(params?.search || '');
  const status = params?.status ? String(params.status) : undefined;
  const type = params?.type ? String(params.type) : undefined;
  const sortBy = String(params?.sortBy || 'createdAt');
  const order = (params?.order || 'desc') as 'asc' | 'desc';

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (status && status !== 'All Status') where.status = status as RoleStatus;
  if (type && type !== 'All Types') where.type = type as RoleType;

  const [roles, total] = await Promise.all([
    prisma.role.findMany({
      where,
      include: {
        rolePermissions: { include: { permission: true } },
        _count: { select: { userRoles: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: order },
    }),
    prisma.role.count({ where }),
  ]);

  const formattedRoles = roles.map((role) => ({
    ...role,
    usersCount: role._count.userRoles,
    permissionsCount: role.rolePermissions.length,
  }));

  return {
    data: formattedRoles,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function getRoleById(id: string) {
  const role = await prisma.role.findUnique({
    where: { id },
    include: {
      rolePermissions: { include: { permission: true } },
      userRoles: { include: { user: true } },
      _count: { select: { userRoles: true } },
    },
  });

  if (!role) {
    throw new Error(`Role with ID ${id} not found`);
  }

  return {
    ...role,
    usersCount: role._count.userRoles,
    permissionsCount: role.rolePermissions.length,
  };
}

export async function createRole(data: CreateRoleInput, actorUserId?: string) {
  const existing = await prisma.role.findUnique({
    where: { name: data.name },
  });

  if (existing) {
    throw new Error(`Role with name '${data.name}' already exists`);
  }

  const role = await prisma.role.create({
    data: {
      name: data.name,
      type: (data.type as RoleType) || 'Custom',
      description: data.description,
      status: (data.status as RoleStatus) || 'Active',
      iconName: data.iconName || 'Shield',
      iconBg: data.iconBg || 'bg-purple-600/20',
      iconColor: data.iconColor || 'text-purple-400',
      isProtected: data.isProtected ?? false,
    },
  });

  if (actorUserId) {
    await createAuditLog({
      userId: actorUserId,
      action: `Created new role '${role.name}'`,
      target: role.id,
      type: 'security',
    });
  }

  return role;
}

export async function updateRole(id: string, data: UpdateRoleInput, actorUserId?: string) {
  const role = await prisma.role.findUnique({ where: { id } });
  if (!role) {
    throw new Error(`Role with ID ${id} not found`);
  }

  if (role.isProtected && data.name && data.name !== role.name) {
    throw new Error(`Cannot rename protected system role '${role.name}'`);
  }

  const updatedRole = await prisma.role.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.description && { description: data.description }),
      ...(data.type && { type: data.type as RoleType }),
      ...(data.status && { status: data.status as RoleStatus }),
      ...(data.iconName && { iconName: data.iconName }),
      ...(data.iconBg && { iconBg: data.iconBg }),
      ...(data.iconColor && { iconColor: data.iconColor }),
    },
  });

  if (actorUserId) {
    await createAuditLog({
      userId: actorUserId,
      action: `Updated role '${updatedRole.name}'`,
      target: updatedRole.id,
      type: 'security',
    });
  }

  return updatedRole;
}

export async function deleteRole(id: string, actorUserId?: string) {
  const role = await prisma.role.findUnique({ where: { id } });
  if (!role) {
    throw new Error(`Role with ID ${id} not found`);
  }

  if (role.isProtected) {
    throw new Error(`Protected system role '${role.name}' cannot be deleted`);
  }

  await prisma.role.delete({ where: { id } });

  if (actorUserId) {
    await createAuditLog({
      userId: actorUserId,
      action: `Deleted custom role '${role.name}'`,
      target: role.id,
      type: 'security',
    });
  }

  return { success: true, message: `Role '${role.name}' deleted successfully` };
}

export async function duplicateRole(id: string, actorUserId?: string) {
  const sourceRole = await prisma.role.findUnique({
    where: { id },
    include: { rolePermissions: true },
  });

  if (!sourceRole) {
    throw new Error(`Source role with ID ${id} not found`);
  }

  const duplicatedName = `${sourceRole.name} (Copy ${Date.now().toString().slice(-4)})`;

  const newRole = await prisma.role.create({
    data: {
      name: duplicatedName,
      type: 'Custom',
      description: `Copy of ${sourceRole.name}`,
      status: 'Active',
      iconName: sourceRole.iconName,
      iconBg: sourceRole.iconBg,
      iconColor: sourceRole.iconColor,
      isProtected: false,
      rolePermissions: {
        create: sourceRole.rolePermissions.map((rp) => ({
          permissionId: rp.permissionId,
          state: rp.state,
        })),
      },
    },
    include: { rolePermissions: true },
  });

  if (actorUserId) {
    await createAuditLog({
      userId: actorUserId,
      action: `Duplicated role '${sourceRole.name}' to '${newRole.name}'`,
      target: newRole.id,
      type: 'security',
    });
  }

  return newRole;
}
