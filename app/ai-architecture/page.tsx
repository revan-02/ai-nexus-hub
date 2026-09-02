'use client';

import React, { useState } from 'react';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cpu, Layers, Layers3, ChevronRight, Sparkles, Server, Database, Code, ShieldCheck, ArrowDown } from 'lucide-react';
import Link from 'next/link';
import { DeepMathAndLLMBuilder } from '@/components/learning/deep-math-and-llm-builder';

interface ArchLayer {
  id: string;
  level: string;
  name: string;
  desc: string;
  tech: string[];
  examples: string[];
  algorithms: string[];
}

export default function AIArchitecturePage() {
  const [selectedLayer, setSelectedLayer] = useState<string>('L5');

  const layers: ArchLayer[] = [
    {
      id: 'L5',
      level: 'Layer 5',
      name: 'Application Layer',
      desc: 'User-facing AI applications, agents, RAG systems, multimodal chat assistants and enterprise integrations.',
      tech: ['Next.js', 'FastAPI', 'LangChain', 'LlamaIndex', 'AutoGPT'],
      examples: ['AI Nexus Copilot', 'Medical Imaging Agent', 'Automated Code Reviewer'],
      algorithms: ['Retrieval Augmented Generation (RAG)', 'Tool Calling Agents', 'Prompt Chaining'],
    },
    {
      id: 'L4',
      level: 'Layer 4',
      name: 'Model Layer',
      desc: 'Foundation Large Language Models (LLMs), Vision Transformers, Diffusion Models, and specialized neural network architectures.',
      tech: ['Gemini 1.5 Pro', 'GPT-4o', 'Claude 3.5', 'Llama 3 70B', 'Stable Diffusion 3'],
      examples: ['Zero-Shot Classification', 'Multimodal Vision-Language Inference', 'Fine-Tuned LORA Weights'],
      algorithms: ['Self-Attention Mechanism', 'RLHF / DPO Alignment', 'Mixture of Experts (MoE)'],
    },
    {
      id: 'L3',
      level: 'Layer 3',
      name: 'Framework Layer',
      desc: 'Deep learning frameworks, tensor computation libraries, neural network abstraction APIs, and training harnesses.',
      tech: ['PyTorch 2.4', 'TensorFlow 2.16', 'JAX / Flax', 'Hugging Face Transformers', 'vLLM'],
      examples: ['Automatic Differentiation', 'FlashAttention-2 Kernel', 'Model Quantization (INT8/INT4)'],
      algorithms: ['Backpropagation', 'AdamW Optimizer', 'Stochastic Gradient Descent (SGD)'],
    },
    {
      id: 'L2',
      level: 'Layer 2',
      name: 'Data Layer',
      desc: 'High-throughput data pipelines, vector databases, feature stores, tokenizers, and synthetic data generators.',
      tech: ['Pinecone', 'Qdrant', 'Milvus', 'Apache Spark', 'Feast Feature Store'],
      examples: ['HNSW Vector Indexing', 'BPE Tokenization', 'Embedding Pipeline'],
      algorithms: ['Cosine Similarity', 'Hierarchical Navigable Small World (HNSW)', 'TF-IDF'],
    },
    {
      id: 'L1',
      level: 'Layer 1',
      name: 'Infrastructure Layer',
      desc: 'High-performance hardware accelerators, GPU clusters, TPU pods, CUDA runtimes, and distributed training orchestration.',
      tech: ['NVIDIA H100 SXM', 'Google TPU v5p', 'CUDA 12.4', 'Kubernetes / Ray', 'NCCL'],
      examples: ['Distributed Data Parallel (DDP)', 'Tensor Parallelism (TP)', 'Pipeline Parallelism (PP)'],
      algorithms: ['Ring-AllReduce Communication', 'Memory Efficient PagedAttention', 'Kernel Fusion'],
    },
  ];

  const activeLayerData = layers.find((l) => l.id === selectedLayer) || layers[0];

  return (
    <NexusShell>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-purple-400 font-semibold">AI Architecture</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">AI System Architecture</h1>
              <Cpu className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Explore the end-to-end stack: from silicon infrastructure up to multimodal generative applications.
            </p>
          </div>

          <Link href="/ai-architecture/weights-and-encoding">
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs h-10 px-4 rounded-xl shadow-lg flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              Interactive Weight, Bias & Encoding Demo
            </Button>
          </Link>
        </div>

        {/* AI -> ML -> DL -> GenAI Hierarchy Card */}
        <Card className="p-6 bg-card border-border rounded-2xl space-y-4">
          <h2 className="text-base font-bold text-foreground">Artificial Intelligence Paradigm Hierarchy</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center text-xs">
            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-1">
              <span className="font-bold text-purple-400 text-sm block">Artificial Intelligence</span>
              <p className="text-[11px] text-muted-foreground">Broad science of mimicking human intelligence & logic.</p>
            </div>
            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-1">
              <span className="font-bold text-indigo-400 text-sm block">Machine Learning</span>
              <p className="text-[11px] text-muted-foreground">Statistical algorithms learning patterns directly from data.</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 space-y-1">
              <span className="font-bold text-blue-400 text-sm block">Deep Learning</span>
              <p className="text-[11px] text-muted-foreground">Multi-layer artificial neural network representations.</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1">
              <span className="font-bold text-emerald-400 text-sm block">Generative AI</span>
              <p className="text-[11px] text-muted-foreground">Models creating new text, code, audio & synthetic media.</p>
            </div>
          </div>
        </Card>

        {/* 5-Layer Stack Interactive Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Layer Selector Stack (Left 5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-sm font-bold text-foreground">5-Layer Enterprise Stack</h3>
            <div className="space-y-2">
              {layers.map((l) => {
                const isSelected = selectedLayer === l.id;
                return (
                  <button
                    key={l.id}
                    onClick={() => setSelectedLayer(l.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-purple-600/15 border-purple-500/50 shadow-lg shadow-purple-900/20'
                        : 'bg-card border-border hover:bg-secondary'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl font-bold font-mono text-xs flex items-center justify-center ${
                        isSelected ? 'bg-purple-600 text-white' : 'bg-secondary text-muted-foreground'
                      }`}>
                        {l.id}
                      </div>
                      <div>
                        <span className={`text-xs font-bold block ${isSelected ? 'text-purple-400' : 'text-foreground'}`}>
                          {l.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{l.level}</span>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-90 text-purple-400' : 'text-muted-foreground'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Layer Details (Right 7 Cols) */}
          <Card className="lg:col-span-7 p-6 bg-card border-border rounded-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 bg-purple-500/20 text-purple-400 font-mono text-xs font-bold rounded-lg border border-purple-500/30">
                  {activeLayerData.id}
                </span>
                <h3 className="text-base font-bold text-foreground">{activeLayerData.name}</h3>
              </div>
              <span className="text-xs text-muted-foreground font-mono">{activeLayerData.level}</span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">{activeLayerData.desc}</p>

            {/* Tech Stack Pills */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-foreground block">Key Technologies & Standards</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {activeLayerData.tech.map((t) => (
                  <span key={t} className="px-2.5 py-1 bg-secondary border border-border text-foreground text-xs font-mono rounded-lg">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Core Algorithms */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-foreground block">Core Algorithms & Mechanics</span>
              <div className="space-y-1">
                {activeLayerData.algorithms.map((algo) => (
                  <div key={algo} className="p-2.5 bg-secondary/50 border border-border rounded-xl text-xs flex items-center justify-between">
                    <span className="font-semibold text-foreground">{algo}</span>
                    <Link href="/algorithms" className="text-[10px] text-purple-400 hover:underline">Explore Algorithm →</Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Real World Applications */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-foreground block">Production Applications</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-xs">
                {activeLayerData.examples.map((ex) => (
                  <div key={ex} className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-xl font-medium text-foreground">
                    {ex}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* ── Deep Mathematical Foundations & Interactive LLM Studio ── */}
        <div className="pt-6 border-t border-border">
          <DeepMathAndLLMBuilder />
        </div>
      </div>
    </NexusShell>
  );
}
