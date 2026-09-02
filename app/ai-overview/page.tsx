'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Brain,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Cpu,
  Layers,
  Network,
  Bot,
  Sliders,
  Activity,
  Binary,
  ArrowRight,
  TrendingUp,
  Database,
  RefreshCw,
  GitBranch,
  Target,
  Workflow
} from 'lucide-react';
import { MathRenderer } from '@/components/ui/math-renderer';

export default function AIOverviewPage() {
  // Active hierarchy tab
  const [activeHierarchy, setActiveHierarchy] = useState<'ai' | 'ml' | 'dl' | 'genai' | 'llm'>('ai');

  // Interactive Single Neuron Simulator (Weights & Bias Playground)
  const [inputX1, setInputX1] = useState(2.0);
  const [inputX2, setInputX2] = useState(3.0);
  const [weightW1, setWeightW1] = useState(0.75);
  const [weightW2, setWeightW2] = useState(-1.2);
  const [biasB, setBiasB] = useState(0.5);
  const [activationFn, setActivationFn] = useState<'relu' | 'gelu' | 'sigmoid'>('relu');

  // Calculate Neuron Output
  const linearCombinationZ = +(inputX1 * weightW1 + inputX2 * weightW2 + biasB).toFixed(3);
  let activatedOutputY = 0;
  if (activationFn === 'relu') {
    activatedOutputY = Math.max(0, linearCombinationZ);
  } else if (activationFn === 'sigmoid') {
    activatedOutputY = +(1 / (1 + Math.exp(-linearCombinationZ))).toFixed(4);
  } else if (activationFn === 'gelu') {
    const c = Math.sqrt(2 / Math.PI) * (linearCombinationZ + 0.044715 * Math.pow(linearCombinationZ, 3));
    activatedOutputY = +(0.5 * linearCombinationZ * (1 + Math.tanh(c))).toFixed(4);
  }

  // 1. Six Core Cognitive Aspects
  const aspects = [
    {
      title: 'Learning',
      desc: 'Acquiring rules, mathematical patterns, and latent data representations directly from data to make accurate predictions.'
    },
    {
      title: 'Reasoning',
      desc: 'Using logical inference, search trees (A*), and transformer self-attention to solve complex problems and draw conclusions.'
    },
    {
      title: 'Perception',
      desc: 'Interpreting continuous high-dimensional sensory inputs such as vision (pixels), speech (audio waveforms), and IoT sensors.'
    },
    {
      title: 'Action',
      desc: 'Executing physical robotic actuation, automated API function calling, or software decisions in dynamic environments.'
    },
    {
      title: 'Adaptation',
      desc: 'Continuously refining model weights and parameters based on real-time feedback loops and active learning.'
    },
    {
      title: 'Interaction',
      desc: 'Communicating seamlessly with humans using natural language, multi-modal context, and empathetic dialogue.'
    },
  ];

  // 2. Spectrum & Categories of AI
  const types = [
    {
      title: 'Narrow AI (ANI)',
      tag: 'Production Today',
      color: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
      desc: 'Specialized systems tailored for specific tasks (e.g. Chess, Medical Diagnosis, Search Engines, Autonomous Driving Vision).'
    },
    {
      title: 'General AI (AGI)',
      tag: 'Active Research',
      color: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
      desc: 'Hypothetical AI possessing human-level cognitive adaptability, cross-domain learning, and autonomous abstract reasoning across any field.'
    },
    {
      title: 'Superintelligence (ASI)',
      tag: 'Theoretical',
      color: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
      desc: 'Intellect vastly outperforming human capabilities in scientific discovery, strategic foresight, and technological invention.'
    },
    {
      title: 'Generative AI (GenAI)',
      tag: 'Current Wave',
      color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
      desc: 'Models generating novel text, code, high-resolution imagery, 3D assets, and audio synthesis by learning probability distributions.'
    },
  ];

  // 3. Deep Hierarchy Details (AI, ML, DL, GenAI, LLMs)
  const hierarchyDetails = {
    ai: {
      title: '1. Artificial Intelligence (AI)',
      badge: 'Overarching Discipline',
      scope: 'The comprehensive scientific domain focused on building machines capable of performing cognitive tasks that typically require human intellect.',
      subsets: 'Includes Rule-Based Expert Systems, Search Trees (Minimax, A*), Knowledge Graphs, Fuzzy Logic, and Statistical Machine Learning.',
      keyConcept: 'Intelligence = Perception + Knowledge Representation + Reasoning + Planning + Decision Making',
      mathObjective: 'a^* = \\arg\\max_a \\mathbb{E}[U(s, a)]',
      realWorldExamples: ['Autonomous Navigation Systems', 'Precision Agriculture Leaf Scanning', 'Algorithmic Financial Trading', 'Master Chess & Go Engines']
    },
    ml: {
      title: '2. Machine Learning (ML)',
      badge: 'Statistical Learning Subfield',
      scope: 'A subfield of AI where algorithms discover mathematical mappings Y = f(X) from training data without explicit hardcoded if-else logic.',
      subsets: 'Supervised Learning (Classification / Regression), Unsupervised Learning (Clustering / PCA / SVD), and Reinforcement Learning (MDPs / Q-Learning).',
      keyConcept: 'Minimizes empirical risk on training data while maintaining high generalization on unseen test instances.',
      mathObjective: '\\min_W \\frac{1}{N} \\sum_{i=1}^N \\mathcal{L}(f(x_i; W), y_i) + \\lambda \\Omega(W)',
      realWorldExamples: ['Credit Card Fraud Detection', 'Customer Churn Prediction', 'Spam Filtering', 'Crop Yield Forecasters']
    },
    dl: {
      title: '3. Deep Learning (DL)',
      badge: 'Multi-Layer Neural Networks',
      scope: 'Artificial Neural Networks featuring deep hierarchies of parameterized layers (weights W and biases b) that learn non-linear feature representations automatically.',
      subsets: 'Convolutional Neural Networks (CNNs / ResNet), Recurrent Networks & LSTMs, Graph Neural Networks (GNNs), Transformers.',
      keyConcept: 'Eliminates manual feature engineering. Raw pixels/audio propagate through non-linear activation layers (ReLU, GELU, SwiGLU).',
      mathObjective: '\\frac{\\partial \\mathcal{L}}{\\partial W^{[l]}} = \\delta^{[l]} (a^{[l-1]})^T, \\quad \\delta^{[l]} = ((W^{[l+1]})^T \\delta^{[l+1]}) \\odot \\sigma\'(z^{[l]})',
      realWorldExamples: ['Medical Radiograph MRI Segmentation', 'Real-Time Insect Pest Vision', 'Autonomous Drone Swarm Navigation', 'Speech Recognition']
    },
    genai: {
      title: '4. Generative AI (GenAI)',
      badge: 'Generative Distribution Modeling',
      scope: 'Deep learning models trained not just to classify or discriminate inputs P(Y|X), but to model the joint data probability distribution P(X) to generate novel synthetic artifacts.',
      subsets: 'Denoising Diffusion Probabilistic Models (DDPM), Variational Autoencoders (VAEs), Generative Adversarial Networks (GANs), Autoregressive Models.',
      keyConcept: 'Samples new high-dimensional instances from learned latent manifolds that are indistinguishable from real training distributions.',
      mathObjective: '\\mathcal{L}_{\\text{simple}}(\\theta) = \\mathbb{E}_{t, x_0, \\epsilon} \\left[ \\| \\epsilon - \\epsilon_\\theta(x_t, t) \\|^2 \\right]',
      realWorldExamples: ['High-Fidelity Photorealistic Image Synthesis', 'Synthetic Code Generation', 'Music & Voice Synthesis', 'Molecular Drug Discovery']
    },
    llm: {
      title: '5. Large Language Models (LLMs)',
      badge: 'Transformer Foundation Scale',
      scope: 'Massive billion/trillion-parameter generative transformer architectures pre-trained on multi-terabyte token corpora using next-token autoregressive prediction.',
      subsets: 'Causal Decoders (GPT-4, LLaMA 3, Mistral), Bidirectional Encoders (BERT), Encoder-Decoder (T5), Mixture-of-Experts (MoE).',
      keyConcept: 'Demonstrates emergent reasoning, few-shot in-context learning, and zero-shot multi-lingual translation through scale.',
      mathObjective: '\\mathcal{L}_{\\text{NLL}}(\\theta) = -\\sum_{t=1}^T \\log P_\\theta(w_t \\mid w_{<t})',
      realWorldExamples: ['Complex Coding Assistants', 'Vernacular Multi-Lingual Agricultural Advisory', 'Automated Legal Document Synthesis', 'Autonomous Agentic Tool-Use']
    }
  };

  // 4. How Artificial Intelligence Works (Step-by-Step Pipeline)
  const steps = [
    {
      step: '1. Data Collection',
      detail: 'Gathering raw unstructured text, images, tabular logs, audio waveforms, or IoT sensor streams across distributed data lakes.'
    },
    {
      step: '2. Preprocessing & Tokenization',
      detail: 'Cleaning, normalizing, and converting raw inputs into numerical tensors using algorithms like Byte-Pair Encoding (BPE) or WordPiece.'
    },
    {
      step: '3. Model Architecture & Forward Pass',
      detail: 'Propagating input embeddings through stacked transformer or neural layers to compute linear combinations z = WᵀX + b and attention scores.'
    },
    {
      step: '4. Loss Function & Backpropagation',
      detail: 'Measuring prediction error (Cross-Entropy / MSE) and computing exact partial derivatives (∂L/∂W, ∂L/∂b) via the calculus chain rule.'
    },
    {
      step: '5. Model Training & Optimization',
      detail: 'Optimizing millions/billions of weights and biases via gradient descent (AdamW) across GPU/TPU clusters until convergence.'
    },
    {
      step: '6. Real-time Inference',
      detail: 'Evaluating user prompts or live test instances using KV-caching, FlashAttention, and greedy or top-p nucleus sampling.'
    },
    {
      step: '7. Feedback Loop & Alignment',
      detail: 'Incorporating human feedback alignment (RLHF / DPO), guardrail filtering, and monitoring for statistical data and concept drift.'
    }
  ];

  return (
    <NexusShell>
      <div className="space-y-8 max-w-7xl mx-auto pb-20">
        {/* ── BREADCRUMB ── */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <Link href="/dashboard" className="hover:text-foreground">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-purple-400 font-semibold">AI Overview & Foundations</span>
        </div>

        {/* ── HERO BANNER ── */}
        <Card className="relative overflow-hidden rounded-3xl border-purple-500/20 bg-gradient-to-br from-purple-950/70 via-card to-indigo-950/50 p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  Comprehensive Architecture & Mathematical Guide
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  AI • Machine Learning • Deep Learning • Generative AI • LLMs
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
                What is Artificial Intelligence?
                <Brain className="w-8 h-8 text-purple-400" />
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                A comprehensive foundation guide explaining how machines emulate human cognition, process data, and solve real-world problems — from mathematical <strong>Weights & Biases</strong> in single artificial neurons to <strong>Deep Learning Backpropagation</strong>, <strong>Generative Diffusion</strong>, and trillion-token <strong>Large Language Models (LLMs)</strong>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 flex-shrink-0">
              <div className="p-3.5 rounded-2xl bg-secondary/80 border border-border flex items-center gap-3">
                <Binary className="w-6 h-6 text-purple-400 flex-shrink-0" />
                <div>
                  <div className="text-[10px] text-muted-foreground font-mono">Fundamental Equation</div>
                  <div className="text-xs font-bold text-foreground">
                    <MathRenderer math="y = \sigma(W^T X + b)" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Universal Function Approximation</span>
              </div>
            </div>
          </div>
        </Card>

        {/* ── 1. THE 6 CORE COGNITIVE PILLARS OF AI ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>The 6 Core Cognitive Pillars of AI</span>
            </h2>
            <span className="text-xs text-muted-foreground font-mono">Foundations of Synthetic Intellect</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {aspects.map((a) => (
              <Card key={a.title} className="p-5 bg-card border-border rounded-2xl hover:border-purple-500/40 hover:shadow-lg transition-all space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-600/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">{a.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{a.desc}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* ── 2. SPECTRUM & CATEGORIES OF AI ── */}
        <Card className="p-6 sm:p-8 bg-card border-border rounded-3xl space-y-5 shadow-xl">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" />
              <span>Spectrum & Categories of AI</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              From current production systems to active frontier research and theoretical horizons.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {types.map((t) => (
              <div key={t.title} className="p-5 bg-secondary/50 border border-border rounded-2xl space-y-2 hover:border-purple-500/30 transition-all flex flex-col justify-between">
                <div className="space-y-2">
                  <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg font-mono border inline-block ${t.color}`}>
                    {t.tag}
                  </span>
                  <h4 className="text-sm font-bold text-foreground">{t.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* ── 3. THE DEEP AI HIERARCHY: AI ⊃ ML ⊃ DL ⊃ GenAI ⊃ LLM ── */}
        <Card className="p-6 sm:p-8 bg-card border-border rounded-3xl space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                <span>The Deep AI Hierarchy: AI vs ML vs DL vs Gen AI vs LLM Models</span>
              </h2>
              <p className="text-xs text-muted-foreground">Select a layer below to inspect its mathematical formulation, architectural scope, and real-world systems.</p>
            </div>
          </div>

          {/* Interactive Layer Selector Tabs */}
          <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto scrollbar-none">
            {[
              { id: 'ai', label: '1. Artificial Intelligence (AI)', icon: Brain },
              { id: 'ml', label: '2. Machine Learning (ML)', icon: Network },
              { id: 'dl', label: '3. Deep Learning (DL)', icon: Cpu },
              { id: 'genai', label: '4. Generative AI (GenAI)', icon: Sparkles },
              { id: 'llm', label: '5. Large Language Models (LLMs)', icon: Bot },
            ].map((tab) => {
              const isActive = activeHierarchy === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveHierarchy(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Hierarchy Content Card */}
          {hierarchyDetails[activeHierarchy] && (
            <div className="p-6 rounded-2xl bg-secondary/40 border border-border space-y-5 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg font-extrabold text-foreground">{hierarchyDetails[activeHierarchy].title}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {hierarchyDetails[activeHierarchy].badge}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                <div className="space-y-2">
                  <span className="font-bold text-foreground block">Architectural Scope & Definition:</span>
                  <p className="text-muted-foreground">{hierarchyDetails[activeHierarchy].scope}</p>
                  <p className="text-muted-foreground font-medium pt-1">
                    <strong className="text-foreground">Constituent Subsets:</strong> {hierarchyDetails[activeHierarchy].subsets}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-foreground block">Core Conceptual Foundation:</span>
                  <p className="text-muted-foreground">{hierarchyDetails[activeHierarchy].keyConcept}</p>
                  <div className="p-3 rounded-xl bg-zinc-950 border border-purple-500/30 text-purple-200 overflow-x-auto text-center">
                    <MathRenderer math={hierarchyDetails[activeHierarchy].mathObjective} block />
                  </div>
                </div>
              </div>

              {/* Real World Applications Bar */}
              <div className="pt-3 border-t border-border/50 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Production Industry Applications:</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {hierarchyDetails[activeHierarchy].realWorldExamples.map((ex, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-xl text-xs font-medium bg-card border border-border text-foreground flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>{ex}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* ── 4. MATHEMATICAL MECHANICS: WEIGHTS ($W$), BIAS ($b$) & ACTIVATION SIMULATOR ── */}
        <Card className="p-6 sm:p-8 bg-card border-border rounded-3xl space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                <Sliders className="w-5 h-5 text-purple-400" />
                <span>Mathematical Mechanics: Weights ($W$), Bias ($b$) & Activation Functions ($\sigma$)</span>
              </h2>
              <p className="text-xs text-muted-foreground">
                An artificial neuron computes a weighted linear combination $z = \sum w_i x_i + b$, then applies a non-linear activation $\sigma(z)$.
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-secondary p-1 rounded-xl border border-border">
              {(['relu', 'gelu', 'sigmoid'] as const).map((fn) => (
                <button
                  key={fn}
                  onClick={() => setActivationFn(fn)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold uppercase cursor-pointer transition-all ${
                    activationFn === fn ? 'bg-purple-600 text-white shadow-md' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {fn}
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Explanation Cards for Weights and Bias */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20 space-y-1.5">
              <span className="font-bold text-purple-300 text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                What are Weights ($W$)?
              </span>
              <p className="text-muted-foreground leading-relaxed">
                Weights are <strong>multiplicative scaling parameters</strong> representing the connection strength between neurons. Positive weights excite activations, negative weights inhibit them, and near-zero weights filter out irrelevant features.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 space-y-1.5">
              <span className="font-bold text-amber-300 text-sm flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                What is Bias ($b$)?
              </span>
              <p className="text-muted-foreground leading-relaxed">
                Bias is an <strong>additive scalar parameter</strong> that shifts the activation threshold horizontally along the input axis. Without bias, the decision boundary is forced through the origin $(0, 0)$, unable to activate when all inputs are 0.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Interactive Sliders */}
            <div className="space-y-4 p-5 rounded-2xl bg-secondary/40 border border-border">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider block font-mono">
                Live Parameter Adjustments:
              </span>

              {/* Input x1 & Weight w1 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-muted-foreground">Input x₁:</span>
                    <span className="font-bold text-purple-300">{inputX1}</span>
                  </div>
                  <input
                    type="range"
                    min="-5.0"
                    max="5.0"
                    step="0.1"
                    value={inputX1}
                    onChange={(e) => setInputX1(+e.target.value)}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-muted-foreground">Weight w₁:</span>
                    <span className="font-bold text-emerald-400">{weightW1}</span>
                  </div>
                  <input
                    type="range"
                    min="-3.0"
                    max="3.0"
                    step="0.05"
                    value={weightW1}
                    onChange={(e) => setWeightW1(+e.target.value)}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Input x2 & Weight w2 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-muted-foreground">Input x₂:</span>
                    <span className="font-bold text-purple-300">{inputX2}</span>
                  </div>
                  <input
                    type="range"
                    min="-5.0"
                    max="5.0"
                    step="0.1"
                    value={inputX2}
                    onChange={(e) => setInputX2(+e.target.value)}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-muted-foreground">Weight w₂:</span>
                    <span className="font-bold text-emerald-400">{weightW2}</span>
                  </div>
                  <input
                    type="range"
                    min="-3.0"
                    max="3.0"
                    step="0.05"
                    value={weightW2}
                    onChange={(e) => setWeightW2(+e.target.value)}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Bias b */}
              <div className="space-y-1 pt-2 border-t border-border">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-muted-foreground">Additive Bias (b):</span>
                  <span className="font-bold text-amber-300">{biasB}</span>
                </div>
                <input
                  type="range"
                  min="-5.0"
                  max="5.0"
                  step="0.1"
                  value={biasB}
                  onChange={(e) => setBiasB(+e.target.value)}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Mathematical Output Computation Display */}
            <div className="p-5 rounded-2xl bg-zinc-950 border border-purple-500/30 flex flex-col justify-between space-y-4 font-mono text-xs">
              <div className="space-y-3">
                <div className="text-purple-400 font-bold flex items-center justify-between">
                  <span>[Neuron Activation Computation]</span>
                  <span className="text-[10px] text-muted-foreground">Layer 1 Feedforward</span>
                </div>

                {/* Step 1: Linear sum */}
                <div className="p-3.5 rounded-xl bg-secondary/40 border border-border space-y-1">
                  <div className="text-muted-foreground text-[10px]">1. Linear Pre-Activation Combination (z):</div>
                  <div className="text-foreground text-xs leading-relaxed">
                    z = (x₁ · w₁) + (x₂ · w₂) + b
                  </div>
                  <div className="text-purple-300 text-xs">
                    z = ({inputX1} · {weightW1}) + ({inputX2} · {weightW2}) + ({biasB}) = <strong className="text-white">{linearCombinationZ}</strong>
                  </div>
                </div>

                {/* Step 2: Non-linear Activation */}
                <div className="p-3.5 rounded-xl bg-secondary/40 border border-border space-y-1">
                  <div className="text-muted-foreground text-[10px]">2. Non-Linear Activation Function ({activationFn.toUpperCase()}):</div>
                  <div className="text-emerald-400 text-sm font-bold">
                    y = {activationFn.toUpperCase()}({linearCombinationZ}) = <span className="text-white text-base">{activatedOutputY}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-[11px] text-purple-200 leading-relaxed">
                <strong>Why Non-Linearity Matters:</strong> Without activation functions, any composition of 100 neural layers $W_3(W_2(W_1 X)) = (W_3 W_2 W_1)X = W'X$ collapses mathematically into a single linear regression plane.
              </div>
            </div>
          </div>

          {/* ── 4B. FORMAL MATHEMATICAL SPECIFICATIONS & MATRIX DERIVATIONS ── */}
          <div className="pt-6 border-t border-border space-y-6">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 font-mono uppercase tracking-wider">
              <Binary className="w-4 h-4 text-purple-400" />
              <span>Formal Vector Mathematics: Weights, Bias, Activation & Gradient Derivation</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
              {/* 1. Vector Affine Layer */}
              <div className="p-4 rounded-2xl bg-secondary/50 border border-border space-y-2">
                <span className="text-purple-400 font-bold block text-[11px]">1. Vector Affine Mapping (Layer l)</span>
                <div className="p-2.5 rounded-xl bg-zinc-950 text-purple-200 text-[10px] leading-relaxed border border-purple-500/20">
                  z^(l) = W^(l) · a^(l-1) + b^(l)
                  <br />
                  a^(l) = σ(z^(l))
                  <br />
                  where W ∈ ℝ^(d_l × d_(l-1)), b ∈ ℝ^(d_l)
                </div>
                <p className="text-muted-foreground text-[11px] font-sans leading-normal">
                  Weights W define a linear transformation tensor; bias vector b shifts the subspace origin.
                </p>
              </div>

              {/* 2. Geometric Hyperplane */}
              <div className="p-4 rounded-2xl bg-secondary/50 border border-border space-y-2">
                <span className="text-emerald-400 font-bold block text-[11px]">2. Geometric Hyperplane & Distance</span>
                <div className="p-2.5 rounded-xl bg-zinc-950 text-emerald-200 text-[10px] leading-relaxed border border-emerald-500/20">
                  H = {'{'} x ∈ ℝⁿ : wᵀx + b = 0 {'}'}
                  <br />
                  dist(0, H) = |b| / ||w||₂
                  <br />
                  y_hat = sign(wᵀx + b)
                </div>
                <p className="text-muted-foreground text-[11px] font-sans leading-normal">
                  Vector w is orthogonal to the decision boundary; scalar b determines the signed offset from origin.
                </p>
              </div>

              {/* 3. Backprop Gradient Tensor */}
              <div className="p-4 rounded-2xl bg-secondary/50 border border-border space-y-2">
                <span className="text-amber-400 font-bold block text-[11px]">3. Calculus Chain Rule (Backprop)</span>
                <div className="p-2.5 rounded-xl bg-zinc-950 text-amber-200 text-[10px] leading-relaxed border border-amber-500/20">
                  δ^(l) = ((W^(l+1))ᵀ · δ^(l+1)) ⊙ σ&apos;(z^(l))
                  <br />
                  ∂L/∂W^(l) = δ^(l) · (a^(l-1))ᵀ
                  <br />
                  ∂L/∂b^(l) = δ^(l)
                </div>
                <p className="text-muted-foreground text-[11px] font-sans leading-normal">
                  Exact partial derivatives calculated via outer product of error vector δ and upstream activation a.
                </p>
              </div>
            </div>

            {/* Comprehensive Activation Function Taxonomy Table */}
            <div className="p-5 rounded-2xl bg-secondary/30 border border-border space-y-3">
              <span className="text-xs font-bold text-foreground font-mono uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                <span>Modern Activation Function Taxonomy (σ): Formulation & Derivatives</span>
              </span>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground text-[11px]">
                      <th className="pb-2 font-bold">Function Name</th>
                      <th className="pb-2 font-bold">Mathematical Formulation σ(z)</th>
                      <th className="pb-2 font-bold">First Derivative σ&apos;(z)</th>
                      <th className="pb-2 font-bold">Primary Domain / Model</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 text-[11px]">
                    <tr>
                      <td className="py-2.5 font-bold text-purple-300">GELU</td>
                      <td className="py-2.5 text-foreground">z · Φ(z) = 0.5z(1 + erf(z / √2))</td>
                      <td className="py-2.5 text-muted-foreground">Φ(z) + z · φ(z)</td>
                      <td className="py-2.5 text-emerald-400">GPT-4, BERT, ViT</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-purple-300">SwiGLU</td>
                      <td className="py-2.5 text-foreground">(xW ⊙ SiLU(xW)) ⊗ (xV)</td>
                      <td className="py-2.5 text-muted-foreground">Gated Dual-Projection Gradient</td>
                      <td className="py-2.5 text-emerald-400">LLaMA 3, Mistral, Gemini</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-purple-300">ReLU</td>
                      <td className="py-2.5 text-foreground">max(0, z)</td>
                      <td className="py-2.5 text-muted-foreground">𝕀(z &gt; 0)</td>
                      <td className="py-2.5 text-emerald-400">CNNs, ResNet, MLPs</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-purple-300">Sigmoid</td>
                      <td className="py-2.5 text-foreground">1 / (1 + e^(-z))</td>
                      <td className="py-2.5 text-muted-foreground">σ(z) · (1 - σ(z))</td>
                      <td className="py-2.5 text-emerald-400">Binary Classification, Attention Gates</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-purple-300">Softmax</td>
                      <td className="py-2.5 text-foreground">e^(z_i) / ∑ e^(z_j)</td>
                      <td className="py-2.5 text-muted-foreground">S_i(δ_ij - S_j)</td>
                      <td className="py-2.5 text-emerald-400">LLM Next-Token Output Probabilities</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Card>

        {/* ── 5. HOW ARTIFICIAL INTELLIGENCE WORKS (END-TO-END PRODUCTION PIPELINE) ── */}
        <Card className="p-6 sm:p-8 bg-card border-border rounded-3xl space-y-6 shadow-xl">
          <div className="space-y-1 border-b border-border pb-4">
            <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              <Workflow className="w-5 h-5 text-emerald-400" />
              <span>How Artificial Intelligence Works: End-to-End Deep Engineering Pipeline</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              From raw data ingestion and tokenization to attention matrix calculations, backpropagation, and human alignment (DPO/RLHF).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-secondary/40 border border-border hover:border-purple-500/40 transition-all space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-mono font-bold text-xs">
                      {idx + 1}
                    </div>
                    <h3 className="text-xs font-bold text-foreground">{s.step}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed pl-8">
                    {s.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </NexusShell>
  );
}
