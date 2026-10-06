import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ContentLearningResearchPage from '@/app/content-learning/page';
import CareerHubPage from '@/app/career/page';
import { NexusProvider } from '@/context/nexus-context';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/content-learning',
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

describe('Research & Career Hub with Dr. Maya Sharma AI Mentor', () => {
  describe('Content Learning / Research Hub (/content-learning)', () => {
    it('renders Dr. Maya Sharma profile, bio, and live mentor badge', () => {
      render(
        <NexusProvider>
          <ContentLearningResearchPage />
        </NexusProvider>
      );

      expect(screen.getByText(/Dr\. Maya Sharma, Ph\.D\./i)).toBeInTheDocument();
      expect(screen.getByText(/Ex-DeepMind \/ Stanford/i)).toBeInTheDocument();
      expect(screen.getByText(/Live AI Mentor/i)).toBeInTheDocument();
      expect(screen.getByAltText(/Dr\. Maya Sharma - Lead AI Research Scientist/i)).toBeInTheDocument();
    });

    it('renders foundational breakthrough papers and allows switching to mathematical rigor', () => {
      render(
        <NexusProvider>
          <ContentLearningResearchPage />
        </NexusProvider>
      );

      // Check for Transformer paper
      expect(screen.getByText(/Attention Is All You Need/i)).toBeInTheDocument();
      expect(screen.getByText(/The Crowded Wedding Dinner Analogy/i)).toBeInTheDocument();

      // Switch to Mathematical Rigor tab
      const mathTab = screen.getByRole('button', { name: /Mathematical Rigor/i });
      fireEvent.click(mathTab);

      expect(screen.getByText(/Core Mathematical Formulation/i)).toBeInTheDocument();
      expect(screen.getByText(/Step-by-Step Mathematical Intuition/i)).toBeInTheDocument();
    });

    it('renders interactive FAQ section for confused AI concepts', () => {
      render(
        <NexusProvider>
          <ContentLearningResearchPage />
        </NexusProvider>
      );

      expect(screen.getByText(/Frequently Confused AI Concepts: Clarified by Dr\. Maya/i)).toBeInTheDocument();
      expect(screen.getByText(/Why do Large Language Models hallucinate false facts\?/i)).toBeInTheDocument();
    });
  });

  describe('Career Hub (/career)', () => {
    it('renders career paths, INR/USD salary benchmarks, and Dr. Maya Sharma', () => {
      render(
        <NexusProvider>
          <CareerHubPage />
        </NexusProvider>
      );

      expect(screen.getByText(/From Campus Fresher to Senior AI Architect/i)).toBeInTheDocument();
      expect(screen.getAllByText(/AI Prompt & LLM Application Engineer/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/Frontier AI Research Scientist/i)).toBeInTheDocument();
      expect(screen.getByText(/₹50 - 95 LPA/i)).toBeInTheDocument();
    });

    it('renders technical interview simulator and reveals answers', () => {
      render(
        <NexusProvider>
          <CareerHubPage />
        </NexusProvider>
      );

      expect(screen.getByText(/Technical Interview Simulator: Crack the Hard Questions/i)).toBeInTheDocument();
      expect(screen.getByText(/The Rookie Trap to Avoid:/i)).toBeInTheDocument();
      expect(screen.getByText(/Dr\. Maya's 10\/10 Ideal Answer:/i)).toBeInTheDocument();
    });

    it('toggles placement readiness audit checklist items', () => {
      render(
        <NexusProvider>
          <CareerHubPage />
        </NexusProvider>
      );

      const mathCheckbox = screen.getByText('Calculus & Linear Algebra');
      expect(mathCheckbox).toBeInTheDocument();

      // Click to toggle
      fireEvent.click(mathCheckbox);
    });
  });
});
