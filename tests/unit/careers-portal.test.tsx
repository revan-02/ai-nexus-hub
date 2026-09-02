import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CareersPage from '@/app/careers/page';
import { calculateResumeMatchScore, getAllJobPostings, getJobById } from '@/services/career-service';

vi.mock('@/components/nexus/nexus-shell', () => ({
  NexusShell: ({ children }: any) => <div>{children}</div>,
}));

describe('Careers & Job Portal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Careers page header, search bar, and active job postings', () => {
    render(<CareersPage />);

    expect(screen.getByText(/AI & Machine Learning Careers & Job Portal/i)).toBeInTheDocument();
    expect(screen.getByText(/Junior AI & ML Systems Engineer/i)).toBeInTheDocument();
    expect(screen.getByText(/Generative AI & LLM Applications Developer/i)).toBeInTheDocument();
    expect(screen.getByText(/Anthropic Partner Labs/i)).toBeInTheDocument();
  });

  it('calculates AI resume match score based on candidate skills and job requirements', async () => {
    const jobs = await getAllJobPostings();
    expect(jobs.length).toBeGreaterThan(0);

    const targetJob = jobs.find((j) => j.id === 'job-1') || jobs[0];
    const match = calculateResumeMatchScore(
      targetJob,
      ['Python', 'PyTorch', 'FastAPI', 'Docker', 'Hugging Face'],
      1
    );

    expect(match.matchScore).toBeGreaterThanOrEqual(50);
    expect(match.matchingSkills).toContain('Python');
    expect(match.matchingSkills).toContain('PyTorch');
    expect(match.matchingSkills).toContain('FastAPI');
  });

  it('opens 1-Click Apply Modal and displays AI match scorecard', () => {
    render(<CareersPage />);

    const applyBtns = screen.getAllByRole('button', { name: /1-Click Apply/i });
    expect(applyBtns.length).toBeGreaterThan(0);
    fireEvent.click(applyBtns[0]);

    expect(screen.getByText(/AI Resume & Profile Match Analysis/i)).toBeInTheDocument();
    expect(screen.getByText(/Confirm & Apply/i)).toBeInTheDocument();
  });

  it('switches to My Applications and Post a Job tabs', () => {
    render(<CareersPage />);

    // Switch to Applications tab
    const appsTab = screen.getByRole('button', { name: /My Applications/i });
    fireEvent.click(appsTab);
    expect(screen.getByText(/Submitted Job Applications/i)).toBeInTheDocument();

    // Switch to Post a Job tab
    const postTab = screen.getByRole('button', { name: /Post a Job/i });
    fireEvent.click(postTab);
    expect(screen.getByText(/Post an AI & ML Job Opening/i)).toBeInTheDocument();
  });
});
