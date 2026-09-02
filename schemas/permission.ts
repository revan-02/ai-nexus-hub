import { z } from 'zod';

export const createPermissionSchema = z.object({
  key: z.string().min(1, 'Permission key is required'),
  name: z.string().min(1, 'Permission name is required'),
  module: z.string().min(1, 'Module is required'),
  resource: z.string().min(1, 'Resource is required'),
  action: z.string().min(1, 'Action is required'),
  type: z.enum(['System', 'Custom']).default('Custom'),
  description: z.string().optional(),
});

export const updatePermissionSchema = createPermissionSchema.partial();

export type CreatePermissionInputSchema = z.infer<typeof createPermissionSchema>;
export type UpdatePermissionInputSchema = z.infer<typeof updatePermissionSchema>;
