import prisma from '@/lib/db/prisma';
import { createAuditLog } from './audit-service';
import type { QueryParams, PaginatedResponse } from '@/types/api';
import type { ProjectLevel, ProjectStatus } from '@prisma/client';

export async function getProjects(params?: QueryParams): Promise<PaginatedResponse<any>> {
  const page = Number(params?.page || 1);
  const limit = Number(params?.limit || 20);
  const search = String(params?.search || '');
  const level = params?.level ? String(params.level) : undefined;
  const status = params?.status ? String(params.status) : undefined;
  const sortBy = String(params?.sortBy || 'createdAt');
  const order = (params?.order || 'desc') as 'asc' | 'desc';

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { category: { contains: search, mode: 'insensitive' } },
      { author: { name: { contains: search, mode: 'insensitive' } } },
    ];
  }
  if (level && level !== 'All Levels') where.level = level as ProjectLevel;
  if (status && status !== 'All Status') where.status = status as ProjectStatus;

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      include: {
        author: { select: { id: true, name: true, avatar: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: order },
    }),
    prisma.project.count({ where }),
  ]);

  return {
    data: projects,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function getProjectById(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, avatar: true, email: true } },
      comments: {
        include: {
          user: { select: { id: true, name: true, avatar: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!project) throw new Error(`Project with ID ${id} not found`);
  return project;
}

export async function createProjectComment(projectId: string, userId: string, text: string, rating?: number) {
  const comment = await prisma.projectComment.create({
    data: {
      projectId,
      userId,
      text,
      rating: rating || 5,
    },
    include: {
      user: { select: { id: true, name: true, avatar: true } },
    },
  });
  return comment;
}

export async function createProject(data: any, actorUserId?: string) {
  const author = await prisma.user.findUnique({ where: { id: data.authorId } });
  if (!author) throw new Error(`Author user with ID ${data.authorId} not found`);

  const project = await prisma.project.create({
    data: {
      name: data.name,
      description: data.description,
      category: data.category,
      level: (data.level as ProjectLevel) || 'Intermediate',
      technologies: data.technologies || ['React', 'TypeScript'],
      status: (data.status as ProjectStatus) || 'Draft',
      views: data.views || '0',
      thumbnailIcon: data.thumbnailIcon || 'Layout',
      authorId: data.authorId,
    },
    include: {
      author: { select: { id: true, name: true, avatar: true } },
    },
  });

  if (actorUserId) {
    await createAuditLog({
      userId: actorUserId,
      action: `Created project '${project.name}'`,
      target: project.id,
      type: 'user',
    });
  }

  return project;
}

export async function updateProject(id: string, data: any, actorUserId?: string) {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) throw new Error(`Project with ID ${id} not found`);

  const updated = await prisma.project.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.description && { description: data.description }),
      ...(data.category && { category: data.category }),
      ...(data.level && { level: data.level as ProjectLevel }),
      ...(data.technologies && { technologies: data.technologies }),
      ...(data.status && { status: data.status as ProjectStatus }),
    },
    include: {
      author: { select: { id: true, name: true, avatar: true } },
    },
  });

  if (actorUserId) {
    await createAuditLog({
      userId: actorUserId,
      action: `Updated project '${updated.name}'`,
      target: updated.id,
      type: 'user',
    });
  }

  return updated;
}

export async function deleteProject(id: string, actorUserId?: string) {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) throw new Error(`Project with ID ${id} not found`);

  await prisma.project.delete({ where: { id } });

  if (actorUserId) {
    await createAuditLog({
      userId: actorUserId,
      action: `Deleted project '${project.name}'`,
      target: project.id,
      type: 'user',
    });
  }

  return { success: true, message: `Project '${project.name}' deleted successfully` };
}

export async function incrementProjectViews(id: string) {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) throw new Error(`Project with ID ${id} not found`);

  const currentViews = parseInt(project.views.replace(/,/g, '')) || 0;
  const newViews = (currentViews + 1).toLocaleString();

  return await prisma.project.update({
    where: { id },
    data: { views: newViews },
  });
}
