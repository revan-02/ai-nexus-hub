'use client';

import React, { useState } from 'react';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { Card } from '@/components/ui/card';
import { Briefcase, Search, ChevronRight, Activity, DollarSign, GraduationCap, ShoppingBag, ShieldAlert, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function UseCasesPage() {
  const [selectedIndustry, setSelectedIndustry] = useState('All');

  const industries = ['All', 'Healthcare', 'Finance', 'Education', 'Retail', 'Transportation', 'Smart Cities', 'Security'];

  const useCases = [
    {
      id: 1,
      title: 'Automated Early Oncology Detection in Medical Radiology',
      industry: 'Healthcare',
      problem: 'Radiologists encounter high scan volumes resulting in potential early-stage diagnostic oversights.',
      data: '3D DICOM CT Scans, Anonymized Patient EHR Records',
      technique: 'Computer Vision & 3D Segmentation',
      model: '3D UNet + Vision Transformer (ViT)',
      impact: '98.4% Diagnostic Sensitivity, 4x Faster Scan Triage',
      metrics: 'ROC-AUC: 0.992, F1-Score: 0.978',
    },
    {
      id: 2,
      title: 'Real-time High-Frequency Algorithmic Fraud Detection',
      industry: 'Finance',
      problem: 'Credit card transaction fraud costs global financial institutions billions annually.',
      data: 'Streaming Transaction Logs, Device Footprints, IP BGP Data',
      technique: 'Graph Neural Networks & Anomaly Detection',
      model: 'Heterogeneous GNN + XGBoost Ensemble',
      impact: 'Identifies 99.1% of fraudulent transactions under 15ms latency.',
      metrics: 'Precision: 99.4%, Recall: 98.9%',
    },
    {
      id: 3,
      title: 'Personalized Adaptive AI Tutor & Learning Coach',
      industry: 'Education',
      problem: 'Standardized classroom curriculums fail to cater to varied student learning paces.',
      data: 'Student Assessment Logs, Time-on-Task, Interaction Streams',
      technique: 'Retrieval Augmented Generation & Knowledge Tracing',
      model: 'Fine-Tuned LLaMA-3 + Deep Knowledge Tracing (DKT)',
      impact: '35% Higher Test Score Improvements across K-12 STEM subjects.',
      metrics: 'Mastery Rate: +42%, Student Engagement: +58%',
    },
    {
      id: 4,
      title: 'Autonomous Demand Forecasting & Inventory Optimization',
      industry: 'Retail',
      problem: 'Overstocking and stockouts create inventory waste and supply chain inefficiency.',
      data: 'POS Terminal Sales Data, Weather Patterns, Regional Events',
      technique: 'Time Series Forecasting & Deep Learning',
      model: 'Temporal Fusion Transformer (TFT)',
      impact: 'Reduces inventory holding costs by 28% while eliminating stockouts.',
      metrics: 'MAPE: 3.2%, Inventory Turnover: +3.5x',
    },
  ];

  const filtered = useCases.filter((uc) =>
    selectedIndustry === 'All' ? true : uc.industry === selectedIndustry
  );

  return (
    <NexusShell>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-purple-400 font-semibold">Use Cases</span>
        </div>

        {/* Header */}
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Industry AI Use Cases</h1>
            <Briefcase className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real-world enterprise deployments mapping problem statements to AI techniques, models, metrics, and measurable impact.
          </p>
        </div>

        {/* Industry Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none border-b border-border pb-3">
          {industries.map((ind) => (
            <button
              key={ind}
              onClick={() => setSelectedIndustry(ind)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                selectedIndustry === ind
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-900/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>

        {/* Use Cases Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((uc) => (
            <Card key={uc.id} className="p-6 bg-card border-border rounded-2xl space-y-4 hover:border-purple-500/40 transition-all">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-400 text-xs font-bold rounded-lg font-mono">
                  {uc.industry}
                </span>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">{uc.metrics}</span>
              </div>

              <h3 className="text-base font-bold text-foreground leading-snug">{uc.title}</h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-bold text-foreground block">Problem Statement:</span>
                  <p className="text-muted-foreground mt-0.5 leading-relaxed">{uc.problem}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2.5 bg-secondary/50 rounded-xl border border-border">
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block">Technique</span>
                    <span className="font-bold text-purple-400 mt-0.5 block">{uc.technique}</span>
                  </div>

                  <div className="p-2.5 bg-secondary/50 rounded-xl border border-border">
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block">Architecture / Model</span>
                    <span className="font-bold text-foreground mt-0.5 block truncate">{uc.model}</span>
                  </div>
                </div>

                <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">Measured Business Impact</span>
                  <span className="font-bold text-foreground block mt-0.5">{uc.impact}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </NexusShell>
  );
}
