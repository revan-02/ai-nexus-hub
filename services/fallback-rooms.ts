export interface FallbackTask {
  id: string;
  orderNumber: number;
  title: string;
  instructions: string;
  taskType: 'MULTIPLE_CHOICE' | 'CODE_TASK' | 'SCENARIO' | 'READ';
  codeSnippet?: string | null;
  hint?: string | null;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  explanationWrong: string;
  difficulty: string;
  passingScore: number;
  xpReward: number;
}

export interface FallbackRoom {
  id: string;
  title: string;
  description: string;
  level: 'Novice' | 'Intermediate' | 'Advanced' | 'Expert';
  tier: 'Free' | 'Pro';
  category: string;
  estimatedTime: string;
  xpReward: number;
  iconName: string;
  ageGroup: 'ABSOLUTE_BEGINNER' | 'K12_STUDENT' | 'HIGH_SCHOOL' | 'UNDERGRADUATE' | 'POSTGRADUATE' | 'PROFESSIONAL' | 'RESEARCHER';
  tasks: FallbackTask[];
}

export const FALLBACK_ROOM_CATALOG: Record<string, FallbackRoom> = {
  'crs-11': {
    id: 'crs-11',
    title: 'AI Safety, Prompt Injection Defense & Enterprise Guardrails',
    description: 'Master OWASP Top 10 for LLMs, adversarial red-teaming, NVIDIA NeMo Guardrails, and automated compliance auditing.',
    level: 'Advanced',
    tier: 'Pro',
    category: 'Security & Governance',
    estimatedTime: '2 hours',
    xpReward: 600,
    iconName: 'Shield',
    ageGroup: 'PROFESSIONAL',
    tasks: [
      {
        id: 'task-crs11-1',
        orderNumber: 1,
        title: 'Task 1: Indirect Prompt Injection Defense Architecture',
        instructions: 'Indirect prompt injection occurs when an LLM consumes untrusted third-party data (web pages, PDFs, user uploads) that contains embedded adversarial instructions. In production agentic systems, how do you reliably neutralize this vulnerability?',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'Which architectural strategy provides the strongest defense against indirect prompt injection in RAG and agent pipelines?',
        options: [
          'Dual-LLM architecture: Quarantined untrusted reader model separated from a privileged execution model with strict XML delimiter tags',
          'Setting LLM sampling temperature to 0.0',
          'Relying solely on blacklisting specific prohibited keywords in raw strings',
          'Removing system prompts and letting the user prompt govern all behavior',
        ],
        correctAnswer: 'Dual-LLM architecture: Quarantined untrusted reader model separated from a privileged execution model with strict XML delimiter tags',
        explanation: 'Separating unprivileged data processing from privileged tool execution using a Dual-LLM pattern combined with structural delimiters (e.g. <untrusted_content>) prevents untrusted payloads from hijacking execution flow.',
        explanationWrong: 'Keyword blacklists and temperature changes are easily bypassed by character encoding, base64 obfuscation, or roleplay jailbreaks.',
        difficulty: 'Hard',
        passingScore: 100,
        xpReward: 250,
        hint: 'Think about privilege separation in operating systems applied to LLM reasoning.',
      },
      {
        id: 'task-crs11-2',
        orderNumber: 2,
        title: 'Task 2: NeMo Guardrails & Output Safety Firewalls',
        instructions: 'Review the production guardrails snippet below designed to intercept hallucinated personally identifiable information (PII) and compliance violations.',
        codeSnippet: `import nemoguardrails as rails

config = rails.RailsConfig.from_path("guardrails_config")
guardrails_app = rails.LLMRails(config)

# Queries are filtered through semantic input and output safety rails
response = await guardrails_app.generate_async(
    messages=[{"role": "user", "content": user_input}]
)`,
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'When an output rail triggers a safety violation (e.g., detecting leaked confidential tokens or PII), what is the optimal gateway action?',
        options: [
          'Halt the response stream immediately, log the audit telemetry, and return a standardized safe fallback message',
          'Deliver the partial response to the user and log a silent database warning',
          'Automatically restart the GPU inference server',
          'Convert the response to hexadecimal format',
        ],
        correctAnswer: 'Halt the response stream immediately, log the audit telemetry, and return a standardized safe fallback message',
        explanation: 'Enterprise gateways must intercept non-compliant generations pre-delivery, masking sensitive outputs and maintaining immutable audit traces for compliance.',
        explanationWrong: 'Delivering leaked data compromises security; restarting servers creates denial of service.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 350,
        hint: 'Fail-safe defaults require preventing any compromised payload from leaving the gateway perimeter.',
      },
    ],
  },
  'crs-10': {
    id: 'crs-10',
    title: 'Vision-Language Models, Multimodal AI & YOLOv11 Real-Time Vision',
    description: 'Fine-tune CLIP and LLaVA multimodal models, real-time YOLOv11 object segmentation, and agricultural leaf pest diagnosis.',
    level: 'Advanced',
    tier: 'Pro',
    category: 'Computer Vision',
    estimatedTime: '2.5 hours',
    xpReward: 700,
    iconName: 'Activity',
    ageGroup: 'PROFESSIONAL',
    tasks: [
      {
        id: 'task-crs10-1',
        orderNumber: 1,
        title: 'Task 1: Contrastive Language-Image Pretraining (CLIP) Alignment',
        instructions: 'CLIP jointly trains an image encoder and text encoder to predict which images match which texts in a batch using symmetric cross-entropy loss.',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'How does CLIP compute the similarity matrix between N images and N text captions?',
        options: [
          'Cosine similarity of normalized image and text embedding vectors scaled by a learned temperature parameter',
          'Pixel-by-pixel subtraction between the image matrix and text token IDs',
          'Applying binary XOR logic on raw byte representations',
          'Running a recurrent LSTM over image RGB values',
        ],
        correctAnswer: 'Cosine similarity of normalized image and text embedding vectors scaled by a learned temperature parameter',
        explanation: 'CLIP projects both modalities into a shared embedding space where normalized dot product (cosine similarity) measures alignment.',
        explanationWrong: 'Modalities must be mapped into a unified vector representation space before comparing.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 350,
      },
    ],
  },
  'crs-9': {
    id: 'crs-9',
    title: 'Enterprise GraphRAG & Hybrid Knowledge Retrieval',
    description: 'Eliminate LLM hallucinations by fusing Neo4j knowledge graphs with hybrid BM25 and dense vector embeddings with Cohere re-ranking.',
    level: 'Advanced',
    tier: 'Pro',
    category: 'Generative AI',
    estimatedTime: '2 hours',
    xpReward: 650,
    iconName: 'Network',
    ageGroup: 'PROFESSIONAL',
    tasks: [
      {
        id: 'task-crs9-1',
        orderNumber: 1,
        title: 'Task 1: Graph-Assisted Retrieval vs Flat Vector Embeddings',
        instructions: 'While dense vector embeddings excel at local semantic similarity, they struggle with global multi-hop relational queries across entities.',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'What key advantage does GraphRAG provide over traditional naive vector RAG?',
        options: [
          'Enables multi-hop relational traversal and structural community summaries across connected entities',
          'Reduces vector dimension size to zero',
          'Requires no indexing or document chunking',
          'Eliminates the need for any embedding model',
        ],
        correctAnswer: 'Enables multi-hop relational traversal and structural community summaries across connected entities',
        explanation: 'GraphRAG constructs knowledge graph relationships and community hierarchical summaries, solving questions that span across hundreds of disconnected documents.',
        explanationWrong: 'GraphRAG augments vector search with structured entity graphs rather than eliminating vector representation.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 325,
      },
    ],
  },
  'crs-8': {
    id: 'crs-8',
    title: 'High-Throughput LLM Inference Serving (vLLM, TensorRT & Triton)',
    description: 'Optimize GPU memory with PagedAttention, KV-Cache compression, FP8/FP4 quantization, and production Triton Inference clusters.',
    level: 'Expert',
    tier: 'Pro',
    category: 'AI Infrastructure',
    estimatedTime: '3 hours',
    xpReward: 800,
    iconName: 'Cpu',
    ageGroup: 'PROFESSIONAL',
    tasks: [
      {
        id: 'task-crs8-1',
        orderNumber: 1,
        title: 'Task 1: PagedAttention & Virtual Memory Management',
        instructions: 'In traditional LLM inference, contiguous GPU memory allocation for Key-Value caches causes up to 60-80% memory waste due to internal and external fragmentation.',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'How does vLLM PagedAttention eliminate memory fragmentation in GPU VRAM?',
        options: [
          'It stores continuous Key-Value tokens in non-contiguous physical memory blocks managed by a virtual page table',
          'It deletes the KV cache after every single generated token',
          'It executes models exclusively in CPU RAM to bypass VRAM limits',
          'It restricts batch size strictly to 1 concurrent request',
        ],
        correctAnswer: 'It stores continuous Key-Value tokens in non-contiguous physical memory blocks managed by a virtual page table',
        explanation: 'Inspired by OS virtual memory paging, PagedAttention dynamically allocates fixed-size physical blocks for KV tokens, allowing zero memory waste and near-100% GPU utilization.',
        explanationWrong: 'PagedAttention operates directly on GPU VRAM with non-contiguous paging.',
        difficulty: 'Hard',
        passingScore: 100,
        xpReward: 400,
      },
    ],
  },
  'crs-7': {
    id: 'crs-7',
    title: 'Autonomous Multi-Agent Systems & LangGraph Workflows',
    description: 'Build stateful multi-agent systems with LangGraph, Model Context Protocol (MCP), human-in-the-loop approvals, and asynchronous tool execution.',
    level: 'Advanced',
    tier: 'Pro',
    category: 'Agentic AI',
    estimatedTime: '2 hours',
    xpReward: 650,
    iconName: 'Bot',
    ageGroup: 'PROFESSIONAL',
    tasks: [
      {
        id: 'task-crs7-1',
        orderNumber: 1,
        title: 'Task 1: Cyclic State Graph Orchestration',
        instructions: 'Unlike linear DAG chains (LangChain runnable sequences), real-world autonomous agents require cyclic state loops to self-correct and iterate over tool failures.',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'What fundamental capability distinguishes LangGraph state machines from standard linear LLM chains?',
        options: [
          'Support for cyclic graph loops with state persistence, conditional edges, and human-in-the-loop interrupts',
          'Elimination of Python runtime requirements',
          'Restriction to single-turn prompt templates',
          'Removal of external API tool calling',
        ],
        correctAnswer: 'Support for cyclic graph loops with state persistence, conditional edges, and human-in-the-loop interrupts',
        explanation: 'LangGraph models agent workflows as graphs where nodes represent agent actions/tools and edges route control flow cyclically until exit conditions are satisfied.',
        explanationWrong: 'Cyclic transitions and checkpointed state allow agents to reflect, retry, and request human feedback.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 325,
      },
    ],
  },
  'crs-6': {
    id: 'crs-6',
    title: 'Stage 4: PEFT, LoRA Fine-Tuning & Autonomous AI Agents',
    description: 'Parameter-efficient fine-tuning, 4-bit QLoRA, tool calling, ReAct agent loops, and multimodal generation.',
    level: 'Advanced',
    tier: 'Pro',
    category: 'Generative AI',
    estimatedTime: '2.5 hours',
    xpReward: 700,
    iconName: 'Zap',
    ageGroup: 'UNDERGRADUATE',
    tasks: [
      {
        id: 'task-crs6-1',
        orderNumber: 1,
        title: 'Task 1: LoRA Rank Decomposition Math',
        instructions: 'Low-Rank Adaptation freezes base weights W0 (d × k) and computes updates as ΔW = B × A, where B is (d × r) and A is (r × k) with rank r << min(d, k).',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'What is the primary benefit of decomposing weight updates into rank r matrices?',
        options: [
          'Reduces trainable parameter count and optimizer memory footprint by up to 99% while preserving model capability',
          'Eliminates floating-point numbers completely',
          'Increases total parameter count by 4x to improve reasoning',
          'Disables gradient calculation during training',
        ],
        correctAnswer: 'Reduces trainable parameter count and optimizer memory footprint by up to 99% while preserving model capability',
        explanation: 'By constraining ΔW to an intrinsic low rank r (typically 8 to 64), LoRA only updates rank matrices A and B, drastically cutting VRAM requirements.',
        explanationWrong: 'LoRA reduces rather than increases trainable parameters.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 350,
      },
    ],
  },
  'crs-5': {
    id: 'crs-5',
    title: 'Stage 4: Generative AI, LLMs & Enterprise RAG Architecture',
    description: 'BPE tokenization, pretraining vs instruction tuning, vector databases, chunking, and grounded generation.',
    level: 'Advanced',
    tier: 'Pro',
    category: 'Generative AI',
    estimatedTime: '2 hours',
    xpReward: 600,
    iconName: 'MessageSquare',
    ageGroup: 'UNDERGRADUATE',
    tasks: [
      {
        id: 'task-crs5-1',
        orderNumber: 1,
        title: 'Task 1: Vector Search Distance Metrics',
        instructions: 'When retrieving semantic context from vector databases (Milvus, Pinecone, Qdrant), embedding vectors are normalized before calculating relevance.',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'When embedding vectors are L2-normalized to unit length, cosine similarity is mathematically equivalent to:',
        options: [
          'Dot Product',
          'Manhattan Distance (L1)',
          'Hamming Distance',
          'Jaccard Similarity Coefficient',
        ],
        correctAnswer: 'Dot Product',
        explanation: 'For unit vectors where ||u|| = ||v|| = 1, Cosine Similarity (u · v) / (||u|| ||v||) simplifies exactly to the inner Dot Product u · v.',
        explanationWrong: 'Unit normalization reduces cosine similarity directly to the dot product, enabling SIMD and GPU matrix acceleration.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 300,
      },
    ],
  },
  'crs-4': {
    id: 'crs-4',
    title: 'Stage 3: Transformers, Self-Attention & Embeddings',
    description: 'Query-Key-Value self-attention math, multi-head encoders, ResNet skip connections, and representation learning.',
    level: 'Advanced',
    tier: 'Pro',
    category: 'Deep Learning',
    estimatedTime: '2 hours',
    xpReward: 600,
    iconName: 'Layers',
    ageGroup: 'UNDERGRADUATE',
    tasks: [
      {
        id: 'task-crs4-1',
        orderNumber: 1,
        title: 'Task 1: Softmax Gradient Scaling in Self-Attention',
        instructions: 'In the Scaled Dot-Product Attention formula Attention(Q, K, V) = softmax((Q Kᵀ) / √d_k) V, why is the scaling factor 1/√d_k indispensable?',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'What occurs if the scaling factor 1/√d_k is omitted when d_k is large?',
        options: [
          'Dot products grow excessively large, pushing the softmax function into regions with vanishing gradients',
          'The attention matrix becomes non-square and cannot be multiplied by V',
          'Memory consumption triples on GPU devices',
          'All attention weights collapse to zero',
        ],
        correctAnswer: 'Dot products grow excessively large, pushing the softmax function into regions with vanishing gradients',
        explanation: 'For independent zero-mean unit-variance components, the dot product has variance d_k. Dividing by √d_k normalizes variance to 1, preventing softmax saturation.',
        explanationWrong: 'Unscaled large values cause softmax outputs to become one-hot vectors, yielding tiny gradients that halt backpropagation.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 300,
      },
    ],
  },
  'crs-3': {
    id: 'crs-3',
    title: 'Stage 3: Deep Learning & PyTorch Neural Networks',
    description: 'Artificial neurons, MLPs, backpropagation, SGD/Adam optimizers, CNNs, and sequence LSTMs.',
    level: 'Intermediate',
    tier: 'Pro',
    category: 'Deep Learning',
    estimatedTime: '2 hours',
    xpReward: 500,
    iconName: 'Network',
    ageGroup: 'UNDERGRADUATE',
    tasks: [
      {
        id: 'task-crs3-1',
        orderNumber: 1,
        title: 'Task 1: Backpropagation & Chain Rule Calculus',
        instructions: 'In a multi-layer perceptron with loss L, linear layer z = W x + b, and activation a = σ(z), we compute gradients of loss with respect to weights W using the chain rule.',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'What is the correct gradient of the loss L with respect to weight matrix W?',
        options: [
          '∂L/∂W = (∂L/∂z) · xᵀ',
          '∂L/∂W = ∂L/∂z + x',
          '∂L/∂W = (∂L/∂a) / W',
          '∂L/∂W = σ\'(z) · W',
        ],
        correctAnswer: '∂L/∂W = (∂L/∂z) · xᵀ',
        explanation: 'By the multivariable chain rule, ∂L/∂W_ij = (∂L/∂z_i) * (∂z_i/∂W_ij) = (∂L/∂z_i) * x_j, which in matrix form is the outer product (∂L/∂z) xᵀ.',
        explanationWrong: 'Gradients with respect to weights combine error sensitivity with upstream activation inputs.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 250,
      },
    ],
  },
  'crs-2': {
    id: 'crs-2',
    title: 'Stage 2: Classical Machine Learning & Scikit-Learn',
    description: 'Supervised regression/classification, Random Forests, SVMs, K-Means, and model evaluation.',
    level: 'Intermediate',
    tier: 'Free',
    category: 'Machine Learning',
    estimatedTime: '1.5 hours',
    xpReward: 350,
    iconName: 'Brain',
    ageGroup: 'UNDERGRADUATE',
    tasks: [
      {
        id: 'task-crs2-1',
        orderNumber: 1,
        title: 'Task 1: Bias-Variance Tradeoff & Model Regularization',
        instructions: 'High bias results in underfitting, while high variance results in overfitting to training noise.',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'Which regularizer adds an L1 penalty to the loss function and encourages sparse weights (feature selection)?',
        options: [
          'Lasso Regularization (L1)',
          'Ridge Regularization (L2)',
          'Batch Normalization',
          'Softmax Normalization',
        ],
        correctAnswer: 'Lasso Regularization (L1)',
        explanation: 'Lasso (L1 norm) pushes non-essential weight coefficients exactly to zero, producing sparse models and automatic feature selection.',
        explanationWrong: 'Ridge (L2) shrinks coefficients towards zero without setting them strictly to zero.',
        difficulty: 'Easy',
        passingScore: 100,
        xpReward: 175,
      },
    ],
  },
  'crs-1': {
    id: 'crs-1',
    title: 'Stage 1: Search Problem Solving & Knowledge Systems',
    description: 'Informed A* search, Minimax game trees, first-order logic, and rule-based inference engines.',
    level: 'Beginner',
    tier: 'Free',
    category: 'AI Foundations',
    estimatedTime: '1 hour',
    xpReward: 250,
    iconName: 'Brain',
    ageGroup: 'UNDERGRADUATE',
    tasks: [
      {
        id: 'task-crs1-1',
        orderNumber: 1,
        title: 'Task 1: A* Heuristic Admissibility',
        instructions: 'A* search explores nodes based on evaluation function f(n) = g(n) + h(n), where g(n) is the exact path cost from start to n, and h(n) is heuristic estimate.',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'Under what mathematical condition is A* search guaranteed to return the optimal (shortest) path?',
        options: [
          'The heuristic h(n) is admissible (never overestimates the true cost to the goal)',
          'The heuristic h(n) is always greater than g(n)',
          'The graph has zero cycles',
          'All edge weights are identical integers',
        ],
        correctAnswer: 'The heuristic h(n) is admissible (never overestimates the true cost to the goal)',
        explanation: 'An admissible heuristic h(n) <= h*(n) guarantees that A* will never bypass an optimal path in favor of an overestimate.',
        explanationWrong: 'Admissibility (never overestimating) is the fundamental theorem guaranteeing optimality in tree search.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 125,
      },
    ],
  },
  'crs-0': {
    id: 'crs-0',
    title: 'Stage 1: AI Foundations & Intelligent Agents',
    description: 'Master Symbolic AI, agent environments (PEAS), search algorithms, logic, and expert systems.',
    level: 'Beginner',
    tier: 'Free',
    category: 'AI Foundations',
    estimatedTime: '45 mins',
    xpReward: 200,
    iconName: 'Sparkles',
    ageGroup: 'ABSOLUTE_BEGINNER',
    tasks: [
      {
        id: 'task-crs0-1',
        orderNumber: 1,
        title: 'Task 1: The PEAS Agent Framework',
        instructions: 'When designing an autonomous artificial agent, AI engineers specify the PEAS framework: Performance measure, Environment, Actuators, and Sensors.',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'For an autonomous self-driving vehicle agent, which component belongs to Actuators?',
        options: [
          'Steering wheel, accelerator, brakes, and indicator signals',
          'LiDAR, ultrasonic sensors, and forward-facing cameras',
          'GPS coordinates and digital map database',
          'Passenger safety score and fuel efficiency metrics',
        ],
        correctAnswer: 'Steering wheel, accelerator, brakes, and indicator signals',
        explanation: 'Actuators are the mechanisms through which an agent executes actions upon its physical or digital environment.',
        explanationWrong: 'Cameras and LiDAR are sensors (inputs); fuel metrics are performance measures.',
        difficulty: 'Easy',
        passingScore: 100,
        xpReward: 100,
      },
    ],
  },
  'crs-12': {
    id: 'crs-12',
    title: 'Edge AI, Small Language Models (SLMs) & On-Device Deployment',
    description: 'Deploy quantized Phi-4 and Qwen-2.5 models on Apple Silicon, Jetson, and mobile devices using ONNX Runtime, GGUF, and WebGPU.',
    level: 'Intermediate',
    tier: 'Pro',
    category: 'Edge & Mobile AI',
    estimatedTime: '2 hours',
    xpReward: 550,
    iconName: 'Smartphone',
    ageGroup: 'PROFESSIONAL',
    tasks: [
      {
        id: 'task-crs12-1',
        orderNumber: 1,
        title: 'Task 1: GGUF Quantization & VRAM Footprint',
        instructions: 'Deploying large models on edge hardware requires quantizing FP16 weights to lower precision formats like Q4_K_M or Q8_0.',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'Approximately how much VRAM does an 8-Billion parameter LLM require when quantized to 4-bit (Q4_K_M)?',
        options: [
          '~5.5 GB to 6.0 GB (enabling execution on consumer laptops and edge devices)',
          '~32 GB',
          '~128 MB',
          'Over 64 GB',
        ],
        correctAnswer: '~5.5 GB to 6.0 GB (enabling execution on consumer laptops and edge devices)',
        explanation: 'At 4 bits per parameter, 8B weights occupy ~4 GB plus ~1.5 GB for context KV cache and runtime activations, fitting within standard 8GB RAM/VRAM.',
        explanationWrong: 'Unquantized FP16 requires ~16 GB; 4-bit quantization reduces this to ~5.5-6 GB.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 275,
      },
    ],
  },
};

/**
 * Returns a complete FallbackRoom for any requested ID, ensuring no user is ever blocked.
 */
export function getFallbackRoom(id: string): FallbackRoom {
  if (FALLBACK_ROOM_CATALOG[id]) {
    return FALLBACK_ROOM_CATALOG[id];
  }

  // Generate dynamic room from ID name pattern
  const cleanTitle = id
    .replace(/^room-|^crs-/, '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    id,
    title: cleanTitle ? `${cleanTitle} Interactive Lab` : 'Interactive AI Learning Room',
    description: `Master core concepts, real-world implementations, and interactive challenges in ${cleanTitle || 'Applied AI'}.`,
    level: id.includes('adv') || id.includes('phd') || id.includes('ip') ? 'Advanced' : 'Intermediate',
    tier: id.includes('pro') || id.includes('adv') ? 'Pro' : 'Free',
    category: 'Applied AI & Engineering',
    estimatedTime: '1 hour',
    xpReward: 400,
    iconName: 'Brain',
    ageGroup: 'UNDERGRADUATE',
    tasks: [
      {
        id: `task-${id}-1`,
        orderNumber: 1,
        title: `Task 1: Conceptual Foundation (${cleanTitle})`,
        instructions: `Welcome to the ${cleanTitle} interactive lab. Review the problem statement and identify the fundamental principle governing this architecture.`,
        taskType: 'MULTIPLE_CHOICE',
        questionText: `What is the primary engineering objective when implementing ${cleanTitle}?`,
        options: [
          'Maximizing inference accuracy and operational efficiency while minimizing computational latency',
          'Deleting all cache and storage layers',
          'Replacing mathematical models with random sampling',
          'Disabling all evaluation metrics',
        ],
        correctAnswer: 'Maximizing inference accuracy and operational efficiency while minimizing computational latency',
        explanation: 'Production AI engineering balances model performance with latency, memory bounds, and computational efficiency.',
        explanationWrong: 'Review the objectives and select the optimal engineering principle.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 200,
      },
      {
        id: `task-${id}-2`,
        orderNumber: 2,
        title: `Task 2: Implementation & Verification`,
        instructions: `Analyze the operational pipeline for ${cleanTitle}. Verify that inputs are normalized and tensor representations adhere to model specifications.`,
        taskType: 'MULTIPLE_CHOICE',
        questionText: `During production deployment of ${cleanTitle}, which verification step ensures pipeline stability?`,
        options: [
          'Automated input validation, error handling with graceful fallback, and end-to-end regression testing',
          'Bypassing all data sanity checks',
          'Ignoring out-of-distribution exceptions',
          'Running unmonitored code in production',
        ],
        correctAnswer: 'Automated input validation, error handling with graceful fallback, and end-to-end regression testing',
        explanation: 'Defensive engineering with strict contract validation ensures system resilience against anomalous inputs.',
        explanationWrong: 'Reliable systems mandate rigorous validation and fallback safeguards.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 200,
      },
    ],
  };
}
