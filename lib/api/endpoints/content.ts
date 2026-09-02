import apiClient, { type QueryParams, type PaginatedResponse, type SingleResponse } from '../client';

export interface ContentData {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  subCategory: string | null;
  status: string;
  views: string;
  thumbnailIcon: string | null;
  authorId: string;
  author?: { id: string; name: string; avatar: string | null };
  createdAt: string;
  updatedAt: string;
}

export type CreateContentInput = Pick<ContentData, 'title' | 'description' | 'type' | 'category' | 'authorId'> & {
  subCategory?: string;
  status?: string;
  thumbnailIcon?: string;
};
export type UpdateContentInput = Partial<CreateContentInput>;


export const contentApi = {
  getAll: (params?: QueryParams) => apiClient.get<PaginatedResponse<ContentData>>('/api/content', params),
  getById: (id: string) => apiClient.get<SingleResponse<ContentData>>(`/api/content/${id}`),
  create: (data: CreateContentInput) => apiClient.post<SingleResponse<ContentData>>('/api/content', data),
  update: (id: string, data: UpdateContentInput) => apiClient.put<SingleResponse<ContentData>>(`/api/content/${id}`, data),
  delete: (id: string) => apiClient.delete<{ message: string }>(`/api/content/${id}`),
};
