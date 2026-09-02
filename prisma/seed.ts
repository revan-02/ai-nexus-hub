import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL!;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  const defaultPassword = await bcrypt.hash('password123', 10);

  // ─── 1. Seed Users ───
  const users = [
    { id: 'usr-1', name: 'Sarah Johnson', username: 'sarah_johnson', email: 'sarah@nexus.ai', password: defaultPassword, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', role: 'Admin' as const, organization: 'Nexus AI Corp', status: 'Active' as const, emailVerified: true },
    { id: 'usr-2', name: 'Dr. Alex Morgan', username: 'alex_morgan', email: 'alex@nexus.ai', password: defaultPassword, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', role: 'Instructor' as const, organization: 'AI Research Lab', status: 'Active' as const, emailVerified: true },
    { id: 'usr-3', name: 'James Wilson', username: 'james_wilson', email: 'james@nexus.ai', password: defaultPassword, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', role: 'Manager' as const, organization: 'Nexus AI Corp', status: 'Active' as const, emailVerified: true },
    { id: 'usr-4', name: 'Emily Chen', username: 'emily_chen', email: 'emily@nexus.ai', password: defaultPassword, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80', role: 'Editor' as const, organization: 'DataScience Inc', status: 'Active' as const, emailVerified: true },
    { id: 'usr-5', name: 'Michael Brown', username: 'michael_brown', email: 'michael@nexus.ai', password: defaultPassword, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', role: 'Analyst' as const, organization: 'ML Ventures', status: 'Pending' as const, emailVerified: false },
    { id: 'usr-6', name: 'Lisa Wang', username: 'lisa_wang', email: 'lisa@nexus.ai', password: defaultPassword, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', role: 'Moderator' as const, organization: 'AI Academy', status: 'Active' as const, emailVerified: true },
    { id: 'usr-7', name: 'David Kim', username: 'david_kim', email: 'david@nexus.ai', password: defaultPassword, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', role: 'User' as const, organization: 'Tech Startup', status: 'Active' as const, emailVerified: true },
    { id: 'usr-8', name: 'Anna Martinez', username: 'anna_martinez', email: 'anna@nexus.ai', password: defaultPassword, avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80', role: 'Instructor' as const, organization: 'University of AI', status: 'Active' as const, emailVerified: true },
    { id: 'usr-9', name: 'John Doe', username: 'johndoe', email: 'john.doe@example.com', password: defaultPassword, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', role: 'Admin' as const, organization: 'AI Research Lab', status: 'Active' as const, emailVerified: true },
    { id: 'usr-10', name: 'Emma Johnson', username: 'emmaj', email: 'emma.johnson@example.com', password: defaultPassword, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', role: 'User' as const, organization: 'Data Science Team', status: 'Active' as const, emailVerified: true },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: user,
      create: user,
    });
  }
  console.log(`  ✅ ${users.length} Users seeded`);

  // ─── 2. Seed Courses ───
  const courses = [
    { id: 'crs-0', title: 'AI for School Kids & Young Creators (Grades 5–8)', description: 'Zero math or coding needed! Discover how robots, Siri, and ChatGPT work through fun visual games and animations.', category: 'K-12 & School', level: 'Beginner' as const, price: 'Free', students: '8,420', status: 'Published' as const, thumbnailIcon: 'Sparkles', instructorId: 'usr-2' },
    { id: 'crs-0b', title: 'Visual AI & Scratch Robotics (Grades 9–10)', description: 'Block-based programming, computer vision games, and voice recognition for middle/high schoolers.', category: 'K-12 & School', level: 'Beginner' as const, price: 'Free', students: '6,140', status: 'Published' as const, thumbnailIcon: 'Sparkles', instructorId: 'usr-8' },
    { id: 'crs-1', title: 'Python & Math Foundations for AI (Grades 11–12)', description: 'Learn Python code, data structures, vectors, and plotting charts step-by-step.', category: 'Basic Programming', level: 'Beginner' as const, price: 'Free', students: '5,128', status: 'Published' as const, thumbnailIcon: 'Code', instructorId: 'usr-8' },
    { id: 'crs-1b', title: 'Exploratory Data Science & Statistics', description: 'Analyze real datasets with Pandas, NumPy, and statistical hypothesis testing.', category: 'Basic Data Science', level: 'Beginner' as const, price: '₹999', students: '3,890', status: 'Published' as const, thumbnailIcon: 'Database', instructorId: 'usr-4' },
    { id: 'crs-2', title: 'Classical Machine Learning & Scikit-Learn (Undergrad)', description: 'Build prediction models using Linear Regression, Decision Trees, SVMs, and Random Forests.', category: 'Machine Learning', level: 'Intermediate' as const, price: '₹1,999', students: '3,256', status: 'Published' as const, thumbnailIcon: 'Brain', instructorId: 'usr-2' },
    { id: 'crs-3', title: 'Deep Learning & Neural Networks with PyTorch', description: 'Train multi-layer perceptrons, CNNs for computer vision, and LSTMs for time series.', category: 'Deep Learning', level: 'Intermediate' as const, price: '₹3,999', students: '2,842', status: 'Published' as const, thumbnailIcon: 'Network', instructorId: 'usr-1' },
    { id: 'crs-4', title: 'Generative AI, LLMs & Enterprise RAG Architecture', description: 'Master Transformers, Self-Attention math, Vector Databases (Pinecone/FAISS), and Production RAG Agents.', category: 'Generative AI', level: 'Advanced' as const, price: '₹5,999', students: '1,456', status: 'Published' as const, thumbnailIcon: 'MessageSquare', instructorId: 'usr-2' },
    { id: 'crs-5', title: 'LoRA Fine-Tuning & MLOps Deployment (Senior Architect)', description: 'Fine-tune open LLMs (Llama-3), quantization with BitsAndBytes, vLLM serving, and GPU clusters.', category: 'MLOps & Systems', level: 'Advanced' as const, price: '₹7,999', students: '986', status: 'Published' as const, thumbnailIcon: 'Cpu', instructorId: 'usr-1' },
    { id: 'crs-6', title: 'Autonomous Multi-Agent Systems & LangGraph Workflows', description: 'Build stateful multi-agent systems with LangGraph, Model Context Protocol (MCP), human-in-the-loop approvals, and asynchronous tool execution.', category: 'Agentic AI', level: 'Advanced' as const, price: '₹8,499', students: '2,340', status: 'Published' as const, thumbnailIcon: 'Bot', instructorId: 'usr-2' },
    { id: 'crs-7', title: 'High-Throughput LLM Inference Serving (vLLM, TensorRT & Triton)', description: 'Optimize GPU memory with PagedAttention, KV-Cache compression, FP8/FP4 quantization, and production Triton Inference clusters.', category: 'AI Infrastructure', level: 'Advanced' as const, price: '₹9,999', students: '1,890', status: 'Published' as const, thumbnailIcon: 'Cpu', instructorId: 'usr-1' },
    { id: 'crs-8', title: 'Enterprise GraphRAG & Hybrid Knowledge Retrieval', description: 'Eliminate LLM hallucinations by fusing Neo4j knowledge graphs with hybrid BM25 and dense vector embeddings with Cohere re-ranking.', category: 'Generative AI', level: 'Advanced' as const, price: '₹7,499', students: '1,620', status: 'Published' as const, thumbnailIcon: 'Network', instructorId: 'usr-2' },
    { id: 'crs-9', title: 'Vision-Language Models, Multimodal AI & YOLOv11 Real-Time Vision', description: 'Fine-tune CLIP and LLaVA multimodal models, real-time YOLOv11 object segmentation, and agricultural leaf pest diagnosis.', category: 'Computer Vision', level: 'Advanced' as const, price: '₹6,999', students: '2,150', status: 'Published' as const, thumbnailIcon: 'Activity', instructorId: 'usr-8' },
    { id: 'crs-10', title: 'AI Safety, Prompt Injection Defense & Enterprise Guardrails', description: 'Master OWASP Top 10 for LLMs, adversarial red-teaming, NVIDIA NeMo Guardrails, and automated compliance auditing.', category: 'Security & Governance', level: 'Advanced' as const, price: '₹7,999', students: '1,420', status: 'Published' as const, thumbnailIcon: 'Shield', instructorId: 'usr-2' },
    { id: 'crs-11', title: 'Edge AI, Small Language Models (SLMs) & On-Device Deployment', description: 'Deploy quantized Phi-4 and Qwen-2.5 models on Apple Silicon, Jetson, and mobile devices using ONNX Runtime, GGUF, and WebGPU.', category: 'Edge & Mobile AI', level: 'Intermediate' as const, price: '₹5,999', students: '2,810', status: 'Published' as const, thumbnailIcon: 'Smartphone', instructorId: 'usr-1' },
  ];

  for (const course of courses) {
    await prisma.course.upsert({
      where: { id: course.id },
      update: course,
      create: course,
    });
  }
  console.log(`  ✅ ${courses.length} Courses seeded`);

  // ─── 3. Seed Projects ───
  const projects = [
    {
      id: 'prj-1',
      name: 'Multimodal Medical Radiography Agent',
      description: 'Deploying 3D UNet and ViT models on Kubernetes to automate early cancer screening.',
      category: 'AI & ML',
      level: 'Advanced' as const,
      technologies: ['PyTorch', 'FastAPI', 'Kubernetes', 'DICOM'],
      status: 'Published' as const,
      views: '4,200',
      price: '$49',
      downloads: 320,
      rating: 4.9,
      aim: 'Automate early detection of pulmonary nodules and chest radiography abnormalities using state-of-the-art vision transformers and 3D U-Net segmentation models.',
      objectives: [
        'Build a real-time DICOM image preprocessing and normalization pipeline.',
        'Implement 3D U-Net for volumetric lesion segmentation.',
        'Serve predictions via FastAPI microservices with sub-100ms inference latency.',
        'Package containerized workloads with Helm charts for production Kubernetes deployment.',
      ],
      requirements: [
        'Python 3.10+',
        'PyTorch 2.1+ with CUDA 12 support',
        'NVIDIA GPU with at least 16GB VRAM',
        'Docker & Kubernetes cluster (Minikube or AWS EKS)',
      ],
      scope: 'End-to-end production AI system incorporating DICOM ingest, GPU inference server, interactive web interface, and automated alert telemetry.',
      thumbnailIcon: 'Activity',
      authorId: 'usr-1',
      codeFiles: [
        {
          path: 'src/main.py',
          language: 'python',
          content: `from fastapi import FastAPI, UploadFile, File\nimport torch\nfrom model import UNet3D\n\napp = FastAPI(title="Medical Radiography Inference API")\nmodel = UNet3D().eval()\n\n@app.post("/api/v1/analyze")\nasync def analyze_scan(file: UploadFile = File(...)):\n    contents = await file.read()\n    # Process DICOM bytes & compute lesion segmentation\n    tensor = preprocess_dicom(contents)\n    with torch.no_grad():\n        mask, confidence = model(tensor)\n    return {"lesions_detected": int(mask.sum()), "confidence_score": float(confidence)}`,
        },
        {
          path: 'src/model.py',
          language: 'python',
          content: `import torch\nimport torch.nn as nn\n\nclass UNet3D(nn.Module):\n    def __init__(self, in_channels=1, out_channels=2):\n        super().__init__()\n        self.encoder = nn.Sequential(\n            nn.Conv3d(in_channels, 64, kernel_size=3, padding=1),\n            nn.BatchNorm3d(64),\n            nn.ReLU(inplace=True)\n        )\n        self.head = nn.Conv3d(64, out_channels, kernel_size=1)\n\n    def forward(self, x):\n        feat = self.encoder(x)\n        out = self.head(feat)\n        conf = torch.sigmoid(out.mean())\n        return out, conf`,
        },
        {
          path: 'deploy/k8s-deployment.yaml',
          language: 'yaml',
          content: `apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: radiography-agent-api\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: radiography-agent\n  template:\n    metadata:\n      labels:\n        app: radiography-agent\n    spec:\n      containers:\n      - name: api\n        image: nexus/radiography-agent:v1.2.0\n        resources:\n          limits:\n            nvidia.com/gpu: 1`,
        },
      ],
    },
    {
      id: 'prj-2',
      name: 'High-Frequency Fraud Detection Pipeline',
      description: 'Real-time GNN inference engine analyzing 12.5M financial transactions under 15ms.',
      category: 'AI & ML',
      level: 'Advanced' as const,
      technologies: ['PyTorch Geometric', 'vLLM', 'Qdrant', 'Kafka'],
      status: 'Published' as const,
      views: '3,800',
      price: '$79',
      downloads: 415,
      rating: 5.0,
      aim: 'Detect synthetic identity theft, money laundering rings, and transaction fraud in real-time streaming pipelines using Graph Neural Networks.',
      objectives: [
        'Construct a dynamic heterogeneous financial graph from Apache Kafka event streams.',
        'Train Relational Graph Convolutional Networks (R-GCN) for node and edge classification.',
        'Achieve sub-15ms inference latency at 50,000 transactions per second.',
      ],
      requirements: [
        'Python 3.11+',
        'Apache Kafka 3.4 cluster',
        'Qdrant Vector Database',
        'PyTorch Geometric (PyG) 2.4+',
      ],
      scope: 'Enterprise streaming analytics backend, graph feature store, model retraining service, and fraud investigator workspace UI.',
      thumbnailIcon: 'Zap',
      authorId: 'usr-2',
      codeFiles: [
        {
          path: 'pipeline/stream_consumer.py',
          language: 'python',
          content: `from kafka import KafkaConsumer\nimport json\nfrom gnn_engine import FraudDetectorGNN\n\nconsumer = KafkaConsumer('financial_tx_stream', bootstrap_servers=['localhost:9092'])\ndetector = FraudDetectorGNN.load_pretrained('weights/rgcn_v2.pt')\n\nfor msg in consumer:\n    tx = json.loads(msg.value)\n    risk_score = detector.evaluate_transaction(tx)\n    if risk_score > 0.85:\n        trigger_alert(tx, risk_score)`,
        },
      ],
    },
    {
      id: 'prj-3',
      name: 'Autonomous Code Refactoring Agent',
      description: 'Fine-tuning LLaMA 3 70B on internal repository commits for automated PR reviews.',
      category: 'Generative AI',
      level: 'Intermediate' as const,
      technologies: ['LangChain', 'LoRA', 'GitHub API', 'FastAPI'],
      status: 'Published' as const,
      views: '2,900',
      price: '$39',
      downloads: 180,
      rating: 4.8,
      aim: 'Build an autonomous GitHub PR review and refactoring bot that inspects diffs, detects security vulnerabilities, and suggests optimized refactored code.',
      objectives: [
        'Fine-tune LLaMA 3 70B using QLoRA parameter-efficient fine-tuning on clean codebases.',
        'Integrate GitHub Webhooks for automated pull request events.',
        'Generate inline review comments and automated patch suggestions.',
      ],
      requirements: [
        'Python 3.10+',
        'GitHub Personal Access Token / App credentials',
        'vLLM / Ollama local LLM server',
      ],
      scope: 'Developer tooling service with webhook integration, prompt engineering suite, and interactive review dashboard.',
      thumbnailIcon: 'Code',
      authorId: 'usr-3',
      codeFiles: [
        {
          path: 'agent/reviewer.py',
          language: 'python',
          content: `from langchain.chains import LLMChain\nfrom langchain.prompts import PromptTemplate\n\nreview_prompt = PromptTemplate.from_template("""\nAnalyze the following code diff for bugs, memory leaks, and style improvements:\n{diff}\n\nProvide structured JSON suggestions:\n""")\n\ndef review_pull_request(diff_text: str):\n    return review_chain.run(diff=diff_text)`,
        },
      ],
    },
    {
      id: 'prj-4',
      name: 'Real-time Video Sentiment & Eye Tracking',
      description: 'Computer vision pipeline detecting facial micro-expressions and gaze direction.',
      category: 'Computer Vision',
      level: 'Beginner' as const,
      technologies: ['OpenCV', 'MediaPipe', 'TensorFlow', 'Flask'],
      status: 'Published' as const,
      views: '1,500',
      price: 'Free',
      downloads: 512,
      rating: 4.7,
      aim: 'Real-time pupil tracking and facial landmark extraction for usability testing and attention analytics.',
      objectives: [
        'Extract 468 3D facial landmarks using MediaPipe Face Mesh.',
        'Estimate 2D gaze vectors and fixation heatmaps.',
      ],
      requirements: ['Python 3.9+', 'Webcam / USB Camera', 'OpenCV & MediaPipe'],
      scope: 'Desktop analytics utility with real-time video preview overlay.',
      thumbnailIcon: 'Eye',
      authorId: 'usr-8',
      codeFiles: [
        {
          path: 'tracker/gaze.py',
          language: 'python',
          content: `import cv2\nimport mediapipe as mp\n\nmp_face_mesh = mp.solutions.face_mesh\nface_mesh = mp_face_mesh.FaceMesh(max_num_faces=1)\ncap = cv2.VideoCapture(0)\n\nwhile cap.isOpened():\n    success, image = cap.read()\n    results = face_mesh.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))\n    # Process landmark coordinates`,
        },
      ],
    },
    {
      id: 'prj-5',
      name: 'Enterprise RAG Document Intelligence Platform',
      description: 'Multi-tenant PDF parser and hybrid dense-sparse vector search platform.',
      category: 'Generative AI',
      level: 'Advanced' as const,
      technologies: ['Next.js', 'PyTorch', 'Pinecone', 'Elasticsearch'],
      status: 'Published' as const,
      views: '5,100',
      price: '$99',
      downloads: 640,
      rating: 5.0,
      aim: 'High-throughput enterprise document processing platform with hybrid BM25 + dense vector retrieval.',
      objectives: [
        'OCR optical character recognition for scanned multi-page PDFs.',
        'Hybrid reranking using Cross-Encoders.',
      ],
      requirements: ['Node.js 18+', 'Python 3.10+', 'Pinecone API Key', 'Elasticsearch 8+'],
      scope: 'Full-stack enterprise solution with multi-tenant auth, workspace sharing, and analytics.',
      thumbnailIcon: 'Database',
      authorId: 'usr-4',
      codeFiles: [
        {
          path: 'src/app/api/query/route.ts',
          language: 'typescript',
          content: `import { NextRequest, NextResponse } from 'next/server';\n\nexport async function POST(req: NextRequest) {\n  const { query, workspaceId } = await req.json();\n  // Hybrid BM25 + Dense vector search\n  const results = await hybridSearch(query, workspaceId);\n  return NextResponse.json({ results });\n}`,
        },
      ],
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { id: project.id },
      update: project,
      create: project,
    });
  }
  console.log(`  ✅ ${projects.length} Projects seeded`);

  // ─── 4. Seed Datasets ───
  const datasets = [
    { id: 'ds-1', name: 'ImageNet Mini', description: 'Subset of ImageNet for educational use', category: 'Computer Vision', domain: 'AI & ML', size: '12.4 GB', format: 'Parquet', license: 'CC BY 4.0', status: 'Public' as const, downloads: '4,200', iconName: 'Image' },
    { id: 'ds-2', name: 'CIFAR-10', description: 'Object recognition dataset (10 classes)', category: 'Computer Vision', domain: 'AI & ML', size: '162 MB', format: 'Binary', license: 'MIT', status: 'Public' as const, downloads: '6,800', iconName: 'Layers' },
    { id: 'ds-3', name: 'IMDB Reviews', description: 'Movie reviews for sentiment analysis', category: 'NLP', domain: 'AI & ML', size: '84 MB', format: 'CSV', license: 'Apache 2.0', status: 'Public' as const, downloads: '3,200', iconName: 'FileText' },
    { id: 'ds-4', name: 'COVID-19 Clinical Trials', description: 'Clinical trial data from WHO', category: 'Healthcare', domain: 'Medical', size: '2.1 GB', format: 'JSON', license: 'CC BY-NC', status: 'Private' as const, downloads: '1,100', iconName: 'Heart' },
    { id: 'ds-5', name: 'NYC Taxi Trips', description: 'NYC taxi trip records (2019-2023)', category: 'Transportation', domain: 'Urban Analytics', size: '48 GB', format: 'Parquet', license: 'Open Data', status: 'Public' as const, downloads: '2,500', iconName: 'Car' },
  ];

  for (const dataset of datasets) {
    await prisma.dataset.upsert({
      where: { id: dataset.id },
      update: dataset,
      create: dataset,
    });
  }
  console.log(`  ✅ ${datasets.length} Datasets seeded`);

  // ─── 5. Seed Assessments ───
  const assessments = [
    { id: 'asm-1', name: 'Machine Learning Basics Quiz', description: 'Test your understanding of ML basics', type: 'Quiz' as const, category: 'AI / ML', difficulty: 'Easy' as const, questionsCount: 20, duration: '20 min', attempts: '1,200', status: 'Published' as const, iconName: 'ClipboardCheck', courseId: 'crs-1' },
    { id: 'asm-2', name: 'Data Structures Assignment', description: 'Solve problems on arrays, stacks, queues', type: 'Assignment' as const, category: 'Programming', difficulty: 'Medium' as const, questionsCount: 10, duration: '60 min', attempts: '890', status: 'Published' as const, iconName: 'Code' },
    { id: 'asm-3', name: 'Neural Networks Test', description: 'Comprehensive test on neural network architecture', type: 'Test' as const, category: 'AI / ML', difficulty: 'Hard' as const, questionsCount: 30, duration: '90 min', attempts: '456', status: 'Published' as const, iconName: 'Brain', courseId: 'crs-2' },
    { id: 'asm-4', name: 'Python Practical Exam', description: 'Hands-on coding exam for Python proficiency', type: 'Practical' as const, category: 'Programming', difficulty: 'Medium' as const, questionsCount: 5, duration: '120 min', attempts: '650', status: 'Draft' as const, iconName: 'Terminal', courseId: 'crs-3' },
    { id: 'asm-5', name: 'NLP Fundamentals Quiz', description: 'Test on text processing and language models', type: 'Quiz' as const, category: 'AI / ML', difficulty: 'Easy' as const, questionsCount: 15, duration: '15 min', attempts: '320', status: 'InReview' as const, iconName: 'MessageSquare', courseId: 'crs-4' },
  ];

  for (const assessment of assessments) {
    await prisma.assessment.upsert({
      where: { id: assessment.id },
      update: assessment,
      create: assessment,
    });
  }
  console.log(`  ✅ ${assessments.length} Assessments seeded`);

  // ─── 6. Seed Algorithms ───
  const algorithms = [
    // 1. Classical Machine Learning
    { id: 'alg-1', name: 'Linear & Logistic Regression', description: 'Fundamental supervised learning algorithms for regression prediction and binary classification.', category: 'Machine Learning', complexity: 'Easy' as const, topic: 'Regression', implementationsCount: 12, languages: ['Python', 'Scikit-Learn', 'R'], status: 'Published' as const, iconName: 'TrendingUp' },
    { id: 'alg-2', name: 'Decision Trees & Random Forests', description: 'Tree-based ensemble method combining multiple decision trees to reduce variance.', category: 'Machine Learning', complexity: 'Medium' as const, topic: 'Classification', implementationsCount: 9, languages: ['Python', 'R', 'Scala'], status: 'Published' as const, iconName: 'Trees' },
    { id: 'alg-3', name: 'Gradient Boosting (XGBoost & LightGBM)', description: 'State-of-the-art boosting algorithm sequentially building trees to minimize error.', category: 'Machine Learning', complexity: 'Hard' as const, topic: 'Tabular ML', implementationsCount: 8, languages: ['Python', 'C++', 'Julia'], status: 'Published' as const, iconName: 'Zap' },
    { id: 'alg-4', name: 'Support Vector Machines (SVM)', description: 'Finds optimal hyperplanes separating data classes with maximum margin.', category: 'Machine Learning', complexity: 'Medium' as const, topic: 'Classification', implementationsCount: 6, languages: ['Python', 'C++'], status: 'Published' as const, iconName: 'Shield' },
    { id: 'alg-5', name: 'K-Nearest Neighbors (KNN)', description: 'Instance-based non-parametric classifier predicting labels based on k closest distance metrics.', category: 'Machine Learning', complexity: 'Easy' as const, topic: 'Classification', implementationsCount: 10, languages: ['Python', 'C++'], status: 'Published' as const, iconName: 'Grid' },
    { id: 'alg-6', name: 'Naive Bayes Classifier', description: 'Probabilistic classifier applying Bayes theorem with strong independence assumptions.', category: 'Machine Learning', complexity: 'Easy' as const, topic: 'NLP & Spam', implementationsCount: 8, languages: ['Python', 'R'], status: 'Published' as const, iconName: 'MessageSquare' },
    { id: 'alg-7', name: 'Principal Component Analysis (PCA)', description: 'Unsupervised linear dimensionality reduction projecting high-dimensional data onto orthogonal axes.', category: 'Machine Learning', complexity: 'Medium' as const, topic: 'Dimensionality Reduction', implementationsCount: 7, languages: ['Python', 'NumPy', 'MATLAB'], status: 'Published' as const, iconName: 'Maximize2' },
    { id: 'alg-8', name: 't-SNE & UMAP', description: 'Non-linear manifold reduction techniques preserving local and global data topology.', category: 'Machine Learning', complexity: 'Hard' as const, topic: 'Data Visualization', implementationsCount: 6, languages: ['Python', 'R'], status: 'Published' as const, iconName: 'Eye' },

    // 2. Deep Learning & Computer Vision
    { id: 'alg-9', name: 'Multi-Layer Perceptron (MLP)', description: 'Feedforward artificial neural network with input, hidden, and output layers.', category: 'Deep Learning', complexity: 'Medium' as const, topic: 'Neural Networks', implementationsCount: 10, languages: ['Python', 'PyTorch', 'TensorFlow'], status: 'Published' as const, iconName: 'Brain' },
    { id: 'alg-10', name: 'Convolutional Neural Networks (CNNs)', description: 'Deep neural networks utilizing spatial convolution filters for computer vision.', category: 'Deep Learning', complexity: 'Hard' as const, topic: 'Computer Vision', implementationsCount: 8, languages: ['Python', 'PyTorch', 'Keras'], status: 'Published' as const, iconName: 'Image' },
    { id: 'alg-11', name: 'YOLO (You Only Look Once)', description: 'Single-pass real-time object detection predicting bounding boxes and class probabilities.', category: 'Deep Learning', complexity: 'Hard' as const, topic: 'Object Detection', implementationsCount: 9, languages: ['Python', 'PyTorch', 'C++'], status: 'Published' as const, iconName: 'Target' },
    { id: 'alg-12', name: 'Vision Transformer (ViT)', description: 'Adapts self-attention architecture to image patches for state-of-the-art vision recognition.', category: 'Deep Learning', complexity: 'Hard' as const, topic: 'Computer Vision', implementationsCount: 7, languages: ['Python', 'PyTorch'], status: 'Published' as const, iconName: 'Sparkles' },
    { id: 'alg-13', name: 'Generative Adversarial Networks (GANs)', description: 'Competitive training between Generator and Discriminator neural networks.', category: 'Deep Learning', complexity: 'Hard' as const, topic: 'Generative Models', implementationsCount: 8, languages: ['Python', 'PyTorch'], status: 'Published' as const, iconName: 'Palette' },
    { id: 'alg-14', name: 'Recurrent Neural Networks (LSTMs & GRUs)', description: 'Sequential neural network architecture with memory gates for time-series and speech.', category: 'Deep Learning', complexity: 'Hard' as const, topic: 'Sequence Modeling', implementationsCount: 6, languages: ['Python', 'PyTorch'], status: 'Published' as const, iconName: 'Clock' },
    { id: 'alg-15', name: 'U-Net Architecture', description: 'Symmetric encoder-decoder network with skip connections for biomedical image segmentation.', category: 'Deep Learning', complexity: 'Hard' as const, topic: 'Segmentation', implementationsCount: 5, languages: ['Python', 'PyTorch'], status: 'Published' as const, iconName: 'Layers' },

    // 3. Generative AI & Frontier LLMs
    { id: 'alg-16', name: 'Transformer Self-Attention Architecture', description: 'Core mechanism of modern LLMs computing dynamic queries, keys, and values attention weights.', category: 'Generative AI', complexity: 'Hard' as const, topic: 'LLM Core', implementationsCount: 15, languages: ['Python', 'PyTorch', 'Transformers'], status: 'Published' as const, iconName: 'Sparkles' },
    { id: 'alg-17', name: 'Mixture of Experts (MoE)', description: 'Sparse architecture routing tokens to specialized expert subnetworks dynamically.', category: 'Generative AI', complexity: 'Hard' as const, topic: 'LLM Scaling', implementationsCount: 6, languages: ['Python', 'PyTorch', 'vLLM'], status: 'Published' as const, iconName: 'Cpu' },
    { id: 'alg-18', name: 'Retrieval-Augmented Generation (RAG)', description: 'Combines dense vector search with generative LLMs to ground responses in external documents.', category: 'Generative AI', complexity: 'Hard' as const, topic: 'AI Agents', implementationsCount: 12, languages: ['Python', 'LangChain', 'LlamaIndex'], status: 'Published' as const, iconName: 'Database' },
    { id: 'alg-19', name: 'ReAct Agent Framework', description: 'Synergizes Reasoning and Acting trace loops for autonomous LLM tool execution.', category: 'Generative AI', complexity: 'Hard' as const, topic: 'Autonomous Agents', implementationsCount: 8, languages: ['Python', 'LangChain'], status: 'Published' as const, iconName: 'Bot' },
    { id: 'alg-20', name: 'Diffusion Models (Latent Diffusion & DDPM)', description: 'Generative model iteratively denoising Gaussian noise to produce high-resolution images.', category: 'Generative AI', complexity: 'Hard' as const, topic: 'Image Generation', implementationsCount: 7, languages: ['Python', 'PyTorch', 'Diffusers'], status: 'Published' as const, iconName: 'Palette' },
    { id: 'alg-21', name: 'LoRA & QLoRA Fine-Tuning', description: 'Low-Rank Adaptation freezing pretrained weights and injecting trainable rank decomposition matrices.', category: 'Generative AI', complexity: 'Hard' as const, topic: 'LLM Fine-Tuning', implementationsCount: 9, languages: ['Python', 'PEFT', 'BitsAndBytes'], status: 'Published' as const, iconName: 'Cpu' },
    { id: 'alg-22', name: 'Direct Preference Optimization (DPO)', description: 'Aligns LLMs with human preferences directly using implicit reward functions.', category: 'Generative AI', complexity: 'Hard' as const, topic: 'Model Alignment', implementationsCount: 4, languages: ['Python', 'PyTorch'], status: 'Published' as const, iconName: 'CheckCircle' },
    { id: 'alg-23', name: 'Speculative Decoding', description: 'Accelerates LLM inference using small draft models to propose candidate tokens in parallel.', category: 'Generative AI', complexity: 'Hard' as const, topic: 'Inference Optimization', implementationsCount: 5, languages: ['Python', 'C++', 'vLLM'], status: 'Published' as const, iconName: 'Zap' },

    // 4. Search & Graph AI
    { id: 'alg-24', name: 'A* Search Algorithm', description: 'Finds shortest path using heuristic informed search functions.', category: 'Search & Graphs', complexity: 'Medium' as const, topic: 'Graph Search', implementationsCount: 6, languages: ['Python', 'C++', 'Java'], status: 'Published' as const, iconName: 'Network' },
    { id: 'alg-25', name: 'Graph Convolutional Networks (GCN)', description: 'Neural networks aggregating feature representations over local graph neighborhoods.', category: 'Search & Graphs', complexity: 'Hard' as const, topic: 'Graph AI', implementationsCount: 7, languages: ['Python', 'PyTorch Geometric'], status: 'Published' as const, iconName: 'Share2' },
    { id: 'alg-26', name: 'Minimax with Alpha-Beta Pruning', description: 'Decision-rule algorithm evaluating optimal moves in zero-sum games.', category: 'Search & Graphs', complexity: 'Medium' as const, topic: 'Game AI', implementationsCount: 5, languages: ['Python', 'C++'], status: 'Published' as const, iconName: 'Gamepad2' },
    { id: 'alg-27', name: 'PageRank Algorithm', description: 'Calculates node importance in link networks via random walk stationary distribution.', category: 'Search & Graphs', complexity: 'Medium' as const, topic: 'Network Science', implementationsCount: 8, languages: ['Python', 'C++'], status: 'Published' as const, iconName: 'Globe' },

    // 5. Clustering & Unsupervised
    { id: 'alg-28', name: 'K-Means Clustering', description: 'Partitions data into K distinct clusters minimizing within-cluster variance.', category: 'Clustering', complexity: 'Medium' as const, topic: 'Unsupervised ML', implementationsCount: 8, languages: ['Python', 'R', 'Julia'], status: 'Published' as const, iconName: 'CircleDot' },
    { id: 'alg-29', name: 'DBSCAN Clustering', description: 'Density-based spatial clustering identifying clusters of arbitrary shapes and noise.', category: 'Clustering', complexity: 'Medium' as const, topic: 'Unsupervised ML', implementationsCount: 6, languages: ['Python', 'Scikit-Learn'], status: 'Published' as const, iconName: 'Share2' },
    { id: 'alg-30', name: 'Gaussian Mixture Models (GMM)', description: 'Probabilistic clustering model assuming data points are generated from mixture of Gaussians.', category: 'Clustering', complexity: 'Hard' as const, topic: 'Expectation Maximization', implementationsCount: 5, languages: ['Python', 'Scikit-Learn'], status: 'Published' as const, iconName: 'Activity' },
    { id: 'alg-31', name: 'Hierarchical Agglomerative Clustering', description: 'Bottom-up clustering building a dendrogram tree of nested dataset merges.', category: 'Clustering', complexity: 'Medium' as const, topic: 'Unsupervised ML', implementationsCount: 6, languages: ['Python', 'R'], status: 'Published' as const, iconName: 'GitMerge' },

    // 6. Reinforcement Learning
    { id: 'alg-32', name: 'Deep Q-Networks (DQN)', description: 'Combines Q-learning with deep neural networks to learn optimal control policies from pixels.', category: 'Reinforcement Learning', complexity: 'Hard' as const, topic: 'RL Control', implementationsCount: 5, languages: ['Python', 'PyTorch', 'Gymnasium'], status: 'Published' as const, iconName: 'Trophy' },
    { id: 'alg-33', name: 'Proximal Policy Optimization (PPO)', description: 'Policy gradient method clipping probability ratios for stable reinforcement learning.', category: 'Reinforcement Learning', complexity: 'Hard' as const, topic: 'RL Policy', implementationsCount: 6, languages: ['Python', 'Stable-Baselines3'], status: 'Published' as const, iconName: 'Activity' },
    { id: 'alg-34', name: 'Monte Carlo Tree Search (MCTS)', description: 'Heuristic search algorithm building search trees via random rollout simulation (AlphaGo core).', category: 'Reinforcement Learning', complexity: 'Hard' as const, topic: 'Game AI & RL', implementationsCount: 5, languages: ['Python', 'C++'], status: 'Published' as const, iconName: 'Compass' },
    { id: 'alg-35', name: 'Soft Actor-Critic (SAC)', description: 'Off-policy maximum entropy actor-critic algorithm for continuous robotic control.', category: 'Reinforcement Learning', complexity: 'Hard' as const, topic: 'Continuous RL', implementationsCount: 4, languages: ['Python', 'PyTorch'], status: 'Published' as const, iconName: 'Flame' },
  ];

  for (const algorithm of algorithms) {
    await prisma.algorithm.upsert({
      where: { id: algorithm.id },
      update: algorithm,
      create: algorithm,
    });
  }
  console.log(`  ✅ ${algorithms.length} Algorithms seeded`);

  // ─── 7. Seed Roles ───
  const roles = [
    { id: 'role-1', name: 'Super Admin', type: 'System' as const, usersCount: 2, userPercentage: 0.5, permissionsCount: 48, description: 'Full system access with all permissions', status: 'Active' as const, iconName: 'Shield', iconBg: 'bg-purple-500/20', iconColor: 'text-purple-400', isProtected: true },
    { id: 'role-2', name: 'Admin', type: 'System' as const, usersCount: 8, userPercentage: 2.0, permissionsCount: 42, description: 'Administrative access to manage platform', status: 'Active' as const, iconName: 'ShieldCheck', iconBg: 'bg-blue-500/20', iconColor: 'text-blue-400', isProtected: true },
    { id: 'role-3', name: 'Content Manager', type: 'Custom' as const, usersCount: 15, userPercentage: 3.8, permissionsCount: 28, description: 'Manage courses, articles, and learning content', status: 'Active' as const, iconName: 'BookOpen', iconBg: 'bg-emerald-500/20', iconColor: 'text-emerald-400', isProtected: false },
    { id: 'role-4', name: 'Instructor', type: 'System' as const, usersCount: 45, userPercentage: 11.4, permissionsCount: 22, description: 'Create and manage courses and assessments', status: 'Active' as const, iconName: 'GraduationCap', iconBg: 'bg-amber-500/20', iconColor: 'text-amber-400', isProtected: true },
    { id: 'role-5', name: 'Data Analyst', type: 'Custom' as const, usersCount: 20, userPercentage: 5.1, permissionsCount: 18, description: 'View analytics, datasets, and reports', status: 'Active' as const, iconName: 'BarChart3', iconBg: 'bg-cyan-500/20', iconColor: 'text-cyan-400', isProtected: false },
    { id: 'role-6', name: 'Learner', type: 'System' as const, usersCount: 300, userPercentage: 76.1, permissionsCount: 12, description: 'Access courses, quizzes, and learning resources', status: 'Active' as const, iconName: 'User', iconBg: 'bg-slate-500/20', iconColor: 'text-slate-400', isProtected: true },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { id: role.id },
      update: role,
      create: role,
    });
  }
  console.log(`  ✅ ${roles.length} Roles seeded`);

  // ─── 8. Seed Permissions ───
  const permissions = [
    { id: 'perm-1', key: 'users.read', name: 'View Users', module: 'User Management', resource: 'Users', action: 'Read', type: 'System' as const },
    { id: 'perm-2', key: 'users.create', name: 'Create Users', module: 'User Management', resource: 'Users', action: 'Create', type: 'System' as const },
    { id: 'perm-3', key: 'users.update', name: 'Update Users', module: 'User Management', resource: 'Users', action: 'Update', type: 'System' as const },
    { id: 'perm-4', key: 'users.delete', name: 'Delete Users', module: 'User Management', resource: 'Users', action: 'Delete', type: 'System' as const },
    { id: 'perm-5', key: 'courses.read', name: 'View Courses', module: 'Content', resource: 'Courses', action: 'Read', type: 'System' as const },
    { id: 'perm-6', key: 'courses.create', name: 'Create Courses', module: 'Content', resource: 'Courses', action: 'Create', type: 'System' as const },
    { id: 'perm-7', key: 'courses.update', name: 'Update Courses', module: 'Content', resource: 'Courses', action: 'Update', type: 'System' as const },
    { id: 'perm-8', key: 'courses.delete', name: 'Delete Courses', module: 'Content', resource: 'Courses', action: 'Delete', type: 'System' as const },
    { id: 'perm-9', key: 'analytics.read', name: 'View Analytics', module: 'Analytics', resource: 'Analytics', action: 'Read', type: 'System' as const },
    { id: 'perm-10', key: 'settings.manage', name: 'Manage Settings', module: 'Administration', resource: 'Settings', action: 'Manage', type: 'System' as const },
    { id: 'perm-11', key: 'roles.manage', name: 'Manage Roles', module: 'Administration', resource: 'Roles', action: 'Manage', type: 'System' as const },
    { id: 'perm-12', key: 'datasets.read', name: 'View Datasets', module: 'Data', resource: 'Datasets', action: 'Read', type: 'System' as const },
    { id: 'perm-13', key: 'datasets.create', name: 'Create Datasets', module: 'Data', resource: 'Datasets', action: 'Create', type: 'Custom' as const },
    { id: 'perm-14', key: 'assessments.read', name: 'View Assessments', module: 'Content', resource: 'Assessments', action: 'Read', type: 'System' as const },
    { id: 'perm-15', key: 'assessments.create', name: 'Create Assessments', module: 'Content', resource: 'Assessments', action: 'Create', type: 'System' as const },
    { id: 'perm-16', key: 'audit.read', name: 'View Audit Logs', module: 'Administration', resource: 'Audit Logs', action: 'Read', type: 'System' as const },
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { id: permission.id },
      update: permission,
      create: permission,
    });
  }
  console.log(`  ✅ ${permissions.length} Permissions seeded`);

  // ─── 9. Seed Content ───
  const contents = [
    { id: 'cnt-1', title: 'Introduction to Neural Networks', description: 'A comprehensive guide to understanding neural networks from scratch', type: 'Article' as const, category: 'AI & ML', status: 'Published' as const, views: '2,856', thumbnailIcon: 'Brain', authorId: 'usr-2' },
    { id: 'cnt-2', title: 'React Best Practices 2025', description: 'Modern React patterns, hooks, and performance optimization', type: 'Tutorial' as const, category: 'Web Development', status: 'Published' as const, views: '4,123', thumbnailIcon: 'Code', authorId: 'usr-1' },
    { id: 'cnt-3', title: 'Data Visualization with D3.js', description: 'Create interactive charts and visualizations', type: 'Video' as const, category: 'Data Science', status: 'Draft' as const, views: '1,200', thumbnailIcon: 'BarChart', authorId: 'usr-4' },
    { id: 'cnt-4', title: 'SQL Performance Tuning Guide', description: 'Optimize database queries and indexes', type: 'Guide' as const, category: 'Database', status: 'Published' as const, views: '3,456', thumbnailIcon: 'Database', authorId: 'usr-3' },
    { id: 'cnt-5', title: 'LLM Fine-tuning Workshop', description: 'Step-by-step guide to fine-tune large language models', type: 'Course' as const, category: 'AI & ML', status: 'PendingReview' as const, views: '890', thumbnailIcon: 'Sparkles', authorId: 'usr-8' },
  ];

  for (const content of contents) {
    await prisma.content.upsert({
      where: { id: content.id },
      update: content,
      create: content,
    });
  }
  console.log(`  ✅ ${contents.length} Content items seeded`);

  // ─── 10. Seed Audit Logs ───
  const auditLogs = [
    { id: 'log-1', action: 'Created new course', target: 'Machine Learning Fundamentals', type: 'course' as const, userId: 'usr-2' },
    { id: 'log-2', action: 'Updated user role', target: 'sarah_johnson → Admin', type: 'user' as const, userId: 'usr-1' },
    { id: 'log-3', action: 'Uploaded dataset', target: 'ImageNet Mini', type: 'dataset' as const, userId: 'usr-4' },
    { id: 'log-4', action: 'Enabled 2FA', target: 'Security Settings', type: 'security' as const, userId: 'usr-1' },
    { id: 'log-5', action: 'AI model inference', target: 'GPT-4 Turbo — 1,250 tokens', type: 'ai' as const, userId: 'usr-3' },
    { id: 'log-6', action: 'Deleted draft course', target: 'Intro to Blockchain', type: 'course' as const, userId: 'usr-1' },
    { id: 'log-7', action: 'User registration', target: 'michael_brown', type: 'user' as const, userId: 'usr-5' },
    { id: 'log-8', action: 'Password reset', target: 'david_kim', type: 'security' as const, userId: 'usr-7' },
  ];

  for (const log of auditLogs) {
    await prisma.auditLog.upsert({
      where: { id: log.id },
      update: log,
      create: log,
    });
  }
  console.log(`  ✅ ${auditLogs.length} Audit Logs seeded`);

  // ─── 11. Seed Role-Permission Mappings ───
  const rolePermMappings = [
    // Super Admin → all permissions
    ...permissions.map(p => ({ roleId: 'role-1', permissionId: p.id, state: 'granted' as const })),
    // Admin → most permissions
    ...permissions.filter(p => p.key !== 'roles.manage').map(p => ({ roleId: 'role-2', permissionId: p.id, state: 'granted' as const })),
    // Content Manager → content permissions
    ...permissions.filter(p => p.module === 'Content' || p.key === 'datasets.read').map(p => ({ roleId: 'role-3', permissionId: p.id, state: 'granted' as const })),
    // Instructor → courses and assessments
    ...permissions.filter(p => p.resource === 'Courses' || p.resource === 'Assessments').map(p => ({ roleId: 'role-4', permissionId: p.id, state: 'granted' as const })),
    // Data Analyst → read-only on analytics and datasets
    ...permissions.filter(p => p.key.includes('read') || p.module === 'Analytics').map(p => ({ roleId: 'role-5', permissionId: p.id, state: 'granted' as const })),
    // Learner → basic read
    ...permissions.filter(p => ['courses.read', 'assessments.read', 'datasets.read'].includes(p.key)).map(p => ({ roleId: 'role-6', permissionId: p.id, state: 'granted' as const })),
  ];

  for (const mapping of rolePermMappings) {
    await prisma.rolePermissionMap.upsert({
      where: { roleId_permissionId: { roleId: mapping.roleId, permissionId: mapping.permissionId } },
      update: { state: mapping.state },
      create: mapping,
    });
  }
  console.log(`  ✅ ${rolePermMappings.length} Role-Permission mappings seeded`);

  // ─── 12. Seed User-Role Mappings ───
  const userRoleMappings = [
    { userId: 'usr-1', roleId: 'role-1' }, // Sarah → Super Admin
    { userId: 'usr-2', roleId: 'role-4' }, // Alex → Instructor
    { userId: 'usr-3', roleId: 'role-2' }, // James → Admin
    { userId: 'usr-4', roleId: 'role-3' }, // Emily → Content Manager
    { userId: 'usr-5', roleId: 'role-5' }, // Michael → Data Analyst
    { userId: 'usr-6', roleId: 'role-2' }, // Lisa → Admin (Moderator)
    { userId: 'usr-7', roleId: 'role-6' }, // David → Learner
    { userId: 'usr-8', roleId: 'role-4' }, // Anna → Instructor
  ];

  for (const mapping of userRoleMappings) {
    await prisma.userRoleMap.upsert({
      where: { userId_roleId: { userId: mapping.userId, roleId: mapping.roleId } },
      update: {},
      create: mapping,
    });
  }
  console.log(`  ✅ ${userRoleMappings.length} User-Role mappings seeded`);

  // ─── 13. Seed User Sessions ───
  const userSessions = [
    { id: 'sess-1', userId: 'usr-1', ip: '192.168.1.10', location: 'Bengaluru, India', device: 'Chrome on macOS', authMethod: '2FA / SSO', duration: '2h 45m', status: 'Active' as const, lastActive: '2 mins ago' },
    { id: 'sess-2', userId: 'usr-9', ip: '104.28.14.2', location: 'New York, USA', device: 'Safari on macOS', authMethod: 'Password + 2FA', duration: '1h 12m', status: 'Active' as const, lastActive: '5 mins ago' },
    { id: 'sess-3', userId: 'usr-2', ip: '82.165.197.1', location: 'Berlin, Germany', device: 'Firefox on Linux', authMethod: 'Password', duration: '4h 20m', status: 'Idle' as const, lastActive: '22 mins ago' },
    { id: 'sess-4', userId: 'usr-10', ip: '185.220.101.4', location: 'San Francisco, USA', device: 'Chrome on Windows 11', authMethod: 'Password', duration: '45m', status: 'Active' as const, lastActive: '10 mins ago' },
    { id: 'sess-5', userId: 'usr-3', ip: '172.56.21.9', location: 'London, UK', device: 'Edge on Windows 11', authMethod: 'SAML SSO', duration: '6h 10m', status: 'Revoked' as const, lastActive: '3 hours ago' },
  ];

  for (const sess of userSessions) {
    await prisma.userSession.upsert({
      where: { id: sess.id },
      update: sess,
      create: sess,
    });
  }
  console.log(`  ✅ ${userSessions.length} User sessions seeded`);

  // ─── 14. Seed Learning Rooms & Tasks ───
  const rooms = [
    {
      id: 'room-0',
      title: 'The Math & Human Brain Behind AI',
      description: 'Discover how the human brain inspires neural networks, how matrices and calculus power AI, and real-time application examples.',
      level: 'Novice' as const,
      tier: 'Free' as const,
      category: 'Foundations & Math',
      estimatedTime: '30 mins',
      xpReward: 200,
      iconName: 'Brain',
    },
    {
      id: 'room-1',
      title: 'What is AI? (Novice Foundations)',
      description: 'Zero background required. Understand the difference between AI, Machine Learning, Deep Learning, and Generative AI.',
      level: 'Novice' as const,
      tier: 'Free' as const,
      category: 'AI Foundations',
      estimatedTime: '30 mins',
      xpReward: 200,
      iconName: 'Sparkles',
    },
    {
      id: 'room-2',
      title: 'Python Essentials for AI Beginners',
      description: 'Learn variables, lists, NumPy arrays, and Pandas DataFrames with interactive code checks.',
      level: 'Novice' as const,
      tier: 'Free' as const,
      category: 'Programming',
      estimatedTime: '45 mins',
      xpReward: 250,
      iconName: 'Code',
    },
    {
      id: 'room-3',
      title: 'Classical Machine Learning & Scikit-Learn',
      description: 'Build your first prediction model using Linear Regression and Decision Trees.',
      level: 'Intermediate' as const,
      tier: 'Free' as const,
      category: 'Machine Learning',
      estimatedTime: '1 hour',
      xpReward: 350,
      iconName: 'Cpu',
    },
    {
      id: 'room-4',
      title: 'Deep Learning & PyTorch Neural Networks',
      description: 'Understand neurons, backpropagation, and build a multi-layer perceptron in PyTorch.',
      level: 'Advanced' as const,
      tier: 'Pro' as const,
      category: 'Deep Learning',
      estimatedTime: '1.5 hours',
      xpReward: 500,
      iconName: 'Layers',
    },
    {
      id: 'room-basic-tools',
      title: 'Everyday AI Tools & Creative Prompting for Students (5-Min Modules)',
      description: 'Zero code required. Explore ChatGPT, Midjourney, Claude, ElevenLabs, and visual AI games.',
      level: 'Novice' as const,
      tier: 'Free' as const,
      category: 'School & Everyday AI',
      estimatedTime: '20 mins',
      xpReward: 200,
      iconName: 'Sparkles',
    },
    {
      id: 'room-5',
      title: 'Generative AI, RAG & Vector Databases',
      description: 'Master Retrieval-Augmented Generation, embeddings, Pinecone/FAISS, and building LLM agents.',
      level: 'Expert' as const,
      tier: 'Pro' as const,
      category: 'Generative AI',
      estimatedTime: '2 hours',
      xpReward: 750,
      iconName: 'Zap',
    },
    {
      id: 'room-adv-transformers',
      title: 'Deep Transformers Architecture, QKV Math & LoRA Systems',
      description: 'In-depth Scaled Dot-Product Attention, GPU memory tiling, 4-bit QLoRA, and FlashAttention.',
      level: 'Expert' as const,
      tier: 'Pro' as const,
      category: 'Advanced Generative Systems',
      estimatedTime: '2.5 hours',
      xpReward: 900,
      iconName: 'Cpu',
    },
  ];

  for (const r of rooms) {
    await prisma.learningRoom.upsert({
      where: { id: r.id },
      update: r,
      create: r,
    });
  }

  // Seed tasks for room-0 (Math & Human Brain)
  const tasksRoom0 = [
    {
      id: 'task-001',
      roomId: 'room-0',
      orderNumber: 1,
      title: 'Task 1: The Human Brain vs Artificial Neural Networks',
      instructions: 'Biological neurons have Dendrites (Inputs), Synapses (Synaptic Weight multipliers), and Soma (Cell Body Summation). Artificial Neural Networks mimic this exact biological structure using mathematical weights and activation functions!',
      codeSnippet: '# Biological Neuron equivalent in Python\ninputs = [0.8, 0.5] # Dendrites\nweights = [1.5, -0.8] # Synaptic weights\nbias = 0.2\n\n# Soma Summation\nz = sum(i * w for i, w in zip(inputs, weights)) + bias\nprint("Neuron Output (Soma):", z)',
      hint: 'Dendrites receive inputs, Synapses weight signals, and the Cell Body sums them up.',
      questionText: 'In an Artificial Neural Network, what biological component corresponds to Feature Inputs?',
      options: ['Dendrites', 'Axon Terminal', 'Myelin Sheath', 'Blood Vessels'],
      correctAnswer: 'Dendrites',
      xpReward: 50,
    },
    {
      id: 'task-002',
      roomId: 'room-0',
      orderNumber: 2,
      title: 'Task 2: Linear Algebra & Matrix Multiplication in AI',
      instructions: 'Every Neural Network layer performs Matrix Multiplication (Y = W · X + B). Tensors (multi-dimensional matrices) allow GPUs to process millions of calculations simultaneously in parallel.',
      codeSnippet: 'import numpy as np\n# Inputs X (batch of 2 samples, 3 features)\nX = np.array([[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]])\n# Weight Matrix W (3 inputs -> 2 neurons)\nW = np.array([[0.1, 0.2], [0.3, 0.4], [0.5, 0.6]])\n\n# Matrix Multiplication\nY = np.dot(X, W)\nprint("Layer Output Matrix Shape:", Y.shape)',
      hint: 'Matrix Multiplication (W · X) computes all neuron outputs at once.',
      questionText: 'What mathematical operation enables GPUs to compute neuron layers in parallel?',
      options: ['Matrix Multiplication (Dot Product)', 'Polynomial Long Division', 'Prime Factorization', 'String Concatenation'],
      correctAnswer: 'Matrix Multiplication (Dot Product)',
      xpReward: 50,
    },
    {
      id: 'task-003',
      roomId: 'room-0',
      orderNumber: 3,
      title: 'Task 3: Calculus & How AI Learns (Backpropagation)',
      instructions: 'AI learns by minimizing Error Loss. Derivatives and Gradients (Calculus) calculate the slope of error. Gradient Descent updates weights (W = W - alpha * Gradient) using the Calculus Chain Rule.',
      codeSnippet: '# Gradient Descent Weight Update in Calculus\nlearning_rate = 0.01\nweight = 5.0 # Initial weight\ngradient = 2.4 # Partial derivative dLoss/dWeight\n\n# Calculus update step\nnew_weight = weight - (learning_rate * gradient)\nprint("Updated Weight:", new_weight)',
      hint: 'Gradients indicate the direction to adjust weights to decrease error.',
      questionText: 'Which mathematical field calculates error slopes to update neural network weights?',
      options: ['Calculus & Partial Derivatives', 'Euclidean Geometry', 'Combinatorics', 'Set Theory'],
      correctAnswer: 'Calculus & Partial Derivatives',
      xpReward: 50,
    },
    {
      id: 'task-004',
      roomId: 'room-0',
      orderNumber: 4,
      title: 'Task 4: Real-Time AI Applications (Self-Driving Cars & Medical MRI)',
      instructions: 'Real-time AI powers Tesla/Waymo self-driving vision (CNN camera processing in under 10ms), hospital MRI tumor detection, and Siri real-time voice synthesis.',
      codeSnippet: '# Real-Time Sensor Processing Loop\ndef process_frame(camera_feed):\n    bounding_boxes = cnn_model.detect(camera_feed)\n    if any(box.type == "pedestrian" for box in bounding_boxes):\n        return "Emergency Brake Active"\n    return "Clear Way"',
      hint: 'Real-time AI processes vision and sensor inputs in milliseconds.',
      questionText: 'What is a critical requirement for AI models running in self-driving cars?',
      options: ['Real-time low latency processing (<10ms)', 'Manual offline calculation', 'Printing output on paper', 'Weekly batch updates'],
      correctAnswer: 'Real-time low latency processing (<10ms)',
      xpReward: 50,
    },
    {
      id: 'task-005',
      roomId: 'room-0',
      orderNumber: 5,
      title: 'Task 5: Layer-by-Layer AI Architecture (Which Layer Does What?)',
      instructions: '1. Input Layer: Converts raw text to Token IDs. 2. Embedding Layer: Converts Token IDs to dense vectors. 3. Hidden Layers: Performs Matrix Multiplication (W · X + B) and Self-Attention. 4. Hardware Layer: Executes FP16/INT4 binary bitstreams on CUDA cores. 5. Output LM Head Layer: Computes Softmax probabilities over vocabulary words.',
      codeSnippet: '# Layer-by-Layer Forward Pass in PyTorch\ntoken_ids = tokenizer("AI is amazing")           # 1. Input Layer\nembeddings = embedding_layer(token_ids)         # 2. Embedding Layer\nhidden_states = transformer_hidden_layers(embeddings) # 3. Hidden Layers (W*X + B)\nlogits = lm_head_output_layer(hidden_states)     # 5. Output LM Head Layer\nprobs = torch.softmax(logits, dim=-1)             # Final Softmax Probabilities',
      hint: 'Token IDs are converted to dense vectors in the Embedding Layer, processed in Hidden Layers, and converted to probabilities in the Output LM Head Layer.',
      questionText: 'In which AI model layer is text converted from integer Token IDs into dense floating-point vectors?',
      options: ['Embedding Layer', 'Output LM Head Layer', 'Softmax Activation Layer', 'Storage Hardware Disk'],
      correctAnswer: 'Embedding Layer',
      xpReward: 50,
    },
  ];

  for (const t of tasksRoom0) {
    await prisma.learningTask.upsert({
      where: { id: t.id },
      update: t,
      create: t,
    });
  }

  // Seed tasks for room-1
  const tasksRoom1 = [
    {
      id: 'task-101',
      roomId: 'room-1',
      orderNumber: 1,
      title: 'Task 1: What is Artificial Intelligence?',
      instructions: 'Artificial Intelligence (AI) refers to systems or machines that mimic human intelligence to perform tasks and iteratively improve based on the information they collect.',
      codeSnippet: '# Example AI Decision Logic\ndef classify_number(n):\n    return "Positive" if n > 0 else "Non-Positive"',
      hint: 'AI encompasses Machine Learning and Deep Learning as subfields.',
      questionText: 'Which of the following is a subfield of Artificial Intelligence?',
      options: ['Machine Learning', 'Quantum Hardware', 'Raw Memory Storage', 'Optical Disks'],
      correctAnswer: 'Machine Learning',
      xpReward: 50,
    },
    {
      id: 'task-102',
      roomId: 'room-1',
      orderNumber: 2,
      title: 'Task 2: AI vs Machine Learning vs Deep Learning',
      instructions: 'Machine Learning is a subset of AI where systems learn from data without being explicitly programmed. Deep Learning uses multi-layered Neural Networks.',
      codeSnippet: 'import numpy as np\ndata = np.array([1, 2, 3, 4, 5])\nprint("Mean:", data.mean())',
      hint: 'Neural Networks drive Deep Learning.',
      questionText: 'What technology drives Deep Learning models?',
      options: ['Multi-Layer Neural Networks', 'Relational Databases', 'Hard Drives', 'SVG Graphics'],
      correctAnswer: 'Multi-Layer Neural Networks',
      xpReward: 50,
    },
    {
      id: 'task-103',
      roomId: 'room-1',
      orderNumber: 3,
      title: 'Task 3: Generative AI & Large Language Models',
      instructions: 'Generative AI creates new content (text, images, audio, code) based on patterns learned from vast training datasets.',
      codeSnippet: '# Prompting an AI Model\nprompt = "Explain quantum computing in simple terms"\nresponse = ai_model.generate(prompt)',
      hint: 'Generative AI produces original outputs.',
      questionText: 'What is the primary capability of Generative AI?',
      options: ['Generating new original content', 'Formatting disk drives', 'Counting spreadsheet rows', 'Replacing motherboard chips'],
      correctAnswer: 'Generating new original content',
      xpReward: 50,
    },
  ];

  for (const t of tasksRoom1) {
    await prisma.learningTask.upsert({
      where: { id: t.id },
      update: t,
      create: t,
    });
  }

  // Seed tasks for room-basic-tools (School & Everyday AI Tools)
  const tasksBasicTools = [
    {
      id: 'task-bt-1',
      roomId: 'room-basic-tools',
      orderNumber: 1,
      title: 'Task 1: Talking to AI — The Art of Prompt Crafting (3-Min Lesson)',
      instructions: 'A prompt is the instruction or question you give to an AI model like ChatGPT or Claude. Giving clear roles, context, and examples gets the best results!',
      codeSnippet: '# Good Prompt Structure:\n# 1. Role: "You are a friendly biology teacher"\n# 2. Context: "I am preparing for a 7th-grade science quiz"\n# 3. Request: "Explain photosynthesis with a funny emoji analogy"',
      hint: 'Clear instructions and context lead to accurate AI answers.',
      questionText: 'Which prompt technique produces the highest quality answers from an AI assistant?',
      options: ['Providing clear context, role, and constraints', 'Typing a single random word', 'Leaving the prompt box blank', 'Writing in binary numbers'],
      correctAnswer: 'Providing clear context, role, and constraints',
      xpReward: 50,
    },
    {
      id: 'task-bt-2',
      roomId: 'room-basic-tools',
      orderNumber: 2,
      title: 'Task 2: Visual AI — Generating Art from Natural Language',
      instructions: 'Tools like Midjourney, DALL-E, and Stable Diffusion turn text descriptions into realistic paintings, logos, and 3D scenes using Diffusion algorithms.',
      codeSnippet: '# Visual Diffusion Prompt Example:\n# "A friendly golden retriever wearing an astronaut helmet on Mars, Pixar 3D style, cinematic lighting"',
      hint: 'Diffusion models generate images by turning random noise into structured visuals.',
      questionText: 'What kind of AI tool generates images and digital art from text descriptions?',
      options: ['Text-to-Image Diffusion Models', 'Barcode Scanners', 'Network Cable Routers', 'Spreadsheet Formulas'],
      correctAnswer: 'Text-to-Image Diffusion Models',
      xpReward: 50,
    },
  ];

  for (const t of tasksBasicTools) {
    await prisma.learningTask.upsert({
      where: { id: t.id },
      update: t,
      create: t,
    });
  }

  // Seed tasks for room-adv-transformers (Advanced Transformers & LoRA)
  const tasksAdvTransformers = [
    {
      id: 'task-at-1',
      roomId: 'room-adv-transformers',
      orderNumber: 1,
      title: 'Task 1: Scaled Dot-Product Attention & Matrix Projections (4-Min Deep Dive)',
      instructions: 'Self-Attention projects input embeddings into Query (Q), Key (K), and Value (V) matrices. The dot product Q · Kᵀ is scaled by 1/√d_k to prevent vanishing softmax gradients.',
      codeSnippet: 'import torch\nimport math\n\ndef scaled_dot_product_attention(Q, K, V):\n    d_k = Q.size(-1)\n    scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(d_k)\n    attention_weights = torch.softmax(scores, dim=-1)\n    return torch.matmul(attention_weights, V), attention_weights',
      hint: 'Dividing by sqrt(d_k) stabilizes the variance of large dot products.',
      questionText: 'Why is the query-key dot product matrix divided by √d_k in Transformers?',
      options: ['To stabilize variance and avoid vanishing gradients in Softmax', 'To convert matrices into integers', 'To erase all memory caches', 'To invert the neural weights'],
      correctAnswer: 'To stabilize variance and avoid vanishing gradients in Softmax',
      xpReward: 100,
    },
    {
      id: 'task-at-2',
      roomId: 'room-adv-transformers',
      orderNumber: 2,
      title: 'Task 2: LoRA Weight Decomposition (ΔW = B · A)',
      instructions: 'Low-Rank Adaptation freezes base weights W0 (d × d) and represents updates as ΔW = B · A where B is (d × r) and A is (r × d) with rank r ≪ d, reducing trainable parameters by 99%.',
      codeSnippet: '# LoRA Forward Pass: h = W0*x + (alpha / r) * B * A * x\nimport torch.nn as nn\nclass LoRALinear(nn.Module):\n    def __init__(self, in_features, out_features, r=8, alpha=16):\n        super().__init__()\n        self.A = nn.Parameter(torch.randn(r, in_features))\n        self.B = nn.Parameter(torch.zeros(out_features, r))\n        self.scaling = alpha / r',
      hint: 'LoRA decomposes weight updates into two low-rank matrices A and B.',
      questionText: 'In LoRA fine-tuning, how are parameter updates ΔW structured?',
      options: ['Product of two low-rank matrices (B × A where rank r ≪ d)', 'Re-training all model layers from scratch', 'Converting all weights to single precision FP64', 'Deleting half of the transformer layers'],
      correctAnswer: 'Product of two low-rank matrices (B × A where rank r ≪ d)',
      xpReward: 100,
    },
  ];

  for (const t of tasksAdvTransformers) {
    await prisma.learningTask.upsert({
      where: { id: t.id },
      update: t,
      create: t,
    });
  }

  // Seed sample Certificate
  await prisma.userCertificate.upsert({
    where: { id: 'cert-1' },
    update: {},
    create: {
      id: 'cert-1',
      certificateHash: 'NEXUS-CERT-948210',
      userId: 'usr-1',
      trackName: 'Generative AI & LLM Specialist Track',
      scorePercent: 100,
    },
  });

  // ─── 15. Seed Content Interactions & Comments ───
  const interactions = [
    { id: 'inter-1', userId: 'usr-1', contentId: 'cnt-1', reaction: 'LIKE' as const, rating: 5, shared: true },
    { id: 'inter-2', userId: 'usr-2', contentId: 'cnt-1', reaction: 'LIKE' as const, rating: 5, shared: false },
    { id: 'inter-3', userId: 'usr-3', contentId: 'cnt-1', reaction: 'LIKE' as const, rating: 4, shared: true },
  ];

  for (const inter of interactions) {
    await prisma.contentInteraction.upsert({
      where: { userId_contentId: { userId: inter.userId, contentId: inter.contentId } },
      update: inter,
      create: inter,
    });
  }

  const sampleComments = [
    { id: 'cmt-1', userId: 'usr-1', contentId: 'cnt-1', text: 'Outstanding deep dive into Attention mechanisms and Transformer scaling laws!' },
    { id: 'cmt-2', userId: 'usr-2', contentId: 'cnt-1', text: 'Super helpful explanation of QLoRA 4-bit quantization. Highly recommended.' },
  ];

  for (const cmt of sampleComments) {
    await prisma.contentComment.upsert({
      where: { id: cmt.id },
      update: cmt,
      create: cmt,
    });
  }

  // ─── 16. Seed Learning Phases & Lessons ───
  const phases = [
    { id: 'phase-1', order: 1, title: 'Stage 1: AI Foundations & Intelligent Agents', description: 'Master symbolic rule-based AI, agent environments (PEAS), uninformed/informed search (A*), logic, and expert systems.', level: 'Beginner' as const, prereqPhaseId: null },
    { id: 'phase-2', order: 2, title: 'Stage 2: Machine Learning & Statistical Modeling', description: 'Supervised classification/regression, Random Forests, XGBoost, K-Means clustering, PCA, bias-variance tradeoff, and SHAP interpretability.', level: 'Intermediate' as const, prereqPhaseId: 'phase-1' },
    { id: 'phase-3', order: 3, title: 'Stage 3: Deep Learning & PyTorch Networks', description: 'Multi-layer perceptrons, backpropagation chain rule, SGD/AdamW optimizers, CNN spatial vision, LSTM sequence models, and Transformer self-attention math.', level: 'Intermediate' as const, prereqPhaseId: 'phase-2' },
    { id: 'phase-4', order: 4, title: 'Stage 4: Generative AI, LLMs & Autonomous Agents', description: 'BPE tokenization, pretraining vs alignment (DPO), prompt engineering, enterprise RAG vector DBs (FAISS/Qdrant), 4-bit QLoRA PEFT, and ReAct tool-calling agents.', level: 'Advanced' as const, prereqPhaseId: 'phase-3' },
    { id: 'phase-5', order: 5, title: 'AI Systems Design & High-Performance Inference', description: 'Design large-scale GPU clusters, vLLM serving engines, PagedAttention, and ONNX MLOps deployment.', level: 'Expert' as const, prereqPhaseId: 'phase-4' },
    { id: 'phase-6', order: 6, title: 'Expert Research & AI Frontiers', description: 'Multimodal representations, state-space models (Mamba), custom CUDA kernel optimization, and research leadership.', level: 'Expert' as const, prereqPhaseId: 'phase-5' },
  ];

  for (const phase of phases) {
    await prisma.learningPhase.upsert({
      where: { id: phase.id },
      update: phase,
      create: phase,
    });
  }

  // Link existing courses to phases
  await prisma.course.update({ where: { id: 'crs-0' }, data: { phaseId: 'phase-1' } });
  await prisma.course.update({ where: { id: 'crs-1' }, data: { phaseId: 'phase-1' } });
  await prisma.course.update({ where: { id: 'crs-2' }, data: { phaseId: 'phase-2' } });
  await prisma.course.update({ where: { id: 'crs-3' }, data: { phaseId: 'phase-2' } });
  await prisma.course.update({ where: { id: 'crs-4' }, data: { phaseId: 'phase-3' } });
  await prisma.course.update({ where: { id: 'crs-5' }, data: { phaseId: 'phase-5' } });
  await prisma.course.update({ where: { id: 'crs-6' }, data: { phaseId: 'phase-4' } });
  await prisma.course.update({ where: { id: 'crs-7' }, data: { phaseId: 'phase-5' } });
  await prisma.course.update({ where: { id: 'crs-8' }, data: { phaseId: 'phase-4' } });
  await prisma.course.update({ where: { id: 'crs-9' }, data: { phaseId: 'phase-3' } });
  await prisma.course.update({ where: { id: 'crs-10' }, data: { phaseId: 'phase-6' } });
  await prisma.course.update({ where: { id: 'crs-11' }, data: { phaseId: 'phase-4' } });

  // Seed Lessons for Courses
  const lessons = [
    // Phase 1 / Course crs-0 & crs-1 lessons
    { id: 'les-1', courseId: 'crs-0', order: 1, title: 'Introduction to AI Concepts & Mental Models', description: 'Visual introduction to AI, Machine Learning, and Neural Networks.', durationMinutes: 45, isRequired: true },
    { id: 'les-2', courseId: 'crs-0', order: 2, title: 'Understanding Data, Features, and Predictions', description: 'How computers see tables, images, and text features.', durationMinutes: 60, isRequired: true },
    { id: 'les-3', courseId: 'crs-1', order: 1, title: 'Python Syntax & NumPy Matrix Basics', description: 'Writing Python scripts and operating on multi-dimensional matrices.', durationMinutes: 90, isRequired: true },
    { id: 'les-4', courseId: 'crs-1', order: 2, title: 'Linear Algebra & Calculus for Optimization', description: 'Slopes, vectors, gradients, and loss function landscapes.', durationMinutes: 120, isRequired: true },

    // Phase 2 / Course crs-2 & crs-3 lessons
    { id: 'les-5', courseId: 'crs-2', order: 1, title: 'Supervised Learning & Regression Models', description: 'Linear regression, cost functions, and polynomial fitting.', durationMinutes: 150, isRequired: true },
    { id: 'les-6', courseId: 'crs-2', order: 2, title: 'Decision Trees, Ensembles, and Random Forests', description: 'Tree splitting rules, entropy, Gini impurity, and boosting.', durationMinutes: 180, isRequired: true },
    { id: 'les-7', courseId: 'crs-3', order: 1, title: 'PyTorch Tensors, Autograd, and Multi-Layer Perceptrons', description: 'Building neural network computational graphs in PyTorch.', durationMinutes: 240, isRequired: true },
    { id: 'les-8', courseId: 'crs-3', order: 2, title: 'Convolutional Neural Networks (CNNs) & Image Vision', description: 'Spatial convolutions, pooling layers, and ResNet architectures.', durationMinutes: 300, isRequired: true },

    // Phase 3 / Course crs-4 & crs-9 lessons
    { id: 'les-9', courseId: 'crs-4', order: 1, title: 'Self-Attention & Transformer Architecture Deep Dive', description: 'Query-Key-Value attention math, positional encodings, and multi-head scaling.', durationMinutes: 320, isRequired: true },
    { id: 'les-10', courseId: 'crs-4', order: 2, title: 'Vector Databases, Embeddings, and Enterprise RAG', description: 'Building semantic search engines with Pinecone, Qdrant, and LangChain.', durationMinutes: 280, isRequired: true },
    { id: 'les-17', courseId: 'crs-9', order: 1, title: 'Vision Transformers (ViT) & Multimodal Alignment', description: 'Cross-attention fusion with CLIP, LLaVA, and SigLIP architectures.', durationMinutes: 290, isRequired: true },
    { id: 'les-18', courseId: 'crs-9', order: 2, title: 'Real-time Object Detection with YOLOv11 & TensorRT', description: 'Anchor-free bounding boxes, non-max suppression, and edge inference.', durationMinutes: 310, isRequired: true },

    // Phase 4 / Course crs-6, crs-8 & crs-11 lessons
    { id: 'les-13', courseId: 'crs-6', order: 1, title: 'LangGraph State Machines & Tool Integration', description: 'Cyclic graphs, checkpointing, and Model Context Protocol (MCP) integrations.', durationMinutes: 330, isRequired: true },
    { id: 'les-14', courseId: 'crs-6', order: 2, title: 'Autonomous Multi-Agent Collaboration Swarms', description: 'Supervisor and hierarchical multi-agent teams with human approval gates.', durationMinutes: 350, isRequired: true },
    { id: 'les-15', courseId: 'crs-8', order: 1, title: 'Entity Knowledge Graphs with Neo4j & Cypher', description: 'Extracting knowledge triples and constructing domain graphs for RAG.', durationMinutes: 290, isRequired: true },
    { id: 'les-16', courseId: 'crs-8', order: 2, title: 'Hybrid Dense-Sparse Vector Retrieval & Reranking', description: 'Fusing BM25 keyword matching with dense vectors and Cohere cross-encoders.', durationMinutes: 310, isRequired: true },
    { id: 'les-21', courseId: 'crs-11', order: 1, title: 'Quantizing Small Language Models (SLMs) with GGUF & ONNX', description: '4-bit AWQ and GGUF quantization for Phi-4, Gemma-2, and Qwen-2.5.', durationMinutes: 260, isRequired: true },
    { id: 'les-22', courseId: 'crs-11', order: 2, title: 'On-Device Mobile AI Inference with CoreML & WebGPU', description: 'Running offline neural models in browser and edge hardware.', durationMinutes: 280, isRequired: true },

    // Phase 5 / Course crs-5 & crs-7 lessons
    { id: 'les-11', courseId: 'crs-5', order: 1, title: 'LoRA & QLoRA Parameter Efficient Fine-Tuning', description: 'Fine-tuning LLaMA models using rank decomposition matrices.', durationMinutes: 360, isRequired: true },
    { id: 'les-12', courseId: 'crs-5', order: 2, title: 'Distributed GPU Inference with vLLM & ONNX', description: 'Model quantization, PagedAttention, and high-throughput serving.', durationMinutes: 400, isRequired: true },
    { id: 'les-19', courseId: 'crs-7', order: 1, title: 'High-Throughput Serving with PagedAttention & vLLM', description: 'Dynamic batching, KV-cache sharing, and continuous batching architectures.', durationMinutes: 380, isRequired: true },
    { id: 'les-20', courseId: 'crs-7', order: 2, title: 'Triton Inference Server & TensorRT-LLM Acceleration', description: 'Serving FP8/FP4 models on Kubernetes with sub-10ms latency SLAs.', durationMinutes: 420, isRequired: true },

    // Phase 6 / Course crs-10 lessons
    { id: 'les-23', courseId: 'crs-10', order: 1, title: 'OWASP Top 10 for LLMs & Jailbreak Defense', description: 'Simulating prompt injections, indirect injections, and safety jailbreaks.', durationMinutes: 300, isRequired: true },
    { id: 'les-24', courseId: 'crs-10', order: 2, title: 'NVIDIA NeMo Guardrails & Enterprise Compliance', description: 'Topical rails, execution safety, and automated hallucination mitigations.', durationMinutes: 320, isRequired: true },
  ];

  for (const les of lessons) {
    await prisma.lesson.upsert({
      where: { id: les.id },
      update: les,
      create: les,
    });
  }

  // Seed progress for test users (e.g. usr-1 Sarah - Super Admin, usr-7 David - Learner, usr-9 John Doe)
  // Let's seed David (usr-7) as an active learner who completed Phase 1 and Phase 2, and is in progress on Phase 3
  const userLessonProgressList = [
    // Phase 1 lessons completed by usr-7
    { id: 'ulp-1', userId: 'usr-7', lessonId: 'les-1', completed: true, completedAt: new Date(Date.now() - 10 * 86400000) },
    { id: 'ulp-2', userId: 'usr-7', lessonId: 'les-2', completed: true, completedAt: new Date(Date.now() - 9 * 86400000) },
    { id: 'ulp-3', userId: 'usr-7', lessonId: 'les-3', completed: true, completedAt: new Date(Date.now() - 7 * 86400000) },
    { id: 'ulp-4', userId: 'usr-7', lessonId: 'les-4', completed: true, completedAt: new Date(Date.now() - 5 * 86400000) },

    // Phase 2 lessons completed by usr-7
    { id: 'ulp-5', userId: 'usr-7', lessonId: 'les-5', completed: true, completedAt: new Date(Date.now() - 4 * 86400000) },
    { id: 'ulp-6', userId: 'usr-7', lessonId: 'les-6', completed: true, completedAt: new Date(Date.now() - 3 * 86400000) },
    { id: 'ulp-7', userId: 'usr-7', lessonId: 'les-7', completed: true, completedAt: new Date(Date.now() - 2 * 86400000) },
    { id: 'ulp-8', userId: 'usr-7', lessonId: 'les-8', completed: true, completedAt: new Date(Date.now() - 1 * 86400000) },

    // Phase 3 lesson in progress by usr-7
    { id: 'ulp-9', userId: 'usr-7', lessonId: 'les-9', completed: true, completedAt: new Date() },

    // Progress for usr-1 Sarah (completed all up to phase 3)
    { id: 'ulp-10', userId: 'usr-1', lessonId: 'les-1', completed: true, completedAt: new Date(Date.now() - 12 * 86400000) },
    { id: 'ulp-11', userId: 'usr-1', lessonId: 'les-2', completed: true, completedAt: new Date(Date.now() - 11 * 86400000) },
    { id: 'ulp-12', userId: 'usr-1', lessonId: 'les-3', completed: true, completedAt: new Date(Date.now() - 10 * 86400000) },
    { id: 'ulp-13', userId: 'usr-1', lessonId: 'les-4', completed: true, completedAt: new Date(Date.now() - 8 * 86400000) },
    { id: 'ulp-14', userId: 'usr-1', lessonId: 'les-9', completed: true, completedAt: new Date(Date.now() - 2 * 86400000) },
    { id: 'ulp-15', userId: 'usr-1', lessonId: 'les-10', completed: true, completedAt: new Date() },
  ];

  for (const ulp of userLessonProgressList) {
    await prisma.userLessonProgress.upsert({
      where: { userId_lessonId: { userId: ulp.userId, lessonId: ulp.lessonId } },
      update: ulp,
      create: ulp,
    });
  }

  // Seed Quiz Attempts
  const quizAttempts = [
    { id: 'uqa-1', userId: 'usr-7', assessmentId: 'asm-1', score: 95, passed: true, attemptedAt: new Date(Date.now() - 8 * 86400000) },
    { id: 'uqa-2', userId: 'usr-7', assessmentId: 'asm-2', score: 88, passed: true, attemptedAt: new Date(Date.now() - 5 * 86400000) },
    { id: 'uqa-3', userId: 'usr-7', assessmentId: 'asm-3', score: 92, passed: true, attemptedAt: new Date(Date.now() - 2 * 86400000) },
    { id: 'uqa-4', userId: 'usr-1', assessmentId: 'asm-1', score: 100, passed: true, attemptedAt: new Date(Date.now() - 10 * 86400000) },
    { id: 'uqa-5', userId: 'usr-1', assessmentId: 'asm-3', score: 96, passed: true, attemptedAt: new Date(Date.now() - 4 * 86400000) },
  ];

  for (const uqa of quizAttempts) {
    await prisma.userQuizAttempt.upsert({
      where: { id: uqa.id },
      update: uqa,
      create: uqa,
    });
  }

  // Seed Project Progress
  const projectProgressList = [
    { id: 'upp-1', userId: 'usr-7', projectId: 'prj-1', status: 'Published' as const, completedAt: new Date(Date.now() - 6 * 86400000) },
    { id: 'upp-2', userId: 'usr-7', projectId: 'prj-2', status: 'Published' as const, completedAt: new Date(Date.now() - 1 * 86400000) },
    { id: 'upp-3', userId: 'usr-7', projectId: 'prj-3', status: 'InReview' as const },
    { id: 'upp-4', userId: 'usr-1', projectId: 'prj-2', status: 'Published' as const, completedAt: new Date(Date.now() - 5 * 86400000) },
  ];

  for (const upp of projectProgressList) {
    await prisma.userProjectProgress.upsert({
      where: { userId_projectId: { userId: upp.userId, projectId: upp.projectId } },
      update: upp,
      create: upp,
    });
  }

  // Seed User Activity Logs (for streak & time-spent calculation)
  // David (usr-7) active for last 7 consecutive days
  const activityLogs = [];
  for (let i = 0; i < 7; i++) {
    activityLogs.push({
      id: `act-usr7-${i}`,
      userId: 'usr-7',
      activityType: 'LESSON_LEARNING',
      durationSeconds: 3600 * (i + 1) + 1800, // total approx 26.5 hours
      createdAt: new Date(Date.now() - i * 86400000),
    });
  }
  // Sarah (usr-1) active for last 4 days
  for (let i = 0; i < 4; i++) {
    activityLogs.push({
      id: `act-usr1-${i}`,
      userId: 'usr-1',
      activityType: 'LESSON_LEARNING',
      durationSeconds: 7200,
      createdAt: new Date(Date.now() - i * 86400000),
    });
  }

  for (const act of activityLogs) {
    await prisma.userActivity.upsert({
      where: { id: act.id },
      update: act,
      create: act,
    });
  }

  console.log(`  ✅ Seeded ${phases.length} Phases, ${lessons.length} Lessons, and user progress records`);

  console.log('\n🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
