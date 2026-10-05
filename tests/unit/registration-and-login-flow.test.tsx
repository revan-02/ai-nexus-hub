import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPage from '@/app/(auth)/register/page';
import LoginPage from '@/app/(auth)/login/page';
import { registerSchema, loginSchema } from '@/schemas/auth';
import { signIn } from 'next-auth/react';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  usePathname: () => '/register',
  useRouter: () => ({ push: mockPush, replace: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
  useSession: () => ({ data: null }),
  signOut: vi.fn(),
}));

describe('Registration and Multi-Identifier Login Flow Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('1. Registration Schema & Field Requirements', () => {
    it('requires name, username, email, phone, and password', () => {
      const valid = {
        name: 'Alan Turing',
        username: 'alanturing',
        email: 'turing@ai-nexus.tech',
        phone: '+91 98450 12345',
        password: 'password123',
      };
      const result = registerSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('enforces mandatory username, email, and phone', () => {
      // Missing username
      expect(
        registerSchema.safeParse({
          name: 'Alan Turing',
          email: 'turing@ai-nexus.tech',
          phone: '+919845012345',
          password: 'password123',
        }).success
      ).toBe(false);

      // Missing email
      expect(
        registerSchema.safeParse({
          name: 'Alan Turing',
          username: 'alanturing',
          phone: '+919845012345',
          password: 'password123',
        }).success
      ).toBe(false);

      // Missing phone
      expect(
        registerSchema.safeParse({
          name: 'Alan Turing',
          username: 'alanturing',
          email: 'turing@ai-nexus.tech',
          password: 'password123',
        }).success
      ).toBe(false);
    });
  });

  describe('2. RegisterPage UI Component Rendering', () => {
    it('renders all mandatory fields with asterisks and mandatory badges', () => {
      render(<RegisterPage />);

      expect(screen.getByText(/Create Your Account/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/e\.g\. John Doe/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/johndoe or ai_ninja/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/john\.doe@example\.com/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/\+91 98765 43210/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/••••••••••••/i)).toBeInTheDocument();

      // Check mandatory indicators
      expect(screen.getAllByText(/Mandatory/i).length).toBeGreaterThanOrEqual(3);
    });

    it('submits registration form and calls signIn on success', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => ({
          data: {
            id: 'usr-new-1',
            name: 'Grace Hopper',
            username: '@grace_hopper',
            email: 'grace@example.com',
            phone: '+91 98765 43210',
          },
        }),
      });
      global.fetch = mockFetch;

      vi.mocked(signIn).mockResolvedValueOnce({
        error: undefined,
        status: 200,
        ok: true,
        url: '/dashboard',
      } as any);

      render(<RegisterPage />);

      fireEvent.change(screen.getByPlaceholderText(/e\.g\. John Doe/i), {
        target: { value: 'Grace Hopper' },
      });
      fireEvent.change(screen.getByPlaceholderText(/johndoe or ai_ninja/i), {
        target: { value: 'grace_hopper' },
      });
      fireEvent.change(screen.getByPlaceholderText(/john\.doe@example\.com/i), {
        target: { value: 'grace@example.com' },
      });
      fireEvent.change(screen.getByPlaceholderText(/\+91 98765 43210/i), {
        target: { value: '+91 98765 43210' },
      });
      fireEvent.change(screen.getByPlaceholderText(/••••••••••••/i), {
        target: { value: 'secretPass123' },
      });

      const submitBtn = screen.getByRole('button', { name: /Complete Registration & Launch/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/auth/register',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({
              name: 'Grace Hopper',
              username: 'grace_hopper',
              email: 'grace@example.com',
              phone: '+91 98765 43210',
              password: 'secretPass123',
            }),
          })
        );
      });

      await waitFor(() => {
        expect(signIn).toHaveBeenCalledWith(
          'credentials',
          expect.objectContaining({
            email: 'grace@example.com',
            password: 'secretPass123',
            redirect: false,
          })
        );
      });
    });
  });

  describe('3. LoginPage Multi-Identifier Support', () => {
    it('allows sign in with username or mobile phone and passes cleanIdentifier to signIn', async () => {
      vi.mocked(signIn).mockResolvedValueOnce({
        error: undefined,
        status: 200,
        ok: true,
        url: '/dashboard',
      } as any);

      render(<LoginPage />);

      const identifierInput = screen.getByPlaceholderText(/learner@nexus\.ai, @username, or \+91 98765 43210/i);
      const passwordInput = screen.getByPlaceholderText(/••••••••••••/i);

      fireEvent.change(identifierInput, { target: { value: 'alanturing' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      const submitBtn = screen.getByRole('button', { name: /Sign In as Learner/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(signIn).toHaveBeenCalledWith(
          'credentials',
          expect.objectContaining({
            email: 'alanturing',
            password: 'password123',
            redirect: false,
          })
        );
      });
    });

    it('displays error message when signIn returns an error', async () => {
      vi.mocked(signIn).mockResolvedValueOnce({
        error: 'CredentialsSignin',
        status: 401,
        ok: false,
        url: null,
      } as any);

      render(<LoginPage />);

      const identifierInput = screen.getByPlaceholderText(/learner@nexus\.ai, @username, or \+91 98765 43210/i);
      const passwordInput = screen.getByPlaceholderText(/••••••••••••/i);

      fireEvent.change(identifierInput, { target: { value: 'wrong@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'badpass' } });

      const submitBtn = screen.getByRole('button', { name: /Sign In as Learner/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(
          screen.getByText(/Invalid credentials\. Please verify your email, username, or phone number and password\./i)
        ).toBeInTheDocument();
      });
    });
  });
});
