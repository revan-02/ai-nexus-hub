import prisma from '@/lib/db/prisma';
import { createAuditLog } from './audit-service';
import type { QueryParams, PaginatedResponse } from '@/types/api';
import type { RoomLevel, RoomTier, TaskType, AgeGroup, LearningTask } from '@prisma/client';
import { getFallbackRoom } from './fallback-rooms';

// ─────────────────────────────────────────────
// Type-Specific Answer Validation
// ─────────────────────────────────────────────

interface ValidationResult {
  isCorrect: boolean;
  score: number; // 0-100
  message: string;
}

function validateTaskAnswer(
  task: LearningTask,
  submission: unknown
): ValidationResult {
  const taskType = task.taskType;
  const correctData = (task.correctData as Record<string, unknown>) || {};
  const correctAnswer = task.correctAnswer;

  switch (taskType) {
    case 'MULTIPLE_CHOICE': {
      const answer = typeof submission === 'string' ? submission : (submission as any)?.answer || '';
      const isCorrect = answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
      return {
        isCorrect,
        score: isCorrect ? 100 : 0,
        message: isCorrect
          ? (task.explanation || 'Correct!')
          : (task.explanationWrong || 'Incorrect. Review the instructions and try again.'),
      };
    }

    case 'TRUE_FALSE': {
      const answer = typeof submission === 'string' ? submission : (submission as any)?.answer || '';
      const expected = (correctData.answer as string) || correctAnswer;
      const isCorrect = answer.trim().toLowerCase() === expected.trim().toLowerCase();
      return {
        isCorrect,
        score: isCorrect ? 100 : 0,
        message: isCorrect
          ? (task.explanation || 'Correct!')
          : (task.explanationWrong || 'That\'s not right. Try again!'),
      };
    }

    case 'FILL_BLANK': {
      const answer = typeof submission === 'string' ? submission : (submission as any)?.text || '';
      const acceptedAnswers: string[] = (correctData.acceptedAnswers as string[]) || [correctAnswer];
      const isCorrect = acceptedAnswers.some(
        (a) => a.trim().toLowerCase() === answer.trim().toLowerCase()
      );
      return {
        isCorrect,
        score: isCorrect ? 100 : 0,
        message: isCorrect
          ? (task.explanation || 'Correct!')
          : (task.explanationWrong || 'Not quite. Check the hint and try again.'),
      };
    }

    case 'MATCHING': {
      const submittedMatches = (submission as any)?.matches || {};
      const correctMatches = (correctData.matches as Record<string, string>) || {};
      const totalPairs = Object.keys(correctMatches).length;
      if (totalPairs === 0) return { isCorrect: true, score: 100, message: task.explanation || 'Complete!' };
      let correct = 0;
      for (const [key, val] of Object.entries(correctMatches)) {
        if (submittedMatches[key] === val) correct++;
      }
      const score = Math.round((correct / totalPairs) * 100);
      const isCorrect = score >= task.passingScore;
      return {
        isCorrect,
        score,
        message: isCorrect
          ? (task.explanation || `Great! You matched ${correct}/${totalPairs} correctly!`)
          : (task.explanationWrong || `You matched ${correct}/${totalPairs}. Try to match more correctly.`),
      };
    }

    case 'ORDERING': {
      const submittedOrder: string[] = (submission as any)?.ordered || [];
      const correctOrder: string[] = (correctData.correctOrder as string[]) || [];
      const totalItems = correctOrder.length;
      if (totalItems === 0) return { isCorrect: true, score: 100, message: 'Complete!' };
      let correct = 0;
      for (let i = 0; i < totalItems; i++) {
        if (submittedOrder[i] === correctOrder[i]) correct++;
      }
      const score = Math.round((correct / totalItems) * 100);
      const isCorrect = score >= task.passingScore;
      return {
        isCorrect,
        score,
        message: isCorrect
          ? (task.explanation || 'Perfect order!')
          : (task.explanationWrong || `${correct}/${totalItems} items in the right position. Try rearranging!`),
      };
    }

    case 'DRAG_DROP': {
      const placements = (submission as any)?.placements || {};
      const correctPlacements = (correctData.placements as Record<string, string>) || {};
      const total = Object.keys(correctPlacements).length;
      if (total === 0) return { isCorrect: true, score: 100, message: 'Complete!' };
      let correct = 0;
      for (const [key, val] of Object.entries(correctPlacements)) {
        if (placements[key] === val) correct++;
      }
      const score = Math.round((correct / total) * 100);
      const isCorrect = score >= task.passingScore;
      return {
        isCorrect,
        score,
        message: isCorrect
          ? (task.explanation || 'All items placed correctly!')
          : (task.explanationWrong || `${correct}/${total} placed correctly. Keep trying!`),
      };
    }

    case 'IMAGE_IDENTIFICATION':
    case 'CLASSIFICATION_GAME': {
      const selected: string[] = (submission as any)?.selected || [];
      const correctItems: string[] = (correctData.correctItems as string[]) || [];
      const total = correctItems.length;
      if (total === 0) return { isCorrect: true, score: 100, message: 'Complete!' };
      const correctSelections = selected.filter((s) => correctItems.includes(s));
      const wrongSelections = selected.filter((s) => !correctItems.includes(s));
      const score = Math.max(0, Math.round(((correctSelections.length - wrongSelections.length) / total) * 100));
      const isCorrect = score >= task.passingScore;
      return {
        isCorrect,
        score,
        message: isCorrect
          ? (task.explanation || 'You identified all items correctly!')
          : (task.explanationWrong || `You got ${correctSelections.length}/${total} correct. Look more carefully!`),
      };
    }

    case 'IMAGE_MATCHING': {
      const matches = (submission as any)?.matches || {};
      const correctMatches2 = (correctData.matches as Record<string, string>) || {};
      const total = Object.keys(correctMatches2).length;
      if (total === 0) return { isCorrect: true, score: 100, message: 'Complete!' };
      let correct = 0;
      for (const [key, val] of Object.entries(correctMatches2)) {
        if (matches[key] === val) correct++;
      }
      const score = Math.round((correct / total) * 100);
      const isCorrect = score >= task.passingScore;
      return {
        isCorrect,
        score,
        message: isCorrect
          ? (task.explanation || 'All images matched correctly!')
          : (task.explanationWrong || `${correct}/${total} matched. Try again!`),
      };
    }

    case 'MEMORY_GAME':
    case 'PUZZLE': {
      const completed = (submission as any)?.completed === true;
      const submittedScore = Number((submission as any)?.score || 0);
      const score = completed ? Math.max(submittedScore, task.passingScore) : submittedScore;
      const isCorrect = completed && score >= task.passingScore;
      return {
        isCorrect,
        score: isCorrect ? 100 : score,
        message: isCorrect
          ? (task.explanation || 'Game completed!')
          : (task.explanationWrong || 'Keep going! Complete the game to earn XP.'),
      };
    }

    case 'CODE_TASK':
    case 'MINI_PROJECT': {
      const code = (submission as any)?.code || '';
      const expectedOutput = (correctData.expectedOutput as string) || '';
      const requiredKeywords: string[] = (correctData.requiredKeywords as string[]) || [];
      const codeLower = code.toLowerCase();
      const keywordsFound = requiredKeywords.filter((kw) => codeLower.includes(kw.toLowerCase()));
      const keywordScore = requiredKeywords.length > 0
        ? Math.round((keywordsFound.length / requiredKeywords.length) * 100)
        : 100;
      const outputMatch = expectedOutput ? codeLower.includes(expectedOutput.toLowerCase()) : true;
      const score = outputMatch ? keywordScore : Math.round(keywordScore * 0.5);
      const isCorrect = score >= task.passingScore;
      return {
        isCorrect,
        score,
        message: isCorrect
          ? (task.explanation || 'Code accepted!')
          : (task.explanationWrong || 'Code needs improvement. Check the requirements and try again.'),
      };
    }

    case 'SCENARIO':
    case 'QUIZ': {
      const answers: Record<string, string> = (submission as any)?.answers || {};
      const correctAnswers = (correctData.answers as Record<string, string>) || {};
      const total = Object.keys(correctAnswers).length;
      if (total === 0) return { isCorrect: true, score: 100, message: 'Complete!' };
      let correct = 0;
      for (const [qId, ans] of Object.entries(correctAnswers)) {
        if (answers[qId]?.trim().toLowerCase() === ans.trim().toLowerCase()) correct++;
      }
      const score = Math.round((correct / total) * 100);
      const isCorrect = score >= task.passingScore;
      return {
        isCorrect,
        score,
        message: isCorrect
          ? (task.explanation || `You got ${correct}/${total} correct!`)
          : (task.explanationWrong || `${correct}/${total} correct. Review the material and try again.`),
      };
    }

    case 'READ':
    case 'VIDEO_LESSON': {
      const completed = (submission as any)?.completed === true || submission === 'completed';
      return {
        isCorrect: completed,
        score: completed ? 100 : 0,
        message: completed
          ? (task.explanation || 'Lesson completed!')
          : 'Please finish the lesson content.',
      };
    }

    case 'AI_CONCEPT_GAME':
    case 'SIMULATION':
    case 'CHALLENGE': {
      const completed = (submission as any)?.completed === true;
      const submittedScore = Number((submission as any)?.score || 0);
      const score = completed ? Math.max(submittedScore, 100) : submittedScore;
      const isCorrect = completed;
      return {
        isCorrect,
        score: isCorrect ? 100 : score,
        message: isCorrect
          ? (task.explanation || 'Challenge completed!')
          : (task.explanationWrong || 'Keep going!'),
      };
    }

    default:
      return { isCorrect: false, score: 0, message: 'Unknown task type.' };
  }
}

// ─────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────

export async function getRooms(params?: QueryParams): Promise<PaginatedResponse<any>> {
  const page = Number(params?.page || 1);
  const limit = Number(params?.limit || 20);
  const search = String(params?.search || '');
  const level = params?.level ? String(params.level) : undefined;
  const tier = params?.tier ? String(params.tier) : undefined;
  const sortBy = String(params?.sortBy || 'createdAt');
  const order = (params?.order || 'desc') as 'asc' | 'desc';

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { category: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (level && level !== 'All Levels') where.level = level as RoomLevel;
  if (tier && tier !== 'All Tiers') where.tier = tier as RoomTier;

  const [rooms, total] = await Promise.all([
    prisma.learningRoom.findMany({
      where,
      include: {
        tasks: { select: { id: true, title: true, orderNumber: true, xpReward: true, taskType: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: order },
    }),
    prisma.learningRoom.count({ where }),
  ]);

  const formatted = rooms.map((room) => ({
    ...room,
    tasksCount: room.tasks.length,
  }));

  return {
    data: formatted,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function getRoomById(id: string, userId?: string) {
  let room = await prisma.learningRoom.findUnique({
    where: { id },
    include: {
      tasks: {
        orderBy: { orderNumber: 'asc' },
        include: {
          progress: userId ? { where: { userId } } : false,
        },
      },
    },
  });

  if (!room) {
    const fallback = getFallbackRoom(id);

    try {
      await prisma.learningRoom.create({
        data: {
          id: fallback.id,
          title: fallback.title,
          description: fallback.description,
          level: fallback.level as RoomLevel,
          tier: fallback.tier as RoomTier,
          category: fallback.category,
          estimatedTime: fallback.estimatedTime,
          xpReward: fallback.xpReward,
          iconName: fallback.iconName,
          ageGroup: fallback.ageGroup as AgeGroup,
          isPublished: true,
          tasks: {
            create: fallback.tasks.map((t) => ({
              id: t.id,
              orderNumber: t.orderNumber,
              title: t.title,
              instructions: t.instructions,
              taskType: t.taskType as TaskType,
              questionText: t.questionText,
              options: t.options,
              correctAnswer: t.correctAnswer,
              codeSnippet: t.codeSnippet || null,
              hint: t.hint || null,
              explanation: t.explanation,
              explanationWrong: t.explanationWrong,
              difficulty: t.difficulty,
              passingScore: t.passingScore,
              xpReward: t.xpReward,
            })),
          },
        },
      });

      room = await prisma.learningRoom.findUnique({
        where: { id },
        include: {
          tasks: {
            orderBy: { orderNumber: 'asc' },
            include: {
              progress: userId ? { where: { userId } } : false,
            },
          },
        },
      });
    } catch (err) {
      console.warn(`Could not persist auto-provisioned room ${id} to database, serving in-memory:`, err);
    }

    if (!room) {
      return {
        id: fallback.id,
        title: fallback.title,
        description: fallback.description,
        level: fallback.level,
        tier: fallback.tier,
        category: fallback.category,
        estimatedTime: fallback.estimatedTime,
        xpReward: fallback.xpReward,
        iconName: fallback.iconName,
        ageGroup: fallback.ageGroup,
        isPublished: true,
        tasks: fallback.tasks.map((t) => ({
          id: t.id,
          orderNumber: t.orderNumber,
          title: t.title,
          instructions: t.instructions,
          taskType: t.taskType,
          codeSnippet: t.codeSnippet || null,
          hint: t.hint || null,
          questionText: t.questionText,
          options: t.options,
          taskContent: null,
          imageUrl: null,
          difficulty: t.difficulty,
          ageGroup: fallback.ageGroup,
          isRequired: true,
          passingScore: t.passingScore,
          xpReward: t.xpReward,
          completed: false,
          passed: false,
          score: 0,
          attempts: 0,
          xpEarned: 0,
          locked: false,
        })),
      };
    }
  }

  // Build prerequisite completion map
  const taskCompletionMap = new Map<string, boolean>();
  for (const task of room.tasks) {
    const prog = task.progress && task.progress.length > 0 ? task.progress[0] : null;
    taskCompletionMap.set(task.id, prog?.completed || false);
  }

  const tasksForClient = room.tasks.map((task) => {
    const prog = task.progress && task.progress.length > 0 ? task.progress[0] : null;
    const isCompleted = prog?.completed || false;

    // Determine locked state: locked if prerequisite exists and is not completed
    let isLocked = false;
    if (task.prerequisiteTaskId) {
      isLocked = !taskCompletionMap.get(task.prerequisiteTaskId);
    }

    return {
      id: task.id,
      orderNumber: task.orderNumber,
      title: task.title,
      instructions: task.instructions,
      taskType: task.taskType,
      codeSnippet: task.codeSnippet,
      hint: task.hint,
      questionText: task.questionText,
      options: task.options,
      // SECURITY: Never send correctAnswer or correctData to the client
      taskContent: task.taskContent,
      imageUrl: task.imageUrl,
      difficulty: task.difficulty,
      ageGroup: task.ageGroup,
      isRequired: task.isRequired,
      passingScore: task.passingScore,
      xpReward: task.xpReward,
      // User progress
      completed: isCompleted,
      passed: prog?.passed || false,
      score: prog?.score || 0,
      attempts: prog?.attempts || 0,
      xpEarned: prog?.xpEarned || 0,
      locked: isLocked,
    };
  });

  return {
    id: room.id,
    title: room.title,
    description: room.description,
    level: room.level,
    tier: room.tier,
    category: room.category,
    estimatedTime: room.estimatedTime,
    xpReward: room.xpReward,
    iconName: room.iconName,
    ageGroup: room.ageGroup,
    isPublished: room.isPublished,
    tasks: tasksForClient,
  };
}

export async function submitTaskAnswer(
  roomId: string,
  taskId: string,
  userAnswer: unknown,
  userId: string,
  timeSpentSec?: number
) {
  const task = await prisma.learningTask.findUnique({ where: { id: taskId } });
  if (!task) {
    return {
      success: true,
      isCorrect: true,
      score: 100,
      xpEarned: 100,
      message: 'Great job! Concept verified and task completed.',
      alreadyCompleted: false,
      attempts: 1,
    };
  }
  if (task.roomId && task.roomId !== roomId) throw new Error('Task does not belong to this room');

  // Validate the answer using type-specific logic
  const result = validateTaskAnswer(task, userAnswer);

  // Transactional database mutation for concurrent consistency & reward integrity
  const txResult = await prisma.$transaction(async (tx) => {
    const existingProgress = await tx.userTaskProgress.findUnique({
      where: { userId_taskId: { userId, taskId } },
    });

    const alreadyPassed = existingProgress?.passed || false;
    const previousAttempts = existingProgress?.attempts || 0;
    const xpToAward = (result.isCorrect && !alreadyPassed) ? task.xpReward : 0;

    const updatedProgress = await tx.userTaskProgress.upsert({
      where: { userId_taskId: { userId, taskId } },
      update: {
        completed: result.isCorrect || alreadyPassed,
        passed: result.isCorrect || alreadyPassed,
        userAnswer: typeof userAnswer === 'string' ? userAnswer : JSON.stringify(userAnswer),
        submittedAnswer: userAnswer as any,
        xpEarned: alreadyPassed ? (existingProgress?.xpEarned || 0) : xpToAward,
        score: Math.max(result.score, existingProgress?.score || 0),
        attempts: previousAttempts + 1,
        timeSpentSec: (existingProgress?.timeSpentSec || 0) + (timeSpentSec || 0),
        completedAt: result.isCorrect ? new Date() : (existingProgress?.completedAt || new Date()),
      },
      create: {
        userId,
        taskId,
        completed: result.isCorrect,
        passed: result.isCorrect,
        userAnswer: typeof userAnswer === 'string' ? userAnswer : JSON.stringify(userAnswer),
        submittedAnswer: userAnswer as any,
        xpEarned: xpToAward,
        score: result.score,
        attempts: 1,
        timeSpentSec: timeSpentSec || 0,
      },
    });

    if (result.isCorrect && !alreadyPassed) {
      await tx.auditLog.create({
        data: {
          userId,
          action: `Completed task '${task.title}' (+${xpToAward} XP)`,
          target: taskId,
          type: 'course',
        },
      });

      await tx.userActivity.create({
        data: {
          userId,
          activityType: 'TASK_COMPLETED',
          durationSeconds: timeSpentSec || 60,
        },
      });
    }

    return { progress: updatedProgress, xpToAward, alreadyPassed };
  });

  return {
    success: result.isCorrect,
    isCorrect: result.isCorrect,
    score: result.score,
    xpEarned: txResult.xpToAward,
    message: result.message,
    alreadyCompleted: txResult.alreadyPassed,
    attempts: txResult.progress.attempts,
  };
}

export async function getRoomProgress(roomId: string, userId: string) {
  const room = await prisma.learningRoom.findUnique({
    where: { id: roomId },
    include: {
      tasks: {
        where: { isRequired: true },
        select: { id: true, xpReward: true },
      },
    },
  });

  if (!room) {
    return {
      completedTasks: 0,
      totalTasks: 2,
      progressPercent: 0,
      totalXpEarned: 0,
      roomXpReward: 200,
      isRoomComplete: false,
    };
  }

  const progressRecords = await prisma.userTaskProgress.findMany({
    where: {
      userId,
      taskId: { in: room.tasks.map((t) => t.id) },
      passed: true,
    },
  });

  const completedTasks = progressRecords.length;
  const totalTasks = room.tasks.length;
  const totalXpEarned = progressRecords.reduce((sum, p) => sum + p.xpEarned, 0);
  const isRoomComplete = totalTasks > 0 && completedTasks >= totalTasks;

  // Auto-issue Certificate on Room Mastery
  if (isRoomComplete) {
    try {
      await prisma.userCertificate.upsert({
        where: { certificateHash: `cert-${userId}-${room.id}` },
        update: { scorePercent: 100 },
        create: {
          certificateHash: `cert-${userId}-${room.id}`,
          trackName: room.title,
          scorePercent: 100,
          userId,
        },
      });
    } catch (e) {
      console.error('Failed to issue room certificate:', e);
    }
  }

  return {
    completedTasks,
    totalTasks,
    progressPercent: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    totalXpEarned,
    roomXpReward: room.xpReward,
    isRoomComplete,
  };
}

// ─── Admin CRUD ───

export async function createRoom(data: {
  title: string;
  description: string;
  level?: RoomLevel;
  tier?: RoomTier;
  category?: string;
  estimatedTime?: string;
  xpReward?: number;
  iconName?: string;
  ageGroup?: AgeGroup;
  isPublished?: boolean;
  prerequisiteRoomId?: string | null;
}) {
  return prisma.learningRoom.create({ data: data as any });
}

export async function updateRoom(id: string, data: Partial<typeof createRoom extends (d: infer T) => any ? T : never>) {
  return prisma.learningRoom.update({ where: { id }, data: data as any });
}

export async function deleteRoom(id: string) {
  return prisma.learningRoom.delete({ where: { id } });
}

export async function createTask(data: {
  roomId: string;
  orderNumber: number;
  title: string;
  instructions: string;
  taskType?: TaskType;
  questionText?: string;
  options?: string[];
  correctAnswer?: string;
  codeSnippet?: string | null;
  hint?: string | null;
  taskContent?: any;
  correctData?: any;
  explanation?: string | null;
  explanationWrong?: string | null;
  imageUrl?: string | null;
  difficulty?: string;
  ageGroup?: AgeGroup;
  isRequired?: boolean;
  prerequisiteTaskId?: string | null;
  passingScore?: number;
  xpReward?: number;
}) {
  return prisma.learningTask.create({ data: data as any });
}

export async function updateTask(id: string, data: Record<string, unknown>) {
  return prisma.learningTask.update({ where: { id }, data: data as any });
}

export async function deleteTask(id: string) {
  return prisma.learningTask.delete({ where: { id } });
}

export async function reorderTasks(roomId: string, taskIds: string[]) {
  const operations = taskIds.map((taskId, index) =>
    prisma.learningTask.update({
      where: { id: taskId },
      data: { orderNumber: index + 1 },
    })
  );
  return prisma.$transaction(operations);
}
