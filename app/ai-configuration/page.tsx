'use client';

import React, { useState, Suspense } from 'react';
import { AdminShell } from '@/components/layout/admin-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sliders,
  ChevronRight,
  Brain,
  ShieldCheck,
  Zap,
  Key,
  Database,
  Lock,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

function AIConfigurationPageInner() {
  const [temperature, setTemperature] = useState('0.7');
  const [maxTokens, setMaxTokens] = useState('4096');
  const [topP, setTopP] = useState('0.95');
  const [safetyFilter, setSafetyFilter] = useState('Strict');
  const [fallbackModel, setFallbackModel] = useState('gpt-4o');

  return (
    <div className="space-y-6 max-w-[1800px] mx-auto pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
        <Link href="/" className="hover:text-zinc-200 transition-colors">Dashboard</Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span>AI Control Center</span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span className="text-purple-400 font-semibold">AI Configuration</span>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">AI Engine Configuration</h1>
          <Sliders className="w-6 h-6 text-purple-400" />
        </div>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Configure default inference hyper-parameters, safety filters, fallback routing and API keys.
        </p>
      </div>

      {/* Main Settings Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <Card className="lg:col-span-8 bg-[#121217] border border-[#272730] p-6 rounded-2xl shadow-sm space-y-6 text-xs">
          <h2 className="text-base font-bold text-white">Default Inference Parameters</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-300 font-medium mb-1.5">Default Temperature ({temperature})</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                className="w-full accent-purple-500 bg-[#181820]"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">Controls randomness (0 = deterministic, 1 = creative).</span>
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1.5">Max Tokens Output</label>
              <Input
                value={maxTokens}
                onChange={(e) => setMaxTokens(e.target.value)}
                className="bg-[#181820] border-[#272730] text-zinc-100 text-xs h-9"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1.5">Top-P Sampling ({topP})</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={topP}
                onChange={(e) => setTopP(e.target.value)}
                className="w-full accent-purple-500 bg-[#181820]"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1.5">Fallback Routing Model</label>
              <select
                value={fallbackModel}
                onChange={(e) => setFallbackModel(e.target.value)}
                className="w-full h-9 px-3 bg-[#181820] border border-[#272730] rounded-md text-xs text-zinc-200 focus:outline-none"
              >
                <option value="gpt-4o">GPT-4o Omnimodal</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-[#23232b] flex justify-end gap-3">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-5 py-2 h-9 rounded-xl shadow-sm shadow-purple-900/30">
              Save AI Settings
            </Button>
          </div>
        </Card>

        {/* Right Info Panels */}
        <Card className="lg:col-span-4 bg-[#121217] border border-[#272730] p-5 rounded-2xl shadow-sm space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white">Active API Keys</h3>
          <div className="p-3 bg-[#181820] border border-[#272730] rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-purple-400" />
              <div>
                <span className="font-bold text-zinc-200 block">Google Vertex AI</span>
                <span className="text-[10px] text-zinc-500 font-mono">sk-vertex-••••••••9842</span>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded">Active</span>
          </div>

          <div className="p-3 bg-[#181820] border border-[#272730] rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-400" />
              <div>
                <span className="font-bold text-zinc-200 block">OpenAI API Key</span>
                <span className="text-[10px] text-zinc-500 font-mono">sk-proj-••••••••1420</span>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded">Active</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function AIConfigurationPage() {
  return (
    <AdminShell>
      <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Loading AI configuration...</div>}>
        <AIConfigurationPageInner />
      </Suspense>
    </AdminShell>
  );
}
