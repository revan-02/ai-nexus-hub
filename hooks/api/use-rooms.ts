import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roomsApi } from '@/lib/api/endpoints/rooms';
import { certificatesApi } from '@/lib/api/endpoints/certificates';
import type { QueryParams } from '@/lib/api/client';

export function useRooms(params?: QueryParams) {
  return useQuery({
    queryKey: ['rooms', params],
    queryFn: () => roomsApi.getAll(params),
    staleTime: 1000 * 60, // 1 minute stale time for fast page switching
  });
}

export function useRoom(id: string) {
  return useQuery({
    queryKey: ['rooms', id],
    queryFn: () => roomsApi.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60,
  });
}

export function useRoomProgress(id: string) {
  return useQuery({
    queryKey: ['rooms', id, 'progress'],
    queryFn: () => roomsApi.getProgress(id),
    enabled: !!id,
    staleTime: 1000 * 30, // 30s stale time for room progress
  });
}

export function useSubmitTask(roomId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, answer, timeSpentSec }: { taskId: string; answer: unknown; timeSpentSec?: number }) =>
      roomsApi.submitAnswer(roomId, taskId, answer, timeSpentSec),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms', roomId] });
      queryClient.invalidateQueries({ queryKey: ['rooms', roomId, 'progress'] });
      queryClient.invalidateQueries({ queryKey: ['learner-dashboard'] });
    },
  });
}

export function useCertificate(id: string) {
  return useQuery({
    queryKey: ['certificate', id],
    queryFn: () => certificatesApi.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}
