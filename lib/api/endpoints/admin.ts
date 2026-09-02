import apiClient, { type QueryParams, type PaginatedResponse } from '../client';

export interface AdminMetrics {
  users: { total: number; active: number; pending: number };
  courses: { total: number; published: number };
  projects: { total: number };
  datasets: { total: number };
  assessments: { total: number };
  algorithms: { total: number };
  content: { total: number };
  roles: { total: number };
  permissions: { total: number };
}

export interface AuditLogData {
  id: string;
  action: string;
  target: string;
  type: string;
  timestamp: string;
  userId: string;
  user?: { id: string; name: string; avatar: string | null };
}

export const adminApi = {
  getMetrics: () => apiClient.get<{ data: AdminMetrics }>('/api/admin/metrics'),
  getAuditLogs: (params?: QueryParams) => apiClient.get<PaginatedResponse<AuditLogData>>('/api/admin/audit-logs', params),
};
