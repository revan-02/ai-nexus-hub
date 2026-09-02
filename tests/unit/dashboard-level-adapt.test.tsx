import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import DashboardPage from '@/app/dashboard/page';
import { NexusProvider } from '@/context/nexus-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
  useRouter: () => ({ push: vi.fn() }),
  useParams: () => ({}),
}));

// Mock next-auth/react
vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { user: { name: 'Learner User', email: 'learner@nexus.ai', role: 'Learner' } } }),
  signOut: vi.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock recharts ResponsiveContainer
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PieChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Pie: () => <div data-testid="pie-chart" />,
  Cell: () => null,
}));

// Mock useLearnerDashboard
vi.mock('@/hooks/api/use-dashboard', () => ({
  useLearnerDashboard: () => ({
    data: {
      data: {
        user: { id: 'usr-1', name: 'Test Learner', email: 'learner@test.com', role: 'Learner' },
        levelMeta: {
          title: 'AI Learning Path',
          levelBadge: 'Learner Track',
          tagline: 'Master AI step by step',
          bannerTitle: 'Start Journey',
          bannerText: 'Learn AI',
          bannerCta: 'Roadmap',
          lessonsCompleted: 2,
          totalLessons: 10,
          quizzesTaken: 1,
          projectsCompleted: 1,
          totalProjects: 3,
          timeSpent: '30m',
          streakDays: 4,
          completionPercent: 30,
          statsBadges: 2,
        },
        steps: [
          { id: 'p-1', num: 1, order: 1, title: 'Foundations', status: 'in_progress', progress: 50, availableContentCount: 2, completedContentCount: 1 },
        ],
        activeCourses: [
          {
            id: 'crs-1',
            num: '1',
            title: 'Intro to AI for Beginners',
            desc: 'Beginner fundamentals',
            level: 'Beginner',
            category: 'Foundations',
            duration: '1h',
            difficulty: 'Easy',
            progress: 0,
            status: 'in_progress',
            action: 'Start Lesson',
          },
          {
            id: 'crs-2',
            num: '2',
            title: 'Advanced Neural Networks & Transformers',
            desc: 'Deep architecture',
            level: 'Advanced',
            category: 'Deep Learning',
            duration: '8h',
            difficulty: 'Hard',
            progress: 0,
            status: 'locked',
            action: 'Locked',
          },
        ],
        recommended: { papers: [], projects: [], algorithms: [] },
        tabData: {
          expertCourses: [],
          researchPapers: [],
          projects: [],
          challenges: [],
          liveSessions: [],
        },
      },
    },
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  }),
}));

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <NexusProvider>{ui}</NexusProvider>
    </QueryClientProvider>
  );
}

describe('Dashboard Dynamic Level Adaptation', () => {
  it('renders level filter chips and active level header', () => {
    renderWithProviders(<DashboardPage />);
    expect(screen.getByText('Track Level:')).toBeInTheDocument();
    expect(screen.getByText('All Levels')).toBeInTheDocument();
    expect(screen.getByText('beginner')).toBeInTheDocument();
    expect(screen.getByText('intermediate')).toBeInTheDocument();
    expect(screen.getByText('advanced')).toBeInTheDocument();
    expect(screen.getByText('expert')).toBeInTheDocument();
  });

  it('filters courses when clicking a level filter chip', () => {
    renderWithProviders(<DashboardPage />);

    // Initially with default expert level, advanced/expert course is shown
    expect(screen.getByText('Advanced Neural Networks & Transformers')).toBeInTheDocument();

    // Click "All Levels" filter chip
    const allLevelsBtn = screen.getByRole('button', { name: 'All Levels' });
    fireEvent.click(allLevelsBtn);

    // Both courses are shown
    expect(screen.getByText('Intro to AI for Beginners')).toBeInTheDocument();
    expect(screen.getByText('Advanced Neural Networks & Transformers')).toBeInTheDocument();

    // Click beginner filter chip
    const beginnerBtn = screen.getByRole('button', { name: 'beginner' });
    fireEvent.click(beginnerBtn);

    // Beginner course should remain, Advanced course is filtered out
    expect(screen.getByText('Intro to AI for Beginners')).toBeInTheDocument();
    expect(screen.queryByText('Advanced Neural Networks & Transformers')).not.toBeInTheDocument();
  });
});
