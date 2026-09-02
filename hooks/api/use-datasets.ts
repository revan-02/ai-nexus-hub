import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { datasetsApi, type CreateDatasetInput, type UpdateDatasetInput } from '@/lib/api/endpoints/datasets';
import type { QueryParams } from '@/lib/api/client';

export function useDatasets(params?: QueryParams) {
  return useQuery({
    queryKey: ['datasets', params],
    queryFn: () => datasetsApi.getAll(params),
  });
}

export function useDataset(id: string) {
  return useQuery({
    queryKey: ['datasets', id],
    queryFn: () => datasetsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateDataset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDatasetInput) => datasetsApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['datasets'] }),
  });
}

export function useUpdateDataset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDatasetInput }) => datasetsApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['datasets'] }),
  });
}

export function useDeleteDataset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => datasetsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['datasets'] }),
  });
}
