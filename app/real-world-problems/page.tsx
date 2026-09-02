'use client';

import React, { useState } from 'react';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Plus, Search, ChevronRight, MessageSquare, ThumbsUp, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function RealWorldProblemsPage() {
  const [selectedDomain, setSelectedDomain] = useState('All');

  const problems = [
    {
      id: 'prob-1',
      title: 'Wildfire Early Detection via Satellite Infrared & IoT Sensors',
      domain: 'Climate & Environment',
      difficulty: 'Hard',
      impact: 'Critical',
      upvotes: 342,
      solutionsCount: 18,
      desc: 'Detect early-stage forest fire hotspots within 60 seconds of ignition using low-earth orbit thermal imagery and ground-level environmental sensors.',
      suggestedTech: ['Vision Transformer (ViT)', 'Multimodal Sensor Fusion', 'Edge AI Deployment'],
    },
    {
      id: 'prob-2',
      title: 'Rare Disease Genomic Variant Effect Prediction',
      domain: 'Genomics & Biotech',
      difficulty: 'Expert',
      impact: 'High',
      upvotes: 215,
      solutionsCount: 12,
      desc: 'Classify unannotated single-nucleotide variants (SNVs) to predict pathogenicity in rare pediatric genetic disorders.',
      suggestedTech: ['DNA Foundation Models', 'Evo 1.5', '3D Protein Structure Alignment'],
    },
    {
      id: 'prob-3',
      title: 'Grid Load Balancing with Distributed Renewable Energy',
      domain: 'Clean Energy & Smart Grids',
      difficulty: 'Medium',
      impact: 'High',
      upvotes: 189,
      solutionsCount: 24,
      desc: 'Predict local solar & wind generation fluctuations to balance regional electrical grid distribution and prevent blackouts.',
      suggestedTech: ['Reinforcement Learning (PPO)', 'LSTM Time Series', 'Graph Neural Networks'],
    },
  ];

  return (
    <NexusShell>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-purple-400 font-semibold">Real-world Problems</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Real-world AI Problems</h1>
              <AlertCircle className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Collaborate on urgent global challenges, propose AI solutions, access open datasets, and build impactful models.
            </p>
          </div>

          <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-4 py-2 h-9 rounded-xl gap-1.5 shadow-sm shadow-purple-900/30">
            <Plus className="w-4 h-4" /> Submit Problem
          </Button>
        </div>

        {/* Problems List */}
        <div className="space-y-4">
          {problems.map((p) => (
            <Card key={p.id} className="p-6 bg-card border-border rounded-2xl space-y-4 hover:border-purple-500/40 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-400 font-mono text-xs font-bold rounded-lg border border-purple-500/30">
                    {p.domain}
                  </span>
                  <h3 className="text-base font-bold text-foreground">{p.title}</h3>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 bg-rose-500/15 text-rose-400 font-bold rounded text-[11px]">
                    Impact: {p.impact}
                  </span>
                  <span className="px-2 py-0.5 bg-secondary border border-border text-foreground font-bold rounded text-[11px]">
                    {p.difficulty}
                  </span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-bold text-foreground">Recommended Tech:</span>
                  {p.suggestedTech.map((tech) => (
                    <span key={tech} className="px-2 py-0.5 bg-secondary text-foreground text-[10px] font-mono rounded border border-border">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <button className="flex items-center gap-1 text-muted-foreground hover:text-purple-400 font-semibold">
                    <ThumbsUp className="w-3.5 h-3.5" /> {p.upvotes}
                  </button>
                  <button className="flex items-center gap-1 text-muted-foreground hover:text-purple-400 font-semibold">
                    <MessageSquare className="w-3.5 h-3.5" /> {p.solutionsCount} Solutions
                  </button>
                  <Button variant="outline" className="bg-secondary border-border text-foreground text-xs h-8 px-3 rounded-xl gap-1">
                    <span>Propose Solution</span>
                    <ArrowRight className="w-3 h-3 text-purple-400" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </NexusShell>
  );
}
