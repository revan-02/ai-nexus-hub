'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { useNexus, UserLevel } from '@/context/nexus-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  Lock,
  ArrowRight,
  Clock,
  Flame,
  BookOpen,
  HelpCircle,
  Award,
  Users,
  Sparkles,
  FileText,
  AlertCircle,
  RotateCcw,
  Video,
  Code,
  Trophy,
  Check,
  MessageSquare,
  X,
  ExternalLink,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

import { useLearnerDashboard } from '@/hooks/api/use-dashboard';
import { IndustryAIPlacementHighway } from '@/components/learning/industry-ai-placement-highway';

export default function DashboardPage() {
  const { userLevel, setUserLevel, levelMeta: contextLevelMeta } = useNexus();
  const { data: apiResponse, isLoading, isError, refetch } = useLearnerDashboard();
  const [activeTab, setActiveTab] = useState('Recommended');
  const [levelFilter, setLevelFilter] = useState<'all' | UserLevel>(userLevel);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState('LLM Architectures & Transformers');
  const [communityStep, setCommunityStep] = useState<1 | 2 | 3>(1);
  const [communityJoined, setCommunityJoined] = useState(false);

  useEffect(() => {
    setLevelFilter(userLevel);
  }, [userLevel]);

  const dashboardData = apiResponse?.data;
  const levelMeta = {
    title: contextLevelMeta?.title || dashboardData?.levelMeta?.title || 'AI Learning Path',
    levelBadge: contextLevelMeta?.levelBadge || dashboardData?.levelMeta?.levelBadge || `${userLevel} Track`,
    tagline: contextLevelMeta?.tagline || dashboardData?.levelMeta?.tagline || 'Master AI, Machine Learning, and Generative Systems with real-world practice.',
    bannerTitle: contextLevelMeta?.bannerTitle || dashboardData?.levelMeta?.bannerTitle || 'Start Your AI Journey',
    bannerText: contextLevelMeta?.bannerText || dashboardData?.levelMeta?.bannerText || 'Learn step-by-step and become AI confident.',
    bannerCta: contextLevelMeta?.bannerCta || dashboardData?.levelMeta?.bannerCta || 'View Full Roadmap',
    lessonsCompleted: dashboardData?.levelMeta?.lessonsCompleted ?? 0,
    totalLessons: dashboardData?.levelMeta?.totalLessons ?? 0,
    quizzesTaken: dashboardData?.levelMeta?.quizzesTaken ?? 0,
    projectsCompleted: dashboardData?.levelMeta?.projectsCompleted ?? 0,
    totalProjects: dashboardData?.levelMeta?.totalProjects ?? 0,
    timeSpent: dashboardData?.levelMeta?.timeSpent || '0m',
    streakDays: dashboardData?.levelMeta?.streakDays ?? 0,
    completionPercent: dashboardData?.levelMeta?.completionPercent ?? 0,
    statsBadges: dashboardData?.levelMeta?.statsBadges ?? 0,
  };

  const steps = dashboardData?.steps || [
    { num: 1, title: 'Advanced Foundations', status: 'in_progress', progress: 0 },
    { num: 2, title: 'Deep Learning Mastery', status: 'locked', progress: 0 },
    { num: 3, title: 'Research & Innovation', status: 'locked', progress: 0 },
    { num: 4, title: 'Advanced Applications', status: 'locked', progress: 0 },
    { num: 5, title: 'AI Systems Design', status: 'locked', progress: 0 },
    { num: 6, title: 'Expert Mastery', status: 'locked', progress: 0 },
  ];

  const activeCourses = dashboardData?.activeCourses || [];
  const tabData = dashboardData?.tabData;

  const displayedRecommendedCourses = React.useMemo(() => {
    if (!activeCourses.length) return [];

    if (levelFilter !== 'all') {
      return activeCourses.filter((course) => {
        const cLvl = course.level.toLowerCase();
        if (levelFilter === 'beginner') return cLvl.includes('beginner');
        if (levelFilter === 'intermediate') return cLvl.includes('intermediate');
        if (levelFilter === 'advanced') return cLvl.includes('advanced');
        if (levelFilter === 'expert') return cLvl.includes('expert') || cLvl.includes('advanced');
        return true;
      });
    }

    // Default: Sort courses so that courses matching the current userLevel come first
    return [...activeCourses].sort((a, b) => {
      const aMatches = a.level.toLowerCase().includes(userLevel);
      const bMatches = b.level.toLowerCase().includes(userLevel);
      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;
      return 0;
    });
  }, [activeCourses, levelFilter, userLevel]);

  const donutProgressData = [
    { name: 'Completed', value: levelMeta.completionPercent, color: '#7c3aed' },
    { name: 'Remaining', value: Math.max(0, 100 - levelMeta.completionPercent), color: 'var(--border)' },
  ];

  const apiRecommended = dashboardData?.recommended;
  const recommendedItems = [
    ...(apiRecommended?.papers || []),
    ...(apiRecommended?.projects || []),
    ...(apiRecommended?.algorithms || []),
  ];

  return (
    <NexusShell>
      <div className="space-y-6">
        {/* Header Title Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{levelMeta.title}</h1>
              <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-bold rounded-lg capitalize">
                {levelMeta.levelBadge}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">{levelMeta.tagline}</p>
          </div>

          <Link
            href="/roadmap"
            className="inline-flex items-center gap-2 px-4 py-2 bg-secondary border border-border hover:bg-secondary/80 text-foreground text-xs font-semibold rounded-xl transition-all self-start sm:self-auto"
          >
            <span>View Full Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
          </Link>
        </div>

        {/* Loading State Skeleton */}
        {isLoading && (
          <Card className="p-5 bg-card border-border rounded-2xl animate-pulse space-y-4">
            <div className="h-4 bg-secondary rounded w-1/4" />
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-16 bg-secondary/60 rounded-xl" />
              ))}
            </div>
          </Card>
        )}

        {/* Error State */}
        {isError && (
          <Card className="p-6 bg-rose-950/20 border border-rose-500/30 rounded-2xl space-y-3">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-sm font-bold">Unable to load live dashboard data</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              A problem occurred while retrieving database statistics. Please verify your connection or try again.
            </p>
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="bg-secondary border-border text-foreground text-xs h-8 px-3 rounded-xl gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </Button>
          </Card>
        )}

        {/* Visual Progress Steps Timeline Bar */}
        {!isLoading && !isError && (
          <Card className="p-5 bg-card border-border rounded-2xl space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 relative">
              {steps.map((s) => (
                <div key={s.num} className="flex flex-col items-center text-center relative group">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-all ${
                      s.status === 'completed'
                        ? 'bg-emerald-500 text-white shadow-emerald-900/30'
                        : s.status === 'in_progress'
                        ? 'bg-purple-600 text-white ring-4 ring-purple-500/20 shadow-purple-900/30'
                        : 'bg-secondary text-muted-foreground border border-border'
                    }`}
                  >
                    {s.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : s.status === 'locked' ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      <span>{s.num}</span>
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-foreground mt-2 truncate w-full">{s.title}</span>
                  <span
                    className={`text-[10px] font-semibold mt-0.5 capitalize ${
                      s.status === 'completed'
                        ? 'text-emerald-400'
                        : s.status === 'in_progress'
                        ? 'text-purple-400'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {s.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Main Grid: Course List (Left) + Stats & Sidebar (Right) */}
        {!isLoading && !isError && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Category Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-border">
                {['Recommended', 'Expert Courses', 'Industry AI & Placement', 'Research Papers', 'Projects', 'Challenges', 'Live Sessions'].map(
                  (tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                        activeTab === tab
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30 font-bold'
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                      }`}
                    >
                      {tab}
                    </button>
                  )
                )}
              </div>

              {/* Recommended & Expert Courses Tab View */}
              {(activeTab === 'Recommended' || activeTab === 'Expert Courses') && (
                <>
                  {activeTab === 'Recommended' && (
                    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-card/60 border border-border rounded-xl">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground text-xs">Track Level:</span>
                        <div className="flex items-center gap-1 bg-secondary/80 p-0.5 rounded-lg border border-border">
                          {(['all', 'beginner', 'intermediate', 'advanced', 'expert'] as const).map((lvl) => (
                            <button
                              key={lvl}
                              onClick={() => {
                                setLevelFilter(lvl);
                                if (lvl !== 'all') setUserLevel(lvl);
                              }}
                              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold capitalize transition-all cursor-pointer ${
                                (levelFilter === lvl)
                                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-900/30 font-bold'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                              }`}
                            >
                              {lvl === 'all' ? 'All Levels' : lvl}
                            </button>
                          ))}
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-purple-400 font-semibold">
                        Showing {displayedRecommendedCourses.length} course{displayedRecommendedCourses.length === 1 ? '' : 's'}
                      </span>
                    </div>
                  )}

                  {(((activeTab === 'Recommended' ? displayedRecommendedCourses : tabData?.expertCourses || []).length === 0)) && (
                    <Card className="p-8 text-center space-y-3 bg-card border-border rounded-2xl">
                      <BookOpen className="w-8 h-8 text-purple-400 mx-auto" />
                      <h3 className="text-sm font-bold text-foreground">No courses found for this level</h3>
                      <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                        Explore all available tracks or switch filter to view courses across other levels.
                      </p>
                      <Button
                        onClick={() => {
                          setLevelFilter('all');
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold h-8 px-4 rounded-xl mt-2 cursor-pointer"
                      >
                        View All Levels
                      </Button>
                    </Card>
                  )}

                  <div className="space-y-4">
                    {(activeTab === 'Recommended' ? displayedRecommendedCourses : tabData?.expertCourses || []).map((item) => (
                      <Card
                        key={item.id}
                        className={`p-5 bg-card border-border rounded-2xl hover:border-purple-500/40 transition-all ${
                          item.status === 'locked' ? 'opacity-65' : ''
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                                item.status === 'completed'
                                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                  : item.status === 'in_progress'
                                  ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                                  : 'bg-secondary text-muted-foreground border border-border'
                              }`}
                            >
                              {item.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : item.num}
                            </div>

                            <div className="space-y-1 max-w-lg">
                              <h3 className="text-sm font-bold text-foreground leading-snug">{item.title}</h3>
                              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>

                              <div className="flex items-center gap-3 pt-1 text-[11px] font-semibold text-muted-foreground flex-wrap">
                                <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded border border-purple-500/20 capitalize font-mono">
                                  {item.level}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-muted-foreground" /> {item.duration}
                                </span>
                                <span className="flex items-center gap-1 text-amber-400">
                                  <Flame className="w-3 h-3" /> {item.difficulty}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2 flex-shrink-0 self-end sm:self-center">
                            <div className="w-32 bg-secondary rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  item.progress === 100 ? 'bg-emerald-500' : 'bg-purple-600'
                                }`}
                                style={{ width: `${item.progress}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-mono text-muted-foreground font-bold">{item.progress}%</span>

                            {item.status === 'completed' ? (
                              <Link href="/courses">
                                <Button
                                  variant="outline"
                                  className="bg-secondary border-border hover:bg-secondary/80 text-foreground text-xs font-semibold h-8 px-4 rounded-xl"
                                >
                                  Review
                                </Button>
                              </Link>
                            ) : item.status === 'in_progress' ? (
                              <Link href="/courses">
                                <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs h-8 px-4 rounded-xl shadow-sm shadow-purple-900/30">
                                  {item.action}
                                </Button>
                              </Link>
                            ) : (
                              <Button
                                disabled
                                variant="outline"
                                className="bg-secondary/50 border-border text-muted-foreground text-xs h-8 px-4 rounded-xl gap-1.5"
                              >
                                <Lock className="w-3.5 h-3.5" /> Locked
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              )}

              {/* Industry AI & Placement Highway Tab View */}
              {activeTab === 'Industry AI & Placement' && (
                <IndustryAIPlacementHighway />
              )}

              {/* Research Papers Tab View */}
              {activeTab === 'Research Papers' && (
                <div className="space-y-4">
                  {(tabData?.researchPapers || []).map((paper) => (
                    <Card key={paper.id} className="p-5 bg-card border-border rounded-2xl hover:border-purple-500/40 transition-all flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="space-y-1 min-w-0">
                          <h3 className="text-sm font-bold text-foreground truncate">{paper.title}</h3>
                          <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-mono rounded">
                            {paper.category}
                          </span>
                        </div>
                      </div>
                      <Link href={paper.href}>
                        <Button variant="outline" className="bg-secondary border-border hover:bg-secondary/80 text-foreground text-xs font-semibold h-8 px-4 rounded-xl">
                          Read Paper
                        </Button>
                      </Link>
                    </Card>
                  ))}
                </div>
              )}

              {/* Projects Tab View */}
              {activeTab === 'Projects' && (
                <div className="space-y-4">
                  {(tabData?.projects || []).map((project) => (
                    <Card key={project.id} className="p-5 bg-card border-border rounded-2xl hover:border-purple-500/40 transition-all flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                          <Code className="w-5 h-5" />
                        </div>
                        <div className="space-y-1 min-w-0">
                          <h3 className="text-sm font-bold text-foreground truncate">{project.title}</h3>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-mono rounded">
                              {project.tag}
                            </span>
                            <span className="text-xs text-muted-foreground">{project.category}</span>
                          </div>
                        </div>
                      </div>
                      <Link href={project.href}>
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs h-8 px-4 rounded-xl shadow-sm shadow-purple-900/30">
                          View Project
                        </Button>
                      </Link>
                    </Card>
                  ))}
                </div>
              )}

              {/* Challenges Tab View */}
              {activeTab === 'Challenges' && (
                <div className="space-y-4">
                  {(tabData?.challenges || []).map((ch) => (
                    <Card key={ch.id} className="p-5 bg-card border-border rounded-2xl hover:border-purple-500/40 transition-all flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                          <Trophy className="w-5 h-5" />
                        </div>
                        <div className="space-y-1 min-w-0">
                          <h3 className="text-sm font-bold text-foreground truncate">{ch.title}</h3>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono rounded">
                              {ch.type}
                            </span>
                            <span className="text-xs text-amber-400 flex items-center gap-1">
                              <Flame className="w-3 h-3" /> {ch.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link href={ch.href}>
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs h-8 px-4 rounded-xl shadow-sm shadow-purple-900/30">
                          Start Challenge
                        </Button>
                      </Link>
                    </Card>
                  ))}
                </div>
              )}

              {/* Live Sessions Tab View */}
              {activeTab === 'Live Sessions' && (
                <div className="space-y-4">
                  {(tabData?.liveSessions || []).map((session) => (
                    <Card key={session.id} className="p-5 bg-card border-border rounded-2xl hover:border-purple-500/40 transition-all flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                          <Video className="w-5 h-5" />
                        </div>
                        <div className="space-y-1 min-w-0">
                          <h3 className="text-sm font-bold text-foreground truncate">{session.title}</h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{session.category}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {session.estimatedTime}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link href={session.href}>
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs h-8 px-4 rounded-xl shadow-sm shadow-purple-900/30">
                          Join Session
                        </Button>
                      </Link>
                    </Card>
                  ))}
                </div>
              )}

              {/* Bottom Challenges Banner */}
              <Card className="p-6 bg-card border border-border hover:border-purple-500/40 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm transition-all">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Take on Expert Challenges</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Solve complex problems, participate in competitions and earn exclusive badges.
                    </p>
                  </div>
                </div>
                <Link
                  href="/challenges"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-purple-900/30 whitespace-nowrap self-start sm:self-auto cursor-pointer"
                >
                  <span>Explore Challenges</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Card>
            </div>

            {/* Right Column (4 Cols) Stats & Community */}
            <div className="lg:col-span-4 space-y-6">
              {/* Progress Donut Card */}
              <Card className="p-5 bg-card border-border rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">Your Progress</h3>
                  <Link href="/profile" className="text-xs text-purple-400 hover:underline font-semibold">
                    View Progress
                  </Link>
                </div>

                <div className="relative h-44 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donutProgressData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="none"
                      >
                        {donutProgressData.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold font-mono text-foreground">{levelMeta.completionPercent}%</span>
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      Complete
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-border text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> Lessons Completed
                    </span>
                    <span className="font-mono font-bold text-foreground">
                      {levelMeta.lessonsCompleted} / {levelMeta.totalLessons}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-purple-400" /> Quizzes Taken
                    </span>
                    <span className="font-mono font-bold text-foreground">{levelMeta.quizzesTaken}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-400" /> Projects Completed
                    </span>
                    <span className="font-mono font-bold text-foreground">
                      {levelMeta.projectsCompleted} / {levelMeta.totalProjects}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-400" /> Time Spent
                    </span>
                    <span className="font-mono font-bold text-foreground">{levelMeta.timeSpent}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-rose-400" /> Streak
                    </span>
                    <span className="font-mono font-bold text-foreground">{levelMeta.streakDays} days</span>
                  </div>
                </div>
              </Card>

              {/* Level Stats Grid */}
              <Card className="p-5 bg-card border-border rounded-2xl space-y-3">
                <h3 className="text-sm font-bold text-foreground capitalize">{userLevel} Stats</h3>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 bg-secondary rounded-xl border border-border">
                    <span className="text-xl font-bold font-mono text-emerald-400 block">{levelMeta.lessonsCompleted}</span>
                    <span className="text-[10px] text-muted-foreground font-semibold">Lessons</span>
                  </div>
                  <div className="p-3 bg-secondary rounded-xl border border-border">
                    <span className="text-xl font-bold font-mono text-purple-400 block">{levelMeta.quizzesTaken}</span>
                    <span className="text-[10px] text-muted-foreground font-semibold">Quizzes</span>
                  </div>
                  <div className="p-3 bg-secondary rounded-xl border border-border">
                    <span className="text-xl font-bold font-mono text-amber-400 block">{levelMeta.statsBadges}</span>
                    <span className="text-[10px] text-muted-foreground font-semibold">Badges</span>
                  </div>
                  <div className="p-3 bg-secondary rounded-xl border border-border">
                    <span className="text-xl font-bold font-mono text-blue-400 block">{levelMeta.timeSpent}</span>
                    <span className="text-[10px] text-muted-foreground font-semibold">Time Invested</span>
                  </div>
                </div>
              </Card>

              {/* Recommended For You */}
              <Card className="p-5 bg-card border-border rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">Recommended For You</h3>
                  <Link href="/courses" className="text-xs text-purple-400 hover:underline font-semibold">
                    View All
                  </Link>
                </div>

                <div className="space-y-2">
                  {recommendedItems.map((rec) => (
                    <Link
                      key={rec.title}
                      href={rec.href}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-secondary transition-colors text-xs group"
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <FileText className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                        <span className="font-semibold text-foreground truncate group-hover:text-purple-400 transition-colors">
                          {rec.title}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-mono rounded flex-shrink-0">
                        {rec.tag}
                      </span>
                    </Link>
                  ))}
                </div>
              </Card>

              {/* Join Community Banner (Clean, High-Contrast & Theme-Adaptive) */}
              <Card className="p-6 bg-card border border-border hover:border-purple-500/40 rounded-3xl space-y-4 shadow-md transition-all relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/20">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground capitalize">
                        Join The {userLevel} Community
                      </h4>
                      <p className="text-[10px] text-muted-foreground font-mono">1,420+ Engineers Online</p>
                    </div>
                  </div>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  Collaborate with verified AI researchers, discuss new model papers, ask questions, and build groundbreaking open-source projects together.
                </p>

                <div className="flex flex-col gap-2 pt-1">
                  <Button
                    onClick={() => {
                      setCommunityStep(1);
                      setShowCommunityModal(true);
                    }}
                    className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-purple-900/30 gap-2 cursor-pointer"
                  >
                    <Users className="w-4 h-4" />
                    <span>Join Community & Onboard</span>
                  </Button>

                  <Link
                    href="/community"
                    className="w-full py-2 text-center text-xs font-semibold text-muted-foreground hover:text-foreground bg-secondary/60 hover:bg-secondary rounded-xl transition-colors border border-border/50"
                  >
                    Browse Public Discussions
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* ── 3-STEP COMMUNITY ONBOARDING & PROCESS MODAL ── */}
      {showCommunityModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-lg rounded-3xl p-6 sm:p-7 space-y-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                    <Users className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">Join Nexus AI Community</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  3-Step onboarding process to join channels, peer rooms, and discussion forums.
                </p>
              </div>
              <button
                onClick={() => setShowCommunityModal(false)}
                className="p-1 text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step Progress Bar */}
            <div className="flex items-center justify-between gap-2">
              {[
                { step: 1, label: '1. Channels' },
                { step: 2, label: '2. Guidelines' },
                { step: 3, label: '3. Access' },
              ].map((s) => (
                <div
                  key={s.step}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-center text-[11px] font-bold border transition-all ${
                    communityStep === s.step
                      ? 'bg-purple-600/15 border-purple-500/40 text-purple-400'
                      : communityStep > s.step
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                      : 'bg-secondary/40 border-border text-muted-foreground'
                  }`}
                >
                  {communityStep > s.step ? `✓ ${s.label.split('. ')[1]}` : s.label}
                </div>
              ))}
            </div>

            {/* STEP 1: CHOOSE CHANNELS */}
            {communityStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-foreground">Step 1: Choose Your Primary AI Track</h4>
                  <p className="text-xs text-muted-foreground">Select where you want to engage and get peer notifications.</p>
                </div>

                <div className="space-y-2">
                  {[
                    { id: 'LLM Architectures & Transformers', desc: 'Attention kernels, LoRA fine-tuning, RAG pipelines & prompt engineering', icon: Sparkles },
                    { id: 'CUDA & Triton Kernel Engineering', desc: 'GPU memory optimization, FP8 matrix multiplication & distributed training', icon: Code },
                    { id: 'Computer Vision & Multimodal', desc: 'Object detection, diffusion models, image segmentation & medical AI', icon: Video },
                    { id: 'Academic AI & VTU Exam Prep', desc: 'Semester syllabus breakdowns, solved university papers & lab viva help', icon: BookOpen },
                    { id: 'AI Career Highway & Placements', desc: '0-4y interview prep, mock evaluations, compensation negotiation & referrals', icon: Trophy },
                  ].map((track) => {
                    const isSelected = selectedChannel === track.id;
                    const TrackIcon = track.icon;
                    return (
                      <div
                        key={track.id}
                        onClick={() => setSelectedChannel(track.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? 'bg-purple-500/10 border-purple-500/50 text-foreground'
                            : 'bg-secondary/40 border-border text-muted-foreground hover:bg-secondary/80'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isSelected ? 'bg-purple-600 text-white' : 'bg-secondary text-muted-foreground'
                        }`}>
                          <TrackIcon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold text-foreground block">{track.id}</span>
                          <span className="text-[11px] text-muted-foreground leading-relaxed block">{track.desc}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-purple-400 flex-shrink-0 mt-1" />}
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    onClick={() => setCommunityStep(2)}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-9 px-5 rounded-xl cursor-pointer gap-1.5"
                  >
                    <span>Next: Review Guidelines</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: COMMUNITY GUIDELINES & CODE OF CONDUCT */}
            {communityStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-foreground">Step 2: Community Code of Conduct</h4>
                  <p className="text-xs text-muted-foreground">Our principles for high-signal, zero-toxicity technical peer collaboration.</p>
                </div>

                <div className="space-y-2.5 font-mono text-xs">
                  <div className="p-3 bg-secondary/50 rounded-2xl border border-border flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-foreground block">1. Constructive Peer Reviews</span>
                      <span className="text-[11px] text-muted-foreground font-sans block">Share code snippets, benchmark graphs, and architectural critiques with empathy.</span>
                    </div>
                  </div>

                  <div className="p-3 bg-secondary/50 rounded-2xl border border-border flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-foreground block">2. High Signal, Zero Spam</span>
                      <span className="text-[11px] text-muted-foreground font-sans block">No self-promotional spam, affiliate links, or unverified claims without empirical data.</span>
                    </div>
                  </div>

                  <div className="p-3 bg-secondary/50 rounded-2xl border border-border flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-foreground block">3. Open Collaboration</span>
                      <span className="text-[11px] text-muted-foreground font-sans block">Collaborate freely on hackathons, research papers, and open-source models.</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setCommunityStep(1)}
                    className="bg-secondary border-border text-foreground text-xs h-9 px-4 rounded-xl cursor-pointer"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => {
                      setCommunityJoined(true);
                      setCommunityStep(3);
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-9 px-5 rounded-xl cursor-pointer gap-1.5 shadow-md shadow-purple-950/40"
                  >
                    <Check className="w-4 h-4" />
                    <span>Agree & Activate Membership</span>
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: ACCESS & LAUNCH */}
            {communityStep === 3 && (
              <div className="space-y-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-bold text-foreground">Welcome to the Nexus AI Community!</h4>
                  <p className="text-xs text-muted-foreground">
                    Your membership is active for <strong className="text-purple-400">{selectedChannel}</strong>.
                  </p>
                </div>

                <div className="p-4 bg-secondary/50 rounded-2xl border border-border text-left space-y-2">
                  <span className="text-xs font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>What you can do now:</span>
                  </span>
                  <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                    <li>Create new discussion threads on research papers</li>
                    <li>Ask AI architectural and algorithmic questions</li>
                    <li>Join collaborative project rooms & team hackathons</li>
                  </ul>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowCommunityModal(false)}
                    className="bg-secondary border-border text-foreground text-xs h-10 px-5 rounded-xl cursor-pointer"
                  >
                    Close
                  </Button>
                  <Link
                    href="/community"
                    onClick={() => setShowCommunityModal(false)}
                    className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-10 px-6 rounded-xl shadow-md shadow-purple-950/40 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Launch Community Forums</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </NexusShell>
  );
}
