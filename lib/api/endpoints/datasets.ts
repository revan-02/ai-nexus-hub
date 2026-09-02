import apiClient, { type QueryParams, type PaginatedResponse, type SingleResponse } from '../client';

export interface DatasetData {
  id: string;
  name: string;
  description: string;
  category: string;
  domain: string;
  size: string;
  format: string;
  license: string;
  status: string;
  downloads: string;
  iconName: string | null;
  updatedAt: string;
  createdAt: string;
}

export type CreateDatasetInput = Pick<DatasetData, 'name' | 'description' | 'category' | 'domain' | 'size' | 'format' | 'license'>;
export type UpdateDatasetInput = Partial<CreateDatasetInput>;

export const datasetsApi = {
  getAll: (params?: QueryParams) => apiClient.get<PaginatedResponse<DatasetData>>('/api/datasets', params),
  getById: (id: string) => apiClient.get<SingleResponse<DatasetData>>(`/api/datasets/${id}`),
  create: (data: CreateDatasetInput) => apiClient.post<SingleResponse<DatasetData>>('/api/datasets', data),
  update: (id: string, data: UpdateDatasetInput) => apiClient.put<SingleResponse<DatasetData>>(`/api/datasets/${id}`, data),
  delete: (id: string) => apiClient.delete<{ message: string }>(`/api/datasets/${id}`),
};
