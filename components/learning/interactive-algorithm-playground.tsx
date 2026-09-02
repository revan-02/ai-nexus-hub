'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sparkles,
  Zap,
  Play,
  RotateCcw,
  Compass,
  GitFork,
  Brain,
  Layers,
  Search,
  MessageSquare,
  Bot,
  Sliders,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Activity,
  ArrowRight,
  Eye,
  Database,
  Grid
} from 'lucide-react';

interface AlgoSimDef {
  id: string;
  stage: string;
  name: string;
  analogy: string;
  iconName: string;
  simpleExplanation: string;
  technicalConcept: string;
}

export function InteractiveAlgorithmPlayground() {
  const [selectedAlgoId, setSelectedAlgoId] = useState<string>('sim-1');

  // Algorithm Definitions
  const simList: AlgoSimDef[] = [
    {
      id: 'sim-1',
      stage: 'Stage 1: AI Foundations',
      name: 'A* Search Maze Pathfinding',
      analogy: 'Finding the quickest path through a maze using a GPS straight-line distance heuristic.',
      iconName: 'Compass',
      simpleExplanation: 'Imagine you are lost in a maze. A* search checks steps taken (g) + straight-line distance to goal (h) to pick the smartest next step!',
      technicalConcept: 'Informed Search Algorithm calculating f(n) = g(n) + h(n). Guaranteed shortest path if heuristic h(n) is admissible.',
    },
    {
      id: 'sim-2',
      stage: 'Stage 2: Machine Learning',
      name: 'Linear Regression Best-Fit Line',
      analogy: 'Drawing a straight line through scatter points to predict house prices based on size.',
      iconName: 'TrendingUp',
      simpleExplanation: 'Adjust the slope (tilt) and intercept (height) of the line so the distance to all data points is as small as possible!',
      technicalConcept: 'Ordinary Least Squares (OLS) regression minimizing Mean Squared Error (MSE = 1/N ∑(y_i - y_hat)^2).',
    },
    {
      id: 'sim-3',
      stage: 'Stage 2: Machine Learning',
      name: 'K-Means Clustering',
      analogy: 'Sorting scattered colored beads into K piles based on which beads are closest together.',
      iconName: 'Grid',
      simpleExplanation: 'Place K magnet centers. Data points join the nearest magnet. Magnets move to the center of their group. Repeat!',
      technicalConcept: 'Unsupervised partitioning algorithm iterating between assignment step and centroid recalculation.',
    },
    {
      id: 'sim-4',
      stage: 'Stage 2: Machine Learning',
      name: 'K-Nearest Neighbors (KNN)',
      analogy: '"You are who your 3 closest friends are!" Classifying a point by taking a majority vote of its nearest neighbors.',
      iconName: 'Activity',
      simpleExplanation: 'Place a mystery point on the map. Draw a expanding circle around it. Count the labels of the K closest items!',
      technicalConcept: 'Instance-based non-parametric classification calculating Euclidean distance d(x, y) = √(∑(x_i - y_i)²).',
    },
    {
      id: 'sim-5',
      stage: 'Stage 3: Deep Learning',
      name: 'Convolutional Neural Network (CNN Filter)',
      analogy: 'Looking through a tiny 3x3 magnifying glass across an image to spot edges, curves, and shapes.',
      iconName: 'Eye',
      simpleExplanation: 'A small 3x3 grid multiplies matching patterns (like horizontal or vertical edges) to highlight key visual features!',
      technicalConcept: 'Spatial 2D Convolution computing element-wise dot product between input feature map and learnable kernel weights.',
    },
    {
      id: 'sim-6',
      stage: 'Stage 3: Deep Learning',
      name: 'Transformer Self-Attention (Q, K, V)',
      analogy: 'Hovering over a word to see which other words in the sentence give it its exact meaning.',
      iconName: 'Layers',
      simpleExplanation: 'In the sentence "The animal didn\'t cross the street because it was tired", "it" connects strongly to "animal"!',
      technicalConcept: 'Scaled Dot-Product Attention computing Softmax((Q Kᵀ) / √d_k) V to compute dynamic contextual representations.',
    },
    {
      id: 'sim-7',
      stage: 'Stage 4: Generative AI',
      name: 'Retrieval-Augmented Generation (RAG)',
      analogy: 'Answering an open-book exam by first searching textbook pages and then writing a grounded response.',
      iconName: 'Database',
      simpleExplanation: 'Instead of guessing, the AI converts your question into numbers, searches a document library, and reads the exact facts!',
      technicalConcept: 'Hybrid retrieval over dense vector embeddings stored in HNSW indexes combined with LLM context prompting.',
    },
    {
      id: 'sim-8',
      stage: 'Stage 4: Generative AI',
      name: 'Autonomous ReAct Tool Agent',
      analogy: 'A smart robot helper that thinks: "Thought → Action (Calculator) → Observation → Final Answer".',
      iconName: 'Bot',
      simpleExplanation: 'When asked a complex question, the AI agent decides which digital tool (weather API, calculator, database) to call step-by-step.',
      technicalConcept: 'Synergistic Reason + Act trace execution loop parsing LLM output tags to invoke external JSON schema function tools.',
    },
  ];

  const currentDef = simList.find((s) => s.id === selectedAlgoId) || simList[0];

  // ------------------------------------------------------------------
  // SIMULATOR SPECIFIC STATES
  // ------------------------------------------------------------------

  // Sim 1: A* Search
  const [gridNodes, setGridNodes] = useState<{ x: number; y: number; type: 'start' | 'goal' | 'wall' | 'visited' | 'path' | 'empty' }[]>([]);
  const [aStarStep, setAStarStep] = useState<number>(0);

  useEffect(() => {
    // Generate 5x5 grid
    const initial: { x: number; y: number; type: 'start' | 'goal' | 'wall' | 'visited' | 'path' | 'empty' }[] = [];
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (r === 0 && c === 0) initial.push({ x: c, y: r, type: 'start' });
        else if (r === 4 && c === 4) initial.push({ x: c, y: r, type: 'goal' });
        else if ((r === 1 && c === 1) || (r === 2 && c === 1) || (r === 3 && c === 3)) initial.push({ x: c, y: r, type: 'wall' });
        else initial.push({ x: c, y: r, type: 'empty' });
      }
    }
    setGridNodes(initial);
    setAStarStep(0);
  }, [selectedAlgoId]);

  const stepAStar = () => {
    setGridNodes((prev) => {
      const next = [...prev];
      if (aStarStep === 0) {
        // visit (1,0) and (0,1)
        next[1].type = 'visited';
        next[5].type = 'visited';
      } else if (aStarStep === 1) {
        // visit (2,0), (0,2)
        next[2].type = 'visited';
        next[10].type = 'visited';
      } else if (aStarStep === 2) {
        // Form path
        next[0].type = 'path';
        next[1].type = 'path';
        next[2].type = 'path';
        next[3].type = 'path';
        next[4].type = 'path';
        next[9].type = 'path';
        next[14].type = 'path';
        next[19].type = 'path';
        next[24].type = 'path';
      }
      return next;
    });
    setAStarStep((prev) => prev + 1);
  };

  // Sim 2: Linear Regression
  const [slope, setSlope] = useState<number>(1.2);
  const [intercept, setIntercept] = useState<number>(10);

  // Sim 3: K-Means
  const [kmeansStep, setKmeansStep] = useState<number>(0);
  const [clusterData, setClusterData] = useState<{ x: number; y: number; cluster: number }[]>([
    { x: 20, y: 30, cluster: 0 }, { x: 30, y: 40, cluster: 0 }, { x: 25, y: 25, cluster: 0 },
    { x: 70, y: 80, cluster: 1 }, { x: 80, y: 75, cluster: 1 }, { x: 75, y: 85, cluster: 1 },
  ]);

  // Sim 4: KNN
  const [kValue, setKValue] = useState<number>(3);
  const [mysteryPoint, setMysteryPoint] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  // Sim 5: CNN Filter 3x3
  const [filterIdx, setFilterIdx] = useState<number>(0);

  // Sim 6: Self-Attention
  const [hoveredWordIdx, setHoveredWordIdx] = useState<number>(0);
  const sentenceWords = ['The', 'animal', 'did not', 'cross', 'the', 'street', 'because', 'it', 'was', 'tired'];
  const attentionWeightsMap: Record<number, Record<number, number>> = {
    7: { 1: 0.85, 3: 0.05, 5: 0.04, 9: 0.06 }, // "it" -> "animal" (85%)
    1: { 0: 0.20, 1: 0.80 },
    3: { 3: 0.70, 5: 0.30 },
  };

  // Sim 7: RAG Vector Search
  const [ragQuery, setRagQuery] = useState<string>('What is the refund policy for UPI transactions?');
  const [ragStep, setRagStep] = useState<'idle' | 'embedding' | 'vector_search' | 'rerank' | 'answer'>('idle');

  // Sim 8: ReAct Agent
  const [agentPrompt, setAgentPrompt] = useState<string>('Check Bengaluru weather and compute travel cost for 15km');
  const [agentStep, setAgentStep] = useState<number>(0);

  return (
    <Card className="p-6 bg-card border-border rounded-2xl shadow-xl space-y-6">
      {/* Selector Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400 animate-spin" />
            <h2 className="text-xl font-bold text-foreground">7th-Grade Visual Algorithm Playground</h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Interactive, intuitive visual mental models for all AI, Machine Learning, Deep Learning & Generative AI algorithms.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {simList.map((sim) => (
            <button
              key={sim.id}
              onClick={() => setSelectedAlgoId(sim.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                selectedAlgoId === sim.id
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md scale-105'
                  : 'bg-secondary text-muted-foreground border-border hover:text-foreground'
              }`}
            >
              {sim.name}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Algorithm Card Header */}
      <div className="p-5 bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/30 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
            {currentDef.stage}
          </span>
          <span className="text-xs font-bold text-amber-400 font-mono flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 fill-amber-400" /> 7th-Grade Friendly Mental Model
          </span>
        </div>

        <h3 className="text-lg font-bold text-foreground">{currentDef.name}</h3>
        <p className="text-xs text-purple-200 leading-relaxed font-sans">{currentDef.simpleExplanation}</p>

        <div className="p-3 bg-slate-950/80 rounded-xl border border-border text-[11px] font-mono text-muted-foreground">
          <span className="text-purple-400 font-bold font-sans block mb-0.5">Technical Standard Definition:</span>
          {currentDef.technicalConcept}
        </div>
      </div>

      {/* =================================================================== */}
      {/* SIMULATOR RENDERING BY ALGORITHM ID */}
      {/* =================================================================== */}

      {/* SIM 1: A* SEARCH MAZE */}
      {selectedAlgoId === 'sim-1' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">Interactive 5x5 Maze Grid (Start: Green, Goal: Red, Wall: Gray)</span>
            <Button onClick={stepAStar} disabled={aStarStep >= 3} className="bg-purple-600 text-white font-bold text-xs h-8 px-3 rounded-lg">
              <Play className="w-3.5 h-3.5 mr-1" /> Step A* Search (f = g + h)
            </Button>
          </div>

          <div className="grid grid-cols-5 gap-2 max-w-sm mx-auto p-4 bg-slate-950 rounded-2xl border border-border">
            {gridNodes.map((node, idx) => (
              <motion.div
                key={idx}
                animate={{ scale: node.type === 'visited' || node.type === 'path' ? [1, 1.1, 1] : 1 }}
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-xs font-bold border ${
                  node.type === 'start' ? 'bg-emerald-500/30 text-emerald-400 border-emerald-500' :
                  node.type === 'goal' ? 'bg-rose-500/30 text-rose-400 border-rose-500' :
                  node.type === 'wall' ? 'bg-slate-800 text-slate-500 border-slate-700' :
                  node.type === 'path' ? 'bg-purple-500 text-white border-purple-400 shadow-lg' :
                  node.type === 'visited' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' :
                  'bg-secondary border-border text-muted-foreground'
                }`}
              >
                {node.type === 'start' ? 'Start' : node.type === 'goal' ? 'Goal' : node.type === 'wall' ? 'Wall' : node.type === 'path' ? '★' : ''}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* SIM 2: LINEAR REGRESSION */}
      {selectedAlgoId === 'sim-2' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-secondary/50 rounded-xl border border-border">
            <div>
              <label className="text-xs font-bold text-muted-foreground flex justify-between">
                <span>Line Tilt Slope (m)</span>
                <span className="text-purple-400 font-mono">{slope.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.1"
                value={slope}
                onChange={(e) => setSlope(parseFloat(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground flex justify-between">
                <span>Height Intercept (c)</span>
                <span className="text-emerald-400 font-mono">{intercept}</span>
              </label>
              <input
                type="range"
                min="0"
                max="30"
                step="2"
                value={intercept}
                onChange={(e) => setIntercept(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer mt-1"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-border text-center space-y-2">
            <span className="text-xs font-bold font-mono text-purple-400">Prediction Equation: Y_hat = {slope.toFixed(2)} * House_Size + {intercept}</span>
            <p className="text-[11px] text-muted-foreground">Adjust sliders to see the line pass directly through the scatter data points!</p>
          </div>
        </div>
      )}

      {/* SIM 3: K-MEANS CLUSTERING */}
      {selectedAlgoId === 'sim-3' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">Scatter Data Points & Centroid Magnets</span>
            <Button
              onClick={() => {
                setKmeansStep((prev) => prev + 1);
                setClusterData((prev) =>
                  prev.map((pt) => ({ ...pt, cluster: pt.x > 50 ? 1 : 0 }))
                );
              }}
              className="bg-purple-600 text-white font-bold text-xs h-8 px-3 rounded-lg"
            >
              <Play className="w-3.5 h-3.5 mr-1" /> Re-Center Centroid Magnets (Step {kmeansStep})
            </Button>
          </div>

          <div className="h-48 bg-slate-950 border border-border rounded-2xl relative p-4 flex items-center justify-around">
            <div className="flex gap-4">
              {clusterData.slice(0, 3).map((pt, i) => (
                <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ duration: 1 + i * 0.2, repeat: Infinity }} className="w-8 h-8 rounded-full bg-emerald-500/30 border-2 border-emerald-400 flex items-center justify-center text-xs font-bold text-emerald-300">
                  A{i}
                </motion.div>
              ))}
            </div>

            <div className="flex gap-4">
              {clusterData.slice(3, 6).map((pt, i) => (
                <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ duration: 1.2 + i * 0.2, repeat: Infinity }} className="w-8 h-8 rounded-full bg-purple-500/30 border-2 border-purple-400 flex items-center justify-center text-xs font-bold text-purple-300">
                  B{i}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SIM 6: TRANSFORMER SELF-ATTENTION */}
      {selectedAlgoId === 'sim-6' && (
        <div className="space-y-4">
          <span className="text-xs font-bold text-foreground block">Hover over any word to visualize Attention Connection Weights:</span>

          <div className="flex flex-wrap gap-2 p-4 bg-slate-950 border border-border rounded-2xl">
            {sentenceWords.map((word, idx) => {
              const weights = attentionWeightsMap[hoveredWordIdx] || {};
              const weightVal = weights[idx] || 0;
              const isSelected = idx === hoveredWordIdx;

              return (
                <button
                  key={idx}
                  onMouseEnter={() => setHoveredWordIdx(idx)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                    isSelected
                      ? 'bg-purple-600 text-white border-purple-400 shadow-lg scale-105'
                      : weightVal > 0
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-secondary text-muted-foreground border-border'
                  }`}
                >
                  {word}
                  {weightVal > 0 && <span className="ml-1.5 text-[10px] font-mono text-emerald-400 font-bold">({(weightVal * 100).toFixed(0)}%)</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* SIM 7: RAG VECTOR SEARCH */}
      {selectedAlgoId === 'sim-7' && (
        <div className="space-y-4">
          <div className="p-4 bg-secondary/50 border border-border rounded-xl space-y-2">
            <label className="text-xs font-bold text-foreground block">Learner Query</label>
            <div className="flex gap-2">
              <Input value={ragQuery} onChange={(e) => setRagQuery(e.target.value)} className="bg-card border-border text-xs text-foreground" />
              <Button onClick={() => setRagStep('vector_search')} className="bg-purple-600 text-white text-xs font-bold px-4 rounded-xl">
                Search Document DB
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className={`p-4 rounded-xl border text-xs font-mono space-y-1 ${ragStep === 'vector_search' ? 'bg-purple-950/40 border-purple-500 text-purple-200' : 'bg-card border-border text-muted-foreground'}`}>
              <span className="font-sans font-bold block text-foreground">1. Chunk #142 (Score: 0.94)</span>
              <p className="text-[11px] font-sans">"UPI transactions failed due to server timeouts are automatically refunded within 24 hours."</p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card text-xs font-mono space-y-1 text-muted-foreground">
              <span className="font-sans font-bold block text-foreground">2. Chunk #89 (Score: 0.62)</span>
              <p className="text-[11px] font-sans">"Credit card reward points are credited monthly."</p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card text-xs font-mono space-y-1 text-muted-foreground">
              <span className="font-sans font-bold block text-foreground">3. Chunk #12 (Score: 0.41)</span>
              <p className="text-[11px] font-sans">"Fixed deposit interest rates for senior citizens."</p>
            </div>
          </div>
        </div>
      )}

      {/* SIM 8: REACT AGENT TOOL CALLING */}
      {selectedAlgoId === 'sim-8' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">ReAct Execution Trace (Thought → Action → Observation → Answer)</span>
            <Button onClick={() => setAgentStep((prev) => (prev < 3 ? prev + 1 : 0))} className="bg-purple-600 text-white font-bold text-xs h-8 px-3 rounded-lg">
              <Play className="w-3.5 h-3.5 mr-1" /> Step ReAct Loop ({agentStep}/3)
            </Button>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className={`p-3 rounded-xl border ${agentStep >= 0 ? 'bg-purple-950/30 border-purple-500/40 text-purple-300' : 'bg-secondary border-border text-muted-foreground'}`}>
              <span className="font-bold text-purple-400 block font-sans">Thought 1:</span>
              I need to check the current temperature in Bengaluru and then calculate total cab fare.
            </div>

            {agentStep >= 1 && (
              <div className="p-3 bg-amber-950/30 border border-amber-500/40 text-amber-300 rounded-xl">
                <span className="font-bold text-amber-400 block font-sans">Action 1 (Tool Call):</span>
                get_weather(location="Bengaluru, KA") → Returned: 24°C, Clear Sky
              </div>
            )}

            {agentStep >= 2 && (
              <div className="p-3 bg-cyan-950/30 border border-cyan-500/40 text-cyan-300 rounded-xl">
                <span className="font-bold text-cyan-400 block font-sans">Action 2 (Tool Call):</span>
                calculate_distance_fare(distance_km=15) → Returned: ₹320.00
              </div>
            )}

            {agentStep >= 3 && (
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 rounded-xl font-bold">
                <span className="font-bold text-emerald-400 block font-sans">Final Grounded Answer:</span>
                "The current weather in Bengaluru is 24°C (Clear Sky). The total cab fare for a 15km ride is ₹320.00."
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
