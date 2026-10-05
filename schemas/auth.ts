import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email, Phone number, or Username is required'),
  password: z.string().min(1, 'Password is required'),
  name: z.string().optional(),
});

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  username: z.string().min(2, 'Username is required (min 2 characters)'),
  email: z.string().email('Valid email address is required'),
  phone: z.string().min(10, 'Valid 10-digit mobile phone number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginInputSchema = z.infer<typeof loginSchema>;
export type RegisterInputSchema = z.infer<typeof registerSchema>;
