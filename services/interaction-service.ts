import prisma from '@/lib/db/prisma';
import { createAuditLog } from './audit-service';
import type { ReactionType } from '@prisma/client';

export async function getInteractionSummary(contentId: string, userId?: string) {
  const [interactions, commentsCount] = await Promise.all([
    prisma.contentInteraction.findMany({ where: { contentId } }),
    prisma.contentComment.count({ where: { contentId } }),
  ]);

  const likesCount = interactions.filter((i) => i.reaction === 'LIKE').length;
  const dislikesCount = interactions.filter((i) => i.reaction === 'DISLIKE').length;
  const sharesCount = interactions.filter((i) => i.shared).length;

  const ratedInteractions = interactions.filter((i) => i.rating !== null && i.rating > 0);
  const totalRatingSum = ratedInteractions.reduce((acc, curr) => acc + (curr.rating || 0), 0);
  const averageRating = ratedInteractions.length > 0 ? Number((totalRatingSum / ratedInteractions.length).toFixed(1)) : 5.0;

  const currentUserInteraction = userId
    ? interactions.find((i) => i.userId === userId)
    : null;

  return {
    contentId,
    likesCount,
    dislikesCount,
    sharesCount,
    commentsCount,
    averageRating,
    totalRatingsCount: ratedInteractions.length,
    userReaction: currentUserInteraction?.reaction || 'NONE',
    userRating: currentUserInteraction?.rating || null,
  };
}

export async function toggleReaction(userId: string, contentId: string, reaction: ReactionType) {
  const content = await prisma.content.findUnique({ where: { id: contentId } });
  if (!content) throw new Error(`Content item with ID ${contentId} not found`);

  const updated = await prisma.contentInteraction.upsert({
    where: {
      userId_contentId: { userId, contentId },
    },
    update: { reaction },
    create: { userId, contentId, reaction },
  });

  await createAuditLog({
    userId,
    action: `Updated reaction on content '${content.title}' to ${reaction}`,
    target: contentId,
    type: 'course',
  });

  return getInteractionSummary(contentId, userId);
}

export async function rateContent(userId: string, contentId: string, rating: number) {
  if (rating < 1 || rating > 5) {
    throw new Error('Rating must be an integer between 1 and 5 stars');
  }

  const content = await prisma.content.findUnique({ where: { id: contentId } });
  if (!content) throw new Error(`Content item with ID ${contentId} not found`);

  await prisma.contentInteraction.upsert({
    where: {
      userId_contentId: { userId, contentId },
    },
    update: { rating },
    create: { userId, contentId, rating },
  });

  await createAuditLog({
    userId,
    action: `Submitted ${rating}-star rating on content '${content.title}'`,
    target: contentId,
    type: 'course',
  });

  return getInteractionSummary(contentId, userId);
}

export async function addComment(userId: string, contentId: string, text: string) {
  const cleanText = text.trim();
  if (cleanText.length < 3) {
    throw new Error('Comment must be at least 3 characters long');
  }
  if (cleanText.length > 500) {
    throw new Error('Comment cannot exceed 500 characters');
  }

  // Basic XSS Script Sanitization
  const sanitizedText = cleanText.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const content = await prisma.content.findUnique({ where: { id: contentId } });
  if (!content) throw new Error(`Content item with ID ${contentId} not found`);

  const comment = await prisma.contentComment.create({
    data: {
      userId,
      contentId,
      text: sanitizedText,
    },
    include: {
      user: { select: { id: true, name: true, avatar: true } },
    },
  });

  await createAuditLog({
    userId,
    action: `Posted comment on content '${content.title}'`,
    target: comment.id,
    type: 'course',
  });

  return comment;
}

export async function getComments(contentId: string) {
  return await prisma.contentComment.findMany({
    where: { contentId },
    include: {
      user: { select: { id: true, name: true, avatar: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}
