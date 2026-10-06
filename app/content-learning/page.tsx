'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { MathRenderer } from '@/components/ui/math-renderer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sparkles,
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ArrowRight,
  Code2,
  Cpu,
  Brain,
  Zap,
  CheckCircle2,
  HelpCircle,
  Share2,
  Download,
  Lightbulb,
  Layers,
  ChevronRight,
  Compass,
  FileText,
  MessageSquareQuote
} from 'lucide-react';

interface ResearchPaper {
  id: string;
  title: string;
  shortName: string;
  year: string;
  authors: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  analogyHeadline: string;
  analogyStory: string;
  realWorldUseCase: string;
  mathFormula: string;
  mathExplanation: string;
  codeSnippet: string;
  keyTakeaways: string[];
}

const RESEARCH_PAPERS: ResearchPaper[] = [
  {
    id: 'transformers',
    title: 'Attention Is All You Need (Vaswani et al.)',
    shortName: 'Transformers & Self-Attention',
    year: '2017 (Foundational)',
    authors: 'Google Brain & Google Research',
    category: 'Foundations',
    difficulty: 'Intermediate',
    analogyHeadline: 'The Crowded Wedding Dinner Analogy',
    analogyStory: `Imagine you are sitting at a bustling wedding banquet with 50 guests talking simultaneously. Your ears hear all 50 voices, but your brain doesn't process all conversations equally. 

When your grandmother across the table speaks, your brain selectively directs 80% of its focus to her voice, while keeping 20% awareness on the waiter walking past with dessert. 

In Artificial Intelligence, Self-Attention does the exact same thing for words. When an AI reads the sentence "The bank was flooded with river water", it automatically links the word "bank" with "river" and "flooded", ignoring financial definitions.`,
    realWorldUseCase: 'Powers ChatGPT, Claude, Google Gemini, and automated vernacular translation across 22 regional Indian languages.',
    mathFormula: '\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V',
    mathExplanation: 'Queries (Q) ask "What am I looking for?", Keys (K) say "Here is what I contain", and Values (V) deliver the actual information. The dot-product QK^T calculates similarity scores scaled by √d_k to prevent exploding gradients.',
    codeSnippet: `import torch
import torch.nn.functional as F

def scaled_dot_product_attention(Q, K, V, mask=None):
    """
    Q, K, V: [batch_size, num_heads, seq_len, head_dim]
    """
    d_k = Q.size(-1)
    # 1. Compute pairwise attention affinity
    scores = torch.matmul(Q, K.transpose(-2, -1)) / (d_k ** 0.5)
    
    if mask is not None:
        scores = scores.masked_fill(mask == 0, -1e9)
        
    # 2. Softmax transforms affinities into probability weights (summing to 1)
    attention_weights = F.softmax(scores, dim=-1)
    
    # 3. Weighted summation of values
    output = torch.matmul(attention_weights, V)
    return output, attention_weights`,
    keyTakeaways: [
      'Eliminated sequential bottlenecks of traditional RNNs and LSTMs.',
      'Enables massive parallelization across thousands of GPU cores.',
      'Forms the foundational backbone of every state-of-the-art Large Language Model.'
    ]
  },
  {
    id: 'dpo',
    title: 'Direct Preference Optimization: Your Language Model is Secretly a Reward Model (Rafailov et al.)',
    shortName: 'Direct Preference Optimization (DPO)',
    year: '2023',
    authors: 'Stanford University & DeepMind',
    category: 'Alignment & RL',
    difficulty: 'Intermediate',
    analogyHeadline: 'Teaching a Puppy Manners with Two Bowls',
    analogyStory: `Traditional AI alignment (RLHF) was like hiring a dedicated dog-show judge with a 50-page rulebook, calculating numerical points for every muscle movement before giving a treat. It was brittle, expensive, and frequently crashed.

DPO is like placing two food bowls down and showing the puppy: "This bowl is polite (Winner y_w), that bowl is messy (Loser y_l)". By directly contrasting good vs bad responses, the AI mathematically converges on desired behavior in one clean step without needing a separate reward model.`,
    realWorldUseCase: 'Enables agricultural AI bots to give concise, non-toxic, 2-step pesticide dosages to farmers instead of rambling, dangerous textbook dumps.',
    mathFormula: '\\mathcal{L}_{\\text{DPO}}(\\pi_\\theta; \\pi_{\\text{ref}}) = -\\mathbb{E}_{(x, y_w, y_l)}\\left[\\log \\sigma\\left(\\beta \\log \\frac{\\pi_\\theta(y_w|x)}{\\pi_{\\text{ref}}(y_w|x)} - \\beta \\log \\frac{\\pi_\\theta(y_l|x)}{\\pi_{\\text{ref}}(y_l|x)}\\right)\\right]',
    mathExplanation: 'Maximizes the probability of chosen output y_w over rejected output y_l while penalizing drift from the frozen reference model π_ref via temperature parameter β.',
    codeSnippet: `import torch
import torch.nn.functional as F

def dpo_loss(policy_chosen_logps, policy_rejected_logps,
             ref_chosen_logps, ref_rejected_logps, beta=0.1):
    # Log ratio between current policy and reference model
    pi_logratios = policy_chosen_logps - policy_rejected_logps
    ref_logratios = ref_chosen_logps - ref_rejected_logps
    
    # Implicit reward difference
    logits = pi_logratios - ref_logratios
    
    # Negative log-sigmoid of weighted difference
    losses = -F.logsigmoid(beta * logits)
    return losses.mean()`,
    keyTakeaways: [
      'Completely bypasses complex PPO reinforcement learning loops.',
      'Saves 60% of GPU compute during post-training alignment.',
      'Adopted by Zephyr, Llama-3-Instruct, and Mistral alignment pipelines.'
    ]
  },
  {
    id: 'mamba',
    title: 'Mamba: Linear-Time Sequence Modeling with Selective State Spaces (Gu & Dao)',
    shortName: 'Mamba & Selective SSMs',
    year: '2024',
    authors: 'Carnegie Mellon University & Princeton',
    category: 'Architecture',
    difficulty: 'Advanced',
    analogyHeadline: 'The Executive Pocket Diary vs The Stacking Archive',
    analogyStory: `Transformers have an Achilles heel: quadratic memory O(N²). When reading a 100,000-word book, the Transformer must compare word #100,000 to every single previous word, requiring massive GPU memory.

Mamba works like an executive keeping a concise pocket diary (State Space). As new events happen, she updates the diary in real time and discards irrelevant noise. She never needs to carry 50 boxes of old paperwork — her memory footprint remains strictly linear O(N).`,
    realWorldUseCase: 'Processing continuous 24-hour agricultural drone video feeds and soil telemetry streams on low-power edge microcontrollers without running out of RAM.',
    mathFormula: 'h\'(t) = \\mathbf{A}h(t) + \\mathbf{B}(x)x(t), \\quad y(t) = \\mathbf{C}(x)h(t)',
    mathExplanation: 'Traditional SSMs used fixed matrices. Mamba makes matrices B and C input-dependent, allowing the network to selectively remember relevant facts and purge irrelevant context.',
    codeSnippet: `import torch
import torch.nn as nn

class SelectiveSSM(nn.Module):
    def __init__(self, d_model, d_state):
        super().__init__()
        self.d_state = d_state
        # Input-dependent projections for B, C, and Delta (step size)
        self.x_proj = nn.Linear(d_model, d_state * 2 + 1)
        self.A_log = nn.Parameter(torch.log(torch.arange(1, d_state + 1).float()))
        
    def forward(self, u):
        # Linear time O(N) hardware-aware parallel scan
        # Dynamically selects what to retain vs forget
        return u # Selective state transition`,
    keyTakeaways: [
      '5x higher inference throughput than Transformers on long sequences.',
      'Memory scales linearly O(N) rather than quadratically O(N²).',
      'Pioneers the hybrid Transformer-SSM architecture seen in Gemini 1.5.'
    ]
  },
  {
    id: 'deepseek-moe',
    title: 'DeepSeek-V3 / DeepSeek-R1 Architecture: Mixture of Experts with Multi-Head Latent Attention',
    shortName: 'DeepSeek-R1 & Sparse MoE',
    year: '2025 (State-of-the-Art)',
    authors: 'DeepSeek AI',
    category: 'Efficiency & Reasoning',
    difficulty: 'Advanced',
    analogyHeadline: 'The Multi-Specialty Hospital Triage Analogy',
    analogyStory: `Imagine a world-class hospital with 64 renowned doctors: cardiologists, neurologists, dermatologists, and pediatricians. When a patient arrives with chest pain, the hospital doesn't summon all 64 doctors to examine the patient at once!

Instead, a triage receptionist quickly identifies the symptoms and routes the patient exclusively to the top 2 cardiologists.

DeepSeek operates on 671 Billion total parameters, but for any single word, its router activates only 37 Billion parameters. You get the intelligence of a massive supermodel with the electricity and speed of a tiny model!`,
    realWorldUseCase: 'Delivers frontier PhD-grade calculus reasoning and code synthesis at 90% lower cloud inference cost than dense closed-source models.',
    mathFormula: 'y = \\sum_{i \\in \\text{TopK}(g(x))} g_i(x) \\cdot E_i(x) + \\text{SharedExpert}(x)',
    mathExplanation: 'Gating network g(x) routes tokens to Top-K experts dynamically, while a dedicated shared expert preserves baseline common-sense knowledge across all tokens.',
    codeSnippet: `import torch
import torch.nn as nn

class SparseMoERouter(nn.Module):
    def __init__(self, d_model, num_experts=64, top_k=2):
        super().__init__()
        self.gate = nn.Linear(d_model, num_experts, bias=False)
        self.top_k = top_k

    def forward(self, x):
        # Compute affinity for all 64 experts
        logits = self.gate(x)
        # Select top-2 most relevant specialist experts
        weights, indices = torch.topk(torch.softmax(logits, dim=-1), self.top_k, dim=-1)
        # Normalize weights across selected experts
        weights = weights / weights.sum(dim=-1, keepdim=True)
        return weights, indices`,
    keyTakeaways: [
      '671B parameters total, only 37B activated per token.',
      'Multi-Head Latent Attention (MLA) reduces KV cache memory by 85%.',
      'Pioneered open-weights reinforcement-learning-driven emergent reasoning.'
    ]
  },
  {
    id: 'flashattention',
    title: 'FlashAttention-3: Fast and Memory-Efficient Exact Attention with Asynchronous Tiling (Dao et al.)',
    shortName: 'FlashAttention-3',
    year: '2024',
    authors: 'Tri Dao, Colfax Research & Stanford',
    category: 'Hardware & Kernels',
    difficulty: 'Advanced',
    analogyHeadline: 'The Chef Cooking at the Counter vs Driving to the Grocery Store',
    analogyStory: `In modern AI hardware, GPU High Bandwidth Memory (HBM) is like a warehouse 10 miles away, while GPU SRAM is your kitchen cutting board right in front of you. 

Early Transformer implementations computed attention by walking 10 miles to the warehouse to save intermediate numbers, walking 10 miles back, reading them, and walking 10 miles back again. The GPU math engines were sitting idle 80% of the time waiting for memory delivery!

FlashAttention reorganizes the calculation into small tiles that fit entirely on the kitchen cutting board (SRAM), computing the exact mathematical softmax in a single pass without ever writing intermediate matrices to the slow warehouse.`,
    realWorldUseCase: 'Enables 1 million token context windows in consumer-accessible cloud GPUs without catastrophic out-of-memory errors.',
    mathFormula: '\\text{Speedup} = \\frac{\\text{Memory Reads (Standard)}}{\\text{Memory Reads (Flash)}} \\approx \\mathcal{O}\\left(\\frac{N^2 d}{M}\\right) \\rightarrow \\mathcal{O}\\left(\\frac{N^2 d^2}{M}\\right)',
    mathExplanation: 'FlashAttention never materializes the N × N attention matrix in slow HBM. It uses online softmax recalculation within ultra-fast GPU on-chip SRAM.',
    codeSnippet: `// Concept: FlashAttention GPU Kernel Tiling (CUDA / Triton)
// Divides Q, K, V into SRAM-sized blocks (e.g., 64x64 or 128x128)
// Computes running maximums and normalizers incrementally:
// m_new = max(m_old, row_max(S_ij))
// P_ij = exp(S_ij - m_new)
// l_new = exp(m_old - m_new) * l_old + row_sum(P_ij)
// Acc_new = diag(exp(m_old - m_new)) * Acc_old + P_ij * V_j`,
    keyTakeaways: [
      '2x to 4x raw wall-clock speedup for training and inference.',
      'Mathematically exact — zero loss of precision or approximation error.',
      'Now standard in PyTorch 2.x via scaled_dot_product_attention.'
    ]
  }
];

const FAQS_WITH_DR_MAYA = [
  {
    question: 'Why do Large Language Models hallucinate false facts?',
    answer: `Think of an LLM as a world-champion actor who knows every linguistic style, rhythm, and cadence ever written. The model's fundamental objective is not "truth verification" — its objective is "next token plausibility". If a question has ambiguous or missing information, the model generates words that sound 100% grammatically and stylistically convincing, just like an actor improvising a line on stage. This is why Grounding, Retrieval-Augmented Generation (RAG), and Verifiable Chain-of-Thought are essential innovations in AI Nexus Hub!`,
    icon: Lightbulb
  },
  {
    question: 'What is 4-bit Quantization (bitsandbytes / GGUF) and how does it save RAM?',
    answer: `Imagine weighing spices with an ultra-precise laboratory scale that displays 16 decimal places (e.g. 5.1482910482019482 grams, FP16). To store that number, your computer uses 16 bits of memory. In 4-bit quantization, we round the spice scale to friendly notches (e.g. 5.1 grams). For language generation, neural networks are remarkably resilient: losing 12 decimal places of precision causes less than 1% degradation in answers, but reduces the required GPU memory from 32 GB down to just 6 GB! That's why you can run Llama-3 locally on your laptop in our Ollama Studio!`,
    icon: Zap
  },
  {
    question: 'How does Backpropagation calculate gradients backwards?',
    answer: `Imagine a bucket brigade of 10 people passing water to put out a fire. The person at the end spills half the water (Error / Loss). Instead of blaming the first person arbitrarily, the fire chief starts at person #10 and asks: "How much did your hands shake?" Then person #10 passes the adjustment to person #9 using the Chain Rule of Calculus: dy/dx = (dy/du) * (du/dx). Each person adjusts their grip slightly. That is Backpropagation!`,
    icon: Brain
  },
  {
    question: 'What is the difference between Pre-training, Fine-tuning, and In-Context Learning?',
    answer: `Pre-training is earning a Bachelor's Degree across 15 trillion words of the internet. Fine-tuning (like LoRA) is doing an intensive 3-month residency to become an Agricultural Agronomist. In-Context Learning (prompting) is handing that agronomist a specific farmer's photo and soil report right now and asking for immediate advice!`,
    icon: BookOpen
  }
];

export default function ContentLearningResearchPage() {
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper>(RESEARCH_PAPERS[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState('1.0x');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<'analogy' | 'math' | 'code'>('analogy');

  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  return (
    <NexusShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/dashboard" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/roadmap" className="hover:text-primary transition-colors">Explore</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium">Frontier Research & Concept Explanations</span>
        </div>

        {/* Hero Banner: Dr. Maya Sharma Mentor Intro */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white border border-indigo-500/20 shadow-2xl p-6 sm:p-10">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Dr. Maya Sharma Portrait & Bio Badge */}
            <div className="lg:col-span-5 flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="relative group mb-4">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 rounded-3xl blur-md opacity-75 group-hover:opacity-100 transition duration-500" />
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-slate-800">
                  <Image
                    src="/images/ai-mentor-dr-maya.jpg"
                    alt="Dr. Maya Sharma - Lead AI Research Scientist and Interactive Mentor"
                    fill
                    className="object-cover object-top hover:scale-105 transition duration-700"
                    priority
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent p-2 text-center">
                    <span className="text-[11px] font-semibold text-emerald-300 flex items-center justify-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Live AI Mentor
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
                  Dr. Maya Sharma, Ph.D.
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 border-purple-400/30 text-[10px]">
                    Ex-DeepMind / Stanford
                  </Badge>
                </h3>
                <p className="text-xs text-indigo-200/80">
                  Lead AI Scientist & Interactive Educator • AI Nexus Hub
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-2 justify-center sm:justify-start">
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-slate-200">
                    📚 18 Breakthrough Papers
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-slate-200">
                    💡 Real-Time Analogies
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                    ⚡ Zero Jargon Guarantee
                  </span>
                </div>
              </div>
            </div>

            {/* Introductory Statement & Interactive Audio Player Simulation */}
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Complex AI Concepts Made Intuitive
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  Demystifying Frontier AI Research With Everyday Real-World Analogies
                </h1>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  &ldquo;Cutting-edge AI research papers often look like intimidating walls of Greek symbols and calculus. My mission is to translate multi-head attention, direct preference optimization, and linear state spaces into relatable everyday stories you can understand in 5 minutes!&rdquo;
                </p>
              </div>

              {/* Interactive Audio Lecture Simulation Bar */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={toggleAudio}
                      className={`h-9 px-3 rounded-xl gap-2 font-medium transition ${
                        isPlayingAudio 
                          ? 'bg-amber-500 hover:bg-amber-600 text-black' 
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      {isPlayingAudio ? (
                        <>
                          <Pause className="w-4 h-4 fill-current" />
                          Pause Dr. Maya
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current" />
                          Listen to Audio Briefing
                        </>
                      )}
                    </Button>
                    <span className="font-mono text-[11px] text-slate-400">
                      {isPlayingAudio ? '02:41 / 06:15' : 'Audio Note • 06:15'}
                    </span>
                  </div>

                  {/* Speed Selector */}
                  <div className="flex items-center gap-1">
                    {(['1.0x', '1.25x', '1.5x'] as const).map((spd) => (
                      <button
                        key={spd}
                        onClick={() => setPlaybackSpeed(spd)}
                        className={`text-[10px] px-2 py-1 rounded-md font-medium transition ${
                          playbackSpeed === spd
                            ? 'bg-white/20 text-white font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {spd}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Animated Sound Waveform */}
                <div className="flex items-center gap-1.5 h-6 px-1">
                  {Array.from({ length: 32 }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-full transition-all duration-300 ${
                        isPlayingAudio 
                          ? 'bg-gradient-to-t from-indigo-400 to-cyan-300 animate-pulse' 
                          : 'bg-white/20'
                      }`}
                      style={{
                        height: isPlayingAudio 
                          ? `${Math.max(15, (Math.sin(i * 0.7) * 45 + 50))}%` 
                          : `${(i % 5 + 1) * 15}%`,
                        animationDelay: `${i * 50}ms`
                      }}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/5">
                  <span className="flex items-center gap-1.5 text-indigo-300">
                    <MessageSquareQuote className="w-3.5 h-3.5" />
                    Topic: &ldquo;{selectedPaper.shortName}&rdquo;
                  </span>
                  <span>Audio transcript available in Kannada, Hindi, and English</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Paper Selector Chips / Carousel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Select Frontier Paper Breakdown</h2>
              <p className="text-xs text-muted-foreground">Choose a milestone AI breakthrough to explore with Dr. Maya Sharma</p>
            </div>
            <Badge variant="outline" className="hidden sm:inline-flex text-xs">
              5 Foundational Breakthroughs
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {RESEARCH_PAPERS.map((paper) => {
              const isSelected = selectedPaper.id === paper.id;
              return (
                <button
                  key={paper.id}
                  onClick={() => setSelectedPaper(paper)}
                  className={`text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between h-32 ${
                    isSelected
                      ? 'bg-primary/10 border-primary shadow-md ring-2 ring-primary/20'
                      : 'bg-card hover:bg-muted/50 border-border'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        {paper.year}
                      </span>
                      <Badge variant={isSelected ? 'default' : 'secondary'} className="text-[9px] px-1.5 py-0">
                        {paper.difficulty}
                      </Badge>
                    </div>
                    <div className="font-semibold text-sm line-clamp-2 text-foreground">
                      {paper.shortName}
                    </div>
                  </div>
                  <div className="text-[11px] text-primary flex items-center gap-1 font-medium mt-2">
                    Explore Analogy <ArrowRight className="w-3 h-3" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Deep Dive Interactive Card for Selected Paper */}
        <Card className="border-border shadow-lg overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs font-semibold">
                    {selectedPaper.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Authors: {selectedPaper.authors}
                  </span>
                </div>
                <CardTitle className="text-xl sm:text-2xl font-bold">
                  {selectedPaper.title}
                </CardTitle>
                <CardDescription className="text-sm">
                  {selectedPaper.analogyHeadline}
                </CardDescription>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex items-center gap-2 self-start sm:self-center">
                <div className="inline-flex p-1 rounded-xl bg-muted border border-border">
                  <button
                    onClick={() => setActiveTab('analogy')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      activeTab === 'analogy'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    💡 Intuitive Analogy
                  </button>
                  <button
                    onClick={() => setActiveTab('math')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      activeTab === 'math'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    📐 Mathematical Rigor
                  </button>
                  <button
                    onClick={() => setActiveTab('code')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      activeTab === 'code'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    💻 PyTorch Kernel
                  </button>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 sm:p-8 space-y-8">
            
            {/* TAB 1: Real-Life Analogy */}
            {activeTab === 'analogy' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Dr. Maya's Speech Bubble */}
                  <div className="relative p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-transparent border border-purple-500/20 space-y-3">
                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold text-xs uppercase tracking-wider">
                      <Sparkles className="w-4 h-4" />
                      Dr. Maya explains like you are five:
                    </div>
                    <div className="text-base sm:text-lg leading-relaxed text-foreground whitespace-pre-line font-serif italic">
                      &ldquo;{selectedPaper.analogyStory}&rdquo;
                    </div>
                  </div>

                  {/* Real-World Use Case Box */}
                  <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4" />
                      Real-World Deployment in Action:
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">
                      {selectedPaper.realWorldUseCase}
                    </p>
                  </div>

                  {/* Core Takeaways */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Key Engineering Takeaways:
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {selectedPaper.keyTakeaways.map((takeaway, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-sm text-foreground">
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span>{takeaway}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right Interactive Analogy Widget */}
                <div className="lg:col-span-4 p-5 rounded-2xl bg-muted/40 border border-border space-y-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Brain className="w-4 h-4 text-primary" />
                    Interactive Conceptual Check
                  </h4>

                  <div className="text-xs text-muted-foreground leading-relaxed">
                    Test your understanding with Dr. Maya:
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-border space-y-2 text-xs">
                    <div className="font-semibold text-foreground">
                      Q: Why not use simple RNNs instead of {selectedPaper.shortName}?
                    </div>
                    <div className="text-muted-foreground">
                      Because RNNs process step-by-step sequentially, causing information decay and blocking GPU multi-core parallelism!
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link href={`/challenges`} className="w-full">
                      <Button variant="outline" className="w-full text-xs gap-1.5">
                        Solve Code Challenge for this Paper
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Mathematical Rigor */}
            {activeTab === 'math' && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-card border border-border space-y-4 text-center">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Core Mathematical Formulation
                  </span>
                  <div className="py-4 overflow-x-auto">
                    <MathRenderer math={selectedPaper.mathFormula} block className="text-lg sm:text-xl text-primary font-bold" />
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-muted/40 border border-border space-y-3">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    Step-by-Step Mathematical Intuition
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedPaper.mathExplanation}
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: PyTorch Implementation */}
            {activeTab === 'code' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-primary" />
                    Clean PyTorch Production Implementation
                  </span>
                  <Badge variant="outline" className="text-xs font-mono">
                    Python 3.10+ / PyTorch 2.x
                  </Badge>
                </div>

                <pre className="p-5 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed shadow-inner">
                  <code>{selectedPaper.codeSnippet}</code>
                </pre>
              </div>
            )}

          </CardContent>
        </Card>

        {/* Section: "Ask Dr. Maya" Frequently Confused AI Concepts */}
        <div className="space-y-6 pt-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <MessageSquareQuote className="w-6 h-6 text-primary" />
              Frequently Confused AI Concepts: Clarified by Dr. Maya
            </h2>
            <p className="text-sm text-muted-foreground">
              Clear answers to the questions most junior AI engineers are afraid to ask in interviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FAQS_WITH_DR_MAYA.map((faq, index) => {
              const Icon = faq.icon;
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                    isOpen
                      ? 'bg-card border-primary/40 shadow-md ring-1 ring-primary/20'
                      : 'bg-card/60 hover:bg-card border-border'
                  }`}
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <h3 className="font-semibold text-base text-foreground flex items-center justify-between">
                        {faq.question}
                        <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0 ${
                          isOpen ? 'rotate-90 text-primary' : ''
                        }`} />
                      </h3>
                      {isOpen && (
                        <p className="text-sm text-muted-foreground leading-relaxed pt-2 border-t border-border/50">
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Callout: Transition to Career Hub */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-indigo-500/10 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl font-bold text-foreground">
              Ready to turn these research papers into a high-paying AI Career?
            </h3>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Visit Dr. Maya Sharma in the AI Career Hub for role roadmaps, salary benchmarks (₹6 LPA to ₹95 LPA), and mock technical interview simulations.
            </p>
          </div>
          <Link href="/career" className="shrink-0">
            <Button size="lg" className="rounded-xl gap-2 shadow-lg">
              Visit Career Hub <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

      </div>
    </NexusShell>
  );
}
