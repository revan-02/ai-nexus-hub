'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sparkles,
  Layers,
  Cpu,
  Terminal,
  Activity,
  Sliders,
  CheckCircle2,
  ArrowRight,
  Code,
  Zap,
  Bot,
  Brain,
  Search,
  Database,
  Eye,
  Shield,
  Smartphone,
  ChevronRight,
  Award,
  Clock,
  BookOpen,
  Copy,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CourseItem } from '@/lib/mock-data/courses-data';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

interface CourseAnimatedVideoModalProps {
  course: CourseItem | null;
  isOpen: boolean;
  onClose: () => void;
  initialLectureTitle?: string;
}

// Course-specific Animation and Realtime Application Config
interface CourseInteractivePayload {
  animationType: string;
  badge: string;
  chapters: { time: string; timestampSec: number; title: string; subtitle: string }[];
  defaultCode: string;
  defaultOutput: string;
  simulatorConfig: {
    param1Name: string;
    param1Default: number;
    param1Min: number;
    param1Max: number;
    param1Step: number;
    param1Unit: string;
    param2Name: string;
    param2Default: number;
    param2Min: number;
    param2Max: number;
    param2Step: number;
    param2Unit: string;
    metricLabel1: string;
    metricLabel2: string;
  };
}

export function CourseAnimatedVideoModal({
  course,
  isOpen,
  onClose,
  initialLectureTitle,
}: CourseAnimatedVideoModalProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTimeSec, setCurrentTimeSec] = useState(15);
  const [durationSec] = useState(240); // 4 minutes video
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'simulator' | 'code' | 'telemetry' | 'blueprint'>('simulator');
  const [copiedCode, setCopiedCode] = useState(false);

  // Realtime Simulator interactive parameters
  const [param1, setParam1] = useState(0.01);
  const [param2, setParam2] = useState(64);
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [executionOutput, setExecutionOutput] = useState<string>('');

  // Animation pulse step
  const [animStep, setAnimStep] = useState(0);

  // Get course-specific interactive configuration
  const config = getCoursePayload(course);

  // Sync animation step with video time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && isOpen) {
      interval = setInterval(() => {
        setCurrentTimeSec((prev) => {
          if (prev >= durationSec) {
            setIsPlaying(false);
            return durationSec;
          }
          return prev + 1;
        });
        setAnimStep((prev) => (prev + 1) % 4);
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isOpen, durationSec, playbackSpeed]);

  // Reset parameters when course changes
  useEffect(() => {
    if (course) {
      const cfg = getCoursePayload(course);
      setParam1(cfg.simulatorConfig.param1Default);
      setParam2(cfg.simulatorConfig.param2Default);
      setExecutionOutput(cfg.defaultOutput);
      setCurrentTimeSec(10);
      setIsPlaying(true);
    }
  }, [course]);

  if (!isOpen || !course) return null;

  // Format seconds into MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Find active chapter based on currentTimeSec
  const currentChapter =
    config.chapters.slice().reverse().find((ch) => currentTimeSec >= ch.timestampSec) ||
    config.chapters[0];

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTimeSec(Number(e.target.value));
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(config.defaultCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleExecuteCode = () => {
    setIsRunningCode(true);
    setExecutionOutput('Initializing CUDA runtime context on local Ollama / PyTorch tensor worker...\n');
    setTimeout(() => {
      setExecutionOutput((prev) => prev + `Allocating GPU VRAM for ${course.title}...\nCompiling computation graph with dynamic batching...\n`);
    }, 400);
    setTimeout(() => {
      setExecutionOutput((prev) => prev + `[SUCCESS] Iteration converged with ${config.simulatorConfig.param1Name}=${param1}, ${config.simulatorConfig.param2Name}=${param2}.\nExecution finished in 48.2ms. Tensor verification passed.\n`);
      setIsRunningCode(false);
    }, 1100);
  };

  // Dynamic performance chart data based on user params
  const chartData = [
    { step: 'T-0', loss: (1.8 * (1 + param1 * 10)).toFixed(2), throughput: Math.round(param2 * 0.8), latency: 12 },
    { step: 'T-1', loss: (1.2 * (1 + param1 * 5)).toFixed(2), throughput: Math.round(param2 * 1.1), latency: 18 },
    { step: 'T-2', loss: (0.75 * (1 + param1 * 2)).toFixed(2), throughput: Math.round(param2 * 1.4), latency: 24 },
    { step: 'T-3', loss: (0.38 * (1 + param1 * 1)).toFixed(2), throughput: Math.round(param2 * 1.8), latency: 28 },
    { step: 'T-4', loss: (0.19 * (1 + param1 * 0.5)).toFixed(2), throughput: Math.round(param2 * 2.2), latency: 31 },
    { step: 'T-5', loss: (0.08 * (1 + param1 * 0.1)).toFixed(2), throughput: Math.round(param2 * 2.5), latency: 35 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-7xl max-h-[96vh] flex flex-col bg-[#0b0b10] border border-[#262633] rounded-3xl shadow-2xl overflow-hidden my-auto">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#23232f] bg-[#101017]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {config.badge}
                </span>
                <span className="text-xs text-zinc-400 font-medium">
                  {course.academicTier || course.category}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight truncate max-w-xl">
                {course.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Interactive Lab
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="w-9 h-9 rounded-xl text-zinc-400 hover:text-white hover:bg-[#1a1a24] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Modal Main Content: Split Grid (Left: Animated Video Stage, Right: Realtime Application) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          {/* LEFT 7 COLS: Animated Video Stage */}
          <div className="lg:col-span-7 p-4 sm:p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#23232f] bg-[#09090d] space-y-4">
            {/* Cinematic Video Container */}
            <div className="relative aspect-video rounded-2xl bg-[#0e0e16] border border-[#232332] overflow-hidden flex flex-col justify-between shadow-2xl group">
              {/* Dynamic Animated Canvas / Visualizer Synced with Video */}
              <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center p-4">
                {renderCourseAnimation(config.animationType, animStep, param1, param2)}
              </div>

              {/* Top Video Overlay Bar */}
              <div className="relative z-10 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/30 to-transparent">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-xs font-bold text-white tracking-wider uppercase">
                    {initialLectureTitle || currentChapter.title}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-300 font-mono bg-black/60 px-2 py-0.5 rounded-md border border-white/10 backdrop-blur-sm">
                  {formatTime(currentTimeSec)} / {formatTime(durationSec)}
                </div>
              </div>

              {/* Subtitles / Narration Teleprompter */}
              <div className="relative z-10 px-6 py-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-center space-y-1">
                <p className="text-xs sm:text-sm font-medium text-purple-200 tracking-wide drop-shadow-md">
                  "{currentChapter.subtitle}"
                </p>
                <div className="text-[10px] text-zinc-400 font-mono">
                  Narrated by {course.instructor.name} • Nexus AI Masterclass Series
                </div>
              </div>

              {/* Video Player Bottom Controls Overlay */}
              <div className="relative z-10 px-4 py-3 bg-[#0a0a0f]/95 border-t border-[#1e1e2c] space-y-2">
                {/* Timeline Scrubber */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-zinc-400 w-10">{formatTime(currentTimeSec)}</span>
                  <input
                    type="range"
                    min={0}
                    max={durationSec}
                    value={currentTimeSec}
                    onChange={handleSeek}
                    className="flex-1 h-1.5 bg-[#252535] accent-purple-500 rounded-lg cursor-pointer hover:h-2 transition-all"
                  />
                  <span className="text-[10px] font-mono text-zinc-400 w-10 text-right">{formatTime(durationSec)}</span>
                </div>

                {/* Control Action Buttons */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-8 h-8 p-0 rounded-lg text-white hover:bg-purple-600/30 hover:text-purple-300"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setCurrentTimeSec(0)}
                      className="w-8 h-8 p-0 rounded-lg text-zinc-400 hover:text-white hover:bg-[#1a1a25]"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsMuted(!isMuted)}
                      className="w-8 h-8 p-0 rounded-lg text-zinc-400 hover:text-white hover:bg-[#1a1a25]"
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </Button>
                  </div>

                  {/* Playback Speed Toggles */}
                  <div className="flex items-center gap-1.5">
                    {[1, 1.25, 1.5, 2].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => setPlaybackSpeed(spd)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-all ${
                          playbackSpeed === spd
                            ? 'bg-purple-600 text-white shadow-sm shadow-purple-900/40'
                            : 'text-zinc-400 hover:text-zinc-200 bg-[#161622]'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Video Chapters Breakdown */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Video Lesson Chapters & Key Milestones
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {config.chapters.map((ch, idx) => {
                  const isActive = currentChapter.timestampSec === ch.timestampSec;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentTimeSec(ch.timestampSec);
                        setIsPlaying(true);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isActive
                          ? 'bg-purple-600/20 border-purple-500 text-white shadow-md shadow-purple-900/20'
                          : 'bg-[#12121a] border-[#222230] text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      <div className="text-[10px] font-mono text-purple-400 font-bold">{ch.time}</div>
                      <div className="text-xs font-semibold truncate mt-0.5">{ch.title}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT 5 COLS: Real-Time Interactive Application & Sandbox */}
          <div className="lg:col-span-5 p-4 sm:p-6 flex flex-col justify-between bg-[#0e0e15] space-y-4">
            {/* Realtime Application Tabs */}
            <div className="flex items-center justify-between border-b border-[#232332] pb-3">
              <div className="flex items-center gap-1 bg-[#151520] p-1 rounded-xl border border-[#272738]">
                <button
                  onClick={() => setActiveTab('simulator')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'simulator'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" /> Simulator
                </button>
                <button
                  onClick={() => setActiveTab('code')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'code'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" /> PyTorch Lab
                </button>
                <button
                  onClick={() => setActiveTab('telemetry')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'telemetry'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" /> Telemetry
                </button>
              </div>

              <span className="text-[11px] font-mono text-zinc-400">
                v2.6 Realtime Lab
              </span>
            </div>

            {/* TAB CONTENT 1: Realtime Interactive Simulator */}
            {activeTab === 'simulator' && (
              <div className="space-y-4 flex-1">
                <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/25 text-xs text-purple-300">
                  <div className="font-bold flex items-center gap-1.5 text-purple-200">
                    <Zap className="w-3.5 h-3.5 text-purple-400" />
                    Realtime Parameter Reactive Playground
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-300">
                    Adjust the live hyperparameters below to immediately witness computation shifts in both the animated stage and model metrics.
                  </p>
                </div>

                {/* Slider 1 */}
                <div className="p-3.5 rounded-xl bg-[#14141e] border border-[#232332] space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-zinc-300">{config.simulatorConfig.param1Name}:</span>
                    <span className="font-mono text-purple-400">
                      {param1} {config.simulatorConfig.param1Unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={config.simulatorConfig.param1Min}
                    max={config.simulatorConfig.param1Max}
                    step={config.simulatorConfig.param1Step}
                    value={param1}
                    onChange={(e) => setParam1(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-[#252538] accent-purple-500 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                    <span>Min: {config.simulatorConfig.param1Min}</span>
                    <span>Max: {config.simulatorConfig.param1Max}</span>
                  </div>
                </div>

                {/* Slider 2 */}
                <div className="p-3.5 rounded-xl bg-[#14141e] border border-[#232332] space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-zinc-300">{config.simulatorConfig.param2Name}:</span>
                    <span className="font-mono text-blue-400">
                      {param2} {config.simulatorConfig.param2Unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={config.simulatorConfig.param2Min}
                    max={config.simulatorConfig.param2Max}
                    step={config.simulatorConfig.param2Step}
                    value={param2}
                    onChange={(e) => setParam2(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-[#252538] accent-blue-500 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                    <span>Min: {config.simulatorConfig.param2Min}</span>
                    <span>Max: {config.simulatorConfig.param2Max}</span>
                  </div>
                </div>

                {/* Live Realtime Output Cards */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-[#12121a] border border-[#232330]">
                    <div className="text-[10px] text-zinc-400 font-bold uppercase">{config.simulatorConfig.metricLabel1}</div>
                    <div className="text-lg font-black text-emerald-400 font-mono mt-0.5">
                      {(0.082 * (1 + param1 * 2)).toFixed(4)}
                    </div>
                    <div className="text-[10px] text-emerald-400/80 flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Stabilized Convergence
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#12121a] border border-[#232330]">
                    <div className="text-[10px] text-zinc-400 font-bold uppercase">{config.simulatorConfig.metricLabel2}</div>
                    <div className="text-lg font-black text-purple-400 font-mono mt-0.5">
                      {Math.round(param2 * 2.45)} tok/sec
                    </div>
                    <div className="text-[10px] text-zinc-400 flex items-center gap-1 mt-0.5">
                      <Cpu className="w-3 h-3 text-purple-400" /> GPU Accelerated
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: PyTorch Realtime Code Lab */}
            {activeTab === 'code' && (
              <div className="space-y-3 flex-1 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
                    <Code className="w-4 h-4 text-purple-400" />
                    <span>realtime_model.py</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyCode}
                    className="h-7 text-[11px] border-[#29293a] bg-[#14141e] text-zinc-300 hover:text-white"
                  >
                    {copiedCode ? <Check className="w-3 h-3 mr-1 text-emerald-400" /> : <Copy className="w-3 h-3 mr-1" />}
                    {copiedCode ? 'Copied' : 'Copy'}
                  </Button>
                </div>

                <div className="p-3 rounded-xl bg-[#09090e] border border-[#20202e] font-mono text-xs text-zinc-300 overflow-x-auto max-h-48 leading-relaxed selection:bg-purple-500/30">
                  <pre>{config.defaultCode}</pre>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Execution Console Output</span>
                    <Button
                      size="sm"
                      onClick={handleExecuteCode}
                      disabled={isRunningCode}
                      className="h-7 text-xs bg-purple-600 hover:bg-purple-500 text-white font-bold cursor-pointer"
                    >
                      <Play className="w-3 h-3 mr-1.5 fill-white" />
                      {isRunningCode ? 'Running...' : 'Run Realtime Code'}
                    </Button>
                  </div>
                  <div className="p-3 rounded-xl bg-black border border-[#1f1f2d] font-mono text-[11px] text-emerald-400 min-h-24 max-h-28 overflow-y-auto whitespace-pre-wrap">
                    {executionOutput}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: Live Realtime Telemetry Graph */}
            {activeTab === 'telemetry' && (
              <div className="space-y-4 flex-1">
                <div className="p-3 rounded-xl bg-[#14141e] border border-[#232332] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-200">Realtime Loss Curve (Validation vs Epoch)</span>
                    <span className="text-[10px] font-mono text-emerald-400">Loss: {chartData[5].loss}</span>
                  </div>
                  <div className="h-36 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#232335" />
                        <XAxis dataKey="step" stroke="#686882" fontSize={10} />
                        <YAxis stroke="#686882" fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: '#101018', borderColor: '#2b2b3d', fontSize: 11 }} />
                        <Line type="monotone" dataKey="loss" stroke="#a855f7" strokeWidth={2.5} dot={{ fill: '#a855f7' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#14141e] border border-[#232332] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-200">Inference Throughput (Tokens / Sec)</span>
                    <span className="text-[10px] font-mono text-blue-400">{chartData[5].throughput} tok/s</span>
                  </div>
                  <div className="h-28 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#232335" />
                        <XAxis dataKey="step" stroke="#686882" fontSize={10} />
                        <YAxis stroke="#686882" fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: '#101018', borderColor: '#2b2b3d', fontSize: 11 }} />
                        <Line type="monotone" dataKey="throughput" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Footer Actions */}
            <div className="pt-3 border-t border-[#232332] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-zinc-300 font-medium">
                  Includes Verifiable Certificate & GitHub Capstone
                </span>
              </div>
              <Button
                size="sm"
                onClick={onClose}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs h-8"
              >
                Continue Curriculum <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Dynamic SVG/Canvas Animation Renderers for Each AI Course Type
// ─────────────────────────────────────────────────────────────
function renderCourseAnimation(
  type: string,
  step: number,
  param1: number,
  param2: number
) {
  switch (type) {
    case 'ATTENTION_HEATMAP':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
          <div className="text-xs font-bold text-purple-300 tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Scaled Dot-Product Self-Attention: Softmax(Q·Kᵀ / √d_k) · V
          </div>
          <div className="grid grid-cols-5 gap-2 p-3 rounded-2xl bg-black/50 border border-purple-500/30">
            {['The', 'neural', 'agent', 'solved', 'task'].map((token, row) =>
              ['The', 'neural', 'agent', 'solved', 'task'].map((_, col) => {
                const isDiagonal = row === col;
                const isHighlight = (row + col + step) % 3 === 0;
                return (
                  <div
                    key={`${row}-${col}`}
                    className={`w-12 h-10 sm:w-16 sm:h-12 rounded-xl flex flex-col items-center justify-center transition-all duration-500 border ${
                      isHighlight
                        ? 'bg-purple-600/80 border-purple-400 text-white shadow-lg shadow-purple-900/50 scale-105'
                        : isDiagonal
                        ? 'bg-purple-950/40 border-purple-800/40 text-purple-300'
                        : 'bg-[#151522] border-[#222233] text-zinc-500'
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold">
                      {isHighlight ? (0.75 + param1 * 2).toFixed(2) : (0.15 + (row * 0.05)).toFixed(2)}
                    </span>
                    <span className="text-[9px] text-zinc-400 font-mono truncate max-w-[45px]">{token}</span>
                  </div>
                );
              })
            )}
          </div>
          <div className="text-[11px] font-mono text-zinc-400">
            Step {step + 1} of 4: Multi-Head Projection with {Math.round(param2 / 8) || 8} Attention Heads
          </div>
        </div>
      );

    case 'NEURAL_NETWORK':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
          <div className="text-xs font-bold text-purple-300 tracking-wider flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-400" />
            Deep Neural Network: Forward & Backward Activation Flow
          </div>
          <div className="flex items-center justify-center gap-8 sm:gap-14">
            {/* Input Layer */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-zinc-400 block text-center">INPUT X</span>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border transition-all duration-500 ${
                    step === 0
                      ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/50 scale-110'
                      : 'bg-[#141420] border-[#2b2b40] text-zinc-400'
                  }`}
                >
                  X{i + 1}
                </div>
              ))}
            </div>

            {/* Hidden Layer 1 */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-purple-400 block text-center">HIDDEN 1</span>
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border transition-all duration-500 ${
                    step === 1
                      ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-900/50 scale-110'
                      : 'bg-[#141420] border-[#2b2b40] text-zinc-400'
                  }`}
                >
                  H{i + 1}
                </div>
              ))}
            </div>

            {/* Hidden Layer 2 */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-indigo-400 block text-center">HIDDEN 2</span>
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border transition-all duration-500 ${
                    step === 2
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-900/50 scale-110'
                      : 'bg-[#141420] border-[#2b2b40] text-zinc-400'
                  }`}
                >
                  H{i + 1}
                </div>
              ))}
            </div>

            {/* Output Layer */}
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-emerald-400 block text-center">OUTPUT Ŷ</span>
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-xs border transition-all duration-500 ${
                    step === 3
                      ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-900/50 scale-110'
                      : 'bg-[#141420] border-[#2b2b40] text-zinc-400'
                  }`}
                >
                  Y{i + 1}
                </div>
              ))}
            </div>
          </div>
          <div className="text-[11px] font-mono text-zinc-400">
            Activation: ReLU(W·X + B) • Current Loss: {(0.042 * (1 + param1 * 2)).toFixed(4)}
          </div>
        </div>
      );

    case 'RAG_ARCHITECTURE':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
          <div className="text-xs font-bold text-emerald-300 tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            Enterprise RAG Architecture: Vector DB Semantic Retrieval & Grounding
          </div>
          <div className="flex items-center justify-center gap-4 sm:gap-8">
            <div
              className={`p-3 rounded-2xl border text-center transition-all duration-500 ${
                step === 0 ? 'bg-purple-600/30 border-purple-400 text-white scale-105' : 'bg-[#13131c] border-[#252538] text-zinc-400'
              }`}
            >
              <div className="text-xs font-bold">1. User Query</div>
              <div className="text-[10px] text-zinc-500 font-mono mt-1">"Explain LoRA fine-tuning"</div>
            </div>

            <ArrowRight className="w-4 h-4 text-purple-400" />

            <div
              className={`p-3 rounded-2xl border text-center transition-all duration-500 ${
                step === 1 ? 'bg-blue-600/30 border-blue-400 text-white scale-105' : 'bg-[#13131c] border-[#252538] text-zinc-400'
              }`}
            >
              <div className="text-xs font-bold">2. Embeddings</div>
              <div className="text-[10px] text-zinc-500 font-mono mt-1">Dense 1536-dim Vector</div>
            </div>

            <ArrowRight className="w-4 h-4 text-blue-400" />

            <div
              className={`p-3 rounded-2xl border text-center transition-all duration-500 ${
                step === 2 ? 'bg-emerald-600/30 border-emerald-400 text-white scale-105' : 'bg-[#13131c] border-[#252538] text-zinc-400'
              }`}
            >
              <div className="text-xs font-bold">3. Vector Index</div>
              <div className="text-[10px] text-zinc-500 font-mono mt-1">Top-K Chunks Retrieved</div>
            </div>

            <ArrowRight className="w-4 h-4 text-emerald-400" />

            <div
              className={`p-3 rounded-2xl border text-center transition-all duration-500 ${
                step === 3 ? 'bg-amber-600/30 border-amber-400 text-white scale-105' : 'bg-[#13131c] border-[#252538] text-zinc-400'
              }`}
            >
              <div className="text-xs font-bold">4. Grounded LLM</div>
              <div className="text-[10px] text-zinc-500 font-mono mt-1">Zero Hallucination Answer</div>
            </div>
          </div>
          <div className="text-[11px] font-mono text-zinc-400">
            Vector Similarity: {(0.92 + param1 * 0.05).toFixed(3)} • Latency: 34ms
          </div>
        </div>
      );

    case 'AGENTIC_AI':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
          <div className="text-xs font-bold text-amber-300 tracking-wider flex items-center gap-2">
            <Bot className="w-4 h-4 text-amber-400" />
            Autonomous ReAct Loop & Multi-Agent Collaboration
          </div>
          <div className="grid grid-cols-2 gap-3 max-w-md w-full">
            <div
              className={`p-3 rounded-xl border transition-all duration-500 ${
                step === 0 ? 'bg-amber-500/30 border-amber-400 text-white scale-105' : 'bg-[#14141e] border-[#232332] text-zinc-400'
              }`}
            >
              <span className="text-[10px] font-bold uppercase text-amber-400">1. Reason</span>
              <div className="text-xs font-semibold text-zinc-200 mt-1">Goal Decomposition</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">LLM assesses task plan</div>
            </div>

            <div
              className={`p-3 rounded-xl border transition-all duration-500 ${
                step === 1 ? 'bg-blue-500/30 border-blue-400 text-white scale-105' : 'bg-[#14141e] border-[#232332] text-zinc-400'
              }`}
            >
              <span className="text-[10px] font-bold uppercase text-blue-400">2. Act / Tool Call</span>
              <div className="text-xs font-semibold text-zinc-200 mt-1">API Execution</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">WebSearch & Code Sandbox</div>
            </div>

            <div
              className={`p-3 rounded-xl border transition-all duration-500 ${
                step === 2 ? 'bg-purple-500/30 border-purple-400 text-white scale-105' : 'bg-[#14141e] border-[#232332] text-zinc-400'
              }`}
            >
              <span className="text-[10px] font-bold uppercase text-purple-400">3. Observe</span>
              <div className="text-xs font-semibold text-zinc-200 mt-1">Memory Update</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">Parse output observation</div>
            </div>

            <div
              className={`p-3 rounded-xl border transition-all duration-500 ${
                step === 3 ? 'bg-emerald-500/30 border-emerald-400 text-white scale-105' : 'bg-[#14141e] border-[#232332] text-zinc-400'
              }`}
            >
              <span className="text-[10px] font-bold uppercase text-emerald-400">4. Synthesis</span>
              <div className="text-xs font-semibold text-zinc-200 mt-1">Final Verified Response</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">Self-critique check passed</div>
            </div>
          </div>
          <div className="text-[11px] font-mono text-zinc-400">
            Agent Status: Active • Working Memory: {Math.round(param2 * 1.5)} tokens
          </div>
        </div>
      );

    case 'COMPUTER_VISION':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
          <div className="text-xs font-bold text-cyan-300 tracking-wider flex items-center gap-2">
            <Eye className="w-4 h-4 text-cyan-400" />
            YOLOv11 Real-Time Object Detection & Feature Maps
          </div>
          <div className="relative w-64 h-40 rounded-2xl bg-[#12121a] border border-[#2b2b3d] overflow-hidden flex items-center justify-center">
            {/* Simulated Bounding Box 1 */}
            <div
              className={`absolute top-6 left-6 w-24 h-24 border-2 rounded-lg transition-all duration-500 ${
                step % 2 === 0 ? 'border-emerald-400 bg-emerald-500/10 scale-105' : 'border-emerald-600/50 bg-transparent'
              }`}
            >
              <span className="absolute -top-4 left-0 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded font-mono">
                person 0.96
              </span>
            </div>

            {/* Simulated Bounding Box 2 */}
            <div
              className={`absolute bottom-4 right-8 w-28 h-16 border-2 rounded-lg transition-all duration-500 ${
                step % 2 !== 0 ? 'border-cyan-400 bg-cyan-500/10 scale-105' : 'border-cyan-600/50 bg-transparent'
              }`}
            >
              <span className="absolute -top-4 left-0 bg-cyan-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded font-mono">
                vehicle 0.92
              </span>
            </div>

            <div className="text-[11px] font-mono text-zinc-600">640x640 Input Tensor Stream</div>
          </div>
          <div className="text-[11px] font-mono text-zinc-400">
            Inference: 14.2ms • FPS: 68 • Confidence Threshold: {param1.toFixed(2)}
          </div>
        </div>
      );

    default: // AI Foundations / General
      return (
        <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
          <div className="text-xs font-bold text-purple-300 tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400" />
            A* Search & Intelligent State-Space Pathfinding
          </div>
          <div className="grid grid-cols-4 gap-2.5">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => {
              const isExplored = idx <= step * 2;
              const isTarget = idx === 7;
              return (
                <div
                  key={idx}
                  className={`w-14 h-12 rounded-xl flex flex-col items-center justify-center font-mono text-xs border transition-all duration-500 ${
                    isTarget
                      ? 'bg-emerald-600/30 border-emerald-400 text-emerald-300 font-bold'
                      : isExplored
                      ? 'bg-purple-600/30 border-purple-500 text-white shadow-md'
                      : 'bg-[#151520] border-[#242433] text-zinc-600'
                  }`}
                >
                  <span className="text-[9px] text-zinc-400">Node {idx + 1}</span>
                  <span className="text-[11px] font-bold">f={10 + idx * 2}</span>
                </div>
              );
            })}
          </div>
          <div className="text-[11px] font-mono text-zinc-400">
            Heuristic: f(n) = g(n) + h(n) • Optimal Path Cost: 24.8
          </div>
        </div>
      );
  }
}

// Helper: Maps each Course to its Animation type and interactive simulation settings
function getCoursePayload(course: CourseItem | null): CourseInteractivePayload {
  if (!course) {
    return {
      animationType: 'NEURAL_NETWORK',
      badge: 'Neural Networks & Deep Learning',
      chapters: [
        { time: '00:00', timestampSec: 0, title: 'Artificial Neurons & Perceptrons', subtitle: 'Linear combinations of weighted inputs passed through activation functions' },
        { time: '01:00', timestampSec: 60, title: 'Forward Propagation Dynamics', subtitle: 'Matrix multiplications cascading through hidden layers to produce predictions' },
        { time: '02:15', timestampSec: 135, title: 'Loss Formulation & Cross-Entropy', subtitle: 'Quantifying prediction discrepancies with penalty gradients' },
        { time: '03:30', timestampSec: 210, title: 'Backpropagation & Adam Optimizer', subtitle: 'Adjusting synaptic weights in reverse order via the calculus chain rule' },
      ],
      defaultCode: `# Neural Network Training Loop in PyTorch\nimport torch\nimport torch.nn as nn\n\nmodel = nn.Sequential(nn.Linear(10, 32), nn.ReLU(), nn.Linear(32, 2))\nprint('Model initialized:', model)`,
      defaultOutput: 'SimpleMLP initialized with CUDA runtime.\nLoss: 0.6931 -> 0.0412\nGradients verified.',
      simulatorConfig: {
        param1Name: 'Learning Rate (α)',
        param1Default: 0.01,
        param1Min: 0.001,
        param1Max: 0.1,
        param1Step: 0.005,
        param1Unit: '',
        param2Name: 'Batch Size',
        param2Default: 32,
        param2Min: 8,
        param2Max: 128,
        param2Step: 8,
        param2Unit: 'samples',
        metricLabel1: 'Cross-Entropy Loss',
        metricLabel2: 'Training Speed',
      },
    };
  }

  const cat = course.category?.toLowerCase() || '';
  const title = course.title?.toLowerCase() || '';

  if (cat.includes('deep learning') || title.includes('transformers') || title.includes('attention')) {
    return {
      animationType: 'ATTENTION_HEATMAP',
      badge: 'Transformers & Attention',
      chapters: [
        { time: '00:00', timestampSec: 0, title: 'Scaled Dot-Product Math', subtitle: 'Projecting Q, K, V matrices and computing raw dot-product scores' },
        { time: '01:00', timestampSec: 60, title: 'Softmax Heatmap Normalization', subtitle: 'Applying 1/√d_k scaling and Softmax to produce probability distributions' },
        { time: '02:15', timestampSec: 135, title: 'Multi-Head Parallel Subspaces', subtitle: 'Executing 8 to 32 parallel attention heads across contextual dimensions' },
        { time: '03:30', timestampSec: 210, title: 'KV-Cache & Continuous Batching', subtitle: 'Storing Key-Value activations in virtual GPU memory to avoid recomputation' },
      ],
      defaultCode: `# PyTorch Scaled Dot-Product Self-Attention
import torch
import torch.nn.functional as F

def self_attention(Q, K, V):
    d_k = Q.size(-1)
    scores = torch.matmul(Q, K.transpose(-2, -1)) / (d_k ** 0.5)
    weights = F.softmax(scores, dim=-1)
    output = torch.matmul(weights, V)
    return output, weights

q = torch.randn(1, 8, 64) # [batch, seq_len, d_k]
out, attn = self_attention(q, q, q)
print("Attention Tensor Output shape:", out.shape)`,
      defaultOutput: `Initialized PyTorch 2.5 CUDA Tensor Context...\n[Matrix Multiplication] Q (1x8x64) · K^T (1x64x8) -> Scores (1x8x8)\n[Softmax Scaling] Temperature = 1.0\nOutput Tensor Shape: torch.Size([1, 8, 64])\nAttention Weight Checksum Verified: 1.0000`,
      simulatorConfig: {
        param1Name: 'Softmax Temperature',
        param1Default: 1.0,
        param1Min: 0.1,
        param1Max: 2.5,
        param1Step: 0.1,
        param1Unit: '',
        param2Name: 'Attention Heads',
        param2Default: 8,
        param2Min: 2,
        param2Max: 32,
        param2Step: 2,
        param2Unit: 'heads',
        metricLabel1: 'Softmax Entropy',
        metricLabel2: 'Inference Throughput',
      },
    };
  }

  if (cat.includes('generative ai') || title.includes('rag') || title.includes('retrieval')) {
    return {
      animationType: 'RAG_ARCHITECTURE',
      badge: 'Generative AI & RAG',
      chapters: [
        { time: '00:00', timestampSec: 0, title: 'Semantic Chunking & Embedding', subtitle: 'Deconstructing documents into high-fidelity semantic vector chunks' },
        { time: '01:00', timestampSec: 60, title: 'HNSW Vector Index Search', subtitle: 'Querying high-dimensional vector spaces using cosine similarity' },
        { time: '02:15', timestampSec: 135, title: 'Reranking with Cohere Rerank', subtitle: 'Cross-encoder scoring to elevate most critical context to the prompt top' },
        { time: '03:30', timestampSec: 210, title: 'Grounded LLM Generation', subtitle: 'Injecting verified context into system prompt with strict citations' },
      ],
      defaultCode: `# Enterprise RAG Pipeline with Semantic Retrieval
from typing import List

def retrieve_and_generate(query: str, top_k: int = 3):
    print(f"Embedding query: '{query}'")
    # Simulate vector similarity retrieval
    chunks = [
        "Chunk 1: LoRA reduces trainable parameters by 99% using low-rank matrices.",
        "Chunk 2: QLoRA applies 4-bit NormalFloat quantization to base weights.",
        "Chunk 3: Gradient checkpointing lowers activation memory overhead."
    ]
    prompt = f"Context:\\n" + "\\n".join(chunks[:top_k]) + f"\\n\\nQuestion: {query}\\nAnswer:"
    return prompt

print(retrieve_and_generate("How does LoRA save GPU memory?", top_k=2))`,
      defaultOutput: `Vector Index Connection Established (Chroma / Pinecone)...\nQuery Vectorized in 12ms.\nRetrieved 2 top chunks (Cosine Similarity > 0.88).\nContext Injected into Llama-3-70B Context Window.\nZero Hallucination Score: 99.8%`,
      simulatorConfig: {
        param1Name: 'Similarity Threshold',
        param1Default: 0.85,
        param1Min: 0.5,
        param1Max: 0.98,
        param1Step: 0.02,
        param1Unit: '',
        param2Name: 'Top-K Chunks',
        param2Default: 4,
        param2Min: 1,
        param2Max: 10,
        param2Step: 1,
        param2Unit: 'chunks',
        metricLabel1: 'Cosine Similarity',
        metricLabel2: 'Retrieval Speed',
      },
    };
  }

  if (cat.includes('agent') || title.includes('agent') || title.includes('langgraph')) {
    return {
      animationType: 'AGENTIC_AI',
      badge: 'Autonomous AI Agents',
      chapters: [
        { time: '00:00', timestampSec: 0, title: 'Agent Architecture & ReAct Loop', subtitle: 'Breaking down complex user goals into observable action steps' },
        { time: '01:00', timestampSec: 60, title: 'Tool Calling & Schema Binding', subtitle: 'Dynamic JSON schema argument parsing for safe tool execution' },
        { time: '02:15', timestampSec: 135, title: 'Multi-Agent LangGraph Supervisor', subtitle: 'Orchestrating stateful handoffs between specialized sub-agents' },
        { time: '03:30', timestampSec: 210, title: 'Self-Reflection & Human Approvals', subtitle: 'Critiquing tool output and requesting human verification before execution' },
      ],
      defaultCode: `# LangGraph Multi-Agent Workflow Node
class AgentState:
    def __init__(self, goal: str):
        self.goal = goal
        self.history = []
        self.status = "INIT"

def reason_and_act(state: AgentState):
    print(f"Agent executing step for goal: {state.goal}")
    tool_call = {"tool": "WebSearch", "query": "Latest AI agents Q3 2026"}
    print(f"Selected Tool: {tool_call['tool']} -> Args: {tool_call['query']}")
    return "Next: ExecuteObservation"

state = AgentState("Analyze multimodal AI benchmarks")
result = reason_and_act(state)`,
      defaultOutput: `Agent Executor Initialized...\n[Node: Supervisor] Plan generated: 3 sub-tasks.\n[Node: ToolExecutor] Invoking WebSearch Tool...\n[Node: Critic] Output evaluated. Criteria satisfied.\nCompleted successfully in 2.1s.`,
      simulatorConfig: {
        param1Name: 'Agent Temperature',
        param1Default: 0.2,
        param1Min: 0.0,
        param1Max: 1.0,
        param1Step: 0.05,
        param1Unit: '',
        param2Name: 'Max ReAct Loops',
        param2Default: 5,
        param2Min: 1,
        param2Max: 12,
        param2Step: 1,
        param2Unit: 'iterations',
        metricLabel1: 'Goal Completion Rate',
        metricLabel2: 'Tool Call Efficiency',
      },
    };
  }

  if (cat.includes('vision') || title.includes('yolo') || title.includes('vision')) {
    return {
      animationType: 'COMPUTER_VISION',
      badge: 'Computer Vision & YOLO',
      chapters: [
        { time: '00:00', timestampSec: 0, title: 'Image Tensor Preprocessing', subtitle: 'Normalizing RGB pixel tensors to shape [B, 3, 640, 640]' },
        { time: '01:00', timestampSec: 60, title: 'DarkNet Backbone & PANet Neck', subtitle: 'Extracting multi-scale features for tiny, medium, and large objects' },
        { time: '02:15', timestampSec: 135, title: 'Anchor-Free Bounding Box Heads', subtitle: 'Predicting class logits and bounding coordinates [x, y, w, h]' },
        { time: '03:30', timestampSec: 210, title: 'Non-Maximum Suppression (NMS)', subtitle: 'Filtering redundant bounding boxes using Intersection-over-Union' },
      ],
      defaultCode: `# YOLOv11 Real-Time Vision Inference Pipeline
import torch

def detect_objects(frame_tensor, conf_threshold=0.5):
    print(f"Input Frame Tensor: {frame_tensor.shape}")
    # Simulate forward pass
    detections = [
        {"class": "person", "conf": 0.94, "box": [45, 60, 180, 240]},
        {"class": "vehicle", "conf": 0.89, "box": [220, 140, 480, 320]}
    ]
    valid = [d for d in detections if d["conf"] >= conf_threshold]
    return valid

sample = torch.zeros(1, 3, 640, 640)
print("Detections:", detect_objects(sample, conf_threshold=0.6))`,
      defaultOutput: `Loading TensorRT YOLOv11 Engine on GPU...\nFrame Resolution: 640x640x3\nForward Pass Latency: 4.8ms\nNMS Filtering: 2 objects detected with Confidence > 0.85\nOutput Stream: 60.0 FPS Rock-Solid`,
      simulatorConfig: {
        param1Name: 'Confidence Threshold',
        param1Default: 0.65,
        param1Min: 0.1,
        param1Max: 0.95,
        param1Step: 0.05,
        param1Unit: '',
        param2Name: 'NMS IoU Threshold',
        param2Default: 45,
        param2Min: 20,
        param2Max: 90,
        param2Step: 5,
        param2Unit: '%',
        metricLabel1: 'Mean Average Precision',
        metricLabel2: 'Inference FPS',
      },
    };
  }

  // Default: AI Foundations & Neural Networks
  return {
    animationType: 'NEURAL_NETWORK',
    badge: 'Neural Networks & Deep Learning',
    chapters: [
      { time: '00:00', timestampSec: 0, title: 'Artificial Neurons & Perceptrons', subtitle: 'Linear combinations of weighted inputs passed through activation functions' },
      { time: '01:00', timestampSec: 60, title: 'Forward Propagation Dynamics', subtitle: 'Matrix multiplications cascading through hidden layers to produce predictions' },
      { time: '02:15', timestampSec: 135, title: 'Loss Formulation & Cross-Entropy', subtitle: 'Quantifying prediction discrepancies with penalty gradients' },
      { time: '03:30', timestampSec: 210, title: 'Backpropagation & Adam Optimizer', subtitle: 'Adjusting synaptic weights in reverse order via the calculus chain rule' },
    ],
    defaultCode: `# Neural Network Training Loop in PyTorch
import torch
import torch.nn as nn

class SimpleMLP(nn.Module):
    def __init__(self, in_features=10, hidden=32, out_classes=2):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(in_features, hidden),
            nn.ReLU(),
            nn.Linear(hidden, out_classes)
        )
    def forward(self, x):
        return self.net(x)

model = SimpleMLP()
x = torch.randn(8, 10)
out = model(x)
print("Forward Pass Result:", out.shape)`,
    defaultOutput: `SimpleMLP Architecture Instantiated...\nLayer 1: Linear(10 -> 32) + ReLU Activation\nLayer 2: Linear(32 -> 2) Output Logits\nBatch Loss: 0.6931 -> 0.0412 after 5 epochs\nWeight Gradients Verified via Autograd.`,
    simulatorConfig: {
      param1Name: 'Learning Rate (α)',
      param1Default: 0.01,
      param1Min: 0.001,
      param1Max: 0.1,
      param1Step: 0.005,
      param1Unit: '',
      param2Name: 'Batch Size',
      param2Default: 32,
      param2Min: 8,
      param2Max: 128,
      param2Step: 8,
      param2Unit: 'samples',
      metricLabel1: 'Cross-Entropy Loss',
      metricLabel2: 'Training Speed',
    },
  };
}
