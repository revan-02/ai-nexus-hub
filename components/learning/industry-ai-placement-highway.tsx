'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Briefcase,
  TrendingUp,
  Award,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Bot,
  Cpu,
  Layers,
  Network,
  Lock,
  Code,
  DollarSign,
  Building,
  Target,
  ExternalLink,
  ChevronRight,
  BarChart3,
  Flame,
  FileCheck
} from 'lucide-react';

export interface IndustryJobRole {
  id: string;
  title: string;
  salaryUS: string;
  salaryIN: string;
  demandLevel: 'Ultra High' | 'High' | 'Exploding';
  description: string;
  keySkills: string[];
  recommendedCourses: { id: string; title: string; level: string }[];
  portfolioDeliverables: string[];
  hiringCompanies: string[];
}

export const INDUSTRY_AI_ROLES: IndustryJobRole[] = [
  {
    id: 'role-agentic-ai',
    title: 'Autonomous Multi-Agent AI Engineer',
    salaryUS: '$150,000 – $235,000',
    salaryIN: '₹30,00,000 – ₹55,00,000',
    demandLevel: 'Exploding',
    description: 'Build enterprise-grade autonomous systems where multiple AI agents collaborate, plan multi-step workflows, execute code, call APIs via MCP, and interface with live databases.',
    keySkills: ['LangGraph', 'CrewAI', 'Model Context Protocol (MCP)', 'Tool Calling', 'Human-in-the-Loop', 'ReAct Loops', 'FastAPI'],
    recommendedCourses: [
      { id: 'crs-6', title: 'Autonomous Multi-Agent Systems & LangGraph Workflows', level: 'Advanced' },
      { id: 'crs-4', title: 'Generative AI, LLMs & Enterprise RAG Architecture', level: 'Advanced' },
    ],
    portfolioDeliverables: [
      'Production Multi-Agent Financial Research Swarm with LangGraph',
      'Automated Pull Request Code Review Bot with GitHub Webhooks & MCP',
    ],
    hiringCompanies: ['Anthropic', 'OpenAI', 'Microsoft', 'Databricks', 'Cohere', 'Enterprise Startups'],
  },
  {
    id: 'role-llm-architect',
    title: 'Generative AI & LLM Solutions Architect',
    salaryUS: '$160,000 – $250,000',
    salaryIN: '₹35,00,000 – ₹65,00,000',
    demandLevel: 'Ultra High',
    description: 'Architect scalable generative AI solutions, hybrid GraphRAG systems, fine-tuning pipelines with LoRA/QLoRA, and token-cost-optimized infrastructure.',
    keySkills: ['GraphRAG', 'Neo4j', 'LoRA / QLoRA', 'vLLM', 'Pinecone / Qdrant', 'RAGAS Evaluation', 'Prompt Engineering'],
    recommendedCourses: [
      { id: 'crs-4', title: 'Generative AI, LLMs & Enterprise RAG Architecture', level: 'Advanced' },
      { id: 'crs-5', title: 'LoRA Fine-Tuning & MLOps Deployment', level: 'Advanced' },
      { id: 'crs-8', title: 'Enterprise GraphRAG & Hybrid Knowledge Retrieval', level: 'Advanced' },
    ],
    portfolioDeliverables: [
      'Enterprise Neo4j + Vector Hybrid GraphRAG Assistant with zero hallucinations',
      'Domain-adapted 70B LLaMA-3 LoRA Fine-Tuning Pipeline with Weights & Biases',
    ],
    hiringCompanies: ['Google DeepMind', 'AWS AI', 'Meta', 'Snowflake', 'Palantir', 'Accenture AI'],
  },
  {
    id: 'role-ai-infra-mlops',
    title: 'AI Infrastructure & MLOps Engineer',
    salaryUS: '$145,000 – $225,000',
    salaryIN: '₹28,00,000 – ₹50,00,000',
    demandLevel: 'Ultra High',
    description: 'Deploy, scale, and optimize high-throughput model inference on Kubernetes GPU clusters with sub-10ms latency SLAs and continuous batching.',
    keySkills: ['vLLM', 'Triton Inference Server', 'TensorRT-LLM', 'PagedAttention', 'Kubernetes (K8s)', 'CUDA / Triton', 'FP8 Quantization'],
    recommendedCourses: [
      { id: 'crs-7', title: 'High-Throughput LLM Inference Serving (vLLM & Triton)', level: 'Advanced' },
      { id: 'crs-5', title: 'LoRA Fine-Tuning & MLOps Deployment', level: 'Advanced' },
    ],
    portfolioDeliverables: [
      'Distributed GPU Inference Engine on K8s handling 10,000 req/sec with vLLM',
      'Quantized FP8 Model Serving Cluster with Triton & Prometheus Telemetry',
    ],
    hiringCompanies: ['NVIDIA', 'Lambda Labs', 'RunPod', 'CoreWeave', 'Uber', 'Scale AI'],
  },
  {
    id: 'role-computer-vision',
    title: 'Applied Computer Vision & Multimodal Engineer',
    salaryUS: '$140,000 – $210,000',
    salaryIN: '₹25,00,000 – ₹45,00,000',
    demandLevel: 'High',
    description: 'Develop real-time object detection, segmentation, and vision-language systems for robotics, healthcare, autonomous inspection, and precision agriculture.',
    keySkills: ['YOLOv11', 'Vision Transformers (ViT)', 'CLIP / LLaVA', 'OpenCV', 'TensorRT', 'DICOM Medical AI', 'Edge AI'],
    recommendedCourses: [
      { id: 'crs-9', title: 'Vision-Language Models, Multimodal AI & YOLOv11', level: 'Advanced' },
      { id: 'crs-3', title: 'Deep Learning & Neural Networks with PyTorch', level: 'Intermediate' },
    ],
    portfolioDeliverables: [
      'Precision Agriculture Crop Leaf Disease Real-Time Scanner with YOLOv11',
      'Multimodal Medical Radiography Lesion Segmentation on Kubernetes',
    ],
    hiringCompanies: ['Tesla Autopilot', 'Apple', 'Siemens Healthineers', 'John Deere AI', 'Robotics Labs'],
  },
  {
    id: 'role-ai-security',
    title: 'AI Safety, Security & Red-Teaming Specialist',
    salaryUS: '$150,000 – $230,000',
    salaryIN: '₹30,00,000 – ₹52,00,000',
    demandLevel: 'Exploding',
    description: 'Protect enterprise AI applications from adversarial prompt injections, model extraction, jailbreaks, data leakage, and ensure regulatory compliance with EU AI Act and SOC2.',
    keySkills: ['OWASP Top 10 for LLMs', 'NVIDIA NeMo Guardrails', 'Adversarial Red-Teaming', 'Llama-Guard', 'EU AI Act Compliance', 'Cryptographic Proofs'],
    recommendedCourses: [
      { id: 'crs-10', title: 'AI Safety, Prompt Injection Defense & Enterprise Guardrails', level: 'Advanced' },
      { id: 'crs-4', title: 'Generative AI, LLMs & Enterprise RAG Architecture', level: 'Advanced' },
    ],
    portfolioDeliverables: [
      'Automated LLM Red-Teaming & Prompt Injection Firewall with NeMo Guardrails',
      'ISO 17024 & Open Badges 3.0 Cryptographic Integrity Audit Pipeline',
    ],
    hiringCompanies: ['CrowdStrike', 'Palo Alto Networks', 'Anthropic Trust & Safety', 'JPMorgan AI Security', 'Big 4 Consultancies'],
  },
];

export function IndustryAIPlacementHighway() {
  const [selectedRoleId, setSelectedRoleId] = useState<string>('role-agentic-ai');
  const selectedRole = INDUSTRY_AI_ROLES.find((r) => r.id === selectedRoleId) || INDUSTRY_AI_ROLES[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ── TOP HERO BANNER: WHAT IS HAPPENING IN THE AI INDUSTRY RIGHT NOW ── */}
      <Card className="relative overflow-hidden rounded-3xl border-purple-500/30 bg-gradient-to-br from-[#130d24] via-[#100b1e] to-[#170e2b] p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                Industry AI Shift & Hiring Pulse 2026
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono font-bold">
                120+ Hiring Partners
              </span>
            </div>

            <Link href="/careers">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-9 px-4 rounded-xl gap-2 shadow-lg shadow-purple-950/40 cursor-pointer">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Explore Live Job Openings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-foreground tracking-tight">
            How This Platform Bridges the Academic Gap & Gets You Placed in Top AI Roles
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground max-w-4xl leading-relaxed">
            Traditional universities and generic courses still teach outdated 2018 machine learning theory with toy datasets. The real-world AI industry in 2026 has transitioned to <strong>Autonomous Multi-Agent Swarms, Self-Hosted vLLM GPU Clusters, GraphRAG with Knowledge Graphs, and Real-Time Multimodal Edge Vision</strong>. Every course here is built backwards from real job descriptions to guarantee hiring readiness.
          </p>

          {/* 5 Industry Paradigm Shifts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-3">
            {[
              {
                icon: Bot,
                title: 'Agentic Workflows',
                oldWay: 'Old: Simple chat prompts',
                newWay: '2026: Multi-agent LangGraph swarms with tool calling & DB memory',
                color: 'text-purple-400',
              },
              {
                icon: Cpu,
                title: 'Inference & vLLM',
                oldWay: 'Old: Expensive cloud APIs',
                newWay: '2026: Self-hosted vLLM with PagedAttention & FP8 serving',
                color: 'text-blue-400',
              },
              {
                icon: Network,
                title: 'GraphRAG Systems',
                oldWay: 'Old: Vector-only search',
                newWay: '2026: Neo4j Knowledge Graphs + dense vectors (zero hallucinations)',
                color: 'text-emerald-400',
              },
              {
                icon: Zap,
                title: 'Edge & SLMs',
                oldWay: 'Old: Heavy 100B+ models',
                newWay: '2026: Quantized Phi-4 & Qwen on mobile, Jetson & WebGPU',
                color: 'text-amber-400',
              },
              {
                icon: ShieldCheck,
                title: 'Enterprise Safety',
                oldWay: 'Old: Blind LLM generation',
                newWay: '2026: OWASP Top 10 protection, NeMo guardrails & red-teaming',
                color: 'text-rose-400',
              },
            ].map((shift, idx) => {
              const Icon = shift.icon;
              return (
                <div key={idx} className="p-3.5 rounded-2xl bg-secondary/50 border border-border space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-foreground">
                    <Icon className={`w-4 h-4 ${shift.color}`} />
                    <span>{shift.title}</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground line-through opacity-70">
                    {shift.oldWay}
                  </div>
                  <div className="text-[11px] font-semibold text-purple-300">
                    {shift.newWay}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* ── 4-STAGE PLACEMENT ENGINE: HOW THIS GETS YOU HIRED ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-400" />
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              The 4-Pillar AI Job Placement Highway
            </h3>
          </div>
          <span className="text-xs text-muted-foreground font-mono">Guaranteed Proof of Work</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              step: '01',
              title: 'Production GitHub Repos',
              badge: 'Real-World Architecture',
              desc: 'No toy Jupyter notebooks. Every project includes clean modular Python packages, FastAPI microservices, Dockerfiles, and Kubernetes Helm charts.',
              icon: Code,
              color: 'border-purple-500/40 text-purple-400',
            },
            {
              step: '02',
              title: 'ISO 17024 Verified Badges',
              badge: 'Cryptographic Proof',
              desc: 'Anti-cheat proctored certification exams with Open Badges 3.0 and Ed25519 digital signatures that recruiters can verify with 1-click.',
              icon: ShieldCheck,
              color: 'border-emerald-500/40 text-emerald-400',
            },
            {
              step: '03',
              title: 'AI Mock Interview Simulator',
              badge: 'FAANG & Startup Tested',
              desc: 'Practice technical coding questions, mathematical derivations, and scalable AI system design interviews with instant audio feedback and scorecards.',
              icon: Target,
              color: 'border-blue-500/40 text-blue-400',
            },
            {
              step: '04',
              title: '1-Click Direct Applying',
              badge: '120+ Hiring Partners',
              desc: 'Direct resume submission to active AI job postings on our platform with automated matching scores based on your completed verified skills.',
              icon: Briefcase,
              color: 'border-amber-500/40 text-amber-400',
            },
          ].map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Card key={pillar.step} className={`p-5 bg-card border ${pillar.color} rounded-2xl space-y-3 shadow-lg relative`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xl font-black opacity-30 text-foreground">{pillar.step}</span>
                  <span className="px-2 py-0.5 rounded-full bg-secondary text-[10px] font-mono font-bold text-foreground border border-border">
                    {pillar.badge}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5" />
                  <h4 className="text-sm font-bold text-foreground">{pillar.title}</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{pillar.desc}</p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ── INTERACTIVE ROLE & SALARY EXPLORER ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              Select Your Target AI Role & Career Pathway
            </h3>
          </div>
          <span className="text-xs text-muted-foreground font-mono">Live Salary & Skill Matrix</span>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {INDUSTRY_AI_ROLES.map((role) => {
            const isSelected = selectedRoleId === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setSelectedRoleId(role.id)}
                className={`px-4 py-2.5 rounded-2xl border text-left transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 text-xs font-semibold ${
                  isSelected
                    ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-950/40 font-bold'
                    : 'bg-card border-border hover:bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>{role.title}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  isSelected ? 'bg-black/30 text-white' : 'bg-secondary text-purple-400'
                }`}>
                  {role.demandLevel}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Role Deep-Dive Card */}
        <Card className="p-6 bg-card border-border rounded-3xl space-y-6 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border pb-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 font-mono text-xs font-bold rounded-xl border border-purple-500/30">
                  Target Career Role
                </span>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold rounded-lg border border-emerald-500/30">
                  Demand: {selectedRole.demandLevel}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-foreground">{selectedRole.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">{selectedRole.description}</p>
            </div>

            {/* Compensation Box */}
            <div className="p-4 rounded-2xl bg-secondary/80 border border-border space-y-2 min-w-[240px] text-right sm:text-left lg:text-right">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block font-mono">Market Compensation Range:</span>
              <div className="text-base sm:text-lg font-bold text-emerald-400 font-mono">{selectedRole.salaryUS}</div>
              <div className="text-xs font-mono text-purple-300 font-semibold">{selectedRole.salaryIN} / year</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Required Tech Stack */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-purple-400" />
                Required Industry Tech Stack:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedRole.keySkills.map((skill, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-secondary text-foreground text-xs font-mono font-medium rounded-lg border border-border">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="pt-2">
                <span className="text-[11px] text-muted-foreground block font-mono">Top Hiring Employers:</span>
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {selectedRole.hiringCompanies.map((company, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-purple-500/10 text-purple-300 text-[10px] font-bold rounded">
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Required Course Tracks to Take */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                Curated Course Tracks on Platform:
              </h4>
              <div className="space-y-2">
                {selectedRole.recommendedCourses.map((c) => (
                  <div key={c.id} className="p-3 bg-secondary/50 rounded-xl border border-border space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-[9px] font-mono font-bold rounded">
                        {c.level}
                      </span>
                      <Link href={`/learn/${c.id}`} className="text-[11px] text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1">
                        Start <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <p className="text-xs font-bold text-foreground">{c.title}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio Deliverables */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider font-mono flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                Portfolio Deliverables on Resume:
              </h4>
              <ul className="space-y-2">
                {selectedRole.portfolioDeliverables.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-2.5 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-xs text-muted-foreground leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-zinc-200">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2">
                <Link href="/interview-prep">
                  <Button className="w-full bg-secondary hover:bg-secondary/80 text-foreground text-xs font-bold h-9 rounded-xl gap-2 border border-border cursor-pointer">
                    <Target className="w-3.5 h-3.5 text-purple-400" />
                    <span>Launch AI Mock Interview for this Role</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
