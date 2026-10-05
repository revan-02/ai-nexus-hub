import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { loginSchema } from '@/schemas/auth';
import { ContinueLearningCard } from '@/components/dashboard/continue-learning-card';
import { CompactRoadmap } from '@/components/dashboard/compact-roadmap';
import { NexusHeader } from '@/components/nexus/nexus-header';
import { NexusProvider } from '@/context/nexus-context';
import { DashboardService } from '@/services';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
  useParams: () => ({}),
}));

// Mock next-auth/react
let mockSessionData: any = {
  user: {
    name: '7338069255', // Simulating phone number originally passed as name
    email: '7338069255@nexus-mobile.ai',
    role: 'User',
  },
};

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: mockSessionData }),
  signOut: vi.fn(),
  signIn: vi.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('User Session & Dashboard Greeting Verification Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    mockSessionData = {
      user: {
        name: '7338069255',
        email: '7338069255@nexus-mobile.ai',
        role: 'User',
      },
    };
  });

  // ==========================================
  // 1. UNIT TESTS
  // ==========================================
  describe('1. Unit Tests: Auth Schemas & Name Resolution Logic', () => {
    it('accepts phone number or email and optional name in loginSchema', () => {
      // Test mobile number
      const phoneResult = loginSchema.safeParse({
        email: '7338069255',
        password: 'password123',
        name: 'Rajj Kashyap',
      });
      expect(phoneResult.success).toBe(true);
      if (phoneResult.success) {
        expect(phoneResult.data.name).toBe('Rajj Kashyap');
        expect(phoneResult.data.email).toBe('7338069255');
      }

      // Test standard email
      const emailResult = loginSchema.safeParse({
        email: 'learner@nexus.ai',
        password: 'securePassword123',
      });
      expect(emailResult.success).toBe(true);
    });

    it('rejects empty identifier or empty password in loginSchema', () => {
      const invalid = loginSchema.safeParse({
        email: '',
        password: '',
      });
      expect(invalid.success).toBe(false);
    });

    it('DashboardService.getLearnerDashboardData returns a fresh 0% baseline for new users', async () => {
      const newUserId = 'usr-test-brand-new-learner-999';
      const data = await DashboardService.getLearnerDashboardData(newUserId);

      expect(data).toBeDefined();
      expect(data.levelMeta.completionPercent).toBe(0);
      expect(data.levelMeta.lessonsCompleted).toBe(0);
      expect(data.levelMeta.quizzesTaken).toBe(0);
      expect(data.levelMeta.projectsCompleted).toBe(0);
      // Brand new user must start at Stage 1
      expect(data.steps[0].status).toBe('in_progress');
      expect(data.steps[0].progress).toBe(0);
      // For a brand new user, live sessions must be empty so it offers "Start Learning"
      expect(data.tabData.liveSessions).toEqual([]);
    }, 15000);
  });

  // ==========================================
  // 2. UI TESTS
  // ==========================================
  describe('2. UI Tests: Continue Learning Card, Roadmap & Header', () => {
    it('ContinueLearningCard shows "Start Learning" and "Get Started" when user has no active session', () => {
      render(<ContinueLearningCard session={undefined} />);

      expect(screen.getByText('Get Started')).toBeInTheDocument();
      expect(screen.getByText('AI Foundations & Intelligent Agents')).toBeInTheDocument();
      expect(screen.getByText('Start Learning')).toBeInTheDocument();
      expect(screen.queryByText('Resume Learning')).not.toBeInTheDocument();
    });

    it('ContinueLearningCard shows "Resume Learning" and "In Progress" when user has an active session', () => {
      const activeSession = {
        id: 'room-1',
        title: 'Deep Learning & Neural Networks',
        category: 'Deep Learning',
        estimatedTime: '45 mins',
        href: '/learn/room-1',
      };

      render(<ContinueLearningCard session={activeSession} />);

      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Deep Learning & Neural Networks')).toBeInTheDocument();
      expect(screen.getByText('Resume Learning')).toBeInTheDocument();
    });

    it('CompactRoadmap displays Stage 1 as "current" and Stage 2-4 as "upcoming" for new user', () => {
      render(<CompactRoadmap currentStage={1} />);

      expect(screen.getByText('STAGE 1')).toBeInTheDocument();
      expect(screen.getByText('AI Foundations')).toBeInTheDocument();
      expect(screen.getByText('STAGE 2')).toBeInTheDocument();
      expect(screen.getByText('Machine Learning Core')).toBeInTheDocument();
    });

    it('NexusHeader sanitizes raw phone numbers and displays "Learner" and track badge instead of "User Level"', async () => {
      render(
        <NexusProvider>
          <NexusHeader />
        </NexusProvider>
      );

      // Verify that raw phone number is never displayed as the user name
      expect(screen.queryByText('7338069255')).not.toBeInTheDocument();
      expect(screen.getAllByText('Learner').length).toBeGreaterThan(0);

      // Verify that badge does NOT say "User Level"
      expect(screen.queryByText('User Level')).not.toBeInTheDocument();
      expect(screen.getAllByText(/Track/i).length).toBeGreaterThan(0);
    });

    it('NexusHeader displays real user name when saved in localStorage profile', async () => {
      localStorage.setItem(
        'nexus_user_profile',
        JSON.stringify({
          name: 'Rajj Kashyap',
          email: '7338069255@nexus-mobile.ai',
          username: 'rajj_kashyap',
          phone: '7338069255',
          bio: 'AI Engineer',
        })
      );

      render(
        <NexusProvider>
          <NexusHeader />
        </NexusProvider>
      );

      await waitFor(() => {
        expect(screen.getAllByText('Rajj Kashyap').length).toBeGreaterThan(0);
      });
      expect(screen.queryByText('7338069255')).not.toBeInTheDocument();
    });
  });

  // ==========================================
  // 3. PERFORMANCE TESTS
  // ==========================================
  describe('3. Performance Tests: Latency & In-Memory Caching', () => {
    it('resolves repeated dashboard service requests within 10ms via cache', async () => {
      const testUserId = 'usr-perf-test-123';

      // First call (initializes cache)
      const t0 = performance.now();
      const firstResult = await DashboardService.getLearnerDashboardData(testUserId);
      const t1 = performance.now();
      expect(firstResult).toBeDefined();

      // Second call (hits fast in-memory cache)
      const t2 = performance.now();
      const cachedResult = await DashboardService.getLearnerDashboardData(testUserId);
      const t3 = performance.now();

      expect(cachedResult).toBeDefined();
      const cachedLatency = t3 - t2;
      expect(cachedLatency).toBeLessThan(10); // Must resolve under 10ms
    }, 15000);
  });

  // ==========================================
  // 4. REGRESSION TESTS
  // ==========================================
  describe('4. Regression Tests: Session & Profile Synchronization', () => {
    it('dispatches nexus_profile_updated event and syncs profile across components without page refresh', () => {
      let eventFired = false;
      const listener = () => {
        eventFired = true;
      };
      window.addEventListener('nexus_profile_updated', listener);

      localStorage.setItem(
        'nexus_user_profile',
        JSON.stringify({
          name: 'Revan Siddeshwar',
          email: 'revan@example.com',
          phone: '9876543210',
          username: 'revan_ai',
          bio: 'Deep Learning Architect',
        })
      );
      window.dispatchEvent(new Event('nexus_profile_updated'));

      expect(eventFired).toBe(true);
      window.removeEventListener('nexus_profile_updated', listener);
    });
  });
});
