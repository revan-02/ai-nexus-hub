'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Compass,
  CheckCircle2,
  Clock,
  BookOpen,
  ChevronRight,
  ArrowRight,
  Code,
  Trophy,
  Briefcase,
  Sparkles,
  Zap,
  TrendingUp,
  Award,
  Layers,
  FileText,
  DollarSign,
  Cpu,
  Target,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

interface CareerTrack {
  id: string;
  title: string;
  salary: string;
  demand: string;
  experience: string;
  desc: string;
  techStack: string[];
  milestones: { level: string; role: string; timeline: string }[];
}

interface SkillNode {
  id: string;
  title: string;
  level: 'Novice' | 'Intermediate' | 'Expert';
  hoursToMaster: string;
  desc: string;
  checklist: string[];
  completed: boolean;
}

interface ResearchMilestone {
  id: string;
  year: string;
  title: string;
  authors: string;
  citations: string;
  breakthrough: string;
  mathFormula: string;
  keyTakeaways: string[];
}

function RoadmapPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Tab state synced with URL parameter if present
  const initialTab = useMemo(() => {
    const tabParam = searchParams?.get('tab');
    if (tabParam === 'career') return 'Career Roadmap';
    if (tabParam === 'skill') return 'Skill Roadmap';
    if (tabParam === 'research') return 'Research Roadmap';
    return 'Learning Roadmap';
  }, [searchParams]);

  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Handle Tab Switch
  const handleTabSelect = (tab: string) => {
    setActiveTab(tab);
    const paramKey = tab === 'Career Roadmap' ? 'career' : tab === 'Skill Roadmap' ? 'skill' : tab === 'Research Roadmap' ? 'research' : 'learning';
    router.replace(`/roadmap?tab=${paramKey}`, { scroll: false });
  };

  // --- Tier-specific Learning Roadmaps ---
  const [selectedRoadmapTier, setSelectedRoadmapTier] = useState('undergraduate');

  const tierRoadmaps: Record<string, any[]> = {
    'young-explorer': [
      {
        phase: 'Stage 1',
        roomId: 'room-ye-1',
        title: 'What is AI? Fun Introduction for Kids',
        duration: '2 Weeks',
        status: 'Completed',
        tier: 'Free',
        progress: 100,
        prereq: 'No Prior Knowledge — Just Curiosity!',
        topics: ['What is Artificial Intelligence?', 'How Does a Robot Think?', 'AI in Your Daily Life (Google, YouTube, Alexa)', 'Pattern Recognition Games & Puzzles'],
        projects: ['Teach a Robot to Sort Colors', 'AI Scavenger Hunt'],
      },
      {
        phase: 'Stage 2',
        roomId: 'room-ye-2',
        title: 'Scratch Programming & Simple Chatbots',
        duration: '3 Weeks',
        status: 'In Progress',
        tier: 'Free',
        progress: 40,
        prereq: 'Stage 1: What is AI?',
        topics: ['Drag-and-Drop Coding with Scratch', 'Loops, Variables & Conditions', 'Build a Quiz Chatbot', 'Animate an AI Story Character'],
        projects: ['My First Scratch Chatbot', 'Interactive AI Story Game'],
      },
      {
        phase: 'Stage 3',
        roomId: 'room-ye-3',
        title: 'Train Your Own AI: Teachable Machine',
        duration: '2 Weeks',
        status: 'Next Up',
        tier: 'Free',
        progress: 0,
        prereq: 'Stage 2: Scratch Programming',
        topics: ['What is Training Data?', 'Upload Photos & Train a Classifier', 'Test Your AI Model Live', 'How Computers See Images'],
        projects: ['Rock-Paper-Scissors AI', 'Pet Breed Detector'],
      },
    ],
    'junior-innovator': [
      {
        phase: 'Stage 1',
        roomId: 'room-ji-1',
        title: 'Python Programming from Scratch',
        duration: '4 Weeks',
        status: 'Completed',
        tier: 'Free',
        progress: 100,
        prereq: 'Basic Computer Skills',
        topics: ['Variables, Data Types & Operators', 'If/Else Conditions & Loops', 'Functions & Lists', 'File I/O & Simple Games'],
        projects: ['Number Guessing Game', 'Simple Calculator App'],
      },
      {
        phase: 'Stage 2',
        roomId: 'room-ji-2',
        title: 'Math for AI: Matrices, Probability & Statistics',
        duration: '4 Weeks',
        status: 'In Progress',
        tier: 'Free',
        progress: 55,
        prereq: 'Stage 1: Python Basics',
        topics: ['Vectors & Matrices Visually', 'Probability Trees & Bayes', 'Mean, Median, Mode & Standard Deviation', 'Plotting Data with Matplotlib'],
        projects: ['Cricket Score Predictor', 'Weather Data Dashboard'],
      },
      {
        phase: 'Stage 3',
        roomId: 'room-ji-3',
        title: 'Your First Neural Network',
        duration: '3 Weeks',
        status: 'Next Up',
        tier: 'Pro',
        progress: 0,
        prereq: 'Stage 2: Math for AI',
        topics: ['What is a Neuron?', 'How Neural Networks Learn', 'Train a Digit Recognizer', 'Introduction to TensorFlow Playground'],
        projects: ['Handwritten Digit Classifier', 'Simple Image Sorter'],
      },
    ],
    'pre-university': [
      {
        phase: 'Stage 1',
        roomId: 'room-pu-1',
        title: 'Calculus & Linear Algebra for AI',
        duration: '5 Weeks',
        status: 'Completed',
        tier: 'Free',
        progress: 100,
        prereq: 'Class 10 Mathematics',
        topics: ['Derivatives & Chain Rule', 'Partial Derivatives & Gradients', 'Matrix Operations & Determinants', 'Eigenvalues & Eigenvectors Intuition'],
        projects: ['Gradient Descent Visualizer', 'Matrix Calculator App'],
      },
      {
        phase: 'Stage 2',
        roomId: 'room-pu-2',
        title: 'Data Structures & Algorithms',
        duration: '6 Weeks',
        status: 'In Progress',
        tier: 'Free',
        progress: 60,
        prereq: 'Stage 1: Math Foundation',
        topics: ['Arrays, Linked Lists & Stacks', 'Trees, Graphs & Traversals', 'Sorting & Searching Algorithms', 'Big-O Analysis & Dynamic Programming'],
        projects: ['Pathfinding Visualizer', 'Sorting Algorithm Animator'],
      },
      {
        phase: 'Stage 3',
        roomId: 'room-pu-3',
        title: 'Introduction to Machine Learning',
        duration: '5 Weeks',
        status: 'Next Up',
        tier: 'Pro',
        progress: 0,
        prereq: 'Stage 2: DSA Foundation',
        topics: ['Linear & Logistic Regression', 'Decision Trees & Random Forests', 'K-Means Clustering & PCA', 'Model Evaluation & Cross-Validation'],
        projects: ['Student Grade Predictor', 'Iris Flower Classifier', 'First Kaggle Competition'],
      },
    ],
    'undergraduate': [
      {
        phase: 'Stage 1',
        roomId: 'room-1',
        title: 'AI Foundations & Intelligent Agents',
        duration: '4 Weeks',
        status: 'Completed',
        tier: 'Free',
        progress: 100,
        prereq: 'Zero Prior Background Required',
        topics: [
          'What is AI vs ML vs DL vs GenAI (Venn Diagram, Evolution & Paradigm Shifts)',
          'Intelligent Agent PEAS Framework (Performance, Environment, Actuators, Sensors)',
          'Agent Environments: Deterministic vs Stochastic, Fully vs Partially Observable',
          'Uninformed Search Strategies: Breadth-First (BFS), Depth-First (DFS) & Uniform Cost Search',
          'Informed Heuristic Search: Greedy Best-First & A* Pathfinding with Admissible Heuristics',
          'Adversarial Game Search: Minimax Algorithm, Alpha-Beta Pruning & Evaluation Functions',
          'Propositional & First-Order Predicate Logic: Horn Clauses, Forward & Backward Chaining',
          'Rule-Based Expert Systems, Forward-Chaining Inference Engines & Knowledge Ontologies',
          'Ethics in AI, Alignment Principles & The Turing Test Evaluation'
        ],
        projects: [
          'A* Route Optimization & Dynamic Maze Pathfinding Engine',
          'Agri-Diagnosis Rule-Based Diagnostic Expert System',
          'Minimax Alpha-Beta Pruning Connect-4 & Tic-Tac-Toe Game AI'
        ],
      },
      {
        phase: 'Stage 2',
        roomId: 'room-3',
        title: 'Machine Learning & Statistical Modeling',
        duration: '6 Weeks',
        status: 'Completed',
        tier: 'Free',
        progress: 100,
        prereq: 'Stage 1 AI Foundations',
        topics: [
          'Exploratory Data Analysis (EDA), Missing Value Imputation & Feature Scaling',
          'Supervised Regression: Ordinary Least Squares (OLS), Gradient Descent & Cost Functions',
          'Logistic Regression, Sigmoid Activation & Binary Cross-Entropy Loss',
          'Decision Trees: Gini Impurity, Entropy, Information Gain & Cost-Complexity Pruning',
          'Ensemble Learning: Bagging, Random Forests, AdaBoost & Gradient Boosting (XGBoost, LightGBM)',
          'Unsupervised Clustering: K-Means, Elbow Method, Silhouette Scores & DBSCAN',
          'Dimensionality Reduction: Principal Component Analysis (PCA) & Eigenvalue Decomposition',
          'Bias-Variance Tradeoff, L1 Lasso & L2 Ridge Regularization',
          'Model Evaluation: ROC-AUC, Precision-Recall Curves, Confusion Matrix & k-Fold Cross-Validation',
          'Model Explainability: SHAP (Shapley Additive Explanations) & LIME Feature Attribution'
        ],
        projects: [
          'Real-Time Credit Card Fraud Detection Classifier (Imbalanced Data / SMOTE)',
          'E-Commerce Customer Segmentation & RFM Clustering Pipeline',
          'Multi-Variable House Price Valuation Engine with Regularization'
        ],
      },
      {
        phase: 'Stage 3',
        roomId: 'room-5',
        title: 'Deep Learning & PyTorch Networks',
        duration: '8 Weeks',
        status: 'In Progress',
        tier: 'Pro',
        progress: 65,
        prereq: 'Stage 2 Machine Learning',
        topics: [
          'Artificial Neurons, Perceptron Convergence & Universal Approximation Theorem',
          'Activation Functions: Sigmoid, Tanh, ReLU, Leaky ReLU, GELU & Swish',
          'Forward Propagation, Computational Graphs & Analytical Backpropagation Derivations',
          'Loss Functions: MSE, Categorical Cross-Entropy, Focal Loss & Contrastive Loss',
          'Advanced Optimizers: Momentum, RMSprop, Adam & AdamW Weight Decay',
          'Neural Network Regularization: Batch Normalization, LayerNorm & Dropout (p=0.5)',
          'Convolutional Neural Networks (CNNs): 2D Convolutions, Strides, Padding & Pooling',
          'Landmark Vision Architectures: VGG, ResNet Residual Skip Connections & EfficientNet',
          'Sequence Models: Vanishing Gradients, LSTM Gating (Forget/Input/Output) & GRU',
          'Self-Attention Math: Scaled Dot-Product Softmax(QK^T / √d_k)V & Multi-Head Projections',
          'Full Transformer Encoder-Decoder Architecture from Mathematical Foundations'
        ],
        projects: [
          'PyTorch Digit Recognition MLP & Tensor Operations Lab',
          'ResNet Plant Leaf Disease Vision Classifier with Augmentation',
          'Scratch Implementation of Transformer Multi-Head Self-Attention in PyTorch',
          'Audio Spectrogram Speech Keyword Spotter'
        ],
      },
      {
        phase: 'Stage 4',
        roomId: 'room-8',
        title: 'Generative AI, LLMs & Autonomous Agents',
        duration: '8 Weeks',
        status: 'Next Up',
        tier: 'Pro',
        progress: 20,
        prereq: 'Stage 3 Deep Learning',
        topics: [
          'Byte-Pair Encoding (BPE), SentencePiece Tokenization & Vocabulary Dictionaries',
          'Decoder-Only Transformers: GPT Causal Masking & Rotary Positional Embeddings (RoPE)',
          'Advanced Prompt Engineering: Zero-Shot, Few-Shot, Chain-of-Thought (CoT) & Tree-of-Thought (ToT)',
          'Enterprise Retrieval-Augmented Generation (RAG): Chunking, Dense Embeddings & HNSW Indexing',
          'Vector Databases: FAISS, Qdrant, ChromaDB & Hybrid Search (BM25 + Semantic Embeddings)',
          'Parameter-Efficient Fine-Tuning: LoRA (Low-Rank Adaptation) & 4-bit/8-bit QLoRA Quantization',
          'Alignment: RLHF, Direct Preference Optimization (DPO) & Constitutional AI Principles',
          'Autonomous AI Agents: ReAct (Reasoning + Acting) Framework, Tool Use & Function Calling Schemas',
          'Multi-Agent Orchestration: LangGraph State Graphs, Persistent Memory & Peer Collaboration',
          'LLM Evaluation & Production Guardrails: Ragas Metrics (Faithfulness, Relevance) & Hallucination Defense'
        ],
        projects: [
          'Production-Grade Technical Documentation RAG System with Hybrid Search & Citations',
          'Domain-Adapted Fine-Tuned 4-bit Quantized Llama-3 / Mistral-7B with LoRA',
          'Autonomous ReAct Tool-Calling Financial Research Agent with Live Web Tools',
          'Multi-Agent Software Engineering Simulation (Architect, Coder, Reviewer, Tester)'
        ],
      },
    ],
    'postgraduate': [
      {
        phase: 'Stage 1',
        roomId: 'room-pg-1',
        title: 'Advanced NLP & Transformer Architectures',
        duration: '6 Weeks',
        status: 'Completed',
        tier: 'Pro',
        progress: 100,
        prereq: 'B.Tech/BSc in CS or equivalent',
        topics: ['RNN → LSTM → GRU Evolution', 'Self-Attention & Multi-Head Attention', 'BERT Pre-training & Fine-Tuning', 'GPT Architecture & Autoregressive LMs'],
        projects: ['Sentiment Analysis with BERT', 'Question-Answering System'],
      },
      {
        phase: 'Stage 2',
        roomId: 'room-pg-2',
        title: 'Reinforcement Learning & Decision Making',
        duration: '6 Weeks',
        status: 'In Progress',
        tier: 'Pro',
        progress: 45,
        prereq: 'Stage 1: Advanced NLP',
        topics: ['Markov Decision Processes', 'Q-Learning & Deep Q-Networks', 'Policy Gradient & Actor-Critic', 'PPO & Multi-Agent RL'],
        projects: ['CartPole DQN Agent', 'Chess AI with Monte Carlo Tree Search'],
      },
      {
        phase: 'Stage 3',
        roomId: 'room-pg-3',
        title: 'Distributed Training & MLOps',
        duration: '5 Weeks',
        status: 'Next Up',
        tier: 'Pro',
        progress: 0,
        prereq: 'Stage 2: RL Foundation',
        topics: ['Data Parallelism & Model Parallelism', 'DeepSpeed ZeRO & FSDP', 'MLflow, W&B & Experiment Tracking', 'CI/CD for ML Pipelines'],
        projects: ['Multi-GPU Training Pipeline', 'Automated ML Deployment'],
      },
      {
        phase: 'Stage 4',
        roomId: 'room-pg-4',
        title: 'Research Paper & Publication',
        duration: '8 Weeks',
        status: 'Next Up',
        tier: 'Pro',
        progress: 0,
        prereq: 'Stage 3: MLOps',
        topics: ['Literature Review & Gap Analysis', 'Experimental Design & Ablation Studies', 'LaTeX & Scientific Writing', 'Peer Review & Conference Submission'],
        projects: ['Novel Architecture Proposal', 'Benchmark Study Publication'],
      },
    ],
    'industry-professional': [
      {
        phase: 'Stage 1',
        roomId: 'room-ip-1',
        title: 'Production RAG & Vector Databases',
        duration: '4 Weeks',
        status: 'Completed',
        tier: 'Pro',
        progress: 100,
        prereq: 'Working Knowledge of Python & ML',
        topics: ['Dense vs Sparse Retrieval', 'FAISS, Qdrant & Pinecone', 'Chunking Strategies & Embedding Models', 'Hybrid BM25 + Semantic Search'],
        projects: ['Enterprise Document QA System', 'Multi-Modal RAG Pipeline'],
      },
      {
        phase: 'Stage 2',
        roomId: 'room-ip-2',
        title: 'LLM Fine-Tuning & PEFT',
        duration: '4 Weeks',
        status: 'In Progress',
        tier: 'Pro',
        progress: 70,
        prereq: 'Stage 1: RAG Systems',
        topics: ['LoRA & QLoRA Theory', '4-bit NF4 Quantization', 'Instruction Dataset Preparation', 'Adapter Merging & Evaluation'],
        projects: ['Domain-Specific LLM Fine-Tune', 'Custom Instruction Model'],
      },
      {
        phase: 'Stage 3',
        roomId: 'room-ip-3',
        title: 'Autonomous AI Agents & MCP',
        duration: '4 Weeks',
        status: 'Next Up',
        tier: 'Pro',
        progress: 0,
        prereq: 'Stage 2: LLM Fine-Tuning',
        topics: ['ReAct Agent Architecture', 'Tool Calling & Function Schemas', 'LangGraph State Machines', 'Model Context Protocol (MCP)'],
        projects: ['Multi-Tool Research Agent', 'Code Review AI Agent'],
      },
    ],
    'phd-research': [
      {
        phase: 'Stage 1',
        roomId: 'room-phd-1',
        title: 'Architecture Innovation & Scaling Laws',
        duration: '8 Weeks',
        status: 'In Progress',
        tier: 'Pro',
        progress: 35,
        prereq: 'MSc/M.Tech or equivalent research experience',
        topics: ['Neural Architecture Search (DARTS/ENAS)', 'Mixture of Experts & Sparse Routing', 'Chinchilla & DeepSeek Scaling Laws', 'State Space Models (Mamba/S4)'],
        projects: ['Custom MoE Router Implementation', 'Scaling Law Verification Study'],
      },
      {
        phase: 'Stage 2',
        roomId: 'room-phd-2',
        title: 'AI Alignment & Safety Research',
        duration: '8 Weeks',
        status: 'Next Up',
        tier: 'Pro',
        progress: 0,
        prereq: 'Stage 1: Architecture Innovation',
        topics: ['RLHF & Direct Preference Optimization', 'Constitutional AI & Harmlessness', 'Red-Teaming & Adversarial Robustness', 'Mechanistic Interpretability'],
        projects: ['DPO Training Pipeline', 'Automated Red-Team Framework'],
      },
      {
        phase: 'Stage 3',
        roomId: 'room-phd-3',
        title: 'Thesis & Conference Publication',
        duration: '12 Weeks',
        status: 'Next Up',
        tier: 'Pro',
        progress: 0,
        prereq: 'Stage 2: Alignment Research',
        topics: ['Systematic Literature Review', 'Novel Contribution & Ablation Studies', 'ArXiv Pre-print & Peer Review', 'NeurIPS / ICML / ICLR Submission'],
        projects: ['PhD Thesis Draft', 'Tier-1 Conference Paper'],
      },
    ],
  };

  const activeLearningPhases = tierRoadmaps[selectedRoadmapTier] || tierRoadmaps['undergraduate'];

  const tierLabels: Record<string, { emoji: string; label: string; grade: string }> = {
    'young-explorer': { emoji: '🌟', label: 'Young Explorer', grade: 'Class 5–7' },
    'junior-innovator': { emoji: '🚀', label: 'Junior Innovator', grade: 'Class 8–10' },
    'pre-university': { emoji: '📐', label: 'Pre-University', grade: 'Class 11–12' },
    'undergraduate': { emoji: '🎓', label: 'Undergraduate', grade: 'B.Tech / BSc' },
    'postgraduate': { emoji: '🔬', label: 'Postgraduate', grade: 'M.Tech / MSc' },
    'industry-professional': { emoji: '💼', label: 'Industry Professional', grade: '0–4 yrs exp' },
    'phd-research': { emoji: '🧪', label: 'PhD & Research', grade: 'PhD / Postdoc' },
  };


  // --- Data for Career Roadmap ---
  const careerTracks: CareerTrack[] = [
    {
      id: 'car-1',
      title: 'LLM & Generative AI Engineer',
      salary: '$165,000 - $240,000 / yr',
      demand: 'Very High (14,200+ Open Roles)',
      experience: '2 - 4 Years',
      desc: 'Architect and deploy large language models, retrieval augmented generation (RAG) pipelines, fine-tuned checkpoints, and autonomous multi-agent networks.',
      techStack: ['PyTorch', 'LangChain', 'vLLM', 'Qdrant', 'FastAPI', 'LoRA / QLoRA'],
      milestones: [
        { level: 'Entry Level', role: 'Junior AI Software Engineer', timeline: '0 - 2 Years' },
        { level: 'Mid Level', role: 'Senior LLM Engineer', timeline: '2 - 5 Years' },
        { level: 'Staff / Lead', role: 'Lead AI Systems Architect', timeline: '5+ Years' },
      ],
    },
    {
      id: 'car-2',
      title: 'MLOps & AI Infrastructure Specialist',
      salary: '$175,000 - $250,000 / yr',
      demand: 'High Demand',
      experience: '3 - 5 Years',
      desc: 'Design scalable distributed training clusters, GPU orchestration pipelines, model monitoring, and automated CI/CD deployment workflows.',
      techStack: ['Kubernetes', 'Ray', 'CUDA', 'Docker', 'Triton Server', 'Weights & Biases'],
      milestones: [
        { level: 'Entry Level', role: 'DevOps / Data Engineer', timeline: '0 - 2 Years' },
        { level: 'Mid Level', role: 'Senior MLOps Engineer', timeline: '2 - 5 Years' },
        { level: 'Staff / Lead', role: 'Principal AI Infrastructure Lead', timeline: '5+ Years' },
      ],
    },
    {
      id: 'car-3',
      title: 'AI Research Scientist (DL / GenAI)',
      salary: '$190,000 - $310,000 / yr',
      demand: 'High Specialization',
      experience: 'Ph.D. or Equivalent Research',
      desc: 'Pioneer novel model architectures, attention kernels, alignment algorithms (RLHF/DPO), and state-space multimodal representations.',
      techStack: ['PyTorch', 'JAX / Flax', 'CUDA C++', 'DeepSpeed', 'Megatron-LM'],
      milestones: [
        { level: 'Entry Level', role: 'Research Fellow / Assistant', timeline: '0 - 2 Years' },
        { level: 'Mid Level', role: 'Staff AI Research Scientist', timeline: '2 - 5 Years' },
        { level: 'Staff / Lead', role: 'Director of AI Research', timeline: '5+ Years' },
      ],
    },
  ];

  // --- Data for Skill Roadmap ---
  const skillNodes: SkillNode[] = [
    {
      id: 'skl-1',
      title: 'Transformer Attention & Self-Attention Math',
      level: 'Expert',
      hoursToMaster: '35 Hours',
      desc: 'Deep mastery of Query-Key-Value dot products, multi-head scaling, FlashAttention kernels, and KV caching.',
      checklist: [
        'Derive QK^T / sqrt(d_k) scaling proof',
        'Implement Multi-Head Attention in PyTorch from scratch',
        'Understand FlashAttention-2 memory access patterns',
        'Implement PagedAttention & KV Caching mechanism',
      ],
      completed: true,
    },
    {
      id: 'skl-2',
      title: 'Parameter-Efficient Fine-Tuning (PEFT & LoRA)',
      level: 'Intermediate',
      hoursToMaster: '25 Hours',
      desc: 'Low-rank adaptation technique for fine-tuning billions of parameters using rank decomposition matrices A and B.',
      checklist: [
        'Understand Rank Decomposition matrices W + ΔW = W + B · A',
        'Configure QLoRA 4-bit NF4 quantization with BitsAndBytes',
        'Fine-tune LLaMA-3 8B on custom JSON instruction dataset',
        'Merge LoRA adapter weights with base checkpoint',
      ],
      completed: true,
    },
    {
      id: 'skl-3',
      title: 'High-Performance Vector Indexing (HNSW & IVFFlat)',
      level: 'Intermediate',
      hoursToMaster: '20 Hours',
      desc: 'Approximate Nearest Neighbor (ANN) search algorithms over high-dimensional vector embeddings.',
      checklist: [
        'Understand Cosine Similarity vs Dot Product vs Euclidean distance',
        'Tune HNSW M and ef_construction parameters',
        'Benchmark Qdrant vs Pinecone vs Milvus for RAG latency',
        'Implement hybrid keyword + vector semantic search',
      ],
      completed: false,
    },
  ];

  // --- Data for Research Roadmap ---
  const researchMilestones: ResearchMilestone[] = [
    {
      id: 'res-1',
      year: '2017',
      title: 'Attention Is All You Need',
      authors: 'Vaswani et al. (Google Brain & Google Research)',
      citations: '134,000+ Citations',
      breakthrough: 'Introduced the Transformer architecture, replacing recurrent networks with parallelizable self-attention mechanisms.',
      mathFormula: 'Attention(Q, K, V) = softmax((Q Kᵀ) / √dₖ) V',
      keyTakeaways: [
        'Eliminates sequential recurrence for O(1) sequential operation count',
        'Multi-Head Attention allows joint learning across representation subspaces',
        'Positional Encodings inject sequence order into non-recurrent layers',
      ],
    },
    {
      id: 'res-2',
      year: '2022',
      title: 'Direct Preference Optimization (DPO)',
      authors: 'Rafailov et al. (Stanford University)',
      citations: '4,200+ Citations',
      breakthrough: 'Eliminates the explicit reward model and RL sampling step in RLHF by optimizing language model policy parameters directly.',
      mathFormula: 'L_DPO(π_θ; π_ref) = -E_{(x,y_w,y_l)} [ log σ( β log (π_θ(y_w|x)/π_ref(y_w|x)) - β log (π_θ(y_l|x)/π_ref(y_l|x)) ) ]',
      keyTakeaways: [
        'Mathematically solves the exact same objective as PPO-based RLHF',
        'Requires zero reward model training or complex PPO hyperparameter tuning',
        'Dramatically reduces compute cost and stability issues in LLM alignment',
      ],
    },
    {
      id: 'res-3',
      year: '2024',
      title: 'Mamba: Linear-Time Sequence Modeling with Selective SSMs',
      authors: 'Gu & Dao (Carnegie Mellon & Princeton)',
      citations: '2,800+ Citations',
      breakthrough: 'Introduces selective state space models (SSMs) achieving linear-time O(N) scaling over million-token context windows.',
      mathFormula: 'h\'(t) = A h(t) + B x(t),   y(t) = C h(t)',
      keyTakeaways: [
        '5x higher inference throughput than Transformers for long sequences',
        'Selectively filters context based on input tokens dynamically',
        'Hybrid Mamba-Transformer models power next-generation LLM architectures',
      ],
    },
  ];

  return (
    <NexusShell>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-purple-400 font-semibold">AI Roadmap</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">AI Learning & Career Roadmap</h1>
              <Compass className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Step-by-step structured paths covering core learning, career trajectories, specialized skills, and foundational research papers.
            </p>
          </div>
        </div>

        {/* Roadmap Type Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto scrollbar-none">
          {['Learning Roadmap', 'Career Roadmap', 'Skill Roadmap', 'Research Roadmap'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabSelect(tab)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-900/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ==================== TAB 1: LEARNING ROADMAP ==================== */}
        {activeTab === 'Learning Roadmap' && (
          <div className="space-y-4">
            {/* Tier Selector Bar */}
            <div className="flex flex-wrap items-center gap-2 p-3 bg-card border border-border rounded-2xl">
              <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase mr-2">SELECT TIER:</span>
              {Object.entries(tierLabels).map(([key, tier]) => (
                <button
                  key={key}
                  onClick={() => setSelectedRoadmapTier(key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedRoadmapTier === key
                      ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-900/30'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary border border-border'
                  }`}
                >
                  <span>{tier.emoji}</span>
                  <span className="hidden sm:inline">{tier.label}</span>
                  <span className="sm:hidden">{tier.grade}</span>
                </button>
              ))}
            </div>

            {/* Current Tier Info */}
            <div className="p-4 bg-gradient-to-r from-purple-600/10 to-indigo-600/10 border border-purple-500/20 rounded-2xl">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{tierLabels[selectedRoadmapTier]?.emoji}</span>
                <h3 className="text-base font-bold text-foreground">{tierLabels[selectedRoadmapTier]?.label} Learning Path</h3>
                <span className="text-xs text-muted-foreground px-2 py-0.5 bg-secondary rounded-full">{tierLabels[selectedRoadmapTier]?.grade}</span>
              </div>
              <p className="text-xs text-muted-foreground">{activeLearningPhases.length} stages · Age-appropriate curriculum designed for {tierLabels[selectedRoadmapTier]?.grade} students</p>
            </div>

            {activeLearningPhases.map((p) => (
              <Card key={p.phase} className="p-6 bg-card border-border rounded-2xl hover:border-purple-500/40 transition-all space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-bold font-mono rounded-lg">
                      {p.phase}
                    </span>
                    <h3 className="text-base font-bold text-foreground">{p.title}</h3>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-muted-foreground flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" /> {p.duration}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${
                      p.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                      p.status === 'In Progress' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-secondary text-muted-foreground border-border'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
                  {/* Left 7 cols: Exhaustive Topics */}
                  <div className="lg:col-span-7 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground text-xs flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                        <span>Key Topics Covered ({p.topics.length} Core Modules)</span>
                      </span>
                    </div>
                    <ul className="space-y-1.5 text-muted-foreground">
                      {p.topics.map((t: string, idx: number) => (
                        <li key={t} className="flex items-start gap-2.5 p-1.5 rounded-lg hover:bg-secondary/40 transition-colors">
                          <span className="w-4 h-4 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[9px] font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {(idx + 1).toString().padStart(2, '0')}
                          </span>
                          <span className="text-[11.5px] leading-relaxed text-foreground/90">{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right 5 cols: Hands-on Projects & Action */}
                  <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-foreground text-xs flex items-center gap-1.5 mb-2">
                        <Trophy className="w-3.5 h-3.5 text-amber-400" />
                        <span>Hands-on Milestones & Projects ({p.projects.length})</span>
                      </span>
                      <div className="space-y-2">
                        {p.projects.map((proj: string) => (
                          <div
                            key={proj}
                            className="p-3 bg-secondary/50 hover:bg-secondary border border-border hover:border-purple-500/30 rounded-2xl font-semibold text-foreground flex items-center justify-between text-xs transition-all group"
                          >
                            <span className="group-hover:text-purple-400 transition-colors leading-snug">{proj}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border flex items-center justify-between gap-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                        p.tier === 'Free' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                      }`}>
                        {p.tier} Access Tier
                      </span>

                      <Link href={`/learn/${p.roomId}`}>
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-3.5 py-1.5 h-9 rounded-xl gap-1.5 shadow-md shadow-purple-900/30 cursor-pointer">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Launch Interactive Room</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ==================== TAB 2: CAREER ROADMAP ==================== */}
        {activeTab === 'Career Roadmap' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {careerTracks.map((car) => (
                <Card key={car.id} className="p-6 bg-card border-border rounded-2xl space-y-5 hover:border-purple-500/40 transition-all flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="space-y-1 border-b border-border pb-3">
                      <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-wider block">Career Path</span>
                      <h3 className="text-base font-bold text-foreground leading-snug">{car.title}</h3>
                    </div>

                    <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-xl space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground font-medium">Salary Range:</span>
                        <span className="font-bold font-mono text-emerald-400">{car.salary}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground font-medium">Market Demand:</span>
                        <span className="font-bold text-purple-400">{car.demand}</span>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">{car.desc}</p>

                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-foreground block">Required Tech Stack:</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {car.techStack.map((tech) => (
                          <span key={tech} className="px-2 py-0.5 bg-secondary text-foreground text-[10px] font-mono rounded border border-border">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Milestone Ladder */}
                    <div className="space-y-2 pt-1 border-t border-border">
                      <span className="text-xs font-bold text-foreground block">Career Milestones:</span>
                      <div className="space-y-1.5 text-xs">
                        {car.milestones.map((m) => (
                          <div key={m.role} className="p-2.5 bg-secondary/50 border border-border rounded-xl flex items-center justify-between">
                            <div>
                              <span className="font-bold text-foreground block">{m.role}</span>
                              <span className="text-[10px] text-muted-foreground">{m.level}</span>
                            </div>
                            <span className="text-[10px] font-mono text-purple-400 font-bold">{m.timeline}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs h-9 rounded-xl gap-1.5 shadow-sm shadow-purple-900/30 mt-4">
                    <span>Explore Career Track</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 3: SKILL ROADMAP ==================== */}
        {activeTab === 'Skill Roadmap' && (
          <div className="space-y-4">
            {skillNodes.map((skl) => (
              <Card key={skl.id} className="p-6 bg-card border-border rounded-2xl space-y-4 hover:border-purple-500/40 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-bold font-mono rounded-lg">
                      {skl.level}
                    </span>
                    <h3 className="text-base font-bold text-foreground">{skl.title}</h3>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
                    <span>Est. Time: <strong className="text-purple-400">{skl.hoursToMaster}</strong></span>
                    {skl.completed ? (
                      <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Mastered
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold rounded-full">
                        In Progress
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">{skl.desc}</p>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-foreground block">Competency Checklist:</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {skl.checklist.map((item, idx) => (
                      <div key={idx} className="p-3 bg-secondary/50 border border-border rounded-xl flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                        <span className="text-foreground font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ==================== TAB 4: RESEARCH ROADMAP ==================== */}
        {activeTab === 'Research Roadmap' && (
          <div className="space-y-6">
            {researchMilestones.map((res) => (
              <Card key={res.id} className="p-6 bg-card border-border rounded-2xl space-y-4 hover:border-purple-500/40 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-purple-600 text-white font-mono text-xs font-bold rounded-lg shadow-md shadow-purple-900/30">
                      {res.year}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-foreground leading-snug">{res.title}</h3>
                      <p className="text-xs text-purple-400 font-medium mt-0.5">{res.authors}</p>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    {res.citations}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">{res.breakthrough}</p>

                {/* Math Formula Card */}
                <div className="p-4 bg-secondary/60 border border-border rounded-xl space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Key Equation / Mathematical Formulation</span>
                  <p className="font-mono text-xs text-purple-300 font-bold">{res.mathFormula}</p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-foreground block">Key Architectural Takeaways:</span>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    {res.keyTakeaways.map((tk) => (
                      <div key={tk} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        <span>{tk}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button variant="outline" className="bg-secondary border-border text-foreground text-xs h-8 px-3 rounded-xl gap-1">
                    <span>Read ArXiv Paper</span>
                    <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </NexusShell>
  );
}

export default function RoadmapPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading AI Roadmap...</div>}>
      <RoadmapPageInner />
    </Suspense>
  );
}
