export type ProjectLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type ProjectStatus = 'Published' | 'Draft' | 'In Review' | 'Archived';

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  category: string;
  level: ProjectLevel;
  technologies: string[];
  author: {
    name: string;
    avatar: string;
  };
  status: ProjectStatus;
  views: string;
  updatedAt: string;
  thumbnailIcon: string;
}

export const mockProjectsMetrics = [
  { id: 'total', title: 'Total Projects', value: '389', change: '14.3%', trend: 'up', period: 'vs last month', variant: 'purple' },
  { id: 'published', title: 'Published', value: '213', change: '54.8%', trend: 'flat', period: 'of total', variant: 'blue' },
  { id: 'drafts', title: 'Drafts', value: '96', change: '24.7%', trend: 'flat', period: 'of total', variant: 'orange' },
  { id: 'in-review', title: 'In Review', value: '42', change: '10.8%', trend: 'flat', period: 'of total', variant: 'green' },
  { id: 'archived', title: 'Archived', value: '38', change: '9.7%', trend: 'flat', period: 'of total', variant: 'red' },
  { id: 'views', title: 'Total Views (This Month)', value: '56.2K', change: '19.6%', trend: 'up', period: 'vs last month', variant: 'cyan' },
];

export const mockProjectsList: ProjectItem[] = [
  {
    id: 'prj-1',
    name: 'E-Commerce Dashboard',
    description: 'Responsive admin dashboard with real-time analytics',
    category: 'Web Development',
    level: 'Intermediate',
    technologies: ['React', 'TypeScript', 'Tailwind'],
    author: { name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
    status: 'Published',
    views: '4.2K',
    updatedAt: 'May 18, 2025',
    thumbnailIcon: 'Layout',
  },
  {
    id: 'prj-2',
    name: 'AI Chatbot with RAG',
    description: 'Build a chatbot using LLM embeddings and vector DB',
    category: 'AI / ML',
    level: 'Advanced',
    technologies: ['Python', 'LangChain', 'Pinecone'],
    author: { name: 'Dr. Alex Morgan', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    status: 'Published',
    views: '3.8K',
    updatedAt: 'May 17, 2025',
    thumbnailIcon: 'Bot',
  },
  {
    id: 'prj-3',
    name: 'Real-time Chat Application',
    description: 'Socket.io based chat app with rooms and auth',
    category: 'Web Development',
    level: 'Intermediate',
    technologies: ['Node', 'React', 'Socket.io'],
    author: { name: 'Michael Smith', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80' },
    status: 'In Review',
    views: '2.9K',
    updatedAt: 'May 16, 2025',
    thumbnailIcon: 'MessageSquare',
  },
  {
    id: 'prj-4',
    name: 'Stock Price Predictor',
    description: 'ML model to predict stock prices using LSTM',
    category: 'Data Science',
    level: 'Advanced',
    technologies: ['Python', 'TensorFlow', 'Keras'],
    author: { name: 'Emily Davis', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80' },
    status: 'Published',
    views: '2.6K',
    updatedAt: 'May 15, 2025',
    thumbnailIcon: 'TrendingUp',
  },
  {
    id: 'prj-5',
    name: 'Fitness Tracker App',
    description: 'Cross-platform fitness tracking mobile application',
    category: 'Mobile Development',
    level: 'Intermediate',
    technologies: ['Flutter', 'Dart', 'Firebase'],
    author: { name: 'David Wilson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    status: 'Draft',
    views: '1.8K',
    updatedAt: 'May 14, 2025',
    thumbnailIcon: 'Smartphone',
  },
  {
    id: 'prj-6',
    name: 'Interactive Data Visualizer',
    description: 'Visualize CSV/Excel data with multiple charts',
    category: 'Data Visualization',
    level: 'Beginner',
    technologies: ['React', 'D3.js', 'Tailwind'],
    author: { name: 'Olivia Martinez', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
    status: 'Published',
    views: '1.6K',
    updatedAt: 'May 13, 2025',
    thumbnailIcon: 'BarChart',
  },
  {
    id: 'prj-7',
    name: 'NFT Marketplace',
    description: 'Mint, buy and sell NFTs on Ethereum testnet',
    category: 'Blockchain',
    level: 'Advanced',
    technologies: ['Solidity', 'Ethers.js', 'Next.js'],
    author: { name: 'Daniel Brown', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
    status: 'In Review',
    views: '1.5K',
    updatedAt: 'May 12, 2025',
    thumbnailIcon: 'Coins',
  },
  {
    id: 'prj-8',
    name: 'IoT Device Monitor',
    description: 'Monitor IoT sensors data in real-time',
    category: 'IoT',
    level: 'Intermediate',
    technologies: ['Node', 'MQTT', 'React'],
    author: { name: 'Jessica Lee', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' },
    status: 'Draft',
    views: '1.2K',
    updatedAt: 'May 11, 2025',
    thumbnailIcon: 'Cpu',
  },
];
