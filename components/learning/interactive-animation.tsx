'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, ChevronRight, Sparkles, Layers, ArrowRight, Activity } from 'lucide-react';

export type AnimationType =
  | 'FORWARD_PROPAGATION'
  | 'BACKPROPAGATION'
  | 'GRADIENT_DESCENT'
  | 'CNN_CONVOLUTION'
  | 'ATTENTION'
  | 'TRANSFORMER'
  | 'TOKENIZATION'
  | 'EMBEDDINGS'
  | 'RAG'
  | 'AGENT_PLANNING';

interface EducationalAnimationProps {
  type: AnimationType;
  title?: string;
  description?: string;
}

export function EducationalAnimation({ type, title, description }: EducationalAnimationProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [step, setStep] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setStep((prev) => (prev + 1) % 4);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const animationMeta: Record<AnimationType, { title: string; steps: string[]; color: string }> = {
    FORWARD_PROPAGATION: {
      title: title || 'Neural Network Forward Propagation Flow',
      steps: [
        'Step 1: Input vector X receives raw numerical feature inputs.',
        'Step 2: Linear transformation applies weights W & biases B (Z = W·X + B).',
        'Step 3: Activation function (ReLU/Sigmoid) introduces non-linearity.',
        'Step 4: Output layer generates probability prediction vector Ŷ.',
      ],
      color: 'purple',
    },
    BACKPROPAGATION: {
      title: title || 'Backpropagation & Chain Rule Gradient Calculation',
      steps: [
        'Step 1: Compute loss error function L(Y, Ŷ).',
        'Step 2: Calculate output layer gradient ∂L/∂Ŷ using automatic differentiation.',
        'Step 3: Propagate gradients backward through hidden layers via chain rule.',
        'Step 4: Update weights: W_new = W_old - (learning_rate * ∂L/∂W).',
      ],
      color: 'rose',
    },
    GRADIENT_DESCENT: {
      title: title || 'Gradient Descent Optimization Step',
      steps: [
        'Step 1: Initialize model parameters randomly at a point on the loss surface.',
        'Step 2: Compute steepest descent gradient slope ∇L(W).',
        'Step 3: Take step in negative gradient direction scaled by learning rate α.',
        'Step 4: Repeat until loss converges to global/local minimum point.',
      ],
      color: 'amber',
    },
    CNN_CONVOLUTION: {
      title: title || '2D CNN Kernel Convolution Feature Extraction',
      steps: [
        'Step 1: 3x3 filter kernel overlaps top-left section of input image grid.',
        'Step 2: Compute element-wise dot product multiplication and sum values.',
        'Step 3: Slide kernel across image matrix using specified stride length.',
        'Step 4: Output spatial feature map highlighting edges, textures, and shapes.',
      ],
      color: 'emerald',
    },
    ATTENTION: {
      title: title || 'Transformer Scaled Dot-Product Self-Attention',
      steps: [
        'Step 1: Project input token vectors into Query (Q), Key (K), and Value (V) matrices.',
        'Step 2: Compute dot-product matrix score Q · Kᵀ measuring pairwise token relevance.',
        'Step 3: Scale by 1/√d_k and apply Softmax function to obtain attention weights.',
        'Step 4: Multiply attention weights by Value matrix V to compute contextual output.',
      ],
      color: 'purple',
    },
    TRANSFORMER: {
      title: title || 'Transformer Encoder-Decoder Architecture Flow',
      steps: [
        'Step 1: Positional encodings added to input embeddings.',
        'Step 2: Multi-Head Self-Attention layers compute parallel relationship subspaces.',
        'Step 3: Residual connections & Layer Normalization stabilize gradient flow.',
        'Step 4: Feed-Forward Network transforms features into contextual token predictions.',
      ],
      color: 'cyan',
    },
    TOKENIZATION: {
      title: title || 'Text Tokenization & Vocabulary ID Lookup',
      steps: [
        'Step 1: Input text string: "Neural networks process data efficiently".',
        'Step 2: Byte-Pair Encoding (BPE) splits text into subword token chunks.',
        'Step 3: Tokens mapped to vocabulary numerical IDs: [1204, 3819, 902, 114].',
        'Step 4: Numerical token IDs passed into neural network embedding layer.',
      ],
      color: 'indigo',
    },
    EMBEDDINGS: {
      title: title || 'High-Dimensional Dense Vector Embedding Space',
      steps: [
        'Step 1: Words mapped into 768-dimensional continuous vector spaces.',
        'Step 2: Semantic relationships represented as vector directions (King - Man + Woman = Queen).',
        'Step 3: Cosine similarity measures closeness between concepts in latent space.',
        'Step 4: Similar meanings cluster together naturally in high dimensions.',
      ],
      color: 'purple',
    },
    RAG: {
      title: title || 'Retrieval-Augmented Generation (RAG) Architecture',
      steps: [
        'Step 1: User prompt query embedded into vector representation.',
        'Step 2: Vector database (Pinecone/FAISS) retrieves top-k semantically relevant chunks.',
        'Step 3: Retrieved document context concatenated into LLM system prompt.',
        'Step 4: LLM generates grounded answer with zero hallucinations and exact citations.',
      ],
      color: 'emerald',
    },
    AGENT_PLANNING: {
      title: title || 'Agentic AI ReAct (Reason + Act) Loop Execution',
      steps: [
        'Step 1: Goal input received: "Research & summarize quarterly AI news".',
        'Step 2: LLM reasons & selects tool call: WebSearch("AI trends Q3 2026").',
        'Step 3: Tool executes, returns observation response payload.',
        'Step 4: Agent updates working memory, evaluates completion, and returns final synthesis.',
      ],
      color: 'amber',
    },
  };

  const currentMeta = animationMeta[type] || animationMeta.FORWARD_PROPAGATION;

  return (
    <Card className="p-5 bg-[#121217] border border-[#272730] rounded-2xl space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h4 className="text-sm font-bold text-white">{currentMeta.title}</h4>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsPlaying(!isPlaying)}
            className="h-8 px-2.5 bg-[#181820] border-[#272730] text-zinc-300 hover:text-white text-xs gap-1 cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setStep((step + 1) % 4)}
            className="h-8 px-2.5 bg-[#181820] border-[#272730] text-zinc-300 hover:text-white text-xs gap-1 cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" /> Step
          </Button>
        </div>
      </div>

      {description && <p className="text-xs text-zinc-400">{description}</p>}

      {/* Visual Animation Box */}
      <div className="p-4 bg-[#181820] border border-[#272730] rounded-xl space-y-3">
        <div className="grid grid-cols-4 gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`p-3 rounded-xl border text-center transition-all duration-500 flex flex-col items-center justify-center gap-1 ${
                step === i
                  ? 'bg-purple-600/30 border-purple-500 text-white shadow-lg shadow-purple-900/30 scale-105'
                  : i < step
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                  : 'bg-[#121217] border-[#272730] text-zinc-500'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider">Step {i + 1}</span>
              <Activity className={`w-4 h-4 ${step === i ? 'text-purple-400 animate-pulse' : 'text-zinc-600'}`} />
            </div>
          ))}
        </div>

        {/* Current Active Step Highlight */}
        <div className="p-3 bg-purple-950/20 border border-purple-800/30 rounded-xl text-xs font-semibold text-purple-300 flex items-center gap-2">
          <ArrowRight className="w-4 h-4 text-purple-400 shrink-0" />
          <span>{currentMeta.steps[step]}</span>
        </div>
      </div>
    </Card>
  );
}
