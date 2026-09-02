import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assessmentsApi, type CreateAssessmentInput, type UpdateAssessmentInput } from '@/lib/api/endpoints/assessments';
import type { QueryParams } from '@/lib/api/client';

export function useAssessments(params?: QueryParams) {
  return useQuery({
    queryKey: ['assessments', params],
    queryFn: () => assessmentsApi.getAll(params),
  });
}

export function useAssessment(id: string) {
  return useQuery({
    queryKey: ['assessments', id],
    queryFn: () => assessmentsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAssessmentInput) => assessmentsApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['assessments'] }),
  });
}

export function useUpdateAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAssessmentInput }) => assessmentsApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['assessments'] }),
  });
}

export function useDeleteAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => assessmentsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['assessments'] }),
  });
}
