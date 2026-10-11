'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  GraduationCap,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Sparkles,
  Award,
  Layers,
  FileText,
  Target,
  Compass,
  CheckCircle2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useNexus, ACADEMIC_TIERS, AcademicTier } from '@/context/nexus-context';
import { TIER_PEDAGOGY_GUIDES } from '@/lib/data/academic-pedagogy-guides';

export default function AcademicContinuumPage() {
  const { academicTier, setAcademicTier, academicTierMeta } = useNexus();
  const [selectedTier, setSelectedTier] = useState<AcademicTier>(academicTier || 'undergraduate');

  const activeMeta = ACADEMIC_TIERS.find((t) => t.id === selectedTier) || ACADEMIC_TIERS[3];
  const pedagogy = TIER_PEDAGOGY_GUIDES[selectedTier] || TIER_PEDAGOGY_GUIDES['undergraduate'];

  const handleSelectTier = (tierId: AcademicTier) => {
    setSelectedTier(tierId);
    setAcademicTier(tierId);
  };

  return (
    <NexusShell>
      <div className="space-y-8 max-w-[1400px] mx-auto pb-16">
        {/* Top Breadcrumb & Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2 bg-secondary border border-border rounded-xl hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-purple-400 font-semibold">Academic Continuum</span>
                <span className="text-muted-foreground text-xs">/</span>
                <span className="text-xs text-muted-foreground">Class 5 to PhD & Research</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
                <GraduationCap className="w-7 h-7 text-purple-400" />
                <span>Academic AI Learning Tracks</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/courses">
              <Button className="text-xs h-9 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-md shadow-purple-900/30 cursor-pointer">
                <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                All Courses
              </Button>
            </Link>
          </div>
        </div>

        {/* ── 7-TIER INTERACTIVE CONTINUUM SELECTOR ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Select Your Academic Stage
            </span>
            <span className="text-xs text-purple-400 font-medium">
              Click any stage to adapt your learning roadmap
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
            {ACADEMIC_TIERS.map((tier) => {
              const isCurrent = selectedTier === tier.id;
              return (
                <button
                  key={tier.id}
                  onClick={() => handleSelectTier(tier.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                    isCurrent
                      ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-900/40 ring-1 ring-purple-400'
                      : 'bg-card border-border hover:bg-secondary/60 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-2xl">{tier.emoji}</span>
                    {isCurrent && (
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    )}
                  </div>
                  <div>
                    <h3 className={`font-bold text-xs ${isCurrent ? 'text-white' : 'text-foreground'}`}>
                      {tier.label}
                    </h3>
                    <p className={`text-[10px] mt-0.5 truncate ${isCurrent ? 'text-purple-200' : 'text-muted-foreground'}`}>
                      {tier.gradeLabel}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── ACTIVE TIER DEEP DIVE & PEDAGOGY GUIDANCE ── */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/60 via-card to-purple-950/60 border border-purple-500/30 space-y-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activeMeta.emoji}</span>
                <Badge variant="outline" className="border-purple-400/40 text-purple-300 text-xs font-mono font-bold">
                  {activeMeta.gradeLabel} · {activeMeta.ageRange}
                </Badge>
                <Badge variant="secondary" className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  Level: {activeMeta.mappedLevel.toUpperCase()}
                </Badge>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
                {activeMeta.bannerTitle}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
                {activeMeta.bannerText}
              </p>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
              <Link href={`/roadmap?tier=${selectedTier}`}>
                <Button className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs h-10 px-5 rounded-xl shadow-md shadow-purple-900/30 gap-1.5 cursor-pointer">
                  <span>Open {activeMeta.label} Roadmap</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Dr. Maya Pedagogy & Focus Areas */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Dr. Maya Profile */}
            <div className="md:col-span-4 flex items-center gap-4 p-4 rounded-2xl bg-secondary/40 border border-border">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-purple-500/40 shrink-0 shadow-md">
                <Image
                  src="/images/ai-mentor-dr-maya.jpg"
                  alt="Dr. Maya Sharma"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground">Dr. Maya Sharma</h3>
                <p className="text-[11px] text-purple-400 font-medium">Head of AI Pedagogy & Curriculum</p>
                <span className="inline-block text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Pedagogy Active
                </span>
              </div>
            </div>

            {/* Pedagogy Advice */}
            <div className="md:col-span-8 space-y-2">
              <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">
                Pedagogical Objective & Learning Philosophy:
              </span>
              <p className="text-xs sm:text-sm text-foreground italic leading-relaxed">
                &ldquo;{pedagogy.mentorTip}&rdquo;
              </p>
            </div>
          </div>

          {/* 3 Pillars: Focus Areas, Practical Lab, and Real-World Application */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <Card className="p-4 bg-card/80 border-border rounded-2xl space-y-2.5">
              <div className="flex items-center gap-2 text-foreground font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <h4>Core Focus Areas</h4>
              </div>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                {pedagogy.focusAreas.map((area: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-purple-400 font-bold">•</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-4 bg-card/80 border-border rounded-2xl space-y-2.5">
              <div className="flex items-center gap-2 text-foreground font-bold text-xs">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h4>Recommended Lab</h4>
              </div>
              <p className="text-xs font-semibold text-foreground">
                {pedagogy.practicalLab}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Hands-on coding exercise tailored for this tier&apos;s mathematical maturity level.
              </p>
            </Card>

            <Card className="p-4 bg-card/80 border-border rounded-2xl space-y-2.5">
              <div className="flex items-center gap-2 text-foreground font-bold text-xs">
                <Target className="w-4 h-4 text-blue-400" />
                <h4>Next Academic Milestone</h4>
              </div>
              <p className="text-xs font-semibold text-foreground">
                {activeMeta.tagline}
              </p>
              <Link
                href={`/roadmap?tier=${selectedTier}`}
                className="text-[11px] text-purple-400 hover:text-purple-300 font-semibold inline-flex items-center gap-1 mt-1"
              >
                <span>View Full Milestone Track</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </Card>
          </div>
        </div>

        {/* ── ACADEMIC RESOURCES & UNIVERSITY PORTALS ── */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            <span>Academic Curriculum & University Preparation</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/vtu-question-papers" className="block group">
              <Card className="p-5 bg-card border-border hover:border-purple-500/50 rounded-2xl space-y-2 transition-all cursor-pointer h-full">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-foreground group-hover:text-purple-400 transition-colors">
                  VTU AI Question Papers
                </h3>
                <p className="text-xs text-muted-foreground">
                  Previous year semester exam papers, model question banks, and answer keys.
                </p>
              </Card>
            </Link>

            <Link href="/math-for-ai" className="block group">
              <Card className="p-5 bg-card border-border hover:border-purple-500/50 rounded-2xl space-y-2 transition-all cursor-pointer h-full">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-foreground group-hover:text-blue-400 transition-colors">
                  Mathematics for AI
                </h3>
                <p className="text-xs text-muted-foreground">
                  Linear algebra, multivariate calculus, probability theory, and discrete math.
                </p>
              </Card>
            </Link>

            <Link href="/courses" className="block group">
              <Card className="p-5 bg-card border-border hover:border-purple-500/50 rounded-2xl space-y-2 transition-all cursor-pointer h-full">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-foreground group-hover:text-amber-400 transition-colors">
                  Complete Course Catalog
                </h3>
                <p className="text-xs text-muted-foreground">
                  Browse all 28 original curriculum masterclasses from beginner to advanced.
                </p>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </NexusShell>
  );
}
