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

  it('renders AdminLoginPage with dedicated restricted access portal UI', () => {
    render(<AdminLoginPage />);

    expect(screen.getByText(/Admin Portal/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/admin@yourdomain.com/i)).toBeInTheDocument();
  });

  it('renders clean standard LoginPage without demo credentials or demo buttons', () => {
    render(<LoginPage />);

    expect(screen.getByText(/Sign in to AI Nexus/i)).toBeInTheDocument();
    expect(screen.queryByText(/Admin Demo/i)).not.toBeInTheDocument();
  });

  it('submits admin credentials from AdminLoginPage and redirects to /admin', async () => {
    vi.mocked(signIn).mockResolvedValueOnce({
      error: undefined,
      status: 200,
      ok: true,
      url: '/admin',
    } as any);

    render(<AdminLoginPage />);

    const emailInput = screen.getByPlaceholderText(/admin@yourdomain.com/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••••••/i);
    const submitBtn = screen.getByRole('button', { name: /Access Admin Panel/i });

    fireEvent.change(emailInput, { target: { value: 'admin@ainexus.hub' } });
    fireEvent.change(passwordInput, { target: { value: 'AiNexus@Admin2026' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith(
        'credentials',
        expect.objectContaining({
          email: 'admin@ainexus.hub',
          password: 'AiNexus@Admin2026',
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
