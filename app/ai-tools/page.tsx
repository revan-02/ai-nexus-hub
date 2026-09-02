'use client';

import React, { useState } from 'react';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wrench, Search, ChevronRight, Star, ExternalLink, SlidersHorizontal, Check } from 'lucide-react';
import Link from 'next/link';

export default function AIToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Deep Learning', 'NLP & LLMs', 'MLOps & Tracking', 'Computer Vision', 'Data Science'];

  const tools = [
    {
      name: 'PyTorch',
      category: 'Deep Learning',
      rating: '4.9',
      pricing: 'Open Source',
      popularity: '98.5k ★',
      desc: 'An open source machine learning framework that accelerates the path from research prototyping to production deployment.',
      tags: ['Tensors', 'Autograd', 'CUDA', 'TorchScript'],
      website: 'https://pytorch.org',
    },
    {
      name: 'Hugging Face Transformers',
      category: 'NLP & LLMs',
      rating: '4.9',
      pricing: 'Open Source / Cloud',
      popularity: '124k ★',
      desc: 'State-of-the-art Machine Learning for PyTorch, TensorFlow, and JAX. Pretrained models for NLP, Vision & Audio.',
      tags: ['LLMs', 'Model Hub', 'Tokenizers', 'PEFT'],
      website: 'https://huggingface.co',
    },
    {
      name: 'LangChain & LangGraph',
      category: 'NLP & LLMs',
      rating: '4.7',
      pricing: 'Open Source',
      popularity: '89k ★',
      desc: 'Framework for developing applications powered by language models with stateful multi-actor agent orchestration.',
      tags: ['Agents', 'RAG', 'Chains', 'VectorStores'],
      website: 'https://langchain.com',
    },
    {
      name: 'Weights & Biases (W&B)',
      category: 'MLOps & Tracking',
      rating: '4.8',
      pricing: 'Freemium',
      popularity: '18k ★',
      desc: 'Developer platform for AI performance visualization, hyperparameter tuning, experiment tracking and model registry.',
      tags: ['Experiment Tracking', 'Artifacts', 'Sweeps', 'Model Registry'],
      website: 'https://wandb.ai',
    },
  ];

  const filtered = tools.filter((t) => {
    if (selectedCategory !== 'All' && t.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <NexusShell>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-purple-400 font-semibold">AI Tools</span>
        </div>

        {/* Header */}
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">AI Tools & Framework Directory</h1>
            <Wrench className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Discover, compare, and integrate leading machine learning frameworks, LLM orchestrators, and MLOps platforms.
          </p>
        </div>

        {/* Categories & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                  selectedCategory === cat
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
              placeholder="Search AI tool..."
              className="pl-9 pr-4 py-1.5 h-8 text-xs bg-secondary border-border text-foreground rounded-xl"
            />
          </div>
        </div>

        {/* Tools Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((tool) => (
            <Card key={tool.name} className="p-6 bg-card border-border rounded-2xl space-y-4 hover:border-purple-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-400 text-xs font-bold rounded-lg font-mono">
                      {tool.category}
                    </span>
                    <span className="px-2 py-0.5 bg-secondary text-foreground text-[10px] font-bold rounded border border-border">
                      {tool.pricing}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-400 font-mono">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{tool.rating}</span>
                    <span className="text-muted-foreground font-normal">({tool.popularity})</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-foreground">{tool.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{tool.desc}</p>

                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {tool.tags.map((tg) => (
                    <span key={tg} className="px-2 py-0.5 bg-secondary text-foreground text-[10px] font-mono rounded border border-border">
                      {tg}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between">
                <Button variant="outline" className="bg-secondary border-border text-foreground text-xs h-8 px-3 rounded-xl">
                  Compare Tool
                </Button>
                <a
                  href={tool.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-purple-400 hover:underline font-semibold"
                >
                  <span>Official Site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </NexusShell>
  );
}
