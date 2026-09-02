import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InteractionService } from '@/services';
import prisma from '@/lib/db/prisma';

vi.mock('@/lib/db/prisma', () => ({
  default: {
    content: {
      findUnique: vi.fn(),
    },
    contentInteraction: {
      findMany: vi.fn(),
      upsert: vi.fn(),
    },
    contentComment: {
      count: vi.fn(),
      create: vi.fn(),
      findMany: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  },
}));

describe('InteractionService Business Logic & Security Guards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('prevents multiple fake votes by upserting unique userId_contentId record', async () => {
    const mockContent = { id: 'cnt-1', title: 'Attention Is All You Need' };
    (prisma.content.findUnique as any).mockResolvedValue(mockContent);
    (prisma.contentInteraction.upsert as any).mockResolvedValue({
      id: 'inter-1',
      userId: 'usr-1',
      contentId: 'cnt-1',
      reaction: 'LIKE',
    });
    (prisma.contentInteraction.findMany as any).mockResolvedValue([
      { userId: 'usr-1', reaction: 'LIKE', rating: 5 },
    ]);
    (prisma.contentComment.count as any).mockResolvedValue(0);

    const summary = await InteractionService.toggleReaction('usr-1', 'cnt-1', 'LIKE');

    expect(prisma.contentInteraction.upsert).toHaveBeenCalledWith({
      where: { userId_contentId: { userId: 'usr-1', contentId: 'cnt-1' } },
      update: { reaction: 'LIKE' },
      create: { userId: 'usr-1', contentId: 'cnt-1', reaction: 'LIKE' },
    });
    expect(summary.likesCount).toBe(1);
    expect(summary.userReaction).toBe('LIKE');
  });

  it('sanitizes script tags from user comments to prevent XSS attacks', async () => {
    const mockContent = { id: 'cnt-1', title: 'Test Article' };
    (prisma.content.findUnique as any).mockResolvedValue(mockContent);
    (prisma.contentComment.create as any).mockImplementation((args: any) =>
      Promise.resolve({ id: 'cmt-100', ...args.data })
    );

    const dangerousText = 'Great article! <script>alert("xss")</script>';
    const comment = await InteractionService.addComment('usr-1', 'cnt-1', dangerousText);

    expect(comment.text).toBe('Great article! &lt;script&gt;alert("xss")&lt;/script&gt;');
  });

  it('enforces rating range bounds (1 to 5 stars)', async () => {
    await expect(InteractionService.rateContent('usr-1', 'cnt-1', 6)).rejects.toThrow(
      'Rating must be an integer between 1 and 5 stars'
    );
    await expect(InteractionService.rateContent('usr-1', 'cnt-1', 0)).rejects.toThrow(
      'Rating must be an integer between 1 and 5 stars'
    );
  });
});
