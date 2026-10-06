import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import SettingsPage from '@/app/settings/page';
import { NexusProvider } from '@/context/nexus-context';

let mockSessionRole = 'User';
let mockTabParam: string | null = null;

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: (key: string) => (key === 'tab' ? mockTabParam : null),
  }),
  usePathname: () => '/settings',
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

// Mock next-auth/react
vi.mock('next-auth/react', () => ({
  signOut: vi.fn(),
  useSession: () => ({
    data: { user: { name: 'Test User', role: mockSessionRole } },
    status: 'authenticated',
  }),
}));

// Mock layout shells
vi.mock('@/components/nexus/nexus-shell', () => ({
  NexusShell: ({ children }: any) => <div data-testid="nexus-shell">{children}</div>,
}));

vi.mock('@/components/layout/admin-shell', () => ({
  AdminShell: ({ children }: any) => <div data-testid="admin-shell">{children}</div>,
}));

describe('Settings Role-Based UI Tab Visibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSessionRole = 'User';
    mockTabParam = null;
  });

  describe('Normal User / Learner View', () => {
    it('hides Payment Gateways, Web App APIs, Backup & Recovery, and AI Bot Controls from normal user tabs', () => {
      mockSessionRole = 'User';
      mockTabParam = null;

      render(
        <NexusProvider>
          <SettingsPage />
        </NexusProvider>
      );

      // Verify normal user tabs exist
      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByText('Preferences')).toBeInTheDocument();
      expect(screen.getByText('Coupons & Promo Codes')).toBeInTheDocument();
      expect(screen.getByText('Notifications')).toBeInTheDocument();
      expect(screen.getByText('Privacy & Security')).toBeInTheDocument();
      expect(screen.getByText('Billing & Plan')).toBeInTheDocument();
      expect(screen.getByText('Connected Accounts')).toBeInTheDocument();

      // Verify admin-only tabs are NOT in the document
      expect(screen.queryByText('Payment Gateways & APIs')).not.toBeInTheDocument();
      expect(screen.queryByText('Email & WhatsApp APIs')).not.toBeInTheDocument();
      expect(screen.queryByText('Backup & Recovery')).not.toBeInTheDocument();
      expect(screen.queryByText('AI Bot Controls (Admin)')).not.toBeInTheDocument();

      // Verify subtitle does not mention payment gateways or system backups
      expect(
        screen.getByText(/Manage your profile, learning preferences, notifications, security, billing, and connected accounts\./i)
      ).toBeInTheDocument();
    });

    it('blocks normal user from viewing Backup & Recovery panel even when requesting ?tab=backup-recovery', () => {
      mockSessionRole = 'User';
      mockTabParam = 'backup-recovery';

      render(
        <NexusProvider>
          <SettingsPage />
        </NexusProvider>
      );

      // Should fall back to Profile tab, NOT render Backup & Recovery panel
      expect(screen.queryByText('Database Snapshot & Backups')).not.toBeInTheDocument();
      expect(screen.queryByText('PostgreSQL Core DB Snapshot')).not.toBeInTheDocument();
      expect(screen.queryByText('Generate New Backup')).not.toBeInTheDocument();
      // Should display Profile content
      expect(screen.getByText('Profile Information')).toBeInTheDocument();
    });

    it('blocks normal user from viewing Payment Gateways panel when requesting ?tab=payment-gateways', () => {
      mockSessionRole = 'User';
      mockTabParam = 'payment-gateways';

      render(
        <NexusProvider>
          <SettingsPage />
        </NexusProvider>
      );

      expect(screen.queryByText(/Razorpay Payment Gateway/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Stripe Gateway/i)).not.toBeInTheDocument();
      expect(screen.getByText('Profile Information')).toBeInTheDocument();
    });

    it('blocks normal user from viewing Email & WhatsApp APIs panel when requesting ?tab=email-whatsapp', () => {
      mockSessionRole = 'User';
      mockTabParam = 'email-whatsapp';

      render(
        <NexusProvider>
          <SettingsPage />
        </NexusProvider>
      );

      expect(screen.queryByText(/Email & WhatsApp Communication APIs/i)).not.toBeInTheDocument();
      expect(screen.getByText('Profile Information')).toBeInTheDocument();
    });
  });

  describe('Admin Portal View', () => {
    it('renders all administrative tabs and panels for Admin role', () => {
      mockSessionRole = 'Admin';
      mockTabParam = 'backup-recovery';

      render(
        <NexusProvider>
          <SettingsPage />
        </NexusProvider>
      );

      // Admin tabs must exist
      expect(screen.getByText('Payment Gateways & APIs')).toBeInTheDocument();
      expect(screen.getByText('Email & WhatsApp APIs')).toBeInTheDocument();
      expect(screen.getByText('Backup & Recovery')).toBeInTheDocument();
      expect(screen.getByText('AI Bot Controls (Admin)')).toBeInTheDocument();

      // Backup & Recovery panel is rendered for admin
      expect(screen.getByText('Database Snapshot & Backups')).toBeInTheDocument();
      expect(screen.getByText('Generate New Backup')).toBeInTheDocument();

      // Subtitle contains admin copy
      expect(
        screen.getByText(/Manage your profile, learning preferences, notifications, security, billing, payment gateways, APIs, and system backups\./i)
      ).toBeInTheDocument();
    });

    it('allows Admin to view Payment Gateways panel when active', () => {
      mockSessionRole = 'Super Admin';
      mockTabParam = 'payment-gateways';

      render(
        <NexusProvider>
          <SettingsPage />
        </NexusProvider>
      );

      expect(screen.getByText(/Razorpay Payment Gateway/i)).toBeInTheDocument();
      expect(screen.getByText(/Stripe Gateway \(International USD\/EUR\)/i)).toBeInTheDocument();
    });

    it('allows Admin to view Email & WhatsApp APIs panel when active', () => {
      mockSessionRole = 'Manager';
      mockTabParam = 'email-whatsapp';

      render(
        <NexusProvider>
          <SettingsPage />
        </NexusProvider>
      );

      expect(screen.getByText(/Email & WhatsApp Communication APIs/i)).toBeInTheDocument();
    });
  });
});
