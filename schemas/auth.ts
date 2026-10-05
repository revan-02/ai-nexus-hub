import { z } from 'zod';

/**
 * Strict mobile phone validation
 * Accepts:
 *  - 10-digit mobile number: e.g. 9876543210 (starts with 6-9 in India or 1-9 internationally)
 *  - Country code prefixed number: e.g. +91 98765 43210, +1 555 123 4567
 * Rejects:
 *  - Random digit sequences like 655777667724 (12 digits with no country code)
 *  - Numbers with fewer than 10 digits
 *  - Numbers with more than 15 digits
 */
export function validatePhoneNumber(raw: string): { valid: boolean; formatted: string; error?: string } {
  if (!raw || typeof raw !== 'string') {
    return { valid: false, formatted: '', error: 'Mobile Phone Number is mandatory.' };
  }

  const clean = raw.trim();
  const digits = clean.replace(/[^0-9]/g, '');

  if (digits.length === 0) {
    return { valid: false, formatted: '', error: 'Mobile Phone Number is mandatory.' };
  }

  // If number does NOT start with '+'
  if (!clean.startsWith('+')) {
    // A domestic mobile number must be exactly 10 digits
    if (digits.length !== 10) {
      return {
        valid: false,
        formatted: '',
        error: `Invalid mobile number: "${raw}". Must be a valid 10-digit mobile number (or include country code like +91).`,
      };
    }
    // Must start with 6, 7, 8, or 9 for Indian mobile numbers
    if (!/^[6-9][0-9]{9}$/.test(digits)) {
      return {
        valid: false,
        formatted: '',
        error: 'Invalid 10-digit mobile number. Must start with 6, 7, 8, or 9.',
      };
    }
    return { valid: true, formatted: `+91${digits}` };
  }

  // If number starts with '+'
  if (digits.length < 10 || digits.length > 15) {
    return {
      valid: false,
      formatted: '',
      error: `Invalid international phone number "${raw}". Total digits with country code must be between 10 and 15 digits.`,
    };
  }

  // If country code is 91 (India)
  if (digits.startsWith('91')) {
    const subscriber = digits.slice(2);
    if (subscriber.length !== 10 || !/^[6-9][0-9]{9}$/.test(subscriber)) {
      return {
        valid: false,
        formatted: '',
        error: 'Invalid Indian mobile number (+91). Must be followed by a 10-digit number starting with 6, 7, 8, or 9.',
      };
    }
  }

  return { valid: true, formatted: `+${digits}` };
}

export const loginSchema = z.object({
  email: z.string().min(1, 'Email, Phone number, or Username is required'),
  password: z.string().min(1, 'Password is required'),
  name: z.string().optional(),
});

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  username: z
    .string()
    .min(2, 'Username is mandatory (min 2 characters)')
    .regex(/^[a-zA-Z0-9_@.-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  email: z.string().email('Valid email address is mandatory'),
  phone: z.string().refine((val) => validatePhoneNumber(val).valid, {
    message: 'Valid 10-digit mobile phone number is mandatory (e.g. +91 98765 43210 or 9876543210)',
  }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginInputSchema = z.infer<typeof loginSchema>;
export type RegisterInputSchema = z.infer<typeof registerSchema>;
