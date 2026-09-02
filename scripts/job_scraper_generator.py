#!/usr/bin/env python3
"""
AI & ML Career Job Scraper & Dataset Generator
Compiles 30+ high-tier AI/ML/DL/GenAI jobs across India and Abroad with Rupee salary formatting.
"""

import json

jobs = [
    # ==========================================
    # 🇮🇳 JOBS IN INDIA (15 ROLES)
    # ==========================================
    {
        "id": "job-sec-1",
        "title": "Senior AI Threat Intelligence & Adversarial Defense Engineer",
        "company": "CrowdStrike AI Defense Labs",
        "companyLogo": "🛡️",
        "location": "Bengaluru, India / Remote (Hybrid)",
        "region": "India",
        "workplaceType": "Hybrid",
        "experienceRange": "2-4 Years",
        "minExperienceYears": 2,
        "maxExperienceYears": 4,
        "salaryRange": "₹28,00,000 - ₹48,00,000 / yr",
        "currency": "INR",
        "jobType": "Full-time",
        "category": "Cybersecurity & AI Defense",
        "tags": ["India Role", "Threat Detection", "High Compensation", "₹28-48 LPA"],
        "techStack": ["PyTorch", "eBPF", "Adversarial Robustness (ART)", "MITRE ATT&CK", "Cyber Threat Intel", "FastAPI"],
        "description": "Lead our threat research squad building deep learning telemetry models that detect zero-day kernel exploits, ransomware behavior, and adversarial attacks against enterprise neural endpoints.",
        "responsibilities": [
            "Design deep learning classifiers over streaming kernel telemetry and eBPF system call graphs.",
            "Implement adversarial robustness defenses against evasion and data poisoning attacks.",
            "Map neural threat signatures to the MITRE ATT&CK enterprise cybersecurity matrix."
        ],
        "requirements": [
            "2-4 years experience at the intersection of Cybersecurity, SIEM/SOC telemetry, and PyTorch.",
            "Understanding of adversarial machine learning (FGSM, PGD attacks, defensive distillation)."
        ],
        "benefits": ["Top-of-market equity stock options", "Full family health insurance + wellness stipend"],
        "postedDate": "1 day ago",
        "applicantsCount": 38,
        "featured": True
    },
    {
        "id": "job-1",
        "title": "Junior AI & ML Systems Engineer",
        "company": "Anthropic Partner Labs",
        "companyLogo": "🤖",
        "location": "Bengaluru, India (Hybrid)",
        "region": "India",
        "workplaceType": "Hybrid",
        "experienceRange": "0-1 Years",
        "minExperienceYears": 0,
        "maxExperienceYears": 1,
        "salaryRange": "₹12,00,000 - ₹20,00,000 / yr",
        "currency": "INR",
        "jobType": "Full-time",
        "category": "Machine Learning",
        "tags": ["India Role", "Freshers Welcome", "High Growth", "₹12-20 LPA"],
        "techStack": ["Python", "PyTorch", "Scikit-Learn", "FastAPI", "Docker", "SQL"],
        "description": "Build, evaluate, and deploy scalable machine learning services and fine-tuned neural models for enterprise AI automation pipelines.",
        "responsibilities": [
            "Develop end-to-end data preprocessing and feature extraction pipelines in Python/Pandas.",
            "Train and evaluate classical ML and deep learning models with PyTorch and Scikit-Learn.",
            "Package models into containerized FastAPI microservices."
        ],
        "requirements": [
            "B.Tech / M.Tech in CS/AI/Data Science or verified AI Nexus Certificate.",
            "Strong understanding of Supervised/Unsupervised ML and Backpropagation calculus.",
            "Hands-on portfolio of GitHub AI projects."
        ],
        "benefits": ["Hybrid flexibility (2 days in office)", "₹1,00,000 annual learning stipend"],
        "postedDate": "2 days ago",
        "applicantsCount": 42,
        "featured": True
    },
    {
        "id": "job-sec-2",
        "title": "LLM Security & Red-Teaming Vulnerability Specialist",
        "company": "Palo Alto Networks Cyber AI",
        "companyLogo": "🔥",
        "location": "Bengaluru / Hyderabad, India",
        "region": "India",
        "workplaceType": "Hybrid",
        "experienceRange": "1-3 Years",
        "minExperienceYears": 1,
        "maxExperienceYears": 3,
        "salaryRange": "₹22,00,000 - ₹38,00,000 / yr",
        "currency": "INR",
        "jobType": "Full-time",
        "category": "Cybersecurity & AI Defense",
        "tags": ["India Role", "Red Teaming", "OWASP Top 10", "₹22-38 LPA"],
        "techStack": ["Python", "PyRIT", "NeMo Guardrails", "LangChain", "Burp Suite", "Adversarial Prompts"],
        "description": "Probe enterprise LLM applications for indirect prompt injections, jailbreaks, SSRF tool abuse, system prompt extraction, and RAG data leakage vulnerabilities.",
        "responsibilities": [
            "Conduct automated adversarial red-teaming against frontier LLM pipelines using Microsoft PyRIT.",
            "Implement multi-layer input/output guardrails using NVIDIA NeMo and Llama-Guard.",
            "Author comprehensive penetration testing reports and vulnerability remediation guides."
        ],
        "requirements": [
            "1-3 years experience in Application Security, Pentesting, or AI safety evaluation.",
            "Demonstrated experience auditing OWASP Top 10 for Large Language Models."
        ],
        "benefits": ["Annual wellness allowance", "Comprehensive parental leave"],
        "postedDate": "3 days ago",
        "applicantsCount": 19,
        "featured": True
    },
    {
        "id": "job-2",
        "title": "Generative AI & LLM Application Engineer",
        "company": "Cognizant AI Labs",
        "companyLogo": "✨",
        "location": "Hyderabad / Pune, India",
        "region": "India",
        "workplaceType": "Hybrid",
        "experienceRange": "1-3 Years",
        "minExperienceYears": 1,
        "maxExperienceYears": 3,
        "salaryRange": "₹16,00,000 - ₹28,00,000 / yr",
        "currency": "INR",
        "jobType": "Full-time",
        "category": "Generative AI & LLMs",
        "tags": ["India Role", "RAG Systems", "Vector DB", "₹16-28 LPA"],
        "techStack": ["LangChain", "LlamaIndex", "Qdrant", "OpenAI API", "FastAPI", "TypeScript"],
        "description": "Architect industrial-grade Retrieval-Augmented Generation (RAG) applications, multi-agent reasoning workflows, and low-latency LLM microservices.",
        "responsibilities": [
            "Implement hybrid search combining BM25 keyword matching with dense Qdrant vector retrieval.",
            "Fine-tune smaller open-weight models (Llama 3 8B, Mistral 7B) using LoRA / QLoRA.",
            "Integrate automated hallucination guards and token cost monitoring telemetry."
        ],
        "requirements": [
            "1-3 years production experience with LangChain, LlamaIndex, or native vector database SDKs.",
            "Strong grasp of BPE tokenization, embedding distance metrics, and context window limits."
        ],
        "benefits": ["Work-from-anywhere policy 1 month/year", "Performance bonus up to 20%"],
        "postedDate": "3 days ago",
        "applicantsCount": 65,
        "featured": False
    },
    {
        "id": "job-3",
        "title": "Computer Vision & Edge AI Specialist",
        "company": "Tata Consultancy Services (TCS) Innovation Hub",
        "companyLogo": "📷",
        "location": "Chennai / Bengaluru, India",
        "region": "India",
        "workplaceType": "Onsite",
        "experienceRange": "2-4 Years",
        "minExperienceYears": 2,
        "maxExperienceYears": 4,
        "salaryRange": "₹18,00,000 - ₹32,00,000 / yr",
        "currency": "INR",
        "jobType": "Full-time",
        "category": "Computer Vision",
        "tags": ["India Role", "Edge Vision", "YOLOv11", "₹18-32 LPA"],
        "techStack": ["PyTorch", "OpenCV", "YOLOv11", "TensorRT", "ONNX Runtime", "C++"],
        "description": "Deploy real-time object detection, segmentation, and visual anomaly detection models onto embedded edge devices (NVIDIA Jetson, Raspberry Pi).",
        "responsibilities": [
            "Train custom YOLOv11 and ResNet vision models for industrial automation and crop pathology.",
            "Quantize FP32 models to INT8 / FP16 using NVIDIA TensorRT for sub-15ms edge inference.",
            "Build robust video stream ingestion pipelines with OpenCV and GStreamer."
        ],
        "requirements": [
            "2-4 years experience in Computer Vision and deep convolutional neural networks.",
            "Proven track record exporting and benchmarking models on ONNX / TensorRT runtimes."
        ],
        "benefits": ["Relocation allowance to Chennai/Bengaluru", "Medical insurance for spouse and parents"],
        "postedDate": "4 days ago",
        "applicantsCount": 28,
        "featured": False
    },
    {
        "id": "job-4",
        "title": "Junior MLOps & AI Infrastructure Engineer",
        "company": "Wipro Enterprise AI Platforms",
        "companyLogo": "⚙️",
        "location": "Noida / Gurgaon, India",
        "region": "India",
        "workplaceType": "Remote",
        "experienceRange": "0-2 Years",
        "minExperienceYears": 0,
        "maxExperienceYears": 2,
        "salaryRange": "₹11,00,000 - ₹19,00,000 / yr",
        "currency": "INR",
        "jobType": "Full-time",
        "category": "MLOps & Infrastructure",
        "tags": ["India Role", "Remote India", "Docker & K8s", "₹11-19 LPA"],
        "techStack": ["Docker", "Kubernetes", "MLflow", "GitHub Actions", "Python", "Prometheus"],
        "description": "Automate continuous training, testing, artifact versioning, and deployment of machine learning pipelines in cloud Kubernetes environments.",
        "responsibilities": [
            "Maintain automated CI/CD workflows for ML model evaluation and containerized deployment.",
            "Configure experiment tracking and model registry servers using MLflow and DVC.",
            "Monitor inference latency, GPU memory saturation, and feature drift in production."
        ],
        "requirements": [
            "0-2 years experience with Linux, Docker, Git workflows, and Python scripting.",
            "Foundational understanding of MLOps lifecycle from data ingestion to model serving."
        ],
        "benefits": ["100% Remote within India", "Internet & home ergonomic setup allowance"],
        "postedDate": "5 days ago",
        "applicantsCount": 51,
        "featured": False
    },
    {
        "id": "job-in-07",
        "title": "Autonomous AI Agent Engineer (LangGraph & MCP)",
        "company": "Infosys AI Innovation Hub",
        "companyLogo": "⚡",
        "location": "Bengaluru / Pune, India",
        "region": "India",
        "workplaceType": "Hybrid",
        "experienceRange": "1-3 Years",
        "minExperienceYears": 1,
        "maxExperienceYears": 3,
        "salaryRange": "₹18,00,000 - ₹32,00,000 / yr",
        "currency": "INR",
        "jobType": "Full-time",
        "category": "Generative AI & LLMs",
        "tags": ["India Role", "Multi-Agent", "LangGraph", "₹18-32 LPA"],
        "techStack": ["LangGraph", "Model Context Protocol (MCP)", "FastAPI", "Ollama", "Qdrant", "Docker"],
        "description": "Architect stateful, multi-agent AI workflows where specialized autonomous agents collaborate on software engineering, code review, and data analysis tasks.",
        "responsibilities": [
            "Design state graph machines with persistent memory and reflection loops in LangGraph.",
            "Implement Model Context Protocol (MCP) server integrations for enterprise databases and APIs.",
            "Optimize latency and token cost using local quantized Ollama models and cloud fallback."
        ],
        "requirements": [
            "1-3 years building production LLM apps with tool calling and ReAct loops.",
            "Strong proficiency in asynchronous Python (asyncio, FastAPI) and vector databases."
        ],
        "benefits": ["Performance bonus up to 20%", "Comprehensive health coverage"],
        "postedDate": "1 day ago",
        "applicantsCount": 27,
        "featured": False
    },
    {
        "id": "job-in-08",
        "title": "Precision Agriculture AI & Remote Sensing Specialist",
        "company": "Fasal AgriTech Labs",
        "companyLogo": "🌱",
        "location": "Bengaluru / Pune, India",
        "region": "India",
        "workplaceType": "Hybrid",
        "experienceRange": "0-2 Years",
        "minExperienceYears": 0,
        "maxExperienceYears": 2,
        "salaryRange": "₹10,00,000 - ₹18,00,000 / yr",
        "currency": "INR",
        "jobType": "Full-time",
        "category": "Computer Vision",
        "tags": ["India Role", "AgriTech AI", "Remote Sensing", "₹10-18 LPA"],
        "techStack": ["PyTorch", "ResNet", "Sentinel-2 Satellite Imagery", "GeoTIFF", "FastAPI"],
        "description": "Build AI vision models that diagnose crop leaf diseases, predict soil moisture from satellite multispectral bands, and deliver localized advisory to Indian farmers.",
        "responsibilities": [
            "Train lightweight CNN leaf pathology classifiers and deploy with ONNX on mobile apps.",
            "Process Sentinel-2 and Landsat multispectral bands for NDVI and soil index forecasting.",
            "Integrate multi-lingual vernacular voice advisory APIs in Hindi, Kannada, Telugu, and Tamil."
        ],
        "requirements": [
            "0-2 years in Computer Vision, geospatial data processing, or deep learning.",
            "Passion for building transformative AI solutions for Indian agriculture."
        ],
        "benefits": ["Field trip stipends across India", "Health & accident insurance"],
        "postedDate": "4 days ago",
        "applicantsCount": 35,
        "featured": False
    },
    {
        "id": "job-in-09",
        "title": "MLOps & High-Throughput Inference Engineer",
        "company": "Swiggy Core AI Platforms",
        "companyLogo": "🚀",
        "location": "Bengaluru, India",
        "region": "India",
        "workplaceType": "Hybrid",
        "experienceRange": "2-4 Years",
        "minExperienceYears": 2,
        "maxExperienceYears": 4,
        "salaryRange": "₹32,00,000 - ₹55,00,000 / yr",
        "currency": "INR",
        "jobType": "Full-time",
        "category": "MLOps & Infrastructure",
        "tags": ["India Role", "High Scale", "vLLM & Triton", "₹32-55 LPA"],
        "techStack": ["vLLM", "Triton Server", "Kubernetes", "Ray", "CUDA", "Prometheus"],
        "description": "Architect sub-10ms neural inference clusters handling millions of daily delivery routing, ETA predictions, and search recommendations.",
        "responsibilities": [
            "Deploy and scale Triton Inference Server clusters on GPU Kubernetes nodes.",
            "Optimize model serving using FP8 quantization, continuous batching, and PagedAttention.",
            "Build real-time feature stores and drift monitoring dashboards in Prometheus/Grafana."
        ],
        "requirements": [
            "2-4 years experience with Kubernetes, high-concurrency microservices, and PyTorch inference.",
            "Hands-on experience with vLLM, TensorRT-LLM, or Triton Server."
        ],
        "benefits": ["High-value food credits & Swiggy One membership", "Generous ESOP grants"],
        "postedDate": "1 day ago",
        "applicantsCount": 45,
        "featured": True
    },
    {
        "id": "job-in-10",
        "title": "Conversational AI & Indic NLP Specialist",
        "company": "Sarvam AI Labs",
        "companyLogo": "🗣️",
        "location": "Bengaluru, India",
        "region": "India",
        "workplaceType": "Onsite",
        "experienceRange": "1-3 Years",
        "minExperienceYears": 1,
        "maxExperienceYears": 3,
        "salaryRange": "₹26,00,000 - ₹45,00,000 / yr",
        "currency": "INR",
        "jobType": "Full-time",
        "category": "Generative AI & LLMs",
        "tags": ["India Role", "Indic LLMs", "Voice AI", "₹26-45 LPA"],
        "techStack": ["PyTorch", "Whisper", "FlashAttention-2", "HuggingFace", "IndicBERT", "Triton"],
        "description": "Train and fine-tune state-of-the-art speech-to-text and LLM foundational models optimized for 10+ Indian languages and dialect variations.",
        "responsibilities": [
            "Pre-train and instruction-tune multilingual language models on diverse Indic corpora.",
            "Fine-tune Whisper and Conformer acoustic models for noisy Indian phone audio.",
            "Build real-time low-latency voice bot pipelines connecting STT -> LLM -> TTS."
        ],
        "requirements": [
            "1-3 years in NLP, Speech Recognition, or LLM pre-training/fine-tuning.",
            "Fluency in Hindi, Kannada, Tamil, Telugu, or other Indian languages is a huge plus."
        ],
        "benefits": ["Frontier AI research environment", "Generous seed-stage equity"],
        "postedDate": "2 days ago",
        "applicantsCount": 39,
        "featured": True
    },
    {
        "id": "job-in-11",
        "title": "Healthcare AI & Medical Imaging Diagnostics Engineer",
        "company": "Qure.ai Health Informatics",
        "companyLogo": "🏥",
        "location": "Mumbai / Bengaluru, India",
        "region": "India",
        "workplaceType": "Hybrid",
        "experienceRange": "1-3 Years",
        "minExperienceYears": 1,
        "maxExperienceYears": 3,
        "salaryRange": "₹20,00,000 - ₹36,00,000 / yr",
        "currency": "INR",
        "jobType": "Full-time",
        "category": "Computer Vision",
        "tags": ["India Role", "MedTech AI", "DICOM & 3D U-Net", "₹20-36 LPA"],
        "techStack": ["PyTorch", "MONAI", "3D U-Net", "DICOM", "CUDA", "FastAPI"],
        "description": "Train clinical-grade deep learning models that detect tuberculosis, lung nodules, and intracranial hemorrhages from X-ray and CT scans.",
        "responsibilities": [
            "Implement 3D convolutional networks and vision transformers using MONAI and PyTorch.",
            "Perform rigorous ROC-AUC, sensitivity, and specificity validations against radiologist annotations.",
            "Optimize inference runtimes for deployment in rural hospital PACS systems."
        ],
        "requirements": [
            "1-3 years experience in Medical Computer Vision or Deep Learning.",
            "Familiarity with DICOM data formats and medical image augmentations."
        ],
        "benefits": ["Comprehensive medical coverage for entire family", "Annual wellness grant"],
        "postedDate": "3 days ago",
        "applicantsCount": 21,
        "featured": False
    },
    {
        "id": "job-in-12",
        "title": "AI Product Data Scientist & Recommendation Engineer",
        "company": "Flipkart Internet",
        "companyLogo": "🛍️",
        "location": "Bengaluru, India",
        "region": "India",
        "workplaceType": "Hybrid",
        "experienceRange": "1-3 Years",
        "minExperienceYears": 1,
        "maxExperienceYears": 3,
        "salaryRange": "₹24,00,000 - ₹40,00,000 / yr",
        "currency": "INR",
        "jobType": "Full-time",
        "category": "Data Science",
        "tags": ["India Role", "E-Commerce AI", "RecSys", "₹24-40 LPA"],
        "techStack": ["Python", "Two-Tower RecSys", "XGBoost", "PySpark", "BigQuery", "A/B Testing"],
        "description": "Develop multi-stage recommendation and ranking models optimizing personalized feeds, product search ranking, and CTR prediction across 500M+ monthly queries.",
        "responsibilities": [
            "Train two-tower neural candidate generation and cross-entropy ranking models in PyTorch.",
            "Execute rigorous online A/B tests tracking Gross Merchandise Value (GMV) and click-through rate.",
            "Scale offline feature engineering pipelines over terabytes of daily clickstream telemetry."
        ],
        "requirements": [
            "1-3 years in Data Science, Recommendation Systems, or Search Ranking.",
            "Strong command of statistical significance testing, causal inference, and SQL."
        ],
        "benefits": ["Flipkart employee discounts", "Comprehensive insurance + wellness funds"],
        "postedDate": "2 days ago",
        "applicantsCount": 54,
        "featured": False
    },
    {
        "id": "job-in-13",
        "title": "FinTech Fraud & Graph Anomaly Detection Specialist",
        "company": "Razorpay Risk AI Labs",
        "companyLogo": "💳",
        "location": "Bengaluru, India",
        "region": "India",
        "workplaceType": "Hybrid",
        "experienceRange": "2-4 Years",
        "minExperienceYears": 2,
        "maxExperienceYears": 4,
        "salaryRange": "₹28,00,000 - ₹46,00,000 / yr",
        "currency": "INR",
        "jobType": "Full-time",
        "category": "Machine Learning",
        "tags": ["India Role", "FinTech AI", "GNNs & Fraud", "₹28-46 LPA"],
        "techStack": ["PyTorch Geometric", "XGBoost", "Kafka", "Graph Neural Networks", "Redis", "FastAPI"],
        "description": "Build real-time graph neural networks and gradient boosting ensembles that detect payment fraud, card testing rings, and merchant wash trading in sub-50ms.",
        "responsibilities": [
            "Construct dynamic transaction graph topologies in Neo4j and PyTorch Geometric.",
            "Train temporal GNNs that classify high-velocity syndicate attack behaviors.",
            "Maintain sub-50ms p99 inference SLAs over streaming payment rails."
        ],
        "requirements": [
            "2-4 years experience in Fraud Analytics, FinTech risk scoring, or Graph ML.",
            "Deep understanding of imbalanced classification metrics (PR-AUC, F-beta)."
        ],
        "benefits": ["Generous ESOP grants", "Unlimited paid time off (PTO) policy"],
        "postedDate": "1 day ago",
        "applicantsCount": 36,
        "featured": False
    },
    {
        "id": "job-in-14",
        "title": "AI Robotic Process Automation & Document Intelligence Lead",
        "company": "Persistent Systems AI",
        "companyLogo": "📑",
        "location": "Pune / Hyderabad, India",
        "region": "India",
        "workplaceType": "Hybrid",
        "experienceRange": "2-4 Years",
        "minExperienceYears": 2,
        "maxExperienceYears": 4,
        "salaryRange": "₹20,00,000 - ₹34,00,000 / yr",
        "currency": "INR",
        "jobType": "Full-time",
        "category": "Generative AI & LLMs",
        "tags": ["India Role", "Document AI", "LayoutLMv3", "₹20-34 LPA"],
        "techStack": ["LayoutLMv3", "Donut", "PyTorch", "FastAPI", "Tesseract", "LangChain"],
        "description": "Deploy multimodal document AI pipelines for automated financial invoice extraction, KYC verification, and insurance claim processing.",
        "responsibilities": [
            "Fine-tune LayoutLMv3 and Donut multimodal models on complex tabular invoices.",
            "Build zero-shot information extraction pipelines with structured JSON schemas.",
            "Integrate human-in-the-loop validation dashboards for edge ambiguity cases."
        ],
        "requirements": [
            "2-4 years in Document AI, Optical Character Recognition (OCR), or Multimodal NLP.",
            "Experience with HuggingFace Transformers and FastAPI microservices."
        ],
        "benefits": ["Relocation grant to Pune", "Annual certification sponsorship"],
        "postedDate": "3 days ago",
        "applicantsCount": 25,
        "featured": False
    },
    {
        "id": "job-in-15",
        "title": "Junior Data Scientist (Predictive Analytics & Forecasting)",
        "company": "Reliance Jio AI Platforms",
        "companyLogo": "📡",
        "location": "Navi Mumbai / Bengaluru, India",
        "region": "India",
        "workplaceType": "Onsite",
        "experienceRange": "0-2 Years",
        "minExperienceYears": 0,
        "maxExperienceYears": 2,
        "salaryRange": "₹9,50,000 - ₹16,00,000 / yr",
        "currency": "INR",
        "jobType": "Full-time",
        "category": "Data Science",
        "tags": ["India Role", "Telecom AI", "Time Series", "₹9.5-16 LPA"],
        "techStack": ["Python", "Pandas", "Prophet", "LightGBM", "SQL", "Tableau"],
        "description": "Forecast 5G network traffic congestion, predict subscriber churn, and optimize bandwidth allocation using statistical time-series and ensemble models.",
        "responsibilities": [
            "Build automated cell-tower traffic prediction pipelines using Prophet and LightGBM.",
            "Analyze telecommunication usage trends across 450M+ active subscriber profiles.",
            "Author executive Tableau dashboards highlighting network optimization gains."
        ],
        "requirements": [
            "0-2 years in Data Science, Time Series forecasting, or Applied Statistics.",
            "Strong SQL data wrangling and Python Pandas fluency."
        ],
        "benefits": ["Free high-speed JioFiber & 5G services", "Corporate transport bus service"],
        "postedDate": "4 days ago",
        "applicantsCount": 68,
        "featured": False
    },

    # ==========================================
    # 🌍 JOBS ABROAD & GLOBAL (15 ROLES)
    # ==========================================
    {
        "id": "job-ab-01",
        "title": "Frontier LLM Pre-Training & Scaling Infrastructure Engineer",
        "company": "DeepMind / Google AI Research",
        "companyLogo": "🔬",
        "location": "London, UK / Mountain View, CA (Hybrid)",
        "region": "Abroad",
        "workplaceType": "Hybrid",
        "experienceRange": "2-4 Years",
        "minExperienceYears": 2,
        "maxExperienceYears": 4,
        "salaryRange": "₹1,85,00,000 - ₹2,95,00,000 / yr ($220k - $350k)",
        "currency": "USD",
        "jobType": "Full-time",
        "category": "Generative AI & LLMs",
        "tags": ["Global Role", "Frontier AI", "Visa Sponsor", "₹1.85-2.95 Cr"],
        "techStack": ["JAX", "TPU v5p", "PyTorch", "Megatron-LM", "Distributed Training", "CUDA C++"],
        "description": "Architect massively distributed training runs spanning thousands of TPU/GPU clusters, implementing 3D parallelism (Tensor, Pipeline, Sequence) and FP8 scaling.",
        "responsibilities": [
            "Optimize multi-node all-reduce collective communications and Megatron-LM scaling.",
            "Implement hardware-aware attention kernels and fault-tolerant checkpointing.",
            "Analyze loss curves and learning rate schedules for next-generation frontier models."
        ],
        "requirements": [
            "2-4 years experience in Distributed ML, High-Performance Computing (HPC), or JAX/PyTorch.",
            "Deep understanding of Transformer mathematical foundations and compute scaling laws."
        ],
        "benefits": ["Full UK/US Visa Sponsorship and relocation package", "Comprehensive global healthcare"],
        "postedDate": "1 day ago",
        "applicantsCount": 84,
        "featured": True
    },
    {
        "id": "job-ab-02",
        "title": "AI Alignment & Post-Training Research Scientist (RLHF / DPO)",
        "company": "Anthropic AI Safety Labs",
        "companyLogo": "🛡️",
        "location": "San Francisco, CA / London, UK",
        "region": "Abroad",
        "workplaceType": "Hybrid",
        "experienceRange": "1-4 Years",
        "minExperienceYears": 1,
        "maxExperienceYears": 4,
        "salaryRange": "₹2,10,00,000 - ₹3,35,00,000 / yr ($250k - $400k)",
        "currency": "USD",
        "jobType": "Full-time",
        "category": "Generative AI & LLMs",
        "tags": ["Global Role", "AI Safety", "RLHF & DPO", "₹2.1-3.35 Cr"],
        "techStack": ["PyTorch", "DPO", "RLHF (PPO)", "Mechanistic Interpretability", "Python", "Ray"],
        "description": "Advance the scientific understanding of LLM alignment, direct preference optimization, constitutional self-correction, and mechanistic interpretability.",
        "responsibilities": [
            "Design novel preference optimization algorithms that reduce hallucination and sycophancy.",
            "Train reward models over complex multi-turn reasoning and coding benchmarks.",
            "Probe neural circuit activation vectors to prevent dangerous emergent capabilities."
        ],
        "requirements": [
            "Master's or Ph.D. in Computer Science, AI, or equivalent research track record.",
            "Experience with RLHF, DPO, or sparse autoencoder interpretability."
        ],
        "benefits": ["Top tier Silicon Valley compensation", "Relocation + H1B/O-1 visa sponsorship"],
        "postedDate": "2 days ago",
        "applicantsCount": 62,
        "featured": True
    },
    {
        "id": "job-ab-03",
        "title": "Autonomous Robotics Perception & Spatial AI Engineer",
        "company": "Tesla Autopilot & Optimus Robotics",
        "companyLogo": "🚗",
        "location": "Palo Alto, CA / Austin, TX",
        "region": "Abroad",
        "workplaceType": "Onsite",
        "experienceRange": "2-4 Years",
        "minExperienceYears": 2,
        "maxExperienceYears": 4,
        "salaryRange": "₹1,65,00,000 - ₹2,60,00,000 / yr ($195k - $310k)",
        "currency": "USD",
        "jobType": "Full-time",
        "category": "Computer Vision",
        "tags": ["Global Role", "Robotics AI", "Spatial AI", "₹1.65-2.6 Cr"],
        "techStack": ["PyTorch", "Occupancy Networks", "C++20", "CUDA", "TensorRT", "3D Gaussian Splatting"],
        "description": "Develop real-time 3D occupancy networks, visual-inertial odometry, and foundation world models for humanoid robotics and full self-driving vehicles.",
        "responsibilities": [
            "Train multi-camera Bird's-Eye-View (BEV) temporal vision networks from fleet video.",
            "Optimize C++ neural inference kernels running on Tesla FSD custom silicon.",
            "Validate obstacle avoidance, trajectory forecasting, and motion planning."
        ],
        "requirements": [
            "2-4 years experience in 3D Computer Vision, Robotics, or Autonomous Driving.",
            "Fluent in modern C++ and custom CUDA kernel optimization."
        ],
        "benefits": ["Stock purchase plan discount", "Comprehensive health and wellness"],
        "postedDate": "3 days ago",
        "applicantsCount": 78,
        "featured": True
    },
    {
        "id": "job-ab-04",
        "title": "AI Hardware Acceleration & CUDA Kernel Engineer",
        "company": "NVIDIA GPU Computing Group",
        "companyLogo": "⚡",
        "location": "Santa Clara, CA / Zurich, Switzerland",
        "region": "Abroad",
        "workplaceType": "Hybrid",
        "experienceRange": "1-3 Years",
        "minExperienceYears": 1,
        "maxExperienceYears": 3,
        "salaryRange": "₹1,75,00,000 - ₹2,70,00,000 / yr ($210k - $320k)",
        "currency": "USD",
        "jobType": "Full-time",
        "category": "MLOps & Infrastructure",
        "tags": ["Global Role", "CUDA C++", "Blackwell GPUs", "₹1.75-2.7 Cr"],
        "techStack": ["CUDA C++", "Triton (OpenAI)", "PyTorch C++ Extensions", "CUTLASS", "FlashAttention"],
        "description": "Write custom low-level GPU kernels, optimizing GEMM matrix multiplications, fused attention layers, and FP4/FP8 memory transfers on Blackwell B200 GPUs.",
        "responsibilities": [
            "Implement high-throughput FlashAttention-3 and quantized linear kernels in CUTLASS.",
            "Profile GPU memory bandwidth, tensor core utilization, and warp divergence in Nsight Compute.",
            "Collaborate with frontier model teams to accelerate LLM inference by 3-5x."
        ],
        "requirements": [
            "1-3 years writing performant CUDA C++ or OpenAI Triton kernels.",
            "Deep understanding of GPU hardware architecture (SRAM, HBM3e, Warp Schedulers)."
        ],
        "benefits": ["Relocation grant to Switzerland or USA", "Generous annual ESPP grants"],
        "postedDate": "1 day ago",
        "applicantsCount": 51,
        "featured": True
    },
    {
        "id": "job-ab-05",
        "title": "Quantitative ML & High-Frequency Alpha Researcher",
        "company": "Two Sigma / Citadel Securities",
        "companyLogo": "📈",
        "location": "New York, NY / London, UK",
        "region": "Abroad",
        "workplaceType": "Onsite",
        "experienceRange": "1-4 Years",
        "minExperienceYears": 1,
        "maxExperienceYears": 4,
        "salaryRange": "₹2,50,00,000 - ₹4,50,00,000 / yr ($300k - $540k)",
        "currency": "USD",
        "jobType": "Full-time",
        "category": "Machine Learning",
        "tags": ["Global Role", "Quant Trading", "Highest Pay", "₹2.5-4.5 Cr"],
        "techStack": ["Python", "C++", "PyTorch", "GBDT (LightGBM)", "Time Series Transformers", "KDB+/q"],
        "description": "Apply state-of-the-art machine learning, Transformer sequence modeling, and reinforcement learning to extract statistical alpha from petabyte-scale tick data.",
        "responsibilities": [
            "Formulate predictive statistical hypotheses over global market microstructure telemetry.",
            "Train deep sequence models that forecast short-term order book dynamics.",
            "Backtest signals with strict transaction cost and market impact constraints."
        ],
        "requirements": [
            "Degree in Math, Physics, CS, or Machine Learning with top academic record.",
            "Deep mastery of probability, linear algebra, and high-performance computing."
        ],
        "benefits": ["Top global hedge fund discretionary performance bonus", "Full relocation and housing stipend"],
        "postedDate": "2 days ago",
        "applicantsCount": 93,
        "featured": True
    },
    {
        "id": "job-ab-06",
        "title": "Edge AI & Small Language Model (SLM) Optimization Specialist",
        "company": "Apple Machine Learning & AI",
        "companyLogo": "🍎",
        "location": "Cupertino, CA / Munich, Germany",
        "region": "Abroad",
        "workplaceType": "Hybrid",
        "experienceRange": "1-3 Years",
        "minExperienceYears": 1,
        "maxExperienceYears": 3,
        "salaryRange": "₹1,60,00,000 - ₹2,45,00,000 / yr ($190k - $290k)",
        "currency": "USD",
        "jobType": "Full-time",
        "category": "Generative AI & LLMs",
        "tags": ["Global Role", "Apple Intelligence", "CoreML & GGUF", "₹1.6-2.45 Cr"],
        "techStack": ["CoreML", "Metal (MPS)", "PyTorch", "AWQ / GGUF Quantization", "Swift", "C++"],
        "description": "Optimize compact, high-efficiency Small Language Models (SLMs) to execute private on-device intelligence directly on Apple Silicon Neural Engines.",
        "responsibilities": [
            "Apply 3-bit/4-bit AWQ and mixed-precision quantization to 3B-7B parameter models.",
            "Optimize Metal shading language kernels for unified memory bandwidth.",
            "Evaluate battery drain, thermal throttling, and time-to-first-token on iOS devices."
        ],
        "requirements": [
            "1-3 years experience in Model Compression, Quantization, or CoreML/Metal programming.",
            "Understanding of Transformer KV-cache compression techniques."
        ],
        "benefits": ["Apple product discounts", "Comprehensive European or US relocation package"],
        "postedDate": "3 days ago",
        "applicantsCount": 47,
        "featured": False
    },
    {
        "id": "job-ab-07",
        "title": "Generative Video & Multimodal Diffusion Research Engineer",
        "company": "Runway AI / Stability AI",
        "companyLogo": "🎬",
        "location": "New York, NY / London, UK / Remote",
        "region": "Abroad",
        "workplaceType": "Remote",
        "experienceRange": "1-4 Years",
        "minExperienceYears": 1,
        "maxExperienceYears": 4,
        "salaryRange": "₹1,70,00,000 - ₹2,80,00,000 / yr ($200k - $335k)",
        "currency": "USD",
        "jobType": "Full-time",
        "category": "Computer Vision",
        "tags": ["Global Role", "Generative Video", "Diffusion Models", "₹1.7-2.8 Cr"],
        "techStack": ["PyTorch", "Diffusion Models (DiT)", "Flow Matching", "Latent U-Nets", "CUDA", "vLLM"],
        "description": "Push the boundaries of text-to-video generation, Diffusion Transformers (DiT), spatial-temporal attention, and camera-controllable video synthesis.",
        "responsibilities": [
            "Train large-scale video latent diffusion models using 3D spatial-temporal attention.",
            "Implement Rectified Flow Matching and continuous time ODE samplers for faster rendering.",
            "Build conditioning pipelines for depth maps, motion vectors, and character consistency."
        ],
        "requirements": [
            "1-4 years experience with Generative Models, Diffusion, or Video AI.",
            "Published research or demonstrable open-source projects in generative computer vision."
        ],
        "benefits": ["100% Remote flexibility anywhere in US/Europe", "Home office & GPU workstation budget"],
        "postedDate": "4 days ago",
        "applicantsCount": 65,
        "featured": False
    },
    {
        "id": "job-ab-08",
        "title": "AI Bio-Molecular & Drug Discovery Research Scientist",
        "company": "Recursion Pharmaceuticals / Isomorphic Labs",
        "companyLogo": "🧬",
        "location": "London, UK / Salt Lake City, UT",
        "region": "Abroad",
        "workplaceType": "Hybrid",
        "experienceRange": "2-4 Years",
        "minExperienceYears": 2,
        "maxExperienceYears": 4,
        "salaryRange": "₹1,80,00,000 - ₹2,90,00,000 / yr ($215k - $345k)",
        "currency": "USD",
        "jobType": "Full-time",
        "category": "Machine Learning",
        "tags": ["Global Role", "AI for Science", "AlphaFold & GNNs", "₹1.8-2.9 Cr"],
        "techStack": ["PyTorch Geometric", "AlphaFold-3", "Graph Neural Networks", "Equivariant GNNs", "Python"],
        "description": "Design SE(3)-equivariant neural networks and geometric deep learning models that predict protein-ligand binding affinity and generate novel drug candidates.",
        "responsibilities": [
            "Develop 3D molecular graph neural networks for target binding affinity prediction.",
            "Train generative diffusion models over 3D conformer coordinates.",
            "Collaborate with computational biologists and validate screening hits in wet lab assays."
        ],
        "requirements": [
            "Master's or Ph.D. in Computational Chemistry, Bioinformatics, or Machine Learning.",
            "Experience with PyTorch Geometric and 3D molecular representations."
        ],
        "benefits": ["Full UK/US visa sponsorship", "Comprehensive scientific sabbatical program"],
        "postedDate": "2 days ago",
        "applicantsCount": 33,
        "featured": True
    },
    {
        "id": "job-ab-09",
        "title": "Cyber Threat Autonomous Defense & Agentic Security Engineer",
        "company": "Darktrace Cyber AI Defense",
        "companyLogo": "🛡️",
        "location": "Cambridge, UK / Singapore",
        "region": "Abroad",
        "workplaceType": "Hybrid",
        "experienceRange": "1-3 Years",
        "minExperienceYears": 1,
        "maxExperienceYears": 3,
        "salaryRange": "₹1,45,00,000 - ₹2,25,00,000 / yr (£135k - £210k)",
        "currency": "GBP",
        "jobType": "Full-time",
        "category": "Cybersecurity & AI Defense",
        "tags": ["Global Role", "Self-Defending AI", "Anomaly Detection", "₹1.45-2.25 Cr"],
        "techStack": ["Python", "Unsupervised GNNs", "Kafka", "Graph Neural Networks", "Docker", "PyTorch"],
        "description": "Build self-learning anomaly detection algorithms that neutralize in-progress ransomware, supply chain breaches, and cloud identity takeovers in real-time.",
        "responsibilities": [
            "Train unsupervised Bayesian and Graph Neural Network models over streaming enterprise telemetry.",
            "Implement autonomous action dispatchers that isolate infected containers in sub-second latency.",
            "Audit adversarial evasion robustness against state-sponsored advanced persistent threats (APTs)."
        ],
        "requirements": [
            "1-3 years experience in Network Security, Anomaly Detection, or Unsupervised Learning.",
            "Strong understanding of TCP/IP, cloud infrastructure, and streaming data architectures."
        ],
        "benefits": ["UK/Singapore Tier-2 visa sponsorship", "Private healthcare + pension matching"],
        "postedDate": "3 days ago",
        "applicantsCount": 29,
        "featured": False
    },
    {
        "id": "job-ab-10",
        "title": "Sovereign AI & Foundation Model Architect",
        "company": "Technology Innovation Institute (TII Falcon)",
        "companyLogo": "🦅",
        "location": "Abu Dhabi / Dubai, UAE",
        "region": "Abroad",
        "workplaceType": "Onsite",
        "experienceRange": "2-4 Years",
        "minExperienceYears": 2,
        "maxExperienceYears": 4,
        "salaryRange": "₹1,90,00,000 - ₹3,10,00,000 / yr (Tax-Free AED 850k - 1.38M)",
        "currency": "AED",
        "jobType": "Full-time",
        "category": "Generative AI & LLMs",
        "tags": ["Global Role", "Tax-Free Salary", "Falcon Models", "₹1.9-3.1 Cr"],
        "techStack": ["PyTorch", "Megatron-DeepSpeed", "FlashAttention", "Multimodal Transformers", "Slurm"],
        "description": "Architect the next generation of open-source Falcon foundation models, scaling multimodal vision-language architectures across thousands of H100 GPUs.",
        "responsibilities": [
            "Direct architecture design and synthetic data curation pipelines for Falcon 3 models.",
            "Optimize large-scale training cluster throughput on Slurm and RoCE networks.",
            "Benchmark open-weights releases against MMLU, GSM8K, HumanEval, and Math benchmarks."
        ],
        "requirements": [
            "2-4 years experience pre-training foundational LLMs or Multimodal architectures.",
            "Track record of open-source contributions or peer-reviewed ML publications."
        ],
        "benefits": ["100% Tax-Free UAE Compensation", "Luxury accommodation stipend + flights home"],
        "postedDate": "1 day ago",
        "applicantsCount": 71,
        "featured": True
    },
    {
        "id": "job-ab-11",
        "title": "Self-Driving Neural Planning & Trajectory Prediction Engineer",
        "company": "Waymo Autonomous Systems",
        "companyLogo": "🚘",
        "location": "Mountain View, CA / Austin, TX",
        "region": "Abroad",
        "workplaceType": "Hybrid",
        "experienceRange": "2-4 Years",
        "minExperienceYears": 2,
        "maxExperienceYears": 4,
        "salaryRange": "₹1,95,00,000 - ₹3,05,00,000 / yr ($230k - $365k)",
        "currency": "USD",
        "jobType": "Full-time",
        "category": "Computer Vision",
        "tags": ["Global Role", "Waymo Driver", "L4 Autonomy", "₹1.95-3.05 Cr"],
        "techStack": ["PyTorch", "C++20", "Trajectory Transformers", "Monte Carlo Tree Search", "ROS 2"],
        "description": "Engineer neural motion planning and interaction prediction models for commercial Level-4 autonomous ride-hailing fleets operating in dense urban environments.",
        "responsibilities": [
            "Train multi-agent trajectory prediction transformers over joint vehicle and pedestrian graphs.",
            "Implement safety-critical contingency planning algorithms with hard collision avoidance constraints.",
            "Evaluate closed-loop simulation logs across edge-case disengagement scenarios."
        ],
        "requirements": [
            "2-4 years experience in Autonomous Driving, Motion Planning, or Robotics ML.",
            "Proficiency in modern C++ and PyTorch."
        ],
        "benefits": ["Waymo ride discounts", "Full US H1B/Greencard sponsorship"],
        "postedDate": "2 days ago",
        "applicantsCount": 58,
        "featured": False
    },
    {
        "id": "job-ab-12",
        "title": "Quantum Machine Learning & Optimization Researcher",
        "company": "IBM Quantum & AI Research",
        "companyLogo": "⚛️",
        "location": "Yorktown Heights, NY / Zurich, Switzerland",
        "region": "Abroad",
        "workplaceType": "Hybrid",
        "experienceRange": "1-4 Years",
        "minExperienceYears": 1,
        "maxExperienceYears": 4,
        "salaryRange": "₹1,60,00,000 - ₹2,55,00,000 / yr ($190k - $305k)",
        "currency": "USD",
        "jobType": "Full-time",
        "category": "Machine Learning",
        "tags": ["Global Role", "Quantum AI", "Qiskit & QML", "₹1.6-2.55 Cr"],
        "techStack": ["Qiskit", "PyTorch", "PennyLane", "Quantum Neural Networks", "Python"],
        "description": "Investigate parameterized quantum circuits, variational quantum eigensolvers (VQE), and quantum kernel methods for high-dimensional combinatorial optimization.",
        "responsibilities": [
            "Design noise-resilient Quantum Neural Network (QNN) ansatzes on IBM Heron superconducting QPUs.",
            "Benchmark quantum kernel algorithms against classical SVMs and gradient boosted trees.",
            "Publish findings in top-tier physics and machine learning journals."
        ],
        "requirements": [
            "Degree in Physics, Quantum Computing, Computer Science, or Applied Mathematics.",
            "Hands-on experience with Qiskit or PennyLane."
        ],
        "benefits": ["Relocation assistance to Switzerland or USA", "Patent award incentive bonuses"],
        "postedDate": "3 days ago",
        "applicantsCount": 26,
        "featured": False
    },
    {
        "id": "job-ab-13",
        "title": "Full-Stack AI Software Engineer (Copilot & LLM Agents)",
        "company": "Microsoft AI / GitHub Copilot Labs",
        "companyLogo": "💻",
        "location": "Redmond, WA / Vancouver, Canada",
        "region": "Abroad",
        "workplaceType": "Hybrid",
        "experienceRange": "1-3 Years",
        "minExperienceYears": 1,
        "maxExperienceYears": 3,
        "salaryRange": "₹1,55,00,000 - ₹2,40,00,000 / yr ($185k - $285k)",
        "currency": "USD",
        "jobType": "Full-time",
        "category": "Generative AI & LLMs",
        "tags": ["Global Role", "Copilot AI", "TypeScript & PyTorch", "₹1.55-2.4 Cr"],
        "techStack": ["TypeScript", "Python", "FastAPI", "Next.js", "OpenAI API", "Azure AI"],
        "description": "Build high-speed IDE extensions, contextual semantic code suggestion pipelines, and autonomous agentic workflows inside GitHub Copilot.",
        "responsibilities": [
            "Build sub-200ms latency streaming code completion clients and LSP protocols.",
            "Design repo-level contextual retrieval using AST chunking and vector embeddings.",
            "Telemetry monitoring for developer acceptance rates and suggestion latency."
        ],
        "requirements": [
            "1-3 years in TypeScript/React and backend Python/Go systems.",
            "Understanding of LLM streaming protocols, token buffers, and vector embeddings."
        ],
        "benefits": ["Microsoft hardware discounts", "Comprehensive Canada/US relocation"],
        "postedDate": "2 days ago",
        "applicantsCount": 73,
        "featured": False
    },
    {
        "id": "job-ab-14",
        "title": "Speech & Voice AI Research Scientist (TTS / ASR)",
        "company": "ElevenLabs Voice AI",
        "companyLogo": "🎙️",
        "location": "London, UK / New York, NY / Remote",
        "region": "Abroad",
        "workplaceType": "Remote",
        "experienceRange": "1-4 Years",
        "minExperienceYears": 1,
        "maxExperienceYears": 4,
        "salaryRange": "₹1,75,00,000 - ₹2,85,00,000 / yr ($210k - $340k)",
        "currency": "USD",
        "jobType": "Full-time",
        "category": "Generative AI & LLMs",
        "tags": ["Global Role", "Voice AI", "TTS & Latents", "₹1.75-2.85 Cr"],
        "techStack": ["PyTorch", "Voice Latents", "Audio Diffusion", "CUDA", "FastAPI", "WebRTC"],
        "description": "Develop ultra-expressive zero-shot voice cloning, real-time conversational speech synthesis, and cross-lingual emotion transfer models.",
        "responsibilities": [
            "Train autoregressive acoustic transformers and diffusion vocoders over petabytes of clean speech.",
            "Reduce end-to-end voice-to-voice streaming latency below 150 milliseconds over WebRTC.",
            "Build automated biometric watermarking and deepfake speech detection classifiers."
        ],
        "requirements": [
            "1-4 years in Speech Processing, Audio Deep Learning, or Generative Modeling.",
            "Strong PyTorch and digital signal processing (DSP) background."
        ],
        "benefits": ["100% remote flexibility with global co-working pass", "Generous early-stage equity"],
        "postedDate": "1 day ago",
        "applicantsCount": 49,
        "featured": True
    },
    {
        "id": "job-ab-15",
        "title": "AI Cloud Security & Neural Policy Auditor",
        "company": "Wiz Cloud AI Security",
        "companyLogo": "🔒",
        "location": "Tel Aviv / New York, NY / Remote",
        "region": "Abroad",
        "workplaceType": "Remote",
        "experienceRange": "1-3 Years",
        "minExperienceYears": 1,
        "maxExperienceYears": 3,
        "salaryRange": "₹1,50,00,000 - ₹2,35,00,000 / yr ($180k - $280k)",
        "currency": "USD",
        "jobType": "Full-time",
        "category": "Cybersecurity & AI Defense",
        "tags": ["Global Role", "Cloud AI Security", "CSPM & Guardrails", "₹1.5-2.35 Cr"],
        "techStack": ["Python", "AWS/GCP/Azure AI", "Open Policy Agent (OPA)", "Terraform", "Docker"],
        "description": "Discover and prevent toxic combinations of AI asset misconfigurations, model weight exfiltration risks, and over-permissioned IAM neural agents in cloud environments.",
        "responsibilities": [
            "Develop continuous security posture rules for Bedrock, Vertex AI, and Azure OpenAI resources.",
            "Audit LLM agent service principals for excessive cloud infrastructure permissions.",
            "Implement automated remediation webhooks neutralizing compromised training buckets."
        ],
        "requirements": [
            "1-3 years in Cloud Security (AWS/GCP/Azure), DevSecOps, or AI infrastructure auditing.",
            "Familiarity with Kubernetes RBAC, IAM policies, and cloud networking."
        ],
        "benefits": ["Top tier pre-IPO stock options", "Unlimited home office tech allowance"],
        "postedDate": "3 days ago",
        "applicantsCount": 31,
        "featured": False
    }
]

print(f"Dataset compiled with {len(jobs)} total jobs:")
india_count = sum(1 for j in jobs if j['region'] == 'India')
abroad_count = sum(1 for j in jobs if j['region'] == 'Abroad')
print(f"  🇮🇳 India Jobs: {india_count}")
print(f"  🌍 Abroad Jobs: {abroad_count}")

# Generate TypeScript code for career-service.ts
ts_jobs_code = json.dumps(jobs, indent=2)

ts_content = f"""export interface JobPosting {{
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  region?: 'India' | 'Abroad' | 'Global';
  workplaceType: 'Remote' | 'Hybrid' | 'Onsite';
  experienceRange: '0-1 Years' | '1-2 Years' | '2-4 Years' | '0-4 Years' | '1-3 Years' | '0-2 Years' | string;
  minExperienceYears: number;
  maxExperienceYears: number;
  salaryRange: string;
  currency: string;
  jobType: 'Full-time' | 'Internship' | 'Contract';
  category: 'Machine Learning' | 'Generative AI & LLMs' | 'MLOps & Infrastructure' | 'Computer Vision' | 'Data Science' | 'Cybersecurity & AI Defense';
  tags: string[];
  techStack: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  postedDate: string;
  applicantsCount: number;
  featured?: boolean;
}}

export interface JobApplication {{
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  experienceYears: number;
  portfolioUrl: string;
  githubUrl: string;
  linkedInUrl: string;
  resumeFileName: string;
  coverLetter: string;
  matchScore: number;
  status: 'Applied' | 'Under Review' | 'Shortlisted' | 'Interview Scheduled' | 'Offer';
  appliedAt: string;
}}

export interface CandidateResumeProfile {{
  name: string;
  email: string;
  experienceYears: number;
  skills: string[];
  hasVerifiedCertificates: boolean;
  education: string;
  summary: string;
}}

// In-Memory Database Store for Jobs & Applications
export const INITIAL_JOB_DATABASE: JobPosting[] = {ts_jobs_code};

// Active database instance
let jobsDatabase: JobPosting[] = [...INITIAL_JOB_DATABASE];

// Applications database
let applicationsDatabase: JobApplication[] = [
  {{
    id: 'app-1',
    jobId: 'job-sec-1',
    jobTitle: 'Senior AI Threat Intelligence & Adversarial Defense Engineer',
    company: 'CrowdStrike AI Defense Labs',
    candidateName: 'Sarah Johnson',
    candidateEmail: 'sarah.j@example.com',
    candidatePhone: '+91 98765 43210',
    experienceYears: 2.5,
    portfolioUrl: 'https://github.com/sarah-j-ai',
    githubUrl: 'https://github.com/sarah-j-ai',
    linkedInUrl: 'https://linkedin.com/in/sarah-j-ai',
    resumeFileName: 'Sarah_Johnson_AI_Resume.pdf',
    coverLetter: 'Specialized in adversarial ML defenses, eBPF telemetry, and PyTorch endpoints.',
    matchScore: 96,
    status: 'Interview Scheduled',
    appliedAt: '2 days ago',
  }},
];

// Helper to compute AI Match Score
export function calculateMatchScore(candidateSkills: string[], jobTechStack: string[], candidateExp: number, minExp: number): number {{
  if (!jobTechStack || jobTechStack.length === 0) return 85;
  const candidateSkillsLower = candidateSkills.map((s) => s.toLowerCase());
  let matchedSkills = 0;

  for (const tech of jobTechStack) {{
    const techLower = tech.toLowerCase();
    if (candidateSkillsLower.some((s) => s.includes(techLower) || techLower.includes(s))) {{
      matchedSkills++;
    }}
  }}

  const skillScore = (matchedSkills / jobTechStack.length) * 70;
  const expScore = candidateExp >= minExp ? 30 : Math.max(10, (candidateExp / Math.max(1, minExp)) * 30);
  return Math.min(99, Math.max(45, Math.round(skillScore + expScore)));
}}

// Fetch all jobs with optional filters
export async function getJobs(filter?: {{
  search?: string;
  region?: 'All' | 'India' | 'Abroad';
  category?: string;
  experience?: string;
  workplaceType?: string;
}}): Promise<JobPosting[]> {{
  let results = [...jobsDatabase];

  if (!filter) return results;

  if (filter.region && filter.region !== 'All') {{
    results = results.filter((job) => job.region === filter.region);
  }}

  if (filter.category && filter.category !== 'All') {{
    results = results.filter((job) => job.category === filter.category);
  }}

  if (filter.workplaceType && filter.workplaceType !== 'All') {{
    results = results.filter((job) => job.workplaceType === filter.workplaceType);
  }}

  if (filter.search && filter.search.trim() !== '') {{
    const q = filter.search.toLowerCase();
    results = results.filter(
      (job) =>
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        job.techStack.some((t) => t.toLowerCase().includes(q)) ||
        job.tags.some((t) => t.toLowerCase().includes(q))
    );
  }}

  return results;
}}

// Fetch single job by ID
export async function getJobById(id: string): Promise<JobPosting | null> {{
  const job = jobsDatabase.find((j) => j.id === id);
  return job || null;
}}

// Apply for a job
export async function applyForJob(
  jobId: string,
  applicationData: Omit<JobApplication, 'id' | 'status' | 'appliedAt'>
): Promise<{{ success: boolean; application?: JobApplication; error?: string }}> {{
  const job = await getJobById(jobId);
  if (!job) return {{ success: false, error: 'Job not found' }};

  const newApp: JobApplication = {{
    ...applicationData,
    id: `app-${{Date.now()}}`,
    status: 'Applied',
    appliedAt: 'Just now',
  }};

  applicationsDatabase.unshift(newApp);

  // Increment applicants count
  jobsDatabase = jobsDatabase.map((j) =>
    j.id === jobId ? {{ ...j, applicantsCount: j.applicantsCount + 1 }} : j
  );

  return {{ success: true, application: newApp }};
}}

// Get user applications
export async function getUserApplications(candidateEmail?: string): Promise<JobApplication[]> {{
  if (!candidateEmail) return [...applicationsDatabase];
  return applicationsDatabase.filter((a) => a.candidateEmail === candidateEmail);
}}

// Post a new job
export async function createJobPosting(
  newJobData: Omit<JobPosting, 'id' | 'postedDate' | 'applicantsCount'>
): Promise<JobPosting> {{
  const created: JobPosting = {{
    ...newJobData,
    id: `job-${{Date.now()}}`,
    postedDate: 'Just now',
    applicantsCount: 0,
  }};

  jobsDatabase.unshift(created);
  return created;
}}
"""

with open("/Users/amithks/ai-webapp/services/career-service.ts", "w") as f:
    f.write(ts_content)

print(f"Successfully compiled {len(jobs)} AI/ML jobs into services/career-service.ts!")
