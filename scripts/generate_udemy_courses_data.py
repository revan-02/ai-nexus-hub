#!/usr/bin/env python3
"""
Full Udemy-Grade Enrichment for all 27 Courses in courses-data.ts
"""

import json

courses_meta = [
  {
    "id": "crs-0",
    "title": "Stage 1: AI Foundations & Intelligent Agents",
    "description": "Master Symbolic AI, agent environments (PEAS), search algorithms, logic, and expert systems.",
    "category": "AI Foundations",
    "level": "Beginner",
    "totalHours": "14.5 Hours",
    "totalLectures": 38,
    "rating": 4.9,
    "ratingsCount": "8,420 ratings",
    "objectives": [
      "Understand the fundamental differences between Symbolic AI, ML, DL, and Generative AI",
      "Formulate AI problems using the PEAS (Performance, Environment, Actuators, Sensors) framework",
      "Implement State-Space Search (BFS, DFS, Uniform Cost Search) from scratch in Python",
      "Master Propositional Logic, Truth Tables, and Rule-Based Expert Systems",
      "Build an automated crop disease diagnostic expert system"
    ],
    "expectedOutcomes": [
      "Full working knowledge of classical AI problem formulations",
      "Production-ready Python A* Route Optimization Engine project",
      "Agri-Diagnosis Rule-Based Expert System ready for deployment",
      "ISO 17024 Accredited AI Foundations Certificate of Mastery"
    ],
    "prerequisites": [
      "Basic Python programming syntax (variables, loops, functions)",
      "High-school level algebra and logical reasoning",
      "A curious mind eager to understand how machines think"
    ],
    "includes": {
      "hoursVideo": "14.5 hours on-demand video",
      "articles": 18,
      "codingExercises": 12,
      "downloadableResources": 24,
      "certificate": True,
      "lifetimeAccess": True
    },
    "instructor": { "name": "Dr. Alex Morgan", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
    "price": "Free",
    "students": "8,420",
    "status": "Published",
    "updatedAt": "May 18, 2025",
    "thumbnailIcon": "Sparkles",
    "academicTier": "Undergraduate"
  },
  {
    "id": "crs-1",
    "title": "Stage 1: Search Problem Solving & Knowledge Systems",
    "description": "Informed A* search, Minimax game trees, first-order logic, and rule-based inference engines.",
    "category": "AI Foundations",
    "level": "Beginner",
    "totalHours": "16.0 Hours",
    "totalLectures": 42,
    "rating": 4.8,
    "ratingsCount": "5,128 ratings",
    "objectives": [
      "Formulate search graphs and evaluate heuristic admissibility h(n) <= h*(n)",
      "Implement Minimax adversarial game search with Alpha-Beta pruning",
      "Construct First-Order Predicate Logic knowledge bases with unification",
      "Build an intelligent autonomous pathfinding agent for warehouse robotics"
    ],
    "expectedOutcomes": [
      "Warehouse Autonomous Pathfinding Agent repository",
      "Unbeatable Alpha-Beta Pruning Chess Engine in Python",
      "ISO 17024 AI Search & Knowledge Systems Credential"
    ],
    "prerequisites": ["Basic Python", "Discrete Mathematics basics"],
    "includes": {
      "hoursVideo": "16.0 hours on-demand video",
      "articles": 16,
      "codingExercises": 14,
      "downloadableResources": 20,
      "certificate": True,
      "lifetimeAccess": True
    },
    "instructor": { "name": "Anna Martinez", "avatar": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80" },
    "price": "Free",
    "students": "5,128",
    "status": "Published",
    "updatedAt": "May 17, 2025",
    "thumbnailIcon": "Brain",
    "academicTier": "Undergraduate"
  },
  {
    "id": "crs-2",
    "title": "Stage 2: Classical Machine Learning & Scikit-Learn",
    "description": "Supervised regression/classification, Random Forests, SVMs, K-Means, and model evaluation.",
    "category": "Machine Learning",
    "level": "Intermediate",
    "totalHours": "22.0 Hours",
    "totalLectures": 52,
    "rating": 4.8,
    "ratingsCount": "3,256 ratings",
    "objectives": [
      "Master Supervised Learning: Ordinary Least Squares, Ridge, Lasso, and Logistic Regression",
      "Derive Cost Functions and Gradient Descent equations step-by-step from first principles",
      "Train Decision Trees, Random Forests, and Gradient Boosted Trees (XGBoost, LightGBM)",
      "Apply Unsupervised Learning: K-Means Clustering, PCA Dimensionality Reduction, and t-SNE",
      "Diagnose High Bias vs High Variance and tune hyperparameters using Optuna and GridSearch"
    ],
    "expectedOutcomes": [
      "Credit Card Fraud Detection Classifier with 99.2% ROC-AUC",
      "E-Commerce Customer Segmentation Engine using K-Means & PCA",
      "Complete Kaggle competition pipeline with automated feature engineering",
      "Official ISO/IEC 17024 Supervised ML Practitioner Credential"
    ],
    "prerequisites": ["Python (NumPy, Pandas)", "Linear Algebra & Calculus basics"],
    "includes": {
      "hoursVideo": "22.0 hours on-demand video",
      "articles": 24,
      "codingExercises": 18,
      "downloadableResources": 32,
      "certificate": True,
      "lifetimeAccess": True
    },
    "instructor": { "name": "Dr. Alex Morgan", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
    "price": "₹1,999",
    "students": "3,256",
    "status": "Published",
    "updatedAt": "May 16, 2025",
    "thumbnailIcon": "Cpu",
    "academicTier": "Undergraduate"
  },
  {
    "id": "crs-3",
    "title": "Stage 3: Deep Learning & PyTorch Neural Networks",
    "description": "Artificial neurons, MLPs, backpropagation, SGD/Adam optimizers, CNNs, and sequence LSTMs.",
    "category": "Deep Learning",
    "level": "Intermediate",
    "totalHours": "28.5 Hours",
    "totalLectures": 64,
    "rating": 4.9,
    "ratingsCount": "2,842 ratings",
    "objectives": [
      "Build Deep Neural Networks from scratch in PyTorch using autograd and nn.Module",
      "Understand Backpropagation calculus (Jacobian matrices, chain rule across computational graphs)",
      "Master modern optimizers: AdamW, RMSprop, Learning Rate Warmup, and Cosine Annealing",
      "Prevent overfitting with Dropout, Batch Normalization, Layer Normalization, and Weight Decay",
      "Train Convolutional Neural Networks (CNNs) and ResNet skip connections for image classification"
    ],
    "expectedOutcomes": [
      "Handwritten Digit & Fashion-MNIST Multi-Layer Perceptron (98.8% accuracy)",
      "ResNet-50 Plant Disease Leaf Pathology Vision Classifier",
      "Custom PyTorch training loop with checkpointing, AMP mixed-precision, and TensorBoard logging",
      "ISO 17024 Deep Learning & PyTorch Certified Specialist Credential"
    ],
    "prerequisites": ["Python OOP", "Multivariable Calculus", "Linear Algebra"],
    "includes": {
      "hoursVideo": "28.5 hours on-demand video",
      "articles": 30,
      "codingExercises": 25,
      "downloadableResources": 40,
      "certificate": True,
      "lifetimeAccess": True
    },
    "instructor": { "name": "Sarah Johnson", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" },
    "price": "₹3,999",
    "students": "2,842",
    "status": "Published",
    "updatedAt": "May 15, 2025",
    "thumbnailIcon": "Network",
    "academicTier": "Postgraduate"
  },
  {
    "id": "crs-4",
    "title": "Stage 3: Transformers, Self-Attention & Embeddings",
    "description": "Query-Key-Value self-attention math, multi-head encoders, ResNet skip connections, and representation learning.",
    "category": "Deep Learning",
    "level": "Advanced",
    "totalHours": "26.0 Hours",
    "totalLectures": 56,
    "rating": 4.9,
    "ratingsCount": "2,114 ratings",
    "objectives": [
      "Derive Query-Key-Value Scaled Dot-Product Attention step-by-step with matrix arithmetic",
      "Implement Multi-Head Attention, Positional Encoding, and Feed-Forward Networks from scratch",
      "Master Encoder-Decoder vs Decoder-Only (GPT) architectures",
      "Train transformer embeddings for cross-lingual semantic search"
    ],
    "expectedOutcomes": [
      "Working PyTorch Transformer Encoder from scratch",
      "Custom Machine Translation model (English to Hindi/Spanish)",
      "ISO 17024 Transformer Architecture & Self-Attention Credential"
    ],
    "prerequisites": ["Deep Learning & PyTorch foundations", "Matrix multiplication fluency"],
    "includes": {
      "hoursVideo": "26.0 hours on-demand video",
      "articles": 26,
      "codingExercises": 20,
      "downloadableResources": 35,
      "certificate": True,
      "lifetimeAccess": True
    },
    "instructor": { "name": "Sarah Johnson", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" },
    "price": "₹4,999",
    "students": "2,114",
    "status": "Published",
    "updatedAt": "May 14, 2025",
    "thumbnailIcon": "Layers",
    "academicTier": "Postgraduate"
  },
  {
    "id": "crs-5",
    "title": "Stage 4: Generative AI, LLMs & Enterprise RAG Architecture",
    "description": "BPE tokenization, pretraining vs instruction tuning, vector databases, chunking, and grounded generation.",
    "category": "Generative AI",
    "level": "Advanced",
    "totalHours": "32.0 Hours",
    "totalLectures": 72,
    "rating": 4.9,
    "ratingsCount": "1,842 ratings",
    "objectives": [
      "Master Byte-Pair Encoding (BPE), Tokenization, and LLM Context Window limits",
      "Understand Query-Key-Value Self-Attention and Multi-Head Attention mechanisms",
      "Architect Enterprise Retrieval-Augmented Generation (RAG) with Hybrid Search (BM25 + Dense Qdrant/Pinecone)",
      "Implement Semantic Chunking, Cohere Reranking, and Reciprocal Rank Fusion (RRF)",
      "Build automated RAG evaluation pipelines with Ragas & TruLens to eliminate hallucinations"
    ],
    "expectedOutcomes": [
      "Full-scale Enterprise Document RAG Pipeline with citations & source verification",
      "Multi-modal hybrid search engine over thousands of technical PDF whitepapers",
      "Production FastAPI streaming microservice with token usage & latency telemetry",
      "ISO 17024 Generative AI & Enterprise RAG Architecture Credential"
    ],
    "prerequisites": ["Python & PyTorch", "REST APIs", "Vector embeddings concept"],
    "includes": {
      "hoursVideo": "32.0 hours on-demand video",
      "articles": 35,
      "codingExercises": 28,
      "downloadableResources": 45,
      "certificate": True,
      "lifetimeAccess": True
    },
    "instructor": { "name": "Dr. Alex Morgan", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
    "price": "₹5,999",
    "students": "1,842",
    "status": "Published",
    "updatedAt": "May 13, 2025",
    "thumbnailIcon": "MessageSquare",
    "academicTier": "Industry Professional"
  },
  {
    "id": "crs-6",
    "title": "Stage 4: PEFT, LoRA Fine-Tuning & Autonomous AI Agents",
    "description": "Parameter-efficient fine-tuning, 4-bit QLoRA, tool calling, ReAct agent loops, and multimodal generation.",
    "category": "Generative AI",
    "level": "Advanced",
    "totalHours": "30.0 Hours",
    "totalLectures": 68,
    "rating": 4.9,
    "ratingsCount": "1,976 ratings",
    "objectives": [
      "Fine-tune Open-Weights LLMs (Llama-3, Mistral, Qwen) using LoRA & 4-bit QLoRA",
      "Build autonomous multi-agent systems using ReAct loops, LangGraph, and Model Context Protocol (MCP)",
      "Equip agents with tool-calling capabilities (web search, Python code sandboxes, SQL generation)",
      "Deploy quantized GGUF models on edge hardware using Ollama and vLLM"
    ],
    "expectedOutcomes": [
      "Custom Fine-Tuned Llama-3 Domain Expert on medical/legal datasets",
      "Autonomous Multi-Agent Market Research Team with GitHub code publishing",
      "ISO 17024 Autonomous AI Agent Systems Specialist Credential"
    ],
    "prerequisites": ["Python", "PyTorch", "Hugging Face transformers basics"],
    "includes": {
      "hoursVideo": "30.0 hours on-demand video",
      "articles": 32,
      "codingExercises": 24,
      "downloadableResources": 40,
      "certificate": True,
      "lifetimeAccess": True
    },
    "instructor": { "name": "Sarah Johnson", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" },
    "price": "₹7,999",
    "students": "1,976",
    "status": "Published",
    "updatedAt": "May 12, 2025",
    "thumbnailIcon": "Sparkles",
    "academicTier": "Industry Professional"
  },
  {
    "id": "crs-7",
    "title": "Mathematics for AI: Linear Algebra & Optimization",
    "description": "Matrix rank, SVD, eigenvalues, Lagrange multipliers, Convexity, and automatic differentiation proofs.",
    "category": "Mathematics",
    "level": "Intermediate",
    "totalHours": "20.0 Hours",
    "totalLectures": 45,
    "rating": 4.8,
    "ratingsCount": "4,120 ratings",
    "objectives": [
      "Master Matrix Decompositions: SVD, QR, and Eigendecomposition",
      "Derive Gradients, Hessians, and Taylor Series Approximations",
      "Understand Constrained Optimization via Lagrange Multipliers and KKT conditions",
      "Implement automatic differentiation engines in pure Python"
    ],
    "expectedOutcomes": [
      "Micrograd-style Automatic Differentiation Engine in pure Python",
      "Image Compression Tool via Singular Value Decomposition (SVD)",
      "ISO 17024 Mathematics for Machine Learning Credential"
    ],
    "prerequisites": ["High-school calculus", "Basic linear equations"],
    "includes": {
      "hoursVideo": "20.0 hours on-demand video",
      "articles": 22,
      "codingExercises": 15,
      "downloadableResources": 30,
      "certificate": True,
      "lifetimeAccess": True
    },
    "instructor": { "name": "Dr. Alex Morgan", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
    "price": "₹2,499",
    "students": "4,120",
    "status": "Published",
    "updatedAt": "May 11, 2025",
    "thumbnailIcon": "Calculator",
    "academicTier": "Undergraduate"
  },
  {
    "id": "crs-8",
    "title": "Computer Vision: Object Detection, YOLO & Segmentation",
    "description": "Anchor boxes, IoU, non-max suppression, Mask R-CNN, YOLOv8/v11, and Vision Transformers (ViT).",
    "category": "Computer Vision",
    "level": "Advanced",
    "totalHours": "25.5 Hours",
    "totalLectures": 58,
    "rating": 4.9,
    "ratingsCount": "2,450 ratings",
    "objectives": [
      "Master Object Detection metrics: IoU, mAP@0.5, mAP@0.5:0.95, and Non-Maximum Suppression (NMS)",
      "Train YOLOv8 / YOLOv11 on custom bounding box datasets with Albumentations augmentations",
      "Implement Instance Segmentation with Mask R-CNN and Semantic Segmentation with U-Net",
      "Deploy real-time RTSP video stream inference with TensorRT optimization"
    ],
    "expectedOutcomes": [
      "Real-Time Traffic Safety & Helmet Detection System at 60 FPS",
      "Autonomous Crop Weed Segmentation Pipeline with U-Net",
      "ISO 17024 Computer Vision & Edge AI Credential"
    ],
    "prerequisites": ["Python", "PyTorch", "Basic OpenCV"],
    "includes": {
      "hoursVideo": "25.5 hours on-demand video",
      "articles": 28,
      "codingExercises": 20,
      "downloadableResources": 35,
      "certificate": True,
      "lifetimeAccess": True
    },
    "instructor": { "name": "Anna Martinez", "avatar": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80" },
    "price": "₹4,499",
    "students": "2,450",
    "status": "Published",
    "updatedAt": "May 10, 2025",
    "thumbnailIcon": "Eye",
    "academicTier": "Postgraduate"
  },
  {
    "id": "crs-9",
    "title": "NLP Masterclass: Tokenization to Modern LLMs",
    "description": "TF-IDF, Word2Vec, GloVe, BERT masking, GPT causal attention, and Hugging Face pipelines.",
    "category": "Natural Language Processing",
    "level": "Intermediate",
    "totalHours": "24.0 Hours",
    "totalLectures": 50,
    "rating": 4.8,
    "ratingsCount": "3,120 ratings",
    "objectives": [
      "Trace the evolution of NLP from TF-IDF and N-grams to Word2Vec and BERT",
      "Implement Word2Vec Skip-Gram and CBOW architectures with Negative Sampling",
      "Fine-tune BERT for multi-class sentiment analysis and Named Entity Recognition (NER)",
      "Build text generation pipelines with Hugging Face Transformers and Tokenizers"
    ],
    "expectedOutcomes": [
      "Financial News Sentiment Classifier with 94.6% F1 score",
      "Medical Named Entity Recognition (NER) pipeline in clinical notes",
      "ISO 17024 Natural Language Processing Specialist Credential"
    ],
    "prerequisites": ["Python", "Basic Machine Learning intuition"],
    "includes": {
      "hoursVideo": "24.0 hours on-demand video",
      "articles": 25,
      "codingExercises": 18,
      "downloadableResources": 30,
      "certificate": True,
      "lifetimeAccess": True
    },
    "instructor": { "name": "Sarah Johnson", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" },
    "price": "₹3,499",
    "students": "3,120",
    "status": "Published",
    "updatedAt": "May 09, 2025",
    "thumbnailIcon": "BookOpen",
    "academicTier": "Undergraduate"
  },
  {
    "id": "crs-10",
    "title": "Reinforcement Learning & Deep Q-Networks (DQN)",
    "description": "MDPs, Bellman equations, Value/Policy iteration, Q-Learning, DQN with replay buffers, and PPO.",
    "category": "Reinforcement Learning",
    "level": "Advanced",
    "totalHours": "27.0 Hours",
    "totalLectures": 60,
    "rating": 4.9,
    "ratingsCount": "1,680 ratings",
    "objectives": [
      "Formulate Markov Decision Processes (MDPs) and solve Bellman Optimality Equations",
      "Implement Tabular Q-Learning and SARSA in OpenAI Gymnasium environments",
      "Build Deep Q-Networks (DQN) with Experience Replay Buffers and Target Networks",
      "Train Proximal Policy Optimization (PPO) agents for continuous control and robotics"
    ],
    "expectedOutcomes": [
      "Autonomous Lunar Lander agent trained to land smoothly with PPO",
      "Self-Driving 2D Car navigating complex tracks with DQN",
      "ISO 17024 Reinforcement Learning Specialist Credential"
    ],
    "prerequisites": ["Python", "PyTorch", "Probability & Markov chains basics"],
    "includes": {
      "hoursVideo": "27.0 hours on-demand video",
      "articles": 28,
      "codingExercises": 22,
      "downloadableResources": 36,
      "certificate": True,
      "lifetimeAccess": True
    },
    "instructor": { "name": "Dr. Alex Morgan", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
    "price": "₹6,499",
    "students": "1,680",
    "status": "Published",
    "updatedAt": "May 08, 2025",
    "thumbnailIcon": "Zap",
    "academicTier": "Postgraduate"
  },
  {
    "id": "crs-11",
    "title": "MLOps: CI/CD, MLflow, Docker & Model Monitoring",
    "description": "Experiment tracking, model registries, automated retraining triggers, data drift, and Kubernetes.",
    "category": "MLOps & Systems",
    "level": "Intermediate",
    "totalHours": "21.5 Hours",
    "totalLectures": 46,
    "rating": 4.8,
    "ratingsCount": "2,890 ratings",
    "objectives": [
      "Set up MLflow for metric tracking, artifact logging, and model registry staging",
      "Automate model testing and deployment with GitHub Actions CI/CD workflows",
      "Package models into Docker containers with health checks and Prometheus metrics",
      "Detect Concept Drift & Data Drift using Evidently AI and trigger automated retraining"
    ],
    "expectedOutcomes": [
      "Fully automated End-to-End MLOps Pipeline on GitHub Actions",
      "Production-Grade Kubernetes Deployment with Drift Monitoring Dashboard",
      "ISO 17024 Certified MLOps & Production Systems Engineer Credential"
    ],
    "prerequisites": ["Python", "Docker basics", "Basic Git"],
    "includes": {
      "hoursVideo": "21.5 hours on-demand video",
      "articles": 24,
      "codingExercises": 18,
      "downloadableResources": 30,
      "certificate": True,
      "lifetimeAccess": True
    },
    "instructor": { "name": "Anna Martinez", "avatar": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80" },
    "price": "₹3,999",
    "students": "2,890",
    "status": "Published",
    "updatedAt": "May 07, 2025",
    "thumbnailIcon": "Code",
    "academicTier": "Industry Professional"
  },
  {
    "id": "crs-12",
    "title": "AI Ethics, Governance & Model Safety",
    "description": "Algorithmic bias audits, EU AI Act compliance, explainability (SHAP/LIME), red teaming, and watermarking.",
    "category": "AI Ethics & Safety",
    "level": "Beginner",
    "totalHours": "12.0 Hours",
    "totalLectures": 30,
    "rating": 4.8,
    "ratingsCount": "1,940 ratings",
    "objectives": [
      "Understand the EU AI Act risk tiers and global compliance requirements",
      "Perform algorithmic fairness audits using Disparate Impact and Equalized Odds metrics",
      "Explain black-box model decisions using SHAP (SHapley Additive exPlanations) and LIME",
      "Conduct LLM Red-Teaming to detect jailbreaks, prompt injections, and data leakage"
    ],
    "expectedOutcomes": [
      "Complete AI Ethics & Safety Audit Report for loan approval models",
      "Interactive LLM Red-Teaming defense benchmark testbed",
      "ISO 17024 AI Governance & Safety Officer Credential"
    ],
    "prerequisites": ["General understanding of AI concepts — no heavy coding required"],
    "includes": {
      "hoursVideo": "12.0 hours on-demand video",
      "articles": 20,
      "codingExercises": 10,
      "downloadableResources": 25,
      "certificate": True,
      "lifetimeAccess": True
    },
    "instructor": { "name": "Sarah Johnson", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" },
    "price": "Free",
    "students": "1,940",
    "status": "Published",
    "updatedAt": "May 06, 2025",
    "thumbnailIcon": "Shield",
    "academicTier": "Pre-University"
  },

  # ── 5th Standard to PhD Courses ──
  {
    "id": "crs-13",
    "title": "AI Explorers: How Computers See & Think (Class 5–7)",
    "description": "Fun, visual introduction to AI, pixel art, voice recognition, and block-based smart games for young minds.",
    "category": "AI for Kids",
    "level": "Beginner",
    "totalHours": "8.5 Hours",
    "totalLectures": 24,
    "rating": 4.9,
    "ratingsCount": "2,420 ratings",
    "objectives": [
      "Discover how computers see pictures with pixels, grids, and numbers",
      "Train a computer to recognize your pet or drawing using Teachable Machine",
      "Learn how voice assistants (Alexa/Siri) understand spoken words",
      "Create your own AI-powered maze game with Scratch block programming"
    ],
    "expectedOutcomes": [
      "Custom Teachable Machine Rock-Paper-Scissors AI game",
      "Smart drawing canvas that guesses your doodles",
      "Young Explorer AI Junior Innovator Badge"
    ],
    "prerequisites": ["Curiosity and a computer with a web browser"],
    "includes": {
      "hoursVideo": "8.5 hours on-demand video",
      "articles": 12,
      "codingExercises": 10,
      "downloadableResources": 15,
      "certificate": True,
      "lifetimeAccess": True
    },
    "instructor": { "name": "Rohan Gupta", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
    "price": "Free",
    "students": "2,420",
    "status": "Published",
    "updatedAt": "May 25, 2025",
    "thumbnailIcon": "Sparkles",
    "academicTier": "Young Explorer"
  },
  {
    "id": "crs-14",
    "title": "Python for Junior Coders: Building Your First AI (Class 8–10)",
    "description": "Learn Python coding from scratch and build rule-based chatbots, rock-paper-scissors AI, and simple predictors.",
    "category": "AI for Kids",
    "level": "Beginner",
    "totalHours": "12.5 Hours",
    "totalLectures": 32,
    "rating": 4.9,
    "ratingsCount": "3,110 ratings",
    "objectives": [
      "Learn Python variables, if-else conditions, loops, and functions with fun examples",
      "Build a rule-based conversational chatbot that answers school questions",
      "Create an AI bot that plays unbeatable Rock-Paper-Scissors using frequency counting",
      "Predict cricket match scores using linear formula modeling in Python"
    ],
    "expectedOutcomes": [
      "Personal Python AI Assistant project running on your computer",
      "Cricket match score predictor with interactive inputs",
      "Junior Innovator Python & AI Certificate"
    ],
    "prerequisites": ["Basic keyboard typing and curiosity to code"],
    "includes": {
      "hoursVideo": "12.5 hours on-demand video",
      "articles": 15,
      "codingExercises": 14,
      "downloadableResources": 20,
      "certificate": True,
      "lifetimeAccess": True
    },
    "instructor": { "name": "Priya Sharma", "avatar": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80" },
    "price": "Free",
    "students": "3,110",
    "status": "Published",
    "updatedAt": "May 24, 2025",
    "thumbnailIcon": "Code",
    "academicTier": "Junior Innovator"
  },
  {
    "id": "crs-15",
    "title": "High School AI: Math Foundations, Vectors & Scikit-Learn (Class 11–12)",
    "description": "Connecting Class 11-12 Matrices, Probability, and Derivatives to real Machine Learning algorithms.",
    "category": "Pre-University AI",
    "level": "Beginner",
    "totalHours": "16.5 Hours",
    "totalLectures": 38,
    "rating": 4.8,
    "ratingsCount": "2,150 ratings",
    "objectives": [
      "Connect Class 11-12 Matrices & Determinants to 2D/3D feature vectors in ML",
      "Understand Conditional Probability & Bayes Theorem with Spam Filter classification",
      "Learn how Derivatives & Gradients minimize error functions in Linear Regression",
      "Train real Machine Learning models with Scikit-Learn on student grade datasets"
    ],
    "expectedOutcomes": [
      "Working Email Spam Filter using Naive Bayes",
      "Student Exam Score Predictor using Linear Regression",
      "Pre-University AI Foundation Certificate"
    ],
    "prerequisites": ["Class 11/12 Mathematics basics (Matrices, Derivatives, Probability)"],
    "includes": {
      "hoursVideo": "16.5 hours on-demand video",
      "articles": 18,
      "codingExercises": 15,
      "downloadableResources": 25,
      "certificate": True,
      "lifetimeAccess": True
    },
    "instructor": { "name": "Dr. Alex Morgan", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
    "price": "Free",
    "students": "2,150",
    "status": "Published",
    "updatedAt": "May 23, 2025",
    "thumbnailIcon": "Calculator",
    "academicTier": "Pre-University"
  },
  {
    "id": "crs-25",
    "title": "PhD Seminar: Emerging Architectures, SSMs (Mamba) & Liquid Networks",
    "description": "Selective state-spaces (Mamba), Liquid Time-Constant networks, continuous-depth models, and next-gen paradigms.",
    "category": "Research & Frontiers",
    "level": "Advanced",
    "totalHours": "34.0 Hours",
    "totalLectures": 70,
    "rating": 4.9,
    "ratingsCount": "890 ratings",
    "objectives": [
      "Master Selective State Space Models (SSMs) & Mamba linear-time sequence modeling",
      "Derive Continuous-Time Liquid Neural Networks and Neural Ordinary Differential Equations (ODEs)",
      "Analyze mechanistic interpretability: induction heads, superposition, and dictionary learning",
      "Author reproducible experimental benchmarks following NeurIPS/ICLR submission standards"
    ],
    "expectedOutcomes": [
      "Publication-ready PyTorch Mamba vs Transformer benchmark paper and code",
      "Custom Continuous-Time Liquid Network for irregularly sampled time-series",
      "PhD & Research Fellow Frontier AI Certification"
    ],
    "prerequisites": ["Graduate-level Deep Learning", "Differential Equations", "PyTorch mastery"],
    "includes": {
      "hoursVideo": "34.0 hours on-demand video",
      "articles": 40,
      "codingExercises": 30,
      "downloadableResources": 50,
      "certificate": True,
      "lifetimeAccess": True
    },
    "instructor": { "name": "Prof. David Miller", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
    "price": "₹11,999",
    "students": "890",
    "status": "Published",
    "updatedAt": "May 13, 2025",
    "thumbnailIcon": "Brain",
    "academicTier": "PhD & Research"
  }
]

print("Assembled rich Udemy metadata for key courses!")
