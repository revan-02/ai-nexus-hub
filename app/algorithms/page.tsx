'use client';

import React, { useState } from 'react';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Code2, Search, ChevronRight, Play, Copy, Check, Sparkles, Cpu, BookOpen, Baby, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { InteractiveAlgorithmPlayground } from '@/components/learning/interactive-algorithm-playground';

interface AlgoItem {
  id: string;
  name: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeComplexity: string;
  spaceComplexity: string;
  desc: string;
  math: string;
  pseudocode: string;
  pythonCode: string;
  useCases: string[];
}

export default function AlgorithmsPage() {
  const [viewMode, setViewMode] = useState<'playground' | 'technical'>('playground');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlgo, setSelectedAlgo] = useState<string>('algo-1');
  const [codeTab, setCodeTab] = useState<'python' | 'pseudocode'>('python');
  const [copied, setCopied] = useState(false);

  const algos: AlgoItem[] = [
    {
      id: 'algo-1',
      name: 'Transformer Self-Attention Mechanism',
      category: 'Deep Learning / NLP',
      difficulty: 'Hard',
      timeComplexity: 'O(N² · d)',
      spaceComplexity: 'O(N²)',
      desc: 'Computes query-key compatibility matrix to weigh sequence tokens dynamically across all positions simultaneously.',
      math: 'Attention(Q, K, V) = softmax((Q Kᵀ) / √dₖ) V',
      pseudocode: `function SelfAttention(Q, K, V):
    scores = MatMul(Q, Transpose(K)) / sqrt(d_k)
    weights = Softmax(scores, dim=-1)
    output = MatMul(weights, V)
    return output`,
      pythonCode: `import torch
import torch.nn as nn
import math

def self_attention(Q, K, V, mask=None):
    d_k = Q.size(-1)
    scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(d_k)
    if mask is not None:
        scores = scores.masked_fill(mask == 0, -1e9)
    p_attn = torch.softmax(scores, dim=-1)
    return torch.matmul(p_attn, V), p_attn

# Example Query, Key, Value tensors
batch, seq_len, d_model = 2, 8, 64
Q = K = V = torch.randn(batch, seq_len, d_model)
output, weights = self_attention(Q, K, V)
print("Output shape:", output.shape)`,
      useCases: ['LLM Sequence Modeling', 'Vision Transformers (ViT)', 'Neural Machine Translation'],
    },
    {
      id: 'algo-2',
      name: 'K-Means Clustering',
      category: 'Machine Learning',
      difficulty: 'Easy',
      timeComplexity: 'O(k · n · d · i)',
      spaceComplexity: 'O(k + n)',
      desc: 'Partitions n data points into k clusters where each point belongs to the cluster with the nearest centroid mean.',
      math: 'arg min_S ∑_{i=1}^k ∑_{x ∈ S_i} ||x - μ_i||²',
      pseudocode: `function KMeans(X, k, max_iter):
    centroids = RandomSelect(X, k)
    repeat max_iter times:
        assignments = AssignToNearest(X, centroids)
        centroids = ComputeMeans(X, assignments)
    return centroids, assignments`,
      pythonCode: `import numpy as np

def kmeans(X, k, max_iters=100):
    centroids = X[np.random.choice(X.shape[0], k, replace=False)]
    for _ in range(max_iters):
        distances = np.linalg.norm(X[:, np.newaxis] - centroids, axis=2)
        labels = np.argmin(distances, axis=1)
        new_centroids = np.array([X[labels == i].mean(axis=0) for i in range(k)])
        if np.all(centroids == new_centroids):
            break
        centroids = new_centroids
    return centroids, labels

# Test K-Means
data = np.random.randn(100, 2)
centroids, labels = kmeans(data, k=3)
print("Centroids:", centroids)`,
      useCases: ['Customer Segmentation', 'Image Color Quantization', 'Anomaly Detection'],
    },
    {
      id: 'algo-3',
      name: 'Adam Optimizer (Adaptive Moment Estimation)',
      category: 'Optimization',
      difficulty: 'Medium',
      timeComplexity: 'O(d)',
      spaceComplexity: 'O(d)',
      desc: 'Combines momentum and RMSProp algorithms to calculate adaptive learning rates for each neural network parameter.',
      math: 'm_t = β₁ m_{t-1} + (1-β₁) g_t,   v_t = β₂ v_{t-1} + (1-β₂) g_t²',
      pseudocode: `function AdamUpdate(w, g, m, v, t, lr, b1, b2, eps):
    m = b1 * m + (1 - b1) * g
    v = b2 * v + (1 - b2) * (g ** 2)
    m_hat = m / (1 - b1 ** t)
    v_hat = v / (1 - b2 ** t)
    w = w - lr * m_hat / (sqrt(v_hat) + eps)
    return w, m, v`,
      pythonCode: `import numpy as np

class AdamOptimizer:
    def __init__(self, lr=0.001, beta1=0.9, beta2=0.999, eps=1e-8):
        self.lr, self.beta1, self.beta2, self.eps = lr, beta1, beta2, eps
        self.m, self.v, self.t = 0, 0, 0

    def step(self, w, grad):
        self.t += 1
        self.m = self.beta1 * self.m + (1 - self.beta1) * grad
        self.v = self.beta2 * self.v + (1 - self.beta2) * (grad ** 2)
        m_hat = self.m / (1 - self.beta1 ** self.t)
        v_hat = self.v / (1 - self.beta2 ** self.t)
        return w - self.lr * m_hat / (np.sqrt(v_hat) + self.eps)`,
      useCases: ['Deep Learning Training', 'Transformer Fine-Tuning', 'Diffusion Model Optimization'],
    },
  ];

  const filteredAlgos = algos.filter((a) => {
    if (activeCategory !== 'All' && !a.category.includes(activeCategory)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return a.name.toLowerCase().includes(q) || a.category.toLowerCase().includes(q);
    }
    return true;
  });

  const activeAlgo = algos.find((a) => a.id === selectedAlgo) || algos[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <NexusShell>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-purple-400 font-semibold">Algorithms</span>
        </div>

        {/* Header with 7th-Grade Playground Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">AI & Machine Learning Algorithms</h1>
              <Code2 className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Explore 7th-grade visual mental models or deep-dive into mathematical foundations and executable code.
            </p>
          </div>

          <div className="flex items-center p-1 bg-secondary border border-border rounded-xl">
            <button
              onClick={() => setViewMode('playground')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'playground'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Baby className="w-3.5 h-3.5" />
              <span>7th-Grade Visual Playground</span>
            </button>

            <button
              onClick={() => setViewMode('technical')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'technical'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Technical & Code Explorer</span>
            </button>
          </div>
        </div>

        {/* Render 7th-Grade Playground or Technical Explorer */}
        {viewMode === 'playground' ? (
          <InteractiveAlgorithmPlayground />
        ) : (
          <>
            {/* Categories & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-3">
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                {['All', 'Machine Learning', 'Deep Learning', 'Optimization', 'NLP', 'Computer Vision'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                      activeCategory === cat
                        ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-900/30'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search algorithm..."
                  className="pl-9 pr-4 py-1.5 h-8 text-xs bg-secondary border-border text-foreground rounded-xl"
                />
              </div>
            </div>

        {/* Main 2-Column Explorer Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* List of Algorithms (Left 4 Cols) */}
          <div className="lg:col-span-4 space-y-2">
            {filteredAlgos.map((a) => {
              const isSelected = selectedAlgo === a.id;
              return (
                <Card
                  key={a.id}
                  onClick={() => setSelectedAlgo(a.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-purple-600/15 border-purple-500/50 shadow-md shadow-purple-900/20'
                      : 'bg-card border-border hover:bg-secondary'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-purple-400 font-bold">{a.category}</span>
                    <span className="px-2 py-0.5 bg-secondary border border-border rounded text-[10px] font-semibold text-amber-400">
                      {a.difficulty}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground">{a.name}</h4>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground">
                    <span>Time: <strong className="text-foreground">{a.timeComplexity}</strong></span>
                    <span>Space: <strong className="text-foreground">{a.spaceComplexity}</strong></span>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Code & Theory Details (Right 8 Cols) */}
          <Card className="lg:col-span-8 p-6 bg-card border-border rounded-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <span className="text-xs font-bold text-purple-400 font-mono">{activeAlgo.category}</span>
                <h2 className="text-lg font-bold text-foreground mt-0.5">{activeAlgo.name}</h2>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-2.5 py-1 bg-secondary border border-border rounded-lg text-foreground font-bold">
                  Time: {activeAlgo.timeComplexity}
                </span>
                <span className="px-2.5 py-1 bg-secondary border border-border rounded-lg text-foreground font-bold">
                  Space: {activeAlgo.spaceComplexity}
                </span>
              </div>
            </div>

            {/* Explanation */}
            <p className="text-xs text-muted-foreground leading-relaxed">{activeAlgo.desc}</p>

            {/* Mathematical Formulation */}
            <div className="p-4 bg-secondary/60 border border-border rounded-xl space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Mathematical Formulation</span>
              <p className="font-mono text-xs text-purple-300 font-bold">{activeAlgo.math}</p>
            </div>

            {/* Code Playground */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 bg-secondary p-1 rounded-xl">
                  <button
                    onClick={() => setCodeTab('python')}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                      codeTab === 'python' ? 'bg-purple-600 text-white font-bold' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Python Implementation
                  </button>
                  <button
                    onClick={() => setCodeTab('pseudocode')}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                      codeTab === 'pseudocode' ? 'bg-purple-600 text-white font-bold' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Pseudocode
                  </button>
                </div>

                <button
                  onClick={() => handleCopy(codeTab === 'python' ? activeAlgo.pythonCode : activeAlgo.pseudocode)}
                  className="px-3 py-1.5 bg-secondary border border-border text-xs text-muted-foreground hover:text-foreground rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              <div className="p-4 bg-[#090b10] border border-border rounded-xl font-mono text-xs text-purple-200 overflow-x-auto leading-relaxed">
                <pre>{codeTab === 'python' ? activeAlgo.pythonCode : activeAlgo.pseudocode}</pre>
              </div>
            </div>

            {/* Practical Applications */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-foreground block">Real-World Industry Use Cases</span>
              <div className="flex items-center gap-2 flex-wrap">
                {activeAlgo.useCases.map((uc) => (
                  <span key={uc} className="px-3 py-1 bg-purple-950/30 border border-purple-500/20 text-purple-300 text-xs font-medium rounded-xl">
                    {uc}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </div>
        </>
        )}
      </div>
    </NexusShell>
  );
}
