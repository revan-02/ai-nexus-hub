'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type ThemeMode = 'light' | 'dark' | 'system';
export type AccentColor = 'purple' | 'blue' | 'emerald' | 'amber' | 'rose' | 'cyan';

export type AcademicTier =
  | 'young-explorer'
  | 'junior-innovator'
  | 'pre-university'
  | 'undergraduate'
  | 'postgraduate'
  | 'industry-professional'
  | 'phd-research';

export interface AcademicTierMeta {
  id: AcademicTier;
  label: string;
  gradeLabel: string;
  ageRange: string;
  emoji: string;
  mappedLevel: UserLevel;
  tagline: string;
  bannerTitle: string;
  bannerText: string;
}

export const ACADEMIC_TIERS: AcademicTierMeta[] = [
  {
    id: 'young-explorer',
    label: 'Young Explorer',
    gradeLabel: 'Class 5–7',
    ageRange: '10–12 yrs',
    emoji: '🌟',
    mappedLevel: 'beginner',
    tagline: 'Discover AI through fun games, puzzles, and visual experiments!',
    bannerTitle: 'Welcome, Young Explorer!',
    bannerText: 'Learn what AI is through fun activities — teach a robot, build a chatbot with Scratch, and discover how computers see and think!',
  },
  {
    id: 'junior-innovator',
    label: 'Junior Innovator',
    gradeLabel: 'Class 8–10',
    ageRange: '13–15 yrs',
    emoji: '🚀',
    mappedLevel: 'beginner',
    tagline: 'Start coding in Python and build your first AI projects!',
    bannerTitle: 'Ready to Innovate!',
    bannerText: 'Learn Python programming, understand the math behind AI, and build your first neural network that recognizes handwritten digits!',
  },
  {
    id: 'pre-university',
    label: 'Pre-University',
    gradeLabel: 'Class 11–12 / PUC',
    ageRange: '16–17 yrs',
    emoji: '📐',
    mappedLevel: 'intermediate',
    tagline: 'Master the math and data structures that power AI algorithms.',
    bannerTitle: 'Pre-University AI Foundation',
    bannerText: 'Build a solid foundation in calculus, linear algebra, probability, and data structures — the mathematical backbone of every AI system.',
  },
  {
    id: 'undergraduate',
    label: 'Undergraduate',
    gradeLabel: 'B.Tech / BSc (Year 1–4)',
    ageRange: '18–21 yrs',
    emoji: '🎓',
    mappedLevel: 'intermediate',
    tagline: 'Deep dive into ML algorithms, CNNs, NLP, and real-world projects.',
    bannerTitle: 'Undergraduate AI Engineer',
    bannerText: 'Master supervised/unsupervised learning, build computer vision systems, train NLP models, and deploy end-to-end ML pipelines.',
  },
  {
    id: 'postgraduate',
    label: 'Postgraduate',
    gradeLabel: 'M.Tech / MSc / MCA',
    ageRange: '22–24 yrs',
    emoji: '🔬',
    mappedLevel: 'advanced',
    tagline: 'Advanced specialization in NLP, RL, distributed training, and MLOps.',
    bannerTitle: 'Postgraduate Specialization',
    bannerText: 'Specialize in transformers, reinforcement learning, distributed GPU training, and publish your first research paper.',
  },
  {
    id: 'industry-professional',
    label: 'Industry Professional',
    gradeLabel: 'Working Engineers (0–4 yrs)',
    ageRange: '22–30 yrs',
    emoji: '💼',
    mappedLevel: 'advanced',
    tagline: 'Production-grade LLM deployment, RAG pipelines, and AI infrastructure.',
    bannerTitle: 'Industry AI Engineer',
    bannerText: 'Build enterprise RAG systems, fine-tune LLMs with LoRA/QLoRA, deploy with vLLM/TensorRT, and architect multi-agent workflows.',
  },
  {
    id: 'phd-research',
    label: 'PhD & Research',
    gradeLabel: 'PhD / Postdoc / Research Scientist',
    ageRange: '24+ yrs',
    emoji: '🧪',
    mappedLevel: 'expert',
    tagline: 'Frontier research — architecture innovation, alignment, and scaling laws.',
    bannerTitle: 'Research Frontier',
    bannerText: 'Pioneer novel architectures, explore mechanistic interpretability, advance AI alignment (RLHF/DPO), and push scaling law boundaries.',
  },
];

interface LevelMetadata {
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
}

const LEVEL_DATA: Record<UserLevel, LevelMetadata> = {
  beginner: {
    title: 'Welcome, Beginner! 👋',
    levelBadge: 'Level 1',
    tagline: 'Learn AI from scratch with easy lessons, hands-on examples and fun quizzes.',
    bannerTitle: 'Start Your AI Journey',
    bannerText: "You're in the right place! Learn step-by-step and become AI confident.",
    bannerCta: 'View Roadmap',
    lessonsCompleted: 1,
    totalLessons: 5,
    quizzesTaken: 2,
    projectsCompleted: 0,
    totalProjects: 3,
    timeSpent: '45 min',
    streakDays: 3,
    completionPercent: 25,
    statsBadges: 3,
  },
  intermediate: {
    title: 'Intermediate Learning Path',
    levelBadge: 'Level 2',
    tagline: 'Deepen your knowledge with ML algorithms, math foundations and statistics.',
    bannerTitle: 'Level Up Your Skills',
    bannerText: 'Tackle core algorithms, supervised learning, and real feature engineering.',
    bannerCta: 'Explore ML Path',
    lessonsCompleted: 10,
    totalLessons: 20,
    quizzesTaken: 8,
    projectsCompleted: 1,
    totalProjects: 4,
    timeSpent: '8h 20m',
    streakDays: 5,
    completionPercent: 50,
    statsBadges: 5,
  },
  advanced: {
    title: 'Advanced Learning Path',
    levelBadge: 'Level 3',
    tagline: 'Master complex AI concepts, cutting-edge research and real-world implementation.',
    bannerTitle: 'Advance Your Expertise',
    bannerText: "You're among the top learners! Tackle deep learning, transformers, and RL.",
    bannerCta: 'View Roadmap',
    lessonsCompleted: 18,
    totalLessons: 30,
    quizzesTaken: 14,
    projectsCompleted: 2,
    totalProjects: 5,
    timeSpent: '18h 45m',
    streakDays: 7,
    completionPercent: 62,
    statsBadges: 6,
  },
  expert: {
    title: 'Expert Learning Path',
    levelBadge: 'Level 4',
    tagline: 'Push the boundaries. Explore cutting-edge research and build AI solutions like a pro.',
    bannerTitle: 'Master AI Like an Expert',
    bannerText: 'Access cutting-edge resources, research papers, and collaborate with global experts.',
    bannerCta: 'View Expert Roadmap',
    lessonsCompleted: 20,
    totalLessons: 30,
    quizzesTaken: 16,
    projectsCompleted: 2,
    totalProjects: 5,
    timeSpent: '26h 30m',
    streakDays: 12,
    completionPercent: 68,
    statsBadges: 8,
  },
};

interface NexusContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  accentColor: AccentColor;
  setAccentColor: (accent: AccentColor) => void;
  userLevel: UserLevel;
  setUserLevel: (level: UserLevel) => void;
  levelMeta: LevelMetadata;
  academicTier: AcademicTier;
  setAcademicTier: (tier: AcademicTier) => void;
  academicTierMeta: AcademicTierMeta;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  notificationCount: number;
  isAiBotEnabled: boolean;
  setIsAiBotEnabled: (enabled: boolean) => void;
}

const NexusContext = createContext<NexusContextType | undefined>(undefined);

export function NexusProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('dark');
  const [accentColor, setAccentColor] = useState<AccentColor>('purple');
  const [userLevel, setUserLevelState] = useState<UserLevel>('expert');
  const [academicTier, setAcademicTierState] = useState<AcademicTier>('undergraduate');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationCount] = useState(3);
  const [isAiBotEnabled, setIsAiBotEnabledState] = useState(true);

  // Load saved settings from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('nexus_theme') as ThemeMode;
      if (savedTheme && ['dark', 'light', 'system'].includes(savedTheme)) {
        setTheme(savedTheme);
      }
      const savedAiBot = localStorage.getItem('nexus_ai_bot_enabled');
      if (savedAiBot !== null) {
        setIsAiBotEnabledState(savedAiBot === 'true');
      }
    } catch {
      // Ignore localStorage errors in restricted environments
    }
  }, []);

  const setIsAiBotEnabled = (enabled: boolean) => {
    setIsAiBotEnabledState(enabled);
    try {
      localStorage.setItem('nexus_ai_bot_enabled', String(enabled));
    } catch {
      // Ignore
    }
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('nexus_theme', newTheme);
    } catch {
      // Ignore
    }
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
    } else if (newTheme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
      root.style.colorScheme = 'light';
    } else {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemDark) {
        root.classList.add('dark');
        root.classList.remove('light');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
        root.style.colorScheme = 'light';
      }
    }
  };

  const setUserLevel = (level: UserLevel) => {
    setUserLevelState(level);
  };

  const setAcademicTier = (tier: AcademicTier) => {
    setAcademicTierState(tier);
    // Auto-sync the internal userLevel to match the tier
    const tierMeta = ACADEMIC_TIERS.find((t) => t.id === tier);
    if (tierMeta) {
      setUserLevelState(tierMeta.mappedLevel);
    }
  };

  const academicTierMeta = ACADEMIC_TIERS.find((t) => t.id === academicTier) || ACADEMIC_TIERS[3];

  // Keyboard shortcut ⌘K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <NexusContext.Provider
      value={{
        theme,
        setTheme,
        accentColor,
        setAccentColor,
        userLevel,
        setUserLevel,
        levelMeta: LEVEL_DATA[userLevel],
        academicTier,
        setAcademicTier,
        academicTierMeta,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        sidebarCollapsed,
        setSidebarCollapsed,
        notificationCount,
        isAiBotEnabled,
        setIsAiBotEnabled,
      }}
    >
      {children}
    </NexusContext.Provider>
  );
}

export function useNexus() {
  const context = useContext(NexusContext);
  if (!context) {
    throw new Error('useNexus must be used within a NexusProvider');
  }
  return context;
}

export function useSafeNexus() {
  return useContext(NexusContext);
}
