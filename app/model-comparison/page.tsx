'use client';

import React, { useState, useMemo } from 'react';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Scale,
  Search,
  Zap,
  Brain,
  Code2,
  DollarSign,
  Layers,
  Sparkles,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  ChevronRight,
  HelpCircle,
  Shield,
  Eye,
  Sliders,
  ExternalLink,
  Flame,
  ArrowUpDown,
  Download,
  Info
} from 'lucide-react';
import Link from 'next/link';
import {
  AI_MODELS_DATABASE,
  AIModelSpec,
  MODEL_PURPOSE_RECOMMENDATIONS
} from '@/lib/ai/model-comparison-data';

export default function ModelComparisonPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLicense, setSelectedLicense] = useState<'All' | 'Free' | 'Paid'>('All');
  const [currencyMode, setCurrencyMode] = useState<'INR' | 'USD'>('INR');
  
  // Selected models for side-by-side comparison (up to 4)
  const [comparedModelIds, setComparedModelIds] = useState<string[]>([
    'openai-o1',
    'anthropic-claude-3-5-sonnet',
    'google-gemini-2-flash',
    'deepseek-r1'
  ]);
  
  // Active detail modal
  const [activeDetailModel, setActiveDetailModel] = useState<AIModelSpec | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Cost Calculator Parameters
  const [monthlyInputTokensM, setMonthlyInputTokensM] = useState<number>(10); // in Millions
  const [monthlyOutputTokensM, setMonthlyOutputTokensM] = useState<number>(3); // in Millions

  const handleCopyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleCompareModel = (id: string) => {
    if (comparedModelIds.includes(id)) {
      setComparedModelIds(comparedModelIds.filter((mId) => mId !== id));
    } else {
      if (comparedModelIds.length >= 4) {
        // replace oldest
        setComparedModelIds([...comparedModelIds.slice(1), id]);
      } else {
        setComparedModelIds([...comparedModelIds, id]);
      }
    }
  };

  // Filtered model list
  const filteredModels = useMemo(() => {
    return AI_MODELS_DATABASE.filter((model) => {
      const matchesSearch =
        !searchQuery ||
        model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.bestFor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || model.category === selectedCategory;

      const matchesLicense =
        selectedLicense === 'All' ||
        (selectedLicense === 'Free' && model.isFreeToHost) ||
        (selectedLicense === 'Paid' && !model.isFreeToHost);

      return matchesSearch && matchesCategory && matchesLicense;
    });
  }, [searchQuery, selectedCategory, selectedLicense]);

  // Compared models list
  const comparedModels = useMemo(() => {
    return comparedModelIds
      .map((id) => AI_MODELS_DATABASE.find((m) => m.id === id))
      .filter(Boolean) as AIModelSpec[];
  }, [comparedModelIds]);

  // Cost calculation helper
  const calculateCost = (model: AIModelSpec) => {
    const usdCost =
      model.inputPricePerMillionUSD * monthlyInputTokensM +
      model.outputPricePerMillionUSD * monthlyOutputTokensM;
    const inrCost = usdCost * 86; // approximate INR conversion
    return {
      usd: usdCost.toFixed(2),
      inr: inrCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })
    };
  };

  return (
    <NexusShell>
      <div className="space-y-8 max-w-7xl mx-auto pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/ai-overview" className="hover:text-foreground">AI Intelligence</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-purple-400 font-semibold">AI Models & Pricing Matrix</span>
        </div>

        {/* Hero Header */}
        <Card className="relative overflow-hidden rounded-3xl border-purple-500/20 bg-gradient-to-br from-purple-950/80 via-card to-indigo-950/40 p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                  <Scale className="w-3 h-3 text-purple-400" />
                  Nexus AI Model Intelligence
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Updated with o1, DeepSeek-R1, Gemini 2.0 & Claude 3.5
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                AI Models Benchmark, Purpose & Price Comparison Matrix
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Compare ChatGPT (o1, GPT-4o), Google Gemini, Anthropic Claude, DeepSeek, Meta Llama, and Mistral across pricing (₹ INR & $ USD), reasoning benchmarks, context limits, and purpose suitability.
              </p>
            </div>

            {/* Currency & Actions Toggle */}
            <div className="flex items-center gap-3 bg-secondary/80 p-2 rounded-2xl border border-border">
              <div className="text-xs font-semibold text-muted-foreground pl-2">Currency:</div>
              <div className="flex items-center bg-card rounded-xl p-1 border border-border">
                <button
                  onClick={() => setCurrencyMode('INR')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    currencyMode === 'INR'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  ₹ INR (Rupees)
                </button>
                <button
                  onClick={() => setCurrencyMode('USD')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    currencyMode === 'USD'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  $ USD (Dollars)
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* ══════════════════════════════════════════════════════════════════════
            SECTION 1: WHICH MODEL IS BEST FOR WHAT PURPOSE? (QUICK GUIDE)
           ══════════════════════════════════════════════════════════════════════ */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Which AI Model is Best for What Purpose?
              </h2>
              <p className="text-xs text-muted-foreground">
                Expert engineering recommendations based on verified benchmark data, latency, and cost effectiveness.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {MODEL_PURPOSE_RECOMMENDATIONS.map((rec) => (
              <Card
                key={rec.purpose}
                className="p-4 bg-card border-border hover:border-purple-500/40 transition-all rounded-2xl space-y-3 flex flex-col justify-between shadow-md"
              >
                <div className="space-y-2">
                  <div className="text-2xl">{rec.icon}</div>
                  <h3 className="text-xs font-extrabold text-foreground leading-snug">
                    {rec.purpose}
                  </h3>
                  <div className="px-2 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold">
                    {rec.topPick}
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {rec.why}
                  </p>
                </div>

                <div className="pt-2 border-t border-border space-y-1.5 text-[10px]">
                  <div className="text-emerald-400 font-semibold flex items-center justify-between">
                    <span>🆓 Best Free:</span>
                    <span className="font-mono">{rec.bestFreeChoice}</span>
                  </div>
                  <div className="text-purple-300 font-semibold flex items-center justify-between">
                    <span>💼 Top Paid:</span>
                    <span className="font-mono">{rec.bestCommercialChoice}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            SECTION 2: SIDE-BY-SIDE MODEL COMPARISON (UP TO 4 MODELS)
           ══════════════════════════════════════════════════════════════════════ */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Scale className="w-5 h-5 text-purple-400" />
                Live Side-by-Side Model Comparison ({comparedModels.length}/4 Selected)
              </h2>
              <p className="text-xs text-muted-foreground">
                Select any models below to pin and compare pricing, speed, context length, and capabilities.
              </p>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground font-semibold">Preset Compare:</span>
              <button
                onClick={() => setComparedModelIds(['openai-o1', 'deepseek-r1', 'google-gemini-2-flash', 'anthropic-claude-3-5-sonnet'])}
                className="px-2.5 py-1 text-[11px] font-bold bg-secondary hover:bg-purple-950/40 text-foreground rounded-lg border border-border cursor-pointer"
              >
                Top 4 Frontier
              </button>
              <button
                onClick={() => setComparedModelIds(['deepseek-r1', 'meta-llama-3-3-70b', 'alibaba-qwen-2-5-coder-32b', 'microsoft-phi-4'])}
                className="px-2.5 py-1 text-[11px] font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 rounded-lg border border-emerald-500/30 cursor-pointer"
              >
                100% Free / Open-Weights
              </button>
              <button
                onClick={() => setComparedModelIds(['anthropic-claude-3-5-sonnet', 'alibaba-qwen-2-5-coder-32b', 'openai-gpt4o', 'anthropic-claude-3-5-haiku'])}
                className="px-2.5 py-1 text-[11px] font-bold bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 rounded-lg border border-blue-500/30 cursor-pointer"
              >
                Coding Masters
              </button>
            </div>
          </div>

          {/* Comparison Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {comparedModels.map((model) => {
              const cost = calculateCost(model);
              return (
                <Card
                  key={model.id}
                  className="p-5 bg-card border-border rounded-3xl space-y-4 shadow-lg hover:border-purple-500/40 transition-all flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{model.creatorLogo}</span>
                        <div>
                          <h3 className="text-sm font-extrabold text-foreground">{model.name}</h3>
                          <span className="text-[11px] text-muted-foreground font-semibold">{model.creator}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleCompareModel(model.id)}
                        className="text-xs text-muted-foreground hover:text-red-400 p-1 cursor-pointer"
                        title="Remove from comparison"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Badge & Best For */}
                    <div className="space-y-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono uppercase ${
                        model.isFreeToHost
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      }`}>
                        {model.isFreeToHost ? '🆓 Free to Self-Host' : '💼 Commercial API'}
                      </span>
                      <p className="text-xs font-semibold text-purple-300 leading-snug line-clamp-2">
                        {model.bestFor}
                      </p>
                    </div>

                    {/* Pricing Box */}
                    <div className="p-3 bg-secondary/80 rounded-2xl border border-border space-y-1 font-mono text-xs">
                      <div className="text-[10px] text-muted-foreground font-sans font-bold">API Pricing (per 1M tokens):</div>
                      <div className="flex items-center justify-between text-foreground">
                        <span className="text-muted-foreground">Input:</span>
                        <span className="font-bold text-emerald-400">
                          {currencyMode === 'INR'
                            ? `₹${(model.inputPricePerMillionUSD * 86).toFixed(2)}`
                            : `$${model.inputPricePerMillionUSD.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-foreground">
                        <span className="text-muted-foreground">Output:</span>
                        <span className="font-bold text-purple-400">
                          {currencyMode === 'INR'
                            ? `₹${(model.outputPricePerMillionUSD * 86).toFixed(2)}`
                            : `$${model.outputPricePerMillionUSD.toFixed(2)}`}
                        </span>
                      </div>
                      {model.isFreeToHost && (
                        <div className="text-[9px] text-emerald-400 font-semibold pt-1 border-t border-border/50">
                          ⚡ 100% Free $0 via Ollama / vLLM
                        </div>
                      )}
                    </div>

                    {/* Specifications Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="p-2 bg-secondary/50 rounded-xl border border-border/60">
                        <span className="text-[10px] text-muted-foreground font-sans block">Context Window</span>
                        <span className="font-bold text-foreground">{model.contextWindowDisplay}</span>
                      </div>
                      <div className="p-2 bg-secondary/50 rounded-xl border border-border/60">
                        <span className="text-[10px] text-muted-foreground font-sans block">Coding Score</span>
                        <span className="font-bold text-amber-400">{model.humanEvalCodingScore}%</span>
                      </div>
                      <div className="p-2 bg-secondary/50 rounded-xl border border-border/60">
                        <span className="text-[10px] text-muted-foreground font-sans block">Reasoning Math</span>
                        <span className="font-bold text-cyan-400">{model.mathScore}%</span>
                      </div>
                      <div className="p-2 bg-secondary/50 rounded-xl border border-border/60">
                        <span className="text-[10px] text-muted-foreground font-sans block">Arena ELO</span>
                        <span className="font-bold text-purple-400">{model.arenaElo}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Estimated Cost */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-muted-foreground">Est. Monthly Cost:</span>
                      <span className="font-bold text-foreground">
                        {currencyMode === 'INR' ? `₹${cost.inr}` : `$${cost.usd}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setActiveDetailModel(model)}
                        className="w-full text-xs h-8 rounded-xl border-border hover:bg-secondary cursor-pointer"
                      >
                        View Full Specs
                      </Button>
                      {model.ollamaCommand && (
                        <Button
                          variant="ghost"
                          onClick={() => handleCopyCode(model.id, model.ollamaCommand!)}
                          className="h-8 px-2.5 rounded-xl border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 cursor-pointer"
                          title="Copy Ollama CLI command"
                        >
                          {copiedId === model.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Monthly Cost Estimator Slider */}
          <Card className="p-5 bg-card border-border rounded-2xl shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Interactive Monthly Token Cost Estimator
                </h3>
                <p className="text-xs text-muted-foreground">
                  Adjust your expected monthly token usage to calculate operational API costs across the selected models.
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-muted-foreground">
                  Total Monthly Volume: <strong>{(monthlyInputTokensM + monthlyOutputTokensM).toFixed(1)}M Tokens</strong>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {/* Input Tokens Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-muted-foreground">Prompt / Input Tokens:</span>
                  <span className="font-mono font-bold text-purple-400">{monthlyInputTokensM} Million Tokens / mo</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={monthlyInputTokensM}
                  onChange={(e) => setMonthlyInputTokensM(Number(e.target.value))}
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                  <span>1M (Small Project)</span>
                  <span>50M (Medium RAG)</span>
                  <span>100M (Enterprise)</span>
                </div>
              </div>

              {/* Output Tokens Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-muted-foreground">Generated / Output Tokens:</span>
                  <span className="font-mono font-bold text-emerald-400">{monthlyOutputTokensM} Million Tokens / mo</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={monthlyOutputTokensM}
                  onChange={(e) => setMonthlyOutputTokensM(Number(e.target.value))}
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                  <span>1M (Concise)</span>
                  <span>25M (Code Synthesis)</span>
                  <span>50M (High Volume)</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            SECTION 3: COMPLETE AI MODEL BENCHMARK & PRICING TABLE
           ══════════════════════════════════════════════════════════════════════ */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                Comprehensive Model Catalog ({filteredModels.length} Models)
              </h2>
              <p className="text-xs text-muted-foreground">
                Filter and inspect all major frontier and open-weight models with direct pricing in Rupees (₹) and Dollars ($).
              </p>
            </div>
          </div>

          {/* Filters and Search Bar */}
          <Card className="p-4 bg-card border-border rounded-2xl space-y-3 shadow-md">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {/* Search */}
              <div className="relative sm:col-span-2">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search model by name, creator, or specialty (e.g. o1, DeepSeek, Claude, Llama, math)..."
                  className="pl-9 bg-secondary border-border text-foreground text-xs h-9 rounded-xl"
                />
              </div>

              {/* Category */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-secondary border border-border text-foreground text-xs h-9 rounded-xl px-3 font-medium"
                >
                  <option value="All">All Categories</option>
                  <option value="Reasoning & Math">🧠 Reasoning & Math</option>
                  <option value="General Frontier">⚡ General Frontier</option>
                  <option value="Coding Specialist">💻 Coding Specialist</option>
                  <option value="Fast & Cost-Efficient">🚀 Fast & Low Cost</option>
                  <option value="Edge & On-Device">📱 Edge & On-Device</option>
                </select>
              </div>

              {/* License Type */}
              <div>
                <select
                  value={selectedLicense}
                  onChange={(e) => setSelectedLicense(e.target.value as any)}
                  className="w-full bg-secondary border border-border text-foreground text-xs h-9 rounded-xl px-3 font-medium"
                >
                  <option value="All">All Licenses</option>
                  <option value="Free">🆓 100% Free / Open Weights</option>
                  <option value="Paid">💼 Commercial Paid API</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Model Table */}
          <div className="overflow-x-auto rounded-3xl border border-border bg-card shadow-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-secondary/80 text-muted-foreground font-semibold">
                  <th className="p-3.5 pl-4">Compare</th>
                  <th className="p-3.5">Model & Provider</th>
                  <th className="p-3.5">License & Free Tier</th>
                  <th className="p-3.5">Input Price (1M)</th>
                  <th className="p-3.5">Output Price (1M)</th>
                  <th className="p-3.5">Context</th>
                  <th className="p-3.5">Coding (HumanEval)</th>
                  <th className="p-3.5">Math Score</th>
                  <th className="p-3.5">Best For Purpose</th>
                  <th className="p-3.5 pr-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredModels.map((model) => {
                  const isCompared = comparedModelIds.includes(model.id);
                  return (
                    <tr
                      key={model.id}
                      className="hover:bg-secondary/40 transition-colors group"
                    >
                      {/* Checkbox */}
                      <td className="p-3.5 pl-4">
                        <input
                          type="checkbox"
                          checked={isCompared}
                          onChange={() => toggleCompareModel(model.id)}
                          className="rounded border-border text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer"
                        />
                      </td>

                      {/* Name & Creator */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{model.creatorLogo}</span>
                          <div>
                            <span className="font-extrabold text-foreground block group-hover:text-purple-300 transition-colors">
                              {model.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">{model.creator}</span>
                          </div>
                        </div>
                      </td>

                      {/* License */}
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                          model.isFreeToHost
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        }`}>
                          {model.isFreeToHost ? '🆓 Free Open Weights' : '💼 Commercial'}
                        </span>
                      </td>

                      {/* Input Price */}
                      <td className="p-3.5 font-mono">
                        <span className="font-bold text-emerald-400 block">
                          {currencyMode === 'INR'
                            ? `₹${(model.inputPricePerMillionUSD * 86).toFixed(2)}`
                            : `$${model.inputPricePerMillionUSD.toFixed(2)}`}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {currencyMode === 'INR'
                            ? `($${model.inputPricePerMillionUSD.toFixed(2)} USD)`
                            : `(₹${(model.inputPricePerMillionUSD * 86).toFixed(2)} INR)`}
                        </span>
                      </td>

                      {/* Output Price */}
                      <td className="p-3.5 font-mono">
                        <span className="font-bold text-purple-400 block">
                          {currencyMode === 'INR'
                            ? `₹${(model.outputPricePerMillionUSD * 86).toFixed(2)}`
                            : `$${model.outputPricePerMillionUSD.toFixed(2)}`}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {currencyMode === 'INR'
                            ? `($${model.outputPricePerMillionUSD.toFixed(2)} USD)`
                            : `(₹${(model.outputPricePerMillionUSD * 86).toFixed(2)} INR)`}
                        </span>
                      </td>

                      {/* Context */}
                      <td className="p-3.5 font-mono font-bold text-foreground">
                        {model.contextWindowDisplay}
                      </td>

                      {/* Coding */}
                      <td className="p-3.5 font-mono font-bold text-amber-400">
                        {model.humanEvalCodingScore}%
                      </td>

                      {/* Math */}
                      <td className="p-3.5 font-mono font-bold text-cyan-400">
                        {model.mathScore}%
                      </td>

                      {/* Best For */}
                      <td className="p-3.5 max-w-xs">
                        <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                          {model.bestFor}
                        </p>
                      </td>

                      {/* Details CTA */}
                      <td className="p-3.5 pr-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveDetailModel(model)}
                          className="h-7 text-[11px] px-2.5 rounded-lg border-border hover:bg-secondary cursor-pointer"
                        >
                          Specs
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            MODAL: DETAILED MODEL SPECIFICATION & CODE SNIPPET
           ══════════════════════════════════════════════════════════════════════ */}
        {activeDetailModel && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="max-w-3xl w-full bg-card border-border rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in duration-200">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{activeDetailModel.creatorLogo}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-extrabold text-foreground">{activeDetailModel.name}</h2>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                        activeDetailModel.isFreeToHost
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      }`}>
                        {activeDetailModel.isFreeToHost ? '🆓 Free Self-Hosted' : '💼 Commercial API'}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground font-semibold">
                      Created by {activeDetailModel.creator} • License: {activeDetailModel.licenseType}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveDetailModel(null)}
                  className="text-muted-foreground hover:text-foreground text-sm p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Description & Purpose */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400">Overview & Capabilities</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {activeDetailModel.description}
                </p>
                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-xs text-purple-200 font-semibold">
                  🎯 <strong>Best For:</strong> {activeDetailModel.bestFor}
                </div>
              </div>

              {/* Specs & Pricing Dual Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pricing Box */}
                <div className="p-4 bg-secondary rounded-2xl border border-border space-y-2 text-xs font-mono">
                  <span className="font-bold text-foreground font-sans block">Pricing Breakdown:</span>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Input (1M tokens):</span>
                    <span className="font-bold text-emerald-400">
                      ₹{(activeDetailModel.inputPricePerMillionUSD * 86).toFixed(2)} (${activeDetailModel.inputPricePerMillionUSD.toFixed(2)})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Output (1M tokens):</span>
                    <span className="font-bold text-purple-400">
                      ₹{(activeDetailModel.outputPricePerMillionUSD * 86).toFixed(2)} (${activeDetailModel.outputPricePerMillionUSD.toFixed(2)})
                    </span>
                  </div>
                  {activeDetailModel.cachedInputPriceUSD !== undefined && (
                    <div className="flex justify-between text-cyan-400">
                      <span className="text-muted-foreground">Cached Input (1M):</span>
                      <span>₹{(activeDetailModel.cachedInputPriceUSD * 86).toFixed(2)} (${activeDetailModel.cachedInputPriceUSD.toFixed(3)})</span>
                    </div>
                  )}
                </div>

                {/* Technical Specs */}
                <div className="p-4 bg-secondary rounded-2xl border border-border space-y-2 text-xs font-mono">
                  <span className="font-bold text-foreground font-sans block">Technical Limits:</span>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Context Window:</span>
                    <span className="font-bold text-foreground">{activeDetailModel.contextWindowDisplay} tokens</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Output:</span>
                    <span className="font-bold text-foreground">{activeDetailModel.maxOutputDisplay} tokens</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vision / Audio:</span>
                    <span className="font-bold text-foreground">
                      {activeDetailModel.supportsVision ? '✅ Vision' : '❌ Text Only'} • {activeDetailModel.supportsAudio ? '✅ Audio' : '❌ No Audio'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ideal Use Cases & Limitations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5 p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20">
                  <span className="font-bold text-emerald-300 block">✨ Recommended Use Cases:</span>
                  <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                    {activeDetailModel.idealUseCases.map((useCase, idx) => (
                      <li key={idx}>{useCase}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1.5 p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20">
                  <span className="font-bold text-amber-300 block">⚠️ Limitations to Consider:</span>
                  <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                    {activeDetailModel.limitations.map((lim, idx) => (
                      <li key={idx}>{lim}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Code Integration Snippet */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground font-mono">
                    {activeDetailModel.ollamaCommand ? 'Local CLI / API Integration:' : 'TypeScript / API Code Snippet:'}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyCode('modal-code', activeDetailModel.apiSampleSnippet)}
                    className="h-7 text-xs gap-1 text-purple-400 hover:bg-purple-500/10 cursor-pointer"
                  >
                    {copiedId === 'modal-code' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === 'modal-code' ? 'Copied' : 'Copy Snippet'}</span>
                  </Button>
                </div>
                <pre className="p-4 bg-secondary/90 rounded-2xl border border-border text-xs font-mono overflow-x-auto text-emerald-300">
                  <code>{activeDetailModel.apiSampleSnippet}</code>
                </pre>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Button
                  onClick={() => setActiveDetailModel(null)}
                  className="bg-purple-600 hover:bg-purple-500 text-white text-xs px-6 py-2 rounded-xl cursor-pointer"
                >
                  Close Specification
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </NexusShell>
  );
}
