import { z } from 'zod';

export const createSessionSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  ip: z.string().min(1, 'IP address is required'),
  location: z.string().min(1, 'Location is required'),
  device: z.string().min(1, 'Device description is required'),
  authMethod: z.string().default('Password'),
  duration: z.string().default('0m'),
  status: z.enum(['Active', 'Idle', 'Flagged', 'Revoked']).default('Active'),
  lastActive: z.string().default('Just now'),
});

export const updateSessionSchema = createSessionSchema.partial();

export type CreateSessionInputSchema = z.infer<typeof createSessionSchema>;
export type UpdateSessionInputSchema = z.infer<typeof updateSessionSchema>;
