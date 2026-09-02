import apiClient, { type QueryParams, type PaginatedResponse, type SingleResponse } from '../client';

export interface RoleData {
  id: string;
  name: string;
  type: string;
  usersCount: number;
  userPercentage: number;
  permissionsCount: number;
  description: string;
  status: string;
  iconName: string | null;
  iconBg: string | null;
  iconColor: string | null;
  isProtected: boolean;
  updatedAt: string;
  createdAt: string;
}

export type CreateRoleInput = Pick<RoleData, 'name' | 'description'> & {
  type?: string;
  status?: string;
  iconName?: string;
  iconBg?: string;
  iconColor?: string;
  isProtected?: boolean;
};
export type UpdateRoleInput = Partial<CreateRoleInput>;


export const rolesApi = {
  getAll: (params?: QueryParams) => apiClient.get<PaginatedResponse<RoleData>>('/api/roles', params),
  getById: (id: string) => apiClient.get<SingleResponse<RoleData>>(`/api/roles/${id}`),
  create: (data: CreateRoleInput) => apiClient.post<SingleResponse<RoleData>>('/api/roles', data),
  update: (id: string, data: UpdateRoleInput) => apiClient.put<SingleResponse<RoleData>>(`/api/roles/${id}`, data),
  delete: (id: string) => apiClient.delete<{ message: string }>(`/api/roles/${id}`),
};
