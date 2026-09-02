import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
  avatar: z.string().optional(),
  role: z.enum(['Admin', 'Manager', 'Editor', 'Instructor', 'Analyst', 'Moderator', 'User']).default('User'),
  organization: z.string().optional(),
  status: z.enum(['Active', 'Inactive', 'Pending', 'Suspended', 'Deleted']).default('Active'),
});

export const updateUserSchema = createUserSchema.partial();

export type CreateUserInputSchema = z.infer<typeof createUserSchema>;
export type UpdateUserInputSchema = z.infer<typeof updateUserSchema>;
