import apiClient, { type SingleResponse } from '../client';

export interface InteractionSummary {
  contentId: string;
  likesCount: number;
  dislikesCount: number;
  sharesCount: number;
  commentsCount: number;
  averageRating: number;
  totalRatingsCount: number;
  userReaction: 'LIKE' | 'DISLIKE' | 'NONE';
  userRating: number | null;
}

export interface ContentCommentItem {
  id: string;
  text: string;
  createdAt: string;
  user: { id: string; name: string; avatar: string };
}

export const interactionsApi = {
  getSummary: (contentId: string, userId?: string) =>
    apiClient.get<SingleResponse<InteractionSummary>>(`/api/content/${contentId}/reactions`, { userId }),
  toggleReaction: (contentId: string, reaction: 'LIKE' | 'DISLIKE' | 'NONE', userId?: string) =>
    apiClient.post<SingleResponse<InteractionSummary>>(`/api/content/${contentId}/reactions`, { reaction, userId }),
  rate: (contentId: string, rating: number, userId?: string) =>
    apiClient.post<SingleResponse<InteractionSummary>>(`/api/content/${contentId}/reactions`, { rating, userId }),
  getComments: (contentId: string) =>
    apiClient.get<{ data: ContentCommentItem[] }>(`/api/content/${contentId}/comments`),
  addComment: (contentId: string, text: string, userId?: string) =>
    apiClient.post<SingleResponse<ContentCommentItem>>(`/api/content/${contentId}/comments`, { text, userId }),
};
