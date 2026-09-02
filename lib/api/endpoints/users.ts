import apiClient, { type QueryParams, type PaginatedResponse, type SingleResponse } from '../client';

export interface UserData {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string | null;
  role: string;
  organization: string | null;
  status: string;
  emailVerified: boolean;
  lastActive: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateUserInput = {
  name: string;
  username: string;
  email: string;
  avatar?: string | null;
  role?: string;
  organization?: string | null;
  status?: string;
  emailVerified?: boolean;
};
export type UpdateUserInput = Partial<CreateUserInput>;



export const usersApi = {
  getAll: (params?: QueryParams) => apiClient.get<PaginatedResponse<UserData>>('/api/users', params),
  getById: (id: string) => apiClient.get<SingleResponse<UserData>>(`/api/users/${id}`),
  create: (data: CreateUserInput) => apiClient.post<SingleResponse<UserData>>('/api/users', data),
  update: (id: string, data: UpdateUserInput) => apiClient.put<SingleResponse<UserData>>(`/api/users/${id}`, data),
  delete: (id: string) => apiClient.delete<{ message: string }>(`/api/users/${id}`),
};
