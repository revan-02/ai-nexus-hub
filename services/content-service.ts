import prisma from '@/lib/db/prisma';
import { createAuditLog } from './audit-service';
import type { QueryParams, PaginatedResponse } from '@/types/api';
import type { CreateContentInput, UpdateContentInput } from '@/lib/api/endpoints/content';
import type { ContentStatus, ContentType } from '@prisma/client';

export async function getContents(params?: QueryParams): Promise<PaginatedResponse<any>> {
  const page = Number(params?.page || 1);
  const limit = Number(params?.limit || 20);
  const search = String(params?.search || '');
  const status = params?.status ? String(params.status) : undefined;
  const type = params?.type ? String(params.type) : undefined;
  const category = params?.category ? String(params.category) : undefined;
  const sortBy = String(params?.sortBy || 'createdAt');
  const order = (params?.order || 'desc') as 'asc' | 'desc';

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { category: { contains: search, mode: 'insensitive' } },
      { author: { name: { contains: search, mode: 'insensitive' } } },
    ];
  }
  if (status && status !== 'All Status') where.status = status as ContentStatus;
  if (type && type !== 'All Types') where.type = type as ContentType;
  if (category && category !== 'All Categories') where.category = category;

  const [contents, total] = await Promise.all([
    prisma.content.findMany({
      where,
      include: {
        author: { select: { id: true, name: true, avatar: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: order },
    }),
    prisma.content.count({ where }),
  ]);

  return {
    data: contents,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function getContentById(id: string) {
  const content = await prisma.content.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, avatar: true, email: true } },
    },
  });

  if (!content) {
    throw new Error(`Content with ID ${id} not found`);
  }

  return content;
}

export async function createContent(data: CreateContentInput, actorUserId?: string) {
  const author = await prisma.user.findUnique({ where: { id: data.authorId } });
  if (!author) {
    throw new Error(`Author user with ID ${data.authorId} not found`);
  }

  const content = await prisma.content.create({
    data: {
      title: data.title,
      description: data.description,
      type: data.type as ContentType,
      category: data.category,
      subCategory: data.subCategory || null,
      authorId: data.authorId,
      status: (data.status as ContentStatus) || 'Draft',
      thumbnailIcon: data.thumbnailIcon || 'FileText',
    },
    include: {
      author: { select: { id: true, name: true, avatar: true } },
    },
  });

  if (actorUserId) {
    await createAuditLog({
      userId: actorUserId,
      action: `Created new ${content.type} content '${content.title}'`,
      target: content.id,
      type: 'course',
    });
  }

  return content;
}

export async function updateContent(id: string, data: UpdateContentInput, actorUserId?: string) {
  const content = await prisma.content.findUnique({ where: { id } });
  if (!content) {
    throw new Error(`Content with ID ${id} not found`);
  }

  const updated = await prisma.content.update({
    where: { id },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.description && { description: data.description }),
      ...(data.type && { type: data.type as ContentType }),
      ...(data.category && { category: data.category }),
      ...(data.subCategory !== undefined && { subCategory: data.subCategory }),
      ...(data.status && { status: data.status as ContentStatus }),
      ...(data.thumbnailIcon && { thumbnailIcon: data.thumbnailIcon }),
    },
    include: {
      author: { select: { id: true, name: true, avatar: true } },
    },
  });

  if (actorUserId) {
    await createAuditLog({
      userId: actorUserId,
      action: `Updated content '${updated.title}' (Status: ${updated.status})`,
      target: updated.id,
      type: 'course',
    });
  }

  return updated;
}

export async function deleteContent(id: string, actorUserId?: string) {
  const content = await prisma.content.findUnique({ where: { id } });
  if (!content) {
    throw new Error(`Content with ID ${id} not found`);
  }

  await prisma.content.delete({ where: { id } });

  if (actorUserId) {
    await createAuditLog({
      userId: actorUserId,
      action: `Deleted content '${content.title}'`,
      target: content.id,
      type: 'course',
    });
  }

  return { success: true, message: `Content '${content.title}' deleted successfully` };
}

export async function publishContent(id: string, actorUserId?: string) {
  return updateContent(id, { status: 'Published' }, actorUserId);
}

export async function archiveContent(id: string, actorUserId?: string) {
  return updateContent(id, { status: 'Archived' }, actorUserId);
}
