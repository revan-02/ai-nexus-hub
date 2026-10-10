export interface PedagogyGuide {
  mentorTip: string;
  focusAreas: string[];
  practicalLab: string;
}

export const TIER_PEDAGOGY_GUIDES: Record<string, PedagogyGuide> = {
  'middle-school': {
    mentorTip: 'Welcome Young Creator (Grades 5–8)! We begin with zero math or coding. Discover how robots see, how Siri understands your voice, and how AI agents play games.',
    focusAreas: ['Visual Logic & Patterns', 'Scratch Robotics Blocks', 'Teachable Machine Vision', 'Ethics of AI Toys'],
    practicalLab: 'Rock-Paper-Scissors Computer Vision Referee'
  },
  'high-school': {
    mentorTip: 'Welcome High School Innovator (Grades 9–10)! Discover the magic of Python syntax, coordinate geometry charts, and building your very first handwritten digit classifier.',
    focusAreas: ['Python Fundamentals', 'Coordinate Plots & Best-Fit Lines', 'Probability Basics', 'MNIST Digit Recognizer'],
    practicalLab: 'Cricket Match Score Predictor & Handwritten Digit Sorter'
  },
  'pre-university': {
    mentorTip: 'Welcome Pre-University Scholar (Class 11–12 / PUC)! Master derivatives, vectors, and matrices — the true mathematical engine behind every neural network gradient step.',
    focusAreas: ['Calculus & Rates of Change', 'Linear Algebra & Matrices', 'Data Structures (Trees & Graphs)', 'Scikit-Learn Regression'],
    practicalLab: 'Gradient Descent Marble Simulation & House Price Predictor'
  },
  'undergraduate': {
    mentorTip: 'Engineering Undergraduates (B.Tech / B.E.): Master supervised ML, manual backprop derivations, ResNet vision, and rigorous algorithmic proofs.',
    focusAreas: ['Supervised & Unsupervised ML', 'PyTorch Neural Networks', 'CNNs & ResNet Residuals', 'Algorithmic Problem Solving'],
    practicalLab: 'Vernacular Crop Disease Classifier & Fraud Detection with SMOTE'
  },
  'postgraduate': {
    mentorTip: 'Postgraduate Scholars (M.Tech / MSc): Deep dive into Multi-Head Attention, Reinforcement Learning (PPO), and distributed multi-GPU training with DeepSpeed.',
    focusAreas: ['Transformers & Self-Attention', 'Reinforcement Learning (PPO/DQN)', 'Distributed Training (ZeRO/FSDP)', 'Research Methodology & Ablations'],
    practicalLab: 'Multi-GPU PyTorch Training Pipeline & Custom Tokenizer'
  },
  'industry-professional': {
    mentorTip: 'Working Engineers (0–4 yrs): Architect production RAG systems with vLLM, continuous batching, 4-bit QLoRA fine-tuning, and multi-agent LangGraph workflows.',
    focusAreas: ['Production RAG & Vector DBs', 'QLoRA & 4-bit Quantization', 'vLLM / TensorRT Inference', 'LangGraph Multi-Agent Workflows'],
    practicalLab: 'High-Throughput Enterprise Financial Copilot & Custom MCP Agent'
  },
  'phd-research': {
    mentorTip: 'Frontier AI Researchers: Pioneer novel sparse Mixture of Experts (MoE), Mamba selective state spaces, and custom hardware-aware Triton GPU kernels.',
    focusAreas: ['Sparse MoE & Routing (DeepSeek)', 'Selective State Spaces (Mamba)', 'Scaling Laws & Chinchilla Frontiers', 'Custom Triton / CUDA Attention Kernels'],
    practicalLab: 'FlashAttention-3 SRAM Tiling & DeepSeek-R1 Emergent Reasoning'
  }
};
