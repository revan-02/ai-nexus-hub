'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sparkles,
  Zap,
  ArrowRight,
  TrendingDown,
  Layers,
  Code,
  Binary,
  Cpu,
  RotateCcw,
  Hash,
  Activity
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// Sigmoid activation function & derivative
const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));
const sigmoidDeriv = (z: number) => {
  const s = sigmoid(z);
  return s * (1 - s);
};

interface HistoryEntry {
  epoch: number;
  weight: number;
  bias: number;
  z: number;
  activation: number;
  loss: number;
  dLoss_dW: number;
  dLoss_db: number;
}

export function WeightsEncodingSimulator() {
  const [activeTab, setActiveTab] = useState<'weights' | 'encoding'>('weights');

  // ----------------------------------------------------
  // SIMULATOR STATE: WEIGHTS & BIASES
  // ----------------------------------------------------
  const [inputX, setInputX] = useState<number>(1.5);
  const [targetY, setTargetY] = useState<number>(0.8);
  const [learningRate, setLearningRate] = useState<number>(0.5);

  const [weight, setWeight] = useState<number>(0.6);
  const [bias, setBias] = useState<number>(0.1);

  const [epoch, setEpoch] = useState<number>(0);
  const [isAutoTraining, setIsAutoTraining] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Current Forward Pass Math
  const z = weight * inputX + bias;
  const a = sigmoid(z);
  const loss = 0.5 * Math.pow(a - targetY, 2);

  // Current Backprop Gradients
  const dLoss_da = a - targetY;
  const da_dz = sigmoidDeriv(z);
  const dLoss_dz = dLoss_da * da_dz;
  const dLoss_dW = dLoss_dz * inputX;
  const dLoss_db = dLoss_dz * 1;

  // Initialize history on mount/reset
  const resetSimulation = () => {
    const initialW = 0.6;
    const initialB = 0.1;
    setWeight(initialW);
    setBias(initialB);
    setEpoch(0);
    setIsAutoTraining(false);

    const initZ = initialW * inputX + initialB;
    const initA = sigmoid(initZ);
    const initLoss = 0.5 * Math.pow(initA - targetY, 2);
    const initDaDz = sigmoidDeriv(initZ);
    const initDLossDz = (initA - targetY) * initDaDz;

    setHistory([
      {
        epoch: 0,
        weight: initialW,
        bias: initialB,
        z: initZ,
        activation: initA,
        loss: initLoss,
        dLoss_dW: initDLossDz * inputX,
        dLoss_db: initDLossDz,
      },
    ]);
  };

  useEffect(() => {
    resetSimulation();
  }, [inputX, targetY]);

  // Execute single optimization step (Epoch + 1)
  const stepTraining = () => {
    const newWeight = weight - learningRate * dLoss_dW;
    const newBias = bias - learningRate * dLoss_db;
    const newEpoch = epoch + 1;

    const newZ = newWeight * inputX + newBias;
    const newA = sigmoid(newZ);
    const newLoss = 0.5 * Math.pow(newA - targetY, 2);
    const newDaDz = sigmoidDeriv(newZ);
    const newDLossDz = (newA - targetY) * newDaDz;
    const newDW = newDLossDz * inputX;
    const newDb = newDLossDz;

    setWeight(newWeight);
    setBias(newBias);
    setEpoch(newEpoch);

    setHistory((prev) => [
      ...prev,
      {
        epoch: newEpoch,
        weight: newWeight,
        bias: newBias,
        z: newZ,
        activation: newA,
        loss: newLoss,
        dLoss_dW: newDW,
        dLoss_db: newDb,
      },
    ]);
  };

  // Auto-training interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoTraining && epoch < 50 && loss > 0.0001) {
      interval = setInterval(() => {
        stepTraining();
      }, 300);
    } else if (epoch >= 50 || loss <= 0.0001) {
      setIsAutoTraining(false);
    }
    return () => clearInterval(interval);
  }, [isAutoTraining, epoch, weight, bias, loss]);

  // ----------------------------------------------------
  // ENCODING STATE
  // ----------------------------------------------------
  const [encodingType, setEncodingType] = useState<'categorical' | 'text'>('categorical');
  const [categoriesText, setCategoriesText] = useState<string>('Bengaluru, Mumbai, Delhi, Chennai');
  const [sampleText, setSampleText] = useState<string>('Deep Learning is Artificial Intelligence');

  // Categorical One-Hot computation
  const categoryList = categoriesText
    .split(',')
    .map((c) => c.trim())
    .filter((c) => c.length > 0);

  // Text Tokenization & Dense Embedding computation
  const tokens = sampleText
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  // Hash helper to generate deterministic 4D embedding vectors for demo
  const getEmbeddingVector = (word: string): number[] => {
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = word.charCodeAt(i) + ((hash << 5) - hash);
    }
    const v1 = Math.sin(hash * 0.1);
    const v2 = Math.cos(hash * 0.2);
    const v3 = Math.sin(hash * 0.3);
    const v4 = Math.cos(hash * 0.4);
    return [
      Number(v1.toFixed(3)),
      Number(v2.toFixed(3)),
      Number(v3.toFixed(3)),
      Number(v4.toFixed(3)),
    ];
  };

  return (
    <Card className="p-6 bg-card border-border rounded-2xl shadow-xl space-y-6">
      {/* Top Header & Tab Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-foreground">Interactive Deep Learning Simulator</h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Visualize Weight & Bias Backpropagation math and Categorical / Text Vector Encoding step-by-step.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center p-1 bg-secondary border border-border rounded-xl">
          <button
            onClick={() => setActiveTab('weights')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'weights'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Weight & Bias Learning</span>
          </button>

          <button
            onClick={() => setActiveTab('encoding')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'encoding'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Binary className="w-3.5 h-3.5" />
            <span>Encoding & Vectors</span>
          </button>
        </div>
      </div>

      {/* ==================================================== */}
      {/* TAB 1: WEIGHT & BIAS LEARNING SIMULATOR */}
      {/* ==================================================== */}
      {activeTab === 'weights' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-secondary/50 border border-border rounded-xl">
            <div>
              <label className="text-[11px] font-bold text-muted-foreground flex items-center justify-between">
                <span>Input Feature (X)</span>
                <span className="text-purple-400 font-mono font-bold">{inputX.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min="0.1"
                max="3.0"
                step="0.1"
                value={inputX}
                onChange={(e) => setInputX(parseFloat(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer mt-1"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-muted-foreground flex items-center justify-between">
                <span>Target Output (Y)</span>
                <span className="text-emerald-400 font-mono font-bold">{targetY.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min="0.1"
                max="0.95"
                step="0.05"
                value={targetY}
                onChange={(e) => setTargetY(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer mt-1"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-muted-foreground flex items-center justify-between">
                <span>Learning Rate (α)</span>
                <span className="text-amber-400 font-mono font-bold">{learningRate.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min="0.05"
                max="2.0"
                step="0.05"
                value={learningRate}
                onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer mt-1"
              />
            </div>

            <div className="flex items-end gap-2">
              <Button
                onClick={stepTraining}
                disabled={isAutoTraining || loss < 0.0001}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-9 rounded-xl shadow-md"
              >
                <Zap className="w-3.5 h-3.5 mr-1" />
                Step Epoch
              </Button>

              <Button
                onClick={() => setIsAutoTraining(!isAutoTraining)}
                variant={isAutoTraining ? 'destructive' : 'outline'}
                className="h-9 px-3 text-xs font-bold rounded-xl border-border"
              >
                {isAutoTraining ? 'Pause' : 'Auto Train'}
              </Button>

              <Button
                onClick={resetSimulation}
                variant="outline"
                className="h-9 px-2.5 text-xs font-bold rounded-xl border-border text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Animated Neuron Circuit Diagram */}
          <div className="p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950/40 border border-purple-500/20 rounded-2xl relative overflow-hidden">
            <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" /> Forward Pass & Neuron Circuit Architecture
              </span>
              <span className="font-mono text-purple-300 text-xs">Epoch {epoch}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center text-center relative z-10">
              {/* Node 1: Input X */}
              <motion.div
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="p-4 bg-slate-900/90 border border-purple-500/30 rounded-xl space-y-1 shadow-lg"
              >
                <span className="text-[11px] font-bold text-muted-foreground block">Input Feature (X)</span>
                <span className="text-xl font-bold font-mono text-purple-400">{inputX.toFixed(2)}</span>
              </motion.div>

              {/* Wire Arrow 1 with Weight & Bias */}
              <div className="flex flex-col items-center justify-center space-y-1">
                <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  Weight W: {weight.toFixed(4)}
                </span>
                <span className="text-[11px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                  Bias b: {bias.toFixed(4)}
                </span>
                <ArrowRight className="w-5 h-5 text-purple-400 animate-pulse my-1" />
              </div>

              {/* Node 2: Weighted Sum z */}
              <div className="p-4 bg-slate-900/90 border border-indigo-500/30 rounded-xl space-y-1 shadow-lg">
                <span className="text-[11px] font-bold text-muted-foreground block">Linear Combination z = W·X + b</span>
                <span className="text-xl font-bold font-mono text-indigo-300">{z.toFixed(4)}</span>
                <span className="text-[10px] text-muted-foreground block">
                  ({weight.toFixed(2)} × {inputX.toFixed(2)} + {bias.toFixed(2)})
                </span>
              </div>

              {/* Wire Arrow 2 with Sigmoid */}
              <div className="flex flex-col items-center justify-center space-y-1">
                <span className="text-[11px] font-bold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                  Sigmoid σ(z) = 1 / (1 + e^-z)
                </span>
                <ArrowRight className="w-5 h-5 text-purple-400 animate-pulse my-1" />
              </div>

              {/* Node 3: Output Activation a vs Target Y */}
              <div className="p-4 bg-slate-900/90 border border-emerald-500/30 rounded-xl space-y-1 shadow-lg">
                <span className="text-[11px] font-bold text-muted-foreground block">Neuron Output (Y_hat)</span>
                <span className="text-xl font-bold font-mono text-emerald-400">{a.toFixed(4)}</span>
                <span className="text-[10px] text-rose-400 font-mono block">
                  Target Y: {targetY.toFixed(2)} | Loss: {loss.toFixed(6)}
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Math Trace Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Step-by-Step Backpropagation Equations */}
            <Card className="p-5 bg-card border-border rounded-xl space-y-4">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <Code className="w-4 h-4 text-purple-400" /> Calculus Backpropagation Gradient Formulas
              </h3>

              <div className="space-y-2.5 text-xs font-mono">
                <div className="p-3 bg-secondary/60 rounded-lg border border-border">
                  <span className="text-muted-foreground block font-sans font-bold text-[11px]">1. Error Output Margin (dL/da)</span>
                  <span className="text-rose-400">dL/da = Y_hat - Y = {a.toFixed(4)} - {targetY.toFixed(2)} = {dLoss_da.toFixed(4)}</span>
                </div>

                <div className="p-3 bg-secondary/60 rounded-lg border border-border">
                  <span className="text-muted-foreground block font-sans font-bold text-[11px]">2. Sigmoid Activation Slope (g'(z))</span>
                  <span className="text-purple-300">da/dz = a · (1 - a) = {a.toFixed(4)} × {(1 - a).toFixed(4)} = {da_dz.toFixed(4)}</span>
                </div>

                <div className="p-3 bg-secondary/60 rounded-lg border border-border">
                  <span className="text-muted-foreground block font-sans font-bold text-[11px]">3. Weight Gradient (dL/dW = dL/da · da/dz · X)</span>
                  <span className="text-amber-400">dL/dW = {dLoss_dz.toFixed(4)} × {inputX.toFixed(2)} = {dLoss_dW.toFixed(6)}</span>
                </div>

                <div className="p-3 border border-purple-500/30 bg-purple-950/20 rounded-lg">
                  <span className="text-purple-300 block font-sans font-bold text-[11px]">4. Gradient Descent Weight Update Rule</span>
                  <span className="text-emerald-400 font-bold">
                    W_new = W_old - alpha * (dL/dW) = {weight.toFixed(4)} - ({learningRate.toFixed(2)} × {dLoss_dW.toFixed(4)}) = {(weight - learningRate * dLoss_dW).toFixed(4)}
                  </span>
                </div>
              </div>
            </Card>

            {/* Live Loss Reduction Convergence Graph */}
            <Card className="p-5 bg-card border-border rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-emerald-400" /> Optimization Loss Curve (L -&gt; 0)
                </h3>
                <span className="text-xs font-mono text-emerald-400 font-bold">Current Loss: {loss.toFixed(6)}</span>
              </div>

              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="epoch" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 'auto']} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                    />
                    <Line type="monotone" dataKey="loss" stroke="#10b981" strokeWidth={2} dot={false} name="Loss L" />
                    <Line type="monotone" dataKey="weight" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="Weight W" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 2: CATEGORICAL & TEXT ENCODING DEMO */}
      {/* ==================================================== */}
      {activeTab === 'encoding' && (
        <div className="space-y-6">
          {/* Encoding Sub-selector */}
          <div className="flex items-center gap-3 border-b border-border pb-3">
            <button
              onClick={() => setEncodingType('categorical')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                encodingType === 'categorical'
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              1. Categorical One-Hot Encoding
            </button>
            <button
              onClick={() => setEncodingType('text')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                encodingType === 'text'
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              2. Text Tokenization & Dense Embedding Vectors
            </button>
          </div>

          {/* Sub-Tab 1: Categorical One-Hot */}
          {encodingType === 'categorical' && (
            <div className="space-y-6">
              <Card className="p-4 bg-secondary/50 border-border space-y-2">
                <label className="text-xs font-bold text-foreground block">Input Categorical Values (Comma Separated)</label>
                <Input
                  value={categoriesText}
                  onChange={(e) => setCategoriesText(e.target.value)}
                  placeholder="e.g. Bengaluru, Mumbai, Delhi, Chennai"
                  className="bg-card border-border text-xs text-foreground"
                />
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ordinal Label Encoding Table */}
                <Card className="p-5 bg-card border-border rounded-xl space-y-3">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <Hash className="w-4 h-4 text-amber-400" /> Ordinal / Label Encoding
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Maps each string category to an integer. <span className="text-amber-400 font-bold font-mono">Warning:</span> Neural networks may incorrectly assume an artificial numerical order.
                  </p>

                  <div className="space-y-2 font-mono text-xs">
                    {categoryList.map((cat, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 bg-secondary rounded-lg border border-border">
                        <span className="text-foreground font-semibold">{cat}</span>
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-md font-bold">
                          ID: {idx}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* One-Hot Encoding Binary Matrix */}
                <Card className="p-5 bg-card border-border rounded-xl space-y-3">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <Binary className="w-4 h-4 text-emerald-400" /> One-Hot Encoded Binary Vectors
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Creates K binary columns (0 or 1) so no artificial category magnitude is implied.
                  </p>

                  <div className="space-y-2 font-mono text-xs overflow-x-auto">
                    {categoryList.map((cat, rowIdx) => {
                      const oneHotVector = categoryList.map((_, colIdx) => (rowIdx === colIdx ? 1 : 0));
                      return (
                        <div key={rowIdx} className="flex items-center justify-between p-2.5 bg-secondary rounded-lg border border-border gap-4">
                          <span className="text-foreground font-semibold min-w-[90px]">{cat}</span>
                          <div className="flex items-center gap-1.5">
                            {oneHotVector.map((val, vIdx) => (
                              <span
                                key={vIdx}
                                className={`px-2 py-0.5 rounded-md font-bold text-xs ${
                                  val === 1
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                                }`}
                              >
                                {val}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Sub-Tab 2: Text Tokenization & Embeddings */}
          {encodingType === 'text' && (
            <div className="space-y-6">
              <Card className="p-4 bg-secondary/50 border-border space-y-2">
                <label className="text-xs font-bold text-foreground block">Input Raw Text Sequence</label>
                <Input
                  value={sampleText}
                  onChange={(e) => setSampleText(e.target.value)}
                  placeholder="e.g. Deep Learning is Artificial Intelligence"
                  className="bg-card border-border text-xs text-foreground"
                />
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Token IDs Step */}
                <Card className="lg:col-span-4 p-5 bg-card border-border rounded-xl space-y-3">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <Code className="w-4 h-4 text-purple-400" /> 1. Subword BPE Tokenization
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Splits sequence text into tokens and maps each token to an integer ID in vocabulary dictionary.
                  </p>

                  <div className="space-y-2 font-mono text-xs">
                    {tokens.map((token, idx) => {
                      const tokenId = Math.abs(
                        token.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) * 142
                      ) % 32000;
                      return (
                        <div key={idx} className="flex items-center justify-between p-2.5 bg-secondary rounded-lg border border-border">
                          <span className="text-purple-300 font-semibold">"{token}"</span>
                          <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-md font-bold">
                            Token ID: {tokenId}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* Dense Embedding Vectors Matrix */}
                <Card className="lg:col-span-8 p-5 bg-card border-border rounded-xl space-y-3">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-400" /> 2. Dense Continuous Embedding Vectors (E ∈ R^V×4)
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Token IDs pass through Embedding Matrix E to output dense floating-point feature vectors.
                  </p>

                  <div className="space-y-2.5 font-mono text-xs">
                    {tokens.map((token, idx) => {
                      const vec = getEmbeddingVector(token);
                      return (
                        <div key={idx} className="p-3 bg-secondary rounded-xl border border-border space-y-1.5 font-sans">
                          <div className="flex items-center justify-between">
                            <span className="text-foreground font-bold">Token: "{token}"</span>
                            <span className="text-[10px] text-muted-foreground font-mono">4D Embedding Representation</span>
                          </div>

                          <div className="grid grid-cols-4 gap-2 font-mono">
                            {vec.map((val, vIdx) => (
                              <div
                                key={vIdx}
                                className={`p-2 rounded-lg text-center font-bold border text-xs ${
                                  val > 0
                                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                    : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                                }`}
                              >
                                {val > 0 ? `+${val}` : val}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
