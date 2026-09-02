import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/endpoints/admin';
import type { QueryParams } from '@/lib/api/client';

export function useAdminMetrics() {
  return useQuery({
    queryKey: ['admin', 'metrics'],
    queryFn: () => adminApi.getMetrics(),
  });
}

export function useAuditLogs(params?: QueryParams) {
  return useQuery({
    queryKey: ['admin', 'audit-logs', params],
    queryFn: () => adminApi.getAuditLogs(params),
  });
}
