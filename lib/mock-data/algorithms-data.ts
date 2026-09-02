export type AlgorithmComplexity = 'Easy' | 'Medium' | 'Hard';
export type AlgorithmStatus = 'Published' | 'Draft' | 'In Review' | 'Deprecated';

export interface AlgorithmItem {
  id: string;
  name: string;
  description: string;
  category: string;
  complexity: AlgorithmComplexity;
  topic: string;
  implementationsCount: number;
  languages: string[];
  status: AlgorithmStatus;
  updatedAt: string;
  iconName: string;
}

export const mockAlgorithmsMetrics = [
  { id: 'total', title: 'Total Algorithms', value: '512', change: '15.4%', trend: 'up', period: 'vs last month', variant: 'purple' },
  { id: 'published', title: 'Published', value: '376', change: '73.4%', trend: 'flat', period: 'of total', variant: 'blue' },
  { id: 'drafts', title: 'Drafts', value: '68', change: '13.3%', trend: 'flat', period: 'of total', variant: 'orange' },
  { id: 'in-review', title: 'In Review', value: '28', change: '5.5%', trend: 'flat', period: 'of total', variant: 'green' },
  { id: 'deprecated', title: 'Deprecated', value: '8', change: '1.6%', trend: 'flat', period: 'of total', variant: 'red' },
  { id: 'implementations', title: 'Total Implementations', value: '1,842', change: '18.7%', trend: 'up', period: 'vs last month', variant: 'cyan' },
];

export const mockAlgorithmsList: AlgorithmItem[] = [
  {
    id: 'alg-1',
    name: 'A* Search & Heuristic Pathfinding (Stage 1)',
    description: 'Informed search algorithm calculating f(n) = g(n) + h(n) for optimal route planning.',
    category: 'AI Foundations',
    complexity: 'Medium',
    topic: 'Symbolic AI & Search',
    implementationsCount: 8,
    languages: ['Python', 'C++', 'Java'],
    status: 'Published',
    updatedAt: 'May 18, 2025',
    iconName: 'Network',
  },
  {
    id: 'alg-2',
    name: 'Linear & Logistic Regression (Stage 2)',
    description: 'Supervised statistical modeling for continuous prediction and binary classification.',
    category: 'Machine Learning',
    complexity: 'Easy',
    topic: 'Supervised ML',
    implementationsCount: 12,
    languages: ['Python', 'Scikit-Learn', 'R'],
    status: 'Published',
    updatedAt: 'May 17, 2025',
    iconName: 'TrendingUp',
  },
  {
    id: 'alg-3',
    name: 'Decision Trees & Random Forest Ensembles (Stage 2)',
    description: 'Tree-based ensemble method calculating Gini Impurity and Entropy to reduce variance.',
    category: 'Machine Learning',
    complexity: 'Medium',
    topic: 'Classification',
    implementationsCount: 10,
    languages: ['Python', 'R', 'Scala'],
    status: 'Published',
    updatedAt: 'May 16, 2025',
    iconName: 'GitFork',
  },
  {
    id: 'alg-4',
    name: 'K-Means & PCA Dimensionality Reduction (Stage 2)',
    description: 'Unsupervised centroid clustering combined with orthogonal eigenvector projection.',
    category: 'Machine Learning',
    complexity: 'Medium',
    topic: 'Unsupervised ML',
    implementationsCount: 9,
    languages: ['Python', 'NumPy', 'Julia'],
    status: 'Published',
    updatedAt: 'May 15, 2025',
    iconName: 'Boxes',
  },
  {
    id: 'alg-5',
    name: 'Multi-Layer Perceptron & Backpropagation (Stage 3)',
    description: 'Feedforward artificial neural network trained via partial derivative chain rule gradients.',
    category: 'Deep Learning',
    complexity: 'Medium',
    topic: 'Neural Networks',
    implementationsCount: 11,
    languages: ['Python', 'PyTorch', 'TensorFlow'],
    status: 'Published',
    updatedAt: 'May 14, 2025',
    iconName: 'Brain',
  },
  {
    id: 'alg-6',
    name: 'Convolutional Neural Networks & ResNet (Stage 3)',
    description: 'Spatial convolution filters with residual skip connections for computer vision recognition.',
    category: 'Deep Learning',
    complexity: 'Hard',
    topic: 'Computer Vision',
    implementationsCount: 9,
    languages: ['Python', 'PyTorch', 'C++'],
    status: 'Published',
    updatedAt: 'May 13, 2025',
    iconName: 'Eye',
  },
  {
    id: 'alg-7',
    name: 'Transformer Scaled Dot-Product Self-Attention (Stage 3)',
    description: 'Core LLM mechanism calculating Softmax((Q · K^T) / sqrt(d_k)) · V matrix weights.',
    category: 'Deep Learning',
    complexity: 'Hard',
    topic: 'Transformers',
    implementationsCount: 15,
    languages: ['Python', 'PyTorch', 'Transformers'],
    status: 'Published',
    updatedAt: 'May 12, 2025',
    iconName: 'Layers',
  },
  {
    id: 'alg-8',
    name: 'Retrieval-Augmented Generation & Vector DB (Stage 4)',
    description: 'Grounding LLMs using dense vector embeddings and HNSW indexed similarity retrieval.',
    category: 'Generative AI',
    complexity: 'Hard',
    topic: 'RAG & Vector DB',
    implementationsCount: 14,
    languages: ['Python', 'LangChain', 'FAISS', 'Qdrant'],
    status: 'Published',
    updatedAt: 'May 11, 2025',
    iconName: 'MessageSquare',
  },
  {
    id: 'alg-9',
    name: 'ReAct Agent Framework & Autonomous Tool Calling (Stage 4)',
    description: 'Interleaved Reason + Act loops allowing LLMs to parse, query APIs, and execute tools.',
    category: 'Generative AI',
    complexity: 'Hard',
    topic: 'AI Agents',
    implementationsCount: 8,
    languages: ['Python', 'LangChain', 'FastAPI'],
    status: 'Published',
    updatedAt: 'May 10, 2025',
    iconName: 'Zap',
  },
];
