import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi, type CreateCourseInput, type UpdateCourseInput } from '@/lib/api/endpoints/courses';
import type { QueryParams } from '@/lib/api/client';

export function useCourses(params?: QueryParams) {
  return useQuery({
    queryKey: ['courses', params],
    queryFn: () => coursesApi.getAll(params),
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: ['courses', id],
    queryFn: () => coursesApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCourseInput) => coursesApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['courses'] }),
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCourseInput }) => coursesApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['courses'] }),
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => coursesApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['courses'] }),
  });
}
