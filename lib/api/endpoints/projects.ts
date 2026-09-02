import apiClient, { type QueryParams, type PaginatedResponse, type SingleResponse } from '../client';

export interface CodeFile {
  path: string;
  language: string;
  content: string;
}

export interface ProjectComment {
  id: string;
  text: string;
  rating: number;
  createdAt: string;
  user?: { id: string; name: string; avatar: string | null };
}

export interface ProjectData {
  id: string;
  name: string;
  description: string;
  category: string;
  level: string;
  technologies: string[];
  status: string;
  views: string;
  price: string;
  downloads: number;
  rating: number;
  aim?: string | null;
  objectives?: string[];
  requirements?: string[];
  scope?: string | null;
  codeFiles?: CodeFile[] | null;
  thumbnailIcon: string | null;
  authorId: string;
  author?: { id: string; name: string; avatar: string | null };
  comments?: ProjectComment[];
  updatedAt: string;
  createdAt: string;
}

export interface CreateProjectInput {
  name: string;
  description: string;
  category?: string;
  level?: string;
  technologies?: string[];
  price?: string;
  aim?: string;
  objectives?: string[];
  requirements?: string[];
  scope?: string;
  authorId?: string;
}

export type UpdateProjectInput = Partial<CreateProjectInput>;

export const projectsApi = {
  getAll: (params?: QueryParams) => apiClient.get<PaginatedResponse<ProjectData>>('/api/projects', params),
  getById: (id: string) => apiClient.get<SingleResponse<ProjectData>>(`/api/projects/${id}`),
  create: (data: CreateProjectInput) => apiClient.post<SingleResponse<ProjectData>>('/api/projects', data),
  update: (id: string, data: UpdateProjectInput) => apiClient.put<SingleResponse<ProjectData>>(`/api/projects/${id}`, data),
  delete: (id: string) => apiClient.delete<{ message: string }>(`/api/projects/${id}`),
  postComment: (id: string, data: { text: string; rating?: number }) =>
    apiClient.post<SingleResponse<ProjectComment>>(`/api/projects/${id}/comments`, data),
};
