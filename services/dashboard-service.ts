import prisma from '@/lib/db/prisma';
import { mockCoursesList } from '@/lib/mock-data/courses-data';

export interface DashboardPhaseDTO {
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

export interface DashboardCourseDTO {
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

export interface DashboardMetricDTO {
  lessonsCompleted: number;
  totalLessons: number;
  quizzesTaken: number;
  projectsCompleted: number;
  totalProjects: number;
  timeSpent: string;
  streakDays: number;
  completionPercent: number;
  statsBadges: number;
}

export interface LearnerDashboardDTO {
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
  steps: DashboardPhaseDTO[];
  activeCourses: DashboardCourseDTO[];
  recommended: {
    papers: Array<{ id: string; title: string; tag: string; category: string; href: string }>;
    projects: Array<{ id: string; title: string; tag: string; category: string; href: string }>;
    algorithms: Array<{ id: string; title: string; tag: string; category: string; href: string }>;
  };
  tabData: {
    expertCourses: DashboardCourseDTO[];
    researchPapers: Array<{ id: string; title: string; tag: string; category: string; href: string }>;
    projects: Array<{ id: string; title: string; tag: string; category: string; href: string; status: string }>;
    challenges: Array<{ id: string; title: string; type: string; difficulty: string; href: string }>;
    liveSessions: Array<{ id: string; title: string; category: string; estimatedTime: string; href: string }>;
  };
}

/**
 * Calculate consecutive daily learning streak from activity timestamps.
 */
function calculateStreak(activityDates: Date[]): number {
  if (!activityDates.length) return 0;

  const dateSet = new Set<string>();
  for (const date of activityDates) {
    const iso = date.toISOString().split('T')[0];
    dateSet.add(iso);
  }

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let currentCheckDate: Date;
  if (dateSet.has(todayStr)) {
    currentCheckDate = today;
  } else if (dateSet.has(yesterdayStr)) {
    currentCheckDate = yesterday;
  } else {
    return 0;
  }

  let streak = 0;
  while (true) {
    const dateStr = currentCheckDate.toISOString().split('T')[0];
    if (dateSet.has(dateStr)) {
      streak++;
      currentCheckDate.setDate(currentCheckDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Format total duration in seconds to human readable time string.
 */
function formatDuration(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds <= 0) return '0m';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours === 0) {
    return `${minutes} min`;
  }
  return `${hours}h ${minutes}m`;
}

// In-Memory Fast Cache for Dashboard Data (30s TTL per user)
const dashboardCache = new Map<string, { timestamp: number; data: LearnerDashboardDTO }>();
const CACHE_TTL_MS = 30 * 1000;

export async function getLearnerDashboardData(userId?: string): Promise<LearnerDashboardDTO> {
  const cacheKey = userId || 'anonymous_default';
  const cached = dashboardCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    // Execute aggregated parallel database queries in 1 single batch to prevent sequential waterfalls
    const [
      dbUser,
      dbPhases,
      dbCourses,
      totalLessonsCount,
      dbAssessments,
      dbProjects,
      dbContents,
      dbAlgorithms,
      dbRooms,
    ] = await Promise.all([
      userId
        ? prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, role: true, avatar: true, certificates: { select: { id: true } } },
          })
        : null,
      prisma.learningPhase.findMany({
        orderBy: { order: 'asc' },
        select: {
          id: true,
          order: true,
          title: true,
          description: true,
          courses: { select: { lessons: { select: { id: true } } } },
        },
      }),
      prisma.course.findMany({
        where: { status: 'Published' },
        select: {
          id: true,
          title: true,
          description: true,
          level: true,
          category: true,
          phaseId: true,
          thumbnailIcon: true,
          lessons: { select: { id: true, durationMinutes: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      typeof prisma.lesson?.count === 'function'
        ? prisma.lesson.count()
        : prisma.lesson.findMany({ select: { id: true } }).then((res: any[]) => res?.length || 0),
      prisma.assessment.findMany({
        where: { status: 'Published' },
        select: { id: true, name: true, type: true, difficulty: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.project.findMany({
        where: { status: 'Published' },
        select: { id: true, name: true, category: true, level: true, status: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.content.findMany({
        where: { status: 'Published' },
        select: { id: true, title: true, type: true, category: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.algorithm.findMany({
        where: { status: 'Published' },
        select: { id: true, name: true, complexity: true, category: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.learningRoom.findMany({
        select: { id: true, title: true, category: true, estimatedTime: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

  const user = dbUser;
  const activeUserId = user?.id || '';

  // Execute user-dependent progress queries in parallel
  const [dbUserLessonProgress, dbUserQuizAttempts, dbUserProjectProgress, dbUserActivities] =
    await Promise.all([
      activeUserId
        ? prisma.userLessonProgress.findMany({
            where: { userId: activeUserId },
            select: { lessonId: true, completed: true, completedAt: true },
          })
        : [],
      activeUserId
        ? prisma.userQuizAttempt.findMany({
            where: { userId: activeUserId },
            select: { assessmentId: true },
          })
        : [],
      activeUserId
        ? prisma.userProjectProgress.findMany({
            where: { userId: activeUserId },
            select: { projectId: true, status: true },
          })
        : [],
      activeUserId
        ? prisma.userActivity.findMany({
            where: { userId: activeUserId },
            select: { durationSeconds: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
            take: 50,
          })
        : [],
    ]);

  // Maps for efficient lookups
  const completedLessonIds = new Set(
    dbUserLessonProgress.filter((p) => p.completed).map((p) => p.lessonId)
  );

  // 1. Calculate Phase Progression & Status
  let previousPhaseCompleted = true;
  const steps: DashboardPhaseDTO[] = dbPhases.map((phase) => {
    // Find all lessons belonging to courses in this phase
    const phaseLessons = phase.courses.flatMap((c) => c.lessons);
    const availableContentCount = phaseLessons.length;
    const completedContentCount = phaseLessons.filter((l) =>
      completedLessonIds.has(l.id)
    ).length;

    const progress =
      availableContentCount > 0
        ? Math.round((completedContentCount / availableContentCount) * 100)
        : 0;

    let status: 'completed' | 'in_progress' | 'available' | 'locked' = 'locked';

    if (availableContentCount > 0 && completedContentCount === availableContentCount) {
      status = 'completed';
    } else if (completedContentCount > 0) {
      status = 'in_progress';
    } else if (previousPhaseCompleted || phase.order === 1) {
      status = 'in_progress';
    } else {
      status = 'locked';
    }

    previousPhaseCompleted = status === 'completed';

    return {
      id: phase.id,
      num: phase.order,
      order: phase.order,
      title: phase.title,
      description: phase.description,
      status,
      progress,
      availableContentCount,
      completedContentCount,
    };
  });

  // 2. Calculate Active Courses & Progress across all 28 curriculum courses + custom DB courses
  const dbCourseMap = new Map(dbCourses.map((c) => [c.id, c]));
  const seenIds = new Set<string>();
  const allCourseItems: DashboardCourseDTO[] = [];

  // First process all courses from mockCoursesList (flagship + stages + academic tiers)
  mockCoursesList.forEach((mockCourse, idx) => {
    seenIds.add(mockCourse.id);
    const dbCourse = dbCourseMap.get(mockCourse.id);
    const courseLessons = dbCourse?.lessons || [];
    const totalCourseLessons = courseLessons.length;
    const completedCourseLessons = courseLessons.filter((l) =>
      completedLessonIds.has(l.id)
    ).length;

    const progress =
      totalCourseLessons > 0
        ? Math.round((completedCourseLessons / totalCourseLessons) * 100)
        : 0;

    let status: 'completed' | 'in_progress' | 'available' | 'locked' = 'available';
    let action: 'Review' | 'Continue' | 'Start Lesson' | 'Locked' = 'Start Lesson';

    if (progress === 100) {
      status = 'completed';
      action = 'Review';
    } else if (progress > 0) {
      status = 'in_progress';
      action = 'Continue';
    } else {
      status = 'available';
      action = 'Start Lesson';
    }

    const durationStr =
      mockCourse.totalHours ||
      (totalCourseLessons > 0
        ? formatDuration(
            courseLessons.reduce((sum, l) => sum + l.durationMinutes, 0) * 60
          )
        : '4h 00m');

    allCourseItems.push({
      id: mockCourse.id,
      num: String(idx + 1).padStart(2, '0'),
      title: mockCourse.title,
      desc: mockCourse.description,
      level: mockCourse.level,
      category: mockCourse.category,
      duration: durationStr,
      difficulty:
        mockCourse.level === 'Beginner'
          ? 'Easy'
          : mockCourse.level === 'Intermediate'
          ? 'Medium'
          : 'Hard',
      progress,
      status,
      action,
      thumbnailIcon: mockCourse.thumbnailIcon || 'BookOpen',
    });
  });

  // Then append any extra published courses from DB not in mockCoursesList
  dbCourses.forEach((dbCourse) => {
    if (seenIds.has(dbCourse.id)) return;
    const courseLessons = dbCourse.lessons || [];
    const totalCourseLessons = courseLessons.length;
    const completedCourseLessons = courseLessons.filter((l) =>
      completedLessonIds.has(l.id)
    ).length;
    const progress =
      totalCourseLessons > 0
        ? Math.round((completedCourseLessons / totalCourseLessons) * 100)
        : 0;

    allCourseItems.push({
      id: dbCourse.id,
      num: String(allCourseItems.length + 1).padStart(2, '0'),
      title: dbCourse.title,
      desc: dbCourse.description,
      level: dbCourse.level,
      category: dbCourse.category,
      duration: formatDuration(
        courseLessons.reduce((sum, l) => sum + l.durationMinutes, 0) * 60 || 18000
      ),
      difficulty:
        dbCourse.level === 'Beginner'
          ? 'Easy'
          : dbCourse.level === 'Intermediate'
          ? 'Medium'
          : 'Hard',
      progress,
      status: progress > 0 ? 'in_progress' : 'available',
      action: progress > 0 ? 'Continue' : 'Start Lesson',
      thumbnailIcon: dbCourse.thumbnailIcon,
    });
  });

  const activeCourses = allCourseItems;

  // 3. Calculate "Your Progress" Metrics
  const lessonsCompleted = completedLessonIds.size;
  const totalLessons = totalLessonsCount;

  const attemptedAssessmentIds = new Set(
    dbUserQuizAttempts.map((a) => a.assessmentId)
  );
  const quizzesTaken = attemptedAssessmentIds.size;

  const completedProjectsCount = dbUserProjectProgress.filter(
    (p) => p.status === 'Published' || (p.status as string) === 'COMPLETED'
  ).length;
  const totalProjects = dbProjects.length;

  // Calculate Total Time Spent from user activity logs
  const totalActivitySeconds = dbUserActivities.reduce(
    (sum, a) => sum + a.durationSeconds,
    0
  );
  const timeSpent = formatDuration(totalActivitySeconds);

  // Calculate Streak
  const activityDates = [
    ...dbUserActivities.map((a) => a.createdAt),
    ...dbUserLessonProgress.map((p) => p.completedAt).filter(Boolean) as Date[],
  ];
  const streakDays = calculateStreak(activityDates);

  // Calculate Overall Progress Percentage (Weighted Required Activities)
  const totalRequiredActivities = totalLessons + totalProjects + dbAssessments.length;
  const completedRequiredActivities =
    lessonsCompleted + completedProjectsCount + quizzesTaken;
  const completionPercent =
    totalRequiredActivities > 0
      ? Math.round((completedRequiredActivities / totalRequiredActivities) * 100)
      : 0;

  const statsBadges = user?.certificates?.length || 0;

  // Level Metadata
  const userRole = user?.role || 'Learner';
  const levelMeta = {
    title: `Welcome, ${user?.name || 'Learner'}! 👋`,
    levelBadge: `${userRole} Track`,
    tagline: 'Master AI, Machine Learning, and Generative Systems with hands-on practice.',
    bannerTitle: 'Advance Your AI Mastery',
    bannerText: 'Tackle cutting-edge research, PyTorch neural networks, and LLM deployments.',
    bannerCta: 'View Full Roadmap',
    lessonsCompleted,
    totalLessons,
    quizzesTaken,
    projectsCompleted: completedProjectsCount,
    totalProjects,
    timeSpent,
    streakDays,
    completionPercent,
    statsBadges,
  };

  // 4. Recommendations Logic (Deterministic & Relevant)
  const recommendedPapers = dbContents.slice(0, 3).map((c) => ({
    id: c.id,
    title: c.title,
    tag: c.type || 'Research Paper',
    category: c.category,
    href: `/content`,
  }));

  const recommendedProjects = dbProjects.slice(0, 3).map((p) => ({
    id: p.id,
    title: p.name,
    tag: `${p.level} Project`,
    category: p.category,
    href: `/projects`,
  }));

  const recommendedAlgorithms = dbAlgorithms.slice(0, 3).map((a) => ({
    id: a.id,
    title: a.name,
    tag: `Algorithm (${a.complexity})`,
    category: a.category,
    href: `/algorithms`,
  }));

  // 5. Tabs Content Data
  const expertCourses = activeCourses.filter(
    (c) => c.level === 'Advanced' || c.level === 'Expert' || c.level === 'Intermediate'
  );

  const tabProjects = dbProjects.map((p) => {
    const userProg = dbUserProjectProgress.find((up) => up.projectId === p.id);
    return {
      id: p.id,
      title: p.name,
      tag: `${p.level} Project`,
      category: p.category,
      href: `/projects`,
      status: userProg?.status || 'Draft',
    };
  });

  const tabChallenges = dbAssessments.map((a) => ({
    id: a.id,
    title: a.name,
    type: a.type,
    difficulty: a.difficulty,
    href: `/assessments`,
  }));

  // For new users without completed lessons, do not fake an in-progress live session
  const tabLiveSessions = (completedLessonIds.size > 0 ? dbRooms : []).map((r) => ({
    id: r.id,
    title: r.title,
    category: r.category,
    estimatedTime: r.estimatedTime,
    href: `/learn/${r.id}`,
  }));

  const result: LearnerDashboardDTO = {
    user: {
      id: user?.id || userId || '',
      name: user?.name || 'Learner',
      email: user?.email || '',
      avatar: user?.avatar,
      role: userRole,
    },
    levelMeta,
    steps,
    activeCourses,
    recommended: {
      papers: recommendedPapers,
      projects: recommendedProjects,
      algorithms: recommendedAlgorithms,
    },
    tabData: {
      expertCourses,
      researchPapers: recommendedPapers,
      projects: tabProjects,
      challenges: tabChallenges,
      liveSessions: tabLiveSessions,
    },
  };

  dashboardCache.set(cacheKey, { timestamp: Date.now(), data: result });
  return result;
  } catch (error) {
    console.warn('Database query failed in getLearnerDashboardData, returning fresh learner baseline:', error);
    return {
      user: {
        id: userId || 'usr-learner',
        name: 'Learner',
        email: '',
        avatar: null,
        role: 'Learner',
      },
      levelMeta: {
        title: 'Stage 1: AI Foundations & Intelligent Agents',
        levelBadge: 'Beginner Track',
        tagline: 'Master search algorithms, logic, and intelligent problem solving.',
        bannerTitle: 'Welcome to AI Nexus',
        bannerText: 'Begin your journey with AI Foundations, Python algorithms, and agent architectures.',
        bannerCta: 'Start AI Foundations',
        lessonsCompleted: 0,
        totalLessons: 12,
        quizzesTaken: 0,
        projectsCompleted: 0,
        totalProjects: 5,
        timeSpent: '0m',
        streakDays: 1,
        completionPercent: 0,
        statsBadges: 0,
      },
      steps: [
        { id: 'phase-1', num: 1, title: 'Stage 1: AI Foundations & Intelligent Agents', order: 1, description: 'Master search algorithms, logic, and expert systems.', status: 'in_progress', progress: 0, availableContentCount: 4, completedContentCount: 0 },
        { id: 'phase-2', num: 2, title: 'Stage 2: Machine Learning & Statistical Modeling', order: 2, description: 'Supervised, unsupervised, regularization, and model evaluation.', status: 'available', progress: 0, availableContentCount: 4, completedContentCount: 0 },
        { id: 'phase-3', num: 3, title: 'Stage 3: Deep Learning & PyTorch Networks', order: 3, description: 'Perceptrons, MLPs, backpropagation, CNNs, and sequence models.', status: 'locked', progress: 0, availableContentCount: 2, completedContentCount: 0 },
        { id: 'phase-4', num: 4, title: 'Stage 4: Generative AI, LLMs & Autonomous Agents', order: 4, description: 'Transformers, prompt engineering, RAG pipelines, and tool calling.', status: 'locked', progress: 0, availableContentCount: 2, completedContentCount: 0 },
        { id: 'phase-5', num: 5, title: 'AI Systems Design & High-Performance Inference', order: 5, description: 'Quantization, vLLM serving, and distributed GPU clusters.', status: 'locked', progress: 0, availableContentCount: 2, completedContentCount: 0 },
        { id: 'phase-6', num: 6, title: 'Expert Research & AI Frontiers', order: 6, description: 'State-space models, research papers, and custom CUDA optimization.', status: 'locked', progress: 0, availableContentCount: 2, completedContentCount: 0 },
      ],
      activeCourses: mockCoursesList.map((mc, idx) => ({
        id: mc.id,
        num: String(idx + 1).padStart(2, '0'),
        title: mc.title,
        desc: mc.description,
        level: mc.level,
        category: mc.category,
        duration: mc.totalHours || '4h 00m',
        difficulty:
          mc.level === 'Beginner'
            ? 'Easy'
            : mc.level === 'Intermediate'
            ? 'Medium'
            : 'Hard',
        progress: 0,
        status: idx === 0 ? 'in_progress' : 'available',
        action: 'Start Lesson',
        thumbnailIcon: mc.thumbnailIcon || 'BookOpen',
      })),
      recommended: {
        papers: [],
        projects: [],
        algorithms: [],
      },
      tabData: {
        expertCourses: [],
        researchPapers: [],
        projects: [],
        challenges: [],
        liveSessions: [],
      },
    };
  }
}
