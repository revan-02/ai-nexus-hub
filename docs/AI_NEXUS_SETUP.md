% AI Nexus Platform — Comprehensive Project Architecture, Algorithms & Windows 11 Setup Guide

> Project Name: AI Nexus Platform
> Tech Stack: Next.js 16 (App Router), React 19, TypeScript, PostgreSQL, Prisma ORM, NextAuth v5, Ollama Local LLMs, Tailwind CSS, TanStack Query
> Target OS: Windows 11 (64-bit) / macOS / Linux
> Status: Production-Ready

---

## Table of Contents
1. Project Overview & Core Vision
2. High-Level Architecture & End-to-End Project Flow
   - System Architecture Diagram
   - Core User Journeys & Subsystem Workflows
3. Comprehensive Catalog of Algorithms Used (35 Algorithms)
4. Software & Hardware Prerequisites for Windows 11
5. Step-by-Step Installation & Setup Guide on Windows 11
6. Windows 11 Troubleshooting & Common Gotchas

---

## 1. Project Overview & Core Vision

The **AI Nexus Platform** is an enterprise-grade AI education, algorithm experimentation, and interactive model platform. It bridges the gap between theoretical computer science and applied artificial intelligence through:

1. **4-Tier Learning Continuum:**
- **Level 1: Novice (Grades 5–8):** Zero-code visual games, robot logic, voice assistant fundamentals.
- **Level 2: High School Foundations (Grades 9–12):** Python programming, linear algebra, vector geometry, data visualization.
- **Level 3: Undergrad Applied ML/DL:** Scikit-Learn pipelines, PyTorch Convolutional Neural Networks, time-series forecasting.
- **Level 4: Senior AI Architect:** Transformer attention math, Mixture of Experts (MoE), Retrieval-Augmented Generation (RAG), LoRA/QLoRA 4-bit fine-tuning, vLLM serving, and autonomous multi-agent orchestration.
2. **Interactive Algorithm Visualizer:** 35 interactive algorithms with live parameter tuning, step execution, and complexity analysis.
3. **Cryptographically Verifiable Credentials:** Unique SHA-256 certificate verification hashes (`NEXUS-CERT-XXXXXX`) shareable directly to LinkedIn and employer portfolios.
4. **Local AI Engine:** Native integration with **Ollama** allowing local, private execution of Llama-3, DeepSeek, and Phi-4 models without paid API keys.
5. **Indian Rupee (₹ INR) Standard:** Complete native localization in Indian Rupees for student affordability and micro-task bounties.

---

## 2. High-Level Architecture & End-to-End Project Flow

### System Architecture Diagram

```mermaid
graph TD
User["🌐 User Browser (Client)"] --> NextRouter["⚡ Next.js 16 App Router"]
subgraph Frontend ["Next.js 16 Frontend Layer"]
NextRouter --> UIComponents["🎨 React 19 UI (Tailwind + Radix / Shadcn)"]
UIComponents --> QueryCache["🔄 TanStack Query v5 Cache"]
UIComponents --> Visualizers["📊 Interactive Algorithm Visualizers"]
end

subgraph Backend ["Server & API Layer"]
NextRouter --> ServerActions["🛡️ Server Actions & Route Handlers"]
ServerActions --> AuthGuard["🔐 NextAuth v5 Guard + Anti-Spam Rate Limiter"]
AuthGuard --> ServiceLayer["⚙️ Business Service Layer"]
end

subgraph Services ["Service Layer (`/services`)"]
ServiceLayer --> AlgoService["Algorithm Service"]
ServiceLayer --> CourseService["Course & Learning Service"]
ServiceLayer --> CertService["Certificate Service"]
ServiceLayer --> InteractionService["Social & Review Service"]
ServiceLayer --> OllamaService["Local Ollama LLM Bridge"]
end

subgraph DataLayer ["Data & AI Persistence"]
ServiceLayer --> PrismaClient["💎 Prisma ORM Client"]
PrismaClient --> PostgresDB[("🐘 PostgreSQL Database (localhost:5432)")]
OllamaService --> OllamaDaemon["🦙 Ollama Local Daemon (localhost:11434)"]
end
```

---

### Core User Journeys & Subsystem Workflows

#### A. User Registration & Authentication Flow (`/register`, `/login`)

```mermaid
sequenceDiagram
autonumber
actor User
participant UI as Frontend Register Page
participant API as /api/auth/otp
participant DB as PostgreSQL (Prisma)
participant Auth as NextAuth v5

User->>UI: Enters Mobile (+91) or Email
UI->>API: POST /api/auth/otp/send (Identifier)
API->>API: Check Rate Limiter (Max 3 OTP / 10 min) & Honeypot
API->>DB: Store 6-digit OTP code & expiration (5 min)
API-->>UI: 200 OK (OTP Sent)
User->>UI: Submits 6-digit OTP
UI->>API: POST /api/auth/otp/verify
API->>DB: Validate OTP match & check expiration
API->>DB: Upsert User Profile in `users` table
API->>Auth: Generate secure JWT session cookie
Auth-->>UI: Redirect to /dashboard or /learning
```

#### B. Algorithm Exploration & Interactive Sandbox Flow (`/algorithms`)

1. **Catalog Browsing:** The user filters through 35 algorithms by category (Classical ML, Deep Learning, GenAI, Graphs, RL) and complexity (Easy, Medium, Hard).
2. **Interactive Visualizer:**
- Client fetches metadata from `GET /api/algorithms/[id]`.
- The user dynamically adjusts hyperparameters (e.g., learning rate, cluster count K, tree depth, temperature).
- The visualizer executes client-side simulation steps or invokes the local Ollama backend for generative tasks.
3. **Audit Logging:** Platform records algorithm interactions into `audit_logs` for user progress telemetry.

#### C. Assessment, Quiz & Certificate Generation Flow (`/quizzes`, `/certificates`)

```mermaid
sequenceDiagram
autonumber
actor Student
participant QuizEngine as Quiz & Exam Runner
participant Evaluator as Auto-Grader Service
participant DB as PostgreSQL
participant Cert as Certificate Generator

Student->>QuizEngine: Answers questions & submits code
QuizEngine->>Evaluator: POST /api/assessments/submit
Evaluator->>Evaluator: Evaluate test cases & compute score %
Evaluator->>DB: Record attempt in `assessment_attempts`
alt Score >= 80% (Mastery Passed)
Evaluator->>Cert: Trigger generateCertificate(userId, courseId)
Cert->>Cert: Generate unique SHA-256 hash (e.g., NEXUS-CERT-948210)
Cert->>DB: Save certificate record in `certificates` table
Cert-->>Student: Award Certificate + 100 XP Gamification Badge
else Score < 80%
Evaluator-->>Student: Retake recommended with targeted review topics
end
```

---

## 3. Comprehensive Catalog of Algorithms Used (35 Algorithms)

The platform includes an extensive library of **35 algorithms** covering the complete artificial intelligence landscape:

### Domain 1: Classical Machine Learning
1. **Linear & Logistic Regression (`alg-1`)**: Supervised prediction using ordinary least squares and sigmoid activation $\sigma(z) = \frac{1}{1 + e^{-z}}$.
2. **Decision Trees & Random Forests (`alg-2`)**: Non-parametric ensemble using Gini Impurity $I_G(p) = 1 - \sum p_i^2$ and bootstrap aggregating (Bagging).
3. **Gradient Boosting - XGBoost & LightGBM (`alg-3`)**: Sequential residual error minimization using second-order Taylor expansion gradients.
4. **Support Vector Machines - SVM (`alg-4`)**: Maximum-margin hyperplane separation with kernel tricks (RBF, Polynomial).
5. **K-Nearest Neighbors - KNN (`alg-5`)**: Instance-based classification using Minkowski/Euclidean metric $d(x, y) = \sqrt{\sum (x_i - y_i)^2}$.
6. **Naive Bayes (`alg-6`)**: Conditional independence probability using Bayes Rule $P(y|x) = \frac{P(x|y)P(y)}{P(x)}$.
7. **Principal Component Analysis - PCA (`alg-7`)**: Orthogonal linear projection maximizing variance via covariance matrix eigenvectors $\mathbf{\Sigma} v = \lambda v$.
8. **t-SNE & UMAP (`alg-8`)**: Non-linear manifold learning preserving local probabilistic neighborhoods via Student-t distributions and fuzzy simplicial sets.

---

### Domain 2: Deep Learning & Computer Vision
9. **Multi-Layer Perceptron - MLP (`alg-9`)**: Dense feedforward layers with backpropagation using chain rule $\frac{\partial L}{\partial W} = \frac{\partial L}{\partial y} \cdot \frac{\partial y}{\partial z} \cdot \frac{\partial z}{\partial W}$.
10. **Convolutional Neural Networks - CNNs (`alg-10`)**: Spatial feature extraction using convolution kernels $(I * K)(i, j) = \sum \sum I(i-m, j-n) K(m, n)$ and pooling.
11. **YOLO - You Only Look Once (`alg-11`)**: Single-stage anchor-based object detection predicting bounding box coordinates $(x, y, w, h)$ and class probabilities in a single forward pass.
12. **Vision Transformer - ViT (`alg-12`)**: Splits images into $16 \times 16$ flattened patches, projects to linear embeddings, and applies multi-head self-attention.
13. **Generative Adversarial Networks - GANs (`alg-13`)**: Minimax zero-sum game between Generator $G(z)$ and Discriminator $D(x)$: $\min_G \max_D V(D, G)$.
14. **Recurrent Networks - LSTMs & GRUs (`alg-14`)**: Vanishing gradient mitigation via Input, Forget, and Output gating vectors regulating cell memory $C_t$.
15. **U-Net Architecture (`alg-15`)**: Contracting path (downsampling) + expanding path (upsampling) joined by skip connections for precise pixel segmentation.

---

### Domain 3: Generative AI & Frontier LLMs
16. **Transformer Self-Attention (`alg-16`)**: Scaled dot-product attention:
$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$
17. **Mixture of Experts - MoE (`alg-17`)**: Sparse routing mechanism directing token inputs to top-$k$ subnetwork experts: $y = \sum_{i \in \text{TopK}} G(x)_i E_i(x)$.
18. **Retrieval-Augmented Generation - RAG (`alg-18`)**: Dense vector similarity retrieval (HNSW / FAISS cosine similarity) dynamically injected into LLM prompt context windows.
19. **ReAct Agent Framework (`alg-19`)**: Interleaved cycle of **Thought $\rightarrow$ Action $\rightarrow$ Observation** enabling LLMs to use calculators, APIs, and search engines autonomously.
20. **Diffusion Models - DDPM & Latent Diffusion (`alg-20`)**: Forward Markovian noise addition and reverse learned neural score matching for high-fidelity generative synthesis.
21. **LoRA & QLoRA Fine-Tuning (`alg-21`)**: Freezing base weights $W_0 \in \mathbb{R}^{d \times k}$ and injecting trainable rank decomposition matrices $\Delta W = B \cdot A$ with 4-bit NormalFloat (NF4) quantization.
22. **Direct Preference Optimization - DPO (`alg-22`)**: Closed-form human alignment without a separate reinforcement learning reward model.
23. **Speculative Decoding (`alg-23`)**: Accelerating LLM token throughput by using a small draft model (e.g. 1B) to generate candidate tokens verified in parallel by the target 70B model.

---

### Domain 4: Search & Graph AI
24. **A* Search Algorithm (`alg-24`)**: Shortest path heuristic exploration using evaluation function $f(n) = g(n) + h(n)$ where $h(n)$ is admissible.
25. **Graph Convolutional Networks - GCN (`alg-25`)**: Spectral graph feature aggregation over local neighborhoods.
26. **Minimax with Alpha-Beta Pruning (`alg-26`)**: Game tree branch cutoff pruning nodes where $\beta \le \alpha$.
27. **PageRank Algorithm (`alg-27`)**: Power iteration computing the stationary probability distribution vector over hyperlink Markov transition matrices.

---

### Domain 5: Clustering & Unsupervised Learning
28. **K-Means Clustering (`alg-28`)**: Lloyd's algorithm minimizing within-cluster sum of squares (WCSS) iteratively.
29. **DBSCAN (`alg-29`)**: Density-based clustering grouping points with $\ge \text{minPts}$ within distance $\epsilon$, isolating arbitrary cluster geometries and noise.
30. **Gaussian Mixture Models - GMM (`alg-30`)**: Expectation-Maximization (EM) soft clustering fitting multiple multivariate Gaussian probability density functions.
31. **Hierarchical Agglomerative Clustering (`alg-31`)**: Bottom-up linkage clustering generating dendrogram trees via Ward's minimum variance or single linkage.

---

### Domain 6: Reinforcement Learning (RL)
32. **Deep Q-Networks - DQN (`alg-32`)**: Off-policy temporal difference Q-learning utilizing experience replay buffers and target network stabilization.
33. **Proximal Policy Optimization - PPO (`alg-33`)**: Clipped surrogate objective preventing destructively large policy updates.
34. **Monte Carlo Tree Search - MCTS (`alg-34`)**: 4-phase rollout search: Selection (UCT formula), Expansion, Simulation, and Backpropagation (AlphaGo foundation).
35. **Soft Actor-Critic - SAC (`alg-35`)**: Off-policy actor-critic algorithm maximizing expected reward alongside policy entropy for continuous robotic control.

---

### Algorithm Comparison & Industry Use-Case Matrix

| Algorithm | Category | Complexity | Best Real-World Industry Application |
| :--- | :--- | :---: | :--- |
| **Linear & Logistic Reg.** | Classical ML | Easy | Credit card approval & real estate price valuation |
| **XGBoost & LightGBM** | Classical ML | Hard | Tabular Kaggle competitions, banking fraud detection |
| **Convolutional Nets (CNN)**| Deep Learning | Hard | Automated medical radiology & defect inspection |
| **YOLOv11** | Deep Learning | Hard | Autonomous driving pedestrian detection (<10ms) |
| **Transformers & Attention**| Generative AI | Hard | Large Language Models (ChatGPT, Claude, Gemini) |
| **RAG (Dense Retrieval)** | Generative AI | Hard | Enterprise document search over PDF contracts & manuals |
| **LoRA / QLoRA** | Generative AI | Hard | Fine-tuning 70B LLMs on consumer GPUs (RTX 4090) |
| **Graph Conv Nets (GCN)** | Graph AI | Hard | Social network recommendation & drug discovery |
| **DBSCAN** | Clustering | Medium | Spatial GPS anomaly detection & astronomical star clusters |
| **PPO** | Reinforcement | Hard | Drone autonomous flight & LLM RLHF fine-tuning |

---

## 4. Software & Hardware Prerequisites for Windows 11

### Hardware Requirements
| Component | Minimum Specification | Recommended Specification |
| :--- | :--- | :--- |
| **Processor (CPU)** | Intel Core i5 (8th Gen+) or AMD Ryzen 5 | Intel Core i7/i9 (12th Gen+) or AMD Ryzen 7/9 |
| **RAM (Memory)** | 8 GB RAM | 16 GB to 32 GB RAM (for running local LLMs) |
| **Disk Storage** | 20 GB Free SSD Space | 50 GB+ NVMe SSD |
| **GPU (Optional)** | Integrated Graphics | NVIDIA RTX 3060+ with CUDA support (for Ollama) |

### Required Software Components
1. **Windows 11 64-bit** (Build 22000 or higher)
2. **Node.js:** v20.x or v22.x LTS (https://nodejs.org/)
3. **Git for Windows:** v2.40+ (https://git-scm.com/download/win)
4. **PostgreSQL Database:** v15.x or v16.x (https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)
5. **Code Editor:** Visual Studio Code (https://code.visualstudio.com/)
6. **Ollama for Windows (Optional for local AI):** (https://ollama.com/download/windows)

---

## 5. Step-by-Step Installation & Setup Guide on Windows 11

Follow this exact step-by-step sequence in **Windows PowerShell** or **Windows Terminal**.

### Step 1: Install Git and Node.js

Open **PowerShell as Administrator** (Right-click Start → Terminal (Admin) or PowerShell (Admin)):

```powershell
# 1. Install Git and Node.js 22 LTS using Windows Package Manager (winget)
winget install --id Git.Git -e --source winget
winget install --id OpenJS.NodeJS.LTS -e --source winget

# 2. Verify installations (close and reopen PowerShell first)
git --version
node -v
npm -v
```

---

### Step 2: Install and Configure PostgreSQL

1. **Download PostgreSQL 16 for Windows:**
Download the official Windows installer from: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads.
2. **Run Installer:**
- Keep default port: `5432`.
- **Important:** When prompted for the password for the superuser `postgres`, enter a strong password you remember (e.g., `postgres` or `admin123`).
- Complete installation (you can uncheck Stack Builder at the end).
3. **Verify PostgreSQL Service is Running:**
Open PowerShell and run:
```powershell
Get-Service -Name postgresql*
```
*Status should say `Running`.*

4. **Create the Database `ai_nexus_db`:**
In PowerShell, use PostgreSQL's CLI `psql`:
```powershell
# Connect to PostgreSQL (enter your password when prompted)
& "C:\\Program Files\\PostgreSQL\\16\\bin\\psql.exe" -U postgres -c "CREATE DATABASE ai_nexus_db;"
```

---

### Step 3: Setup Project Directory & Dependencies

Open standard **PowerShell** or **Command Prompt**:

```powershell
# 1. Navigate to your projects directory or clone the repository
cd C:\\Users\\<YourUsername>\\projects
git clone <your-repository-url> ai-webapp
cd ai-webapp

# 2. Install all Node.js dependencies
npm install
```

---

### Step 4: Configure Environment Variables (.env)

Create a `.env` file in the root directory of the project:

```powershell
# In PowerShell:
Copy-Item .env.example .env
```

Open `.env` in VS Code or Notepad and configure your connection string:

```env
# Database Connection (Replace 'YOUR_PASSWORD' with the password set in Step 2)
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/ai_nexus_db?schema=public"

# NextAuth Security Secret (Can be any 32-character random string)
NEXTAUTH_SECRET="ai-nexus-super-secret-key-32-chars-long-2026"
NEXTAUTH_URL="http://localhost:3000"

# Node Environment
NODE_ENV="development"

# (Optional) Ollama Local LLM URL
OLLAMA_BASE_URL="http://localhost:11434"
```

---

### Step 5: Initialize Prisma Database & Run Migrations

Synchronize the Prisma schema with your PostgreSQL database:

```powershell
# 1. Generate Prisma Client bindings
npm run db:generate

# 2. Push schema to PostgreSQL to automatically create all tables
npm run db:push
```

---

### Step 6: Seed Database with Initial Content

Populate the database with the pre-built 35 algorithms, 12 courses, test users, projects, and assessments:

```powershell
npm run db:seed
```

> Expected Console Output:
> ```text
> 🌱 Seeding database...
> ✅ 10 Users seeded
> ✅ 12 Courses seeded
> ✅ 6 Projects seeded
> ✅ 5 Datasets seeded
> ✅ 5 Assessments seeded
> ✅ 35 Algorithms seeded
> ✅ 8 Roles seeded
> 🌿 Database seeding completed successfully!
> ```

---

### Step 7: Launch the Development Server

Start the Next.js development server:

```powershell
npm run dev
```

Open your web browser and navigate to: http://localhost:3000

Default Seeded Admin Credentials:
- Email: `sarah@nexus.ai` (or `alex@nexus.ai` / `john.doe@example.com`)
- Password: `password123`

---

### Step 8: (Optional) Setup Local Ollama LLMs on Windows 11

To enable zero-cost local LLM inference without requiring OpenAI/Anthropic API keys:

1. Download and run the **Ollama for Windows** installer from https://ollama.com/download/windows.
2. Open PowerShell and pull your desired open-source model:
```powershell
# Pull Llama 3 (8B) or Phi-4
ollama run llama3
```
3. Test that the Ollama daemon is running:
```powershell
curl http://localhost:11434/api/tags
```
4. In AI Nexus Platform, navigate to `/ollama` or `/ai-tools` to chat directly with your on-device model!

---

## 6. Windows 11 Troubleshooting & Common Gotchas

### 1. PowerShell Script Execution Error (`PSSecurityException`)
* Symptom: `File cannot be loaded because running scripts is disabled on this system.`
* Solution: Open PowerShell as Administrator and run:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### 2. PostgreSQL Password Authentication Failed
* Symptom: `FATAL: password authentication failed for user "postgres"`.
* Solution: Ensure the password in `.env` matches the password specified during PostgreSQL installation. Test connection directly using:
```powershell
& "C:\\Program Files\\PostgreSQL\\16\\bin\\psql.exe" -U postgres -d ai_nexus_db
```

### 3. Port 3000 Already in Use (`EADDRINUSE`)
* Symptom: Next.js says port 3000 is occupied.
* Solution: Find and terminate the process holding port 3000 in PowerShell:
```powershell
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
```
*(Or run on another port: `npx next dev -p 3001`)*.

### 4. Prisma Client Out-of-Sync (`@prisma/client did not initialize`)
* Symptom: Model fields missing or schema mismatch.
* Solution: Run:
```powershell
npx prisma generate
```

---

## Verification & Quick Reference Commands

| Command | Action Description |
| :--- | :--- |
| `npm run dev` | Starts Next.js development server on `http://localhost:3000` |
| `npm run build` | Builds optimized production bundle |
| `npm run test` | Runs all Vitest unit and integration test suites |
| `npm run db:push` | Synchronizes Prisma schema changes directly to PostgreSQL |
| `npm run db:seed` | Populates database with 35 algorithms, courses, and demo users |
| `npm run db:studio` | Opens graphical Prisma Studio GUI on `http://localhost:5555` to view/edit database records |

---

*Created for the AI Nexus Platform engineering team.*
