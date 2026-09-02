'use client';

import React from 'react';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { WeightsEncodingSimulator } from '@/components/learning/weights-encoding-simulator';
import { ChevronRight, Cpu, Layers, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function WeightsAndEncodingPage() {
  return (
    <NexusShell>
      <div className="space-y-6 max-w-[1600px] mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/ai-architecture" className="hover:text-foreground">AI Architecture</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-purple-400 font-semibold">Weights, Biases & Encoding Simulator</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Deep Learning Math: Weights, Biases & Encoding Demo
              </h1>
              <Cpu className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Interactive visualization of forward pass neuron calculations, calculus backpropagation gradient updates, and data/text vector encoding.
            </p>
          </div>

          <Link href="/roadmap">
            <button className="px-4 py-2 bg-secondary border border-border text-foreground hover:bg-secondary/80 rounded-xl text-xs font-bold transition-all flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              View Full AI Roadmap
            </button>
          </Link>
        </div>

        {/* Interactive Simulator Component */}
        <WeightsEncodingSimulator />
      </div>
    </NexusShell>
  );
}
