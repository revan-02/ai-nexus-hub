'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { useNexus } from '@/context/nexus-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Code, Trophy, Sparkles, Play } from 'lucide-react';
import Link from 'next/link';

import { ContinueLearningCard } from '@/components/dashboard/continue-learning-card';
import { DailyChallengeCard } from '@/components/dashboard/daily-challenge-card';
import { CompactRoadmap } from '@/components/dashboard/compact-roadmap';
import { useLearnerDashboard } from '@/hooks/api/use-dashboard';
import { CourseAnimatedVideoModal } from '@/components/courses/course-animated-video-modal';
import type { CourseItem } from '@/lib/mock-data/courses-data';

export default function DashboardPage() {
  const { data: session } = useSession();
  const { userLevel, levelMeta: contextLevelMeta } = useNexus();
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

  const firstName = session?.user?.name ? session.user.name.split(' ')[0] : '';

  const dashboardData = apiResponse?.data;
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<'All Levels' | 'beginner' | 'intermediate' | 'advanced' | 'expert'>((userLevel as any) || 'expert');
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
        price: 'Free',
        students: '12,420',
        status: 'Published',
        updatedAt: 'Recently',
        thumbnailIcon: 'Brain',
        instructor: {
          name: 'Dr. Alex Morgan',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        },
      }
    : null;

  useEffect(() => {
    if (userLevel && ['beginner', 'intermediate', 'advanced', 'expert'].includes(userLevel)) {
      setSelectedLevelFilter(userLevel);
    }
  }, [userLevel]);

  const levelMeta = {
    title: contextLevelMeta?.title || dashboardData?.levelMeta?.title || 'Welcome back, Aarav',
    completionPercent: dashboardData?.levelMeta?.completionPercent ?? 12,
  };

  const rawCourses = dashboardData?.activeCourses || [
    { id: 1, title: 'Generative Models Overview', desc: 'Introduction to VAEs and GANs.', progress: 15, duration: '2h 10m', difficulty: 'Intermediate', level: 'Intermediate' },
    { id: 2, title: 'PyTorch for Deep Learning', desc: 'Tensors, Autograd, and Neural Networks.', progress: 5, duration: '4h 30m', difficulty: 'Beginner', level: 'Beginner' },
    { id: 3, title: 'Natural Language Processing', desc: 'Tokenization, Embeddings, and Transformers.', progress: 0, duration: '6h 15m', difficulty: 'Advanced', level: 'Advanced' },
  ];

  const activeCourses = rawCourses.filter((course: any) => {
    if (selectedLevelFilter === 'All Levels') return true;
    const lvl = (course.level || course.difficulty || '').toLowerCase();
    if (selectedLevelFilter === 'expert') {
      return lvl === 'expert' || lvl === 'advanced' || lvl === 'hard';
    }
    if (selectedLevelFilter === 'advanced') {
      return lvl === 'advanced' || lvl === 'hard';
    }
    if (selectedLevelFilter === 'intermediate') {
      return lvl === 'intermediate' || lvl === 'medium';
    }
    if (selectedLevelFilter === 'beginner') {
      return lvl === 'beginner' || lvl === 'easy';
    }
    return false;
  });

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
          <Link href="/roadmap">
            <Button variant="outline" className="bg-secondary border-border text-xs font-semibold rounded-xl h-9">
              View all my courses
            </Button>
          </Link>
        </div>

        {/* Primary Action - Continue Learning */}
        <ContinueLearningCard session={dashboardData?.tabData?.liveSessions?.[0]} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Recommended Learning */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Recommended For You
                </h2>
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="font-semibold text-muted-foreground">Track Level:</span>
                  {(['All Levels', 'beginner', 'intermediate', 'advanced', 'expert'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSelectedLevelFilter(lvl)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        selectedLevelFilter === lvl
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'bg-secondary text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
                <Link href="/explore" className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors">
                  Browse Catalog →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {activeCourses.map((course) => (
                  <Card key={course.id} className="p-4 bg-card border-border rounded-2xl hover:border-purple-500/40 transition-all flex flex-col h-full group">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="font-bold text-sm text-foreground line-clamp-2">{course.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{course.desc}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-[11px] font-medium text-muted-foreground">
                      <span>{course.duration}</span>
                      <span className="text-purple-400">{course.difficulty}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedVideoCourse(course)}
                      className="w-full mt-3 py-1.5 px-2.5 rounded-xl bg-purple-600/15 hover:bg-purple-600/30 text-purple-300 hover:text-white border border-purple-500/30 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-purple-950/20"
                    >
                      <Play className="w-3 h-3 fill-purple-300" />
                      <span>Watch Animated Video & Lab</span>
                    </button>
                  </Card>
                ))}
              </div>
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

              <Card className="p-5 bg-card border-border rounded-2xl flex items-center justify-between gap-4 hover:border-blue-500/40 transition-all cursor-pointer group">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
                    <Code className="w-6 h-6" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h3 className="text-sm font-bold text-foreground truncate group-hover:text-blue-400 transition-colors">Semantic Search Engine</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" /> In Progress</span>
                      <span>Updated 2 hours ago</span>
                    </div>
                  </div>
                </div>
                <Button className="hidden sm:flex bg-secondary hover:bg-blue-500/10 text-foreground hover:text-blue-400 border border-border text-xs font-semibold rounded-xl h-9">
                  Open Editor
                </Button>
              </Card>
            </section>
          </div>

          {/* Right Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Minimal Progress Card */}
            <Card className="p-5 bg-card border-border rounded-2xl flex items-center justify-between group cursor-pointer hover:border-purple-500/40 transition-colors">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground">Track Progress</h3>
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

            {/* Daily Challenge */}
            <DailyChallengeCard />

            {/* Compact Roadmap */}
            <CompactRoadmap />

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
