import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api/endpoints/dashboard';

export function useLearnerDashboard() {
  return useQuery({
    queryKey: ['learner-dashboard'],
    queryFn: () => dashboardApi.getLearnerData(),
    staleTime: 5 * 60 * 1000, // 5 min cache
    refetchOnWindowFocus: false,
  });
}
