import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RoomService } from '@/services';
import prisma from '@/lib/db/prisma';

vi.mock('@/lib/db/prisma', () => ({
  default: {
    $transaction: vi.fn((cb: any) => cb({
      userTaskProgress: {
        findUnique: vi.fn(),
        upsert: vi.fn(),
      },
      auditLog: {
        create: vi.fn(),
      },
      userActivity: {
        create: vi.fn(),
      },
    })),
    learningRoom: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
    },
    learningTask: {
      findUnique: vi.fn(),
    },
    userTaskProgress: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
    userActivity: {
      create: vi.fn(),
    },
    userCertificate: {
      upsert: vi.fn(),
    },
  },
}));

describe('RoomService Business Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('validates correct quiz submission and awards XP', async () => {
    const mockTask = {
      id: 'task-101',
      roomId: 'room-1',
      taskType: 'MULTIPLE_CHOICE',
      title: 'Task 1: What is Artificial Intelligence?',
      correctAnswer: 'Machine Learning',
      xpReward: 50,
      passingScore: 100,
    };

    (prisma.learningTask.findUnique as any).mockResolvedValue(mockTask);
    (prisma.$transaction as any).mockImplementation(async (cb: any) => {
      return cb({
        userTaskProgress: {
          findUnique: vi.fn().mockResolvedValue(null),
          upsert: vi.fn().mockResolvedValue({
            id: 'prog-1',
            completed: true,
            passed: true,
            xpEarned: 50,
            attempts: 1,
          }),
        },
        auditLog: { create: vi.fn() },
        userActivity: { create: vi.fn() },
      });
    });

    const result = await RoomService.submitTaskAnswer('room-1', 'task-101', 'Machine Learning', 'usr-1');

    expect(result.success).toBe(true);
    expect(result.isCorrect).toBe(true);
    expect(result.xpEarned).toBe(50);
  });

  it('rejects incorrect quiz submission without awarding XP', async () => {
    const mockTask = {
      id: 'task-101',
      roomId: 'room-1',
      taskType: 'MULTIPLE_CHOICE',
      title: 'Task 1: What is Artificial Intelligence?',
      correctAnswer: 'Machine Learning',
      xpReward: 50,
      passingScore: 100,
    };

    (prisma.learningTask.findUnique as any).mockResolvedValue(mockTask);
    (prisma.$transaction as any).mockImplementation(async (cb: any) => {
      return cb({
        userTaskProgress: {
          findUnique: vi.fn().mockResolvedValue(null),
          upsert: vi.fn().mockResolvedValue({
            id: 'prog-1',
            completed: false,
            passed: false,
            xpEarned: 0,
            attempts: 1,
          }),
        },
        auditLog: { create: vi.fn() },
        userActivity: { create: vi.fn() },
      });
    });

    const result = await RoomService.submitTaskAnswer('room-1', 'task-101', 'Wrong Answer', 'usr-1');

    expect(result.success).toBe(false);
    expect(result.isCorrect).toBe(false);
    expect(result.message).toContain('Incorrect');
  });
});
