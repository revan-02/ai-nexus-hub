import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { algorithmsApi, type CreateAlgorithmInput, type UpdateAlgorithmInput } from '@/lib/api/endpoints/algorithms';
import type { QueryParams } from '@/lib/api/client';

export function useAlgorithms(params?: QueryParams) {
  return useQuery({
    queryKey: ['algorithms', params],
    queryFn: () => algorithmsApi.getAll(params),
  });
}

export function useAlgorithm(id: string) {
  return useQuery({
    queryKey: ['algorithms', id],
    queryFn: () => algorithmsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateAlgorithm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAlgorithmInput) => algorithmsApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['algorithms'] }),
  });
}

export function useUpdateAlgorithm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAlgorithmInput }) => algorithmsApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['algorithms'] }),
  });
}

export function useDeleteAlgorithm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => algorithmsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['algorithms'] }),
  });
}
