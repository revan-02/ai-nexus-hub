import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CollaborativeProjectRoomPage from '@/app/projects/[id]/collaborate/page';

// Mock hooks
vi.mock('@/hooks/api/use-projects', () => ({
  useProject: vi.fn().mockReturnValue({
    data: {
      data: {
        id: 'prj-1',
        name: 'Multimodal Medical Radiography Agent (Team Sprint)',
        description: 'Deploying 3D UNet and ViT models on Kubernetes to automate early cancer screening.',
        category: 'AI & ML',
        technologies: ['PyTorch', 'FastAPI', 'Kubernetes', 'DICOM', 'Docker'],
      },
    },
    isLoading: false,
  }),
}));

vi.mock('next-auth/react', () => ({
  useSession: vi.fn().mockReturnValue({
    data: { user: { name: 'Sarah Johnson', email: 'sarah.j@techcorp.io' } },
  }),
}));

vi.mock('@/components/nexus/nexus-shell', () => ({
  NexusShell: ({ children }: any) => <div>{children}</div>,
}));

describe('Collaborative Student Project Room & Social Publishing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Collaborative Project Room with live deadline countdown clock and progress', () => {
    render(<CollaborativeProjectRoomPage params={{ id: 'prj-1' }} />);

    expect(screen.getByText(/Multimodal Medical Radiography Agent \(Team Sprint\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Collaborative Team Room/i)).toBeInTheDocument();
    expect(screen.getByText(/4 Active Students/i)).toBeInTheDocument();
    expect(screen.getByText(/Project Submission Deadline/i)).toBeInTheDocument();
    expect(screen.getByText('Days')).toBeInTheDocument();
    expect(screen.getByText('Hours')).toBeInTheDocument();
    expect(screen.getByText('Mins')).toBeInTheDocument();
    expect(screen.getByText('Secs')).toBeInTheDocument();
  });

  it('renders student team roster and allows peer skill endorsements', () => {
    render(<CollaborativeProjectRoomPage params={{ id: 'prj-1' }} />);

    expect(screen.getByText(/Assigned Student Team & Peer Skill Endorsements/i)).toBeInTheDocument();
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByText('Dr. Alex Morgan')).toBeInTheDocument();
    expect(screen.getByText('James Wilson')).toBeInTheDocument();
    expect(screen.getByText('Anna Martinez')).toBeInTheDocument();

    // Test peer endorsement action
    const endorseButtons = screen.getAllByRole('button', { name: /Endorse/i });
    expect(endorseButtons.length).toBeGreaterThanOrEqual(4);
    fireEvent.click(endorseButtons[0]);
  });

  it('renders Kanban board and transitions task states', () => {
    render(<CollaborativeProjectRoomPage params={{ id: 'prj-1' }} />);

    expect(screen.getByText(/Collaborative Sprint Kanban Board/i)).toBeInTheDocument();
    expect(screen.getByText(/To Do \/ Backlog/i)).toBeInTheDocument();
    expect(screen.getByText(/In Progress/i)).toBeInTheDocument();
    expect(screen.getByText(/Code Review/i)).toBeInTheDocument();
    expect(screen.getByText(/Completed/i)).toBeInTheDocument();

    // Advance a task
    const advanceButtons = screen.getAllByRole('button', { name: /Advance →/i });
    expect(advanceButtons.length).toBeGreaterThan(0);
    fireEvent.click(advanceButtons[0]);
  });

  it('runs GPU terminal pipeline benchmark in collaborative sandbox', async () => {
    render(<CollaborativeProjectRoomPage params={{ id: 'prj-1' }} />);

    const runBtn = screen.getByRole('button', { name: /Run Pipeline & Benchmark/i });
    expect(runBtn).toBeInTheDocument();
    fireEvent.click(runBtn);

    expect(screen.getByText(/Executing on GPU.../i)).toBeInTheDocument();
  });

  it('opens GitHub Publishing Modal and Social Media Sharing Modal', () => {
    render(<CollaborativeProjectRoomPage params={{ id: 'prj-1' }} />);

    // Open GitHub modal
    const githubBtn = screen.getByRole('button', { name: /Publish to GitHub/i });
    fireEvent.click(githubBtn);
    expect(screen.getByText(/Publish Project to GitHub/i)).toBeInTheDocument();
    expect(screen.getByText(/github.com\/nexus-student-labs/i)).toBeInTheDocument();

    // Close GitHub modal
    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelBtn);

    // Open Share Achievements modal
    const shareBtn = screen.getByRole('button', { name: /Share Achievements/i });
    fireEvent.click(shareBtn);
    expect(screen.getByText(/Share Team Achievements to Social Media/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /LinkedIn Post/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Tweet on X/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /WhatsApp/i })).toBeInTheDocument();
  });

  it('renders student referral code and rewards hub', () => {
    render(<CollaborativeProjectRoomPage params={{ id: 'prj-1' }} />);

    expect(screen.getByText(/Peer Referral & Student Reward Hub/i)).toBeInTheDocument();
    expect(screen.getByText(/\+250 XP per Student Referral/i)).toBeInTheDocument();
    expect(screen.getByText(/Copy Referral Link/i)).toBeInTheDocument();
  });
});
