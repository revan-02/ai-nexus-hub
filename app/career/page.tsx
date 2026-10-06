'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Briefcase,
  Target,
  Sparkles,
  TrendingUp,
  Award,
  CheckCircle2,
  DollarSign,
  ChevronRight,
  Brain,
  MessageSquare,
  BookOpen,
  ArrowRight,
  Code2,
  Cpu,
  GraduationCap,
  AlertTriangle,
  Lightbulb,
  Building,
  CheckSquare,
  Square
} from 'lucide-react';

interface CareerPath {
  id: string;
  role: string;
  experience: string;
  salaryIndia: string;
  salaryGlobal: string;
  demandLevel: 'Ultra High' | 'High' | 'Rising';
  description: string;
  keySkills: string[];
  hiringCompanies: string[];
}

const CAREER_PATHS: CareerPath[] = [
  {
    id: 'prompt-engineer',
    role: 'AI Prompt & LLM Application Engineer',
    experience: '0 - 1 Years (Fresher / Junior)',
    salaryIndia: '₹6.5 - 14 LPA',
    salaryGlobal: '$75k - $115k',
    demandLevel: 'High',
    description: 'Bridges raw Foundation Models (Gemini, Claude, Llama) with business software through structured prompting, RAG pipelines, and agentic workflows.',
    keySkills: ['Few-Shot Prompt Engineering', 'LangChain / LlamaIndex', 'Vector Databases (Chroma, Pinecone)', 'Guardrails & Toxicity Filtering'],
    hiringCompanies: ['Infosys Topaz', 'Wipro AI360', 'TCS AI Studio', 'SaaS Startups']
  },
  {
    id: 'edge-vision',
    role: 'Edge AI & Computer Vision Engineer',
    experience: '1 - 3 Years',
    salaryIndia: '₹12 - 25 LPA',
    salaryGlobal: '$110k - $160k',
    demandLevel: 'Rising',
    description: 'Deploys real-time visual perception algorithms onto embedded devices like drones, agricultural cameras, and autonomous robotics.',
    keySkills: ['YOLOv10 / RT-DETR', 'TensorRT & ONNX Runtime', 'OpenCV & Embedded Linux', 'Model Quantization (INT8 / FP8)'],
    hiringCompanies: ['Garuda Aerospace', 'Skye Air', 'Bosch Global Software', 'Honeywell']
  },
  {
    id: 'mlops-architect',
    role: 'ML Systems & MLOps Architect',
    experience: '3 - 6 Years',
    salaryIndia: '₹24 - 48 LPA',
    salaryGlobal: '$165k - $240k',
    demandLevel: 'Ultra High',
    description: 'Builds fault-tolerant infrastructure capable of serving millions of concurrent AI inference requests with sub-100ms latency.',
    keySkills: ['Kubernetes & KServe', 'vLLM / Triton Inference Server', 'Distributed Tracing & Grafana', 'GPU Cluster Orchestration (Slurm)'],
    hiringCompanies: ['Microsoft Azure AI', 'Google Cloud Platform', 'Flipkart ML Platform', 'Swiggy AI']
  },
  {
    id: 'research-scientist',
    role: 'Frontier AI Research Scientist',
    experience: '5+ Years (or Ph.D./M.Tech)',
    salaryIndia: '₹50 - 95 LPA',
    salaryGlobal: '$230k - $390k',
    demandLevel: 'Ultra High',
    description: 'Pioneers new neural architectures, loss formulations, and pre-training paradigms for foundation and vernacular multimodal models.',
    keySkills: ['Custom CUDA Kernels (Triton)', 'DeepSpeed / Megatron-LM', 'Advanced Linear Algebra & Stochastic Calculus', 'Reinforcement Learning from Human Feedback (RLHF/DPO)'],
    hiringCompanies: ['Google DeepMind', 'Sarvam AI', 'Krutrim AI', 'Meta FAIR', 'IBM Research']
  }
];

interface InterviewQuestion {
  id: string;
  question: string;
  roleTarget: string;
  trapToAvoid: string;
  idealAnswer: string;
  powerKeywords: string[];
}

const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'q1',
    question: 'Why do we scale the dot-product by 1/√d_k in Multi-Head Attention?',
    roleTarget: 'Foundations & Math Round',
    trapToAvoid: 'Do not simply say "to make the numbers smaller". Interviewers want the probabilistic and gradient rationale!',
    idealAnswer: 'When the key dimension d_k is large, the dot products grow proportionally large in magnitude. When you feed these large numbers into the softmax function, softmax pushes probabilities toward extreme regions where gradients are exponentially tiny (vanishing gradients). Dividing by √d_k normalizes the variance of the dot products back to 1.0, preserving healthy gradient flow during backpropagation.',
    powerKeywords: ['Variance Normalization', 'Vanishing Gradients', 'Softmax Saturation', 'Independent Random Variables']
  },
  {
    id: 'q2',
    question: 'How would you detect and fix catastrophic forgetting when fine-tuning an LLM with LoRA?',
    roleTarget: 'LLM & Fine-Tuning Round',
    trapToAvoid: 'Assuming that LoRA never causes forgetting. Freezing base weights does not prevent task interference if the rank r is tuned improperly.',
    idealAnswer: 'Catastrophic forgetting occurs when new task gradients overwrite general abilities. I detect it by maintaining a held-out benchmark suite (e.g., MMLU, GSM8K) alongside the fine-tuning loss. To mitigate it: 1) Mix 10-15% of original pre-training general data into the fine-tuning corpus (replay buffer), 2) Reduce the LoRA rank r (e.g., r=8 or r=16) and tune alpha, and 3) Apply Weight-Decomposed LoRA (DoRA) to decouple magnitude and direction.',
    powerKeywords: ['Benchmark Regression Testing', 'Replay Buffer Mixture', 'LoRA Rank Decoupling', 'DoRA']
  },
  {
    id: 'q3',
    question: 'How do you optimize an LLM serving cluster handling 50,000 requests per minute with low latency?',
    roleTarget: 'ML Systems & MLOps Round',
    trapToAvoid: 'Focusing solely on buying more H100 GPUs without addressing memory bandwidth and batching efficiency.',
    idealAnswer: 'LLM inference is memory-bandwidth bound, not compute bound. I would implement: 1) Continuous / In-flight batching (via vLLM or TensorRT-LLM) to avoid waiting for the longest request, 2) PagedAttention to eliminate KV-cache memory fragmentation, 3) Chunked prefill to prevent long prompts from stalling token generation, and 4) Speculative decoding using a lightweight 1B draft model to generate tokens in parallel.',
    powerKeywords: ['Continuous Batching', 'PagedAttention', 'KV Cache Fragmentation', 'Speculative Decoding', 'vLLM']
  },
  {
    id: 'q4',
    question: 'Your agricultural crop disease model has 98% accuracy in training, but only 64% in farmer field tests. What is wrong?',
    roleTarget: 'Real-World Computer Vision Round',
    trapToAvoid: 'Blaming the farmers for poor photos or simply training for more epochs.',
    idealAnswer: 'This is severe distribution shift and dataset bias. Training images were likely captured under pristine lab conditions with uniform lighting, whereas rural field photos have direct sunlight, rain droplets, motion blur, and varied leaf angles. I would: 1) Inspect class confusion matrices and saliency maps to see if the model is learning the background soil instead of leaf lesions, 2) Apply aggressive data augmentation (random shadows, glare, chromatic aberration), and 3) Collect vernacular field samples with active learning.',
    powerKeywords: ['Distribution Shift', 'Dataset Spurious Correlation', 'Saliency Maps', 'Active Learning']
  }
];

export default function CareerHubPage() {
  const [selectedRole, setSelectedRole] = useState<CareerPath>(CAREER_PATHS[0]);
  const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestion>(INTERVIEW_QUESTIONS[0]);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({ q1: true });

  // Placement readiness checklist state
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    math: true,
    python: true,
    transformers: true,
    docker: false,
    realworld_project: true,
    distributed: false
  });

  const toggleChecklist = (key: string) => {
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const readinessPercentage = Math.round((completedCount / Object.keys(checkedItems).length) * 100);

  const toggleAnswerReveal = (id: string) => {
    setRevealedAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <NexusShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/dashboard" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium">AI Career & Placement Hub</span>
        </div>

        {/* Hero Banner featuring Dr. Maya Sharma */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/20 shadow-2xl p-6 sm:p-10">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Dr. Maya Sharma Portrait */}
            <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="relative group mb-4">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500 via-indigo-500 to-purple-500 rounded-3xl blur-md opacity-75 group-hover:opacity-100 transition duration-500" />
                <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-slate-800">
                  <Image
                    src="/images/ai-mentor-dr-maya.jpg"
                    alt="Dr. Maya Sharma - AI Career & Placement Mentor"
                    fill
                    className="object-cover object-top hover:scale-105 transition duration-700"
                    priority
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent p-2 text-center">
                    <span className="text-[11px] font-semibold text-emerald-300 flex items-center justify-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Chief Career Coach
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Dr. Maya Sharma, Ph.D.</h3>
                <p className="text-xs text-indigo-200/80">
                  Technical Career Mentor & Research Director
                </p>
                <div className="pt-2">
                  <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 text-[11px]">
                    🎯 3,450+ Engineers Placed in Tier-1 AI Roles
                  </Badge>
                </div>
              </div>
            </div>

            {/* Career Hub Mission Statement */}
            <div className="lg:col-span-8 space-y-5">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-medium">
                  <Target className="w-3.5 h-3.5 text-emerald-400" />
                  Your Fast-Track to High-Impact AI Careers
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  From Campus Fresher to Senior AI Architect: The Battle-Tested Playbook
                </h1>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  &ldquo;Generic resumes and tutorial clones will get rejected by modern AI hiring filters in 5 seconds. To crack high-paying AI engineering roles, you need verifiable mathematics, production-grade PyTorch, and hands-on system design.&rdquo;
                </p>
              </div>

              {/* Live Readiness Gauge */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-200">
                  <span className="font-medium flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-400" />
                    Your Placement Readiness Score
                  </span>
                  <span className="font-bold text-emerald-400">{readinessPercentage}% Complete</span>
                </div>
                <Progress value={readinessPercentage} className="h-2.5 bg-white/10" />
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{completedCount} of 6 core prerequisites completed</span>
                  <span className="text-indigo-300 hover:underline cursor-pointer">
                    Adjust in Checklist below ↓
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Section 1: AI Career Roles & Real-Time Salary Benchmarks */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                AI Role Roadmaps & 2026 Salary Benchmarks
              </h2>
              <p className="text-sm text-muted-foreground">
                Verified compensation data based on actual offers in Bengaluru, Hyderabad, Gurugram, and Global Remote roles.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {CAREER_PATHS.map((path) => {
              const isSelected = selectedRole.id === path.id;
              return (
                <div
                  key={path.id}
                  onClick={() => setSelectedRole(path)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-primary/10 border-primary ring-2 ring-primary/20 shadow-md'
                      : 'bg-card hover:bg-muted/40 border-border'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px]">
                        {path.experience}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={`text-[9px] px-1.5 py-0 ${
                          path.demandLevel === 'Ultra High'
                            ? 'bg-rose-500/20 text-rose-500'
                            : 'bg-emerald-500/20 text-emerald-500'
                        }`}
                      >
                        🔥 {path.demandLevel}
                      </Badge>
                    </div>

                    <h3 className="font-bold text-base text-foreground leading-snug">
                      {path.role}
                    </h3>

                    <div className="p-2.5 rounded-xl bg-muted/60 border border-border/50 space-y-1">
                      <div className="text-[11px] text-muted-foreground">India Compensation:</div>
                      <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                        {path.salaryIndia}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Global / Remote: <span className="font-semibold text-foreground">{path.salaryGlobal}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 text-[11px] text-primary font-medium flex items-center gap-1">
                    View Requirements & Skills <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Deep-dive details for the selected role */}
          <Card className="border-border shadow-md">
            <CardHeader className="bg-muted/30 border-b border-border pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="default">{selectedRole.role}</Badge>
                    <span className="text-xs text-muted-foreground">{selectedRole.experience}</span>
                  </div>
                  <CardTitle className="text-xl font-bold">{selectedRole.role} Blueprint</CardTitle>
                  <CardDescription className="text-sm">{selectedRole.description}</CardDescription>
                </div>
                <div className="text-right sm:self-center">
                  <div className="text-xs text-muted-foreground">Target Salary Band:</div>
                  <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {selectedRole.salaryIndia}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-primary" />
                    Must-Have Technical Stack
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedRole.keySkills.map((skill, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-foreground p-2 rounded-lg bg-muted/40">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Building className="w-4 h-4 text-primary" />
                    Top Companies Actively Hiring
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedRole.hiringCompanies.map((comp, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-medium text-foreground">
                        {comp}
                      </span>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-700 dark:text-indigo-300 space-y-1 mt-4">
                    <div className="font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Dr. Maya&apos;s Insider Placement Tip:
                    </div>
                    <p className="leading-relaxed">
                      Do not submit a generic resume with &quot;Iris Flower Dataset&quot; or &quot;Titanic Survival&quot;. Build one of our 10 Vernacular Agriculture or FinTech projects to immediately stand in the top 1% of applicants.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section 2: Mock Interview Simulator with Dr. Maya */}
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-primary" />
              Technical Interview Simulator: Crack the Hard Questions
            </h2>
            <p className="text-sm text-muted-foreground">
              Real technical interview questions asked at frontier AI companies, with Dr. Maya&apos;s step-by-step scoring rubric.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Question Selector List */}
            <div className="lg:col-span-5 space-y-3">
              {INTERVIEW_QUESTIONS.map((item, index) => {
                const isCurrent = selectedQuestion.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedQuestion(item)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-primary/10 border-primary ring-2 ring-primary/20'
                        : 'bg-card hover:bg-muted/40 border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                      <span>Question 0{index + 1}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {item.roleTarget}
                      </Badge>
                    </div>
                    <div className="text-sm font-semibold text-foreground line-clamp-2">
                      {item.question}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Answer & Trap Breakdown Card */}
            <div className="lg:col-span-7">
              <Card className="border-border shadow-md h-full flex flex-col justify-between">
                <CardHeader className="bg-muted/30 border-b border-border pb-4">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                      Target Round: {selectedQuestion.roleTarget}
                    </span>
                    <CardTitle className="text-lg font-bold text-foreground">
                      {selectedQuestion.question}
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  {/* Trap Warning Box */}
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1.5">
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold text-xs uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4" />
                      The Rookie Trap to Avoid:
                    </div>
                    <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                      {selectedQuestion.trapToAvoid}
                    </p>
                  </div>

                  {/* Toggle Answer Reveal */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Dr. Maya&apos;s 10/10 Ideal Answer:
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleAnswerReveal(selectedQuestion.id)}
                        className="text-xs h-8"
                      >
                        {revealedAnswers[selectedQuestion.id] ? 'Hide Answer' : 'Reveal Ideal Answer'}
                      </Button>
                    </div>

                    {revealedAnswers[selectedQuestion.id] ? (
                      <div className="p-5 rounded-2xl bg-muted/40 border border-border space-y-3 animate-in fade-in duration-300">
                        <p className="text-sm text-foreground leading-relaxed">
                          {selectedQuestion.idealAnswer}
                        </p>
                        <div className="pt-2 border-t border-border/50">
                          <span className="text-xs font-medium text-muted-foreground block mb-1.5">
                            Power Keywords to Drop in Your Response:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedQuestion.powerKeywords.map((kw, i) => (
                              <Badge key={i} variant="secondary" className="text-[10px]">
                                {kw}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 rounded-2xl border border-dashed border-border text-center text-muted-foreground text-sm space-y-2">
                        <p>Answer hidden. Try answering it out loud before revealing!</p>
                        <Button
                          size="sm"
                          onClick={() => toggleAnswerReveal(selectedQuestion.id)}
                          className="text-xs"
                        >
                          Check Your Thinking
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>

        {/* Section 3: Interactive Skills & Placement Readiness Checklist */}
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-md space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-primary" />
              Dr. Maya&apos;s Placement Readiness Audit Checklist
            </h3>
            <p className="text-xs text-muted-foreground">
              Tick off each milestone as you complete challenges in AI Nexus Hub to gauge your job-market preparedness.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { id: 'math', title: 'Calculus & Linear Algebra', desc: 'Can manually derive backprop gradient step and eigenvalues.' },
              { id: 'python', title: 'Vectorized NumPy & PyTorch', desc: 'Can implement tensor operations without for-loops.' },
              { id: 'transformers', title: 'Self-Attention from Scratch', desc: 'Can write Multi-Head Attention class in under 15 minutes.' },
              { id: 'docker', title: 'FastAPI & Containerization', desc: 'Can package a model into a Docker image with healthchecks.' },
              { id: 'realworld_project', title: 'Deployed Production Portfolio', desc: 'Have a live URL demonstrating vernacular AI or CV.' },
              { id: 'distributed', title: 'vLLM / Triton / Distributed', desc: 'Understand PagedAttention and continuous batching mechanics.' }
            ].map((check) => {
              const isChecked = checkedItems[check.id];
              return (
                <div
                  key={check.id}
                  onClick={() => toggleChecklist(check.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    isChecked
                      ? 'bg-primary/5 border-primary/40'
                      : 'bg-muted/20 border-border hover:bg-muted/40'
                  }`}
                >
                  <div className="mt-0.5 text-primary shrink-0">
                    {isChecked ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                    ) : (
                      <Square className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <h4 className={`text-sm font-semibold ${isChecked ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {check.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-snug">
                      {check.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: What Top AI Labs Actually Look For in 2026 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-emerald-500/30 bg-emerald-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Green Flags That Get You Hired
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs sm:text-sm text-foreground">
              <div className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>A live demo URL deployed with measurable latency and throughput stats.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Contributions to open-source models, Hugging Face spaces, or datasets.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Demonstrating failure cases and how you debugged out-of-distribution shifts.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>ISO 17024 and Open Badges 3.0 cryptographically verified credentials.</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-rose-500/30 bg-rose-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-rose-700 dark:text-rose-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Red Flags That Disqualify Resumes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs sm:text-sm text-foreground">
              <div className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✗</span>
                <span>Listing 30 libraries (TensorFlow, PyTorch, Jax, LangChain) without deep mastery in any.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✗</span>
                <span>Clone projects straight from 2018 medium tutorials (MNIST digit recognizer, Titanic).</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✗</span>
                <span>Inability to explain the difference between cross-entropy loss and mean squared error.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✗</span>
                <span>Claiming &quot;AI Architect&quot; while having never handled an out-of-memory GPU error.</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer CTA: Earn Verifiable Badges */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-primary/10 via-indigo-500/10 to-purple-500/10 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-foreground">
              Ready to prove your skills with verifiable credentials?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Complete the interactive coding challenges and receive an ISO 17024 cryptographic certificate for your LinkedIn.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/challenges">
              <Button className="rounded-xl gap-2 shadow-md">
                Solve Challenges <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </NexusShell>
  );
}
