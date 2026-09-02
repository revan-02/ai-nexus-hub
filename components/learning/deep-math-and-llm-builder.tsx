'use client';

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Brain,
  Cpu,
  Layers,
  Sparkles,
  Code,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Calculator,
  Sliders,
  Terminal,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  ChevronRight,
  Database,
  Search,
  Activity,
  Play,
  RotateCcw,
  Network
} from 'lucide-react';
import { MathRenderer } from '@/components/ui/math-renderer';

export type MathDifficultyLevel = 'basic' | 'intermediate' | 'advance';

interface MathConcept {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  level: MathDifficultyLevel;
  application: string;
  mathDerivation: {
    coreEquation: string;
    description: string;
    steps: { stepNum: number; title: string; math: string; explanation: string }[];
  };
  whereToUse: {
    bestFor: string[];
    avoidWhen: string[];
    alternatives: string[];
  };
  howToUse: {
    language: string;
    code: string;
  };
  eli5: string;
}

const MATH_CONCEPTS_DATABASE: MathConcept[] = [
  // ── BASIC LEVEL ──
  {
    id: 'gradient-descent-basic',
    title: 'Gradient Descent & Parameter Optimization',
    subtitle: 'The fundamental mathematical engine that allows all AI models to learn from mistakes',
    category: 'Optimization & Foundations',
    level: 'basic',
    application:
      'Used universally across Linear Regression, Neural Networks, CNNs, and LLMs (GPT, Llama, Gemini) to automatically adjust millions or billions of internal parameters (weights and biases) so that error on training data progressively approaches zero.',
    mathDerivation: {
      coreEquation: 'θ_(t+1) = θ_t - η · ∇_θ L(θ_t)',
      description: 'Parameter update rule at step t using learning rate η and loss gradient ∇L.',
      steps: [
        {
          stepNum: 1,
          title: 'Define the Error Function (Mean Squared Error)',
          math: 'L(W, b) = (1 / 2N) ∑_{i=1}^N (ŷ_i - y_i)²,   where ŷ_i = W · x_i + b',
          explanation: 'Measures the mean squared Euclidean distance between model predictions ŷ and ground truth targets y across N samples.'
        },
        {
          stepNum: 2,
          title: 'Compute Partial Derivative with Respect to Weight (Chain Rule)',
          math: '∂L / ∂W = (1 / N) ∑_{i=1}^N (ŷ_i - y_i) · x_i = (1 / N) Xᵀ (ŷ - y)',
          explanation: 'Calculates the directional slope of the loss landscape with respect to W. The sign indicates which direction increases error.'
        },
        {
          stepNum: 3,
          title: 'Gradient Update Step (Stepping Downhill)',
          math: 'W_new = W_old - η · (∂L / ∂W)',
          explanation: 'Subtracting the gradient scaled by learning rate η moves parameters down the steepest path of the error bowl.'
        }
      ]
    },
    whereToUse: {
      bestFor: ['Linear & Logistic Regression', 'Deep Neural Network training', 'Fine-tuning weights on new datasets'],
      avoidWhen: ['Non-differentiable loss surfaces (use Genetic/Evolutionary algorithms instead)', 'Extremely small datasets where closed-form OLS is instant'],
      alternatives: ['Ordinary Least Squares (OLS)', 'AdamW Optimizer', 'RMSprop']
    },
    howToUse: {
      language: 'python',
      code: `import torch

# 1. Initialize weight with gradient tracking
W = torch.tensor([2.0], requires_grad=True)
b = torch.tensor([0.0], requires_grad=True)
learning_rate = 0.05

# Training loop
for epoch in range(100):
    # Forward pass: y_pred = W * x + b
    x_train = torch.tensor([1.0, 2.0, 3.0, 4.0])
    y_true  = torch.tensor([2.0, 4.0, 6.0, 8.0])
    y_pred = W * x_train + b
    
    # Compute Mean Squared Error Loss
    loss = torch.mean((y_pred - y_true) ** 2)
    
    # Backward pass: Compute dLoss/dW and dLoss/db automatically
    loss.backward()
    
    # Optimization step: Update weights without tracking gradients
    with torch.no_grad():
        W -= learning_rate * W.grad
        b -= learning_rate * b.grad
        
        # Zero gradients for the next epoch
        W.grad.zero_()
        b.grad.zero_()

print(f"Trained Weight: {W.item():.2f} (Expected: 2.00)")`
    },
    eli5:
      'Imagine you are blindfolded on a foggy mountain and need to reach the valley floor. You feel the slope with your feet and take a step downhill. The slope is the Gradient, your step size is the Learning Rate (η), and the valley floor is zero error.'
  },
  {
    id: 'cross-entropy-loss',
    title: 'Categorical Cross-Entropy & Maximum Likelihood',
    subtitle: 'Mathematical loss function used to train classifiers and autoregressive LLMs',
    category: 'Loss Formulations',
    level: 'basic',
    application:
      'Used in next-token prediction in Large Language Models (predicting the next word from a 32,000+ token dictionary), image classification (MNIST, ImageNet), and spam filtering.',
    mathDerivation: {
      coreEquation: 'L_CE = - ∑_{c=1}^C y_c · log(p_c) = - log(p_{true_class})',
      description: 'Penalizes confident wrong predictions exponentially while rewarding high probability on the correct class.',
      steps: [
        {
          stepNum: 1,
          title: 'Softmax Probability Conversion from Raw Logits z',
          math: 'p_c = exp(z_c) / ∑_{j=1}^C exp(z_j)',
          explanation: 'Converts unconstrained real numbers (logits z) into a valid probability distribution that sums to 1.0.'
        },
        {
          stepNum: 2,
          title: 'Negative Log-Likelihood Formulation',
          math: 'L = - log(p_k)   where k is the index of the true class (y_k = 1)',
          explanation: 'If model assigns p_k = 0.99, Loss = -log(0.99) = 0.01 (low error). If p_k = 0.01, Loss = -log(0.01) = 4.60 (high penalty).'
        },
        {
          stepNum: 3,
          title: 'Softmax + Cross-Entropy Gradient Derivation',
          math: '∂L / ∂z_i = p_i - y_i',
          explanation: 'Remarkably elegant gradient: the error signal passed back is simply predicted probability minus ground truth!'
        }
      ]
    },
    whereToUse: {
      bestFor: ['Multi-class classification', 'Autoregressive Next-Token Prediction in LLMs', 'Speech recognition phoneme classification'],
      avoidWhen: ['Continuous numeric regression (use MSE or Huber Loss)', 'Multi-label non-exclusive tagging (use Binary Cross-Entropy with Sigmoid)'],
      alternatives: ['Binary Cross-Entropy (BCE)', 'Focal Loss (for extreme class imbalance)', 'Label Smoothing Cross-Entropy']
    },
    howToUse: {
      language: 'python',
      code: `import torch
import torch.nn as nn

# Unnormalized model outputs for 3 classes: [Cat, Dog, Bird]
logits = torch.tensor([[3.2, 1.1, -0.5]], requires_grad=True)
# Ground truth: Class 0 (Cat)
target = torch.tensor([0])

# PyTorch CrossEntropyLoss combines log_softmax + NLLLoss under the hood
criterion = nn.CrossEntropyLoss()
loss = criterion(logits, target)
loss.backward()

print(f"Calculated Cross-Entropy Loss: {loss.item():.4f}")
print(f"Gradients (p - y): {logits.grad.numpy()}")`
    },
    eli5:
      'If you take a multiple-choice exam with 4 options and guess the correct answer with 99% confidence, your stress penalty is zero. If you are 99% confident in the wrong answer, you get a massive penalty score.'
  },

  // ── INTERMEDIATE LEVEL ──
  {
    id: 'self-attention-mechanism',
    title: 'Scaled Dot-Product Self-Attention (Q, K, V)',
    subtitle: 'The mathematical core of the Transformer architecture powering all modern generative AI',
    category: 'Transformer Architectures',
    level: 'intermediate',
    application:
      'Enables models to process entire paragraphs in parallel and compute dynamic semantic relationships between every word and every other word, solving the catastrophic forgetting and sequential slowdown of RNNs and LSTMs.',
    mathDerivation: {
      coreEquation: 'Attention(Q, K, V) = Softmax( (Q · Kᵀ) / √d_k ) · V',
      description: 'Calculates an attention weight matrix between Queries and Keys, scales by √d_k to prevent gradient vanishing, and computes a weighted sum of Values.',
      steps: [
        {
          stepNum: 1,
          title: 'Linear Projections to Query, Key, Value Spaces',
          math: 'Q = X · W_Q,   K = X · W_K,   V = X · W_V   ∈  ℝ^(N × d_k)',
          explanation: 'Input token vectors X (dimension d_model) are linearly projected into specialized Query (what I seek), Key (what I offer), and Value (what I contain) representations.'
        },
        {
          stepNum: 2,
          title: 'Pairwise Compatibility Dot-Product Matrix',
          math: 'S = Q · Kᵀ   ∈  ℝ^(N × N),   where S_{i,j} = q_i · k_j',
          explanation: 'Dot product between Query vector i and Key vector j measures geometric directional similarity (relevance score).'
        },
        {
          stepNum: 3,
          title: 'Scaling by 1 / √d_k (Variance Normalization)',
          math: 'S_scaled = S / √d_k',
          explanation: 'For large d_k, dot products grow large in magnitude, pushing softmax into regions with near-zero gradients. Dividing by √d_k preserves unit variance.'
        },
        {
          stepNum: 4,
          title: 'Softmax Row-wise Normalization & Value Aggregation',
          math: 'A = Softmax(S_scaled),   Output = A · V   ∈  ℝ^(N × d_v)',
          explanation: 'Softmax turns scores into percentages that sum to 1. Multiplying by V yields context-aware contextual embeddings.'
        }
      ]
    },
    whereToUse: {
      bestFor: ['Transformers (GPT, Llama, Mistral, Gemini, BERT)', 'Vision Transformers (ViT)', 'Multimodal cross-attention (Text-to-Image Diffusion)'],
      avoidWhen: ['Extremely long sequences >1M tokens without linear approximations (O(N^2) memory footprint)', 'Embedded microcontrollers with <100KB RAM'],
      alternatives: ['FlashAttention-2/3 (IO-aware tiling)', 'State-Space Models (Mamba / S4)', 'Linear Attention / RWKV']
    },
    howToUse: {
      language: 'python',
      code: `import torch
import math

def scaled_dot_product_attention(Q, K, V, mask=None):
    # Q, K, V dimensions: [batch_size, num_heads, seq_len, head_dim]
    d_k = Q.size(-1)
    
    # Step 1: Compute Q * K^T / sqrt(d_k)
    scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(d_k)
    
    # Step 2: Apply Causal Mask (prevent looking at future tokens)
    if mask is not None:
        scores = scores.masked_fill(mask == 0, -1e9)
        
    # Step 3: Softmax probabilities
    attn_weights = torch.softmax(scores, dim=-1)
    
    # Step 4: Multiply by V
    output = torch.matmul(attn_weights, V)
    return output, attn_weights

# Demonstration with 4 tokens, head dimension 64
X = torch.randn(1, 4, 64)
output, weights = scaled_dot_product_attention(X, X, X)
print(f"Attention Output Shape: {output.shape}")
print(f"Attention Matrix Sum Row 0: {weights[0, 0].sum().item():.4f}")`
    },
    eli5:
      'Think of a library filing system: Query is what you type in the search bar ("find books on quantum physics"), Key is the book title on the spine, and Value is the actual book contents. The system scores every book title, creates a percentage ranking, and blends the best books together for you.'
  },
  {
    id: 'backprop-chain-rule',
    title: 'Backpropagation & Multivariable Chain Rule',
    subtitle: 'Recursive exact gradient propagation across deep neural network layers',
    category: 'Deep Learning Calculus',
    level: 'intermediate',
    application:
      'Allows networks with hundreds of hidden layers to learn complex non-linear representations by flowing gradient signals backwards from the final output loss to the earliest input layers.',
    mathDerivation: {
      coreEquation: '∂L / ∂W^[l] = δ^[l] · (a^[l-1])ᵀ,   where δ^[l] = ((W^[l+1])ᵀ δ^[l+1]) ⊙ σ\'(z^[l])',
      description: 'The recursive backward pass equations for layer l given error signal δ from layer l+1.',
      steps: [
        {
          stepNum: 1,
          title: 'Forward Activation Sequence',
          math: 'z^[l] = W^[l] · a^[l-1] + b^[l],   a^[l] = σ(z^[l])',
          explanation: 'Computes linear transformation z followed by non-linear activation function σ (e.g. ReLU, GELU, SiLU).'
        },
        {
          stepNum: 2,
          title: 'Output Layer Error Term δ^[L]',
          math: 'δ^[L] = ∇_{a^[L]} L ⊙ σ\'(z^[L]) = (a^[L] - y)',
          explanation: 'Base case of recursion: derivative of total loss with respect to pre-activation z at the final layer.'
        },
        {
          stepNum: 3,
          title: 'Backpropagating Error to Hidden Layers',
          math: 'δ^[l] = (W^[l+1])ᵀ δ^[l+1] ⊙ σ\'(z^[l])',
          explanation: 'Propagates error vector backward through transposed weight matrix and scales by local derivative of activation function.'
        }
      ]
    },
    whereToUse: {
      bestFor: ['All Feedforward, Convolutional, Recurrent, and Transformer networks', 'Gradient-based adversarial attacks', 'Sensitivity & saliency analysis'],
      avoidWhen: ['Discrete non-differentiable operations (e.g., hard token sampling without Gumbel-Softmax)'],
      alternatives: ['Forward-Mode Automatic Differentiation', 'Direct Feedback Alignment', 'Evolution Strategies']
    },
    howToUse: {
      language: 'python',
      code: `import numpy as np

# 2-Layer Neural Network Backprop from Scratch (NumPy)
# Inputs X (2 features), Hidden H (3 neurons), Output Y (1 neuron)
X = np.array([[0.5, 0.2]])
y = np.array([[1.0]])

# Weights
W1 = np.random.randn(2, 3)
W2 = np.random.randn(3, 1)

# Forward pass
z1 = np.dot(X, W1)
a1 = 1 / (1 + np.exp(-z1)) # Sigmoid
z2 = np.dot(a1, W2)
a2 = 1 / (1 + np.exp(-z2))

# Loss
loss = 0.5 * np.mean((a2 - y) ** 2)

# Backward pass (Chain rule)
delta2 = (a2 - y) * (a2 * (1 - a2))        # dL/dz2
dW2 = np.dot(a1.T, delta2)                 # dL/dW2

delta1 = np.dot(delta2, W2.T) * (a1 * (1 - a1)) # dL/dz1
dW1 = np.dot(X.T, delta1)                  # dL/dW1

print("Gradients successfully computed via chain rule!")`
    },
    eli5:
      'Imagine a relay race where a mistake happened at the finish line. The referee explains what went wrong to the anchor runner, who tells the 3rd runner how to adjust, who tells the 2nd runner, all the way to the starting block.'
  },

  // ── ADVANCE LEVEL ──
  {
    id: 'rope-positional-embeddings',
    title: 'Rotary Position Embeddings (RoPE)',
    subtitle: 'Complex rotation in 2D vector subspaces used in Llama 3, Mistral, and modern LLMs',
    category: 'Advanced LLM Architecture',
    level: 'advance',
    application:
      'Replaces static absolute sinusoidal position embeddings with relative rotation. Enables LLMs to naturally extrapolate to 32k, 128k, and 1M token context windows without losing relative token distance relationships.',
    mathDerivation: {
      coreEquation: 'R_{Θ, m}^d = diag(R_{θ₁, m}, R_{θ₂, m}, ..., R_{θ_{d/2}, m}),   ⟨R_m q, R_n k⟩ = g(q, k, m - n)',
      description: 'Encodes position index m by rotating Query and Key 2D pairs by angle m·θ_i, ensuring dot-product depends strictly on relative distance (m - n).',
      steps: [
        {
          stepNum: 1,
          title: 'Pairing Embedding Dimensions into 2D Subspaces',
          math: 'q = [q₀, q₁, q₂, q₃, ..., q_{d-2}, q_{d-1}]  →  (q₀, q₁), (q₂, q₃), ...',
          explanation: 'A d-dimensional vector is treated as d/2 orthogonal 2D complex numbers.'
        },
        {
          stepNum: 2,
          title: 'Compute Frequency Scale θ_i for Each Subspace',
          math: 'θ_i = 10000^(-2(i-1)/d),   for i ∈ [1, 2, ..., d/2]',
          explanation: 'Exponential decay ensures lower dimensions capture fine local distance while higher dimensions capture long-range global position.'
        },
        {
          stepNum: 3,
          title: '2D Rotation Matrix Application for Token Position m',
          math: '[q₂ᵢ^(m),  q₂ᵢ₊₁^(m)]ᵀ = [[cos(m θᵢ), -sin(m θᵢ)], [sin(m θᵢ), cos(m θᵢ)]] · [q₂ᵢ, q₂ᵢ₊₁]ᵀ',
          explanation: 'Rotates the 2D vector by angle m θ_i. In self-attention, (R_m q)ᵀ (R_n k) = qᵀ R_{n-m} k, preserving exact relative position m - n.'
        }
      ]
    },
    whereToUse: {
      bestFor: ['Modern autoregressive LLMs (Llama 3, Mistral, Gemma, Qwen, DeepSeek)', 'Long-context models with YaRN or RoPE scaling'],
      avoidWhen: ['Non-sequential spatial data like 2D images without 2D-RoPE extensions', 'Simple small recurrent networks'],
      alternatives: ['ALiBi (Attention with Linear Biases)', 'Learned Absolute Positional Embeddings (GPT-2)', 'Sinusoidal Embeddings (Attention Is All You Need)']
    },
    howToUse: {
      language: 'python',
      code: `import torch

def apply_rotary_pos_emb(q, k, seq_len, dim):
    # Compute theta frequencies
    theta = 1.0 / (10000.0 ** (torch.arange(0, dim, 2).float() / dim))
    m = torch.arange(seq_len).float()
    
    # Angles matrix: [seq_len, dim/2]
    angles = torch.outer(m, theta)
    cos = torch.cos(angles).repeat_interleave(2, dim=-1)
    sin = torch.sin(angles).repeat_interleave(2, dim=-1)
    
    # Rotate half
    def rotate_half(x):
        x1 = x[..., :dim:2]
        x2 = x[..., 1:dim:2]
        return torch.stack((-x2, x1), dim=-1).flatten(-2)
    
    q_rot = (q * cos) + (rotate_half(q) * sin)
    k_rot = (k * cos) + (rotate_half(k) * sin)
    return q_rot, k_rot

# Test on Query tensor of 4 tokens with head dimension 8
q = torch.randn(1, 4, 8)
k = torch.randn(1, 4, 8)
q_out, k_out = apply_rotary_pos_emb(q, k, seq_len=4, dim=8)
print("Successfully applied Rotary Positional Embedding (RoPE)!")`
    },
    eli5:
      'Imagine clock hands. Token 1 is at 1 o’clock, Token 2 is at 2 o’clock, Token 5 is at 5 o’clock. To know how far apart Token 5 is from Token 2, you just calculate the angular difference (3 hours), regardless of where they sit in the paragraph.'
  },
  {
    id: 'dpo-alignment-math',
    title: 'Direct Preference Optimization (DPO) Formulation',
    subtitle: 'Direct closed-form human alignment without unstable RL reward model actor-critic loops',
    category: 'LLM Alignment & Safety',
    level: 'advance',
    application:
      'Industry standard for aligning instruction-tuned models with human preferences (helpful, honest, harmless). Replaced complex PPO / RLHF algorithms by analytically deriving policy loss directly from preference data (y_w vs y_l).',
    mathDerivation: {
      coreEquation: 'L_DPO(π_θ; π_ref) = - 𝔼_{(x, y_w, y_l)} [ log σ( β · log (π_θ(y_w|x) / π_ref(y_w|x)) - β · log (π_θ(y_l|x) / π_ref(y_l|x)) ) ]',
      description: 'Increases likelihood of winning response y_w relative to reference model π_ref while decreasing losing response y_l.',
      steps: [
        {
          stepNum: 1,
          title: 'Bradley-Terry Preference Probability Model',
          math: 'P(y_w ≻ y_l | x) = σ(r(x, y_w) - r(x, y_l))',
          explanation: 'Human preference probability between winning response y_w and losing response y_l based on latent reward r.'
        },
        {
          stepNum: 2,
          title: 'Analytic Substitution of Reward Function r(x, y)',
          math: 'r(x, y) = β · log (π_θ(y|x) / π_ref(y|x)) + β · log Z(x)',
          explanation: 'Rafailov et al. proved that under KL constraint, the optimal policy π_θ implicitly defines the reward function, cancelling partition function Z(x).'
        },
        {
          stepNum: 3,
          title: 'Direct Binary Cross-Entropy Optimization',
          math: '∇_θ L_DPO = -β · σ(r̂_θ(x, y_l) - r̂_θ(x, y_w)) · [ ∇_θ log π_θ(y_w|x) - ∇_θ log π_θ(y_l|x) ]',
          explanation: 'Pushes model to increase token log-probabilities of preferred response and decrease rejected response, weighted by how wrong the current implicit reward is.'
        }
      ]
    },
    whereToUse: {
      bestFor: ['Post-training alignment for chat assistants', 'Safety & guardrail tuning', 'Reducing hallucinations in RAG answers'],
      avoidWhen: ['Initial foundation pre-training (use standard Next-Token Cross-Entropy)', 'No paired human/AI preference dataset available'],
      alternatives: ['PPO (Proximal Policy Optimization with Reward Model)', 'KTO (Kahneman-Tversky Optimization)', 'ORPO (Odds Ratio Preference Optimization)']
    },
    howToUse: {
      language: 'python',
      code: `import torch
import torch.nn.functional as F

def dpo_loss(policy_win_logps, policy_lose_logps, ref_win_logps, ref_lose_logps, beta=0.1):
    """
    Computes Direct Preference Optimization Loss
    """
    # Compute log ratio difference
    policy_logratios = policy_win_logps - policy_lose_logps
    ref_logratios = ref_win_logps - ref_lose_logps
    
    logits = policy_logratios - ref_logratios
    losses = -F.logsigmoid(beta * logits)
    
    # Calculate implicit rewards for telemetry
    rewards_win = beta * (policy_win_logps - ref_win_logps).detach()
    rewards_lose = beta * (policy_lose_logps - ref_lose_logps).detach()
    
    return losses.mean(), rewards_win, rewards_lose

# Example scalar values
loss, r_win, r_lose = dpo_loss(
    policy_win_logps=torch.tensor([-1.2]),
    policy_lose_logps=torch.tensor([-4.5]),
    ref_win_logps=torch.tensor([-2.0]),
    ref_lose_logps=torch.tensor([-2.1]),
    beta=0.1
)
print(f"DPO Alignment Loss: {loss.item():.4f}")`
    },
    eli5:
      'Instead of hiring a separate judge (reward model) to score every sentence and give grades, DPO directly shows the model: "When asked X, Option A was chosen and Option B was rejected. Make Option A more likely than Option B compared to your original self."'
  }
];

export function DeepMathAndLLMBuilder() {
  const [activeTab, setActiveTab] = useState<'math-lab' | 'llm-builder'>('math-lab');
  const [selectedLevel, setSelectedLevel] = useState<MathDifficultyLevel>('intermediate');
  const [selectedConceptId, setSelectedConceptId] = useState<string>('self-attention-mechanism');
  const [copiedCode, setCopiedCode] = useState(false);

  // ── LLM BUILDER CONFIGURATION STATE ──
  const [vocabSize, setVocabSize] = useState<number>(32000);
  const [hiddenDim, setHiddenDim] = useState<number>(2048);
  const [numLayers, setNumLayers] = useState<number>(16);
  const [numHeads, setNumHeads] = useState<number>(16);
  const [numKVHeads, setNumKVHeads] = useState<number>(4); // Grouped Query Attention (GQA)
  const [contextLength, setContextLength] = useState<number>(4096);
  const [intermediateDimMultiplier, setIntermediateDimMultiplier] = useState<number>(3.5); // SwiGLU multiplier
  const [precision, setPrecision] = useState<'fp16' | 'bf16' | 'fp32' | 'int8' | 'int4'>('bf16');
  const [builderActiveStep, setBuilderActiveStep] = useState<number>(1);
  const [copiedPyTorchCode, setCopiedPyTorchCode] = useState(false);

  // Filtered concepts
  const filteredConcepts = useMemo(() => {
    return MATH_CONCEPTS_DATABASE.filter((c) => c.level === selectedLevel);
  }, [selectedLevel]);

  const activeConcept = useMemo(() => {
    return (
      MATH_CONCEPTS_DATABASE.find((c) => c.id === selectedConceptId) ||
      filteredConcepts[0] ||
      MATH_CONCEPTS_DATABASE[0]
    );
  }, [selectedConceptId, filteredConcepts]);

  // ── MATHEMATICAL PARAMETER & VRAM CALCULATIONS ──
  const llmArchitectureStats = useMemo(() => {
    const ffnDim = Math.round(hiddenDim * intermediateDimMultiplier);
    const headDim = Math.round(hiddenDim / numHeads);

    // 1. Embeddings: V * d_model (input) + V * d_model (output lm_head if untied)
    const embeddingParams = vocabSize * hiddenDim * 2;

    // 2. Attention per layer:
    // Q: d_model * (numHeads * headDim) = d_model^2
    // K: d_model * (numKVHeads * headDim) = d_model * (numKVHeads * headDim)
    // V: d_model * (numKVHeads * headDim) = d_model * (numKVHeads * headDim)
    // O: (numHeads * headDim) * d_model = d_model^2
    const qProj = hiddenDim * hiddenDim;
    const kProj = hiddenDim * (numKVHeads * headDim);
    const vProj = hiddenDim * (numKVHeads * headDim);
    const oProj = hiddenDim * hiddenDim;
    const attnParamsPerLayer = qProj + kProj + vProj + oProj;

    // 3. SwiGLU FFN per layer: Gate (d * ffn) + Up (d * ffn) + Down (ffn * d) = 3 * d * ffn
    const ffnParamsPerLayer = 3 * hiddenDim * ffnDim;

    // 4. RMSNorm per layer: 2 * d_model (pre-attn + pre-ffn)
    const normParamsPerLayer = 2 * hiddenDim;

    // Total Layer Params
    const singleLayerParams = attnParamsPerLayer + ffnParamsPerLayer + normParamsPerLayer;
    const allLayersParams = singleLayerParams * numLayers;

    // Final RMSNorm
    const finalNormParams = hiddenDim;

    const totalParams = embeddingParams + allLayersParams + finalNormParams;
    const totalParamsBillions = totalParams / 1e9;
    const totalParamsMillions = totalParams / 1e6;

    // Bytes per parameter based on precision
    const bytesPerParamMap = {
      fp32: 4,
      fp16: 2,
      bf16: 2,
      int8: 1,
      int4: 0.5,
    };
    const bytesPerParam = bytesPerParamMap[precision];

    // Model Weight Memory
    const weightMemoryGB = (totalParams * bytesPerParam) / 1024 ** 3;

    // AdamW Optimizer State Memory (FP32 master weights + 1st moment + 2nd moment = 12-16 bytes/param)
    const optimizerMemoryGB = (totalParams * 16) / 1024 ** 3;

    // Gradients Memory
    const gradientsMemoryGB = (totalParams * bytesPerParam) / 1024 ** 3;

    // Total Training Memory (Estimate)
    const trainingVramGB = weightMemoryGB + optimizerMemoryGB + gradientsMemoryGB + 4.0; // +4GB activations buffer

    // KV Cache Memory for Batch Size = 1 at full context:
    // 2 * numLayers * numKVHeads * headDim * contextLength * 2 bytes (FP16)
    const kvCacheBytesPerToken = 2 * numLayers * numKVHeads * headDim * 2;
    const kvCacheTotalMB = (kvCacheBytesPerToken * contextLength) / 1024 ** 2;

    return {
      ffnDim,
      headDim,
      totalParams,
      totalParamsBillions,
      totalParamsMillions,
      weightMemoryGB,
      optimizerMemoryGB,
      trainingVramGB,
      kvCacheTotalMB,
      attnParamsPerLayer,
      ffnParamsPerLayer,
    };
  }, [
    vocabSize,
    hiddenDim,
    numLayers,
    numHeads,
    numKVHeads,
    contextLength,
    intermediateDimMultiplier,
    precision,
  ]);

  // Generated PyTorch Model Code
  const generatedPyTorchCode = useMemo(() => {
    return `import math
import torch
import torch.nn as nn
import torch.nn.functional as F

# =====================================================================
# AI Nexus Custom LLM Architecture (${llmArchitectureStats.totalParamsBillions >= 1 ? `${llmArchitectureStats.totalParamsBillions.toFixed(2)}B` : `${llmArchitectureStats.totalParamsMillions.toFixed(1)}M`} Parameters)
# Precision: ${precision.toUpperCase()} | Vocab: ${vocabSize} | Context: ${contextLength} | Layers: ${numLayers} | Heads: ${numHeads} (GQA: ${numKVHeads} KV)
# =====================================================================

class RMSNorm(nn.Module):
    """Root Mean Square Layer Normalization (Llama 3 / Gemma standard)"""
    def __init__(self, dim: int, eps: float = 1e-6):
        super().__init__()
        self.eps = eps
        self.weight = nn.Parameter(torch.ones(dim))

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        variance = x.pow(2).mean(-1, keepdim=True)
        return x * torch.rsqrt(variance + self.eps) * self.weight


def apply_rotary_emb(x: torch.Tensor, freqs_cos: torch.Tensor, freqs_sin: torch.Tensor) -> torch.Tensor:
    """Rotary Position Embedding (RoPE) Complex Vector Rotation"""
    d = x.shape[-1]
    x1, x2 = x[..., :d//2], x[..., d//2:]
    x_rotated = torch.cat((-x2, x1), dim=-1)
    return (x * freqs_cos) + (x_rotated * freqs_sin)


class GroupedQueryAttention(nn.Module):
    """Grouped-Query Attention (GQA) with Scaled Dot-Product & RoPE"""
    def __init__(self, d_model=${hiddenDim}, n_heads=${numHeads}, n_kv_heads=${numKVHeads}):
        super().__init__()
        self.n_heads = n_heads
        self.n_kv_heads = n_kv_heads
        self.head_dim = d_model // n_heads
        self.num_rep = n_heads // n_kv_heads

        self.q_proj = nn.Linear(d_model, n_heads * self.head_dim, bias=False)
        self.k_proj = nn.Linear(d_model, n_kv_heads * self.head_dim, bias=False)
        self.v_proj = nn.Linear(d_model, n_kv_heads * self.head_dim, bias=False)
        self.o_proj = nn.Linear(n_heads * self.head_dim, d_model, bias=False)

    def forward(self, x: torch.Tensor, mask: torch.Tensor = None) -> torch.Tensor:
        B, S, _ = x.shape
        q = self.q_proj(x).view(B, S, self.n_heads, self.head_dim).transpose(1, 2)
        k = self.k_proj(x).view(B, S, self.n_kv_heads, self.head_dim).transpose(1, 2)
        v = self.v_proj(x).view(B, S, self.n_kv_heads, self.head_dim).transpose(1, 2)

        # Repeat KV heads for Grouped-Query Attention
        if self.num_rep > 1:
            k = k.repeat_interleave(self.num_rep, dim=1)
            v = v.repeat_interleave(self.num_rep, dim=1)

        # Scaled Dot-Product Attention: Softmax(QK^T / sqrt(d_k)) * V
        scores = torch.matmul(q, k.transpose(-2, -1)) / math.sqrt(self.head_dim)
        if mask is not None:
            scores = scores + mask
        attn_weights = F.softmax(scores, dim=-1)
        out = torch.matmul(attn_weights, v)
        out = out.transpose(1, 2).contiguous().view(B, S, -1)
        return self.o_proj(out)


class SwiGLUFeedForward(nn.Module):
    """SwiGLU Gated Feed-Forward Network: Swish(xW_gate) * (xW_up) W_down"""
    def __init__(self, d_model=${hiddenDim}, d_ffn=${llmArchitectureStats.ffnDim}):
        super().__init__()
        self.gate_proj = nn.Linear(d_model, d_ffn, bias=False)
        self.up_proj   = nn.Linear(d_model, d_ffn, bias=False)
        self.down_proj = nn.Linear(d_ffn, d_model, bias=False)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.down_proj(F.silu(self.gate_proj(x)) * self.up_proj(x))


class TransformerBlock(nn.Module):
    """Pre-LN Transformer Block with Residual Connections"""
    def __init__(self):
        super().__init__()
        self.attn_norm = RMSNorm(${hiddenDim})
        self.attn = GroupedQueryAttention()
        self.ffn_norm  = RMSNorm(${hiddenDim})
        self.ffn = SwiGLUFeedForward()

    def forward(self, x: torch.Tensor, mask: torch.Tensor = None) -> torch.Tensor:
        # Pre-LN + Attention + Residual
        x = x + self.attn(self.attn_norm(x), mask=mask)
        # Pre-LN + SwiGLU + Residual
        x = x + self.ffn(self.ffn_norm(x))
        return x


class CustomTransformerLLM(nn.Module):
    """Complete Autoregressive Large Language Model from Scratch"""
    def __init__(self, vocab_size=${vocabSize}, n_layers=${numLayers}):
        super().__init__()
        self.tok_embeddings = nn.Embedding(vocab_size, ${hiddenDim})
        self.layers = nn.ModuleList([TransformerBlock() for _ in range(n_layers)])
        self.norm = RMSNorm(${hiddenDim})
        self.lm_head = nn.Linear(${hiddenDim}, vocab_size, bias=False)

    def forward(self, input_ids: torch.Tensor) -> torch.Tensor:
        B, S = input_ids.shape
        x = self.tok_embeddings(input_ids)

        # Causal Attention Mask (-inf for future tokens)
        causal_mask = torch.triu(torch.full((S, S), float('-inf'), device=input_ids.device), diagonal=1)

        for layer in self.layers:
            x = layer(x, mask=causal_mask)

        x = self.norm(x)
        logits = self.lm_head(x) # Output Shape: [Batch, SeqLen, VocabSize]
        return logits

# Instantiate and verify
if __name__ == "__main__":
    model = CustomTransformerLLM()
    total_params = sum(p.numel() for p in model.parameters())
    print(f"✅ Model Initialized Successfully! Total Parameters: {total_params:,}")
    
    # Test forward pass with dummy batch
    dummy_tokens = torch.randint(0, ${vocabSize}, (2, 64))
    logits = model(dummy_tokens)
    print(f"✅ Output Logits Shape: {logits.shape} (Expected: [2, 64, ${vocabSize}])")
`;
  }, [
    llmArchitectureStats,
    hiddenDim,
    numHeads,
    numKVHeads,
    numLayers,
    vocabSize,
    contextLength,
    precision,
  ]);

  const handleCopyMathCode = () => {
    navigator.clipboard.writeText(activeConcept.howToUse.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyPyTorchLLMCode = () => {
    navigator.clipboard.writeText(generatedPyTorchCode);
    setCopiedPyTorchCode(true);
    setTimeout(() => setCopiedPyTorchCode(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
              Deep Mathematical Lab & LLM Architecture Studio
            </h2>
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Learn exact calculus derivations (Application, Derivation, Where to Use, How to Use) and engineer custom Large Language Models from ground zero.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-secondary/80 p-1 rounded-2xl border border-border">
          <button
            onClick={() => setActiveTab('math-lab')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'math-lab'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Math Derivation Lab</span>
          </button>

          <button
            onClick={() => setActiveTab('llm-builder')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'llm-builder'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Build Your Own LLM Studio</span>
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 1: MATHEMATICAL DERIVATION LAB (APPLICATION, DERIVATION, USAGE)
         ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'math-lab' && (
        <div className="space-y-6">
          {/* Difficulty Level Bar */}
          <div className="flex items-center justify-between gap-3 bg-card border border-border p-3.5 rounded-2xl flex-wrap">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Curriculum Track:
            </span>

            <div className="flex items-center gap-2 flex-wrap">
              {[
                { id: 'basic', label: 'Basic Track (AI Foundations & Calculators)', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' },
                { id: 'intermediate', label: 'Intermediate Track (Neural Networks & Attention)', color: 'border-amber-500/40 text-amber-400 bg-amber-500/10' },
                { id: 'advance', label: 'Advance Track (RoPE, DPO & Quantization)', color: 'border-purple-500/40 text-purple-400 bg-purple-500/10' },
              ].map((lvl) => {
                const isSelected = selectedLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    onClick={() => {
                      setSelectedLevel(lvl.id as any);
                      const first = MATH_CONCEPTS_DATABASE.find((c) => c.level === lvl.id);
                      if (first) setSelectedConceptId(first.id);
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? `${lvl.color} shadow-sm ring-2 ring-purple-500/20`
                        : 'border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    {lvl.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Concepts Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            {filteredConcepts.map((concept) => {
              const isSelected = activeConcept.id === concept.id;
              return (
                <button
                  key={concept.id}
                  onClick={() => setSelectedConceptId(concept.id)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-950/40'
                      : 'bg-card border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  {concept.title}
                </button>
              );
            })}
          </div>

          {/* Active Mathematical Masterclass Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left & Middle Column (Math Derivation & Code) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Concept Hero Card */}
              <Card className="p-6 bg-card border-border rounded-3xl space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {activeConcept.category}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    Level: <strong className="text-foreground uppercase">{activeConcept.level}</strong>
                  </span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-foreground">{activeConcept.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                    {activeConcept.subtitle}
                  </p>
                </div>

                {/* Core Equation Box */}
                <div className="p-4 bg-purple-950/40 border border-purple-500/40 rounded-2xl text-center space-y-2">
                  <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">Governing Mathematical Equation</span>
                  <div className="text-lg sm:text-xl font-bold text-purple-200 py-1 flex items-center justify-center overflow-x-auto">
                    <MathRenderer math={activeConcept.mathDerivation.coreEquation} block />
                  </div>
                  <p className="text-[11px] text-muted-foreground">{activeConcept.mathDerivation.description}</p>
                </div>
              </Card>

              {/* PILLAR 1 & 2: APPLICATION & STEP-BY-STEP MATHEMATICAL DERIVATION */}
              <Card className="p-6 bg-card border-border rounded-3xl space-y-6">
                {/* 1. Real-World Application */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>1. Real-World Industrial Application</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed pl-6 border-l-2 border-amber-500/30">
                    {activeConcept.application}
                  </p>
                </div>

                {/* 2. Step-by-Step Algebraic Derivation */}
                <div className="space-y-4 pt-2 border-t border-border">
                  <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                    <Calculator className="w-4 h-4 text-purple-400" />
                    <span>2. Step-by-Step Mathematical Derivation</span>
                  </div>

                  <div className="space-y-3">
                    {activeConcept.mathDerivation.steps.map((step) => (
                      <div key={step.stepNum} className="p-4 bg-secondary/40 border border-border rounded-2xl space-y-2.5 transition-all hover:border-purple-500/40">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-mono text-xs flex items-center justify-center font-bold shadow-sm shadow-purple-500/30">
                            {step.stepNum}
                          </span>
                          <h4 className="text-xs font-bold text-foreground">{step.title}</h4>
                        </div>

                        {/* Enhanced Mathematical Formula Display */}
                        <div className="relative p-3.5 bg-gradient-to-r from-purple-950/50 via-black/80 to-secondary/40 rounded-xl border border-purple-500/30 overflow-x-auto shadow-inner text-center">
                          <div className="text-sm sm:text-base font-semibold text-purple-200 tracking-wide select-all">
                            <MathRenderer math={step.math} block />
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed pl-1">
                          {step.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. PyTorch Code Recipe (How to Use) */}
                <div className="space-y-3 pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                      <Code className="w-4 h-4 text-emerald-400" />
                      <span>3. How to Use (PyTorch Implementation)</span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyMathCode}
                      className="text-[11px] h-7 px-2.5 rounded-lg border-border gap-1 cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                    </Button>
                  </div>

                  <pre className="p-4 bg-zinc-950 rounded-2xl font-mono text-[11px] text-emerald-300/90 border border-border overflow-x-auto leading-relaxed scrollbar-thin">
                    <code>{activeConcept.howToUse.code}</code>
                  </pre>
                </div>
              </Card>
            </div>

            {/* Right Column (Decision Matrix & ELI5 Model) */}
            <div className="space-y-6">
              {/* PILLAR 4: WHERE AND WHEN TO USE */}
              <Card className="p-6 bg-card border-border rounded-3xl space-y-4">
                <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>4. Where & When to Use (Architectural Decision)</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="font-bold text-emerald-400 block mb-1">✅ Ideal Scenarios:</span>
                    <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                      {activeConcept.whereToUse.bestFor.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-border">
                    <span className="font-bold text-rose-400 block mb-1">❌ When to Avoid:</span>
                    <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                      {activeConcept.whereToUse.avoidWhen.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-border">
                    <span className="font-bold text-purple-400 block mb-1">🔄 Alternatives:</span>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {activeConcept.whereToUse.alternatives.map((alt, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-secondary text-foreground text-[10px] font-mono rounded-md border border-border">
                          {alt}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* PILLAR 5: "EXPLAIN LIKE I'M 5" VISUAL MENTAL MODEL */}
              <Card className="p-6 bg-gradient-to-br from-amber-500/10 via-card to-purple-500/10 border-amber-500/20 rounded-3xl space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Brain className="w-4 h-4" />
                  <span>ELI5 Intuition (Visual Mental Model)</span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed italic bg-card/60 p-3.5 rounded-2xl border border-border">
                  &ldquo;{activeConcept.eli5}&rdquo;
                </p>
              </Card>

              {/* Quick Math Self-Check Quiz Callout */}
              <Card className="p-6 bg-secondary/40 border-border rounded-3xl space-y-3">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider font-mono">
                  Mastery Checkpoint
                </span>
                <h4 className="text-xs font-bold text-foreground">Test Your Formula Retention</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Ready to test your math derivations under timed exam conditions? Launch a proctored assessment in the AI Assessment Arena.
                </p>
                <Button
                  onClick={() => window.location.href = '/assessments'}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-9 rounded-xl cursor-pointer"
                >
                  Take Proctored Math Assessment
                </Button>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 2: BUILD YOUR OWN LLM ARCHITECTURE STUDIO
         ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'llm-builder' && (
        <div className="space-y-6">
          {/* Studio Banner */}
          <Card className="relative overflow-hidden rounded-3xl border-purple-500/20 bg-gradient-to-br from-purple-950/60 via-card to-indigo-950/40 p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Interactive LLM Studio
                  </span>
                  <span className="text-xs text-muted-foreground">Llama 3 / Mistral Architecture Blueprint</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  Build Your Own Custom Large Language Model
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Configure transformer layers, attention heads, Grouped-Query Attention (GQA), Rotary Position Embeddings (RoPE), and SwiGLU FFN dimensions. Calculate parameter counts and VRAM requirements in real-time, then export complete PyTorch source code.
                </p>
              </div>

              {/* Parameter Badge */}
              <div className="p-5 bg-card/80 backdrop-blur-md rounded-2xl border border-purple-500/30 text-center min-w-[200px] shadow-xl space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Total Parameter Size</span>
                <div className="text-3xl font-extrabold text-purple-400 font-mono">
                  {llmArchitectureStats.totalParamsBillions >= 1
                    ? `${llmArchitectureStats.totalParamsBillions.toFixed(2)}B`
                    : `${llmArchitectureStats.totalParamsMillions.toFixed(1)}M`}
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold block">
                  ~{llmArchitectureStats.weightMemoryGB.toFixed(1)} GB FP16 Model Weights
                </span>
              </div>
            </div>
          </Card>

          {/* 8-Phase Architectural Stepper */}
          <Card className="p-4 bg-card border-border rounded-2xl overflow-x-auto scrollbar-none">
            <div className="flex items-center justify-between min-w-[850px] gap-2">
              {[
                { num: 1, name: '1. Tokenizer & BPE', desc: 'Byte-Pair Encoding vocabulary' },
                { num: 2, name: '2. Embedding & RoPE', desc: 'Rotary Position frequency rotation' },
                { num: 3, name: '3. Grouped-Query Attention', desc: 'Q, K, V causal projections' },
                { num: 4, name: '4. SwiGLU MLP Block', desc: 'Gated linear unit non-linearities' },
                { num: 5, name: '5. RMSNorm & Pre-LN', desc: 'Variance scaling normalization' },
                { num: 6, name: '6. Autoregressive Loss', desc: 'Next-token causal cross-entropy' },
                { num: 7, name: '7. DPO Human Alignment', desc: 'Preference optimization loss' },
                { num: 8, name: '8. KV-Cache & Inference', desc: 'PagedAttention GPU memory scaling' },
              ].map((step) => {
                const isActive = builderActiveStep === step.num;
                return (
                  <button
                    key={step.num}
                    onClick={() => setBuilderActiveStep(step.num)}
                    className={`flex flex-col items-center gap-1 flex-1 p-2.5 rounded-xl text-center transition-all cursor-pointer ${
                      isActive
                        ? 'bg-purple-600/20 border border-purple-500/40 text-purple-300 font-bold'
                        : 'hover:bg-secondary text-muted-foreground'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                      isActive ? 'bg-purple-600 text-white shadow-md' : 'bg-secondary border border-border text-muted-foreground'
                    }`}>
                      {step.num}
                    </div>
                    <span className="text-[11px] font-bold whitespace-nowrap">{step.name}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Grid: Controls & Calculations Left, Architecture Blueprint & PyTorch Code Right */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Architecture Hyperparameter Sliders */}
            <Card className="p-6 bg-card border-border rounded-3xl space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-bold text-foreground">Hyperparameter Configurator</h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setVocabSize(32000);
                    setHiddenDim(2048);
                    setNumLayers(16);
                    setNumHeads(16);
                    setNumKVHeads(4);
                    setContextLength(4096);
                    setIntermediateDimMultiplier(3.5);
                    setPrecision('bf16');
                  }}
                  className="text-[10px] h-7 px-2 border-border gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset to 1B</span>
                </Button>
              </div>

              {/* Slider 1: Vocabulary Size */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">Vocabulary Size (V)</span>
                  <span className="font-mono text-purple-400 font-bold">{vocabSize.toLocaleString()} tokens</span>
                </div>
                <input
                  type="range"
                  min={8000}
                  max={128000}
                  step={4000}
                  value={vocabSize}
                  onChange={(e) => setVocabSize(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>

              {/* Slider 2: Hidden Dimension d_model */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">Hidden Dimension (d_model)</span>
                  <span className="font-mono text-purple-400 font-bold">{hiddenDim}</span>
                </div>
                <input
                  type="range"
                  min={512}
                  max={8192}
                  step={256}
                  value={hiddenDim}
                  onChange={(e) => setHiddenDim(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>

              {/* Slider 3: Number of Layers (N) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">Transformer Layers (N)</span>
                  <span className="font-mono text-purple-400 font-bold">{numLayers} layers</span>
                </div>
                <input
                  type="range"
                  min={4}
                  max={64}
                  step={2}
                  value={numLayers}
                  onChange={(e) => setNumLayers(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>

              {/* Slider 4: Attention Heads & GQA KV Heads */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-foreground block">Query Heads (Q)</span>
                  <select
                    value={numHeads}
                    onChange={(e) => setNumHeads(Number(e.target.value))}
                    className="w-full bg-secondary border border-border text-foreground text-xs rounded-xl p-2 font-mono"
                  >
                    {[8, 12, 16, 24, 32, 64].map((h) => (
                      <option key={h} value={h}>{h} heads</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-foreground block">KV Heads (GQA)</span>
                  <select
                    value={numKVHeads}
                    onChange={(e) => setNumKVHeads(Number(e.target.value))}
                    className="w-full bg-secondary border border-border text-foreground text-xs rounded-xl p-2 font-mono"
                  >
                    {[1, 2, 4, 8, 16].filter((kv) => kv <= numHeads).map((kv) => (
                      <option key={kv} value={kv}>{kv} KV heads {kv === 1 ? '(MQA)' : kv === numHeads ? '(MHA)' : '(GQA)'}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Slider 5: Context Window Length */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">Context Window (L)</span>
                  <span className="font-mono text-purple-400 font-bold">{contextLength.toLocaleString()} tokens</span>
                </div>
                <input
                  type="range"
                  min={1024}
                  max={32768}
                  step={1024}
                  value={contextLength}
                  onChange={(e) => setContextLength(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>

              {/* Precision Selection */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-foreground block">Weight Precision Format</span>
                <div className="grid grid-cols-5 gap-1.5">
                  {(['fp32', 'bf16', 'fp16', 'int8', 'int4'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPrecision(p)}
                      className={`py-1.5 text-[10px] font-bold font-mono rounded-lg border uppercase transition-all cursor-pointer ${
                        precision === p
                          ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                          : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Memory & Hardware Budget Table */}
              <div className="p-4 bg-secondary/50 rounded-2xl border border-border space-y-2.5 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 font-mono block">
                  Hardware & VRAM Requirements
                </span>

                <div className="flex items-center justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Model Weights (VRAM):</span>
                  <span className="font-bold font-mono text-foreground">{llmArchitectureStats.weightMemoryGB.toFixed(2)} GB</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Optimizer States (AdamW):</span>
                  <span className="font-bold font-mono text-foreground">{llmArchitectureStats.optimizerMemoryGB.toFixed(2)} GB</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Single Token KV-Cache:</span>
                  <span className="font-bold font-mono text-foreground">{llmArchitectureStats.kvCacheTotalMB.toFixed(2)} MB / seq</span>
                </div>

                <div className="flex items-center justify-between py-1 pt-1.5">
                  <span className="font-bold text-foreground">Recommended Training GPU:</span>
                  <span className="font-bold font-mono text-purple-400">
                    {llmArchitectureStats.trainingVramGB <= 24 ? '1x RTX 4090 (24GB)' : llmArchitectureStats.trainingVramGB <= 80 ? '1x A100 / H100 (80GB)' : `${Math.ceil(llmArchitectureStats.trainingVramGB / 80)}x H100 (80GB Cluster)`}
                  </span>
                </div>
              </div>
            </Card>

            {/* Right: Stage Deep Dive & Exportable PyTorch Code */}
            <div className="lg:col-span-2 space-y-6">
              {/* Active Step Tutorial Card */}
              <Card className="p-6 bg-card border-border rounded-3xl space-y-4">
                {builderActiveStep === 1 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                      <BookOpen className="w-4 h-4" />
                      <span>Phase 1: Tokenizer & Byte-Pair Encoding (BPE)</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Before numbers enter matrix multiplications, text is decomposed into subword tokens using Byte-Pair Encoding. The algorithm iteratively counts adjacent character pairs and merges the most frequent pair into a new token ID until vocabulary size <strong className="text-foreground">{vocabSize.toLocaleString()}</strong> is reached.
                    </p>
                    <div className="p-3 bg-secondary/50 rounded-xl border border-border font-mono text-xs text-foreground">
                      &quot;neural network training&quot; → [14502, 3810, 5921] (3 Token IDs)
                    </div>
                  </div>
                )}

                {builderActiveStep === 2 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                      <Layers className="w-4 h-4" />
                      <span>Phase 2: Token Embeddings + Rotary Position Embeddings (RoPE)</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Token IDs are indexed into an embedding lookup table of shape <code className="text-purple-300">[{vocabSize}, {hiddenDim}]</code>. Then, Rotary Positional Embeddings apply 2D complex plane rotations so Query and Key dot products naturally preserve relative distance over {contextLength.toLocaleString()} tokens.
                    </p>
                  </div>
                )}

                {builderActiveStep === 3 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                      <Cpu className="w-4 h-4" />
                      <span>Phase 3: Grouped-Query Attention (GQA) & Causal Mask</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Computes scaled dot-product attention using {numHeads} Query heads sharing {numKVHeads} Key/Value heads. This reduces KV-cache memory bandwidth by {(numHeads / numKVHeads).toFixed(0)}x during high-throughput token generation while maintaining full expressiveness.
                    </p>
                  </div>
                )}

                {builderActiveStep === 4 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                      <Zap className="w-4 h-4" />
                      <span>Phase 4: SwiGLU Gated Feed-Forward Network</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Replaces standard ReLU with SwiGLU: <code className="text-purple-300">Down(SiLU(Gate(x)) * Up(x))</code>. The intermediate hidden dimension expands to <strong className="text-foreground">{llmArchitectureStats.ffnDim}</strong> ({intermediateDimMultiplier}x d_model), storing factual memories and reasoning circuits.
                    </p>
                  </div>
                )}

                {builderActiveStep === 5 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Phase 5: Pre-LN RMSNorm & Residual Stabilizers</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      RMSNorm scales activations by the Root Mean Square of feature variances without subtracting the mean, speeding up layer normalization computation by 30% across all {numLayers} transformer blocks.
                    </p>
                  </div>
                )}

                {builderActiveStep === 6 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                      <Calculator className="w-4 h-4" />
                      <span>Phase 6: Autoregressive Next-Token Pre-Training Objective</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      The model processes billions of tokens in self-supervised causal batches, minimizing Negative Log-Likelihood Loss across next token probabilities: <code className="text-purple-300">L = -∑ log P(x_t | x_&lt;t)</code>.
                    </p>
                  </div>
                )}

                {builderActiveStep === 7 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                      <Sparkles className="w-4 h-4" />
                      <span>Phase 7: Direct Preference Optimization (DPO) Alignment</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Instruction fine-tuning pairs preferred outputs against rejected outputs with DPO loss, aligning the raw base model into a helpful, polite, and factual assistant.
                    </p>
                  </div>
                )}

                {builderActiveStep === 8 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                      <Activity className="w-4 h-4" />
                      <span>Phase 8: High-Throughput Inference, KV-Caching & vLLM Serving</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      During inference, past Key and Value vectors are cached in GPU SRAM to prevent quadratic recomputation. Memory required per 1,000 active tokens is only <strong className="text-foreground">{(llmArchitectureStats.kvCacheTotalMB * (1000 / contextLength)).toFixed(2)} MB</strong>.
                    </p>
                  </div>
                )}
              </Card>

              {/* Complete Exportable PyTorch LLM Source Code */}
              <Card className="p-6 bg-card border-border rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-foreground">Complete Generated PyTorch Architecture (`model.py`)</h3>
                  </div>

                  <Button
                    onClick={handleCopyPyTorchLLMCode}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold h-8 px-3 rounded-xl gap-1.5 shadow-md shadow-emerald-950/40 cursor-pointer"
                  >
                    {copiedPyTorchCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPyTorchCode ? 'Copied to Clipboard!' : 'Export PyTorch Code'}</span>
                  </Button>
                </div>

                <pre className="p-5 bg-zinc-950 rounded-2xl font-mono text-[11px] text-emerald-300/90 border border-border overflow-x-auto leading-relaxed max-h-[550px] scrollbar-thin">
                  <code>{generatedPyTorchCode}</code>
                </pre>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
