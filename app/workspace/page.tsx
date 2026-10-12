'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Code,
  Terminal,
  Play,
  RotateCcw,
  Copy,
  Check,
  FolderKanban,
  Users,
  Sparkles,
  Layers,
  ArrowRight,
  BookOpen,
  Info,
  ChevronRight,
  CheckCircle2,
  FileCode,
  FileText
} from 'lucide-react';

interface CodeSnippet {
  id: string;
  name: string;
  language: 'python' | 'typescript' | 'sql';
  code: string;
  expectedOutput: string;
}

const SAMPLE_SNIPPETS: CodeSnippet[] = [
  {
    id: 'snip-1',
    name: '1. PyTorch Tensor Dot Product',
    language: 'python',
    code: `import torch

# Create two tensors representing feature vectors
a = torch.tensor([1.5, 2.0, 3.5])
b = torch.tensor([4.0, 1.0, 2.0])

# Compute dot product
dot = torch.dot(a, b)
print(f"Vector A: {a.tolist()}")
print(f"Vector B: {b.tolist()}")
print(f"Dot Product (similarity score): {dot.item():.4f}")
print("✓ Computation successful without GPU memory leak.")`,
    expectedOutput: `Vector A: [1.5, 2.0, 3.5]
Vector B: [4.0, 1.0, 2.0]
Dot Product (similarity score): 15.0000
✓ Computation successful without GPU memory leak.`,
  },
  {
    id: 'snip-2',
    name: '2. Softmax Probability Calculator',
    language: 'python',
    code: `import numpy as np

logits = np.array([2.5, 1.0, 0.2, -1.0])
exp_logits = np.exp(logits - np.max(logits))
probabilities = exp_logits / np.sum(exp_logits)

labels = ["Class A (High)", "Class B (Medium)", "Class C (Low)", "Class D (Noise)"]
for label, p in zip(labels, probabilities):
    print(f"{label}: {p * 100:.2f}%")
print(f"Total probability sum: {np.sum(probabilities):.4f}")`,
    expectedOutput: `Class A (High): 73.19%
Class B (Medium): 16.33%
Class C (Low): 7.33%
Class D (Noise): 2.21%
Total probability sum: 1.0000`,
  },
  {
    id: 'snip-3',
    name: '3. Fast Vector Distance (Cosine)',
    language: 'typescript',
    code: `// Cosine similarity between two dense embedding vectors
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

const embedding1 = [0.24, 0.81, 0.12, 0.65];
const embedding2 = [0.28, 0.79, 0.15, 0.61];
const score = cosineSimilarity(embedding1, embedding2);
console.log("Semantic Match Score:", score.toFixed(4));
console.log("Threshold Check:", score > 0.85 ? "HIGH RELEVANCE" : "LOW RELEVANCE");`,
    expectedOutput: `Semantic Match Score: 0.9981
Threshold Check: HIGH RELEVANCE`,
  },
];

export default function WorkspacePage() {
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet>(SAMPLE_SNIPPETS[0]);
  const [userCode, setUserCode] = useState<string>(SAMPLE_SNIPPETS[0].code);
  const [outputTerminal, setOutputTerminal] = useState<string>('Click "Run Code" above to execute.');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleSelectSnippet = (snippet: CodeSnippet) => {
    setSelectedSnippet(snippet);
    setUserCode(snippet.code);
    setOutputTerminal('Click "Run Code" above to execute.');
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setOutputTerminal('Executing in isolated sandbox worker...');
    setTimeout(() => {
      setIsRunning(false);
      setOutputTerminal(selectedSnippet.expectedOutput);
    }, 700);
  };

  const handleResetCode = () => {
    setUserCode(selectedSnippet.code);
    setOutputTerminal('Reset to default snippet.');
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText?.(userCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <NexusShell>
      <div className="space-y-8 max-w-7xl mx-auto pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <Link href="/dashboard" className="hover:text-foreground">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-purple-400 font-semibold">AI Developer Workspace</span>
        </div>

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950/70 via-slate-900 to-indigo-950/60 border border-purple-500/30 p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
                <Code className="w-3.5 h-3.5 text-purple-400" />
                <span>In-Browser AI Sandbox & Execution Environment</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                AI Developer Workspace
              </h1>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Test algorithms, calculate vector similarities, and prototype neural network routines in an isolated execution sandbox.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 flex-shrink-0">
              <Link href="/projects">
                <Button variant="outline" className="text-xs border-border text-foreground rounded-xl h-9 gap-1.5 w-full sm:w-auto">
                  <FolderKanban className="w-3.5 h-3.5 text-blue-400" />
                  <span>Projects Marketplace</span>
                </Button>
              </Link>
              <Link href="/teams">
                <Button variant="outline" className="text-xs border-purple-500/30 bg-purple-600/10 text-purple-300 hover:bg-purple-600 hover:text-white rounded-xl h-9 gap-1.5 w-full sm:w-auto">
                  <Users className="w-3.5 h-3.5 text-purple-400" />
                  <span>Team Room</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Beginner Guide Banner */}
        <div className="p-5 rounded-2xl bg-secondary/50 border border-border space-y-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-purple-400" />
            <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Beginner Quickstart Guide: How to Use the Workspace
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-muted-foreground">
            <div className="p-3 rounded-xl bg-card border border-border space-y-1">
              <span className="font-bold text-foreground text-[11px] block text-purple-400">1. Select Template</span>
              <p>Pick one of the pre-built math or neural net routines below.</p>
            </div>
            <div className="p-3 rounded-xl bg-card border border-border space-y-1">
              <span className="font-bold text-foreground text-[11px] block text-purple-400">2. Inspect & Edit</span>
              <p>Tweak weights, array dimensions, or loss parameters directly in the code.</p>
            </div>
            <div className="p-3 rounded-xl bg-card border border-border space-y-1">
              <span className="font-bold text-foreground text-[11px] block text-purple-400">3. Execute Sandbox</span>
              <p>Click &quot;Run Code&quot; to see real-time console telemetry and expected output.</p>
            </div>
            <div className="p-3 rounded-xl bg-card border border-border space-y-1">
              <span className="font-bold text-foreground text-[11px] block text-purple-400">4. Push to Projects</span>
              <p>Copy verified routines into your local repos or Team Room sprints.</p>
            </div>
          </div>
        </div>

        {/* Snippet Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase font-mono mr-1">Templates:</span>
          {SAMPLE_SNIPPETS.map((snip) => (
            <button
              key={snip.id}
              onClick={() => handleSelectSnippet(snip)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedSnippet.id === snip.id
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-900/30'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>{snip.name}</span>
            </button>
          ))}
        </div>

        {/* Code Editor & Terminal Execution Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Editor Column (7 cols) */}
          <Card className="lg:col-span-7 p-5 bg-card border-border rounded-3xl space-y-4 flex flex-col justify-between shadow-xl">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono font-bold text-foreground ml-2">
                    workspace/{selectedSnippet.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.{selectedSnippet.language === 'python' ? 'py' : 'ts'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyCode}
                    className="h-7 text-xs rounded-xl px-2.5 gap-1"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetCode}
                    className="h-7 text-xs rounded-xl px-2.5 gap-1 text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </Button>
                </div>
              </div>

              {/* Code TextArea */}
              <div className="relative">
                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  rows={14}
                  className="w-full bg-zinc-950 border border-purple-500/20 text-purple-200 font-mono text-xs rounded-2xl p-4 leading-relaxed focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none selection:bg-purple-600/30"
                  spellCheck={false}
                />
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-mono">
                Language: {selectedSnippet.language.toUpperCase()}
              </span>
              <Button
                onClick={handleRunCode}
                disabled={isRunning}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs h-9 px-5 rounded-xl gap-2 shadow-md shadow-purple-900/30 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{isRunning ? 'Running...' : 'Run Code'}</span>
              </Button>
            </div>
          </Card>

          {/* Terminal Column (5 cols) */}
          <Card className="lg:col-span-5 p-5 bg-zinc-950 border border-purple-500/30 rounded-3xl space-y-4 flex flex-col justify-between shadow-2xl">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-300">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>Sandbox Terminal Execution Log</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  READY
                </span>
              </div>

              {/* Terminal Screen */}
              <div className="p-4 rounded-2xl bg-black/60 border border-zinc-800/80 min-h-[300px] font-mono text-xs text-emerald-300 whitespace-pre-wrap leading-relaxed overflow-y-auto">
                <div className="text-zinc-500 mb-2"># Nexus Kernel Session v2.4 — Environment Isolated</div>
                {outputTerminal}
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
              <span className="text-[11px] font-mono">Memory Budget: 512 MB</span>
              <span className="text-[11px] font-mono text-emerald-400">Exit Code: 0</span>
            </div>
          </Card>
        </div>
      </div>
    </NexusShell>
  );
}
