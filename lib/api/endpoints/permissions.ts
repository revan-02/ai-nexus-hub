import apiClient, { type QueryParams } from '../client';

export interface PermissionData {
  id: string;
  key: string;
  name: string;
  module: string;
  resource: string;
  action: string;
  type: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export const permissionsApi = {
  getAll: (params?: QueryParams) => apiClient.get<{ data: PermissionData[] }>('/api/permissions', params),
  create: (data: Pick<PermissionData, 'key' | 'name' | 'module' | 'resource' | 'action'>) =>
    apiClient.post<{ data: PermissionData }>('/api/permissions', data),
};
