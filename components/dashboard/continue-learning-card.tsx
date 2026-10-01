import React from 'react';
import { PlayCircle, Clock, BookOpen, Layers } from 'lucide-react';
import Link from 'next/link';

interface LiveSession {
  id: string;
  title: string;
  category: string;
  estimatedTime: string;
  href: string;
}

interface ContinueLearningCardProps {
  session?: LiveSession;
}

export function ContinueLearningCard({ session }: ContinueLearningCardProps) {
  const hasActiveSession = Boolean(session && session.title);

  // Use real session data if provided, otherwise show fresh welcome curriculum
  const title = session?.title ?? 'AI Foundations & Intelligent Agents';
  const category = session?.category ?? 'Stage 1: Core Fundamentals';
  const estimatedTime = session?.estimatedTime ?? '15 mins intro';
  const href = session?.href ?? '/courses';
  const badgeLabel = hasActiveSession ? 'In Progress' : 'Get Started';
  const buttonLabel = hasActiveSession ? 'Resume Learning' : 'Start Learning';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/40 via-background to-background border border-purple-500/20 shadow-lg shadow-purple-900/10">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="flex-1 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-wider">
            <PlayCircle className="w-3.5 h-3.5" />
            <span>{badgeLabel}</span>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>{category}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight">
              {title}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground pt-2">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>{estimatedTime}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>Interactive curriculum</span>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 w-full md:w-auto">
          <Link
            href={href}
            className="inline-flex items-center justify-center w-full md:w-auto px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-purple-600/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0 text-sm"
          >
            {buttonLabel}
            <PlayCircle className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
