import { z } from 'zod';

// ─── Task Submission ───

export const submitAnswerSchema = z.object({
  answer: z.union([
    z.string(),
    z.array(z.string()),
    z.record(z.string(), z.string()),
    z.object({
      selected: z.array(z.string()).optional(),
      ordered: z.array(z.string()).optional(),
      matches: z.record(z.string(), z.string()).optional(),
      placements: z.record(z.string(), z.string()).optional(),
      text: z.string().optional(),
      code: z.string().optional(),
      completed: z.boolean().optional(),
      score: z.number().optional(),
    }),
  ]),
  timeSpentSec: z.number().int().min(0).optional(),
});

export type SubmitAnswerInput = z.infer<typeof submitAnswerSchema>;

// ─── Admin Room CRUD ───

const taskTypeEnum = z.enum([
  'READ', 'MULTIPLE_CHOICE', 'TRUE_FALSE', 'MATCHING', 'DRAG_DROP',
  'ORDERING', 'IMAGE_IDENTIFICATION', 'IMAGE_MATCHING', 'FILL_BLANK',
  'CODE_TASK', 'MINI_PROJECT', 'PUZZLE', 'MEMORY_GAME', 'CLASSIFICATION_GAME',
  'AI_CONCEPT_GAME', 'SCENARIO', 'QUIZ', 'VIDEO_LESSON', 'SIMULATION', 'CHALLENGE',
]);

const ageGroupEnum = z.enum([
  'KIDS', 'ABSOLUTE_BEGINNER', 'UNDERGRADUATE', 'POSTGRADUATE', 'PROFESSIONAL', 'RESEARCHER',
]);

export const createRoomSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required').max(2000),
  level: z.enum(['Novice', 'Intermediate', 'Advanced', 'Expert']).default('Novice'),
  tier: z.enum(['Free', 'Pro']).default('Free'),
  category: z.string().min(1).default('AI Foundations'),
  estimatedTime: z.string().default('45 mins'),
  xpReward: z.number().int().min(0).default(200),
  iconName: z.string().default('Brain'),
  ageGroup: ageGroupEnum.default('ABSOLUTE_BEGINNER'),
  isPublished: z.boolean().default(false),
  prerequisiteRoomId: z.string().nullable().optional(),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;

export const createTaskSchema = z.object({
  roomId: z.string().min(1, 'Room ID is required'),
  orderNumber: z.number().int().min(1),
  title: z.string().min(1, 'Title is required').max(300),
  instructions: z.string().min(1, 'Instructions are required'),
  taskType: taskTypeEnum.default('MULTIPLE_CHOICE'),
  // Legacy fields
  questionText: z.string().optional().default(''),
  options: z.array(z.string()).optional().default([]),
  correctAnswer: z.string().optional().default(''),
  codeSnippet: z.string().nullable().optional(),
  hint: z.string().nullable().optional(),
  // New fields
  taskContent: z.any().optional(),
  correctData: z.any().optional(),
  explanation: z.string().nullable().optional(),
  explanationWrong: z.string().nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).default('Medium'),
  ageGroup: ageGroupEnum.default('ABSOLUTE_BEGINNER'),
  isRequired: z.boolean().default(true),
  prerequisiteTaskId: z.string().nullable().optional(),
  passingScore: z.number().int().min(0).max(100).default(100),
  xpReward: z.number().int().min(0).default(50),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = createTaskSchema.partial().omit({ roomId: true });
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export const updateRoomSchema = createRoomSchema.partial();
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
