'use client';

import React, { useState } from 'react';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { AdminShell } from '@/components/layout/admin-shell';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wrench, Search, ChevronRight, Star, ExternalLink, SlidersHorizontal, Check } from 'lucide-react';
import Link from 'next/link';

export default function AIToolsPage() {
  const { data: session } = useSession();
  const userRole = (session?.user as { role?: string })?.role || 'User';
  const isAdmin = ['Admin', 'Manager', 'Super Admin'].includes(userRole);
  const Shell = isAdmin ? AdminShell : NexusShell;

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Deep Learning', 'NLP & LLMs', 'MLOps & Tracking', 'Computer Vision', 'Data Science'];

  const tools = [
    {
      name: 'PyTorch',
      category: 'Deep Learning',
      rating: '4.9',
      pricing: '100% Open Source',
      popularity: '98.5k ★',
      desc: 'Industry-standard open-source machine learning framework by the Linux Foundation and Meta, accelerating deep learning from research prototyping to scalable GPU production.',
      tags: ['Tensors', 'Autograd', 'CUDA', 'TorchScript'],
      website: 'https://pytorch.org',
    },
    {
      name: 'TensorFlow',
      category: 'Deep Learning',
      rating: '4.8',
      pricing: '100% Open Source',
      popularity: '186k ★',
      desc: 'End-to-end open-source machine learning platform developed by Google for high-performance numerical computation, distributed training, and edge deployment (TF Lite).',
      tags: ['Keras', 'TF Serving', 'TensorBoard', 'TFLite'],
      website: 'https://www.tensorflow.org',
    },
    {
      name: 'Hugging Face Transformers',
      category: 'NLP & LLMs',
      rating: '4.9',
      pricing: 'Open Source / Cloud',
      popularity: '135k ★',
      desc: 'State-of-the-art transformer architecture library providing tens of thousands of pretrained models for natural language, computer vision, multimodal, and speech tasks.',
      tags: ['LLMs', 'Model Hub', 'Tokenizers', 'PEFT'],
      website: 'https://huggingface.co/docs/transformers',
    },
    {
      name: 'LangChain & LangGraph',
      category: 'NLP & LLMs',
      rating: '4.7',
      pricing: '100% Open Source',
      popularity: '94k ★',
      desc: 'Comprehensive orchestration framework for developing complex agentic applications powered by large language models, structured memory, and cyclic execution graphs.',
      tags: ['Agents', 'RAG', 'Chains', 'LangGraph'],
      website: 'https://www.langchain.com',
    },
    {
      name: 'LlamaIndex',
      category: 'NLP & LLMs',
      rating: '4.8',
      pricing: '100% Open Source',
      popularity: '38k ★',
      desc: 'Specialized data framework for ingesting, structuring, chunking, and accessing private data sources to build high-accuracy Retrieval-Augmented Generation (RAG) engines.',
      tags: ['RAG', 'Data Loaders', 'Vector Index', 'Query Engine'],
      website: 'https://www.llamaindex.ai',
    },
    {
      name: 'vLLM',
      category: 'NLP & LLMs',
      rating: '4.9',
      pricing: '100% Open Source',
      popularity: '36k ★',
      desc: 'High-throughput and low-latency LLM serving engine featuring PagedAttention for continuous batching and efficient GPU memory allocation.',
      tags: ['PagedAttention', 'Inference', 'Fast Serving', 'CUDA'],
      website: 'https://docs.vllm.ai',
    },
    {
      name: 'Ollama',
      category: 'Deep Learning',
      rating: '4.9',
      pricing: '100% Open Source',
      popularity: '115k ★',
      desc: 'Lightweight CLI and local runtime allowing developers to run, pull, and customize open models (LLaMA-3, DeepSeek-R1, Mistral) on laptops and workstations with zero setup.',
      tags: ['Local LLMs', 'Modelfiles', 'Quantization', 'Private AI'],
      website: 'https://ollama.com',
    },
    {
      name: 'OpenCV',
      category: 'Computer Vision',
      rating: '4.8',
      pricing: '100% Open Source',
      popularity: '78k ★',
      desc: 'The world’s most popular open-source computer vision and machine learning software library with over 2,500 optimized algorithms for real-time video and image processing.',
      tags: ['Object Detection', 'Image Processing', 'Video Telemetry', 'C++/Python'],
      website: 'https://opencv.org',
    },
    {
      name: 'MediaPipe',
      category: 'Computer Vision',
      rating: '4.8',
      pricing: '100% Open Source',
      popularity: '26k ★',
      desc: 'Cross-platform framework by Google delivering customizable on-device ML solutions for face mesh, hand tracking, pose estimation, and gesture recognition.',
      tags: ['Face Mesh', 'Pose Tracking', 'On-Device', 'Real-Time'],
      website: 'https://ai.google.dev/edge/mediapipe/solutions/guide',
    },
    {
      name: 'Weights & Biases (W&B)',
      category: 'MLOps & Tracking',
      rating: '4.8',
      pricing: 'Freemium',
      popularity: '18k ★',
      desc: 'Enterprise platform for tracking hyperparameters, system metrics, datasets, and models across distributed machine learning training runs.',
      tags: ['Experiment Tracking', 'Artifacts', 'Sweeps', 'Model Registry'],
      website: 'https://wandb.ai',
    },
    {
      name: 'MLflow',
      category: 'MLOps & Tracking',
      rating: '4.7',
      pricing: '100% Open Source',
      popularity: '19k ★',
      desc: 'Open-source platform by Databricks for managing the entire machine learning lifecycle, including experimentation, reproducibility, deployment, and model registry.',
      tags: ['Model Registry', 'Deployment', 'Lifecycle', 'Tracking'],
      website: 'https://mlflow.org',
    },
    {
      name: 'Scikit-learn',
      category: 'Data Science',
      rating: '4.9',
      pricing: '100% Open Source',
      popularity: '58k ★',
      desc: 'Simple and efficient tools for predictive data analysis, built on NumPy, SciPy, and matplotlib for classification, regression, and clustering algorithms.',
      tags: ['Classification', 'Regression', 'Clustering', 'Feature Engineering'],
      website: 'https://scikit-learn.org',
    },
    {
      name: 'Qdrant',
      category: 'NLP & LLMs',
      rating: '4.9',
      pricing: 'Open Source / Cloud',
      popularity: '22k ★',
      desc: 'High-performance vector database and search engine built in Rust with extended filtering support, payload indexes, and sub-millisecond similarity search.',
      tags: ['Vector DB', 'Semantic Search', 'HNSW', 'Rust'],
      website: 'https://qdrant.tech',
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
    <Shell>
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
    </Shell>
  );
}
