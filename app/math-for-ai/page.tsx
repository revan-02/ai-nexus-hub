'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Brain,
  Zap,
  Activity,
  Grid3X3,
  PieChart,
  TrendingDown,
  Sparkles,
  Sliders,
  Play,
  RotateCcw,
  Copy,
  CheckCircle2,
  ChevronRight,
  Code,
  BookOpen,
  ArrowRight,
  Search,
  Award,
  Layers,
  HelpCircle
} from 'lucide-react';
import {
  MATH_CATEGORIES,
  MATH_FORMULAS,
  MathCategory,
  MathFormulaItem
} from '@/lib/ai/math-foundations-data';
import katex from 'katex';

export default function MathForAIPage() {
  const [selectedCategory, setSelectedCategory] = useState<MathCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('All Levels');
  const [copiedFormulaId, setCopiedFormulaId] = useState<string | null>(null);
  const [activeSandboxTab, setActiveSandboxTab] = useState<'vectors' | 'gradient-descent' | 'activations' | 'cross-entropy'>('vectors');

  // ── 1. VECTOR SIMULATOR STATE ──
  const [vecU, setVecU] = useState<{ x: number; y: number }>({ x: 3, y: 4 });
  const [vecV, setVecV] = useState<{ x: number; y: number }>({ x: 4, y: 1 });

  const vectorMetrics = useMemo(() => {
    const dot = vecU.x * vecV.x + vecU.y * vecV.y;
    const magU = Math.sqrt(vecU.x ** 2 + vecU.y ** 2);
    const magV = Math.sqrt(vecV.x ** 2 + vecV.y ** 2);
    const cosSim = magU * magV > 0 ? dot / (magU * magV) : 0;
    const clampedCos = Math.max(-1, Math.min(1, cosSim));
    const angleRad = Math.acos(clampedCos);
    const angleDeg = (angleRad * 180) / Math.PI;
    return {
      dot: dot.toFixed(2),
      magU: magU.toFixed(2),
      magV: magV.toFixed(2),
      cosSim: cosSim.toFixed(4),
      angleDeg: angleDeg.toFixed(1),
    };
  }, [vecU, vecV]);

  // ── 2. GRADIENT DESCENT SIMULATOR STATE ──
  // Function: f(x) = x^2, df/dx = 2x
  const [gdX, setGdX] = useState<number>(4.0);
  const [gdLr, setGdLr] = useState<number>(0.2);
  const [gdSteps, setGdSteps] = useState<number[]>([]);

  const handleGdStep = () => {
    const currentX = gdSteps.length > 0 ? gdSteps[gdSteps.length - 1] : gdX;
    const grad = 2 * currentX; // derivative
    const nextX = currentX - gdLr * grad;
    setGdSteps([...gdSteps, nextX]);
  };

  const handleGdReset = () => {
    setGdSteps([]);
  };

  // ── 3. ACTIVATION FUNCTION STATE ──
  const [actX, setActX] = useState<number>(1.5);
  const [selectedActivation, setSelectedActivation] = useState<'sigmoid' | 'relu' | 'gelu' | 'tanh'>('sigmoid');

  const activationOutput = useMemo(() => {
    const x = actX;
    let y = 0;
    let formulaStr = '';
    let derivStr = '';
    if (selectedActivation === 'sigmoid') {
      y = 1 / (1 + Math.exp(-x));
      formulaStr = '\\sigma(x) = \\frac{1}{1 + e^{-x}}';
      derivStr = "\\sigma'(x) = \\sigma(x)(1 - \\sigma(x))";
    } else if (selectedActivation === 'relu') {
      y = Math.max(0, x);
      formulaStr = '\\text{ReLU}(x) = \\max(0, x)';
      derivStr = "\\text{ReLU}'(x) = 1 \\text{ if } x > 0 \\text{ else } 0";
    } else if (selectedActivation === 'gelu') {
      y = 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * Math.pow(x, 3))));
      formulaStr = '\\text{GELU}(x) = x \\cdot \\Phi(x) \\approx 0.5x(1 + \\tanh(\\sqrt{2/\\pi}(x + 0.044715x^3)))';
      derivStr = "\\text{Smooth non-monotonic curvature across zero}";
    } else {
      y = Math.tanh(x);
      formulaStr = '\\tanh(x) = \\frac{e^x - e^{-x}}{e^x + e^{-x}}';
      derivStr = "\\tanh'(x) = 1 - \\tanh^2(x)";
    }
    return { y: y.toFixed(4), formulaStr, derivStr };
  }, [actX, selectedActivation]);

  // ── 4. CROSS-ENTROPY LOSS STATE ──
  const [cePredProb, setCePredProb] = useState<number>(0.85);
  const ceLoss = useMemo(() => {
    const eps = 1e-7;
    const p = Math.max(eps, Math.min(1 - eps, cePredProb));
    return (-Math.log(p)).toFixed(4);
  }, [cePredProb]);

  // Filter formulas
  const filteredFormulas = useMemo(() => {
    return MATH_FORMULAS.filter((f) => {
      const matchCat = selectedCategory === 'all' || f.category === selectedCategory;
      const matchLevel = selectedLevel === 'All Levels' || f.level === selectedLevel;
      const matchSearch =
        searchQuery.trim() === '' ||
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.plainDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.whereUsedInAI.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchLevel && matchSearch;
    });
  }, [selectedCategory, selectedLevel, searchQuery]);

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedFormulaId(id);
    setTimeout(() => setCopiedFormulaId(null), 3000);
  };

  const renderKatex = (latex: string) => {
    try {
      const html = katex.renderToString(latex, { throwOnError: false, displayMode: true });
      return <div dangerouslySetInnerHTML={{ __html: html }} className="overflow-x-auto py-2 text-foreground" />;
    } catch {
      return <code className="font-mono text-xs text-purple-300">{latex}</code>;
    }
  };

  return (
    <NexusShell>
      <div className="space-y-8 pb-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/courses" className="hover:text-foreground">Academic Tracks</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-purple-400 font-semibold">Math for AI, ML & Deep Learning</span>
        </div>

        {/* Hero Section */}
        <div className="relative p-8 rounded-3xl bg-gradient-to-r from-purple-950/70 via-indigo-950/50 to-zinc-900 border border-purple-500/30 overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Foundational to PhD Frontier Mathematical Mastery</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
              Mathematics for AI, Machine Learning & Deep Learning
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Master the foundational 4 pillars of modern artificial intelligence: <strong>Linear Algebra</strong>, <strong>Multivariable Calculus</strong>, <strong>Probability Theory</strong>, and <strong>Optimization</strong> with interactive visual sandboxes, rigorous LaTeX equations, and pure Python/PyTorch implementations.
            </p>

            <div className="flex items-center gap-4 pt-2 flex-wrap text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Grid3X3 className="w-4 h-4 text-purple-400" />
                <span>4 Core Pillars</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>4 Interactive Sandboxes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Code className="w-4 h-4 text-blue-400" />
                <span>NumPy & PyTorch Verified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Aligned with VTU & Top CS Curriculums</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 4 INTERACTIVE MATHEMATICAL SANDBOXES ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                Interactive Visual Math Laboratory
              </h2>
              <p className="text-xs text-muted-foreground">Adjust hyper-parameters and observe mathematical transformations in real time.</p>
            </div>

            {/* Sandbox Switcher Tabs */}
            <div className="flex items-center gap-1 p-1 bg-secondary border border-border rounded-xl overflow-x-auto scrollbar-none max-w-full">
              {[
                { id: 'vectors' as const, label: 'Vectors & Angles', icon: Grid3X3 },
                { id: 'gradient-descent' as const, label: 'Gradient Descent', icon: TrendingDown },
                { id: 'activations' as const, label: 'Activation Curves', icon: Zap },
                { id: 'cross-entropy' as const, label: 'Cross-Entropy Loss', icon: PieChart },
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeSandboxTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveSandboxTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                      isSelected ? 'bg-purple-600 text-white shadow-md' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SANDBOX 1: VECTOR DOT PRODUCT & ANGLE */}
          {activeSandboxTab === 'vectors' && (
            <Card className="p-6 bg-card border-purple-500/30 rounded-3xl shadow-xl space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/20 text-purple-300 font-mono">
                      LINEAR ALGEBRA SIMULATOR
                    </span>
                    <h3 className="text-base font-bold text-foreground">Vector Dot Product & Cosine Similarity</h3>
                    <p className="text-xs text-muted-foreground">
                      Change the 2D coordinates of vector <strong>u</strong> and vector <strong>v</strong> to see how cosine similarity and angular distance vary in embedding space.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-secondary/40 border border-border rounded-xl space-y-2">
                      <span className="font-bold text-purple-400">Vector u = [{vecU.x}, {vecU.y}]</span>
                      <div>
                        <label className="text-[11px] text-muted-foreground block">u_x: {vecU.x}</label>
                        <input
                          type="range"
                          min="-5"
                          max="5"
                          step="0.5"
                          value={vecU.x}
                          onChange={(e) => setVecU({ ...vecU, x: parseFloat(e.target.value) })}
                          className="w-full accent-purple-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-muted-foreground block">u_y: {vecU.y}</label>
                        <input
                          type="range"
                          min="-5"
                          max="5"
                          step="0.5"
                          value={vecU.y}
                          onChange={(e) => setVecU({ ...vecU, y: parseFloat(e.target.value) })}
                          className="w-full accent-purple-500"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-secondary/40 border border-border rounded-xl space-y-2">
                      <span className="font-bold text-blue-400">Vector v = [{vecV.x}, {vecV.y}]</span>
                      <div>
                        <label className="text-[11px] text-muted-foreground block">v_x: {vecV.x}</label>
                        <input
                          type="range"
                          min="-5"
                          max="5"
                          step="0.5"
                          value={vecV.x}
                          onChange={(e) => setVecV({ ...vecV, x: parseFloat(e.target.value) })}
                          className="w-full accent-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-muted-foreground block">v_y: {vecV.y}</label>
                        <input
                          type="range"
                          min="-5"
                          max="5"
                          step="0.5"
                          value={vecV.y}
                          onChange={(e) => setVecV({ ...vecV, y: parseFloat(e.target.value) })}
                          className="w-full accent-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real-time Math Output Card */}
                <div className="p-5 bg-secondary/30 border border-border rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Calculated Metrics</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-card rounded-xl border border-border">
                      <span className="text-[11px] text-muted-foreground block">Dot Product (u · v)</span>
                      <span className="text-lg font-mono font-bold text-purple-400">{vectorMetrics.dot}</span>
                    </div>
                    <div className="p-3 bg-card rounded-xl border border-border">
                      <span className="text-[11px] text-muted-foreground block">Cosine Similarity</span>
                      <span className="text-lg font-mono font-bold text-emerald-400">{vectorMetrics.cosSim}</span>
                    </div>
                    <div className="p-3 bg-card rounded-xl border border-border">
                      <span className="text-[11px] text-muted-foreground block">Angle (θ)</span>
                      <span className="text-lg font-mono font-bold text-amber-400">{vectorMetrics.angleDeg}°</span>
                    </div>
                    <div className="p-3 bg-card rounded-xl border border-border">
                      <span className="text-[11px] text-muted-foreground block">Lengths (||u||, ||v||)</span>
                      <span className="text-sm font-mono font-bold text-foreground">{vectorMetrics.magU}, {vectorMetrics.magV}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    💡 <strong>RAG & Vector Search Insight:</strong> When embeddings have Cosine Similarity close to 1.0 (Angle &lt; 20°), the AI retrieval engine classifies the documents as highly semantically relevant.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* SANDBOX 2: GRADIENT DESCENT 2D PARABOLA */}
          {activeSandboxTab === 'gradient-descent' && (
            <Card className="p-6 bg-card border-purple-500/30 rounded-3xl shadow-xl space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 font-mono">
                      OPTIMIZATION & CALCULUS
                    </span>
                    <h3 className="text-base font-bold text-foreground">Gradient Descent Step Simulator</h3>
                    <p className="text-xs text-muted-foreground">
                      Simulate gradient descent on loss function <strong>f(x) = x²</strong> with exact derivative <strong>f'(x) = 2x</strong>.
                    </p>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-muted-foreground">Initial Position (x₀):</span>
                        <span className="font-bold font-mono text-foreground">{gdX.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="-6"
                        max="6"
                        step="0.5"
                        disabled={gdSteps.length > 0}
                        value={gdX}
                        onChange={(e) => setGdX(parseFloat(e.target.value))}
                        className="w-full accent-purple-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-muted-foreground">Learning Rate (η):</span>
                        <span className="font-bold font-mono text-purple-400">{gdLr.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="0.05"
                        max="0.9"
                        step="0.05"
                        value={gdLr}
                        onChange={(e) => setGdLr(parseFloat(e.target.value))}
                        className="w-full accent-purple-500"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <Button
                        type="button"
                        onClick={handleGdStep}
                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs h-9 px-4 rounded-xl cursor-pointer gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5" /> Step Forward (t={gdSteps.length + 1})
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleGdReset}
                        className="border-border text-foreground text-xs h-9 px-3 rounded-xl cursor-pointer gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Reset
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Trajectory Output */}
                <div className="p-5 bg-secondary/30 border border-border rounded-2xl space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">Optimization Trajectory</span>
                    <span className="text-[11px] text-muted-foreground">{gdSteps.length} iterations taken</span>
                  </div>

                  <div className="space-y-1.5 font-mono text-xs max-h-40 overflow-y-auto pr-2">
                    <div className="p-2 bg-card rounded-lg border border-border flex justify-between">
                      <span className="text-muted-foreground">Step 0 (Start):</span>
                      <span className="text-foreground">x = {gdX.toFixed(4)}, Loss = {(gdX ** 2).toFixed(4)}</span>
                    </div>
                    {gdSteps.map((stepX, idx) => (
                      <div key={idx} className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20 flex justify-between text-purple-300">
                        <span>Step {idx + 1}:</span>
                        <span>x = {stepX.toFixed(4)}, Loss = {(stepX ** 2).toFixed(4)}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-muted-foreground">
                    Notice how the step size dynamically shrinks as x approaches the global minimum at x = 0 because the gradient 2x becomes smaller!
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* SANDBOX 3: ACTIVATION FUNCTIONS */}
          {activeSandboxTab === 'activations' && (
            <Card className="p-6 bg-card border-purple-500/30 rounded-3xl shadow-xl space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/20 text-blue-300 font-mono">
                      NON-LINEAR ACTIVATIONS
                    </span>
                    <h3 className="text-base font-bold text-foreground">Non-Linearity & Gradient Flow</h3>
                    <p className="text-xs text-muted-foreground">
                      Compare modern deep learning activation functions and inspect their output value and gradient properties.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {(['sigmoid', 'relu', 'gelu', 'tanh'] as const).map((fn) => (
                      <button
                        key={fn}
                        type="button"
                        onClick={() => setSelectedActivation(fn)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                          selectedActivation === fn
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'bg-secondary text-muted-foreground hover:text-foreground border border-border'
                        }`}
                      >
                        {fn}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-muted-foreground">Input Value (x):</span>
                      <span className="font-bold font-mono text-purple-400">{actX.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="-6"
                      max="6"
                      step="0.1"
                      value={actX}
                      onChange={(e) => setActX(parseFloat(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                  </div>
                </div>

                {/* Math & Properties Card */}
                <div className="p-5 bg-secondary/30 border border-border rounded-2xl space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground uppercase tracking-wider">{selectedActivation.toUpperCase()} Function</span>
                    <span className="text-lg font-mono font-bold text-emerald-400">y = {activationOutput.y}</span>
                  </div>

                  <div className="p-3 bg-card rounded-xl border border-border space-y-1 font-mono text-[11px]">
                    <span className="text-muted-foreground block text-[10px] uppercase">Formula:</span>
                    <span className="text-purple-300">{activationOutput.formulaStr}</span>
                  </div>

                  <div className="p-3 bg-card rounded-xl border border-border space-y-1 font-mono text-[11px]">
                    <span className="text-muted-foreground block text-[10px] uppercase">Derivative / Gradient Property:</span>
                    <span className="text-blue-300">{activationOutput.derivStr}</span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* SANDBOX 4: CROSS-ENTROPY LOSS */}
          {activeSandboxTab === 'cross-entropy' && (
            <Card className="p-6 bg-card border-purple-500/30 rounded-3xl shadow-xl space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 font-mono">
                      INFORMATION THEORY & LOSS
                    </span>
                    <h3 className="text-base font-bold text-foreground">Categorical Cross-Entropy Loss</h3>
                    <p className="text-xs text-muted-foreground">
                      Loss = -ln(p_true). Observe how the loss penalty grows exponentially as model confidence in the true class drops towards zero.
                    </p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-muted-foreground">Model Softmax Confidence for True Token:</span>
                      <span className="font-bold font-mono text-emerald-400">{(cePredProb * 100).toFixed(1)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.01"
                      max="0.99"
                      step="0.01"
                      value={cePredProb}
                      onChange={(e) => setCePredProb(parseFloat(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>
                </div>

                <div className="p-5 bg-secondary/30 border border-border rounded-2xl space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">Computed Loss:</span>
                    <span className="text-2xl font-mono font-bold text-rose-400">{ceLoss}</span>
                  </div>

                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    🎯 <strong>Intuition for LLMs:</strong> If an LLM predicts the ground-truth token with 99% probability, loss is only 0.01. If it predicts with 1% probability, loss explodes to 4.60, generating massive backprop gradients to correct the weights.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* ── 4-PILLAR FORMULA DIRECTORY ── */}
        <div className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Complete Mathematical Curriculum</h2>
              <p className="text-xs text-muted-foreground">Curated equations with LaTeX proofs, geometric intuitions, and production Python scripts.</p>
            </div>

            {/* Filter Dropdown & Search */}
            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search formula, eigenvalue, loss..."
                  className="pl-9 bg-card border-border text-foreground text-xs h-9"
                />
              </div>

              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="h-9 px-3 bg-card border border-border rounded-xl text-xs text-foreground focus:outline-none"
              >
                <option value="All Levels">All Academic Levels</option>
                <option value="Foundation (11-12th)">Foundation (11-12th)</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Advanced / Research">Advanced / Research</option>
              </select>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-secondary text-muted-foreground hover:text-foreground border border-border'
              }`}
            >
              All Mathematical Pillars ({MATH_FORMULAS.length})
            </button>
            {MATH_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-secondary text-muted-foreground hover:text-foreground border border-border'
                  }`}
                >
                  {cat.label} ({cat.count})
                </button>
              );
            })}
          </div>

          {/* Formulas Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredFormulas.map((f) => (
              <Card key={f.id} className="p-6 bg-card border-border hover:border-purple-500/40 rounded-3xl transition-all shadow-lg space-y-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/20 text-purple-300 font-mono">
                      {f.level}
                    </span>
                    <h3 className="text-base font-bold text-foreground mt-1">{f.title}</h3>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleCopyCode(f.id, f.codeSnippet)}
                    className="border-border text-xs h-7 px-2.5 rounded-lg gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {copiedFormulaId === f.id ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Code className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </Button>
                </div>

                {/* LaTeX Render Box */}
                <div className="p-4 bg-secondary/50 border border-border rounded-2xl overflow-x-auto">
                  {renderKatex(f.latexFormula)}
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {f.plainDescription}
                </p>

                {/* Intuition Callout */}
                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-xs text-purple-300 space-y-1">
                  <span className="font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Geometric Intuition:
                  </span>
                  <p className="leading-snug">{f.intuition}</p>
                </div>

                {/* Where Used in AI */}
                <div className="text-xs text-muted-foreground pt-2 border-t border-border flex items-start gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Where Used in AI:</strong> {f.whereUsedInAI}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </NexusShell>
  );
}
