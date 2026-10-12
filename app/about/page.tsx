'use client';

import React from 'react';
import Link from 'next/link';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Brain,
  Building2,
  ShieldCheck,
  Award,
  BookOpen,
  Code,
  Cpu,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Users,
  Compass,
  Sparkles,
  Lock
} from 'lucide-react';

export default function AboutPage() {
  return (
    <NexusShell>
      <div className="space-y-8 max-w-5xl mx-auto pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <Link href="/dashboard" className="hover:text-foreground">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-purple-400 font-semibold">About AI Nexus</span>
        </div>

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950/70 via-slate-900 to-indigo-950/60 border border-purple-500/30 p-8 sm:p-10 shadow-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Learning Ecosystem & Practical Engineering Hub</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
            Democratizing Practical AI Engineering & Applied Learning
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-3xl">
            AI Nexus is a comprehensive platform engineered to bridge the gap between academic theory and real-world AI systems engineering. From young explorers starting their first algorithms to engineers deploying neural networks, we build hands-on skills with real code, open-source models, and transparent assessments.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link href="/roadmap">
              <Button className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs h-10 px-5 rounded-xl gap-2 shadow-lg shadow-purple-900/30">
                <Compass className="w-4 h-4" />
                <span>Explore Learning Roadmap</span>
              </Button>
            </Link>
            <Link href="/courses">
              <Button variant="outline" className="border-border text-foreground text-xs h-10 px-5 rounded-xl gap-2">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span>View All Courses</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Operating Company Callout */}
        <Card className="p-6 bg-card border-border rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono font-bold">Operating Entity</span>
              <h2 className="text-base font-bold text-foreground">Managed by Manyathy Business Solutions</h2>
              <p className="text-xs text-muted-foreground">
                Headquartered in Bengaluru, Karnataka, India. Leading enterprise business technology, educational engineering, and quantitative computing initiatives.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="mailto:contact@manyathy.com"
              className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground border border-border rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-2"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </Card>

        {/* Pillars Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <span>Core Pillars of the Platform</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className="p-6 bg-card border-border rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Age-Adaptive Learning</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Step-by-step curriculums calibrated across 7 distinct academic tiers — from Young Explorer foundations to Undergraduate B.Tech and advanced research.
              </p>
            </Card>

            <Card className="p-6 bg-card border-border rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                <Code className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Production AI Codebases</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Hands-on projects covering Computer Vision, RAG architectures, LLM fine-tuning, and algorithmic pipelines with runnable code and verified outputs.
              </p>
            </Card>

            <Card className="p-6 bg-card border-border rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Verifiable Credentials</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Rigorous proctored assessments aligned with ISO/IEC 17024 and Open Badges 3.0 standards, complete with cryptographic verification hashes.
              </p>
            </Card>
          </div>
        </div>

        {/* Privacy & Standards Notice */}
        <div className="p-6 rounded-2xl bg-secondary/40 border border-border space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-foreground">Commitment to Data Privacy & Transparency</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            AI Nexus implements strict zero-data retention policies for on-device and sandbox AI inferences. When you run local models via our Ollama playground, all computation occurs entirely on your hardware. Learner code remains 100% student-owned intellectual property.
          </p>
          <div className="flex items-center gap-4 text-xs pt-1">
            <Link href="/privacy-policy" className="text-purple-400 hover:text-purple-300 font-semibold underline">
              View Privacy Policy
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/terms-and-conditions" className="text-purple-400 hover:text-purple-300 font-semibold underline">
              View Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </NexusShell>
  );
}
