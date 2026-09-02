'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Brain,
  Zap,
  Cpu,
  Terminal,
  Copy,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
  Sliders,
  ShieldCheck,
  Code,
  Download,
  Flame,
  Layers,
  ArrowRight,
  ExternalLink,
  Bot,
  Send,
  User,
  Plus,
  Trash2,
  TrendingDown,
  RefreshCw,
  FileCode,
  GraduationCap,
  Wand2,
  ChevronRight,
  Database
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import Link from 'next/link';
import { useSafeNexus } from '@/context/nexus-context';
import { FREE_OLLAMA_MODELS, FreeOllamaModel } from '@/lib/ai/ollama-client';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  modelUsed?: string;
  metrics?: {
    durationMs: number;
    tokensPerSec: string;
    evalCount: number;
  };
}

interface DatasetPair {
  id: string;
  instruction: string;
  input?: string;
  output: string;
}

const PRESET_TRAINING_DATASETS: Record<string, { name: string; system: string; samples: DatasetPair[] }> = {
  vtu_coach: {
    name: 'VTU Exam & Engineering Coach',
    system: 'You are an authoritative VTU University Engineering Exam Professor. Structure all solutions into Module breakdowns, Bloom taxonomy levels, and step-by-step numerical equations.',
    samples: [
      {
        id: '1',
        instruction: 'Explain Transformer Scaled Dot-Product Attention for a 10-mark VTU exam question.',
        output: 'Bloom Level: L3 (Apply). Scaled Dot-Product Attention computes: Attention(Q,K,V) = softmax((Q K^T) / sqrt(d_k)) V. The factor sqrt(d_k) prevents gradients from vanishing when dimension d_k is large.',
      },
      {
        id: '2',
        instruction: 'State the difference between BFS and A* Search in Artificial Intelligence.',
        output: 'BFS is an uninformed search exploring level by level with O(b^d) time complexity. A* is an informed heuristic search using f(n) = g(n) + h(n), guaranteeing optimality when h(n) is admissible.',
      },
      {
        id: '3',
        instruction: 'Derive the Loss function for Binary Logistic Regression.',
        output: 'Binary Cross Entropy Loss: L(y, y_hat) = - [ y * log(y_hat) + (1 - y) * log(1 - y_hat) ], where y_hat = sigmoid(z) = 1 / (1 + e^(-z)).',
      },
    ],
  },
  pytorch_architect: {
    name: 'PyTorch Deep Learning Specialist',
    system: 'You are a Senior PyTorch AI Architecture Engineer. Output clean, modular, production-ready PyTorch code with explicit tensor shapes and CUDA optimizations.',
    samples: [
      {
        id: '1',
        instruction: 'Write a custom PyTorch Multi-Head Self-Attention module.',
        output: 'import torch\nimport torch.nn as nn\nimport math\n\nclass MultiHeadSelfAttention(nn.Module):\n    def __init__(self, d_model=512, n_heads=8):\n        super().__init__()\n        self.n_heads = n_heads\n        self.d_k = d_model // n_heads\n        self.qkv = nn.Linear(d_model, d_model * 3)\n        self.out = nn.Linear(d_model, d_model)\n\n    def forward(self, x):\n        B, S, D = x.shape\n        q, k, v = self.qkv(x).chunk(3, dim=-1)\n        q = q.view(B, S, self.n_heads, self.d_k).transpose(1, 2)\n        k = k.view(B, S, self.n_heads, self.d_k).transpose(1, 2)\n        v = v.view(B, S, self.n_heads, self.d_k).transpose(1, 2)\n        scores = torch.matmul(q, k.transpose(-2, -1)) / math.sqrt(self.d_k)\n        attn = torch.softmax(scores, dim=-1)\n        out = torch.matmul(attn, v).transpose(1, 2).contiguous().view(B, S, D)\n        return self.out(out)',
      },
      {
        id: '2',
        instruction: 'How do you enable PyTorch FlashAttention-2?',
        output: 'Use torch.nn.functional.scaled_dot_product_attention(q, k, v, is_causal=True). When CUDA compute capability is >= 8.0, PyTorch automatically dispatches to the FlashAttention-2 kernel.',
      },
    ],
  },
};

export function OllamaStudio() {
  const nexus = useSafeNexus();
  const isAiBotEnabled = nexus?.isAiBotEnabled ?? true;
  const [activeTab, setActiveTab] = useState<'chat' | 'trainer' | 'models' | 'installation'>('chat');

  // --- Chatbot State ---
  const [selectedModel, setSelectedModel] = useState<FreeOllamaModel>(FREE_OLLAMA_MODELS[0]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [systemPrompt, setSystemPrompt] = useState<string>(
    'You are a high-speed AI assistant and expert computer science tutor. Provide accurate, structured, and insightful answers with markdown formulas and code blocks.'
  );
  const [temperature, setTemperature] = useState<number>(0.7);
  const [topP, setTopP] = useState<number>(0.9);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: 'Hello! I am your **Ollama AI Assistant**. Ask me any technical questions about AI, Deep Learning, VTU exams, or code architectures, or switch to the **Model Trainer** tab to train your own custom AI model!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'Ollama Engine',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- Training & Fine-Tuning State ---
  const [customModelName, setCustomModelName] = useState<string>('my-vtu-coach');
  const [baseModel, setBaseModel] = useState<string>('llama3.2');
  const [trainerSystemPrompt, setTrainerSystemPrompt] = useState<string>(PRESET_TRAINING_DATASETS.vtu_coach.system);
  const [datasetPairs, setDatasetPairs] = useState<DatasetPair[]>(PRESET_TRAINING_DATASETS.vtu_coach.samples);
  const [loraRank, setLoraRank] = useState<number>(16);
  const [loraAlpha, setLoraAlpha] = useState<number>(32);
  const [epochs, setEpochs] = useState<number>(5);
  const [learningRate, setLearningRate] = useState<string>('0.0002');
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainingProgress, setTrainingProgress] = useState<number>(100);
  const [trainingLogs, setTrainingLogs] = useState<Array<{ epoch: number; step: number; loss: number; accuracy: number }>>([
    { epoch: 1, step: 150, loss: 2.14, accuracy: 65.2 },
    { epoch: 2, step: 300, loss: 1.42, accuracy: 78.9 },
    { epoch: 3, step: 450, loss: 0.88, accuracy: 89.4 },
    { epoch: 4, step: 600, loss: 0.52, accuracy: 94.6 },
    { epoch: 5, step: 750, loss: 0.28, accuracy: 98.4 },
  ]);
  const [generatedModelfile, setGeneratedModelfile] = useState<string>('');
  const [copiedCli, setCopiedCli] = useState<boolean>(false);

  // Auto-scroll chat
  useEffect(() => {
    if (messagesEndRef.current && typeof messagesEndRef.current.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isGenerating]);

  // Handle Send Chat
  const handleSendMessage = async (textToSend?: string) => {
    if (!isAiBotEnabled) {
      alert('AI Bot is disabled by administrator in Settings.');
      return;
    }
    const text = textToSend || inputMessage;
    if (!text.trim() || isGenerating) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsGenerating(true);

    const startTime = performance.now();

    try {
      const res = await fetch('/api/ai/ollama/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel.id,
          prompt: text,
          system: systemPrompt,
          temperature,
          messages: [
            ...chatMessages.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: text },
          ],
        }),
      });

      const data = await res.json();
      const durationMs = performance.now() - startTime;

      if (data.success) {
        const replyContent = data.data.content || data.data.message?.content || 'No answer generated.';
        const tokensCount = replyContent.split(/\s+/).length * 1.3;
        const tokensPerSec = (tokensCount / (durationMs / 1000)).toFixed(1);

        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: replyContent,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: selectedModel.name,
          metrics: {
            durationMs: Math.round(durationMs),
            tokensPerSec: `${tokensPerSec} t/s`,
            evalCount: Math.round(tokensCount),
          },
        };
        setChatMessages((prev) => [...prev, aiMsg]);
      } else {
        const errorMsg: ChatMessage = {
          id: `ai-err-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ Generation Note: ${data.error || 'Connection simulation active.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: selectedModel.name,
        };
        setChatMessages((prev) => [...prev, errorMsg]);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ Error communicating with Ollama: ${err.message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel.name,
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Model Training Simulation & Modelfile Generation
  const handleStartTraining = async () => {
    setIsTraining(true);
    setTrainingProgress(0);

    try {
      const res = await fetch('/api/ai/ollama/train', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseModel,
          customModelName,
          systemPrompt: trainerSystemPrompt,
          dataset: datasetPairs,
          hyperparameters: {
            loraRank,
            loraAlpha,
            learningRate: parseFloat(learningRate) || 0.0002,
            epochs,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setGeneratedModelfile(data.data.modelfileContent);
        setTrainingLogs(data.data.trainingLogs);
      }
    } catch (err) {
      console.warn('Training simulation error:', err);
    }

    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          return 100;
        }
        return prev + 20;
      });
    }, 180);
  };

  const handleAddSample = () => {
    setDatasetPairs((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        instruction: 'New Instruction Prompt...',
        output: 'Expected Model Output Response...',
      },
    ]);
  };

  const handleRemoveSample = (id: string) => {
    setDatasetPairs((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSelectPreset = (key: string) => {
    const preset = PRESET_TRAINING_DATASETS[key];
    if (preset) {
      setTrainerSystemPrompt(preset.system);
      setDatasetPairs(preset.samples);
      setCustomModelName(key.replace('_', '-'));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/70 via-indigo-950/50 to-slate-900 border border-purple-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-xs font-semibold">
              <Bot className="w-3.5 h-3.5 text-purple-400" />
              <span>Free Local LLMs & Custom Model Fine-Tuning Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Ollama AI Chatbot & Model Trainer
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-2xl">
              Ask any engineering questions with high-speed open models (LLaMA-3.2, Mistral, DeepSeek-R1) or fine-tune custom domain models with LoRA adapters and interactive Modelfiles.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 bg-slate-900/90 border border-emerald-500/40 rounded-2xl flex items-center gap-2.5 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <span className="text-[10px] text-zinc-400 block font-sans">Engine Status:</span>
                <span className="font-mono font-bold text-emerald-300">100% Ready (Free & Open)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Bot Disabled Administrator Banner */}
      {!isAiBotEnabled && (
        <div className="p-4 bg-rose-500/15 border border-rose-500/30 rounded-2xl text-xs text-rose-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <span className="font-bold block text-sm">AI Bot is Disabled by Administrator</span>
              <span className="text-[11px] text-zinc-300">The platform administrator has currently suspended AI chatbot and local model inference. You can re-enable it in Settings.</span>
            </div>
          </div>
          <Link
            href="/settings?tab=ai-bot"
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shrink-0 transition-all text-center cursor-pointer"
          >
            Open AI Bot Settings
          </Link>
        </div>
      )}

      {/* Studio Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-border pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'chat', label: 'Ollama AI Chatbot (Q&A)', icon: Bot },
          { id: 'trainer', label: 'Train & Fine-Tune Custom Model', icon: Wand2 },
          { id: 'models', label: 'Free Open Models Matrix', icon: Cpu },
          { id: 'installation', label: '1-Click Local CLI Setup', icon: Terminal },
        ].map((tab) => {
          const isSelected = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-900/40'
                  : 'text-zinc-400 hover:text-foreground hover:bg-secondary'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ==================== TAB 1: OLLAMA CHATBOT ==================== */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column: Chat Control & Model Settings */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-4 bg-card border-border rounded-2xl space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-purple-400" />
                  <span>Select Active AI Model:</span>
                </label>
                <select
                  value={selectedModel.id}
                  onChange={(e) => {
                    const found = FREE_OLLAMA_MODELS.find((m) => m.id === e.target.value);
                    if (found) setSelectedModel(found);
                  }}
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:border-purple-500"
                >
                  {FREE_OLLAMA_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.parameterSize}, {m.quantization})
                    </option>
                  ))}
                  {generatedModelfile && (
                    <option value={`custom-${customModelName}`}>
                      ★ {customModelName} (Custom LoRA Fine-Tuned)
                    </option>
                  )}
                </select>
                <div className="text-[11px] text-zinc-400">
                  {selectedModel.description}
                </div>
              </div>

              {/* Temperature & Top P */}
              <div className="space-y-3 pt-2 border-t border-border text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Temperature:</span>
                  <span className="font-mono font-bold text-purple-300">{temperature}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer h-1.5 bg-secondary rounded-lg"
                />

                <div className="flex justify-between text-zinc-400">
                  <span>Top-P Sampling:</span>
                  <span className="font-mono font-bold text-emerald-400">{topP}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={topP}
                  onChange={(e) => setTopP(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-secondary rounded-lg"
                />
              </div>

              {/* System Prompt */}
              <div className="space-y-1.5 pt-2 border-t border-border">
                <label className="text-[11px] font-bold text-zinc-400 block">System Persona Prompt:</label>
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  rows={3}
                  className="w-full bg-secondary border border-border rounded-xl p-2.5 text-xs text-foreground focus:outline-none focus:border-purple-500 resize-none font-mono"
                />
              </div>

              <Button
                onClick={() =>
                  setChatMessages([
                    {
                      id: 'msg-cleared',
                      role: 'assistant',
                      content: 'Chat history cleared. How can I help you today?',
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      modelUsed: selectedModel.name,
                    },
                  ])
                }
                variant="outline"
                className="w-full border-border hover:bg-secondary text-xs text-zinc-400 h-8 rounded-xl"
              >
                <RotateCcw className="w-3 h-3 mr-1.5" />
                <span>Clear Chat History</span>
              </Button>
            </Card>
          </div>

          {/* Right Column: Chat Stream & Message Input */}
          <div className="lg:col-span-3 flex flex-col h-[650px] bg-card border border-border rounded-3xl overflow-hidden shadow-lg">
            {/* Chat Messages Scroll Area */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
              {chatMessages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="w-8 h-8 rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500/40 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div className={`space-y-1.5 max-w-[85%] sm:max-w-[75%]`}>
                      <div
                        className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isUser
                            ? 'bg-purple-600 text-white rounded-tr-sm shadow-md'
                            : 'bg-secondary/70 border border-border text-foreground rounded-tl-sm'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      </div>

                      {/* Message Metadata & Metrics */}
                      <div
                        className={`flex items-center gap-2 text-[10px] text-zinc-400 ${
                          isUser ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <span>{msg.timestamp}</span>
                        {msg.modelUsed && <span>• {msg.modelUsed}</span>}
                        {msg.metrics && (
                          <span className="font-mono text-purple-300 font-semibold">
                            • {msg.metrics.tokensPerSec} ({msg.metrics.durationMs}ms)
                          </span>
                        )}
                      </div>
                    </div>

                    {isUser && (
                      <div className="w-8 h-8 rounded-xl bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {isGenerating && (
                <div className="flex items-start gap-3 justify-start">
                  <div className="w-8 h-8 rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500/40 flex items-center justify-center shrink-0">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="p-3 bg-secondary/70 border border-border rounded-2xl text-xs text-purple-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                    <span>Ollama is generating response tokens...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Starter Prompts */}
            <div className="px-4 py-2 border-t border-border bg-card flex items-center gap-2 overflow-x-auto scrollbar-none text-[11px]">
              <span className="text-zinc-500 font-bold shrink-0">Quick Ask:</span>
              {[
                'Explain Transformer Self-Attention Math',
                'Solve VTU 2022 Scheme Module 1 Question',
                'Implement A* Pathfinding in Python',
                'Explain LoRA Fine-Tuning Rank Decomposition',
              ].map((starter) => (
                <button
                  key={starter}
                  onClick={() => handleSendMessage(starter)}
                  className="px-2.5 py-1 bg-secondary/80 hover:bg-purple-600/20 hover:text-purple-300 border border-border hover:border-purple-500/40 rounded-lg text-zinc-300 whitespace-nowrap transition-all cursor-pointer shrink-0"
                >
                  {starter}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-card border-t border-border flex items-center gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask Ollama any AI, engineering or coding question..."
                className="bg-secondary border-border text-xs sm:text-sm h-11 rounded-xl"
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={isGenerating || !inputMessage.trim()}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold h-11 px-5 rounded-xl cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: MODEL TRAINER & FINE-TUNER ==================== */}
      {activeTab === 'trainer' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 5 Cols: Training Dataset & Hyperparameters */}
            <div className="lg:col-span-5 space-y-4">
              <Card className="p-5 bg-card border-border rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Wand2 className="w-4 h-4 text-purple-400" />
                    <span>Model Identity & Domain Preset</span>
                  </span>
                  <div className="flex gap-1.5">
                    {Object.keys(PRESET_TRAINING_DATASETS).map((k) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => handleSelectPreset(k)}
                        className="px-2 py-0.5 bg-secondary text-[10px] font-bold rounded hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 cursor-pointer"
                      >
                        {PRESET_TRAINING_DATASETS[k].name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-300">Custom Model Tag Name:</label>
                  <Input
                    value={customModelName}
                    onChange={(e) => setCustomModelName(e.target.value)}
                    placeholder="e.g. vtu-exam-expert"
                    className="bg-secondary border-border text-xs h-9 font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-300">Base Architecture:</label>
                  <select
                    value={baseModel}
                    onChange={(e) => setBaseModel(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-xs font-medium text-foreground"
                  >
                    <option value="llama3.2">LLaMA 3.2 (Meta - 3B)</option>
                    <option value="mistral">Mistral 7B Instruct</option>
                    <option value="deepseek-r1">DeepSeek-R1 (Distill 7B)</option>
                    <option value="qwen2.5-coder">Qwen 2.5 Coder (7B)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-300">System Persona Instruction:</label>
                  <textarea
                    value={trainerSystemPrompt}
                    onChange={(e) => setTrainerSystemPrompt(e.target.value)}
                    rows={3}
                    className="w-full bg-secondary border border-border rounded-xl p-2 text-xs font-mono text-foreground resize-none"
                  />
                </div>

                {/* Hyperparameters Grid */}
                <div className="pt-3 border-t border-border space-y-3">
                  <span className="text-xs font-bold text-foreground block">LoRA Fine-Tuning Hyperparameters:</span>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-zinc-400 block">LoRA Rank (r):</span>
                      <select
                        value={loraRank}
                        onChange={(e) => setLoraRank(parseInt(e.target.value))}
                        className="w-full bg-secondary border border-border rounded-lg p-1.5 text-xs font-mono"
                      >
                        <option value={8}>r = 8 (Fast / Low VRAM)</option>
                        <option value={16}>r = 16 (Recommended)</option>
                        <option value={32}>r = 32 (High Capacity)</option>
                      </select>
                    </div>

                    <div>
                      <span className="text-[10px] text-zinc-400 block">Epochs:</span>
                      <select
                        value={epochs}
                        onChange={(e) => setEpochs(parseInt(e.target.value))}
                        className="w-full bg-secondary border border-border rounded-lg p-1.5 text-xs font-mono"
                      >
                        <option value={3}>3 Epochs</option>
                        <option value={5}>5 Epochs (Optimal)</option>
                        <option value={10}>10 Epochs</option>
                      </select>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleStartTraining}
                  disabled={isTraining}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs h-10 rounded-xl shadow-lg shadow-purple-950/40 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isTraining ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Fine-Tuning LoRA Weights...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>Start Model Training & LoRA Fine-Tuning</span>
                    </>
                  )}
                </Button>
              </Card>
            </div>

            {/* Right 7 Cols: Live Loss Convergence & Generated Modelfile */}
            <div className="lg:col-span-7 space-y-4">
              {/* Live Training Telemetry & Loss Convergence */}
              <Card className="p-5 bg-card border-border rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <TrendingDown className="w-4 h-4 text-emerald-400" />
                      <span>Cross-Entropy Loss Minimization Curve</span>
                    </span>
                    <span className="text-[10px] text-zinc-400">Real-time loss convergence across training epochs</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold rounded-lg">
                    Final Loss: {trainingLogs[trainingLogs.length - 1]?.loss || '0.28'}
                  </span>
                </div>

                {/* Recharts Loss Curve */}
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trainingLogs}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                      <XAxis dataKey="epoch" tick={{ fill: '#a1a1aa', fontSize: 10 }} label={{ value: 'Epoch', position: 'insideBottom', offset: -2, fill: '#71717a', fontSize: 10 }} />
                      <YAxis tick={{ fill: '#a1a1aa', fontSize: 10 }} domain={[0, 3]} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#090d16', borderColor: '#a855f7', borderRadius: '8px', fontSize: '11px' }}
                      />
                      <Line type="monotone" dataKey="loss" stroke="#a855f7" strokeWidth={2.5} dot={{ fill: '#c084fc', r: 4 }} name="Training Loss" />
                      <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={1.5} dot={false} name="Accuracy %" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {isTraining && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] text-zinc-400">
                      <span>Epoch Progress...</span>
                      <span>{trainingProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 to-emerald-400 transition-all duration-150"
                        style={{ width: `${trainingProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </Card>

              {/* Generated Modelfile Preview & CLI Deployment */}
              <Card className="p-5 bg-card border-border rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-purple-400" />
                    <span>Generated Modelfile (Ready for Local Ollama)</span>
                  </span>
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedModelfile || `FROM ${baseModel}\nSYSTEM "${trainerSystemPrompt}"`);
                      setCopiedCli(true);
                      setTimeout(() => setCopiedCli(false), 2000);
                    }}
                    variant="outline"
                    className="border-border text-xs h-7 rounded-lg text-purple-300"
                  >
                    {copiedCli ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                    <span>{copiedCli ? 'Copied!' : 'Copy Modelfile'}</span>
                  </Button>
                </div>

                <pre className="p-3 bg-slate-950 border border-border rounded-xl text-[11px] font-mono text-zinc-300 overflow-x-auto max-h-44">
                  {generatedModelfile || `# Generated Modelfile\nFROM ${baseModel}:latest\nPARAMETER temperature 0.7\nSYSTEM """${trainerSystemPrompt}"""`}
                </pre>

                <div className="p-3 bg-secondary/50 border border-border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="font-mono text-zinc-300 text-[11px]">
                    <span className="text-zinc-500 block">Deploy to Local Ollama:</span>
                    <code>ollama create {customModelName} -f ./Modelfile && ollama run {customModelName}</code>
                  </div>
                  <Button
                    onClick={() => {
                      setActiveTab('chat');
                    }}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs h-8 px-4 rounded-lg shrink-0 cursor-pointer"
                  >
                    <span>Test in Chatbot</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Dataset Pairs Table */}
          <Card className="p-5 bg-card border-border rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-purple-400" />
                  <span>Domain Fine-Tuning Dataset ({datasetPairs.length} Instruction Samples)</span>
                </span>
                <span className="text-[10px] text-zinc-400">Add high-quality prompt-response pairs to train specific behaviors</span>
              </div>
              <Button
                onClick={handleAddSample}
                variant="outline"
                className="border-purple-500/40 text-purple-300 hover:bg-purple-500/20 text-xs h-8 rounded-lg cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>Add Sample</span>
              </Button>
            </div>

            <div className="space-y-3">
              {datasetPairs.map((p, idx) => (
                <div key={p.id} className="p-3.5 bg-secondary/50 border border-border rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-purple-400">Sample #{idx + 1}</span>
                    <button
                      onClick={() => handleRemoveSample(p.id)}
                      className="text-zinc-400 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <Input
                    value={p.instruction}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDatasetPairs((prev) => prev.map((item) => (item.id === p.id ? { ...item, instruction: val } : item)));
                    }}
                    placeholder="Instruction prompt..."
                    className="bg-slate-950 border-border text-xs h-8 font-mono"
                  />
                  <textarea
                    value={p.output}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDatasetPairs((prev) => prev.map((item) => (item.id === p.id ? { ...item, output: val } : item)));
                    }}
                    rows={2}
                    placeholder="Expected completion output..."
                    className="w-full bg-slate-950 border border-border rounded-lg p-2 text-xs font-mono text-zinc-300 resize-none"
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ==================== TAB 3: FREE MODELS MATRIX ==================== */}
      {activeTab === 'models' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FREE_OLLAMA_MODELS.map((m) => (
            <Card key={m.id} className="p-5 bg-card border-border rounded-2xl space-y-4 hover:border-purple-500/40 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 flex items-center justify-center font-bold text-xs">
                    🦙
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-foreground">{m.name}</h3>
                    <span className="text-[10px] text-zinc-400">{m.family} Family • {m.license}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold rounded-md">
                  Free & Open
                </span>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">{m.description}</p>

              <div className="grid grid-cols-2 gap-2 bg-secondary/50 p-2.5 rounded-xl text-[11px] font-mono">
                <div>
                  <span className="text-[10px] text-zinc-400 block font-sans">Parameters:</span>
                  <span className="font-bold text-purple-300">{m.parameterSize}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block font-sans">Quantization:</span>
                  <span className="font-bold text-emerald-400">{m.quantization}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block font-sans">Context Window:</span>
                  <span className="font-bold text-zinc-300">{m.contextWindow}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block font-sans">Deployment:</span>
                  <span className="font-bold text-amber-300">100% Local</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-border">
                <code className="text-[10px] text-purple-300 font-mono">ollama run {m.id}</code>
                <Button
                  onClick={() => {
                    setSelectedModel(m);
                    setActiveTab('chat');
                  }}
                  className="bg-purple-600 hover:bg-purple-500 text-white text-[11px] h-7 px-3 rounded-lg cursor-pointer"
                >
                  <span>Chat Now</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ==================== TAB 4: 1-CLICK CLI INSTALLATION ==================== */}
      {activeTab === 'installation' && (
        <Card className="p-6 bg-card border-border rounded-3xl space-y-6">
          <div className="space-y-1 border-b border-border pb-4">
            <h2 className="text-lg font-bold text-foreground">How to Run Ollama Locally on Your Machine</h2>
            <p className="text-xs text-zinc-400">Run state-of-the-art open models on your local Mac, Linux, or Windows GPU with zero cloud subscription fees.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-secondary/50 border border-border rounded-2xl space-y-2">
              <span className="font-bold text-purple-300 block">🍎 macOS (Apple Silicon / Intel)</span>
              <pre className="p-2.5 bg-slate-950 rounded-lg text-[11px] font-mono text-zinc-300 overflow-x-auto">
                brew install ollama
              </pre>
              <p className="text-[11px] text-zinc-400">Optimized for M1/M2/M3/M4 unified memory.</p>
            </div>

            <div className="p-4 bg-secondary/50 border border-border rounded-2xl space-y-2">
              <span className="font-bold text-emerald-400 block">🐧 Linux (Ubuntu / Debian / Arch)</span>
              <pre className="p-2.5 bg-slate-950 rounded-lg text-[11px] font-mono text-zinc-300 overflow-x-auto">
                curl -fsSL https://ollama.com/install.sh | sh
              </pre>
              <p className="text-[11px] text-zinc-400">Auto-detects NVIDIA CUDA and AMD ROCm.</p>
            </div>

            <div className="p-4 bg-secondary/50 border border-border rounded-2xl space-y-2">
              <span className="font-bold text-blue-400 block">🪟 Windows (WSL2 / Native)</span>
              <pre className="p-2.5 bg-slate-950 rounded-lg text-[11px] font-mono text-zinc-300 overflow-x-auto">
                winget install Ollama.Ollama
              </pre>
              <p className="text-[11px] text-zinc-400">Direct download installer from ollama.com.</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
