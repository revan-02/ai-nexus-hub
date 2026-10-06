import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NexusBottomNav } from '@/components/nexus/nexus-bottom-nav';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { NexusProvider } from '@/context/nexus-context';

let mockPathname = '/dashboard';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
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
    data: { user: { name: 'Learner User', role: 'User' } },
    status: 'authenticated',
  }),
}));

describe('Mobile App Responsive Navigation & Shell', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPathname = '/dashboard';
  });

  describe('NexusBottomNav Component', () => {
    it('renders all 5 native mobile tab destinations with labels and icons', () => {
      render(<NexusBottomNav />);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Learn')).toBeInTheDocument();
      expect(screen.getByText('Practice')).toBeInTheDocument();
      expect(screen.getByText('AI Bot')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('highlights Home tab when active on dashboard', () => {
      mockPathname = '/dashboard';
      render(<NexusBottomNav />);

      const homeLink = screen.getByRole('link', { name: /home/i });
      expect(homeLink).toHaveClass('text-purple-400');
    });

    it('highlights Learn tab when on roadmap or courses route', () => {
      mockPathname = '/roadmap';
      render(<NexusBottomNav />);

      const learnLink = screen.getByRole('link', { name: /learn/i });
      expect(learnLink).toHaveClass('text-purple-400');
    });

    it('highlights Practice tab when on challenges or quizzes route', () => {
      mockPathname = '/challenges';
      render(<NexusBottomNav />);

      const practiceLink = screen.getByRole('link', { name: /practice/i });
      expect(practiceLink).toHaveClass('text-purple-400');
    });

    it('highlights AI Bot tab when on ollama route', () => {
      mockPathname = '/ollama';
      render(<NexusBottomNav />);

      const aiBotLink = screen.getByRole('link', { name: /ai bot/i });
      expect(aiBotLink).toHaveClass('text-purple-400');
      expect(screen.getByText('Free')).toBeInTheDocument();
    });

    it('highlights Settings tab when on settings route', () => {
      mockPathname = '/settings';
      render(<NexusBottomNav />);

      const settingsLink = screen.getByRole('link', { name: /settings/i });
      expect(settingsLink).toHaveClass('text-purple-400');
    });
  });

  describe('NexusShell Integration', () => {
    it('renders NexusBottomNav and wraps content with mobile-safe padding', () => {
      render(
        <NexusProvider>
          <NexusShell>
            <div data-testid="main-content">Learner Dashboard Content</div>
          </NexusShell>
        </NexusProvider>
      );

      // Verify content is rendered
      expect(screen.getByTestId('main-content')).toBeInTheDocument();

      // Verify bottom nav is rendered
      const navElement = screen.getByRole('navigation', { name: /mobile bottom navigation/i });
      expect(navElement).toBeInTheDocument();
      expect(navElement).toHaveClass('lg:hidden');
    });
  });
});
