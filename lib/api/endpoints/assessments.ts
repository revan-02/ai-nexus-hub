import apiClient, { type QueryParams, type PaginatedResponse, type SingleResponse } from '../client';

export interface AssessmentData {
  id: string;
  name: string;
  description: string;
  type: string;
  category: string;
  difficulty: string;
  questionsCount: number;
  duration: string;
  attempts: string;
  status: string;
  iconName: string | null;
  courseId: string | null;
  course?: { id: string; title: string } | null;
  updatedAt: string;
  createdAt: string;
}

export type CreateAssessmentInput = Pick<AssessmentData, 'name' | 'description' | 'type' | 'category' | 'difficulty' | 'duration'> & { questionsCount?: number; courseId?: string };
export type UpdateAssessmentInput = Partial<CreateAssessmentInput>;

export const assessmentsApi = {
  getAll: (params?: QueryParams) => apiClient.get<PaginatedResponse<AssessmentData>>('/api/assessments', params),
  getById: (id: string) => apiClient.get<SingleResponse<AssessmentData>>(`/api/assessments/${id}`),
  create: (data: CreateAssessmentInput) => apiClient.post<SingleResponse<AssessmentData>>('/api/assessments', data),
  update: (id: string, data: UpdateAssessmentInput) => apiClient.put<SingleResponse<AssessmentData>>(`/api/assessments/${id}`, data),
  delete: (id: string) => apiClient.delete<{ message: string }>(`/api/assessments/${id}`),
};
