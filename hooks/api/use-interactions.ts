import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { interactionsApi } from '@/lib/api/endpoints/interactions';

export function useInteractionSummary(contentId: string, userId?: string) {
  return useQuery({
    queryKey: ['interactions', contentId, userId],
    queryFn: () => interactionsApi.getSummary(contentId, userId),
    enabled: !!contentId,
  });
}

export function useToggleReaction(contentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reaction, userId }: { reaction: 'LIKE' | 'DISLIKE' | 'NONE'; userId?: string }) =>
      interactionsApi.toggleReaction(contentId, reaction, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interactions', contentId] });
      queryClient.invalidateQueries({ queryKey: ['content'] });
    },
  });
}

export function useRateContent(contentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ rating, userId }: { rating: number; userId?: string }) =>
      interactionsApi.rate(contentId, rating, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interactions', contentId] });
      queryClient.invalidateQueries({ queryKey: ['content'] });
    },
  });
}

export function useComments(contentId: string) {
  return useQuery({
    queryKey: ['comments', contentId],
    queryFn: () => interactionsApi.getComments(contentId),
    enabled: !!contentId,
  });
}

export function useAddComment(contentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ text, userId }: { text: string; userId?: string }) =>
      interactionsApi.addComment(contentId, text, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', contentId] });
      queryClient.invalidateQueries({ queryKey: ['interactions', contentId] });
    },
  });
}
