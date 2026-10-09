'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { NexusShell } from '@/components/nexus/nexus-shell';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useNexus, ACADEMIC_TIERS, AcademicTier } from '@/context/nexus-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BookOpen, Code, Trophy, Sparkles, Play, GraduationCap, CheckCircle2, Clock, Shield, Search, X, Filter } from 'lucide-react';

import { ContinueLearningCard } from '@/components/dashboard/continue-learning-card';
import { DailyChallengeCard } from '@/components/dashboard/daily-challenge-card';
import { CompactRoadmap } from '@/components/dashboard/compact-roadmap';
import { useLearnerDashboard } from '@/hooks/api/use-dashboard';
import { CourseAnimatedVideoModal } from '@/components/courses/course-animated-video-modal';
import { mockCoursesList, type CourseItem } from '@/lib/mock-data/courses-data';

const TIER_PEDAGOGY_GUIDES: Record<string, { mentorTip: string; focusAreas: string[]; practicalLab: string }> = {
  'young-explorer': {
    mentorTip: 'Hey Young Explorer (7th Standard / Class 5–7)! Don’t worry about complex calculus. Discover AI through visual experiments, drag-and-drop Scratch blocks, and teaching robots to recognize your voice and puppy photos!',
    focusAreas: ['Visual Scratch Coding', 'Teachable Machine', 'Computer Vision Games', 'AI Ethics for Kids'],
    practicalLab: 'Rock-Paper-Scissors AI Game & Color Sorting Bot'
  },
  'junior-innovator': {
    mentorTip: 'Ready to code in Python, Junior Innovator (Class 8–10)! We connect school algebra with real data to predict sports scores and classify handwritten digits with MNIST.',
    focusAreas: ['Python Fundamentals', 'Coordinate Plots & Best-Fit Lines', 'Probability Basics', 'MNIST Digit Recognizer'],
    practicalLab: 'Cricket Match Score Predictor & Handwritten Digit Sorter'
  },
  'pre-university': {
    mentorTip: 'Welcome Pre-University Scholar (Class 11–12 / PUC)! Master derivatives, vectors, and matrices — the true mathematical engine behind every neural network gradient step.',
    focusAreas: ['Calculus & Rates of Change', 'Linear Algebra & Matrices', 'Data Structures (Trees & Graphs)', 'Scikit-Learn Regression'],
    practicalLab: 'Gradient Descent Marble Simulation & House Price Predictor'
  },
  'undergraduate': {
    mentorTip: 'Engineering Undergraduates (B.Tech / B.E.): Master supervised ML, manual backprop derivations, ResNet vision, and rigorous algorithmic proofs.',
    focusAreas: ['Supervised & Unsupervised ML', 'PyTorch Neural Networks', 'CNNs & ResNet Residuals', 'Algorithmic Problem Solving'],
    practicalLab: 'Vernacular Crop Disease Classifier & Fraud Detection with SMOTE'
  },
  'postgraduate': {
    mentorTip: 'Postgraduate Scholars (M.Tech / MSc): Deep dive into Multi-Head Attention, Reinforcement Learning (PPO), and distributed multi-GPU training with DeepSpeed.',
    focusAreas: ['Transformers & Self-Attention', 'Reinforcement Learning (PPO/DQN)', 'Distributed Training (ZeRO/FSDP)', 'Research Methodology & Ablations'],
    practicalLab: 'Multi-GPU PyTorch Training Pipeline & Custom Tokenizer'
  },
  'industry-professional': {
    mentorTip: 'Working Engineers (0–4 yrs): Architect production RAG systems with vLLM, continuous batching, 4-bit QLoRA fine-tuning, and multi-agent LangGraph workflows.',
    focusAreas: ['Production RAG & Vector DBs', 'QLoRA & 4-bit Quantization', 'vLLM / TensorRT Inference', 'LangGraph Multi-Agent Workflows'],
    practicalLab: 'High-Throughput Enterprise Financial Copilot & Custom MCP Agent'
  },
  'phd-research': {
    mentorTip: 'Frontier AI Researchers: Pioneer novel sparse Mixture of Experts (MoE), Mamba selective state spaces, and custom hardware-aware Triton GPU kernels.',
    focusAreas: ['Sparse MoE & Routing (DeepSeek)', 'Selective State Spaces (Mamba)', 'Scaling Laws & Chinchilla Frontiers', 'Custom Triton / CUDA Attention Kernels'],
    practicalLab: 'FlashAttention-3 SRAM Tiling & DeepSeek-R1 Emergent Reasoning'
  }
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  const { userLevel, levelMeta: contextLevelMeta, userProfile, academicTier, setAcademicTier, academicTierMeta } = useNexus();
  const { data: apiResponse, isLoading, isError } = useLearnerDashboard();

  const [greeting, setGreeting] = useState('Welcome back');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting('Good morning');
    } else if (hour >= 12 && hour < 17) {
      setGreeting('Good afternoon');
    } else if (hour >= 17 && hour < 22) {
      setGreeting('Good evening');
    } else {
      setGreeting('Welcome back');
    }
  }, []);

  const rawName = userProfile?.name || session?.user?.name || '';
  const isPhone = !rawName || /^[0-9\s\-+]+$/.test(rawName) || rawName.includes('@nexus-mobile.ai');
  const displayName = isPhone ? '' : rawName;
  const firstName = displayName ? displayName.split(' ')[0] : '';

  const dashboardData = apiResponse?.data;
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<'All Levels' | 'beginner' | 'intermediate' | 'advanced' | 'expert'>('All Levels');
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>('All Tiers');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideoCourse, setSelectedVideoCourse] = useState<any | null>(null);

  const modalCourse: CourseItem | null = selectedVideoCourse
    ? {
        id: String(selectedVideoCourse.id),
        title: selectedVideoCourse.title,
        description: selectedVideoCourse.desc || selectedVideoCourse.description || '',
        category: selectedVideoCourse.category || 'AI Foundations',
        level: (selectedVideoCourse.difficulty === 'Easy'
          ? 'Beginner'
          : selectedVideoCourse.difficulty === 'Medium'
          ? 'Intermediate'
          : 'Advanced') as any,
        price: selectedVideoCourse.price || 'Free',
        students: selectedVideoCourse.students || '12,420',
        status: 'Published',
        updatedAt: 'Recently',
        thumbnailIcon: selectedVideoCourse.thumbnailIcon || 'Brain',
        instructor: {
          name: 'RevBodh Academic Faculty',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        },
      }
    : null;

  useEffect(() => {
    if (userLevel && ['beginner', 'intermediate', 'advanced', 'expert'].includes(userLevel)) {
      setSelectedLevelFilter(userLevel as any);
    }
  }, [userLevel]);

  const levelMeta = {
    title: contextLevelMeta?.title || dashboardData?.levelMeta?.title || 'Welcome to AI Nexus',
    completionPercent: dashboardData?.levelMeta?.completionPercent ?? 0,
  };

  const userRoleStr = String((session?.user as { role?: string })?.role || (userProfile as any)?.role || '').toLowerCase();
  const isAdminUser = userRoleStr === 'admin' || userRoleStr === 'super admin' || userRoleStr === 'manager';

  // Merge all 28 mockCoursesList courses with any live progress from API
  const activeCourseProgressMap = React.useMemo(() => {
    const map = new Map<string, any>();
    if (dashboardData?.activeCourses) {
      dashboardData.activeCourses.forEach((c: any) => map.set(c.id, c));
    }
    return map;
  }, [dashboardData?.activeCourses]);

  const allDashboardCourses = React.useMemo(() => {
    const list: any[] = [];
    const seen = new Set<string>();

    mockCoursesList.forEach((mc) => {
      seen.add(mc.id);
      const live = activeCourseProgressMap.get(mc.id);
      list.push({
        id: mc.id,
        title: mc.title,
        desc: mc.description,
        level: mc.level,
        category: mc.category,
        academicTier: mc.academicTier,
        duration: mc.totalHours || live?.duration || '4h 00m',
        difficulty:
          mc.level === 'Beginner'
            ? 'Easy'
            : mc.level === 'Intermediate'
            ? 'Medium'
            : 'Hard',
        progress: live?.progress ?? 0,
        status: live?.status || 'available',
        action: live?.action || 'Start Lesson',
        price: mc.price || 'Free',
        thumbnailIcon: mc.thumbnailIcon || 'BookOpen',
      });
    });

    if (dashboardData?.activeCourses) {
      dashboardData.activeCourses.forEach((c: any) => {
        if (!seen.has(c.id)) {
          list.push({
            id: c.id,
            title: c.title,
            desc: c.desc || c.description || '',
            level: c.level || 'Beginner',
            category: c.category || 'General',
            academicTier: undefined,
            duration: c.duration || '3h 00m',
            difficulty: c.difficulty || 'Easy',
            progress: c.progress ?? 0,
            status: c.status || 'available',
            action: c.action || 'Start Lesson',
            price: 'Free',
            thumbnailIcon: c.thumbnailIcon || 'BookOpen',
          });
        }
      });
    }

    return list;
  }, [activeCourseProgressMap, dashboardData?.activeCourses]);

  const activeCourses = React.useMemo(() => {
    return allDashboardCourses.filter((course) => {
      // 1. Search Query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = course.title.toLowerCase().includes(query);
        const matchesDesc = (course.desc || '').toLowerCase().includes(query);
        const matchesCat = (course.category || '').toLowerCase().includes(query);
        const matchesTier = (course.academicTier || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesCat && !matchesTier) {
          return false;
        }
      }

      // 2. Track Level filter
      if (selectedLevelFilter !== 'All Levels') {
        const lvl = (course.level || course.difficulty || '').toLowerCase();
        if (selectedLevelFilter === 'expert') {
          if (lvl !== 'expert' && lvl !== 'advanced' && lvl !== 'hard') return false;
        } else if (selectedLevelFilter === 'advanced') {
          if (lvl !== 'advanced' && lvl !== 'hard') return false;
        } else if (selectedLevelFilter === 'intermediate') {
          if (lvl !== 'intermediate' && lvl !== 'medium') return false;
        } else if (selectedLevelFilter === 'beginner') {
          if (lvl !== 'beginner' && lvl !== 'easy') return false;
        }
      }

      // 3. Academic Tier filter
      if (selectedTierFilter !== 'All Tiers') {
        if (course.academicTier !== selectedTierFilter) {
          return false;
        }
      }

      return true;
    });
  }, [allDashboardCourses, searchQuery, selectedLevelFilter, selectedTierFilter]);

  if (isLoading) {
    return (
      <NexusShell>
        <div className="space-y-6 animate-pulse">
          <div className="h-8 bg-secondary rounded-lg w-1/4" />
          <div className="h-64 bg-secondary/50 rounded-3xl" />
        </div>
      </NexusShell>
    );
  }

  if (isError) {
    return (
      <NexusShell>
        <div className="text-rose-500 font-semibold p-8">Failed to load dashboard. Please try again.</div>
      </NexusShell>
    );
  }

  return (
    <NexusShell>
      <div className="space-y-8 pb-10">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {greeting}{firstName ? `, ${firstName}` : ''} 👋
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Ready to continue your AI journey?</p>
          </div>
          <div className="flex items-center gap-2">
            {isAdminUser && (
              <Link href="/admin">
                <Button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl h-9 shadow-md shadow-purple-900/30 gap-1.5 cursor-pointer">
                  <Shield className="w-3.5 h-3.5" />
                  Admin Panel
                </Button>
              </Link>
            )}
            <Link href="/roadmap">
              <Button variant="outline" className="bg-secondary border-border text-xs font-semibold rounded-xl h-9 cursor-pointer">
                View all my courses
              </Button>
            </Link>
          </div>
        </div>

        {/* ── ACADEMIC TIER CONTINUUM SELECTOR & DR. MAYA PEDAGOGY GUIDE ── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-purple-950/60 border border-purple-500/30 p-5 sm:p-6 shadow-xl space-y-5">
          {/* Header & Quick Selector */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="border-purple-400/40 text-purple-300 text-[11px] font-mono">
                  🎯 7-Tier Educational Continuum
                </Badge>
                <span className="text-xs text-muted-foreground">Class 5 (7th std) ➔ PhD & Research</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground flex items-center gap-2">
                <span>{academicTierMeta.emoji}</span>
                <span>{academicTierMeta.label} Track</span>
                <span className="text-sm font-normal text-muted-foreground">({academicTierMeta.gradeLabel})</span>
              </h2>
            </div>

            {/* Quick Switcher Pills for all 7 Tiers */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {ACADEMIC_TIERS.map((tier) => {
                const isActive = academicTier === tier.id;
                return (
                  <button
                    key={tier.id}
                    onClick={() => setAcademicTier(tier.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-900/40 ring-1 ring-purple-400'
                        : 'bg-card/70 hover:bg-card border border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span>{tier.emoji}</span>
                    <span>{tier.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dr. Maya's Level-Specific Guidance Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-card/60 backdrop-blur-md border border-border grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Dr. Maya Thumbnail */}
            <div className="md:col-span-3 flex items-center gap-3">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border border-purple-500/40 shrink-0 shadow-md">
                <Image
                  src="/images/ai-mentor-dr-maya.jpg"
                  alt="Dr. Maya Sharma - AI Educator"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-foreground">Dr. Maya Sharma</div>
                <div className="text-[10px] text-purple-400 font-medium">Lead AI Mentor</div>
                <Badge variant="secondary" className="text-[9px] px-1.5 py-0 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                  Pedagogy Active
                </Badge>
              </div>
            </div>

            {/* Quote / Guidance */}
            <div className="md:col-span-6 space-y-2">
              <p className="text-xs sm:text-sm text-foreground italic leading-relaxed">
                &ldquo;{TIER_PEDAGOGY_GUIDES[academicTier]?.mentorTip || academicTierMeta.bannerText}&rdquo;
              </p>
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {TIER_PEDAGOGY_GUIDES[academicTier]?.focusAreas.map((area, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border">
                    ✓ {area}
                  </span>
                ))}
              </div>
            </div>

            {/* Practical Lab & Action CTA */}
            <div className="md:col-span-3 flex flex-col justify-between gap-2.5 md:border-l md:border-border/60 md:pl-5">
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Recommended Lab:</span>
                <span className="text-xs font-semibold text-foreground leading-snug block mt-0.5">
                  {TIER_PEDAGOGY_GUIDES[academicTier]?.practicalLab}
                </span>
              </div>
              <Link href={`/roadmap?tier=${academicTier}`}>
                <Button size="sm" className="w-full text-xs rounded-xl gap-1.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold">
                  Open {academicTierMeta.label} Roadmap <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Primary Action - Continue Learning */}
        <ContinueLearningCard session={dashboardData?.tabData?.liveSessions?.[0]} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Recommended Learning & 28-Course Curriculum */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    Courses & Curriculum
                  </h2>
                  <Badge variant="outline" className="border-purple-500/30 text-purple-300 text-xs font-mono font-bold">
                    {activeCourses.length} of {allDashboardCourses.length} Courses
                  </Badge>
                </div>
                <Link href="/explore" className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors">
                  Browse Full Catalog →
                </Link>
              </div>

              {/* Search & Multi-Filters Toolbar */}
              <div className="p-3.5 rounded-2xl bg-card/70 border border-border space-y-3 shadow-sm">
                {/* Search Bar */}
                <div className="relative w-full">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search courses by title, topic, or keyword..."
                    className="w-full bg-secondary/60 border border-border/80 rounded-xl pl-9 pr-9 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Level & Tier Filter Pills */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1 border-t border-border/50 text-xs">
                  {/* Level Filter */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold text-muted-foreground text-[11px]">Level:</span>
                    {(['All Levels', 'beginner', 'intermediate', 'advanced', 'expert'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setSelectedLevelFilter(lvl)}
                        className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          selectedLevelFilter === lvl
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'bg-secondary/70 hover:bg-secondary text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>

                  {/* Academic Tier Filter */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold text-muted-foreground text-[11px]">Tier:</span>
                    <select
                      value={selectedTierFilter}
                      onChange={(e) => setSelectedTierFilter(e.target.value)}
                      className="bg-secondary/80 border border-border text-[11px] font-semibold text-foreground rounded-lg px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
                    >
                      <option value="All Tiers">All Academic Tiers</option>
                      <option value="Young Explorer">Young Explorer (Class 5–7)</option>
                      <option value="Junior Innovator">Junior Innovator (Class 8–10)</option>
                      <option value="Pre-University">Pre-University (Class 11–12)</option>
                      <option value="Undergraduate">Undergraduate (B.Tech / BSc)</option>
                      <option value="Postgraduate">Postgraduate (M.Tech / MSc)</option>
                      <option value="PhD & Research">PhD & Research</option>
                    </select>
                    {(selectedLevelFilter !== 'All Levels' || selectedTierFilter !== 'All Tiers' || searchQuery) && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedLevelFilter('All Levels');
                          setSelectedTierFilter('All Tiers');
                          setSearchQuery('');
                        }}
                        className="text-[10px] text-purple-400 hover:text-purple-300 underline font-medium cursor-pointer ml-1"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Course Cards List */}
              {activeCourses.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-card border border-border space-y-3">
                  <BookOpen className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
                  <p className="text-sm font-semibold text-foreground">No courses match your filter criteria.</p>
                  <p className="text-xs text-muted-foreground">Try clearing your search query or selecting &quot;All Levels&quot;.</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedLevelFilter('All Levels');
                      setSelectedTierFilter('All Tiers');
                      setSearchQuery('');
                    }}
                    className="text-xs mt-2"
                  >
                    Reset All Filters
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3.5">
                  {activeCourses.map((course) => (
                    <Card key={course.id} className="w-full p-4 sm:p-5 bg-card border border-border rounded-2xl hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-950/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                      <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div className="space-y-1.5 flex-1 min-w-0 text-left">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-sm sm:text-base text-foreground line-clamp-1 text-left">{course.title}</h3>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 uppercase tracking-wide">
                              {course.difficulty}
                            </span>
                            {course.academicTier && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                                {course.academicTier}
                              </span>
                            )}
                            {course.category && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-secondary text-muted-foreground border border-border">
                                {course.category}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1 sm:line-clamp-2 text-left">{course.desc}</p>
                          <div className="flex items-center gap-3 text-[11px] font-medium text-muted-foreground pt-0.5 flex-wrap">
                            <span className="flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3 text-purple-400" />
                              {course.duration}
                            </span>
                            <span>•</span>
                            <span className={course.price === 'Free' ? 'text-emerald-400 font-semibold' : 'text-purple-300 font-semibold font-mono'}>
                              {course.price === 'Free' ? 'Free Track' : course.price}
                            </span>
                            {course.progress > 0 && (
                              <>
                                <span>•</span>
                                <span className="text-purple-400 font-semibold">{course.progress}% completed</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border">
                        <button
                          type="button"
                          onClick={() => setSelectedVideoCourse(course)}
                          className="py-2 px-3.5 rounded-xl bg-purple-600/15 hover:bg-purple-600/30 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-purple-950/20"
                        >
                          <Play className="w-3.5 h-3.5 fill-purple-300" />
                          <span>Watch Video & Lab</span>
                        </button>
                        <Link
                          href={`/learn/${course.id}`}
                          className="py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-purple-900/30 hover:shadow-purple-900/50"
                        >
                          <span>{course.progress > 0 ? 'Continue' : 'Start'}</span>
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* Active Projects Quick Resume */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Code className="w-5 h-5 text-blue-400" />
                  Your Active Projects
                </h2>
                <Link href="/projects" className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                  View Workspace →
                </Link>
              </div>

              {dashboardData?.levelMeta?.projectsCompleted && dashboardData.levelMeta.projectsCompleted > 0 ? (
                <Card className="p-5 bg-card border-border rounded-2xl flex items-center justify-between gap-4 hover:border-blue-500/40 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
                      <Code className="w-6 h-6" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h3 className="text-sm font-bold text-foreground truncate group-hover:text-blue-400 transition-colors">Semantic Search Engine</h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" /> In Progress</span>
                        <span>Updated recently</span>
                      </div>
                    </div>
                  </div>
                  <Link href="/projects">
                    <Button className="hidden sm:flex bg-secondary hover:bg-blue-500/10 text-foreground hover:text-blue-400 border border-border text-xs font-semibold rounded-xl h-9">
                      Open Editor
                    </Button>
                  </Link>
                </Card>
              ) : (
                <Card className="p-5 bg-card border-border rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-500/40 transition-all group">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
                      <Code className="w-6 h-6" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h3 className="text-sm font-bold text-foreground truncate group-hover:text-blue-400 transition-colors">Start Your First AI Project</h3>
                      <p className="text-xs text-muted-foreground">Build neural networks, RAG pipelines, and agent systems with real code.</p>
                    </div>
                  </div>
                  <Link href="/projects">
                    <Button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl h-9 shadow-md shadow-blue-900/20 w-full sm:w-auto">
                      Explore Projects
                    </Button>
                  </Link>
                </Card>
              )}
            </section>
          </div>

          {/* Right Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Minimal Progress Card */}
            <Link href="/roadmap" className="block group">
              <Card className="p-5 bg-card border-border rounded-2xl flex items-center justify-between cursor-pointer hover:border-purple-500/40 hover:shadow-md transition-all">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-foreground group-hover:text-purple-400 transition-colors">Track Progress</h3>
                  <p className="text-xs text-muted-foreground">{levelMeta.completionPercent}% overall completion</p>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-secondary flex items-center justify-center relative">
                  <svg className="w-full h-full transform -rotate-90 absolute" viewBox="0 0 36 36">
                    <path
                      className="text-purple-600"
                      strokeDasharray={`${levelMeta.completionPercent}, 100`}
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                  </svg>
                  <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Card>
            </Link>

            {/* Daily Challenge */}
            <DailyChallengeCard />

            {/* Compact Roadmap */}
            <CompactRoadmap currentStage={dashboardData?.steps?.find((s: any) => s.status === 'in_progress')?.num || 1} />

          </div>
        </div>
      </div>

      {/* Course Animated Video & Realtime Lab Modal */}
      <CourseAnimatedVideoModal
        course={modalCourse}
        isOpen={!!selectedVideoCourse}
        onClose={() => setSelectedVideoCourse(null)}
      />
    </NexusShell>
  );
}
