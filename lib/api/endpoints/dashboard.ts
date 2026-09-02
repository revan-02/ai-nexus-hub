import apiClient, { type SingleResponse } from '../client';

export interface DashboardPhaseResponse {
  id: string;
  num: number;
  title: string;
  order: number;
  description: string;
  status: 'completed' | 'in_progress' | 'available' | 'locked';
  progress: number;
  availableContentCount: number;
  completedContentCount: number;
}

export interface DashboardCourseResponse {
  id: string;
  num: string;
  title: string;
  desc: string;
  level: string;
  category: string;
  duration: string;
  difficulty: string;
  progress: number;
  status: 'completed' | 'in_progress' | 'available' | 'locked';
  action: 'Review' | 'Continue' | 'Start Lesson' | 'Locked';
  thumbnailIcon?: string | null;
}

export interface LearnerDashboardResponse {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
    role: string;
  };
  levelMeta: {
    title: string;
    levelBadge: string;
    tagline: string;
    bannerTitle: string;
    bannerText: string;
    bannerCta: string;
    lessonsCompleted: number;
    totalLessons: number;
    quizzesTaken: number;
    projectsCompleted: number;
    totalProjects: number;
    timeSpent: string;
    streakDays: number;
    completionPercent: number;
    statsBadges: number;
  };
  steps: DashboardPhaseResponse[];
  activeCourses: DashboardCourseResponse[];
  recommended: {
    papers: Array<{ id: string; title: string; tag: string; category: string; href: string }>;
    projects: Array<{ id: string; title: string; tag: string; category: string; href: string }>;
    algorithms: Array<{ id: string; title: string; tag: string; category: string; href: string }>;
  };
  tabData: {
    expertCourses: DashboardCourseResponse[];
    researchPapers: Array<{ id: string; title: string; tag: string; category: string; href: string }>;
    projects: Array<{ id: string; title: string; tag: string; category: string; href: string; status: string }>;
    challenges: Array<{ id: string; title: string; type: string; difficulty: string; href: string }>;
    liveSessions: Array<{ id: string; title: string; category: string; estimatedTime: string; href: string }>;
  };
}

export const dashboardApi = {
  getLearnerData: () => apiClient.get<SingleResponse<LearnerDashboardResponse>>('/api/learner/dashboard'),
};
