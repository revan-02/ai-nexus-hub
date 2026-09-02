import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PerformanceTestPage from '@/app/performance-test/page';

vi.mock('@/components/nexus/nexus-shell', () => ({
  NexusShell: ({ children }: any) => <div>{children}</div>,
}));

// Mock Next.js navigation hooks
vi.mock('next/navigation', () => ({
  usePathname: () => '/performance-test',
  useSearchParams: () => new URLSearchParams(''),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe('100,000 Concurrent Users Performance & Ultra-Scale Testing Center', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders 100,000 Users Stress Test Center hero, KPI cards, and micro-engines breakdown', () => {
    render(<PerformanceTestPage />);
    expect(screen.getByText(/100,000 Concurrent Users Stress Test Center/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Operations/i)).toBeInTheDocument();
    expect(screen.getAllByText(/System Throughput/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Certification Exams & Anti-Cheat Lookups/i)).toBeInTheDocument();
    expect(screen.getByText(/VTU Question Papers & Branch Lookups/i)).toBeInTheDocument();
  });

  it('switches between 10k, 50k, and 100k load presets and triggers stress test simulation', () => {
    render(<PerformanceTestPage />);

    const preset10k = screen.getByText('10k VUs');
    fireEvent.click(preset10k);
    expect(screen.getByText(/Run 10,000 Users Stress Test/i)).toBeInTheDocument();

    const preset100k = screen.getByText('100k VUs');
    fireEvent.click(preset100k);
    expect(screen.getByText(/Run 100,000 Users Stress Test/i)).toBeInTheDocument();

    const runBtn = screen.getByText(/Run 100,000 Users Stress Test/i);
    fireEvent.click(runBtn);

    expect(screen.getAllByText(/Executing 100,000 Benchmark\.\.\.|Simulating 100k Load\.\.\./i).length).toBeGreaterThan(0);
  });

  it('switches to 100,000 End-to-End User Journeys tab and displays 6 lifecycle steps', () => {
    render(<PerformanceTestPage />);

    const journeyTab = screen.getByText(/100,000 End-to-End User Journeys/i);
    fireEvent.click(journeyTab);

    expect(screen.getByText(/Inverted Index Search/i)).toBeInTheDocument();
    expect(screen.getByText(/VTU Exam Papers Filter/i)).toBeInTheDocument();
    expect(screen.getByText(/1-Click AI Job Apply/i)).toBeInTheDocument();
    expect(screen.getByText(/Full 6-Step Journey Average Duration/i)).toBeInTheDocument();
  });

  it('switches to Architecture analysis and Export Report tabs', () => {
    render(<PerformanceTestPage />);

    const exportTab = screen.getByRole('button', { name: /Export 100k Benchmark Report/i });
    fireEvent.click(exportTab);

    expect(screen.getAllByText(/Export 100k Benchmark Report/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Download Full 100k Benchmark Report/i)).toBeInTheDocument();
  });
});
