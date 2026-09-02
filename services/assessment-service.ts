import prisma from '@/lib/db/prisma';
import { createAuditLog } from './audit-service';
import type { QueryParams, PaginatedResponse } from '@/types/api';
import type { AssessmentType, AssessmentDifficulty, AssessmentStatus } from '@prisma/client';

export async function getAssessments(params?: QueryParams): Promise<PaginatedResponse<any>> {
  const page = Number(params?.page || 1);
  const limit = Number(params?.limit || 20);
  const search = String(params?.search || '');
  const type = params?.type ? String(params.type) : undefined;
  const difficulty = params?.difficulty ? String(params.difficulty) : undefined;
  const status = params?.status ? String(params.status) : undefined;
  const sortBy = String(params?.sortBy || 'createdAt');
  const order = (params?.order || 'desc') as 'asc' | 'desc';

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { category: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (type && type !== 'All Types') where.type = type as AssessmentType;
  if (difficulty && difficulty !== 'All Difficulties') where.difficulty = difficulty as AssessmentDifficulty;
  if (status && status !== 'All Status') where.status = status as AssessmentStatus;

  const [assessments, total] = await Promise.all([
    prisma.assessment.findMany({
      where,
      include: {
        course: { select: { id: true, title: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: order },
    }),
    prisma.assessment.count({ where }),
  ]);

  return {
    data: assessments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function getAssessmentById(id: string) {
  const assessment = await prisma.assessment.findUnique({
    where: { id },
    include: {
      course: { select: { id: true, title: true, description: true } },
    },
  });

  if (!assessment) throw new Error(`Assessment with ID ${id} not found`);
  return assessment;
}

export async function createAssessment(data: any, actorUserId?: string) {
  const assessment = await prisma.assessment.create({
    data: {
      name: data.name,
      description: data.description,
      type: (data.type as AssessmentType) || 'Quiz',
      category: data.category,
      difficulty: (data.difficulty as AssessmentDifficulty) || 'Medium',
      questionsCount: data.questionsCount || 10,
      duration: data.duration || '30 mins',
      attempts: data.attempts || '0',
      status: (data.status as AssessmentStatus) || 'Draft',
      iconName: data.iconName || 'HelpCircle',
      courseId: data.courseId || null,
    },
    include: {
      course: { select: { id: true, title: true } },
    },
  });

  if (actorUserId) {
    await createAuditLog({
      userId: actorUserId,
      action: `Created assessment '${assessment.name}'`,
      target: assessment.id,
      type: 'course',
    });
  }

  return assessment;
}

export async function updateAssessment(id: string, data: any, actorUserId?: string) {
  const assessment = await prisma.assessment.findUnique({ where: { id } });
  if (!assessment) throw new Error(`Assessment with ID ${id} not found`);

  const updated = await prisma.assessment.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.description && { description: data.description }),
      ...(data.type && { type: data.type as AssessmentType }),
      ...(data.category && { category: data.category }),
      ...(data.difficulty && { difficulty: data.difficulty as AssessmentDifficulty }),
      ...(data.questionsCount !== undefined && { questionsCount: data.questionsCount }),
      ...(data.duration && { duration: data.duration }),
      ...(data.status && { status: data.status as AssessmentStatus }),
    },
    include: {
      course: { select: { id: true, title: true } },
    },
  });

  if (actorUserId) {
    await createAuditLog({
      userId: actorUserId,
      action: `Updated assessment '${updated.name}'`,
      target: updated.id,
      type: 'course',
    });
  }

  return updated;
}

export async function deleteAssessment(id: string, actorUserId?: string) {
  const assessment = await prisma.assessment.findUnique({ where: { id } });
  if (!assessment) throw new Error(`Assessment with ID ${id} not found`);

  await prisma.assessment.delete({ where: { id } });

  if (actorUserId) {
    await createAuditLog({
      userId: actorUserId,
      action: `Deleted assessment '${assessment.name}'`,
      target: assessment.id,
      type: 'course',
    });
  }

  return { success: true, message: `Assessment '${assessment.name}' deleted successfully` };
}

export async function submitAssessmentAttempt(
  userId: string,
  assessmentId: string,
  payload: {
    scorePercent: number;
    passed: boolean;
    strikes?: number;
    clientIp?: string;
    userAgent?: string;
  }
) {
  const assessment = await prisma.assessment.findUnique({
    where: { id: assessmentId },
    include: { course: { select: { id: true, title: true } } },
  });

  if (!assessment) {
    throw new Error(`Assessment with ID ${assessmentId} not found`);
  }

  // Record user quiz attempt in database
  const attempt = await prisma.userQuizAttempt.create({
    data: {
      userId,
      assessmentId,
      score: payload.scorePercent,
      passed: payload.passed,
    },
  });

  // Calculate user total attempts count and best score for this assessment
  let attemptNumber = 1;
  let bestScore = payload.scorePercent;
  try {
    const userAttempts = await prisma.userQuizAttempt.findMany({
      where: { userId, assessmentId },
      select: { score: true },
      orderBy: { score: 'desc' },
    });
    attemptNumber = userAttempts.length || 1;
    bestScore = userAttempts[0]?.score ?? payload.scorePercent;
  } catch (err) {
    // Fallback if querying fails
  }

  // Increment assessment attempt count
  const currentAttempts = parseInt(assessment.attempts || '0', 10) || 0;
  await prisma.assessment.update({
    where: { id: assessmentId },
    data: { attempts: String(currentAttempts + 1) },
  });

  let certificate = null;
  if (payload.passed) {
    // Generate verified certificate upon passing assessment / course certification
    const trackTitle = assessment.course?.title
      ? `${assessment.course.title} & ${assessment.name}`
      : `${assessment.name} Certification`;

    const { generateCertificate } = await import('./certificate-service');
    certificate = await generateCertificate(userId, trackTitle);
  }

  // Record audit log with IP, strikes, and client metadata
  await createAuditLog({
    userId,
    action: `Submitted quiz attempt #${attemptNumber} for '${assessment.name}' (Score: ${payload.scorePercent}%, Best: ${bestScore}%, Passed: ${payload.passed}, Strikes: ${payload.strikes || 0}, IP: ${payload.clientIp || 'unknown'})`,
    target: assessment.id,
    type: 'security',
  });

  return {
    success: true,
    attemptId: attempt.id,
    attemptNumber,
    bestScore,
    score: payload.scorePercent,
    passed: payload.passed,
    certificate,
  };
}

export async function recordProctorViolation(
  assessmentId: string,
  userId: string,
  violationType: string,
  clientIp?: string,
  userAgent?: string
) {
  const assessment = await prisma.assessment.findUnique({
    where: { id: assessmentId },
    select: { id: true, name: true },
  });

  const assessmentName = assessment?.name || assessmentId;

  await createAuditLog({
    userId,
    action: `Anti-Cheat Violation: ${violationType} during quiz '${assessmentName}' (IP: ${clientIp || 'unknown'}, Client: ${userAgent || 'browser'})`,
    target: assessmentId,
    type: 'security',
  });

  return { success: true, recorded: true };
}

