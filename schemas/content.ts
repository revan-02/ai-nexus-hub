import { z } from 'zod';

export const createContentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  type: z.enum(['Course', 'Article', 'Tutorial', 'Dataset', 'Video', 'Quiz', 'Guide']),
  category: z.string().min(1, 'Category is required'),
  subCategory: z.string().optional(),
  authorId: z.string().min(1, 'Author ID is required'),
  status: z.enum(['Published', 'Draft', 'PendingReview', 'Archived', 'Rejected']).default('Draft'),
  thumbnailIcon: z.string().optional(),
});

export const updateContentSchema = createContentSchema.partial();

export type CreateContentInputSchema = z.infer<typeof createContentSchema>;
export type UpdateContentInputSchema = z.infer<typeof updateContentSchema>;
