'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  GraduationCap,
  Sparkles,
  ChevronRight,
  Brain,
  Cpu,
  Calculator,
  Code,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Send,
  Award,
  BookOpen,
  HelpCircle,
  Target,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  Search,
  Building2,
  FileCheck
} from 'lucide-react';
import {
  ExperienceBracket,
  InterviewQuestion,
  MockInterviewResult
} from '@/services/interview-prep-service';
import { MathRenderer } from '@/components/ui/math-renderer';

export default function InterviewPrepPage() {
  const [selectedExperience, setSelectedExperience] = useState<ExperienceBracket | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>('int-q1-01');

  // AI Mock Interview Simulation State
  const [mockActive, setMockActive] = useState(false);
  const [activeMockQuestionIndex, setActiveMockQuestionIndex] = useState(0);
  const [userAnswerText, setUserAnswerText] = useState('');
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [mockEvaluationResult, setMockEvaluationResult] = useState<MockInterviewResult | null>(null);

  // Local sample questions
  const questions: InterviewQuestion[] = useMemo(() => [
    {
      id: 'int-q1-01',
      title: 'Explain Gradient Descent and Derive the Weight Update Step',
      experienceBracket: '0-1y',
      experienceLabel: '0-1 Years (Freshers & Entry Level)',
      category: 'ML Mathematics & Theory',
      difficulty: 'Easy',
      companyTags: ['Google', 'Amazon', 'Microsoft', 'Adobe'],
      questionPrompt:
        'Can you mathematically derive the gradient descent update rule for a linear regression model with Mean Squared Error (MSE)? What happens if the learning rate is too large or too small?',
      keyConcepts: ['Partial Derivatives', 'MSE Loss Formulation', 'Learning Rate Tuning', 'Convex Optimization'],
      mathematicalDerivation: {
        formula: 'θ_{t+1} = θ_t - η ⋅ ∇_θ L(θ_t)',
        steps: [
          '1. Define MSE Loss: L(w, b) = (1/2N) ∑_{i=1}^N (ŷ_i - y_i)^2 where ŷ_i = w x_i + b.',
          '2. Take partial derivative with respect to w: ∂L/∂w = (1/N) ∑_{i=1}^N (w x_i + b - y_i) ⋅ x_i = (1/N) X^T (ŷ - y).',
          '3. Update weight in opposite direction of gradient: w_{new} = w_{old} - η (∂L/∂w).'
        ]
      },
      modelAnswer:
        'Gradient descent is an iterative first-order optimization algorithm used to minimize a differentiable scalar loss function L(θ). By taking the partial derivative of the MSE loss with respect to the weight vector w, we determine the direction of steepest ascent. Multiplying by negative learning rate η updates the weights towards the global minimum. If η is too small, convergence is slow; if too large, the optimizer oscillates or diverges.',
      codeSnippet: {
        language: 'python',
        code: `import numpy as np

def gradient_descent(X, y, lr=0.01, epochs=1000):
    N, D = X.shape
    w = np.zeros(D)
    b = 0.0
    for _ in range(epochs):
        y_pred = np.dot(X, w) + b
        error = y_pred - y
        dw = (1/N) * np.dot(X.T, error)
        db = (1/N) * np.sum(error)
        w -= lr * dw
        b -= lr * db
    return w, b`
      },
      interviewerTips: [
        'Look for clear explanation of the negative sign (stepping opposite to gradient ascent).',
        'Candidate should mention learning rate schedules (e.g. cosine annealing or AdamW).'
      ],
      commonPitfalls: ['Forgetting to divide by N when averaging over batch samples.', 'Confusing batch GD, mini-batch GD, and stochastic GD (SGD).']
    },
    {
      id: 'int-q2-01',
      title: 'Bias-Variance Tradeoff and Regularization (L1 vs L2)',
      experienceBracket: '0-1y',
      experienceLabel: '0-1 Years (Freshers & Entry Level)',
      category: 'ML Mathematics & Theory',
      difficulty: 'Easy',
      companyTags: ['Meta', 'Uber', 'Salesforce'],
      questionPrompt:
        'Deconstruct the expected generalization error into Bias, Variance, and Irreducible Error. How do L1 (Lasso) and L2 (Ridge) penalties mathematically control this tradeoff?',
      keyConcepts: ['Expected Prediction Error Decomposition', 'L1 Sparsity (Lasso)', 'L2 Weight Shrinkage (Ridge)'],
      mathematicalDerivation: {
        formula: 'E[(y - ŷ)^2] = \\text{Bias}^2(ŷ) + \\text{Var}(ŷ) + σ^2',
        steps: [
          '1. Bias = E[ŷ] - y (systematic error from simplistic model assumptions).',
          '2. Variance = E[(ŷ - E[ŷ])^2] (sensitivity of model predictions to training data fluctuations).',
          '3. Ridge Loss: L_{Ridge} = L_0 + λ ∑ w_i^2. Lasso Loss: L_{Lasso} = L_0 + λ ∑ |w_i|.'
        ]
      },
      modelAnswer:
        'Total prediction error decomposes into Bias² (underfitting due to erroneous assumptions) + Variance (overfitting due to excessive sensitivity to noise) + Irreducible error σ². L2 regularization adds quadratic weight decay, shrinking weights smoothly toward zero without setting them to exact zero. L1 regularization uses absolute values whose diamond constraint contours produce sparse feature selection with exact zero weights.',
      interviewerTips: ['Ask candidate why L1 produces exact zeros (geometry of L1 ball corners vs L2 circle).'],
      commonPitfalls: ['Saying high bias causes overfitting (high bias causes underfitting).']
    },
    {
      id: 'int-q3-02',
      title: 'Derive Scaled Dot-Product Attention & Explain Why We Divide by √d_k',
      experienceBracket: '1-2y',
      experienceLabel: '1-2 Years (Applied ML Engineers)',
      category: 'Deep Learning & LLMs',
      difficulty: 'Medium',
      companyTags: ['OpenAI', 'Google', 'Anthropic', 'Microsoft', 'NVIDIA'],
      questionPrompt:
        'Walk me through the mathematics of Scaled Dot-Product Attention: Attention(Q, K, V) = softmax((QK^T)/√d_k)V. Why is the scaling factor 1/√d_k strictly necessary when d_k is large?',
      keyConcepts: ['Variance of Dot Products', 'Softmax Vanishing Gradients', 'Q, K, V Matrix Shapes'],
      mathematicalDerivation: {
        formula: '\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right) V',
        steps: [
          '1. Assume Q and K elements are independent random variables with mean 0 and variance 1.',
          '2. For single dot product q ⋅ k = ∑_{i=1}^{d_k} q_i k_i, the mean is 0 and variance is d_k.',
          '3. For large d_k (e.g. 128), values grow to ±30. Softmax becomes extremely peaky (one-hot), leading to vanishing gradients during backpropagation.',
          '4. Dividing by √d_k normalizes the variance back to 1.0, preserving healthy gradients.'
        ]
      },
      modelAnswer:
        'Under the assumption of zero-mean, unit-variance components, the dot product of two d_k-dimensional vectors has variance equal to d_k and standard deviation √d_k. Without scaling, large d_k pushes inputs into regions where the softmax function has near-zero derivatives (gradient saturation), killing backpropagation flow. Dividing by √d_k keeps logits in a balanced dynamic range.',
      codeSnippet: {
        language: 'python',
        code: `import torch
import math

def attention(q, k, v, mask=None):
    # q, k, v: [batch, heads, seq_len, d_k]
    d_k = q.size(-1)
    scores = torch.matmul(q, k.transpose(-2, -1)) / math.sqrt(d_k)
    if mask is not None:
        scores = scores.masked_fill(mask == 0, -1e9)
    weights = torch.softmax(scores, dim=-1)
    return torch.matmul(weights, v)`
      },
      interviewerTips: ['Check if candidate can compute variance of sum of independent products Var(∑ q_i k_i) = d_k.'],
      commonPitfalls: ['Saying √d_k is just a heuristic without knowing the variance proof.']
    },
    {
      id: 'int-q4-02',
      title: 'Parameter-Efficient Fine-Tuning: LoRA vs Full Fine-Tuning',
      experienceBracket: '1-2y',
      experienceLabel: '1-2 Years (Applied ML Engineers)',
      category: 'Deep Learning & LLMs',
      difficulty: 'Medium',
      companyTags: ['Meta', 'Hugging Face', 'Cohere', 'Databricks'],
      questionPrompt:
        'How does Low-Rank Adaptation (LoRA) work mathematically? Calculate parameter savings for a Linear layer of shape (4096, 4096) with rank r=8.',
      keyConcepts: ['Low-Rank Matrix Decomposition', 'Intrinsic Rank Hypothesis', 'GPU Memory Savings'],
      mathematicalDerivation: {
        formula: 'W = W_0 + \\Delta W = W_0 + \\frac{\\alpha}{r} (B \\cdot A)',
        steps: [
          '1. Original frozen weight W_0 has shape (d_out, d_in). Total params = d_out × d_in = 4096 × 4096 = 16,777,216.',
          '2. Decompose ΔW into B ∈ ℝ^{d_out × r} and A ∈ ℝ^{r × d_in} where r ≪ min(d_in, d_out).',
          '3. LoRA trainable params = (4096 × 8) + (8 × 4096) = 65,536 parameters.',
          '4. Parameter reduction: 65,536 / 16,777,216 ≈ 0.39% (a 256x parameter reduction!).'
        ]
      },
      modelAnswer:
        'LoRA freezes the pre-trained weight matrix W_0 and injects trainable rank decomposition matrices A and B. Forward pass computes h = W_0 x + (α/r) B(A x). Matrix A is initialized from Gaussian N(0, σ²) and B is initialized to 0, ensuring ΔW = 0 at the start of training. Because r=8 is tiny compared to 4096, we reduce optimizer memory states by >99% while achieving comparable task accuracy.',
      interviewerTips: ['Ask candidate why matrix B must be initialized to zero (so initial output equals base model).'],
      commonPitfalls: ['Forgetting that LoRA weights can be merged into W_0 at inference time with zero latency penalty.']
    },
    {
      id: 'int-q5-03',
      title: 'System Design: Multi-Tenant Enterprise RAG at 10,000 QPS',
      experienceBracket: '3-4y',
      experienceLabel: '3-4 Years (Senior / Systems Architect)',
      category: 'System Design & Architecture',
      difficulty: 'Hard',
      companyTags: ['OpenAI', 'Anthropic', 'Google Cloud', 'Uber', 'Databricks'],
      questionPrompt:
        'Design a production-grade, low-latency, multi-tenant Retrieval-Augmented Generation (RAG) system processing 10,000 queries/sec across 100M internal enterprise documents with strict role-based access control (RBAC).',
      keyConcepts: [
        'Hybrid Retrieval (Dense HNSW + BM25 Sparse)',
        'Cross-Encoder Reranking',
        'Tenant Namespace Sharding',
        'vLLM Continuous Batching',
        'Semantic Cache'
      ],
      modelAnswer:
        'Architecture comprises 5 core tiers:\n1. Ingestion Pipeline: Kafka queue → Document parsing/chunking (512 tokens with 10% overlap) → Metadata tagging (TenantId, ACL permissions, timestamp) → Text embedding via BGE-M3.\n2. Vector & Hybrid Store: Qdrant/Pinecone cluster partitioned by TenantId namespace. Hybrid search combines dense vector cosine distance with BM25 keyword index via Reciprocal Rank Fusion (RRF).\n3. Reranker & Guardrail: Top-100 candidates filtered by RBAC ACL, passed to Cohere/BGE cross-encoder to select top-5 most relevant passages.\n4. Caching: Redis semantic vector cache to instantly answer repeated queries in <5ms without LLM invocation.\n5. Inference: vLLM cluster with PagedAttention and continuous batching, streaming response tokens via Server-Sent Events (SSE).',
      interviewerTips: [
        'Probe on security/RBAC: How to prevent Tenant A from querying Tenant B embeddings.',
        'Probe on latency bottlenecks (Cross-encoder reranking vs LLM TTFT).'
      ],
      commonPitfalls: ['Ignoring document permission filtering before vector search (data privacy violation).']
    },
    {
      id: 'int-q6-03',
      title: 'KV-Cache Memory Footprint & PagedAttention Mechanics in vLLM',
      experienceBracket: '3-4y',
      experienceLabel: '3-4 Years (Senior / Systems Architect)',
      category: 'System Design & Architecture',
      difficulty: 'Hard',
      companyTags: ['NVIDIA', 'vLLM Core', 'Meta AI', 'Cerebras'],
      questionPrompt:
        'Calculate the exact KV-cache memory requirement for a Llama 3 70B model with context length 8,192 and batch size 32. How does PagedAttention solve memory fragmentation?',
      keyConcepts: ['KV-Cache Equation', 'PagedAttention Virtual Memory', 'Internal/External Fragmentation'],
      mathematicalDerivation: {
        formula: '\\text{Memory}_{KV} = 2 \\times N_{layers} \\times N_{kv\\_heads} \\times d_{head} \\times L_{ctx} \\times B \\times \\text{Bytes}',
        steps: [
          '1. Llama 3 70B params: N_{layers} = 80, d_{model} = 8192, N_{heads} = 64, N_{kv\\_heads} = 8 (Grouped Query Attention).',
          '2. Head dimension d_{head} = 8192 / 64 = 128.',
          '3. For Batch B = 32, Context L = 8192, FP16 (2 bytes):',
          '4. Memory = 2 × 80 × 8 × 128 × 8192 × 32 × 2 bytes = 85,899,345,920 bytes = 80 GB VRAM strictly for KV cache!'
        ]
      },
      modelAnswer:
        'In standard autoregressive generation, static pre-allocation of contiguous GPU memory for maximum sequence length causes 60-80% wasted memory due to internal fragmentation (memory reserved but unused) and external fragmentation. PagedAttention borrows virtual memory paging concepts from Operating Systems: it divides the KV cache into fixed-size physical blocks (e.g. 16 tokens per block) and maintains a block table, allowing non-contiguous GPU memory allocation and reducing memory waste to <4%.',
      interviewerTips: ['Check if candidate accounts for Grouped-Query Attention (n_kv_heads = 8 instead of 64).'],
      commonPitfalls: ['Using full n_heads instead of n_kv_heads in GQA models like Llama 3 / Mistral.']
    }
  ], []);

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchExp = selectedExperience === 'all' || q.experienceBracket === selectedExperience;
      const matchCat = selectedCategory === 'all' || q.category === selectedCategory;
      const matchSearch =
        !searchQuery ||
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.questionPrompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.companyTags.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchExp && matchCat && matchSearch;
    });
  }, [questions, selectedExperience, selectedCategory, searchQuery]);

  const activeMockQuestion = filteredQuestions[activeMockQuestionIndex] || filteredQuestions[0] || questions[0];

  const handleStartMockInterview = () => {
    setMockActive(true);
    setMockEvaluationResult(null);
    setUserAnswerText('');
    setActiveMockQuestionIndex(0);
  };

  const handleEvaluateAnswer = () => {
    if (!userAnswerText.trim()) return;
    setIsSubmittingAnswer(true);

    setTimeout(() => {
      const ansLower = userAnswerText.toLowerCase();
      const matched = activeMockQuestion.keyConcepts.filter((c) => ansLower.includes(c.toLowerCase().split(' ')[0]));
      const ratio = matched.length / (activeMockQuestion.keyConcepts.length || 1);

      const result: MockInterviewResult = {
        overallScore: Math.round(65 + ratio * 30),
        technicalAccuracy: Math.round(70 + ratio * 25),
        mathematicalDepth: activeMockQuestion.mathematicalDerivation ? (ansLower.includes('=') ? 92 : 68) : 85,
        systemDesignScore: 88,
        communicationScore: userAnswerText.length > 150 ? 90 : 75,
        strengths: [
          `Solid conceptual articulation of: ${matched.length > 0 ? matched.join(', ') : 'the fundamental mechanism'}.`,
          'Demonstrated clear technical vocabulary appropriate for the experience tier.'
        ],
        areasForImprovement: [
          'State exact mathematical bounds and time complexity during live interviews.',
          'Consider proactively mentioning memory trade-offs and production failure modes.'
        ],
        suggestedAnswerReview: activeMockQuestion.modelAnswer,
      };

      setMockEvaluationResult(result);
      setIsSubmittingAnswer(false);
    }, 1200);
  };

  return (
    <NexusShell>
      <div className="space-y-6 max-w-7xl mx-auto pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-purple-400 font-semibold">Interview Preparation</span>
        </div>

        {/* Hero Header */}
        <Card className="relative overflow-hidden rounded-3xl border-purple-500/20 bg-gradient-to-br from-purple-950/70 via-card to-indigo-950/40 p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Career Readiness Center
                </span>
                <span className="text-xs text-muted-foreground font-mono">0 to 4 Years Experience Mastery</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                AI & ML Engineering Interview Mastery (0–4 Yrs)
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Crush technical, mathematical derivation, and system design rounds at top AI labs and tier-1 product companies. Practice with our interactive AI Mock Interview Simulator and master exact mathematical proofs.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button
                onClick={handleStartMockInterview}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs h-11 px-5 rounded-2xl shadow-lg shadow-purple-950/50 gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Launch AI Mock Interviewer</span>
              </Button>

              <Link href="/careers" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto bg-card border-border hover:bg-secondary text-foreground font-bold text-xs h-11 px-4 rounded-2xl gap-2 cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-purple-400" />
                  <span>Browse Job Openings</span>
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* ── EXPERIENCE TIER SELECTOR BAR (0-1y, 1-2y, 3-4y) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {[
            { id: 'all', title: 'All Experience Levels', desc: '0 - 4 Years Full Spectrum', badge: '50+ Questions' },
            { id: '0-1y', title: '0–1 Yrs (Entry / Freshers)', desc: 'Math, Python internals, Core ML', badge: 'Foundational' },
            { id: '1-2y', title: '1–2 Yrs (Junior / Applied)', desc: 'PyTorch, Attention, LoRA, APIs', badge: 'Applied ML' },
            { id: '3-4y', title: '3–4 Yrs (Mid-Senior / Arch)', desc: 'vLLM, KV-Cache, DDP/FSDP, RAG', badge: 'System Design' },
          ].map((tier) => {
            const isSelected = selectedExperience === tier.id;
            return (
              <button
                key={tier.id}
                onClick={() => setSelectedExperience(tier.id as any)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1.5 ${
                  isSelected
                    ? 'bg-purple-600/15 border-purple-500 shadow-md shadow-purple-950/30 ring-2 ring-purple-500/20'
                    : 'bg-card border-border hover:border-purple-500/30 hover:bg-secondary/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isSelected ? 'text-purple-300' : 'text-foreground'}`}>
                    {tier.title}
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground font-semibold">
                    {tier.badge}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">{tier.desc}</p>
              </button>
            );
          })}
        </div>

        {/* ── AI MOCK INTERVIEW SIMULATOR ARENA ── */}
        {mockActive && (
          <Card className="p-6 bg-card border-purple-500/30 rounded-3xl space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Interactive AI Technical Interview Simulator</h3>
                  <span className="text-[10px] font-mono text-purple-400">
                    Question {activeMockQuestionIndex + 1} of {filteredQuestions.length} • {activeMockQuestion.experienceLabel}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMockActive(false)}
                  className="text-xs h-8 rounded-xl"
                >
                  Exit Simulator
                </Button>
              </div>
            </div>

            {/* Question Box */}
            <div className="p-5 bg-secondary/50 rounded-2xl border border-border space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 font-bold text-[10px] font-mono rounded">
                  {activeMockQuestion.category}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Building2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Frequently asked by: <strong>{activeMockQuestion.companyTags.join(', ')}</strong></span>
                </div>
              </div>
              <h4 className="text-base font-bold text-foreground leading-snug">{activeMockQuestion.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed pt-1 border-t border-border">
                {activeMockQuestion.questionPrompt}
              </p>
            </div>

            {/* Candidate Response Workspace */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-foreground flex items-center justify-between">
                <span>Your Technical Response & Explanation:</span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {userAnswerText.trim() ? `${userAnswerText.trim().split(/\s+/).length} words` : '0 words'}
                </span>
              </label>

              <textarea
                rows={5}
                value={userAnswerText}
                onChange={(e) => setUserAnswerText(e.target.value)}
                placeholder="Type your structured engineering answer here... Include mathematical formulas, architectural tradeoffs, and code logic where relevant."
                className="w-full p-4 bg-secondary border border-border rounded-2xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/40 font-mono leading-relaxed"
              />

              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>AI Evaluates: Technical Accuracy, Mathematical Rigor, System Scalability, Communication</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleEvaluateAnswer}
                    disabled={!userAnswerText.trim() || isSubmittingAnswer}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-9 px-4 rounded-xl gap-1.5 shadow-md cursor-pointer"
                  >
                    {isSubmittingAnswer ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>{isSubmittingAnswer ? 'Evaluating Response...' : 'Submit to AI Interviewer'}</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* AI Evaluation Report */}
            {mockEvaluationResult && (
              <div className="p-6 bg-gradient-to-br from-purple-950/40 via-secondary/60 to-emerald-950/20 border border-purple-500/30 rounded-2xl space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-border pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <h4 className="text-sm font-bold text-foreground">AI Technical Interview Scorecard</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-mono">Overall Score:</span>
                    <span className="text-xl font-extrabold text-purple-400 font-mono">
                      {mockEvaluationResult.overallScore}/100
                    </span>
                  </div>
                </div>

                {/* 4 Score Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-card border border-border rounded-xl">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase block">Technical Accuracy</span>
                    <span className="text-base font-extrabold text-emerald-400 font-mono">{mockEvaluationResult.technicalAccuracy}%</span>
                  </div>
                  <div className="p-3 bg-card border border-border rounded-xl">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase block">Math Rigor</span>
                    <span className="text-base font-extrabold text-purple-400 font-mono">{mockEvaluationResult.mathematicalDepth}%</span>
                  </div>
                  <div className="p-3 bg-card border border-border rounded-xl">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase block">System Design</span>
                    <span className="text-base font-extrabold text-blue-400 font-mono">{mockEvaluationResult.systemDesignScore}%</span>
                  </div>
                  <div className="p-3 bg-card border border-border rounded-xl">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase block">Communication</span>
                    <span className="text-base font-extrabold text-amber-400 font-mono">{mockEvaluationResult.communicationScore}%</span>
                  </div>
                </div>

                {/* Strengths & Improvement Areas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-1.5">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Candidate Strengths:
                    </span>
                    <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                      {mockEvaluationResult.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1.5">
                    <span className="font-bold text-amber-400 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" /> Growth Recommendations:
                    </span>
                    <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                      {mockEvaluationResult.areasForImprovement.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Model Answer Breakdown */}
                <div className="p-4 bg-card border border-border rounded-xl space-y-2 text-xs">
                  <span className="font-bold text-purple-400 block">✨ Industry Benchmark Model Answer:</span>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {mockEvaluationResult.suggestedAnswerReview}
                  </p>
                </div>

                {/* Next Question Navigation */}
                <div className="flex items-center justify-end gap-2 pt-2">
                  {activeMockQuestionIndex < filteredQuestions.length - 1 ? (
                    <Button
                      onClick={() => {
                        setActiveMockQuestionIndex((prev) => prev + 1);
                        setUserAnswerText('');
                        setMockEvaluationResult(null);
                      }}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-8 px-4 rounded-xl cursor-pointer"
                    >
                      <span>Next Interview Question →</span>
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setMockActive(false)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-8 px-4 rounded-xl cursor-pointer"
                    >
                      <span>Complete Mock Interview Session</span>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </Card>
        )}

        {/* ── QUESTION BANK & DERIVATIONS ACCORDION ── */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
            <div>
              <h2 className="text-lg font-bold text-foreground">Curated AI & ML Interview Question Bank</h2>
              <p className="text-xs text-muted-foreground">Detailed mathematical derivations, code recipes, and interviewer cheat-sheets.</p>
            </div>

            {/* Search & Category Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions or company..."
                  className="pl-8 bg-secondary border-border text-foreground text-xs h-8 w-48 sm:w-60 rounded-xl"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-secondary border border-border text-foreground text-xs rounded-xl p-1.5 font-medium"
              >
                <option value="all">All Topics</option>
                <option value="Cybersecurity & AI Defense">🛡️ Cybersecurity + AI</option>
                <option value="ML Mathematics & Theory">ML Math & Theory</option>
                <option value="Deep Learning & LLMs">Deep Learning & LLMs</option>
                <option value="System Design & Architecture">System Design</option>
              </select>
            </div>
          </div>

          {/* Question List */}
          <div className="space-y-3">
            {filteredQuestions.map((q) => {
              const isExpanded = expandedQuestionId === q.id;
              return (
                <Card
                  key={q.id}
                  className={`p-5 bg-card border transition-all rounded-2xl space-y-3 ${
                    isExpanded ? 'border-purple-500/40 shadow-lg shadow-purple-950/20' : 'border-border hover:border-border'
                  }`}
                >
                  <div
                    onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                    className="flex items-start justify-between gap-4 cursor-pointer"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 text-[10px] font-bold font-mono rounded ${
                          q.experienceBracket === '0-1y'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                            : q.experienceBracket === '1-2y'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                            : 'bg-purple-500/15 text-purple-400 border border-purple-500/20'
                        }`}>
                          {q.experienceBracket.toUpperCase()} • {q.difficulty}
                        </span>

                        <span className="text-[10px] font-mono text-muted-foreground">{q.category}</span>

                        <div className="flex items-center gap-1 flex-wrap">
                          {q.companyTags.map((c) => (
                            <span key={c} className="text-[9px] px-1.5 py-0.5 bg-secondary text-muted-foreground rounded font-mono">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>

                      <h3 className="text-sm font-bold text-foreground leading-snug">{q.title}</h3>
                    </div>

                    <button className="p-1 text-muted-foreground hover:text-foreground">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-border space-y-4 text-xs animate-in fade-in duration-150">
                      {/* Question Prompt */}
                      <div className="p-3.5 bg-secondary/60 rounded-xl border border-border text-muted-foreground leading-relaxed">
                        <strong className="text-foreground block mb-0.5">Interviewer Question Prompt:</strong>
                        {q.questionPrompt}
                      </div>

                      {/* Mathematical Derivation if exists */}
                      {q.mathematicalDerivation && (
                        <div className="p-4 bg-purple-950/30 border border-purple-500/30 rounded-xl space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 font-mono block">
                            📐 Mathematical Derivation & Proof:
                          </span>
                          <div className="p-2.5 bg-black/60 rounded-lg text-xs text-purple-200 border border-purple-500/20 overflow-x-auto text-center">
                            <MathRenderer math={q.mathematicalDerivation.formula} block />
                          </div>
                          <ul className="space-y-1 text-muted-foreground list-none pl-1">
                            {q.mathematicalDerivation.steps.map((step, idx) => (
                              <li key={idx} className="font-mono text-[11px]">{step}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Model Answer */}
                      <div className="space-y-1">
                        <strong className="text-emerald-400 block">✨ Gold Standard Model Answer:</strong>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line pl-3 border-l-2 border-emerald-500/40">
                          {q.modelAnswer}
                        </p>
                      </div>

                      {/* Code Snippet if exists */}
                      {q.codeSnippet && (
                        <div className="space-y-1.5">
                          <strong className="text-foreground block">💻 PyTorch / Python Implementation:</strong>
                          <pre className="p-3.5 bg-zinc-950 rounded-xl font-mono text-[11px] text-emerald-300 border border-border overflow-x-auto">
                            <code>{q.codeSnippet.code}</code>
                          </pre>
                        </div>
                      )}

                      {/* Interviewer Tips & Pitfalls */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="p-3 bg-secondary/40 rounded-xl border border-border space-y-1">
                          <span className="font-bold text-foreground block text-[11px]">💡 What Interviewers Look For:</span>
                          <ul className="space-y-1 text-muted-foreground list-disc list-inside text-[11px]">
                            {q.interviewerTips.map((tip, i) => (
                              <li key={i}>{tip}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3 bg-secondary/40 rounded-xl border border-border space-y-1">
                          <span className="font-bold text-rose-400 block text-[11px]">⚠️ Common Red Flags / Pitfalls:</span>
                          <ul className="space-y-1 text-muted-foreground list-disc list-inside text-[11px]">
                            {q.commonPitfalls.map((p, i) => (
                              <li key={i}>{p}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </NexusShell>
  );
}
