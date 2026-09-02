import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contentApi, type CreateContentInput, type UpdateContentInput } from '@/lib/api/endpoints/content';
import type { QueryParams } from '@/lib/api/client';

export function useContents(params?: QueryParams) {
  return useQuery({
    queryKey: ['content', params],
    queryFn: () => contentApi.getAll(params),
  });
}

export { useContents as useContentList };


export function useContent(id: string) {
  return useQuery({
    queryKey: ['content', id],
    queryFn: () => contentApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateContentInput) => contentApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['content'] }),
  });
}

export function useUpdateContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateContentInput }) => contentApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['content'] }),
  });
}

export function useDeleteContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contentApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['content'] }),
  });
}
