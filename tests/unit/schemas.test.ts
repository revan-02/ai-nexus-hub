import { describe, it, expect } from 'vitest';
import { createUserSchema, updateUserSchema } from '@/schemas/user';
import { createRoleSchema } from '@/schemas/role';
import { createContentSchema } from '@/schemas/content';
import { loginSchema, registerSchema } from '@/schemas/auth';

describe('Zod Validation Schemas', () => {
  describe('User Schemas', () => {
    it('validates a valid user input', () => {
      const validUser = {
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        role: 'Admin',
        status: 'Active',
      };
      const result = createUserSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    it('fails when email is invalid', () => {
      const invalidUser = {
        name: 'John Doe',
        username: 'johndoe',
        email: 'invalid-email',
      };
      const result = createUserSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });
  });

  describe('Role Schemas', () => {
    it('validates a valid role input', () => {
      const validRole = {
        name: 'Custom Admin',
        type: 'Custom',
        description: 'Custom administrative role',
        status: 'Active',
      };
      const result = createRoleSchema.safeParse(validRole);
      expect(result.success).toBe(true);
    });
  });

  describe('Content Schemas', () => {
    it('validates a valid content input', () => {
      const validContent = {
        title: 'Deep Learning 101',
        description: 'Introductory deep learning course',
        type: 'Course',
        category: 'Machine Learning',
        authorId: 'usr-1',
        status: 'Published',
      };
      const result = createContentSchema.safeParse(validContent);
      expect(result.success).toBe(true);
    });
  });

  describe('Auth Schemas', () => {
    it('validates correct login credentials', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('rejects short passwords in registration', () => {
      const result = registerSchema.safeParse({
        name: 'Test User',
        username: 'testuser',
        email: 'user@example.com',
        password: '123',
      });
      expect(result.success).toBe(false);
    });
  });
});
