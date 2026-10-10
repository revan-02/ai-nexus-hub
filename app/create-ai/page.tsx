'use client';

import React, { useState } from 'react';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wand2, CheckCircle2, ChevronRight, Play, Server, Database, Brain, Sparkles, Layers, Sliders, Calculator, Code } from 'lucide-react';
import Link from 'next/link';
import { DeepMathAndLLMBuilder } from '@/components/learning/deep-math-and-llm-builder';

export default function CreateAIPage() {
  const [builderMode, setBuilderMode] = useState<'wizard' | 'llm-studio'>('wizard');
  const [currentStep, setCurrentStep] = useState(1);
  const [projectName, setProjectName] = useState('Enterprise AI Copilot');
  const [projectObjective, setProjectObjective] = useState('Knowledge Base Q&A / RAG');
  const [selectedBackbone, setSelectedBackbone] = useState('Meta Llama 3.2 (3B)');
  const [modelType, setModelType] = useState('LLM / RAG Agent');
  const [datasetSelect, setDatasetSelect] = useState('OpenMedical 3D CT Corpus');
  const [epochs, setEpochs] = useState('10');
  const [batchSize, setBatchSize] = useState('32');
  const [trainingState, setTrainingState] = useState<'idle' | 'training' | 'completed'>('idle');

  const wizardSteps = [
    { num: 1, name: 'Define Problem' },
    { num: 2, name: 'Select Data' },
    { num: 3, name: 'Choose AI Type' },
    { num: 4, name: 'Choose Model' },
    { num: 5, name: 'Configure' },
    { num: 6, name: 'Train' },
    { num: 7, name: 'Evaluate' },
    { num: 8, name: 'Deploy' },
    { num: 9, name: 'Monitor' },
  ];

  const handleStartTraining = () => {
    setTrainingState('training');
    setTimeout(() => {
      setTrainingState('completed');
    }, 3000);
  };

  return (
    <NexusShell>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-purple-400 font-semibold">Create Your Own AI</span>
        </div>

        {/* Header with Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">AI Model Engineering Studio</h1>
              <Wand2 className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Build, configure, fine-tune, evaluate and deploy custom machine learning and LLM agent pipelines from scratch.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-secondary/80 p-1 rounded-2xl border border-border">
            <button
              onClick={() => setBuilderMode('wizard')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                builderMode === 'wizard'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Guided Wizard</span>
            </button>

            <button
              onClick={() => setBuilderMode('llm-studio')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                builderMode === 'llm-studio'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-cyan-400" />
              <span>Math Lab & LLM Studio</span>
            </button>
          </div>
        </div>

        {builderMode === 'llm-studio' ? (
          <DeepMathAndLLMBuilder />
        ) : (
          <>

        {/* 9-Step Pipeline Stepper Bar */}
        <Card className="p-4 bg-card border-border rounded-2xl overflow-x-auto scrollbar-none">
          <div className="flex items-center justify-between min-w-[700px] gap-2">
            {wizardSteps.map((s) => {
              const isActive = currentStep === s.num;
              const isPast = currentStep > s.num;
              return (
                <button
                  key={s.num}
                  onClick={() => setCurrentStep(s.num)}
                  className={`flex flex-col items-center gap-1.5 flex-1 p-2 rounded-xl text-center transition-all cursor-pointer ${
                    isActive ? 'bg-purple-600/15 border border-purple-500/40 text-purple-400 font-bold' : 'hover:bg-secondary text-muted-foreground'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                    isPast ? 'bg-emerald-500 text-white' : isActive ? 'bg-purple-600 text-white' : 'bg-secondary border border-border'
                  }`}>
                    {isPast ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                  </div>
                  <span className="text-[10px] font-semibold whitespace-nowrap">{s.name}</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Active Step Panel */}
        <Card className="p-6 bg-card border-border rounded-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <span className="text-xs font-mono text-purple-400 font-bold">Step {currentStep} of 9</span>
              <h2 className="text-lg font-bold text-foreground mt-0.5">{wizardSteps[currentStep - 1].name}</h2>
            </div>

            <div className="flex items-center gap-2">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="bg-secondary border-border text-foreground text-xs h-9 px-4 rounded-xl"
                >
                  Back
                </Button>
              )}
              {currentStep < 9 && (
                <Button
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold h-9 px-4 rounded-xl shadow-sm shadow-purple-900/30"
                >
                  Next Step
                </Button>
              )}
            </div>
          </div>

          {/* Step 1: Define Problem */}
          {currentStep === 1 && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-foreground mb-1.5">Model / Agent Project Name</label>
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Enterprise RAG Customer Support Copilot"
                  className="bg-secondary border-border text-foreground text-xs h-9"
                />
              </div>
              <div>
                <label className="block font-bold text-foreground mb-1.5">Choose Problem Domain / Task Template</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'rag', title: 'Knowledge Base Q&A / RAG', desc: 'Synthesize verified answers from company docs and databases' },
                    { id: 'code', title: 'Automated Code Reviewer', desc: 'Scan pull requests for security vulnerabilities and bugs' },
                    { id: 'medical', title: 'Medical Imaging Classifier', desc: 'Detect lesions and anomalies in DICOM and MRI scans' },
                  ].map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setProjectObjective(p.title)}
                      className={`p-3.5 rounded-xl border cursor-pointer space-y-1 transition-all ${
                        projectObjective === p.title
                          ? 'bg-purple-600/15 border-purple-500 shadow-md text-foreground'
                          : 'bg-secondary/40 border-border hover:bg-secondary text-muted-foreground'
                      }`}
                    >
                      <h4 className="font-bold text-xs text-foreground">{p.title}</h4>
                      <p className="text-[11px] leading-relaxed">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block font-bold text-foreground mb-1.5">Problem Objective & Scope</label>
                <textarea
                  rows={3}
                  value={projectObjective}
                  onChange={(e) => setProjectObjective(e.target.value)}
                  placeholder="Describe what task the AI system should perform..."
                  className="w-full p-3 bg-secondary border border-border rounded-xl text-xs text-foreground focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Step 2: Select Data */}
          {currentStep === 2 && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-foreground mb-1.5">Choose Dataset for Training</label>
                <p className="text-muted-foreground mb-3">Select a verified curated training corpus or upload custom JSONL / CSV instruction samples.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { name: 'OpenMedical 3D CT Corpus', size: '2.4 GB', samples: '14,200 scans', type: 'Computer Vision' },
                    { name: 'FinTech Enterprise Support Q&A', size: '480 MB', samples: '52,000 pairs', type: 'NLP / RAG' },
                    { name: 'Full-Stack Code PR Commits', size: '1.2 GB', samples: '88,000 files', type: 'Code Generation' },
                    { name: 'VTU AI Syllabus Solved Exams', size: '320 MB', samples: '12,500 questions', type: 'Domain Tutor' },
                  ].map((d) => (
                    <div
                      key={d.name}
                      onClick={() => setDatasetSelect(d.name)}
                      className={`p-4 rounded-xl border cursor-pointer space-y-1.5 transition-all ${
                        datasetSelect === d.name
                          ? 'bg-purple-600/15 border-purple-500 shadow-md'
                          : 'bg-secondary/40 border-border hover:bg-secondary'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-foreground">{d.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary text-purple-300 border border-purple-500/30">{d.type}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">Volume: {d.size} • {d.samples}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Choose AI Type */}
          {currentStep === 3 && (
            <div className="space-y-4 text-xs">
              <label className="block font-bold text-foreground mb-1.5">Choose Model Architecture Family</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { name: 'LLM / RAG Agent', desc: 'Autonomous reasoning, vector retrieval, and prompt completions.' },
                  { name: 'Computer Vision Model', desc: 'Object detection, pixel segmentation, and convolutional neural nets.' },
                  { name: 'Predictive Tabular ML', desc: 'Gradient boosting, random forests, and risk scoring algorithms.' }
                ].map((type) => (
                  <div
                    key={type.name}
                    onClick={() => setModelType(type.name)}
                    className={`p-4 rounded-2xl border cursor-pointer space-y-2 transition-all ${
                      modelType === type.name ? 'bg-purple-600/15 border-purple-500 shadow-md' : 'bg-secondary/50 border-border hover:bg-secondary'
                    }`}
                  >
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <h4 className="font-bold text-foreground text-sm">{type.name}</h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{type.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Choose Model */}
          {currentStep === 4 && (
            <div className="space-y-4 text-xs">
              <label className="block font-bold text-foreground mb-1.5">Select Base Pre-Trained Backbone</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'llama3.2', name: 'Meta Llama 3.2 (3B)', params: '3 Billion', bestFor: 'Low-latency edge deployment & fast chat' },
                  { id: 'deepseek-r1', name: 'DeepSeek-R1 Distill (7B)', params: '7 Billion', bestFor: 'Deep mathematical reasoning & complex logic' },
                  { id: 'qwen2.5-coder', name: 'Qwen 2.5 Coder (7B)', params: '7 Billion', bestFor: 'Python, TypeScript, SQL, and unit tests' },
                ].map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedBackbone(m.name)}
                    className={`p-4 rounded-xl border cursor-pointer space-y-1.5 transition-all ${
                      selectedBackbone === m.name
                        ? 'bg-purple-600/15 border-purple-500 shadow-md'
                        : 'bg-secondary/40 border-border hover:bg-secondary'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-foreground">{m.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary text-emerald-300 border border-emerald-500/30">{m.params}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{m.bestFor}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Configure */}
          {currentStep === 5 && (
            <div className="space-y-4 text-xs">
              <h3 className="font-bold text-foreground text-sm">Hyperparameter Optimization & Hardware Configuration</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-secondary/50 rounded-xl border border-border space-y-3">
                  <div>
                    <label className="block font-bold text-muted-foreground mb-1">Epochs</label>
                    <Input
                      value={epochs}
                      onChange={(e) => setEpochs(e.target.value)}
                      className="bg-secondary border-border text-xs h-8"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-muted-foreground mb-1">Batch Size</label>
                    <Input
                      value={batchSize}
                      onChange={(e) => setBatchSize(e.target.value)}
                      className="bg-secondary border-border text-xs h-8"
                    />
                  </div>
                </div>
                <div className="p-4 bg-secondary/50 rounded-xl border border-border space-y-2">
                  <span className="font-bold text-foreground block">Target Accelerator Node</span>
                  <div className="text-muted-foreground space-y-1 text-[11px] font-mono">
                    <p>• GPU: 4x NVIDIA H100 SXM5 (80GB VRAM each)</p>
                    <p>• Precision: Bfloat16 Mixed Precision with FlashAttention-2</p>
                    <p>• Strategy: LoRA Rank 16, Alpha 32</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Train */}
          {currentStep === 6 && (
            <div className="space-y-4 text-xs text-center py-6">
              <div className="w-16 h-16 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center mx-auto">
                <Brain className="w-8 h-8" />
              </div>

              {trainingState === 'idle' && (
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-foreground">Ready to Launch Training Job</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Training backbone: <strong className="text-foreground">{selectedBackbone}</strong> on <strong className="text-foreground">{datasetSelect}</strong>.
                  </p>
                  <Button
                    onClick={handleStartTraining}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs h-9 px-6 rounded-xl shadow-md shadow-purple-900/30 gap-2 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" /> Start Model Training
                  </Button>
                </div>
              )}

              {trainingState === 'training' && (
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-purple-400 animate-pulse">Training Model in Progress...</h3>
                  <div className="w-64 mx-auto bg-secondary rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full animate-pulse w-3/4" />
                  </div>
                  <p className="font-mono text-muted-foreground">Epoch 4/{epochs} • Loss: 0.1420 • Validation Accuracy: 98.4%</p>
                </div>
              )}

              {trainingState === 'completed' && (
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-5 h-5" /> Model Training Completed Successfully!
                  </h3>
                  <p className="text-muted-foreground">Validation Accuracy: 99.2% • Loss: 0.0410 • Converged in 1.4m</p>
                  <Button
                    onClick={() => setCurrentStep(7)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold h-9 px-6 rounded-xl cursor-pointer"
                  >
                    Proceed to Evaluation
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Steps 7-9: Evaluate, Deploy, Monitor */}
          {currentStep === 7 && (
            <div className="p-6 text-xs space-y-3">
              <h3 className="font-bold text-sm text-foreground">Step 7: Benchmark & Validation Evaluation</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-secondary rounded-xl border border-border">
                  <span className="text-muted-foreground block text-[10px]">Test Accuracy</span>
                  <span className="text-lg font-bold text-emerald-400 font-mono">99.2%</span>
                </div>
                <div className="p-3 bg-secondary rounded-xl border border-border">
                  <span className="text-muted-foreground block text-[10px]">Perplexity</span>
                  <span className="text-lg font-bold text-purple-400 font-mono">3.41</span>
                </div>
                <div className="p-3 bg-secondary rounded-xl border border-border">
                  <span className="text-muted-foreground block text-[10px]">Inference Latency</span>
                  <span className="text-lg font-bold text-amber-400 font-mono">14.2ms</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 8 && (
            <div className="p-6 text-xs space-y-3">
              <h3 className="font-bold text-sm text-foreground">Step 8: Deploy Endpoint</h3>
              <p className="text-muted-foreground">Export as ONNX, GGUF, or deploy to local Ollama server with one click.</p>
              <div className="p-3 bg-secondary font-mono rounded-xl border border-border text-purple-300">
                <code>ollama run {selectedBackbone.toLowerCase().replace(/[^a-z0-9]/g, '-')}-custom</code>
              </div>
            </div>
          )}

          {currentStep === 9 && (
            <div className="p-6 text-xs space-y-3 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="font-bold text-base text-foreground">Model Lifecycle Active & Monitored</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">Drift detectors, hallucination guardrails, and telemetry logging are active.</p>
            </div>
          )}
        </Card>
        </>
        )}
      </div>
    </NexusShell>
  );
}
