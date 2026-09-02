import prisma from '@/lib/db/prisma';
import { createAuditLog } from './audit-service';
import type { QueryParams, PaginatedResponse } from '@/types/api';
import type { DatasetStatus } from '@prisma/client';

export async function getDatasets(params?: QueryParams): Promise<PaginatedResponse<any>> {
  const page = Number(params?.page || 1);
  const limit = Number(params?.limit || 20);
  const search = String(params?.search || '');
  const format = params?.format ? String(params.format) : undefined;
  const status = params?.status ? String(params.status) : undefined;
  const sortBy = String(params?.sortBy || 'createdAt');
  const order = (params?.order || 'desc') as 'asc' | 'desc';

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { category: { contains: search, mode: 'insensitive' } },
      { domain: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (format && format !== 'All Formats') where.format = format;
  if (status && status !== 'All Status') where.status = status as DatasetStatus;

  const [datasets, total] = await Promise.all([
    prisma.dataset.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: order },
    }),
    prisma.dataset.count({ where }),
  ]);

  return {
    data: datasets,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function getDatasetById(id: string) {
  const dataset = await prisma.dataset.findUnique({ where: { id } });
  if (!dataset) throw new Error(`Dataset with ID ${id} not found`);
  return dataset;
}

export async function createDataset(data: any, actorUserId?: string) {
  const dataset = await prisma.dataset.create({
    data: {
      name: data.name,
      description: data.description,
      category: data.category,
      domain: data.domain || 'General',
      size: data.size || '10 MB',
      format: data.format || 'CSV',
      license: data.license || 'MIT',
      status: (data.status as DatasetStatus) || 'Public',
      downloads: data.downloads || '0',
      iconName: data.iconName || 'Database',
    },
  });

  if (actorUserId) {
    await createAuditLog({
      userId: actorUserId,
      action: `Uploaded dataset '${dataset.name}' (${dataset.size}, ${dataset.format})`,
      target: dataset.id,
      type: 'dataset',
    });
  }

  return dataset;
}

export async function updateDataset(id: string, data: any, actorUserId?: string) {
  const dataset = await prisma.dataset.findUnique({ where: { id } });
  if (!dataset) throw new Error(`Dataset with ID ${id} not found`);

  const updated = await prisma.dataset.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.description && { description: data.description }),
      ...(data.category && { category: data.category }),
      ...(data.domain && { domain: data.domain }),
      ...(data.size && { size: data.size }),
      ...(data.format && { format: data.format }),
      ...(data.license && { license: data.license }),
      ...(data.status && { status: data.status as DatasetStatus }),
    },
  });

  if (actorUserId) {
    await createAuditLog({
      userId: actorUserId,
      action: `Updated dataset '${updated.name}'`,
      target: updated.id,
      type: 'dataset',
    });
  }

  return updated;
}

export async function deleteDataset(id: string, actorUserId?: string) {
  const dataset = await prisma.dataset.findUnique({ where: { id } });
  if (!dataset) throw new Error(`Dataset with ID ${id} not found`);

  await prisma.dataset.delete({ where: { id } });

  if (actorUserId) {
    await createAuditLog({
      userId: actorUserId,
      action: `Deleted dataset '${dataset.name}'`,
      target: dataset.id,
      type: 'dataset',
    });
  }

  return { success: true, message: `Dataset '${dataset.name}' deleted successfully` };
}

export async function incrementDownloads(id: string) {
  const dataset = await prisma.dataset.findUnique({ where: { id } });
  if (!dataset) throw new Error(`Dataset with ID ${id} not found`);

  const currentCount = parseInt(dataset.downloads.replace(/,/g, '')) || 0;
  const newCount = (currentCount + 1).toLocaleString();

  return await prisma.dataset.update({
    where: { id },
    data: { downloads: newCount },
  });
}
