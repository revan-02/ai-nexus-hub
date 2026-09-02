import apiClient, { type QueryParams, type PaginatedResponse, type SingleResponse } from '../client';
import type { SessionItem } from '@/types/session';

export type CreateSessionInput = {
  userId: string;
  ip: string;
  location: string;
  device: string;
  authMethod?: string;
  duration?: string;
  status?: string;
  lastActive?: string;
};

export type UpdateSessionInput = Partial<CreateSessionInput>;

export const sessionsApi = {
  getAll: (params?: QueryParams) => apiClient.get<PaginatedResponse<SessionItem>>('/api/sessions', params),
  getById: (id: string) => apiClient.get<SingleResponse<SessionItem>>(`/api/sessions/${id}`),
  create: (data: CreateSessionInput) => apiClient.post<SingleResponse<SessionItem>>('/api/sessions', data),
  update: (id: string, data: UpdateSessionInput) => apiClient.put<SingleResponse<SessionItem>>(`/api/sessions/${id}`, data),
  revoke: (id: string) => apiClient.put<SingleResponse<SessionItem>>(`/api/sessions/${id}`, { status: 'Revoked' }),
  revokeAll: () => apiClient.delete<{ data: { success: boolean; count: number } }>('/api/sessions'),
  delete: (id: string) => apiClient.delete<{ data: { success: boolean } }>(`/api/sessions/${id}`),
};
