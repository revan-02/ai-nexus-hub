'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Sparkles,
  Zap,
  BookOpen,
  Layers,
  Cpu,
  HelpCircle,
  Clock,
  ArrowRight,
  TrendingDown,
  Activity,
  Sliders,
  Search,
  CheckCircle2,
  ExternalLink,
  Bot,
  Brain,
  Video,
  ChevronRight,
  Briefcase,
  Calculator,
  Rocket,
  Terminal,
  Trophy
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { DeepMathAndLLMBuilder } from '@/components/learning/deep-math-and-llm-builder';
import { IndustryAIPlacementHighway } from '@/components/learning/industry-ai-placement-highway';

export type DifficultyLevel = 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';

export interface SuggestedVideo {
  id: string;
  title: string;
  duration: string; // e.g. "3:45" (must be <= 5 min)
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
  category: string;
  keyTakeaway: string;
  thumbnailGradient: string;
}

export interface VideoChapter {
  title: string;
  time: string;
  timestampSec: number;
  narrationScript: string;
  keyTakeaways: string[];
}

export interface LessonContent {
  id: string;
  title: string;
  difficulty: DifficultyLevel;
  category: string;
  duration: string; // e.g. "4:15" (max 5:00)
  videoTitle: string;
  youtubeEmbedUrl: string;
  videoChapters: VideoChapter[];
  eli5Analogy: string;
  technicalSummary: string;
  simulationType: 'NEURAL_PLAYGROUND' | 'ATTENTION_HEATMAP' | 'RAG_SIMULATOR' | 'DECISION_BOUNDARY';
  suggestedVideos: SuggestedVideo[];
}

interface MicroLearningPlayerProps {
  content?: Partial<LessonContent>;
  activeDifficulty?: DifficultyLevel;
  onDifficultyChange?: (level: DifficultyLevel) => void;
}

export function MicroLearningPlayer({
  content,
  activeDifficulty = 'INTERMEDIATE',
  onDifficultyChange,
}: MicroLearningPlayerProps) {
  // Video playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const totalDurationSec = 240; // 4:00 minutes (max 5 mins)
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [speechActive, setSpeechActive] = useState(false);
  const [videoMode, setVideoMode] = useState<'embedded_video' | 'interactive_canvas'>('interactive_canvas');
  const [activeTab, setActiveTab] = useState<'video' | 'simulation' | 'eli5' | 'suggested' | 'industry_gap' | 'math_studio' | 'curriculum'>('video');

  // Simulation 1: Neural Network Weights & Gradient Descent
  const [inputX, setInputX] = useState(1.5);
  const [targetY, setTargetY] = useState(0.85);
  const [weight, setWeight] = useState(0.65);
  const [bias, setBias] = useState(0.15);
  const [learningRate, setLearningRate] = useState(0.5);
  const [lossHistory, setLossHistory] = useState<{ step: number; loss: number }[]>([
    { step: 0, loss: 0.32 },
  ]);

  // Simulation 2: Prompt Tokenizer & Scaled Dot-Product Attention
  const [samplePrompt, setSamplePrompt] = useState('AI Agents design custom neural chips with attention');
  const [selectedTokenIdx, setSelectedTokenIdx] = useState<number | null>(0);

  // Simulation 3: RAG Semantic Vector Search
  const [ragQuery, setRagQuery] = useState('How does FlashAttention optimize GPU memory?');

  // Simulation 4: Decision Boundary
  const [boundarySlope, setBoundarySlope] = useState(1.2);
  const [boundaryIntercept, setBoundaryIntercept] = useState(0.5);

  // Dynamic lesson content based on selected difficulty
  const activeContent: LessonContent = useMemo(() => {
    if (activeDifficulty === 'BASIC') {
      return {
        id: 'lesson-basic-1',
        title: 'How AI Tools & ChatGPT Understand Human Words (5-Min Masterclass)',
        difficulty: 'BASIC',
        category: 'Everyday AI & Tools',
        duration: '3:30',
        videoTitle: 'Everyday AI: From Prompts to Intelligent Responses',
        youtubeEmbedUrl: 'https://www.youtube-nocookie.com/embed/aircAruvnKk?enablejsapi=1&rel=0',
        videoChapters: [
          {
            title: '1. What is an AI Tool & Token Streams',
            time: '0:00',
            timestampSec: 0,
            narrationScript: 'Welcome! An AI tool like ChatGPT does not read entire sentences at once. Instead, it breaks your sentence into tiny numerical chunks called tokens. The AI calculates probabilities to predict the most helpful next word in real time.',
            keyTakeaways: ['Words are sliced into subword tokens', 'Each token has a unique mathematical ID', 'Next-token probabilities guide the response']
          },
          {
            title: '2. The Magic of Prompt Engineering',
            time: '1:10',
            timestampSec: 70,
            narrationScript: 'When you give vague prompts, the AI gives generic answers. But when you provide a clear Role, Context, and Task constraints, the AI focuses its attention to produce exceptional, high-scoring responses.',
            keyTakeaways: ['Role: "Act as an expert biology tutor"', 'Context: "I am preparing for a 9th grade exam"', 'Task: "Explain photosynthesis with a pizza analogy"']
          },
          {
            title: '3. Visual AI & Image Diffusion Denoising',
            time: '2:15',
            timestampSec: 135,
            narrationScript: 'Generative image models like Midjourney and DALL-E work through diffusion. They start with pure random static noise and iteratively denoise it step-by-step into crisp, photorealistic artwork.',
            keyTakeaways: ['Step 1: Pure random Gaussian noise', 'Step 25: Outline and semantic shape formation', 'Step 50: Crystal-clear photorealistic render']
          },
          {
            title: '4. Safety Guardrails & Responsible AI',
            time: '3:00',
            timestampSec: 180,
            narrationScript: 'Before an AI response reaches your screen, safety guardrails and alignment filters inspect the output to prevent hallucinations, protect privacy, and ensure maximum helpfulness.',
            keyTakeaways: ['Automated safety classifier inspection', 'RLHF & DPO human alignment filters', 'Privacy protection and hallucination checks']
          },
        ],
        eli5Analogy:
          'Think of ChatGPT like an ultra-fast autocomplete on your smartphone, but it read every public library book in the world! When you type a word, it predicts the most helpful next word like a friendly digital assistant.',
        technicalSummary:
          'Generative AI models convert user prompts into token chunks and predict next-token probabilities based on contextual weights.',
        simulationType: 'ATTENTION_HEATMAP',
        suggestedVideos: [
          {
            id: 'v-1',
            title: 'How Midjourney & DALL-E Paint with Words',
            duration: '3:15',
            difficulty: 'Basic',
            category: 'Creative AI Tools',
            keyTakeaway: 'Diffusion models turn random visual noise into crisp artwork guided by text prompts.',
            thumbnailGradient: 'from-pink-600/30 to-purple-600/30',
          },
          {
            id: 'v-2',
            title: 'Top 5 Everyday AI Tools for Students & Creators',
            duration: '4:20',
            difficulty: 'Basic',
            category: 'Productivity',
            keyTakeaway: 'Master Claude, ChatGPT, ElevenLabs, and Perplexity for accelerated research.',
            thumbnailGradient: 'from-blue-600/30 to-cyan-600/30',
          },
          {
            id: 'v-3',
            title: 'How Robots & Autonomous Cars See the World',
            duration: '3:45',
            difficulty: 'Basic',
            category: 'Robotics',
            keyTakeaway: 'Computer vision breaks video frames into color grids to spot pedestrians and traffic lights.',
            thumbnailGradient: 'from-emerald-600/30 to-teal-600/30',
          },
        ],
      };
    }

    if (activeDifficulty === 'INTERMEDIATE') {
      return {
        id: 'lesson-inter-1',
        title: 'Neural Network Architecture & Deep Learning Foundations',
        difficulty: 'INTERMEDIATE',
        category: 'Deep Learning Architecture',
        duration: '4:15',
        videoTitle: 'Inside the Neural Network: Weights, Biases & Activation Functions',
        youtubeEmbedUrl: 'https://www.youtube-nocookie.com/embed/IHZwWFHWa-w?enablejsapi=1&rel=0',
        videoChapters: [
          {
            title: '1. Biological vs Artificial Neurons',
            time: '0:00',
            timestampSec: 0,
            narrationScript: 'Just like biological brain cells communicate through dendrites and synapses, artificial neurons receive numerical inputs multiplied by connection weights, shifting with an additive bias.',
            keyTakeaways: ['Dendrites = Input feature tensor X', 'Synaptic strength = Weight parameter W', 'Action potential threshold = Additive Bias b']
          },
          {
            title: '2. Linear Transformation Z = WX + B',
            time: '1:15',
            timestampSec: 75,
            narrationScript: 'Every artificial neuron computes the linear combination Z equals W times X plus B. Weights scale the input feature importance, and the bias shifts the decision boundary horizontally.',
            keyTakeaways: ['z = w₁x₁ + w₂x₂ + ... + wₙxₙ + b', 'w determines hyperplane orientation', 'b determines distance from origin']
          },
          {
            title: '3. Activation Functions (ReLU, GELU, Sigmoid)',
            time: '2:30',
            timestampSec: 150,
            narrationScript: 'Without non-linear activation functions like ReLU, GELU, and Sigmoid, any deep network would collapse into a simple linear regression. Activations allow neural networks to learn non-linear patterns.',
            keyTakeaways: ['ReLU: max(0, z) for fast sparse computation', 'GELU: smooth probabilistic activation in GPT & BERT', 'Sigmoid: maps real values to probability range (0, 1)']
          },
          {
            title: '4. Layer Stacking & Gradient Descent (SGD)',
            time: '3:35',
            timestampSec: 215,
            narrationScript: 'During training, backpropagation sends error gradients backward through the network, automatically twisting every weight knob using stochastic gradient descent to minimize loss.',
            keyTakeaways: ['Forward pass computes prediction y_hat', 'Loss function measures error L(y_hat, y)', 'Backpropagation chain rule updates weights W ← W - η(dL/dW)']
          },
        ],
        eli5Analogy:
          'Imagine a neural network is an orchestra of tuning knobs (weights). At first, the music sounds random. Every time a mistake happens, an auto-tuner gently twists every knob in the right direction until the music sounds perfect!',
        technicalSummary:
          'Multi-Layer Perceptrons stack affine transformations with nonlinear activations (ReLU, GELU) to learn high-dimensional representation manifolds.',
        simulationType: 'NEURAL_PLAYGROUND',
        suggestedVideos: [
          {
            id: 'v-4',
            title: 'CNN Convolutions Explained with Interactive Grids',
            duration: '3:50',
            difficulty: 'Intermediate',
            category: 'Computer Vision',
            keyTakeaway: 'Kernels slide across pixel matrices to extract edge, texture, and object feature maps.',
            thumbnailGradient: 'from-amber-600/30 to-orange-600/30',
          },
          {
            id: 'v-5',
            title: 'Why Loss Curves Drop: Intuition Behind SGD',
            duration: '4:10',
            difficulty: 'Intermediate',
            category: 'Optimization',
            keyTakeaway: 'Stochastic gradient descent navigates high-dimensional convex and non-convex loss valleys.',
            thumbnailGradient: 'from-purple-600/30 to-indigo-600/30',
          },
          {
            id: 'v-6',
            title: 'Word Embeddings: How Words Become Geometry',
            duration: '4:30',
            difficulty: 'Intermediate',
            category: 'NLP & LLMs',
            keyTakeaway: 'Word2Vec and GloVe position synonyms close together in 768-dimensional space.',
            thumbnailGradient: 'from-rose-600/30 to-pink-600/30',
          },
        ],
      };
    }

    // ADVANCED
    return {
      id: 'lesson-adv-1',
      title: 'Transformers Self-Attention Math, RAG & LoRA Fine-Tuning',
      difficulty: 'ADVANCED',
      category: 'Advanced Generative Systems',
      duration: '4:50',
      videoTitle: 'Scaled Dot-Product Attention QKV Mechanics & Vector Indexing',
      youtubeEmbedUrl: 'https://www.youtube-nocookie.com/embed/wjZofJX0v4U?enablejsapi=1&rel=0',
      videoChapters: [
        {
          title: '1. Query, Key, and Value Matrix Projections',
          time: '0:00',
          timestampSec: 0,
          narrationScript: 'In a Transformer, every token is projected into three distinct vectors: Query, Key, and Value. The Query asks what to look for, the Key matches relevance, and the Value carries semantic content.',
          keyTakeaways: ['Query Q = X · W_Q', 'Key K = X · W_K', 'Value V = X · W_V']
        },
        {
          title: '2. Scaled Dot-Product Attention (Q · Kᵀ / √d_k)',
          time: '1:30',
          timestampSec: 90,
          narrationScript: 'Scaled dot-product attention computes cosine similarities between all Queries and Keys, scales by square root of d_k, and normalizes with Softmax to dynamically weight the Values.',
          keyTakeaways: ['Attention(Q,K,V) = Softmax(QKᵀ / √d_k) · V', 'Scaling √d_k prevents vanishing softmax gradients', 'O(N²) pairwise contextual self-attention']
        },
        {
          title: '3. Enterprise RAG & High-Dimensional Vector Search',
          time: '2:45',
          timestampSec: 165,
          narrationScript: 'Retrieval-Augmented Generation embeds enterprise documents into high-dimensional vector databases, retrieving the top relevant chunks using cosine similarity before generating responses.',
          keyTakeaways: ['Hierarchical Navigable Small World (HNSW) indexing', 'Sub-5ms cosine similarity vector retrieval', 'Eliminates hallucinations by grounding LLM in source data']
        },
        {
          title: '4. LoRA Parameter-Efficient Fine-Tuning',
          time: '3:50',
          timestampSec: 230,
          narrationScript: 'Low-Rank Adaptation freezes massive base model weights and fine-tunes low-rank decomposition matrices, slashing GPU memory consumption by 99%.',
          keyTakeaways: ['Weight update ΔW = B · A where rank r ≪ d', 'Base weights W₀ remain frozen', 'Fine-tune 70B models on consumer GPUs']
        },
      ],
      eli5Analogy:
        'Imagine a research library where every book has a title tag (Key), your question is an inquiry ticket (Query), and the book contents are the Value. Self-Attention calculates mathematical similarity between your query and all keys to retrieve the exact pages you need!',
      technicalSummary:
        'Self-Attention computes contextual representations: Attention(Q, K, V) = Softmax(Q·Kᵀ / √d_k) · V. LoRA freezes base weights W0 and decomposes parameter updates into ΔW = B · A where rank r ≪ d.',
      simulationType: 'RAG_SIMULATOR',
      suggestedVideos: [
        {
          id: 'v-7',
          title: 'FlashAttention & GPU Memory Hierarchy (SRAM vs HBM)',
          duration: '4:45',
          difficulty: 'Advanced',
          category: 'Hardware Acceleration',
          keyTakeaway: 'Tiling attention computations avoids quadratic O(N²) memory reads to slow HBM.',
          thumbnailGradient: 'from-violet-600/30 to-purple-600/30',
        },
        {
          id: 'v-8',
          title: 'LoRA & QLoRA 4-Bit NormalFloat Quantization',
          duration: '4:15',
          difficulty: 'Advanced',
          category: 'Fine-Tuning',
          keyTakeaway: 'Fine-tuning 70B parameter models on a single 24GB GPU using NF4 quantization.',
          thumbnailGradient: 'from-cyan-600/30 to-blue-600/30',
        },
        {
          id: 'v-9',
          title: 'Vector Search: HNSW vs IVF-Flat Benchmarks',
          duration: '3:40',
          difficulty: 'Advanced',
          category: 'Vector Databases',
          keyTakeaway: 'Hierarchical Navigable Small World graphs yield logarithmic sub-5ms cosine retrieval.',
          thumbnailGradient: 'from-emerald-600/30 to-green-600/30',
        },
      ],
    };
  }, [activeDifficulty]);

  // Current active chapter based on currentTimeSec
  const currentChapterIdx = useMemo(() => {
    const chapters = activeContent.videoChapters;
    for (let i = chapters.length - 1; i >= 0; i--) {
      if (currentTimeSec >= chapters[i].timestampSec) {
        return i;
      }
    }
    return 0;
  }, [activeContent, currentTimeSec]);

  const currentChapter = activeContent.videoChapters[currentChapterIdx] || activeContent.videoChapters[0];

  // Speech Audio Narration (Web Speech API)
  const speakCurrentChapter = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (isMuted) return;

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice =
      voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Natural') ||
            v.name.includes('Google') ||
            v.name.includes('Samantha') ||
            v.name.includes('Daniel') ||
            v.name.includes('Premium'))
      ) || voices.find((v) => v.lang.startsWith('en'));

    if (naturalVoice) utterance.voice = naturalVoice;
    utterance.rate = playbackSpeed * 0.95;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';
    utterance.onstart = () => setSpeechActive(true);
    utterance.onend = () => setSpeechActive(false);
    utterance.onerror = () => setSpeechActive(false);
    window.speechSynthesis.speak(utterance);
  };

  // Trigger speech when chapter changes or play state toggles
  useEffect(() => {
    if (isPlaying && !isMuted) {
      speakCurrentChapter(currentChapter.narrationScript);
    } else {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setSpeechActive(false);
      }
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlaying, currentChapterIdx, isMuted, playbackSpeed]);

  // Video timer simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTimeSec((prev) => {
          if (prev >= totalDurationSec) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed]);

  const formatSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Neural Forward Pass Math
  const zVal = weight * inputX + bias;
  const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));
  const aVal = sigmoid(zVal);
  const currentLoss = 0.5 * Math.pow(aVal - targetY, 2);
  const dLoss_dA = aVal - targetY;
  const dA_dZ = aVal * (1 - aVal);
  const dLoss_dW = dLoss_dA * dA_dZ * inputX;
  const dLoss_dB = dLoss_dA * dA_dZ;

  const handleTrainStep = () => {
    const newW = weight - learningRate * dLoss_dW;
    const newB = bias - learningRate * dLoss_dB;
    setWeight(Number(newW.toFixed(4)));
    setBias(Number(newB.toFixed(4)));

    const nextLoss = 0.5 * Math.pow(sigmoid(newW * inputX + newB) - targetY, 2);
    setLossHistory((prev) => [...prev, { step: prev.length, loss: Number(nextLoss.toFixed(4)) }]);
  };

  // Tokenizer calculation
  const tokenList = useMemo(() => {
    return samplePrompt.split(/\s+/).filter(Boolean);
  }, [samplePrompt]);

  return (
    <div className="space-y-6 select-none">
      {/* ── Level Switcher Bar (Basic -> Intermediate -> Advance) ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-card border border-border rounded-2xl">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-bold text-foreground">Difficulty Track:</span>
        </div>

        <div className="flex items-center gap-1.5 bg-secondary p-1 rounded-xl">
          {(['BASIC', 'INTERMEDIATE', 'ADVANCED'] as DifficultyLevel[]).map((level) => {
            const isSelected = activeDifficulty === level;
            return (
              <button
                key={level}
                onClick={() => onDifficultyChange && onDifficultyChange(level)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  isSelected
                    ? level === 'BASIC'
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-950/40'
                      : level === 'INTERMEDIATE'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40'
                      : 'bg-rose-600 text-white shadow-md shadow-rose-950/40'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {level === 'BASIC' && '🟢 Basic / School (AI & Tools)'}
                {level === 'INTERMEDIATE' && '🟡 Intermediate (Architectures)'}
                {level === 'ADVANCED' && '🔴 Advance (In-Depth ML/DL/GenAI)'}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main Media & Interactive Hub ── */}
      <Card className="p-6 bg-card border-border rounded-2xl space-y-6 shadow-xl">
        {/* Module Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-400 font-mono text-[11px] font-bold rounded-md border border-purple-500/30">
                {activeContent.category}
              </span>
              <span className="px-2 py-0.5 bg-secondary text-muted-foreground text-[10px] font-mono font-bold rounded flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" /> Max 5 Min Lesson ({activeContent.duration})
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-foreground mt-1.5">{activeContent.title}</h2>
          </div>

          {/* Tab Navigation Controls */}
          <div className="flex items-center gap-1.5 bg-secondary/60 p-1 rounded-xl text-xs">
            <button
              onClick={() => setActiveTab('simulation')}
              className={`px-3 py-1.5 font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'simulation'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Zap className="w-3.5 h-3.5" /> Interactive Simulation
            </button>

            <button
              onClick={() => setActiveTab('video')}
              className={`px-3 py-1.5 font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'video'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Video className="w-3.5 h-3.5" /> 5-Min Video Lesson
            </button>

            <button
              onClick={() => setActiveTab('eli5')}
              className={`px-3 py-1.5 font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'eli5'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Brain className="w-3.5 h-3.5 text-pink-400" /> Explain Like I'm 5
            </button>

            <button
              onClick={() => setActiveTab('industry_gap')}
              className={`px-3 py-1.5 font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'industry_gap'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-amber-400" /> Industry vs Academic Gap
            </button>

            <button
              onClick={() => setActiveTab('math_studio')}
              className={`px-3 py-1.5 font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'math_studio'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-cyan-400" /> Deep Math & LLM Studio
            </button>

            <button
              onClick={() => setActiveTab('curriculum')}
              className={`px-3 py-1.5 font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'curriculum'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> Syllabus, Hours & Objectives
            </button>

            <button
              onClick={() => setActiveTab('suggested')}
              className={`px-3 py-1.5 font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'suggested'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Suggested Videos
            </button>
          </div>
        </div>

        {/* ── TAB 1: INTERACTIVE SIMULATION & ANIMATION ── */}
        {activeTab === 'simulation' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Simulation Type 1: Neural Network Weights & Gradient Descent */}
            {activeContent.simulationType === 'NEURAL_PLAYGROUND' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-6 p-5 bg-secondary/40 border border-border rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-purple-400" /> Live Neuron Parameter Controls
                    </h3>
                    <Button
                      onClick={handleTrainStep}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-8 px-3 rounded-lg gap-1 shadow-md shadow-purple-900/30 cursor-pointer"
                    >
                      <Zap className="w-3 h-3 fill-white" /> Gradient Step (SGD)
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] text-muted-foreground mb-1">Weight W: {weight}</label>
                      <input
                        type="range"
                        min="-2"
                        max="2"
                        step="0.05"
                        value={weight}
                        onChange={(e) => setWeight(parseFloat(e.target.value))}
                        className="w-full accent-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-muted-foreground mb-1">Bias B: {bias}</label>
                      <input
                        type="range"
                        min="-1"
                        max="1"
                        step="0.05"
                        value={bias}
                        onChange={(e) => setBias(parseFloat(e.target.value))}
                        className="w-full accent-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-muted-foreground mb-1">Input X: {inputX}</label>
                      <input
                        type="range"
                        min="0"
                        max="3"
                        step="0.1"
                        value={inputX}
                        onChange={(e) => setInputX(parseFloat(e.target.value))}
                        className="w-full accent-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-muted-foreground mb-1">Target Y: {targetY}</label>
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.05"
                        value={targetY}
                        onChange={(e) => setTargetY(parseFloat(e.target.value))}
                        className="w-full accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-3 bg-secondary/80 rounded-xl text-center font-mono text-[11px]">
                    <div>
                      <span className="text-muted-foreground text-[10px] block">Sum Z = WX+B</span>
                      <span className="font-bold text-foreground">{zVal.toFixed(3)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-[10px] block">Activation σ(Z)</span>
                      <span className="font-bold text-purple-400">{aVal.toFixed(3)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-[10px] block">Loss L(A, Y)</span>
                      <span className="font-bold text-rose-400">{currentLoss.toFixed(4)}</span>
                    </div>
                  </div>
                </div>

                {/* Real-time Loss Descent Chart */}
                <div className="lg:col-span-6 p-5 bg-secondary/40 border border-border rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <TrendingDown className="w-3.5 h-3.5 text-emerald-400" /> Loss Convergence Graph
                    </h3>
                    <span className="text-[10px] font-mono text-muted-foreground">Epoch: {lossHistory.length - 1}</span>
                  </div>

                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={lossHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#272730" />
                        <XAxis dataKey="step" stroke="#71717a" fontSize={10} />
                        <YAxis stroke="#71717a" fontSize={10} domain={[0, 'auto']} />
                        <Tooltip contentStyle={{ backgroundColor: '#181820', borderColor: '#3f3f46', fontSize: '11px' }} />
                        <Line type="monotone" dataKey="loss" stroke="#a855f7" strokeWidth={2} dot={{ r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Simulation Type 2: Attention Heatmap & Tokenizer */}
            {activeContent.simulationType === 'ATTENTION_HEATMAP' && (
              <div className="space-y-4">
                <div className="p-4 bg-secondary/40 border border-border rounded-2xl space-y-3">
                  <label className="block text-xs font-bold text-foreground">
                    Interactive Prompt Tokenizer & Self-Attention Head
                  </label>
                  <Input
                    value={samplePrompt}
                    onChange={(e) => setSamplePrompt(e.target.value)}
                    placeholder="Type words to see tokens and attention weights..."
                    className="bg-secondary border-border text-foreground text-xs h-9"
                  />

                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    <span className="text-[11px] text-muted-foreground font-semibold">Tokens ({tokenList.length}):</span>
                    {tokenList.map((tok, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedTokenIdx(idx)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                          selectedTokenIdx === idx
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                            : 'bg-secondary border border-border text-foreground hover:bg-secondary/80'
                        }`}
                      >
                        [{idx}] {tok}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Attention Matrix Visualization */}
                <div className="p-5 bg-secondary/40 border border-border rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Brain className="w-3.5 h-3.5 text-purple-400" /> Scaled Dot-Product Attention Heatmap ($Q \cdot K^T$)
                    </h3>
                    <span className="text-[10px] font-mono text-purple-300">Active Query: Token [{selectedTokenIdx !== null ? tokenList[selectedTokenIdx] : 'None'}]</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-center text-xs">
                    {tokenList.map((tok, idx) => {
                      const isSelected = selectedTokenIdx === idx;
                      const weightScore = isSelected ? 0.92 : Number((0.15 + (idx * 0.12) % 0.6).toFixed(2));
                      return (
                        <div
                          key={idx}
                          className="p-3 bg-secondary/80 border border-border rounded-xl space-y-1 hover:border-purple-500/50 transition-all cursor-pointer"
                          onClick={() => setSelectedTokenIdx(idx)}
                        >
                          <span className="font-mono text-[11px] font-bold text-foreground block truncate">{tok}</span>
                          <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                              style={{ width: `${weightScore * 100}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-mono text-purple-300 font-bold">{(weightScore * 100).toFixed(0)}% Attention</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Simulation Type 3: RAG Semantic Vector Search */}
            {activeContent.simulationType === 'RAG_SIMULATOR' && (
              <div className="space-y-4">
                <div className="p-4 bg-secondary/40 border border-border rounded-2xl space-y-3">
                  <label className="block text-xs font-bold text-foreground">
                    Enterprise RAG Vector Database Simulator (HNSW / Cosine Search)
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={ragQuery}
                      onChange={(e) => setRagQuery(e.target.value)}
                      placeholder="Enter semantic query..."
                      className="bg-secondary border-border text-foreground text-xs h-9 flex-1"
                    />
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold h-9 px-4 rounded-xl gap-1.5 shadow-md shadow-purple-900/30">
                      <Search className="w-3.5 h-3.5" /> Retrieve Chunks
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      chunkId: 'CHUNK-9401',
                      doc: 'FlashAttention Paper (Dao et al.)',
                      similarity: '96.4%',
                      text: 'FlashAttention reorganizes the attention computation into tiles to execute directly in high-speed GPU SRAM, eliminating HBM memory latency.',
                    },
                    {
                      chunkId: 'CHUNK-9402',
                      doc: 'NVIDIA H100 Architecture Guide',
                      similarity: '89.2%',
                      text: 'Fourth-generation Tensor Cores with Transformer Engine dynamic FP8/FP16 scaling accelerate matrix multiplication throughput by 4x.',
                    },
                    {
                      chunkId: 'CHUNK-9403',
                      doc: 'LoRA Parameter-Efficient Fine-Tuning',
                      similarity: '74.1%',
                      text: 'Decomposing weight updates ΔW into rank matrices A (r × d) and B (d × r) reduces trainable parameter footprints by 99.8%.',
                    },
                  ].map((chunk) => (
                    <div key={chunk.chunkId} className="p-4 bg-secondary/50 border border-border rounded-xl space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-purple-400 font-bold">{chunk.chunkId}</span>
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded">
                          Cosine: {chunk.similarity}
                        </span>
                      </div>
                      <p className="font-bold text-foreground text-[11px]">{chunk.doc}</p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{chunk.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: 5-MINUTE ANIMATED VIDEO CLASSROOM WITH VOICE NARRATION & SIMULATION ── */}
        {activeTab === 'video' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Mode Switcher: 100% Copyright-Free AI Canvas vs Embedded Video */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-secondary/60 border border-border rounded-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-foreground">Video Mode:</span>
                <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-purple-500/20">
                  <button
                    onClick={() => {
                      setVideoMode('interactive_canvas');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      videoMode === 'interactive_canvas'
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>100% Original AI Canvas (Copyright-Free)</span>
                  </button>
                  <button
                    onClick={() => {
                      setVideoMode('embedded_video');
                      setIsPlaying(false);
                      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                        window.speechSynthesis.cancel();
                      }
                      setSpeechActive(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      videoMode === 'embedded_video'
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Curated Video Masterclass</span>
                  </button>
                </div>
              </div>

              {/* Voice Narrator Quick Trigger */}
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold rounded-lg border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> 100% Royalty-Free
                </span>
                <Button
                  onClick={() => {
                    if (speechActive) {
                      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                        window.speechSynthesis.cancel();
                      }
                      setSpeechActive(false);
                    } else {
                      const fullExplanation = `${activeContent.title}. ${currentChapter.narrationScript} Remember: ${currentChapter.keyTakeaways.join('. ')}`;
                      speakCurrentChapter(fullExplanation);
                    }
                  }}
                  className={`text-xs font-bold h-9 px-3.5 rounded-xl gap-2 cursor-pointer shadow-md transition-all ${
                    speechActive
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-400 animate-pulse'
                      : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-900/30'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{speechActive ? 'Speaking Voice Active (Click to Pause)' : '🔊 Read Explanation Out Loud'}</span>
                </Button>
              </div>
            </div>

            {/* ── A. REAL EMBEDDED HD VIDEO PLAYER (YOUTUBE / ANIMATED MASTERCLASS) ── */}
            {videoMode === 'embedded_video' && (
              <div className="space-y-4">
                <div className="relative aspect-video w-full rounded-3xl overflow-hidden border-2 border-purple-500/40 shadow-2xl bg-black">
                  <iframe
                    src={activeContent.youtubeEmbedUrl}
                    title={activeContent.videoTitle}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
                <div className="flex items-center justify-between text-xs px-1 text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> High-definition visual animation with crystal-clear audio narration.
                  </span>
                  <span className="font-mono text-purple-400">Duration: {activeContent.duration}</span>
                </div>
              </div>
            )}

            {/* ── B. INTERACTIVE AI SLIDE CANVAS (SYNCHRONIZED ANIMATIONS & TTS VOICE) ── */}
            {videoMode === 'interactive_canvas' && (
              <div className="relative min-h-[440px] sm:min-h-[480px] w-full bg-gradient-to-br from-[#0c0914] via-[#120f24] to-[#0a0818] border border-purple-500/30 rounded-3xl overflow-hidden flex flex-col justify-between p-4 sm:p-6 shadow-2xl">
                {/* Background ambient lighting */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

                {/* 1. Top Video Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 z-10 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 bg-black/70 backdrop-blur-md text-purple-300 font-mono font-bold rounded-xl border border-purple-500/30 flex items-center gap-1.5 shadow-lg">
                      <Video className="w-3.5 h-3.5 text-purple-400" />
                      <span>{activeContent.videoTitle}</span>
                    </span>
                    <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold rounded-lg border border-purple-500/30">
                      Chapter {currentChapterIdx + 1} of {activeContent.videoChapters.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {speechActive && !isMuted && (
                      <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold rounded-lg border border-emerald-500/30 flex items-center gap-1.5 animate-pulse">
                        <Volume2 className="w-3 h-3" /> Voice Narration Active
                      </span>
                    )}
                    <span className="px-3 py-1 bg-black/70 backdrop-blur-md text-amber-300 font-mono font-bold rounded-xl border border-amber-500/30 shadow-lg">
                      {formatSec(currentTimeSec)} / {formatSec(totalDurationSec)}
                    </span>
                  </div>
                </div>

                {/* 2. Synchronized Animated Educational Canvas & Slide */}
                <div className="my-4 z-10 w-full flex-1 flex flex-col justify-center">
                  {/* ── BASIC TRACK ANIMATED SLIDES ── */}
                  {activeDifficulty === 'BASIC' && (
                    <div className="w-full space-y-4">
                      {/* Chapter 1: Tokenizer & Next-Token Stream */}
                      {currentChapterIdx === 0 && (
                        <div className="p-5 rounded-2xl bg-black/50 border border-purple-500/30 backdrop-blur-md space-y-4 animate-in fade-in zoom-in-95">
                          <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
                            <span className="text-xs font-bold text-purple-300 font-mono flex items-center gap-2">
                              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                              Visual Demonstration: How LLMs Slice Words into Tokens
                            </span>
                            <span className="text-[10px] font-mono text-emerald-400">Status: Live Tokenizer Stream</span>
                          </div>

                          {/* Animated Token Blocks */}
                          <div className="space-y-2">
                            <span className="text-[11px] text-muted-foreground block font-mono">Raw Input String: &quot;Everyday AI crafts smart solutions for farmers&quot;</span>
                            <div className="flex items-center gap-2 flex-wrap">
                              {[
                                { text: 'Everyday', id: '4182', color: 'bg-purple-600/30 border-purple-400 text-purple-200' },
                                { text: 'AI', id: '19802', color: 'bg-blue-600/30 border-blue-400 text-blue-200' },
                                { text: 'crafts', id: '3401', color: 'bg-pink-600/30 border-pink-400 text-pink-200' },
                                { text: 'smart', id: '8820', color: 'bg-emerald-600/30 border-emerald-400 text-emerald-200' },
                                { text: 'solutions', id: '1205', color: 'bg-amber-600/30 border-amber-400 text-amber-200' },
                              ].map((tok, idx) => (
                                <div
                                  key={idx}
                                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex flex-col items-center transition-all ${
                                    tok.color
                                  } ${isPlaying ? 'animate-pulse' : ''}`}
                                  style={{ animationDelay: `${idx * 200}ms` }}
                                >
                                  <span>{tok.text}</span>
                                  <span className="text-[9px] opacity-70">ID: {tok.id}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Probabilistic Next-Word Prediction Bar */}
                          <div className="p-3 rounded-xl bg-secondary/50 border border-border space-y-2 text-xs">
                            <span className="text-[11px] font-bold text-foreground font-mono">Next Token Probability Distribution:</span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[10px]">
                              <div className="p-2 bg-purple-950/40 border border-purple-500/30 rounded-lg">
                                <div className="flex justify-between text-purple-300">
                                  <span>&quot;solutions&quot;</span>
                                  <span className="font-bold">84%</span>
                                </div>
                                <div className="w-full bg-secondary h-1.5 rounded-full mt-1 overflow-hidden">
                                  <div className="bg-purple-400 h-full w-[84%]" />
                                </div>
                              </div>
                              <div className="p-2 bg-secondary/40 border border-border rounded-lg">
                                <div className="flex justify-between text-muted-foreground">
                                  <span>&quot;future&quot;</span>
                                  <span className="font-bold">71%</span>
                                </div>
                                <div className="w-full bg-secondary h-1.5 rounded-full mt-1 overflow-hidden">
                                  <div className="bg-muted-foreground h-full w-[71%]" />
                                </div>
                              </div>
                              <div className="p-2 bg-secondary/40 border border-border rounded-lg">
                                <div className="flex justify-between text-muted-foreground">
                                  <span>&quot;systems&quot;</span>
                                  <span className="font-bold">62%</span>
                                </div>
                                <div className="w-full bg-secondary h-1.5 rounded-full mt-1 overflow-hidden">
                                  <div className="bg-muted-foreground h-full w-[62%]" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Chapter 2: Prompt Engineering Transformation */}
                      {currentChapterIdx === 1 && (
                        <div className="p-5 rounded-2xl bg-black/50 border border-purple-500/30 backdrop-blur-md space-y-4 animate-in fade-in zoom-in-95">
                          <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
                            <span className="text-xs font-bold text-purple-300 font-mono">
                              Visual Demonstration: Vague Prompt vs Precision Engineered Prompt
                            </span>
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold rounded">
                              Quality: +350% Accuracy
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            {/* Bad Prompt */}
                            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                              <span className="text-rose-400 font-bold font-mono text-[11px] block">❌ Vague Prompt (Low Context):</span>
                              <div className="p-2.5 rounded-lg bg-zinc-950 text-rose-200 font-mono text-[11px] italic">
                                &quot;tell me about plant diseases&quot;
                              </div>
                              <span className="text-[10px] text-muted-foreground block">Result: Generic, unfocused, surface-level summary.</span>
                            </div>

                            {/* Good Prompt */}
                            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                              <span className="text-emerald-400 font-bold font-mono text-[11px] block">✅ Precision Prompt (Role + Context + Goal):</span>
                              <div className="p-2.5 rounded-lg bg-zinc-950 text-emerald-200 font-mono text-[11px] italic">
                                &quot;Act as an agronomist. I have yellow spots on tomato leaves. Give a 3-step diagnosis in simple table format.&quot;
                              </div>
                              <span className="text-[10px] text-emerald-300 block font-bold">Result: Actionable, structured, high-value advice.</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Chapter 3: Image Diffusion Denoising */}
                      {currentChapterIdx === 2 && (
                        <div className="p-5 rounded-2xl bg-black/50 border border-purple-500/30 backdrop-blur-md space-y-4 animate-in fade-in zoom-in-95">
                          <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
                            <span className="text-xs font-bold text-purple-300 font-mono">
                              Visual Demonstration: Diffusion Model Denoising Process
                            </span>
                            <span className="text-[10px] font-mono text-purple-400">Step 1 → Step 50 Synthesis</span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                            <div className="p-3 bg-secondary/50 border border-border rounded-xl space-y-1">
                              <div className="h-16 rounded-lg bg-gradient-to-br from-zinc-800 via-zinc-900 to-black flex items-center justify-center text-xl">
                                🎲
                              </div>
                              <span className="font-mono text-[10px] font-bold text-foreground block">Step 1: Noise</span>
                              <span className="text-[9px] text-muted-foreground">Gaussian Noise</span>
                            </div>

                            <div className="p-3 bg-secondary/50 border border-border rounded-xl space-y-1">
                              <div className="h-16 rounded-lg bg-gradient-to-br from-indigo-950 via-purple-950 to-zinc-900 flex items-center justify-center text-xl">
                                🌫️
                              </div>
                              <span className="font-mono text-[10px] font-bold text-purple-300 block">Step 15: Outlines</span>
                              <span className="text-[9px] text-muted-foreground">Geometry Emerges</span>
                            </div>

                            <div className="p-3 bg-secondary/50 border border-border rounded-xl space-y-1">
                              <div className="h-16 rounded-lg bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-950 flex items-center justify-center text-xl">
                                🎨
                              </div>
                              <span className="font-mono text-[10px] font-bold text-pink-300 block">Step 35: Colors</span>
                              <span className="text-[9px] text-muted-foreground">Texture Infilling</span>
                            </div>

                            <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-xl space-y-1">
                              <div className="h-16 rounded-lg bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 flex items-center justify-center text-xl">
                                🖼️
                              </div>
                              <span className="font-mono text-[10px] font-bold text-emerald-300 block">Step 50: Render</span>
                              <span className="text-[9px] text-emerald-400">4K Crisp Artwork</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Chapter 4: Safety Guardrails */}
                      {currentChapterIdx === 3 && (
                        <div className="p-5 rounded-2xl bg-black/50 border border-purple-500/30 backdrop-blur-md space-y-4 animate-in fade-in zoom-in-95">
                          <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
                            <span className="text-xs font-bold text-purple-300 font-mono">
                              Visual Demonstration: End-to-End Safety Guardrails & RLHF Filter
                            </span>
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold rounded">
                              Verified Safe Output
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-2 overflow-x-auto text-xs font-mono py-2">
                            <div className="p-3 rounded-xl bg-secondary/60 border border-border text-center flex-1 min-w-[100px]">
                              <span className="text-[10px] text-muted-foreground block">1. Input</span>
                              <span className="font-bold text-foreground">User Prompt</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-purple-400 flex-shrink-0" />
                            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-center flex-1 min-w-[100px]">
                              <span className="text-[10px] text-purple-300 block">2. Model</span>
                              <span className="font-bold text-purple-200">Neural Inference</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-purple-400 flex-shrink-0" />
                            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-center flex-1 min-w-[100px]">
                              <span className="text-[10px] text-amber-300 block">3. Guardrail</span>
                              <span className="font-bold text-amber-200">Safety & PII Filter</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-purple-400 flex-shrink-0" />
                            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center flex-1 min-w-[100px]">
                              <span className="text-[10px] text-emerald-300 block">4. Output</span>
                              <span className="font-bold text-emerald-200">Helpful Response</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── INTERMEDIATE TRACK ANIMATED SIMULATIONS ── */}
                  {activeDifficulty === 'INTERMEDIATE' && (
                    <div className="w-full space-y-4">
                      {/* Intermediate Chapter 0: Biological vs Artificial Neurons */}
                      {currentChapterIdx === 0 && (
                        <div className="p-5 rounded-2xl bg-black/60 border border-purple-500/30 backdrop-blur-md space-y-4 animate-in fade-in zoom-in-95">
                          <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
                            <span className="text-xs font-bold text-purple-300 font-mono flex items-center gap-2">
                              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" />
                              Visual Simulation: Biological Dendrites to Artificial Neuron Circuit
                            </span>
                            <span className="text-[10px] font-mono text-emerald-400">Status: Firing Synaptic Potential</span>
                          </div>

                          <div className="p-4 rounded-xl bg-secondary/40 border border-border flex flex-col md:flex-row items-center justify-around gap-4 text-xs font-mono">
                            {/* Inputs / Dendrites */}
                            <div className="space-y-2 text-center">
                              <span className="text-[10px] text-muted-foreground block uppercase font-bold">1. Synaptic Inputs</span>
                              <div className="space-y-1.5">
                                <div className="p-2 rounded-lg bg-blue-950/40 border border-blue-500/30 text-blue-300 animate-pulse">
                                  x₁ = 2.0 (w₁ = 0.75)
                                </div>
                                <div className="p-2 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 animate-pulse">
                                  x₂ = 3.0 (w₂ = -1.2)
                                </div>
                              </div>
                            </div>

                            <ArrowRight className="w-5 h-5 text-purple-400 hidden md:block animate-bounce" />

                            {/* Soma / Linear Summation */}
                            <div className="p-4 rounded-2xl bg-purple-950/50 border-2 border-purple-500/50 text-center shadow-lg shadow-purple-950/50 min-w-[160px]">
                              <span className="text-[10px] text-purple-300 block uppercase font-bold">2. Soma Summation</span>
                              <div className="text-sm font-bold text-white my-1">
                                z = Σ wᵢxᵢ + b
                              </div>
                              <span className="text-[11px] text-purple-300 font-bold block">z = -1.60</span>
                            </div>

                            <ArrowRight className="w-5 h-5 text-purple-400 hidden md:block animate-bounce" />

                            {/* Axon / Non-Linear Activation */}
                            <div className="space-y-2 text-center min-w-[140px]">
                              <span className="text-[10px] text-emerald-400 block uppercase font-bold">3. Axon Action Potential</span>
                              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-bold">
                                y = σ(z) = 0.168
                              </div>
                              <span className="text-[9px] text-muted-foreground block">Inhibited (Below Threshold)</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Intermediate Chapter 1: Linear Transformation Z = WX + B */}
                      {currentChapterIdx === 1 && (
                        <div className="p-5 rounded-2xl bg-black/60 border border-purple-500/30 backdrop-blur-md space-y-4 animate-in fade-in zoom-in-95">
                          <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
                            <span className="text-xs font-bold text-purple-300 font-mono">
                              Visual Simulation: 2D Linear Decision Hyperplane (Classification Boundary)
                            </span>
                            <span className="text-[10px] font-mono text-cyan-400">z = 0 Hyperplane</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="p-4 rounded-xl bg-secondary/50 border border-border space-y-2 font-mono">
                              <span className="text-[11px] font-bold text-purple-300 block">Linear Combination Mechanics:</span>
                              <p className="text-muted-foreground text-[11px] leading-relaxed">
                                Weights (W) rotate the angle of the boundary hyperplane. The Bias (b) shifts the boundary away from the origin without tilting.
                              </p>
                              <div className="p-2.5 rounded-lg bg-zinc-950 text-cyan-300 border border-cyan-500/20">
                                0.75·x₁ - 1.20·x₂ + 0.50 = 0
                              </div>
                            </div>

                            <div className="p-4 rounded-xl bg-secondary/50 border border-border flex items-center justify-around text-center">
                              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1">
                                <span className="text-xs font-bold text-emerald-300 block">Region z &gt; 0</span>
                                <span className="text-[10px] text-emerald-400 font-bold">Class 1 (Spam / Disease)</span>
                              </div>
                              <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-1">
                                <span className="text-xs font-bold text-rose-300 block">Region z &lt; 0</span>
                                <span className="text-[10px] text-rose-400 font-bold">Class 0 (Normal / Healthy)</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Intermediate Chapter 2: Non-Linear Activations */}
                      {currentChapterIdx === 2 && (
                        <div className="p-5 rounded-2xl bg-black/60 border border-purple-500/30 backdrop-blur-md space-y-4 animate-in fade-in zoom-in-95">
                          <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
                            <span className="text-xs font-bold text-purple-300 font-mono">
                              Visual Simulation: ReLU vs GELU vs Sigmoid Non-Linear Warping
                            </span>
                            <span className="text-[10px] font-mono text-purple-400">Non-Linearity Unleashed</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-center">
                            <div className="p-3 bg-secondary/50 border border-border rounded-xl space-y-1.5">
                              <span className="font-bold text-purple-400 block text-xs">ReLU: max(0, z)</span>
                              <div className="h-12 bg-black/60 rounded-lg flex items-center justify-center text-purple-300 font-bold text-xs">
                                0 for z&lt;0, z for z≥0
                              </div>
                              <span className="text-[9px] text-muted-foreground block">Fast, sparse activations</span>
                            </div>

                            <div className="p-3 bg-secondary/50 border border-border rounded-xl space-y-1.5">
                              <span className="font-bold text-blue-400 block text-xs">GELU: z · Φ(z)</span>
                              <div className="h-12 bg-black/60 rounded-lg flex items-center justify-center text-blue-300 font-bold text-xs">
                                Smooth Gaussian Curve
                              </div>
                              <span className="text-[9px] text-muted-foreground block">Standard in GPT-4 & BERT</span>
                            </div>

                            <div className="p-3 bg-secondary/50 border border-border rounded-xl space-y-1.5">
                              <span className="font-bold text-pink-400 block text-xs">Sigmoid: 1 / (1+e⁻ᶻ)</span>
                              <div className="h-12 bg-black/60 rounded-lg flex items-center justify-center text-pink-300 font-bold text-xs">
                                (0.0 to 1.0) Probability
                              </div>
                              <span className="text-[9px] text-muted-foreground block">Binary classification gates</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Intermediate Chapter 3: Layer Stacking & SGD */}
                      {currentChapterIdx === 3 && (
                        <div className="p-5 rounded-2xl bg-black/60 border border-purple-500/30 backdrop-blur-md space-y-4 animate-in fade-in zoom-in-95">
                          <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
                            <span className="text-xs font-bold text-purple-300 font-mono">
                              Visual Simulation: Forward Inference & Backward Error Backpropagation
                            </span>
                            <span className="text-[10px] font-mono text-emerald-400">Gradient Descent Loop</span>
                          </div>

                          <div className="flex items-center justify-between gap-2 overflow-x-auto text-xs font-mono py-2">
                            <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-center flex-1 min-w-[110px]">
                              <span className="text-[9px] text-blue-300 block">Layer 1: Input</span>
                              <span className="font-bold text-white">X ∈ ℝᵈ</span>
                            </div>
                            <span className="text-xs text-emerald-400 font-bold">Forward ➔</span>
                            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-center flex-1 min-w-[110px]">
                              <span className="text-[9px] text-purple-300 block">Layer 2: Hidden</span>
                              <span className="font-bold text-white">H = σ(W₁X + b₁)</span>
                            </div>
                            <span className="text-xs text-rose-400 font-bold">⬅ Backward</span>
                            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center flex-1 min-w-[110px]">
                              <span className="text-[9px] text-emerald-300 block">Layer 3: Loss</span>
                              <span className="font-bold text-white">L = ½(ŷ - y)²</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── ADVANCED TRACK ANIMATED SIMULATIONS ── */}
                  {activeDifficulty === 'ADVANCED' && (
                    <div className="w-full space-y-4">
                      {/* Advanced Chapter 0: Q, K, V Projections */}
                      {currentChapterIdx === 0 && (
                        <div className="p-5 rounded-2xl bg-black/60 border border-purple-500/30 backdrop-blur-md space-y-4 animate-in fade-in zoom-in-95">
                          <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
                            <span className="text-xs font-bold text-purple-300 font-mono">
                              Visual Simulation: Token Vector Linear Projections (Q, K, V)
                            </span>
                            <span className="text-[10px] font-mono text-purple-400">Head Dimension d_k = 64</span>
                          </div>

                          <div className="p-3.5 bg-secondary/50 rounded-xl border border-border flex flex-col sm:flex-row items-center justify-around gap-3 text-xs font-mono text-center">
                            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30">
                              <span className="text-[10px] text-muted-foreground block">Input Embedding</span>
                              <strong className="text-purple-300 font-bold">X ∈ ℝⁿˣᵈ</strong>
                            </div>
                            <span className="text-purple-400 font-bold text-sm">×</span>
                            <div className="space-y-1">
                              <div className="px-3 py-1 bg-amber-950/40 border border-amber-500/30 text-amber-300 rounded-lg">
                                W_Q ➔ Query (Q)
                              </div>
                              <div className="px-3 py-1 bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 rounded-lg">
                                W_K ➔ Key (K)
                              </div>
                              <div className="px-3 py-1 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 rounded-lg">
                                W_V ➔ Value (V)
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Advanced Chapter 1: Scaled Dot-Product Attention */}
                      {currentChapterIdx === 1 && (
                        <div className="p-5 rounded-2xl bg-black/60 border border-purple-500/30 backdrop-blur-md space-y-4 animate-in fade-in zoom-in-95">
                          <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
                            <span className="text-xs font-bold text-purple-300 font-mono">
                              Visual Simulation: Scaled Dot-Product Self-Attention Matrix
                            </span>
                            <span className="text-[10px] font-mono text-emerald-400">Attention(Q,K,V) = Softmax(QKᵀ / √d_k) · V</span>
                          </div>

                          <div className="grid grid-cols-3 gap-2 font-mono text-center text-xs">
                            <div className="p-2.5 rounded-xl bg-secondary/50 border border-border">
                              <span className="text-[10px] text-muted-foreground block">1. Q · Kᵀ</span>
                              <span className="font-bold text-amber-300">Raw Affinities</span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30">
                              <span className="text-[10px] text-purple-300 block">2. Divide √d_k</span>
                              <span className="font-bold text-purple-200">Scale Gradients</span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                              <span className="text-[10px] text-emerald-300 block">3. Softmax · V</span>
                              <span className="font-bold text-emerald-200">Context Output</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Advanced Chapter 2: RAG Vector Search */}
                      {currentChapterIdx === 2 && (
                        <div className="p-5 rounded-2xl bg-black/60 border border-purple-500/30 backdrop-blur-md space-y-4 animate-in fade-in zoom-in-95">
                          <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
                            <span className="text-xs font-bold text-purple-300 font-mono">
                              Visual Simulation: 3D High-Dimensional Vector Search (RAG)
                            </span>
                            <span className="text-[10px] font-mono text-emerald-400">Sub-5ms Cosine Lookup</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs text-center">
                            <div className="p-3 bg-secondary/50 border border-border rounded-xl">
                              <span className="text-[10px] text-purple-400 block">User Prompt Embedding</span>
                              <span className="font-bold text-foreground">q_vec ∈ ℝ⁷⁶⁸</span>
                            </div>
                            <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-xl">
                              <span className="text-[10px] text-purple-300 block">Cosine Similarity</span>
                              <span className="font-bold text-emerald-400">cos(θ) = 0.964</span>
                            </div>
                            <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl">
                              <span className="text-[10px] text-emerald-300 block">Retrieved Chunk</span>
                              <span className="font-bold text-emerald-200">Doc Chunk #9401</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Advanced Chapter 3: LoRA Fine-Tuning */}
                      {currentChapterIdx === 3 && (
                        <div className="p-5 rounded-2xl bg-black/60 border border-purple-500/30 backdrop-blur-md space-y-4 animate-in fade-in zoom-in-95">
                          <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
                            <span className="text-xs font-bold text-purple-300 font-mono">
                              Visual Simulation: Low-Rank Adaptation (LoRA & QLoRA Matrix Decomposition)
                            </span>
                            <span className="text-[10px] font-mono text-emerald-400">99.8% Parameter Reduction</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                            <div className="p-3.5 bg-rose-950/20 border border-rose-500/30 rounded-xl space-y-1">
                              <span className="text-rose-400 font-bold block">Frozen Base Model (W₀):</span>
                              <span className="text-[11px] text-muted-foreground block">4096 × 4096 Matrix = 16.7M params (Locked)</span>
                            </div>
                            <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-1">
                              <span className="text-emerald-400 font-bold block">Trainable Adapters (B · A):</span>
                              <span className="text-[11px] text-emerald-300 block">Rank r = 16 (4096×16 + 16×4096) = 131K params (0.78%)</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 3. Live Spoken Subtitles & Closed Captions Bar */}
                <div className="z-10 p-3 rounded-2xl bg-black/80 backdrop-blur-md border border-purple-500/30 text-xs shadow-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-mono text-[9px] font-bold uppercase tracking-wider">
                      Closed Captions / Spoken Script
                    </span>
                    {speechActive && <span className="text-[10px] text-emerald-400 font-mono animate-pulse">● Narrating Voice</span>}
                  </div>
                  <p className="text-zinc-200 text-xs sm:text-sm font-medium leading-relaxed italic">
                    &quot;{currentChapter.narrationScript}&quot;
                  </p>
                </div>

                {/* 4. Bottom Video Controls Bar */}
                <div className="space-y-2 z-10 pt-3 border-t border-purple-500/20 mt-2">
                  {/* Scrubbing Timeline */}
                  <div
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      const newFraction = Math.max(0, Math.min(1, clickX / rect.width));
                      setCurrentTimeSec(Math.floor(newFraction * totalDurationSec));
                    }}
                    className="w-full bg-secondary/80 h-2.5 rounded-full overflow-hidden cursor-pointer relative group"
                  >
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 transition-all duration-300 rounded-full"
                      style={{ width: `${(currentTimeSec / totalDurationSec) * 100}%` }}
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-300">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-8 h-8 rounded-lg bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center cursor-pointer transition-all shadow-md"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                      </button>

                      <button
                        onClick={() => {
                          const newMuted = !isMuted;
                          setIsMuted(newMuted);
                          if (newMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                            window.speechSynthesis.cancel();
                          } else if (!newMuted && isPlaying) {
                            speakCurrentChapter(currentChapter.narrationScript);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground cursor-pointer transition-all flex items-center gap-1 text-[11px]"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                        <span>{isMuted ? 'Muted' : 'Audio On'}</span>
                      </button>

                      <span className="font-mono text-[11px] text-zinc-400">
                        {formatSec(currentTimeSec)} / {formatSec(totalDurationSec)}
                      </span>
                    </div>

                    {/* Playback Speed & Simulation Shortcut */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-muted-foreground font-mono">Speed:</span>
                        {[1, 1.25, 1.5, 2].map((spd) => (
                          <button
                            key={spd}
                            onClick={() => setPlaybackSpeed(spd)}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer transition-all ${
                              playbackSpeed === spd
                                ? 'bg-purple-600 text-white shadow-md'
                                : 'bg-secondary text-muted-foreground hover:text-white'
                            }`}
                          >
                            {spd}x
                          </button>
                        ))}
                      </div>

                      <Button
                        onClick={() => setActiveTab('simulation')}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-8 px-3 rounded-xl gap-1.5 shadow-md shadow-purple-900/40 cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5 fill-white" />
                        <span>Try Interactive Simulation</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Clickable Chapters Navigation Bar */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-xs font-bold text-foreground font-mono">Jump to Chapter:</span>
              {activeContent.videoChapters.map((ch, idx) => {
                const isActive = currentChapterIdx === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentTimeSec(ch.timestampSec);
                      if (videoMode === 'interactive_canvas') {
                        setIsPlaying(true);
                      } else {
                        // In video mode, also trigger audio narration for the chapter
                        speakCurrentChapter(ch.narrationScript);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-900/40'
                        : 'bg-secondary/70 hover:bg-secondary border-border text-foreground'
                    }`}
                  >
                    <span className="font-mono text-[10px] font-bold opacity-80">{ch.time}</span>
                    <span>{ch.title}</span>
                  </button>
                );
              })}
            </div>

            {/* ── C. STEP-BY-STEP PLAIN-ENGLISH CONCEPT EXPLAINER (SO ANYONE CAN EASILY UNDERSTAND) ── */}
            <div className="p-6 bg-gradient-to-br from-purple-950/20 via-[#100d1c] to-indigo-950/20 border border-purple-500/20 rounded-3xl space-y-4">
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Step-by-Step Concept Breakdown (Simple & Clear)</h4>
                    <p className="text-xs text-muted-foreground">Easy explanation designed so any student can grasp the concept in under 3 minutes.</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 font-mono text-[11px] font-bold rounded-lg border border-purple-500/30">
                  4 Core Steps
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeDifficulty === 'BASIC' ? (
                  <>
                    <div className="p-4 bg-secondary/50 border border-border rounded-2xl space-y-2">
                      <div className="flex items-center gap-2 text-purple-400 font-bold text-xs font-mono">
                        <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">1</span>
                        <span>Sentence Slicing (Tokens)</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Computers cannot read alphabet letters directly. When you type <span className="text-purple-300 font-mono font-bold">&quot;Hello World&quot;</span>, the AI slices it into numerical IDs like <span className="text-purple-300 font-mono">[15496, 2159]</span>.
                      </p>
                    </div>

                    <div className="p-4 bg-secondary/50 border border-border rounded-2xl space-y-2">
                      <div className="flex items-center gap-2 text-blue-400 font-bold text-xs font-mono">
                        <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">2</span>
                        <span>Attention & Connecting Clues</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        The AI looks at all words at once. If you say <span className="text-blue-300 font-mono font-bold">&quot;The bank of the river&quot;</span>, it connects &quot;bank&quot; to &quot;river&quot; (water) rather than money!
                      </p>
                    </div>

                    <div className="p-4 bg-secondary/50 border border-border rounded-2xl space-y-2">
                      <div className="flex items-center gap-2 text-pink-400 font-bold text-xs font-mono">
                        <span className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center border border-pink-500/30">3</span>
                        <span>Next-Word Prediction Probabilities</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Like smartphone auto-complete on steroids, it calculates probabilities for which next word makes the most logical sense (e.g. 84% &quot;future&quot;, 10% &quot;car&quot;).
                      </p>
                    </div>

                    <div className="p-4 bg-secondary/50 border border-border rounded-2xl space-y-2">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-mono">
                        <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">4</span>
                        <span>Safety Filter & Response Display</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Before showing words on your screen, guardrails verify the answer is safe, respectful, and helpful.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-4 bg-secondary/50 border border-border rounded-2xl space-y-2">
                      <div className="flex items-center gap-2 text-purple-400 font-bold text-xs font-mono">
                        <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">1</span>
                        <span>Inputs & Connection Weights (W)</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Feature vectors <span className="font-mono text-purple-300">X</span> get multiplied by connection weights <span className="font-mono text-purple-300">W</span> which determine how much influence each feature has.
                      </p>
                    </div>

                    <div className="p-4 bg-secondary/50 border border-border rounded-2xl space-y-2">
                      <div className="flex items-center gap-2 text-amber-400 font-bold text-xs font-mono">
                        <span className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30">2</span>
                        <span>Additive Bias (b)</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Bias shifts the decision boundary hyperplane away from the origin so neurons can activate even when all inputs are zero.
                      </p>
                    </div>

                    <div className="p-4 bg-secondary/50 border border-border rounded-2xl space-y-2">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-mono">
                        <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">3</span>
                        <span>Nonlinear Activation σ(z)</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Functions like <span className="font-mono text-emerald-300">ReLU(z) = max(0, z)</span> and <span className="font-mono text-emerald-300">GELU(z)</span> bend linear lines into curves to learn complex relationships.
                      </p>
                    </div>

                    <div className="p-4 bg-secondary/50 border border-border rounded-2xl space-y-2">
                      <div className="flex items-center gap-2 text-pink-400 font-bold text-xs font-mono">
                        <span className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center border border-pink-500/30">4</span>
                        <span>Gradient Descent Tuning</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Errors flow backward through backpropagation to automatically turn every weight knob in the right direction to reduce loss.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: EXPLAIN LIKE I'M 5 (ELI5) ── */}
        {activeTab === 'eli5' && (
          <div className="p-6 bg-gradient-to-br from-pink-950/30 via-purple-950/20 to-indigo-950/30 border border-pink-500/30 rounded-2xl space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center justify-center">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Visual Analogy ("Explain Like I'm 5")</h3>
                <p className="text-xs text-muted-foreground">Crystal-clear real-world mental models without confusing equations.</p>
              </div>
            </div>

            <div className="p-4 bg-secondary/60 rounded-xl border border-border">
              <p className="text-sm text-pink-200 leading-relaxed font-medium italic">
                "{activeContent.eli5Analogy}"
              </p>
            </div>

            <div className="p-4 bg-secondary/40 rounded-xl border border-border space-y-1.5">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Core Concept Takeaway
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {activeContent.technicalSummary}
              </p>
            </div>
          </div>
        )}

        {/* ── TAB 4: SUGGESTED BITE-SIZED VIDEOS (<= 5 MIN) ── */}
        {activeTab === 'suggested' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">Suggested 5-Minute Micro-Lessons</h3>
                <p className="text-xs text-muted-foreground">Curated short animations and simulations to expand your understanding.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeContent.suggestedVideos.map((vid) => (
                <div
                  key={vid.id}
                  className="p-4 bg-secondary/40 border border-border rounded-2xl space-y-3 hover:border-purple-500/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 font-mono text-[10px] font-bold rounded">
                        {vid.category}
                      </span>
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-[10px] font-bold rounded flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {vid.duration}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-foreground leading-snug">{vid.title}</h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">
                      {vid.keyTakeaway}
                    </p>
                  </div>

                  <Button
                    onClick={() => {
                      setActiveTab('video');
                      setIsPlaying(true);
                    }}
                    className="w-full bg-secondary hover:bg-purple-600 hover:text-white text-foreground text-xs font-bold h-8 rounded-xl gap-1.5 transition-all cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" /> Watch Lesson ({vid.duration})
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 5: BRIDGING THE GAP: INDUSTRY VS ACADEMIC ── */}
        {activeTab === 'industry_gap' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="p-5 bg-gradient-to-r from-amber-950/30 via-purple-950/20 to-card border border-amber-500/30 rounded-2xl space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold rounded">
                  INDUSTRY BLUEPRINT
                </span>
                <h3 className="text-sm font-bold text-foreground">Why Standard Academic Courses Fail in Production</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Academic AI focuses on sanitized datasets and isolated mathematical equations. Industry AI engineering demands fault-tolerant telemetry, GPU memory budgeting, hybrid vector search, and continuous model evaluation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Academic Approach Card */}
              <div className="p-5 bg-secondary/30 border border-rose-500/30 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold border-b border-border pb-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <h4>Traditional Academic Approach (Theory Only)</h4>
                </div>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>Clean static CSV datasets (MNIST/Iris) with zero missing data or schema drift.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>Toy single-token forward passes in Jupyter notebooks ignoring batch throughput.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>Theoretical mathematical equations without Docker containerization or CI/CD pipelines.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>Naive KNN vector lookups that fail at million-scale enterprise document retrieval.</span>
                  </li>
                </ul>
              </div>

              {/* Industry Production Reality Card */}
              <div className="p-5 bg-secondary/40 border border-emerald-500/30 rounded-2xl space-y-3 shadow-lg shadow-emerald-950/20">
                <div className="flex items-center gap-2 text-emerald-400 font-bold border-b border-border pb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <h4>Industry Engineering Reality (Nexus Standards)</h4>
                </div>
                <ul className="space-y-2 text-foreground/90">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>Streaming Data &amp; Drift:</strong> Pydantic validation, Kafka event queues, real-time telemetry.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>High-Throughput vLLM:</strong> PagedAttention, continuous batching, and sub-15ms TTFT (Time To First Token).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>4-Bit QLoRA Fine-Tuning:</strong> NF4 quantization with BitsAndBytes on single 24GB VRAM nodes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>Enterprise Hybrid RAG:</strong> Dense vectors + BM25 sparse reranking (Cohere/BGE) with Ragas evaluation.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Action Pathways: Where to Bridge This Gap on Nexus */}
            <div className="p-5 bg-gradient-to-br from-purple-950/30 via-secondary/60 to-indigo-950/30 border border-purple-500/30 rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Rocket className="w-4 h-4 text-purple-400" />
                    <span>Where Do We Bridge This Gap on This Platform?</span>
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    You don&apos;t just read static theory — you build, deploy, and verify production systems directly in our sandbox environments.
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold rounded-lg border border-emerald-500/30 self-start sm:self-auto">
                  🆓 Free Access &amp; Optional Pro Cloud
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {/* Pathway 1: Project Rooms */}
                <div className="p-3.5 bg-black/40 border border-border rounded-xl space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="font-bold text-purple-300 block">1. Collaborative Project Rooms</span>
                    <p className="text-[11px] text-muted-foreground">
                      Real team Kanban boards, live GPU benchmark terminals, and Git CI/CD publishing.
                    </p>
                  </div>
                  <Link href="/projects/proj-1/collaborate">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold h-8 rounded-lg gap-1.5 cursor-pointer mt-2">
                      <Terminal className="w-3.5 h-3.5" /> Enter Project Room (Free)
                    </Button>
                  </Link>
                </div>

                {/* Pathway 2: Real-World Expert Challenges */}
                <div className="p-3.5 bg-black/40 border border-border rounded-xl space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="font-bold text-amber-300 block">2. Real-World Challenges</span>
                    <p className="text-[11px] text-muted-foreground">
                      Solve 10+ industry scenarios: Agriculture AI, distributed DBs, and AI Red-Teaming firewalls.
                    </p>
                  </div>
                  <Link href="/challenges">
                    <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold h-8 rounded-lg gap-1.5 cursor-pointer mt-2">
                      <Trophy className="w-3.5 h-3.5" /> Start Challenges (Free)
                    </Button>
                  </Link>
                </div>

                {/* Pathway 3: Verified Industry Credentials */}
                <div className="p-3.5 bg-black/40 border border-border rounded-xl space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="font-bold text-emerald-300 block">3. ISO 17024 Credentials</span>
                    <p className="text-[11px] text-muted-foreground">
                      Earn cryptographically signed, LinkedIn-verifiable credentials backed by anti-cheat proctoring.
                    </p>
                  </div>
                  <Link href="/quizzes">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold h-8 rounded-lg gap-1.5 cursor-pointer mt-2">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Take Certification Exam
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* 2026 Industry Shifts & Placement Highway Explorer */}
            <div className="pt-4 border-t border-border">
              <IndustryAIPlacementHighway />
            </div>
          </div>
        )}

        {/* ── TAB 7: UDEMY-GRADE SYLLABUS, HOURS & OBJECTIVES ── */}
        {activeTab === 'curriculum' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header Metrics Banner */}
            <div className="p-6 bg-gradient-to-r from-purple-950/70 via-card to-indigo-950/40 border border-purple-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold rounded-full">
                    {activeContent.category}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {activeDifficulty === 'BASIC' ? '14.5 Total Hours • 36 Topics' : activeDifficulty === 'INTERMEDIATE' ? '24.5 Total Hours • 48 Topics' : '32.0 Total Hours • 64 Topics'}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-foreground">{activeContent.title} (Complete Syllabus)</h3>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                  Udemy-grade structured curriculum with step-by-step topic durations, theoretical proofs, GPU lab exercises, and verified certification milestones.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-secondary/80 p-3 rounded-xl border border-border">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                    <Sparkles className="w-3.5 h-3.5" /> 4.9
                  </div>
                  <span className="text-[10px] text-muted-foreground">Rating</span>
                </div>
                <div className="h-6 w-px bg-border" />
                <div className="text-center">
                  <span className="font-bold text-sm text-foreground">100%</span>
                  <span className="text-[10px] text-muted-foreground block">Free & Open</span>
                </div>
              </div>
            </div>

            {/* What you'll learn (Objectives) */}
            <div className="p-5 bg-secondary/30 border border-border rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h4>What you'll learn (Key Objectives)</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-muted-foreground">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Master the theoretical and mathematical foundations of {activeContent.title}.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Build end-to-end models and pipelines in Python & PyTorch from scratch.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Diagnose overfitting, analyze gradients, and optimize GPU memory bandwidth.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Earn an ISO/IEC 17024 Accredited Certificate upon passing proctored exams.</span>
                </div>
              </div>
            </div>

            {/* Section Breakdown with Topic Timestamps */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-foreground">Course Content & Topic Breakdown</h4>
              
              <div className="space-y-2.5 text-xs">
                {/* Section 1 */}
                <div className="p-4 bg-card border border-border rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between font-bold text-foreground border-b border-border pb-2">
                    <span className="text-purple-400 font-mono">Section 1: Foundations & Core Mathematical Intuition</span>
                    <span className="text-muted-foreground font-mono">4 Topics • 45 mins</span>
                  </div>
                  <div className="space-y-1.5 pl-2">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>01. Course Overview, Problem Formulation & PEAS Framework</span>
                      <span className="font-mono text-purple-300">08:15</span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>02. Mathematical Representation, Dot Products & Tensors</span>
                      <span className="font-mono text-purple-300">14:30</span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>03. Non-Linear Activation Functions (ReLU, GELU, Sigmoid)</span>
                      <span className="font-mono text-purple-300">12:45</span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>04. Hands-on Lab: Vectorized Linear Algebra in NumPy</span>
                      <span className="font-mono text-emerald-400 font-bold">10:00</span>
                    </div>
                  </div>
                </div>

                {/* Section 2 */}
                <div className="p-4 bg-card border border-border rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between font-bold text-foreground border-b border-border pb-2">
                    <span className="text-purple-400 font-mono">Section 2: Deep Architecture & Loss Minimization</span>
                    <span className="text-muted-foreground font-mono">4 Topics • 1h 15m</span>
                  </div>
                  <div className="space-y-1.5 pl-2">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>01. Computational Graphs, Autograd & Backpropagation Calculus</span>
                      <span className="font-mono text-purple-300">22:10</span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>02. Optimizers: SGD with Momentum vs AdamW Weight Decay</span>
                      <span className="font-mono text-purple-300">18:40</span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>03. Batch Normalization, LayerNorm & Residual Connections</span>
                      <span className="font-mono text-purple-300">15:20</span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>04. Coding Lab: Building a Production Training Loop in PyTorch</span>
                      <span className="font-mono text-emerald-400 font-bold">20:00</span>
                    </div>
                  </div>
                </div>

                {/* Section 3 */}
                <div className="p-4 bg-card border border-border rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between font-bold text-foreground border-b border-border pb-2">
                    <span className="text-purple-400 font-mono">Section 3: Production Deployment & Capstone Deliverable</span>
                    <span className="text-muted-foreground font-mono">3 Topics • 1h 30m</span>
                  </div>
                  <div className="space-y-1.5 pl-2">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>01. Packaging FastAPI Microservices with Streaming Tokens</span>
                      <span className="font-mono text-purple-300">25:00</span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>02. Capstone Project: End-to-End Containerized AI Pipeline</span>
                      <span className="font-mono text-emerald-400 font-bold">45:00</span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>03. Final Certification Proctored Assessment</span>
                      <span className="font-mono text-purple-300">20:00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Expected Outcomes & Requirements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-secondary/30 border border-border rounded-xl space-y-2">
                <h5 className="font-bold text-foreground">Expected Outcomes</h5>
                <ul className="space-y-1.5 text-muted-foreground list-disc pl-4">
                  <li>Deployable GitHub project with complete test suite</li>
                  <li>Deep understanding of model parameters and latency trade-offs</li>
                  <li>ISO 17024 Accredited Badge for LinkedIn and resume</li>
                </ul>
              </div>
              <div className="p-4 bg-secondary/30 border border-border rounded-xl space-y-2">
                <h5 className="font-bold text-foreground">Requirements & Prerequisites</h5>
                <ul className="space-y-1.5 text-muted-foreground list-disc pl-4">
                  <li>Basic Python syntax (loops, functions, lists)</li>
                  <li>Basic high school mathematics intuition</li>
                  <li>Web browser with internet connection</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
