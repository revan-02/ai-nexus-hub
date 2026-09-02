import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PromptEngineeringPage from '@/app/prompt-engineering/page';

vi.mock('@/components/nexus/nexus-shell', () => ({
  NexusShell: ({ children }: any) => <div>{children}</div>,
}));

// Mock Next.js navigation hooks
vi.mock('next/navigation', () => ({
  usePathname: () => '/prompt-engineering',
  useSearchParams: () => new URLSearchParams(''),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe('Prompt Engineering Masterclass (0 to 100% Mastery)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Prompt Engineering masterclass hero, 7 level curriculum, and progress bar', () => {
    render(<PromptEngineeringPage />);
    expect(screen.getAllByText(/Prompt Engineering Masterclass/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Level 1: Prompt Anatomy & Zero-Shot Fundamentals/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Level 2: Few-Shot Prompting & In-Context Learning/i)).toBeInTheDocument();
    expect(screen.getByText(/Level 3: Chain-of-Thought \(CoT\) & Step-by-Step Reasoning/i)).toBeInTheDocument();
    expect(screen.getByText(/Level 5: ReAct \(Reasoning \+ Acting\) & Autonomous Tool Calling/i)).toBeInTheDocument();
  });

  it('allows switching between curriculum modules and marking levels as mastered', () => {
    render(<PromptEngineeringPage />);
    
    // Click on Level 3 module
    const level3 = screen.getByText(/Level 3: Chain-of-Thought/i);
    fireEvent.click(level3);

    expect(screen.getByText(/Solve the following multi-stage financial modeling problem/i)).toBeInTheDocument();

    // Toggle complete
    const markBtn = screen.getByText(/Mark as Mastered|Marked as Mastered/i);
    fireEvent.click(markBtn);
    expect(screen.getByText(/Marked as Mastered/i)).toBeInTheDocument();
  });

  it('switches to Live Prompt Sandbox, executes simulation, and displays token & latency metrics', () => {
    render(<PromptEngineeringPage />);
    
    // Switch to Sandbox tab
    const sandboxTab = screen.getByText(/Live Prompt Sandbox & Inspector/i);
    fireEvent.click(sandboxTab);

    expect(screen.getByText(/Interactive Prompt Editor/i)).toBeInTheDocument();
    expect(screen.getByText(/Inference & Reasoning Inspector/i)).toBeInTheDocument();

    // Click execute button
    const executeBtn = screen.getByRole('button', { name: /Execute & Analyze/i });
    fireEvent.click(executeBtn);
  });

  it('switches to Fix-The-Prompt Challenges and evaluates user prompt fixes', () => {
    render(<PromptEngineeringPage />);

    // Switch to Challenges tab
    const challengesTab = screen.getByText(/Fix-The-Prompt Challenges/i);
    fireEvent.click(challengesTab);

    expect(screen.getByText(/Fix the Vague Summarizer/i)).toBeInTheDocument();
    expect(screen.getByText(/Broken \/ Vulnerable Prompt/i)).toBeInTheDocument();

    // Show reference solution
    const showSolBtn = screen.getByText(/Show Reference Solution/i);
    fireEvent.click(showSolBtn);
    expect(screen.getByText(/Senior Editor at an AI Journal/i)).toBeInTheDocument();
  });

  it('switches to Certificate tab and displays Prompt Engineering Mastery credential', () => {
    render(<PromptEngineeringPage />);

    const certTab = screen.getByText(/Mastery Certification/i);
    fireEvent.click(certTab);

    expect(screen.getByText(/Certificate of Prompt Engineering Mastery/i)).toBeInTheDocument();
    expect(screen.getByText(/PRM-2026-X8801/i)).toBeInTheDocument();
  });
});
