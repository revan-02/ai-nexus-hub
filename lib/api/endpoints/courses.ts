import apiClient, { type QueryParams, type PaginatedResponse, type SingleResponse } from '../client';

export interface CourseData {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  price: string;
  students: string;
  status: string;
  thumbnailIcon: string | null;
  instructorId: string;
  instructor?: { id: string; name: string; avatar: string | null };
  updatedAt: string;
  createdAt: string;
}

export type CreateCourseInput = Pick<CourseData, 'title' | 'description' | 'category' | 'level' | 'instructorId'> & {
  price?: string;
  status?: string;
  thumbnailIcon?: string | null;
};
export type UpdateCourseInput = Partial<CreateCourseInput>;

export const coursesApi = {
  getAll: (params?: QueryParams) => apiClient.get<PaginatedResponse<CourseData>>('/api/courses', params),
  getById: (id: string) => apiClient.get<SingleResponse<CourseData>>(`/api/courses/${id}`),
  create: (data: CreateCourseInput) => apiClient.post<SingleResponse<CourseData>>('/api/courses', data),
  update: (id: string, data: UpdateCourseInput) => apiClient.put<SingleResponse<CourseData>>(`/api/courses/${id}`, data),
  delete: (id: string) => apiClient.delete<{ message: string }>(`/api/courses/${id}`),
};
