import apiClient, { type QueryParams, type PaginatedResponse, type SingleResponse } from '../client';

export interface AlgorithmData {
  id: string;
  name: string;
  description: string;
  category: string;
  complexity: string;
  topic: string;
  implementationsCount: number;
  languages: string[];
  status: string;
  iconName: string | null;
  updatedAt: string;
  createdAt: string;
}

export type CreateAlgorithmInput = Pick<AlgorithmData, 'name' | 'description' | 'category' | 'complexity' | 'topic'> & { languages?: string[]; implementationsCount?: number };
export type UpdateAlgorithmInput = Partial<CreateAlgorithmInput>;

export const algorithmsApi = {
  getAll: (params?: QueryParams) => apiClient.get<PaginatedResponse<AlgorithmData>>('/api/algorithms', params),
  getById: (id: string) => apiClient.get<SingleResponse<AlgorithmData>>(`/api/algorithms/${id}`),
  create: (data: CreateAlgorithmInput) => apiClient.post<SingleResponse<AlgorithmData>>('/api/algorithms', data),
  update: (id: string, data: UpdateAlgorithmInput) => apiClient.put<SingleResponse<AlgorithmData>>(`/api/algorithms/${id}`, data),
  delete: (id: string) => apiClient.delete<{ message: string }>(`/api/algorithms/${id}`),
};
