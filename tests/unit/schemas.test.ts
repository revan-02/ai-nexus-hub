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
    it('validates correct login credentials with email, username, or phone', () => {
      expect(
        loginSchema.safeParse({
          email: 'user@example.com',
          password: 'password123',
        }).success
      ).toBe(true);

      expect(
        loginSchema.safeParse({
          email: 'johndoe',
          password: 'password123',
        }).success
      ).toBe(true);

      expect(
        loginSchema.safeParse({
          email: '+919876543210',
          password: 'password123',
        }).success
      ).toBe(true);
    });

    it('validates a complete valid registration with username, email, and phone mandatory', () => {
      const result = registerSchema.safeParse({
        name: 'Ada Lovelace',
        username: 'ada_lovelace',
        email: 'ada@example.com',
        phone: '+91 98765 43210',
        password: 'securePassword123',
      });
      expect(result.success).toBe(true);
    });

    it('rejects registration when username is missing or too short', () => {
      const result = registerSchema.safeParse({
        name: 'Ada Lovelace',
        username: 'a',
        email: 'ada@example.com',
        phone: '+919876543210',
        password: 'securePassword123',
      });
      expect(result.success).toBe(false);
    });

    it('rejects registration when email is invalid', () => {
      const result = registerSchema.safeParse({
        name: 'Ada Lovelace',
        username: 'ada_lovelace',
        email: 'not-an-email',
        phone: '+919876543210',
        password: 'securePassword123',
      });
      expect(result.success).toBe(false);
    });

    it('rejects registration when phone number is missing or under 10 digits', () => {
      const missingPhone = registerSchema.safeParse({
        name: 'Ada Lovelace',
        username: 'ada_lovelace',
        email: 'ada@example.com',
        password: 'securePassword123',
      });
      expect(missingPhone.success).toBe(false);

      const shortPhone = registerSchema.safeParse({
        name: 'Ada Lovelace',
        username: 'ada_lovelace',
        email: 'ada@example.com',
        phone: '12345',
        password: 'securePassword123',
      });
      expect(shortPhone.success).toBe(false);
    });

    it('rejects short passwords in registration', () => {
      const result = registerSchema.safeParse({
        name: 'Test User',
        username: 'testuser',
        email: 'user@example.com',
        phone: '+919876543210',
        password: '123',
      });
      expect(result.success).toBe(false);
    });
  });
});
