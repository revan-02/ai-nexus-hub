import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardPage from '@/app/dashboard/page';
import { NexusProvider } from '@/context/nexus-context';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
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
    data: { user: { name: 'Amith Learner', role: 'User' } },
    status: 'authenticated',
  }),
}));

// Mock next/image to render a standard img tag
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock useLearnerDashboard hook
vi.mock('@/hooks/api/use-dashboard', () => ({
  useLearnerDashboard: () => ({
    data: {
      data: {
        activeCourses: [
          { id: 1, title: 'Generative Models Overview', desc: 'Introduction to VAEs and GANs.', progress: 15, duration: '2h 10m', difficulty: 'Intermediate', level: 'Intermediate' },
        ],
        tabData: { liveSessions: [] },
        levelMeta: { title: 'Undergraduate AI Engineer', completionPercent: 50 },
      },
    },
    isLoading: false,
    isError: false,
  }),
}));

describe('Dashboard 7-Tier Academic Continuum Banner', () => {
  it('renders the 7-tier educational continuum header and Dr. Maya guidance', () => {
    render(
      <NexusProvider>
        <DashboardPage />
      </NexusProvider>
    );

    expect(screen.getByText(/7-Tier Educational Continuum/i)).toBeInTheDocument();
    expect(screen.getByText(/Class 5 \(7th std\) ➔ PhD & Research/i)).toBeInTheDocument();
    expect(screen.getByText(/Dr\. Maya Sharma/i)).toBeInTheDocument();
  });

  it('allows switching academic tier to Young Explorer (Class 5–7) and updates guidance', () => {
    render(
      <NexusProvider>
        <DashboardPage />
      </NexusProvider>
    );

    // Click on Young Explorer pill
    const youngExplorerPills = screen.getAllByText(/Young Explorer/i);
    expect(youngExplorerPills.length).toBeGreaterThan(0);
    fireEvent.click(youngExplorerPills[0]);

    // Check that Young Explorer guidance or track is shown
    expect(screen.getByText(/Young Explorer Track/i)).toBeInTheDocument();
    expect(screen.getByText(/Rock-Paper-Scissors AI Game & Color Sorting Bot/i)).toBeInTheDocument();
  });
});
