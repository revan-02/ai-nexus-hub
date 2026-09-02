import prisma from '@/lib/db/prisma';
import { createAuditLog } from './audit-service';
import type { QueryParams, PaginatedResponse } from '@/types/api';
import type { CourseLevel, CourseStatus } from '@prisma/client';

export async function getCourses(params?: QueryParams): Promise<PaginatedResponse<any>> {
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
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { category: { contains: search, mode: 'insensitive' } },
      { instructor: { name: { contains: search, mode: 'insensitive' } } },
    ];
  }
  if (level && level !== 'All Levels') where.level = level as CourseLevel;
  if (status && status !== 'All Status') where.status = status as CourseStatus;

  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where,
      include: {
        instructor: { select: { id: true, name: true, avatar: true } },
        assessments: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: order },
    }),
    prisma.course.count({ where }),
  ]);

  return {
    data: courses,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function getCourseById(id: string) {
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      instructor: { select: { id: true, name: true, avatar: true, email: true } },
      assessments: true,
    },
  });

  if (!course) {
    throw new Error(`Course with ID ${id} not found`);
  }

  return course;
}

export async function createCourse(data: any, actorUserId?: string) {
  const instructor = await prisma.user.findUnique({ where: { id: data.instructorId } });
  if (!instructor) {
    throw new Error(`Instructor with ID ${data.instructorId} not found`);
  }

  const course = await prisma.course.create({
    data: {
      title: data.title,
      description: data.description,
      category: data.category,
      level: (data.level as CourseLevel) || 'Beginner',
      price: data.price || 'Free',
      students: data.students || '0',
      status: (data.status as CourseStatus) || 'Draft',
      thumbnailIcon: data.thumbnailIcon || 'Brain',
      instructorId: data.instructorId,
    },
    include: {
      instructor: { select: { id: true, name: true, avatar: true } },
    },
  });

  if (actorUserId) {
    await createAuditLog({
      userId: actorUserId,
      action: `Created new course '${course.title}'`,
      target: course.id,
      type: 'course',
    });
  }

  return course;
}

export async function updateCourse(id: string, data: any, actorUserId?: string) {
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) throw new Error(`Course with ID ${id} not found`);

  const updated = await prisma.course.update({
    where: { id },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.description && { description: data.description }),
      ...(data.category && { category: data.category }),
      ...(data.level && { level: data.level as CourseLevel }),
      ...(data.price && { price: data.price }),
      ...(data.status && { status: data.status as CourseStatus }),
      ...(data.thumbnailIcon && { thumbnailIcon: data.thumbnailIcon }),
    },
    include: {
      instructor: { select: { id: true, name: true, avatar: true } },
    },
  });

  if (actorUserId) {
    await createAuditLog({
      userId: actorUserId,
      action: `Updated course '${updated.title}'`,
      target: updated.id,
      type: 'course',
    });
  }

  return updated;
}

export async function deleteCourse(id: string, actorUserId?: string) {
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) throw new Error(`Course with ID ${id} not found`);

  await prisma.course.delete({ where: { id } });

  if (actorUserId) {
    await createAuditLog({
      userId: actorUserId,
      action: `Deleted course '${course.title}'`,
      target: course.id,
      type: 'course',
    });
  }

  return { success: true, message: `Course '${course.title}' deleted successfully` };
}
