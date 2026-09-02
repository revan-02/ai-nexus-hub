import prisma from '@/lib/db/prisma';
import { createAuditLog } from './audit-service';
import type { QueryParams, PaginatedResponse } from '@/types/api';
import type { AlgorithmComplexity, AlgorithmStatus } from '@prisma/client';

export async function getAlgorithms(params?: QueryParams): Promise<PaginatedResponse<any>> {
  const page = Number(params?.page || 1);
  const limit = Number(params?.limit || 20);
  const search = String(params?.search || '');
  const complexity = params?.complexity ? String(params.complexity) : undefined;
  const status = params?.status ? String(params.status) : undefined;
  const sortBy = String(params?.sortBy || 'createdAt');
  const order = (params?.order || 'desc') as 'asc' | 'desc';

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { category: { contains: search, mode: 'insensitive' } },
      { topic: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (complexity && complexity !== 'All Complexities') where.complexity = complexity as AlgorithmComplexity;
  if (status && status !== 'All Status') where.status = status as AlgorithmStatus;

  const [algorithms, total] = await Promise.all([
    prisma.algorithm.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: order },
    }),
    prisma.algorithm.count({ where }),
  ]);

  return {
    data: algorithms,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function getAlgorithmById(id: string) {
  const algorithm = await prisma.algorithm.findUnique({ where: { id } });
  if (!algorithm) throw new Error(`Algorithm with ID ${id} not found`);
  return algorithm;
}

export async function createAlgorithm(data: any, actorUserId?: string) {
  const algorithm = await prisma.algorithm.create({
    data: {
      name: data.name,
      description: data.description,
      category: data.category,
      complexity: (data.complexity as AlgorithmComplexity) || 'Medium',
      topic: data.topic || 'Machine Learning',
      implementationsCount: data.implementationsCount || 1,
      languages: data.languages || ['Python', 'TypeScript'],
      status: (data.status as AlgorithmStatus) || 'Published',
      iconName: data.iconName || 'Code',
    },
  });

  if (actorUserId) {
    await createAuditLog({
      userId: actorUserId,
      action: `Cataloged new algorithm '${algorithm.name}'`,
      target: algorithm.id,
      type: 'course',
    });
  }

  return algorithm;
}

export async function updateAlgorithm(id: string, data: any, actorUserId?: string) {
  const algorithm = await prisma.algorithm.findUnique({ where: { id } });
  if (!algorithm) throw new Error(`Algorithm with ID ${id} not found`);

  const updated = await prisma.algorithm.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.description && { description: data.description }),
      ...(data.category && { category: data.category }),
      ...(data.complexity && { complexity: data.complexity as AlgorithmComplexity }),
      ...(data.topic && { topic: data.topic }),
      ...(data.languages && { languages: data.languages }),
      ...(data.status && { status: data.status as AlgorithmStatus }),
    },
  });

  if (actorUserId) {
    await createAuditLog({
      userId: actorUserId,
      action: `Updated algorithm '${updated.name}'`,
      target: updated.id,
      type: 'course',
    });
  }

  return updated;
}

export async function deleteAlgorithm(id: string, actorUserId?: string) {
  const algorithm = await prisma.algorithm.findUnique({ where: { id } });
  if (!algorithm) throw new Error(`Algorithm with ID ${id} not found`);

  await prisma.algorithm.delete({ where: { id } });

  if (actorUserId) {
    await createAuditLog({
      userId: actorUserId,
      action: `Deleted algorithm '${algorithm.name}'`,
      target: algorithm.id,
      type: 'course',
    });
  }

  return { success: true, message: `Algorithm '${algorithm.name}' deleted successfully` };
}
