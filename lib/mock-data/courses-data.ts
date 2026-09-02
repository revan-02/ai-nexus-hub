export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type CourseStatus = 'Published' | 'Draft' | 'In Review' | 'Archived';
export type CourseAcademicTier = 'Young Explorer' | 'Junior Innovator' | 'Pre-University' | 'Undergraduate' | 'Postgraduate' | 'Industry Professional' | 'PhD & Research';

export interface CourseLecture {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'quiz' | 'coding_lab' | 'reading';
  isPreview?: boolean;
}

export interface CourseSection {
  id: string;
  sectionNumber: number;
  title: string;
  totalTime: string;
  lectures: CourseLecture[];
}

export interface CourseIncludes {
  hoursVideo: string;
  articles: number;
  codingExercises: number;
  downloadableResources: number;
  certificate: boolean;
  lifetimeAccess: boolean;
}

export interface CourseItem {
  id: string;
  title: string;
  description: string;
  category: string;
  level: CourseLevel;
  academicTier?: CourseAcademicTier;
  totalHours?: string;
  totalLectures?: number;
  rating?: number;
  ratingsCount?: string;
  objectives?: string[];
  expectedOutcomes?: string[];
  prerequisites?: string[];
  includes?: CourseIncludes;
  curriculum?: CourseSection[];
  instructor: {
    id?: string;
    name: string;
    avatar: string;
  };
  price: string;
  students: string;
  status: CourseStatus;
  updatedAt: string;
  thumbnailIcon: string;
}

export const mockCoursesMetrics = [
  { id: 'total', title: 'Total Courses', value: '256', change: '12.8%', trend: 'up', period: 'vs last month', variant: 'purple' },
  { id: 'published', title: 'Published', value: '182', change: '71.1%', trend: 'flat', period: 'of total', variant: 'blue' },
  { id: 'drafts', title: 'Drafts', value: '38', change: '14.8%', trend: 'flat', period: 'of total', variant: 'orange' },
  { id: 'in-review', title: 'In Review', value: '16', change: '6.3%', trend: 'flat', period: 'of total', variant: 'green' },
  { id: 'archived', title: 'Archived', value: '20', change: '7.8%', trend: 'flat', period: 'of total', variant: 'red' },
  { id: 'enrollments', title: 'Total Enrollments', value: '18.6K', change: '16.4%', trend: 'up', period: 'vs last month', variant: 'cyan' },
];

export const mockCoursesList: CourseItem[] = [
  {
    id: 'crs-0',
    title: 'Stage 1: AI Foundations & Intelligent Agents',
    description: 'Master Symbolic AI, agent environments (PEAS), search algorithms, logic, and expert systems.',
    category: 'AI Foundations',
    level: 'Beginner',
    instructor: { name: 'Dr. Alex Morgan', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    price: 'Free',
    students: '8,420',
    status: 'Published',
    updatedAt: 'May 18, 2025',
    thumbnailIcon: 'Sparkles',
  },
  {
    id: 'crs-1',
    title: 'Stage 1: Search Problem Solving & Knowledge Systems',
    description: 'Informed A* search, Minimax game trees, first-order logic, and rule-based inference engines.',
    category: 'AI Foundations',
    level: 'Beginner',
    instructor: { name: 'Anna Martinez', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80' },
    price: 'Free',
    students: '5,128',
    status: 'Published',
    updatedAt: 'May 17, 2025',
    thumbnailIcon: 'Brain',
  },
  {
    id: 'crs-2',
    title: 'Stage 2: Classical Machine Learning & Scikit-Learn',
    description: 'Supervised regression/classification, Random Forests, SVMs, K-Means, and model evaluation.',
    category: 'Machine Learning',
    level: 'Intermediate',
    instructor: { name: 'Dr. Alex Morgan', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    price: '₹1,999',
    students: '3,256',
    status: 'Published',
    updatedAt: 'May 16, 2025',
    thumbnailIcon: 'Cpu',
  },
  {
    id: 'crs-3',
    title: 'Stage 3: Deep Learning & PyTorch Neural Networks',
    description: 'Artificial neurons, MLPs, backpropagation, SGD/Adam optimizers, CNNs, and sequence LSTMs.',
    category: 'Deep Learning',
    level: 'Intermediate',
    instructor: { name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
    price: '₹3,999',
    students: '2,842',
    status: 'Published',
    updatedAt: 'May 15, 2025',
    thumbnailIcon: 'Network',
  },
  {
    id: 'crs-4',
    title: 'Stage 3: Transformers, Self-Attention & Embeddings',
    description: 'Query-Key-Value self-attention math, multi-head encoders, ResNet skip connections, and representation learning.',
    category: 'Deep Learning',
    level: 'Advanced',
    instructor: { name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
    price: '₹4,999',
    students: '2,114',
    status: 'Published',
    updatedAt: 'May 14, 2025',
    thumbnailIcon: 'Layers',
  },
  {
    id: 'crs-5',
    title: 'Stage 4: Generative AI, LLMs & Enterprise RAG Architecture',
    description: 'BPE tokenization, pretraining vs instruction tuning, vector databases, chunking, and grounded generation.',
    category: 'Generative AI',
    level: 'Advanced',
    instructor: { name: 'Dr. Alex Morgan', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    price: '₹5,999',
    students: '1,842',
    status: 'Published',
    updatedAt: 'May 13, 2025',
    thumbnailIcon: 'MessageSquare',
  },
  {
    id: 'crs-6',
    title: 'Stage 4: PEFT, LoRA Fine-Tuning & Autonomous AI Agents',
    description: 'Parameter-efficient fine-tuning, 4-bit QLoRA, tool calling, ReAct agent loops, and multimodal generation.',
    category: 'Generative AI',
    level: 'Advanced',
    instructor: { name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
    price: '₹7,999',
    students: '1,976',
    status: 'Published',
    updatedAt: 'May 12, 2025',
    thumbnailIcon: 'Zap',
  },
  {
    id: 'crs-7',
    title: 'Autonomous Multi-Agent Systems & LangGraph Workflows',
    description: 'Build stateful multi-agent systems with LangGraph, Model Context Protocol (MCP), human-in-the-loop approvals, and asynchronous tool execution.',
    category: 'Agentic AI',
    level: 'Advanced',
    instructor: { name: 'Dr. Alex Morgan', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    price: '₹8,499',
    students: '2,340',
    status: 'Published',
    updatedAt: 'May 20, 2025',
    thumbnailIcon: 'Bot',
  },
  {
    id: 'crs-8',
    title: 'High-Throughput LLM Inference Serving (vLLM, TensorRT & Triton)',
    description: 'Optimize GPU memory with PagedAttention, KV-Cache compression, FP8/FP4 quantization, and production Triton Inference clusters.',
    category: 'AI Infrastructure',
    level: 'Advanced',
    instructor: { name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
    price: '₹9,999',
    students: '1,890',
    status: 'Published',
    updatedAt: 'May 21, 2025',
    thumbnailIcon: 'Cpu',
  },
  {
    id: 'crs-9',
    title: 'Enterprise GraphRAG & Hybrid Knowledge Retrieval',
    description: 'Eliminate LLM hallucinations by fusing Neo4j knowledge graphs with hybrid BM25 and dense vector embeddings with Cohere re-ranking.',
    category: 'Generative AI',
    level: 'Advanced',
    instructor: { name: 'Dr. Alex Morgan', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    price: '₹7,499',
    students: '1,620',
    status: 'Published',
    updatedAt: 'May 22, 2025',
    thumbnailIcon: 'Network',
  },
  {
    id: 'crs-10',
    title: 'Vision-Language Models, Multimodal AI & YOLOv11 Real-Time Vision',
    description: 'Fine-tune CLIP and LLaVA multimodal models, real-time YOLOv11 object segmentation, and agricultural leaf pest diagnosis.',
    category: 'Computer Vision',
    level: 'Advanced',
    instructor: { name: 'Anna Martinez', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80' },
    price: '₹6,999',
    students: '2,150',
    status: 'Published',
    updatedAt: 'May 23, 2025',
    thumbnailIcon: 'Activity',
  },
  {
    id: 'crs-11',
    title: 'AI Safety, Prompt Injection Defense & Enterprise Guardrails',
    description: 'Master OWASP Top 10 for LLMs, adversarial red-teaming, NVIDIA NeMo Guardrails, and automated compliance auditing.',
    category: 'Security & Governance',
    level: 'Advanced',
    instructor: { name: 'Dr. Alex Morgan', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    price: '₹7,999',
    students: '1,420',
    status: 'Published',
    updatedAt: 'May 24, 2025',
    thumbnailIcon: 'Shield',
  },
  {
    id: 'crs-12',
    title: 'Edge AI, Small Language Models (SLMs) & On-Device Deployment',
    description: 'Deploy quantized Phi-4 and Qwen-2.5 models on Apple Silicon, Jetson, and mobile devices using ONNX Runtime, GGUF, and WebGPU.',
    category: 'Edge & Mobile AI',
    level: 'Intermediate',
    instructor: { name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
    price: '₹5,999',
    students: '2,810',
    status: 'Published',
    updatedAt: 'May 25, 2025',
    thumbnailIcon: 'Smartphone',
  },

  // ── YOUNG EXPLORER (Class 5–7) ──
  {
    id: 'crs-13',
    title: 'What is a Computer Brain? Fun Intro to Artificial Intelligence',
    description: 'Explore AI through drag-and-drop games, "teach the robot" activities, pattern recognition puzzles, and Teachable Machine experiments.',
    category: 'AI for Kids',
    level: 'Beginner',
    academicTier: 'Young Explorer',
    instructor: { name: 'Ms. Priya Sharma', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80' },
    price: 'Free',
    students: '12,450',
    status: 'Published',
    updatedAt: 'Jun 01, 2025',
    thumbnailIcon: 'Sparkles',
  },
  {
    id: 'crs-14',
    title: 'My First Chatbot: Scratch Programming & AI Conversations',
    description: 'Build simple chatbots using Scratch blocks, understand how computers "talk", create a quiz bot, and animate an AI story character.',
    category: 'AI for Kids',
    level: 'Beginner',
    academicTier: 'Young Explorer',
    instructor: { name: 'Ms. Priya Sharma', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80' },
    price: 'Free',
    students: '9,820',
    status: 'Published',
    updatedAt: 'Jun 02, 2025',
    thumbnailIcon: 'MessageSquare',
  },

  // ── JUNIOR INNOVATOR (Class 8–10) ──
  {
    id: 'crs-15',
    title: 'Python for Young Minds: From Zero to Your First AI Project',
    description: 'Variables, loops, functions, lists → build a number guesser, simple sentiment analyzer, and a data visualization dashboard with Matplotlib.',
    category: 'Programming',
    level: 'Beginner',
    academicTier: 'Junior Innovator',
    instructor: { name: 'Anna Martinez', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80' },
    price: 'Free',
    students: '14,280',
    status: 'Published',
    updatedAt: 'Jun 03, 2025',
    thumbnailIcon: 'Code',
  },
  {
    id: 'crs-16',
    title: 'Math Behind AI: Matrices, Probability & Statistics for Class 9–10',
    description: 'Linear algebra visuals, probability trees, mean/median/mode, standard deviation, and real-world statistics problems relevant to AI.',
    category: 'Mathematics',
    level: 'Beginner',
    academicTier: 'Junior Innovator',
    instructor: { name: 'Dr. Alex Morgan', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    price: '₹499',
    students: '7,640',
    status: 'Published',
    updatedAt: 'Jun 04, 2025',
    thumbnailIcon: 'Calculator',
  },
  {
    id: 'crs-17',
    title: 'Build Your First Neural Network: A Visual Guide for Teens',
    description: 'Interactive neuron diagrams, train a digit recognizer with Teachable Machine, understand how images become numbers, and explore activation functions.',
    category: 'Deep Learning',
    level: 'Beginner',
    academicTier: 'Junior Innovator',
    instructor: { name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
    price: '₹699',
    students: '6,190',
    status: 'Published',
    updatedAt: 'Jun 05, 2025',
    thumbnailIcon: 'Network',
  },

  // ── PRE-UNIVERSITY (Class 11–12 / PUC) ──
  {
    id: 'crs-18',
    title: 'Calculus & Linear Algebra for AI: Derivatives, Gradients & Eigen Decomposition',
    description: 'Chain rule → backpropagation intuition, partial derivatives, matrix operations, eigenvalues/eigenvectors, and PCA mathematical foundations.',
    category: 'Mathematics',
    level: 'Intermediate',
    academicTier: 'Pre-University',
    instructor: { name: 'Dr. Alex Morgan', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    price: '₹1,499',
    students: '5,420',
    status: 'Published',
    updatedAt: 'Jun 06, 2025',
    thumbnailIcon: 'Calculator',
  },
  {
    id: 'crs-19',
    title: 'Data Structures & Algorithms for AI Engineers',
    description: 'Arrays, linked lists, trees, graphs, Big-O analysis, dynamic programming, and algorithmic thinking for competitive programming & ML pipelines.',
    category: 'Programming',
    level: 'Intermediate',
    academicTier: 'Pre-University',
    instructor: { name: 'Anna Martinez', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80' },
    price: '₹1,999',
    students: '8,130',
    status: 'Published',
    updatedAt: 'Jun 07, 2025',
    thumbnailIcon: 'Code',
  },
  {
    id: 'crs-20',
    title: 'Introduction to Machine Learning with Scikit-Learn',
    description: 'Hands-on ML: classification, regression, clustering with real datasets, model evaluation, cross-validation, and your first Kaggle submission.',
    category: 'Machine Learning',
    level: 'Intermediate',
    academicTier: 'Pre-University',
    instructor: { name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
    price: '₹1,999',
    students: '10,750',
    status: 'Published',
    updatedAt: 'Jun 08, 2025',
    thumbnailIcon: 'Brain',
  },

  // ── UNDERGRADUATE (B.Tech / BSc) ──
  {
    id: 'crs-21',
    title: 'Statistical Machine Learning: Bayesian Inference, MLE & Hypothesis Testing',
    description: 'Frequentist vs Bayesian paradigms, conjugate priors, maximum likelihood estimation, A/B testing, and probabilistic graphical models.',
    category: 'Machine Learning',
    level: 'Intermediate',
    academicTier: 'Undergraduate',
    instructor: { name: 'Dr. Alex Morgan', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    price: '₹3,499',
    students: '4,890',
    status: 'Published',
    updatedAt: 'Jun 09, 2025',
    thumbnailIcon: 'BarChart',
  },
  {
    id: 'crs-22',
    title: 'Computer Vision & CNNs: From Convolution Kernels to ResNet Architectures',
    description: 'Feature maps, pooling layers, skip connections, transfer learning, image segmentation, and object detection with YOLO.',
    category: 'Computer Vision',
    level: 'Advanced',
    academicTier: 'Undergraduate',
    instructor: { name: 'Anna Martinez', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80' },
    price: '₹4,499',
    students: '3,750',
    status: 'Published',
    updatedAt: 'Jun 10, 2025',
    thumbnailIcon: 'Eye',
  },

  // ── POSTGRADUATE (M.Tech / MSc) ──
  {
    id: 'crs-23',
    title: 'Advanced NLP: Sequence Models, Attention Mechanisms & BERT/GPT Pretraining',
    description: 'RNNs → LSTMs → Transformers evolution, masked language modeling, next-token prediction, sentence embeddings, and domain adaptation.',
    category: 'NLP',
    level: 'Advanced',
    academicTier: 'Postgraduate',
    instructor: { name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
    price: '₹6,999',
    students: '2,860',
    status: 'Published',
    updatedAt: 'Jun 11, 2025',
    thumbnailIcon: 'MessageSquare',
  },
  {
    id: 'crs-24',
    title: 'Reinforcement Learning: MDPs, Policy Gradients, PPO & Multi-Agent RL',
    description: 'Bellman equations, actor-critic architectures, proximal policy optimization, reward shaping, and multi-agent competitive/cooperative environments.',
    category: 'Reinforcement Learning',
    level: 'Advanced',
    academicTier: 'Postgraduate',
    instructor: { name: 'Dr. Alex Morgan', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    price: '₹7,999',
    students: '2,140',
    status: 'Published',
    updatedAt: 'Jun 12, 2025',
    thumbnailIcon: 'Layers',
  },

  // ── PHD & RESEARCH ──
  {
    id: 'crs-25',
    title: 'Neural Architecture Search, Mixture of Experts & Scaling Laws',
    description: 'NAS strategies (DARTS, ENAS), MoE sparse routing (Switch Transformer, Mixtral), Chinchilla scaling laws, and compute-optimal training.',
    category: 'Research',
    level: 'Advanced',
    academicTier: 'PhD & Research',
    instructor: { name: 'Dr. Alex Morgan', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    price: '₹9,999',
    students: '1,280',
    status: 'Published',
    updatedAt: 'Jun 13, 2025',
    thumbnailIcon: 'Layers',
  },
  {
    id: 'crs-26',
    title: 'AI Alignment, RLHF, DPO & Constitutional AI: Frontier Safety Research',
    description: 'Human preference learning, reward model training, direct preference optimization, red-teaming strategies, and mechanistic interpretability.',
    category: 'Research',
    level: 'Advanced',
    academicTier: 'PhD & Research',
    instructor: { name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
    price: '₹12,999',
    students: '890',
    status: 'Published',
    updatedAt: 'Jun 14, 2025',
    thumbnailIcon: 'BookOpen',
  },
];
