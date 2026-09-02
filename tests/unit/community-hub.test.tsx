import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CommunityPage from '@/app/community/page';

vi.mock('@/components/nexus/nexus-shell', () => ({
  NexusShell: ({ children }: any) => <div>{children}</div>,
}));

// Mock Next.js navigation hooks
vi.mock('next/navigation', () => ({
  usePathname: () => '/community',
  useSearchParams: () => new URLSearchParams('tab=discussions'),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe('Global AI Community & Guilds Onboarding', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Global AI Community header, how to join process banner, and active tabs', () => {
    render(<CommunityPage />);
    expect(screen.getByText('Global AI & GenAI Community')).toBeInTheDocument();
    expect(screen.getByText('Pick Your Research Guild')).toBeInTheDocument();
    expect(screen.getByText('Connect Discord & GitHub')).toBeInTheDocument();
    expect(screen.getByText('Unlock 24/7 Study Rooms')).toBeInTheDocument();
  });

  it('opens How to Join Community Modal, selects specialization, and claims verified pass', () => {
    render(<CommunityPage />);
    const joinBtn = screen.getByText(/View \/ Manage Community Pass|How to Join Community/i);
    fireEvent.click(joinBtn);

    expect(screen.getByText('AI Community Pass & Onboarding')).toBeInTheDocument();
    expect(screen.getByText('Choose Your Primary AI Specialization')).toBeInTheDocument();

    // Click next step
    const nextBtn = screen.getByText(/Next: Connect & Claim Pass/i);
    fireEvent.click(nextBtn);

    expect(screen.getByText(/Verified Scholar Pass/i)).toBeInTheDocument();
    expect(screen.getByText(/Complete & Activate Pass/i)).toBeInTheDocument();

    // Complete activation
    fireEvent.click(screen.getByText(/Complete & Activate Pass/i));
    expect(screen.queryByText('AI Community Pass & Onboarding')).not.toBeInTheDocument();
  });

  it('renders Discussion posts with upvote/like interactions', () => {
    render(<CommunityPage />);
    expect(screen.getByText(/Breakthroughs in FlashAttention-3/i)).toBeInTheDocument();
    const likeBtn = screen.getByText('142');
    fireEvent.click(likeBtn);
    expect(screen.getByText('143')).toBeInTheDocument();
  });
});
