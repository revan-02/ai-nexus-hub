import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import LoginPage from '@/app/(auth)/login/page';
import AdminLoginPage from '@/app/admin/login/page';
import AdminDashboardAliasPage from '@/app/admin/dashboard/page';
import { signIn } from 'next-auth/react';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  usePathname: () => '/admin/login',
  useRouter: () => ({ push: mockPush, replace: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
  useSession: () => ({ data: null }),
  signOut: vi.fn(),
}));

vi.mock('@/components/layout/admin-shell', () => ({
  AdminShell: ({ children }: { children: React.ReactNode }) => <div data-testid="admin-shell">{children}</div>,
}));

describe('Admin Routing and Credentials Test Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders AdminLoginPage with initialRole="admin" and pre-filled admin credentials', () => {
    render(<AdminLoginPage />);

    expect(screen.getByText(/Admin Portal Access/i)).toBeInTheDocument();
    const emailInput = screen.getByPlaceholderText(/admin@nexus.ai/i) as HTMLInputElement;
    expect(emailInput.value).toBe('john.doe@example.com');
  });

  it('allows clicking quick fill for admin credentials (john.doe@example.com / password123)', () => {
    render(<LoginPage />);

    const adminQuickFillBtn = screen.getByText(/Admin Demo/i);
    fireEvent.click(adminQuickFillBtn);

    const emailInput = screen.getByPlaceholderText(/admin@nexus.ai/i) as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText(/••••••••••••/i) as HTMLInputElement;

    expect(emailInput.value).toBe('john.doe@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('redirects successfully authenticated admin to /admin executive command center', async () => {
    vi.mocked(signIn).mockResolvedValueOnce({
      error: undefined,
      status: 200,
      ok: true,
      url: '/admin',
    } as any);

    render(<LoginPage initialRole="admin" />);

    const submitBtn = screen.getByRole('button', { name: /Sign In to Admin Portal/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith(
        'credentials',
        expect.objectContaining({
          email: 'john.doe@example.com',
          password: 'password123',
          redirect: false,
        })
      );
    });

    await waitFor(
      () => {
        expect(mockPush).toHaveBeenCalledWith('/admin');
      },
      { timeout: 1500 }
    );
  });

  it('renders AdminDashboardAliasPage without crashing', () => {
    render(<AdminDashboardAliasPage />);
    expect(screen.getByTestId('admin-shell')).toBeInTheDocument();
  });
});
