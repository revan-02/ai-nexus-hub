'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Trophy,
  Award,
  Sparkles,
  Search,
  Code2,
  Database,
  Cpu,
  Layers,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Shield,
  Zap,
  Activity,
  Copy,
  Check,
  Flame,
  Clock,
  Send,
  ExternalLink,
  Share2,
  Terminal,
  Play,
  RotateCcw,
  Sliders,
  AlertTriangle,
  Eye,
  Lock,
  GitBranch,
  Volume2,
  Droplets,
  Sprout,
  Satellite,
  Bug,
  Plane,
  Scale,
  Gauge,
  Thermometer,
  TreeDeciduous,
  Waves
} from 'lucide-react';
import {
  EXPERT_CHALLENGES_DATABASE,
  ExpertChallenge,
  ChallengeSubmissionResult,
  submitChallengeSolution
} from '@/services/expert-challenges-service';

export default function ExpertChallengesPage() {
  const [challenges] = useState<ExpertChallenge[]>(EXPERT_CHALLENGES_DATABASE);
  const [selectedChallenge, setSelectedChallenge] = useState<ExpertChallenge>(EXPERT_CHALLENGES_DATABASE[0]);
  const [activePillarTab, setActivePillarTab] = useState<'ds' | 'system' | 'db' | 'ai' | 'frontend'>('ds');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // ── INTERACTIVE FRONTEND SIMULATOR STATES ──
  // 1. Agriculture: Crop Leaf Scanner
  const [selectedLang, setSelectedLang] = useState<'kannada' | 'hindi' | 'telugu' | 'tamil' | 'english'>('kannada');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioFeedbackText, setAudioFeedbackText] = useState('');

  // 2. Agriculture: Precision Irrigation
  const [irrigationMoisture, setIrrigationMoisture] = useState<number[]>([22, 18, 35, 14, 42, 19]);
  const [valveActiveZone, setValveActiveZone] = useState<number | null>(null);

  // 3. Agriculture: Satellite NDVI
  const [ndviSliderVal, setNdviSliderVal] = useState(65);

  // 4. Agriculture: Pest Trap
  const [dispensePheromoneState, setDispensePheromoneState] = useState(false);

  // 5. Agriculture: Drone Flight
  const [weedDensitySprayMode, setWeedDensitySprayMode] = useState<'high' | 'medium' | 'spot'>('spot');

  // 6. Agriculture: Fruit Harvest Robot
  const [fruitRipenessSlider, setFruitRipenessSlider] = useState(88);

  // 7. Agriculture: Mandi Price
  const [mandiHoldSellMode, setMandiHoldSellMode] = useState<'7d' | '14d' | '30d'>('7d');

  // 8. Agriculture: Soil NPK Spectrometer
  const [soilNitrogenVal, setSoilNitrogenVal] = useState(185);

  // 9. Agriculture: Hydroponics Twin
  const [hydroDosingActive, setHydroDosingActive] = useState(false);

  // 10. Agriculture: Cattle Thermal Vision
  const [cattleThermalSlider, setCattleThermalSlider] = useState(39.4);

  // FinTech Fraud Simulator
  const [fraudTransactions, setFraudTransactions] = useState<any[]>([
    { id: 'TX-901', sender: 'acc_8812', recipient: 'acc_4419', amount: 450.0, risk: 0.12, status: 'APPROVED', time: '10:14:02' },
    { id: 'TX-902', sender: 'acc_3391', recipient: 'acc_9921', amount: 1200.0, risk: 0.28, status: 'APPROVED', time: '10:14:05' },
    { id: 'TX-903', sender: 'acc_1002', recipient: 'mule_771', amount: 89000.0, risk: 0.94, status: 'BLOCKED', time: '10:14:09' }
  ]);
  const [isSimulatingTx, setIsSimulatingTx] = useState(false);

  // Hybrid Search Simulator
  const [searchDemoQuery, setSearchDemoQuery] = useState('Apple MacBook M3 Max space black 36GB');
  const [searchFusionMode, setSearchFusionMode] = useState<'hybrid' | 'bm25' | 'vector'>('hybrid');

  // Healthcare Triage Simulator
  const [gradCamOpacity, setGradCamOpacity] = useState(70);

  // Code Editor & Submission Sandbox
  const [codeEditorText, setCodeEditorText] = useState(selectedChallenge.dataStructure.implementationCode);
  const [isExecutingTests, setIsExecutingTests] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<ChallengeSubmissionResult | null>(null);
  const [showBadgeModal, setShowBadgeModal] = useState(false);

  useEffect(() => {
    setCodeEditorText(selectedChallenge.dataStructure.implementationCode);
    setSubmissionResult(null);
  }, [selectedChallenge]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handlePlayVernacularAudio = (lang: string) => {
    setIsPlayingAudio(true);
    const audioScripts: Record<string, string> = {
      kannada: '🔊 "ರೈತ ಮಿತ್ರ: ನಿಮ್ಮ ಬೆಳೆಗೆ ಆರಂಭಿಕ ಬ್ಲೈಟ್ ರೋಗ ತಗುಲಿದೆ. 1 ಲೀಟರ್ ನೀರಿಗೆ 2 ಗ್ರಾಂ ಮ್ಯಾಂಕೋಜೆಬ್ ಅಥವಾ ಜೈವಿಕ ಟ್ರೈಕೋಡರ್ಮಾವನ್ನು 48 ಗಂಟೆಗಳ ಒಳಗೆ ಸಿಂಪಡಿಸಿ."',
      hindi: '🔊 "किसान भाई: आपकी फसल में अर्ली ब्लाइट का प्रकोप है। 48 घंटे के भीतर प्रति लीटर पानी में 2 ग्राम मैंकोजेब या जैविक ट्राइकोडर्मा का छिड़काव करें।"',
      telugu: '🔊 "రైతు మిత్రులారా: మీ పంటకు ఎర్లీ బ్లైట్ తెగులు సోకింది. 48 గంటల్లోగా లీటరు నీటికి 2 గ్రాముల మాంకోజెబ్ లేదా ట్రైకోడెర్మా పిచికారీ చేయండి."',
      tamil: '🔊 "விவசாய நண்பரே: உங்கள் பயிரில் ஆரம்பகால இலைக்கருகல் நோய் தாக்கியுள்ளது. 48 மணி நேரத்திற்குள் 2 கிராம் மேன்கோசெப் தெளிக்கவும்."',
      english: '🔊 "Farmer Advisory: Early Blight detected (94% confidence). Apply 2g Mancozeb 75 WP per liter or organic Trichoderma viride within 48h."'
    };
    setAudioFeedbackText(audioScripts[lang] || audioScripts.english);
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 2500);
  };

  const handleSimulateTransaction = (isAdversarial = false) => {
    setIsSimulatingTx(true);
    setTimeout(() => {
      const now = new Date().toTimeString().split(' ')[0];
      const newTx = isAdversarial
        ? {
            id: `TX-${Math.floor(Math.random() * 900 + 100)}`,
            sender: 'botnet_attacker_99',
            recipient: 'shell_co_402',
            amount: 98500.0,
            risk: 0.98,
            status: 'BLOCKED (Adversarial GNN Trigger)',
            time: now
          }
        : {
            id: `TX-${Math.floor(Math.random() * 900 + 100)}`,
            sender: `acc_${Math.floor(Math.random() * 8000 + 1000)}`,
            recipient: `merchant_${Math.floor(Math.random() * 400 + 100)}`,
            amount: +(Math.random() * 800 + 20).toFixed(2),
            risk: +(Math.random() * 0.25).toFixed(2),
            status: 'APPROVED',
            time: now
          };
      setFraudTransactions((prev) => [newTx, ...prev.slice(0, 5)]);
      setIsSimulatingTx(false);
    }, 400);
  };

  const handleRunTestBench = () => {
    setIsExecutingTests(true);
    setTimeout(() => {
      const result = submitChallengeSolution(selectedChallenge.id, codeEditorText);
      setSubmissionResult(result);
      setIsExecutingTests(false);
      if (result.passed) {
        setShowBadgeModal(true);
      }
    }, 900);
  };

  const filteredChallenges = challenges.filter((c) => {
    const matchesDomain = selectedDomain === 'All' || c.domain === selectedDomain;
    const matchesDiff = selectedDifficulty === 'All' || c.difficulty === selectedDifficulty;
    const matchesSearch =
      !searchQuery ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.dataStructure.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.domain.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesDiff && matchesSearch;
  });

  return (
    <NexusShell>
      <div className="space-y-8 max-w-7xl mx-auto pb-20">
        {/* ── BREADCRUMB ── */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <Link href="/dashboard" className="hover:text-foreground">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-purple-400 font-semibold">Full-Stack AI Expert Challenges & Competitions</span>
        </div>

        {/* ── HERO BANNER: COMPETITIONS & PRIZES ── */}
        <Card className="relative overflow-hidden rounded-3xl border-purple-500/20 bg-gradient-to-br from-purple-950/70 via-card to-indigo-950/50 p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  Live Hackathons & Engineering Arenas
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  Full-Stack AI Mastery: Data Structures • Architecture • DB • Models • UI
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                Take on Expert Real-World AI Challenges
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Solve complex production engineering problems across <strong>Agriculture & Rural AI (10 Challenges)</strong>, <strong>FinTech Cyber Defense</strong>, <strong>Enterprise Search</strong>, and <strong>Healthcare Diagnostic Vision</strong>. Every challenge integrates all 5 full-stack technical pillars.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3">
              <div className="p-3.5 rounded-2xl bg-secondary/80 border border-border flex items-center gap-3">
                <Trophy className="w-6 h-6 text-amber-400 flex-shrink-0" />
                <div>
                  <div className="text-[11px] text-muted-foreground font-mono">Total Competition Prize Pool</div>
                  <div className="text-sm font-bold text-foreground font-mono">₹24,50,000 + Referrals</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>Next Evaluation Round: <strong>48h 12m</strong></span>
              </div>
            </div>
          </div>
        </Card>

        {/* ── CHALLENGE SELECTION & FILTER TOOLBAR ── */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span>Active Industry Arenas ({filteredChallenges.length} Challenges)</span>
              </h2>
              <p className="text-xs text-muted-foreground">Select an engineering challenge to inspect all 5 technical pillars.</p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search challenges, data structures, or DB..."
                  className="pl-8 bg-secondary border-border text-foreground text-xs h-8 w-52 sm:w-64 rounded-xl"
                />
              </div>

              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="bg-secondary border border-border text-foreground text-xs h-8 rounded-xl px-2.5 font-medium"
              >
                <option value="All">All Domains ({challenges.length})</option>
                <option value="Agriculture & Rural AI">🌾 Agriculture & Rural AI (10)</option>
                <option value="FinTech & Security">🛡️ FinTech & Security</option>
                <option value="Search & E-Commerce">⚡ Search & E-Commerce</option>
                <option value="Healthcare AI">🏥 Healthcare AI</option>
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-secondary border border-border text-foreground text-xs h-8 rounded-xl px-2.5 font-medium"
              >
                <option value="All">All Difficulties</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Hard">Hard</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>

          {/* Challenge Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {filteredChallenges.map((c) => {
              const isSelected = selectedChallenge.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedChallenge(c)}
                  className={`p-4 rounded-3xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'bg-purple-600/15 border-purple-500 shadow-lg shadow-purple-950/40'
                      : 'bg-card border-border hover:border-purple-500/40 hover:bg-secondary/40'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xl">{c.badgeAwarded.icon}</span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {c.difficulty}
                      </span>
                    </div>
                    <h3 className="font-bold text-xs text-foreground line-clamp-1">{c.title}</h3>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{c.summary}</p>
                  </div>

                  <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                    <span className="text-amber-300 font-semibold">{c.prizePool.split('+')[0]}</span>
                    <span>{c.activeParticipantsCount} Peers</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            THE 5 PILLARS WORKSPACE
           ══════════════════════════════════════════════════════════════════════ */}
        <div className="space-y-6">
          {/* Header & Active Badge info */}
          <div className="p-6 rounded-3xl bg-secondary/50 border border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedChallenge.badgeAwarded.icon}</span>
                <h2 className="text-xl font-extrabold text-foreground">{selectedChallenge.title}</h2>
              </div>
              <p className="text-xs text-muted-foreground max-w-2xl">{selectedChallenge.realWorldProblem}</p>
            </div>

            <div className="flex items-center gap-3 bg-card border border-border p-3 rounded-2xl flex-shrink-0">
              <Award className="w-8 h-8 text-amber-400" />
              <div>
                <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">Badge on Completion</div>
                <div className="text-xs font-bold text-foreground">{selectedChallenge.badgeAwarded.name}</div>
                <div className="text-[10px] text-purple-400 font-medium">{selectedChallenge.badgeAwarded.tier}</div>
              </div>
            </div>
          </div>

          {/* 5-Pillar Tabs Navigation */}
          <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto scrollbar-none">
            {[
              { id: 'ds', label: '1. Data Structures & Logic', icon: Code2 },
              { id: 'system', label: '2. System Design & BL/HLD', icon: Layers },
              { id: 'db', label: '3. Database & Query Tuning', icon: Database },
              { id: 'ai', label: '4. AI Model & Inference Pipeline', icon: Cpu },
              { id: 'frontend', label: '5. Front-End Simulator & Test Bench', icon: Sliders }
            ].map((tab) => {
              const isActive = activePillarTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActivePillarTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* ── PILLAR 1: DATA STRUCTURES & ALGORITHMS ── */}
          {activePillarTab === 'ds' && (
            <Card className="p-6 bg-card border-border rounded-3xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                <div>
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-purple-400" />
                    <span>Chosen Data Structure: {selectedChallenge.dataStructure.name}</span>
                  </h3>
                  <p className="text-xs text-muted-foreground">{selectedChallenge.dataStructure.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-xl text-[11px] font-mono bg-purple-500/15 text-purple-300 border border-purple-500/20 font-semibold">
                    Time: {selectedChallenge.dataStructure.timeComplexity}
                  </span>
                  <span className="px-2.5 py-1 rounded-xl text-[11px] font-mono bg-blue-500/15 text-blue-300 border border-blue-500/20 font-semibold">
                    Space: {selectedChallenge.dataStructure.spaceComplexity}
                  </span>
                </div>
              </div>

              {/* Rationale */}
              <div className="p-4 rounded-2xl bg-secondary/50 border border-border text-xs text-muted-foreground space-y-1">
                <span className="font-bold text-foreground flex items-center gap-1.5 text-purple-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  Why this Data Structure is Chosen for Production:
                </span>
                <p>{selectedChallenge.dataStructure.whyThisStructure}</p>
              </div>

              {/* Implementation Code */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-muted-foreground">Production Algorithm Implementation (Python)</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy(selectedChallenge.dataStructure.implementationCode, 'ds')}
                    className="text-xs h-7 gap-1 text-muted-foreground hover:text-foreground"
                  >
                    {copiedKey === 'ds' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'ds' ? 'Copied' : 'Copy Code'}</span>
                  </Button>
                </div>
                <pre className="p-4 rounded-2xl bg-zinc-950 text-purple-200 text-xs font-mono overflow-x-auto border border-purple-500/20 leading-relaxed">
                  {selectedChallenge.dataStructure.implementationCode}
                </pre>
              </div>
            </Card>
          )}

          {/* ── PILLAR 2: SYSTEM DESIGN & ARCHITECTURE ── */}
          {activePillarTab === 'system' && (
            <Card className="p-6 bg-card border-border rounded-3xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                <div>
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-400" />
                    <span>System Architecture: {selectedChallenge.systemDesign.architectureType}</span>
                  </h3>
                  <p className="text-xs text-muted-foreground">End-to-end event topology, SLA latency limits, and horizontal scale strategies.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-xl text-[11px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 font-semibold">
                    {selectedChallenge.systemDesign.latencyBudget}
                  </span>
                  <span className="px-2.5 py-1 rounded-xl text-[11px] font-mono bg-amber-500/15 text-amber-300 border border-amber-500/20 font-semibold">
                    {selectedChallenge.systemDesign.throughputTarget}
                  </span>
                </div>
              </div>

              {/* Dataflow Sequence */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">High-Level Dataflow Sequence (HLD)</h4>
                <div className="space-y-2">
                  {selectedChallenge.systemDesign.hldFlowDiagram.map((step, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-secondary/60 border border-border flex items-center gap-3 text-xs text-foreground font-mono">
                      <div className="w-6 h-6 rounded-full bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold flex-shrink-0">
                        {idx + 1}
                      </div>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scalability & Business Rules */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-secondary/40 border border-border space-y-2">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5 text-purple-400">
                    <GitBranch className="w-4 h-4" />
                    Scalability Strategy:
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {selectedChallenge.systemDesign.scalabilityStrategy}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-secondary/40 border border-border space-y-2">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5 text-indigo-400">
                    <Shield className="w-4 h-4" />
                    Business Logic (BL) Validation:
                  </span>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                    {selectedChallenge.systemDesign.businessLogicValidation.map((rule, idx) => (
                      <li key={idx}>{rule}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          )}

          {/* ── PILLAR 3: DATABASE SCHEMA & QUERY OPTIMIZATION ── */}
          {activePillarTab === 'db' && (
            <Card className="p-6 bg-card border-border rounded-3xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                <div>
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Database className="w-5 h-5 text-blue-400" />
                    <span>Database Engine: {selectedChallenge.database.dbType}</span>
                  </h3>
                  <p className="text-xs text-muted-foreground">Relational DDL, partitioning, vector indexing, and caching layers.</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCopy(selectedChallenge.database.schemaDDL, 'db')}
                  className="text-xs h-7 gap-1 text-muted-foreground hover:text-foreground"
                >
                  {copiedKey === 'db' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'db' ? 'Copied' : 'Copy DDL'}</span>
                </Button>
              </div>

              {/* SQL DDL */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-muted-foreground">Database Schema DDL</span>
                <pre className="p-4 rounded-2xl bg-zinc-950 text-blue-200 text-xs font-mono overflow-x-auto border border-blue-500/20 leading-relaxed">
                  {selectedChallenge.database.schemaDDL}
                </pre>
              </div>

              {/* Indexing & Caching Strategy */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-secondary/40 border border-border space-y-2">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5 text-blue-400">
                    <Zap className="w-4 h-4" />
                    Indexing Strategy:
                  </span>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                    {selectedChallenge.database.indexingStrategy.map((idxStr, idx) => (
                      <li key={idx}>{idxStr}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-secondary/40 border border-border space-y-2">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5 text-amber-400">
                    <Zap className="w-4 h-4" />
                    Caching Layer & Query Optimization:
                  </span>
                  <p className="text-xs text-muted-foreground">{selectedChallenge.database.cachingLayer}</p>
                  <p className="text-[11px] text-muted-foreground font-mono italic">
                    Tip: {selectedChallenge.database.queryOptimizationTip}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* ── PILLAR 4: AI MODEL & INFERENCE PIPELINE ── */}
          {activePillarTab === 'ai' && (
            <Card className="p-6 bg-card border-border rounded-3xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                <div>
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-purple-400" />
                    <span>AI Model Pipeline: {selectedChallenge.aiModel.modelArchitecture}</span>
                  </h3>
                  <p className="text-xs text-muted-foreground">Quantized neural networks, loss function derivation, and inference SLA benchmarks.</p>
                </div>
                <span className="px-3 py-1 rounded-xl text-xs font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                  {selectedChallenge.aiModel.accuracyOrLatencyMetrics}
                </span>
              </div>

              {/* Loss function */}
              <div className="p-4 rounded-2xl bg-secondary/50 border border-border space-y-1">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5 text-purple-400">
                  <Activity className="w-4 h-4" />
                  Mathematical Loss Function & Objective:
                </span>
                <p className="text-xs text-muted-foreground font-mono">{selectedChallenge.aiModel.lossFunction}</p>
              </div>

              {/* Inference Pipeline Code */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-muted-foreground">Inference Pipeline & Execution</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy(selectedChallenge.aiModel.samplePromptOrPipelineCode, 'ai')}
                    className="text-xs h-7 gap-1 text-muted-foreground hover:text-foreground"
                  >
                    {copiedKey === 'ai' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'ai' ? 'Copied' : 'Copy Pipeline'}</span>
                  </Button>
                </div>
                <pre className="p-4 rounded-2xl bg-zinc-950 text-emerald-200 text-xs font-mono overflow-x-auto border border-emerald-500/20 leading-relaxed">
                  {selectedChallenge.aiModel.samplePromptOrPipelineCode}
                </pre>
              </div>
            </Card>
          )}

          {/* ── PILLAR 5: FRONT-END PLAYGROUND & INTERACTIVE TEST BENCH ── */}
          {activePillarTab === 'frontend' && (
            <div className="space-y-6">
              {/* Interactive Functional UI Simulator */}
              <Card className="p-6 bg-card border-border rounded-3xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                  <div>
                    <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-pink-400" />
                      <span>Live Interactive Production Simulator</span>
                    </h3>
                    <p className="text-xs text-muted-foreground">Test the interactive user interface and simulation controls in real time.</p>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">Framework: {selectedChallenge.frontend.framework}</span>
                </div>

                {/* 1. AGRI: Crop Leaf Disease & Voice Advisory Simulator */}
                {selectedChallenge.frontend.interactiveDemoType === 'agri-crop-leaf' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-foreground">Select Farmer's Regional Voice Language:</span>
                        <div className="text-[11px] text-muted-foreground">Model outputs zero-latency offline audio in native phonemes.</div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {['kannada', 'hindi', 'telugu', 'tamil', 'english'].map((lang) => (
                          <button
                            key={lang}
                            onClick={() => setSelectedLang(lang as any)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize cursor-pointer transition-all ${
                              selectedLang === lang
                                ? 'bg-purple-600 text-white shadow-md'
                                : 'bg-secondary text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Leaf Scan Canvas */}
                      <div className="p-5 rounded-2xl bg-zinc-950 border border-emerald-500/30 flex flex-col justify-between space-y-4">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-emerald-400 flex items-center gap-1.5">
                            <Sprout className="w-4 h-4" />
                            [Viewfinder: Tomato Crop Leaf]
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-bold">
                            Early Blight (94.2%)
                          </span>
                        </div>
                        <div className="h-36 rounded-xl bg-gradient-to-br from-emerald-950/60 to-zinc-900 flex items-center justify-center border border-dashed border-emerald-500/40 relative">
                          <div className="p-2 rounded-lg bg-rose-950/80 border border-rose-500 text-[11px] text-rose-200 font-mono">
                            Target Box [x: 42, y: 88, w: 120, h: 95]
                          </div>
                        </div>
                        <Button
                          onClick={() => handlePlayVernacularAudio(selectedLang)}
                          disabled={isPlayingAudio}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 rounded-xl gap-2 cursor-pointer"
                        >
                          <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                          <span>{isPlayingAudio ? 'Playing Vernacular Audio...' : `Speak Remedy in ${selectedLang.toUpperCase()}`}</span>
                        </Button>
                      </div>

                      {/* Vernacular Audio Box */}
                      <div className="p-5 rounded-2xl bg-secondary/50 border border-border flex flex-col justify-between space-y-3">
                        <div className="space-y-2">
                          <span className="text-xs font-bold text-foreground">Localized Vernacular Remedy Audio Output:</span>
                          <div className="p-4 rounded-xl bg-card border border-border text-xs text-foreground font-mono leading-relaxed min-h-[90px]">
                            {audioFeedbackText || 'Click "Speak Remedy" to simulate zero-network offline voice synthesis.'}
                          </div>
                        </div>
                        <div className="text-[11px] text-muted-foreground font-mono flex items-center justify-between">
                          <span>Organic Spray: <strong>Trichoderma viride @ 5g/L</strong></span>
                          <span className="text-emerald-400 font-bold">✓ 100% Offline Ready</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. AGRI: Precision Drip Irrigation Grid */}
                {selectedChallenge.frontend.interactiveDemoType === 'agri-irrigation' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs font-bold text-foreground">6-Zone Plot Moisture Matrix (VWC %):</span>
                      <span className="text-xs font-mono text-muted-foreground">Optimal Band: 30% - 45%</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                      {irrigationMoisture.map((moist, idx) => {
                        const isDrought = moist < 25;
                        const isWatering = valveActiveZone === idx;
                        return (
                          <div
                            key={idx}
                            className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
                              isWatering
                                ? 'bg-blue-600/20 border-blue-500 shadow-md shadow-blue-900/30'
                                : isDrought
                                ? 'bg-rose-500/10 border-rose-500/30'
                                : 'bg-card border-border'
                            }`}
                          >
                            <div className="text-[11px] font-mono text-muted-foreground">Zone {idx + 1}</div>
                            <div className={`text-xl font-extrabold font-mono ${isDrought ? 'text-rose-400' : 'text-emerald-400'}`}>
                              {moist}%
                            </div>
                            <Button
                              size="sm"
                              onClick={() => {
                                setValveActiveZone(idx);
                                setTimeout(() => {
                                  setIrrigationMoisture((prev) => {
                                    const next = [...prev];
                                    next[idx] = Math.min(48, next[idx] + 12);
                                    return next;
                                  });
                                  setValveActiveZone(null);
                                }, 600);
                              }}
                              className="w-full bg-secondary hover:bg-secondary/80 text-foreground text-[10px] h-7 rounded-lg cursor-pointer"
                            >
                              <Droplets className="w-3 h-3 mr-1 text-blue-400" />
                              <span>{isWatering ? 'Dosing...' : 'Pulse Drip'}</span>
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. AGRI: Satellite Multispectral NDVI */}
                {selectedChallenge.frontend.interactiveDemoType === 'agri-satellite' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-foreground">Sentinel-2 Multispectral NDVI Band Math:</span>
                        <div className="text-[11px] text-muted-foreground">Simulate NDVI index: (NIR - Red) / (NIR + Red)</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-purple-300 font-bold">NDVI Score: {(ndviSliderVal / 100).toFixed(2)}</span>
                        <input
                          type="range"
                          min="10"
                          max="95"
                          value={ndviSliderVal}
                          onChange={(e) => setNdviSliderVal(+e.target.value)}
                          className="w-36 accent-purple-500 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-zinc-950 border border-border flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
                      <div>
                        <div className="text-muted-foreground text-[11px]">Crop Vigor Classification:</div>
                        <div className={`text-base font-bold ${ndviSliderVal > 60 ? 'text-emerald-400' : ndviSliderVal > 35 ? 'text-amber-400' : 'text-rose-400'}`}>
                          {ndviSliderVal > 60 ? '🌿 DENSE HEALTHY CANOPY' : ndviSliderVal > 35 ? '🌾 MODERATE STRESS' : '🏜️ SEVERE DROUGHT / WILTING'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-muted-foreground text-[11px]">Predicted Harvest Yield:</div>
                        <div className="text-base font-bold text-amber-300">{(ndviSliderVal * 0.042).toFixed(1)} Tons / Acre</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. AGRI: Pest Trap Simulator */}
                {selectedChallenge.frontend.interactiveDemoType === 'agri-pest' && (
                  <div className="space-y-4">
                    <div className="p-5 rounded-2xl bg-secondary/50 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1 font-mono text-xs">
                        <div className="font-bold text-foreground flex items-center gap-2">
                          <Bug className="w-4 h-4 text-rose-400" />
                          <span>Smart Pheromone Trap #TRP-88 (Maize Field)</span>
                        </div>
                        <div className="text-muted-foreground">Fall Armyworm Nightly Catch: <strong className="text-rose-400">14 Moths</strong> (ETL Threshold: 8)</div>
                      </div>
                      <Button
                        onClick={() => {
                          setDispensePheromoneState(true);
                          setTimeout(() => setDispensePheromoneState(false), 2000);
                        }}
                        className={`text-white text-xs font-bold h-9 px-4 rounded-xl cursor-pointer ${
                          dispensePheromoneState ? 'bg-emerald-600' : 'bg-rose-600 hover:bg-rose-700'
                        }`}
                      >
                        <Zap className="w-3.5 h-3.5 mr-1" />
                        <span>{dispensePheromoneState ? 'Biological Lure Dispensed!' : 'Dispense Biological Trichogramma'}</span>
                      </Button>
                    </div>
                  </div>
                )}

                {/* 5. AGRI: 3D Drone Flight Swarm */}
                {selectedChallenge.frontend.interactiveDemoType === 'agri-drone' && (
                  <div className="space-y-4">
                    <div className="p-5 rounded-2xl bg-zinc-950 border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
                      <div className="space-y-1">
                        <div className="text-purple-400 font-bold flex items-center gap-2">
                          <Plane className="w-4 h-4" />
                          <span>Autonomous 3D Drone Swarm Flight Telemetry</span>
                        </div>
                        <div className="text-muted-foreground">A* Voxel Grid: 34 FPS Weed Segmentation • Altitude: 2.5m</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold">
                          Chemical Saved: 72.4%
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. AGRI: Robotic Fruit Harvest */}
                {selectedChallenge.frontend.interactiveDemoType === 'agri-robot-harvest' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <span className="text-xs font-bold text-foreground">Adjust Fruit Ripeness (Brix Sugar Index):</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-purple-300 font-bold">Ripeness: {fruitRipenessSlider}%</span>
                        <input
                          type="range"
                          min="40"
                          max="100"
                          value={fruitRipenessSlider}
                          onChange={(e) => setFruitRipenessSlider(+e.target.value)}
                          className="w-36 accent-purple-500 cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between font-mono text-xs">
                      <span>Robotic Arm Grip Verdict:</span>
                      <span className={`font-bold ${fruitRipenessSlider >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {fruitRipenessSlider >= 80 ? '✅ HARVEST READY (Soft Grip 14 kPa)' : '⏳ UNRIPE - RETAIN ON BRANCH'}
                      </span>
                    </div>
                  </div>
                )}

                {/* 7. AGRI: Mandi Price Predictor */}
                {selectedChallenge.frontend.interactiveDemoType === 'agri-mandi-price' && (
                  <div className="space-y-4">
                    <div className="p-5 rounded-2xl bg-secondary/60 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-foreground">Lasalgaon Mandi: Red Onion Wholesale Trend</span>
                        <div className="text-muted-foreground">Current Price: ₹2,200 / Quintal • Forecast 7-Day: <strong>₹2,450 / Quintal</strong></div>
                      </div>
                      <span className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                        Recommendation: HOLD STOCK (+₹250 Gain)
                      </span>
                    </div>
                  </div>
                )}

                {/* 8. AGRI: Soil NPK Spectrometer */}
                {selectedChallenge.frontend.interactiveDemoType === 'agri-soil-npk' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono text-xs">
                      <div className="p-4 rounded-2xl bg-card border border-border text-center space-y-1">
                        <div className="text-muted-foreground text-[10px]">Nitrogen (N)</div>
                        <div className="text-lg font-bold text-emerald-400">{soilNitrogenVal} ppm</div>
                        <div className="text-[10px] text-muted-foreground">Optimal: 180-250</div>
                      </div>
                      <div className="p-4 rounded-2xl bg-card border border-border text-center space-y-1">
                        <div className="text-muted-foreground text-[10px]">Phosphorus (P)</div>
                        <div className="text-lg font-bold text-blue-400">24.5 ppm</div>
                        <div className="text-[10px] text-muted-foreground">Optimal: 20-30</div>
                      </div>
                      <div className="p-4 rounded-2xl bg-card border border-border text-center space-y-1">
                        <div className="text-muted-foreground text-[10px]">Potassium (K)</div>
                        <div className="text-lg font-bold text-amber-400">210 ppm</div>
                        <div className="text-[10px] text-muted-foreground">Optimal: 150-250</div>
                      </div>
                      <div className="p-4 rounded-2xl bg-card border border-border text-center space-y-1">
                        <div className="text-muted-foreground text-[10px]">Soil pH</div>
                        <div className="text-lg font-bold text-purple-400">6.8 (Neutral)</div>
                        <div className="text-[10px] text-emerald-400">Ideal Fertility</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 9. AGRI: Hydroponic Digital Twin */}
                {selectedChallenge.frontend.interactiveDemoType === 'agri-hydroponics' && (
                  <div className="space-y-4">
                    <div className="p-5 rounded-2xl bg-zinc-950 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
                      <div className="space-y-1">
                        <div className="text-emerald-400 font-bold flex items-center gap-2">
                          <Waves className="w-4 h-4" />
                          <span>Vertical Tower #14: Butterhead Lettuce</span>
                        </div>
                        <div className="text-muted-foreground">pH: 6.1 • EC: 1.4 mS/cm (Target: 1.8 mS/cm)</div>
                      </div>
                      <Button
                        onClick={() => {
                          setHydroDosingActive(true);
                          setTimeout(() => setHydroDosingActive(false), 1500);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold h-9 px-4 rounded-xl cursor-pointer"
                      >
                        <Droplets className="w-3.5 h-3.5 mr-1" />
                        <span>{hydroDosingActive ? 'Dosing 5.0 mL Solution...' : 'Trigger AI Dosing Pulse'}</span>
                      </Button>
                    </div>
                  </div>
                )}

                {/* 10. AGRI: Livestock Cattle Thermal Vision */}
                {selectedChallenge.frontend.interactiveDemoType === 'agri-cattle-vision' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <span className="text-xs font-bold text-foreground">Simulate Inner Eye Thermal Temperature (°C):</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-purple-300 font-bold">{cattleThermalSlider}°C</span>
                        <input
                          type="range"
                          min="38.0"
                          max="41.0"
                          step="0.1"
                          value={cattleThermalSlider}
                          onChange={(e) => setCattleThermalSlider(+e.target.value)}
                          className="w-36 accent-purple-500 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between font-mono text-xs">
                      <span>Cow #COW-402 (Gir Breed, 99.4% Biometric Match):</span>
                      <span className={`font-bold ${cattleThermalSlider >= 39.4 && cattleThermalSlider <= 40.0 ? 'text-amber-300' : cattleThermalSlider > 40.0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {cattleThermalSlider >= 39.4 && cattleThermalSlider <= 40.0 ? '🔥 ESTRUS BREEDING WINDOW (+0.9°C Spike) - Inseminate Today' : cattleThermalSlider > 40.0 ? '🚨 HIGH FEVER ALERT' : '✅ HEALTHY NORMAL'}
                      </span>
                    </div>
                  </div>
                )}

                {/* FinTech Fraud Interactive Simulator */}
                {selectedChallenge.frontend.interactiveDemoType === 'fraud-radar' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs font-bold text-foreground">Real-Time Streaming Transaction Stream</span>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSimulateTransaction(false)}
                          disabled={isSimulatingTx}
                          className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-8 rounded-xl cursor-pointer"
                        >
                          <Play className="w-3 h-3 mr-1" />
                          <span>Simulate Valid Card Swipe</span>
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSimulateTransaction(true)}
                          disabled={isSimulatingTx}
                          className="bg-rose-600 hover:bg-rose-700 text-white text-xs h-8 rounded-xl cursor-pointer"
                        >
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          <span>Inject Adversarial Attack</span>
                        </Button>
                      </div>
                    </div>

                    {/* Stream Table */}
                    <div className="overflow-x-auto rounded-2xl border border-border">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-secondary/70 text-muted-foreground font-mono text-[11px]">
                          <tr>
                            <th className="p-3">Tx ID</th>
                            <th className="p-3">Timestamp</th>
                            <th className="p-3">Sender</th>
                            <th className="p-3">Recipient</th>
                            <th className="p-3">Amount</th>
                            <th className="p-3">Risk Score</th>
                            <th className="p-3">Engine Verdict</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border font-mono">
                          {fraudTransactions.map((tx, idx) => (
                            <tr key={idx} className="hover:bg-secondary/30 transition-colors">
                              <td className="p-3 font-bold text-foreground">{tx.id}</td>
                              <td className="p-3 text-muted-foreground">{tx.time}</td>
                              <td className="p-3">{tx.sender}</td>
                              <td className="p-3">{tx.recipient}</td>
                              <td className="p-3 font-bold">₹{tx.amount.toLocaleString()}</td>
                              <td className="p-3">
                                <span
                                  className={`px-2 py-0.5 rounded-md font-bold ${
                                    tx.risk > 0.7
                                      ? 'bg-rose-500/20 text-rose-300'
                                      : tx.risk > 0.3
                                      ? 'bg-amber-500/20 text-amber-300'
                                      : 'bg-emerald-500/20 text-emerald-300'
                                  }`}
                                >
                                  {(tx.risk * 100).toFixed(0)}%
                                </span>
                              </td>
                              <td className="p-3">
                                <span
                                  className={`font-semibold ${
                                    tx.status.includes('BLOCKED') ? 'text-rose-400' : 'text-emerald-400'
                                  }`}
                                >
                                  {tx.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Hybrid Search Interactive Simulator */}
                {selectedChallenge.frontend.interactiveDemoType === 'vector-search' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-foreground">Query Input with Real-Time RRF Scoring:</label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={searchDemoQuery}
                          onChange={(e) => setSearchDemoQuery(e.target.value)}
                          className="bg-secondary border-border text-foreground text-xs h-9 rounded-xl font-mono"
                        />
                        <div className="flex items-center gap-1 bg-secondary p-1 rounded-xl border border-border">
                          {['hybrid', 'bm25', 'vector'].map((m) => (
                            <button
                              key={m}
                              onClick={() => setSearchFusionMode(m as any)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold uppercase cursor-pointer ${
                                searchFusionMode === m ? 'bg-purple-600 text-white' : 'text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Healthcare Triage Simulator */}
                {selectedChallenge.frontend.interactiveDemoType === 'health-triage' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-foreground">Grad-CAM Pathology Attention Heatmap Overlay:</div>
                        <div className="text-[11px] text-muted-foreground">Adjust heatmap transparency over raw chest radiograph.</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-muted-foreground">Heatmap Opacity: {gradCamOpacity}%</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={gradCamOpacity}
                          onChange={(e) => setGradCamOpacity(+e.target.value)}
                          className="w-32 accent-purple-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </Card>

              {/* Code Sandbox & Automated Test Runner */}
              <Card className="p-6 bg-card border-border rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-purple-400" />
                    <span>Challenge Code Solution & Test Benchmark Runner</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={handleRunTestBench}
                      disabled={isExecutingTests}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-8 px-4 rounded-xl shadow-md cursor-pointer gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>{isExecutingTests ? 'Executing Test Suite...' : 'Run Automated Test Bench'}</span>
                    </Button>
                  </div>
                </div>

                <textarea
                  rows={9}
                  value={codeEditorText}
                  onChange={(e) => setCodeEditorText(e.target.value)}
                  className="w-full p-4 bg-zinc-950 border border-purple-500/20 rounded-2xl text-xs text-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40 font-mono leading-relaxed"
                />

                {submissionResult && (
                  <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        {submissionResult.feedback}
                      </span>
                      <span className="font-mono">Score: {submissionResult.score}/100</span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] font-mono text-muted-foreground pt-1 border-t border-emerald-500/20">
                      <span>Execution Time: <strong>{submissionResult.executionTimeMs} ms</strong></span>
                      <span>Memory Footprint: <strong>{submissionResult.memoryUsedMb} MB</strong></span>
                      <span>Passed: <strong>{submissionResult.testCasesPassed}/{submissionResult.totalTestCases}</strong></span>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>

        {/* ── BADGE EARNED POPUP MODAL ── */}
        {showBadgeModal && submissionResult?.badgeEarned && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
            <Card className="max-w-md w-full p-6 bg-card border-purple-500/40 rounded-3xl space-y-6 shadow-2xl relative text-center">
              <div className="w-20 h-20 rounded-full bg-purple-600/20 border-2 border-purple-400 mx-auto flex items-center justify-center text-4xl shadow-lg shadow-purple-900/50">
                {submissionResult.badgeEarned.icon}
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Exclusive Verified Badge Unlocked
                </span>
                <h3 className="text-xl font-extrabold text-foreground">{submissionResult.badgeEarned.name}</h3>
                <p className="text-xs text-muted-foreground">
                  You solved all 5 architectural pillars under the required latency SLA.
                </p>
                <div className="text-[11px] font-mono text-purple-400 bg-secondary p-2 rounded-xl border border-border">
                  Credential ID: {submissionResult.badgeEarned.verificationId}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setShowBadgeModal(false)}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-10 rounded-xl cursor-pointer"
                >
                  View on My Profile
                </Button>
                <Button
                  onClick={() => setShowBadgeModal(false)}
                  variant="outline"
                  className="border-border text-foreground text-xs h-10 rounded-xl cursor-pointer"
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </NexusShell>
  );
}
