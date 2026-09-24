import React from 'react';
import { Compass, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function CompactRoadmap() {
  const steps = [
    { id: 1, title: 'AI Foundations', status: 'completed' },
    { id: 2, title: 'Machine Learning Core', status: 'current' },
    { id: 3, title: 'Deep Learning', status: 'upcoming' },
    { id: 4, title: 'Generative AI', status: 'upcoming' },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-4.5 relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
            <Compass className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-foreground">Your Journey</h3>
        </div>
        <Link href="/roadmap" className="text-xs font-semibold text-emerald-500 hover:text-emerald-400 flex items-center gap-1 transition-colors">
          Full Roadmap
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-center relative">
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border rounded-full" />
        
        <div className="space-y-4">
          {steps.map((step, idx) => (
            <div key={step.id} className="relative flex items-start gap-4">
              <div className="relative z-10 flex-shrink-0 mt-0.5 bg-card">
                {step.status === 'completed' ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 bg-card" />
                ) : step.status === 'current' ? (
                  <div className="w-6 h-6 rounded-full border-2 border-emerald-500 flex items-center justify-center bg-card">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                ) : (
                  <Circle className="w-6 h-6 text-muted-foreground/30 bg-card" />
                )}
              </div>
              
              <div className="flex-col">
                <span className={`text-xs font-bold font-mono tracking-wider mb-0.5 block ${
                  step.status === 'completed' ? 'text-emerald-500/70' : 
                  step.status === 'current' ? 'text-emerald-500' : 'text-muted-foreground/50'
                }`}>
                  STAGE {step.id}
                </span>
                <span className={`text-sm font-semibold ${
                  step.status === 'completed' ? 'text-foreground' : 
                  step.status === 'current' ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
