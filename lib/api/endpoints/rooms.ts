import apiClient, { type QueryParams, type PaginatedResponse, type SingleResponse } from '../client';

export type TaskType =
  | 'READ' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'MATCHING' | 'DRAG_DROP'
  | 'ORDERING' | 'IMAGE_IDENTIFICATION' | 'IMAGE_MATCHING' | 'FILL_BLANK'
  | 'CODE_TASK' | 'MINI_PROJECT' | 'PUZZLE' | 'MEMORY_GAME' | 'CLASSIFICATION_GAME'
  | 'AI_CONCEPT_GAME' | 'SCENARIO' | 'QUIZ' | 'VIDEO_LESSON' | 'SIMULATION' | 'CHALLENGE';

export interface LearningTaskItem {
  id: string;
  orderNumber: number;
  title: string;
  instructions: string;
  taskType: TaskType;
  codeSnippet?: string | null;
  hint?: string | null;
  questionText: string;
  options: string[];
  // SECURITY: correctAnswer is NOT included — never sent from backend
  taskContent?: any;
  imageUrl?: string | null;
  difficulty: string;
  ageGroup: string;
  isRequired: boolean;
  passingScore: number;
  xpReward: number;
  // User progress (from backend join)
  completed: boolean;
  passed: boolean;
  score: number;
  attempts: number;
  xpEarned: number;
  locked: boolean;
}

export interface LearningRoomItem {
  id: string;
  title: string;
  description: string;
  level: 'Novice' | 'Intermediate' | 'Advanced' | 'Expert';
  tier: 'Free' | 'Pro';
  category: string;
  estimatedTime: string;
  xpReward: number;
  iconName: string;
  ageGroup: string;
  isPublished: boolean;
  tasksCount?: number;
  tasks?: LearningTaskItem[];
}

export interface SubmitResult {
  success: boolean;
  isCorrect: boolean;
  score: number;
  xpEarned: number;
  message: string;
  alreadyCompleted: boolean;
  attempts: number;
}

export interface RoomProgress {
  completedTasks: number;
  totalTasks: number;
  progressPercent: number;
  totalXpEarned: number;
  roomXpReward: number;
  isRoomComplete: boolean;
}

export const roomsApi = {
  getAll: (params?: QueryParams) => apiClient.get<PaginatedResponse<LearningRoomItem>>('/api/rooms', params),
  getById: (id: string) => apiClient.get<SingleResponse<LearningRoomItem>>(`/api/rooms/${id}`),
  getProgress: (id: string) => apiClient.get<SingleResponse<RoomProgress>>(`/api/rooms/${id}/progress`),
  submitAnswer: (roomId: string, taskId: string, answer: unknown, timeSpentSec?: number) =>
    apiClient.post<{ data: SubmitResult }>(
      `/api/rooms/${roomId}/tasks/${taskId}/submit`,
      { answer, timeSpentSec }
    ),
};
