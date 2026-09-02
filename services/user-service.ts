import bcrypt from 'bcryptjs';
import prisma from '@/lib/db/prisma';
import { createAuditLog } from './audit-service';
import type { QueryParams, PaginatedResponse } from '@/types/api';
import type { CreateUserInput, UpdateUserInput } from '@/lib/api/endpoints/users';
import type { UserRole, UserStatus } from '@prisma/client';

export async function getUsers(params?: QueryParams): Promise<PaginatedResponse<any>> {
  const page = Number(params?.page || 1);
  const limit = Number(params?.limit || 20);
  const search = String(params?.search || '');
  const status = params?.status ? String(params.status) : undefined;
  const role = params?.role ? String(params.role) : undefined;
  const sortBy = String(params?.sortBy || 'createdAt');
  const order = (params?.order || 'desc') as 'asc' | 'desc';

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { username: { contains: search, mode: 'insensitive' } },
      { organization: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (status && status !== 'All Status') where.status = status as UserStatus;
  if (role && role !== 'All Roles') where.role = role as UserRole;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: order },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    data: users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      courses: true,
      projects: true,
      userRoles: { include: { role: true } },
    },
  });

  if (!user) {
    throw new Error(`User with ID ${id} not found`);
  }

  return user;
}

export async function createUser(data: CreateUserInput, actorUserId?: string) {
  // Format username with leading @ if missing
  const formattedUsername = data.username.startsWith('@') ? data.username : `@${data.username}`;

  // Check unique constraints
  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email: data.email }, { username: formattedUsername }],
    },
  });

  if (existing) {
    throw new Error('User with this email or username already exists');
  }

  const hashedPassword = await bcrypt.hash('password123', 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      username: formattedUsername,
      email: data.email,
      password: hashedPassword,
      avatar: data.avatar || null,
      role: (data.role as UserRole) || 'User',
      organization: data.organization || null,
      status: (data.status as UserStatus) || 'Active',
      emailVerified: data.emailVerified ?? false,
    },
  });

  if (actorUserId) {
    await createAuditLog({
      userId: actorUserId,
      action: `Created user account '${user.name}' (${user.email})`,
      target: user.id,
      type: 'user',
    });
  }

  return user;
}

export async function updateUser(id: string, data: UpdateUserInput, actorUserId?: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new Error(`User with ID ${id} not found`);
  }

  const updateData: Record<string, unknown> = {};
  if (data.name) updateData.name = data.name;
  if (data.username) {
    updateData.username = data.username.startsWith('@') ? data.username : `@${data.username}`;
  }
  if (data.email) updateData.email = data.email;
  if (data.avatar !== undefined) updateData.avatar = data.avatar;
  if (data.role) updateData.role = data.role as UserRole;
  if (data.organization !== undefined) updateData.organization = data.organization;
  if (data.status) updateData.status = data.status as UserStatus;

  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateData,
  });

  if (actorUserId) {
    await createAuditLog({
      userId: actorUserId,
      action: `Updated user account '${updatedUser.name}'`,
      target: updatedUser.id,
      type: 'user',
    });
  }

  return updatedUser;
}

export async function deleteUser(id: string, actorUserId?: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new Error(`User with ID ${id} not found`);
  }

  await prisma.user.delete({ where: { id } });

  if (actorUserId) {
    await createAuditLog({
      userId: actorUserId,
      action: `Deleted user account '${user.name}' (${user.email})`,
      target: user.id,
      type: 'user',
    });
  }

  return { success: true, message: `User ${user.name} deleted successfully` };
}

export async function bulkSuspendUsers(ids: string[], actorUserId?: string) {
  await prisma.user.updateMany({
    where: { id: { in: ids } },
    data: { status: 'Suspended' },
  });

  if (actorUserId) {
    await createAuditLog({
      userId: actorUserId,
      action: `Bulk suspended ${ids.length} users`,
      target: ids.join(','),
      type: 'security',
    });
  }

  return { success: true, count: ids.length };
}

export async function bulkDeleteUsers(ids: string[], actorUserId?: string) {
  await prisma.user.deleteMany({
    where: { id: { in: ids } },
  });

  if (actorUserId) {
    await createAuditLog({
      userId: actorUserId,
      action: `Bulk deleted ${ids.length} users`,
      target: ids.join(','),
      type: 'user',
    });
  }

  return { success: true, count: ids.length };
}
