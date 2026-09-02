import { z } from 'zod';

export const createRoleSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
  type: z.enum(['System', 'Custom']).default('Custom'),
  description: z.string().min(1, 'Description is required'),
  status: z.enum(['Active', 'Inactive']).default('Active'),
  iconName: z.string().optional(),
  iconBg: z.string().optional(),
  iconColor: z.string().optional(),
  isProtected: z.boolean().optional().default(false),
});

export const updateRoleSchema = createRoleSchema.partial();

export type CreateRoleInputSchema = z.infer<typeof createRoleSchema>;
export type UpdateRoleInputSchema = z.infer<typeof updateRoleSchema>;
