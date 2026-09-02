'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { useNexus } from '@/context/nexus-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  User,
  Award,
  Flame,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Settings,
  BookOpen,
  ShoppingCart,
  Heart,
  GraduationCap,
  Sparkles,
  ArrowRight,
  PlayCircle,
  Trash2,
  ExternalLink,
  Share2,
  Download,
  Zap,
  Tag,
  Check,
  Copy,
  Star,
  Layers,
  ChevronRight,
  KeyRound,
  Lock,
  Shield,
  Laptop,
  Smartphone,
  Mail,
  Phone,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';

interface CartItem {
  id: string;
  title: string;
  category: string;
  level: string;
  price: number;
  originalPrice: number;
  rating: number;
  instructor: string;
  thumbnail: string;
  duration: string;
}

interface WishlistItem {
  id: string;
  title: string;
  category: string;
  level: string;
  price: number;
  rating: number;
  instructor: string;
  duration: string;
}

interface EnrolledCourse {
  id: string;
  title: string;
  category: string;
  level: string;
  progressPercent: number;
  currentLesson: string;
  totalLessons: number;
  completedLessons: number;
  lastAccessed: string;
  nextLessonHref: string;
}

interface CompletedCourse {
  id: string;
  title: string;
  category: string;
  completedDate: string;
  scorePercent: number;
  totalHours: number;
  certificateId: string;
}

interface CertificateItem {
  id: string;
  title: string;
  category: string;
  issuedDate: string;
  credentialId: string;
  skills: string[];
  verificationUrl: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_CART: CartItem[] = [
  {
    id: 'course-rag-arch',
    title: 'Enterprise RAG Systems: Vector DBs, Chunking & Re-ranking at Scale',
    category: 'Advanced LLMs & Agentic AI',
    level: 'Advanced',
    price: 3499,
    originalPrice: 5999,
    rating: 4.9,
    instructor: 'Dr. Sarah Chen (ex-DeepMind)',
    thumbnail: '🤖',
    duration: '18 hours • 34 Lessons',
  },
  {
    id: 'course-cuda-triton',
    title: 'CUDA & Triton Kernel Programming for High-Throughput LLM Inference',
    category: 'AI Infrastructure & GPU Stack',
    level: 'Expert',
    price: 4999,
    originalPrice: 8499,
    rating: 4.95,
    instructor: 'Alexei Ivanov (NVIDIA TensorRT Team)',
    thumbnail: '⚡',
    duration: '24 hours • 42 Lessons',
  },
];

const INITIAL_WISHLIST: WishlistItem[] = [
  {
    id: 'wish-mamba-ssm',
    title: 'Mamba & State Space Models (SSMs): Linear-Time Sequence Modeling',
    category: 'Next-Gen Architectures',
    level: 'Expert',
    price: 2999,
    rating: 4.88,
    instructor: 'Prof. Michael Zhang',
    duration: '12 hours • 20 Lessons',
  },
  {
    id: 'wish-fintech-gnn',
    title: 'Graph Neural Networks (GNNs) for Real-Time Cyber & Anti-Money Laundering',
    category: 'FinTech AI & Security',
    level: 'Advanced',
    price: 3299,
    rating: 4.92,
    instructor: 'Vikram Singhania',
    duration: '16 hours • 28 Lessons',
  },
  {
    id: 'wish-agri-edge',
    title: 'Edge AI & Multispectral Satellite Vision for Precision Agriculture',
    category: 'Applied Industrial AI',
    level: 'Intermediate',
    price: 2499,
    rating: 4.85,
    instructor: 'Dr. Ramesh Kulkarni',
    duration: '14 hours • 26 Lessons',
  },
  {
    id: 'wish-vtu-numerical',
    title: 'VTU Machine Learning & Deep Learning Solved Numerical Masterclass',
    category: 'University Curriculum',
    level: 'Intermediate',
    price: 1499,
    rating: 4.96,
    instructor: 'Prof. Ananya Rao',
    duration: '10 hours • 18 Lessons',
  },
];

const ENROLLED_COURSES: EnrolledCourse[] = [
  {
    id: 'enrolled-transformers',
    title: 'Deep Transformer Architectures & Multi-Head Attention Mechanisms',
    category: 'Deep Learning Core',
    level: 'Advanced',
    progressPercent: 74,
    currentLesson: 'Lesson 18: Rotary Positional Embeddings (RoPE) Mathematical Derivation',
    totalLessons: 24,
    completedLessons: 18,
    lastAccessed: '2 hours ago',
    nextLessonHref: '/learn/room-transformer-1',
  },
  {
    id: 'enrolled-math-ai',
    title: 'Mathematics for Machine Learning: Multivariate Calculus & Linear Algebra',
    category: 'Foundations',
    level: 'Intermediate',
    progressPercent: 90,
    currentLesson: 'Lesson 27: Hessian Matrices & Second-Order Taylor Optimization',
    totalLessons: 30,
    completedLessons: 27,
    lastAccessed: 'Yesterday',
    nextLessonHref: '/math-for-ai',
  },
  {
    id: 'enrolled-interview-prep',
    title: 'AI/ML Engineering Interview Prep: FAANG & Tier-1 System Design (0-4y)',
    category: 'Career & Placement',
    level: 'All Levels',
    progressPercent: 45,
    currentLesson: 'Topic 12: End-to-End Multimodal Recommendation System Design',
    totalLessons: 40,
    completedLessons: 18,
    lastAccessed: '3 days ago',
    nextLessonHref: '/interview-prep',
  },
];

const COMPLETED_COURSES: CompletedCourse[] = [
  {
    id: 'comp-1',
    title: 'Python for AI & Scientific Computing (NumPy, PyTorch & Vectorization)',
    category: 'Programming & Tensors',
    completedDate: 'Aug 14, 2026',
    scorePercent: 98,
    totalHours: 16,
    certificateId: 'CERT-PY-8821',
  },
  {
    id: 'comp-2',
    title: 'Classical Machine Learning: Gradient Descent, SVMs, Trees & Ensemble Methods',
    category: 'Classical ML',
    completedDate: 'Jul 28, 2026',
    scorePercent: 95,
    totalHours: 22,
    certificateId: 'CERT-ML-5412',
  },
  {
    id: 'comp-3',
    title: 'Convolutional Neural Networks & Computer Vision Pathology Inspection',
    category: 'Computer Vision',
    completedDate: 'Jun 19, 2026',
    scorePercent: 92,
    totalHours: 20,
    certificateId: 'CERT-CV-3109',
  },
  {
    id: 'comp-4',
    title: 'VTU 2022 Scheme Artificial Intelligence & Deep Learning Module Complete Suite',
    category: 'University Engineering',
    completedDate: 'May 04, 2026',
    scorePercent: 100,
    totalHours: 14,
    certificateId: 'CERT-VTU-9904',
  },
  {
    id: 'comp-5',
    title: 'Security, Cryptography & Anti-Adversarial AI Defense Lab',
    category: 'AI Security',
    completedDate: 'Apr 11, 2026',
    scorePercent: 96,
    totalHours: 12,
    certificateId: 'CERT-SEC-4120',
  },
];

const CERTIFICATES: CertificateItem[] = [
  {
    id: 'cert-1',
    title: 'Certified Full-Stack AI Engineer (Level 4: Expert Mastery)',
    category: 'ISO 17024 Accredited Credential',
    issuedDate: 'Aug 14, 2026',
    credentialId: 'NX-CERT-2026-EXP-088',
    skills: ['Transformers', 'PyTorch 2.4', 'CUDA Optimization', 'Vector DBs', 'RAG', 'GNNs'],
    verificationUrl: '/certificates/cert-1',
  },
  {
    id: 'cert-2',
    title: 'Deep Learning & Neural Network Architecture Specialist',
    category: 'Open Badges 3.0 Verified',
    issuedDate: 'Jul 28, 2026',
    credentialId: 'NX-CERT-2026-DL-419',
    skills: ['Backpropagation', 'CNNs', 'Attention', 'Loss Derivations', 'Hyperparameter Tuning'],
    verificationUrl: '/certificates/cert-1',
  },
  {
    id: 'cert-3',
    title: 'High-Impact Agriculture & Rural Edge AI Solutions Architect',
    category: 'Industry Competitions Award',
    issuedDate: 'Jun 19, 2026',
    credentialId: 'NX-CERT-2026-AGRI-102',
    skills: ['MobileNet ONNX', 'IoT Moisture Kalman Filter', 'Satellite NDVI', 'Offline Vernacular Voice'],
    verificationUrl: '/certificates/cert-1',
  },
  {
    id: 'cert-4',
    title: 'AI Security, Cryptographic Defense & Adversarial Robustness',
    category: 'Enterprise Cyber Defense',
    issuedDate: 'May 04, 2026',
    credentialId: 'NX-CERT-2026-SEC-773',
    skills: ['SHA-256 / AES-256', 'Adversarial Perturbation Defense', 'Graph Fraud Detection', 'Anti-Jailbreak'],
    verificationUrl: '/certificates/cert-1',
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────

function ProfileContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'learning';
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const { userLevel, levelMeta } = useNexus();

  const userName = session?.user?.name || 'Expert Learner';
  const userEmail = session?.user?.email || 'expert.learner@nexus.ai';
  const userRole = (session?.user as { role?: string })?.role || `${userLevel} Track`;
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'EL';

  // Profile Form State
  const [fullName, setFullName] = useState(userName);
  const [username, setUsername] = useState('expert.learner');
  const [email, setEmail] = useState(userEmail);
  const [phoneNumber, setPhoneNumber] = useState('+91 98765 43210');
  const [bio, setBio] = useState('Passionate about AI research, LLM architectures, and building intelligent agentic systems.');
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Security / Password Reset State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Sync with session when session loads
  useEffect(() => {
    if (session?.user?.name) setFullName(session.user.name);
    if (session?.user?.email) setEmail(session.user.email);
  }, [session]);

  // Cart & Wishlist state
  const [cart, setCart] = useState<CartItem[]>(INITIAL_CART);
  const [wishlist, setWishlist] = useState<WishlistItem[]>(INITIAL_WISHLIST);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const removeFromWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const moveToCart = (item: WishlistItem) => {
    removeFromWishlist(item.id);
    const newCartItem: CartItem = {
      id: item.id,
      title: item.title,
      category: item.category,
      level: item.level,
      price: item.price,
      originalPrice: item.price + 1500,
      rating: item.rating,
      instructor: item.instructor,
      thumbnail: '💡',
      duration: item.duration,
    };
    setCart((prev) => [newCartItem, ...prev]);
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price, 0);
  const discount = couponApplied ? Math.round(subtotal * 0.2) : 0;
  const total = subtotal - discount;

  const TABS = [
    { id: 'learning', label: 'My Learning', count: ENROLLED_COURSES.length, icon: BookOpen },
    { id: 'completed', label: 'Finished Courses', count: COMPLETED_COURSES.length, icon: CheckCircle2 },
    { id: 'certificates', label: 'Certificates', count: CERTIFICATES.length, icon: Award },
    { id: 'cart', label: 'Cart', count: cart.length, icon: ShoppingCart },
    { id: 'wishlist', label: 'Wishlist', count: wishlist.length, icon: Heart },
    { id: 'overview', label: 'My Profile', icon: User },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* ── BREADCRUMB ── */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
        <Link href="/dashboard" className="hover:text-foreground">
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-purple-400 font-semibold">Learner Hub & Credentials</span>
      </div>

      {/* ── PROFILE HEADER BANNER ── */}
      <Card className="p-6 sm:p-8 bg-card border-border rounded-3xl relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-600 to-purple-700 text-white font-bold text-2xl flex items-center justify-center shadow-lg shadow-purple-900/40 flex-shrink-0">
              {userInitials}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-foreground">{userName}</h1>
                <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold rounded-lg capitalize">
                  {userRole}
                </span>
                <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold rounded-lg flex items-center gap-1 font-mono">
                  <Flame className="w-3.5 h-3.5" /> {levelMeta.streakDays} Day Streak
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-mono">{userEmail} • Active Account</p>
              <p className="text-xs text-muted-foreground max-w-xl">
                Mastering full-stack AI engineering, neural architectures, distributed GPU systems, and real-world applied challenges.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <Link
              href="/settings"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary border border-border hover:bg-secondary/80 text-foreground text-xs font-semibold rounded-xl transition-all"
            >
              <Settings className="w-3.5 h-3.5" /> Account Settings
            </Link>
          </div>
        </div>

        {/* Metric Counter Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center border-t border-border mt-6 pt-6">
          <div className="p-3.5 bg-secondary/50 rounded-2xl border border-border">
            <span className="text-xl font-extrabold font-mono text-emerald-400 block">{ENROLLED_COURSES.length} Active</span>
            <span className="text-[11px] text-muted-foreground font-semibold">Enrolled In Progress</span>
          </div>
          <div className="p-3.5 bg-secondary/50 rounded-2xl border border-border">
            <span className="text-xl font-extrabold font-mono text-purple-400 block">{COMPLETED_COURSES.length} Courses</span>
            <span className="text-[11px] text-muted-foreground font-semibold">Finished (100%)</span>
          </div>
          <div className="p-3.5 bg-secondary/50 rounded-2xl border border-border">
            <span className="text-xl font-extrabold font-mono text-amber-400 block">{CERTIFICATES.length} Verified</span>
            <span className="text-[11px] text-muted-foreground font-semibold">ISO & OpenBadges</span>
          </div>
          <div className="p-3.5 bg-secondary/50 rounded-2xl border border-border">
            <span className="text-xl font-extrabold font-mono text-blue-400 block">5,840 XP</span>
            <span className="text-[11px] text-muted-foreground font-semibold">Total Platform XP</span>
          </div>
        </div>
      </Card>

      {/* ── NAVIGATION TABS ── */}
      <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto scrollbar-none">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                    isActive ? 'bg-white/20 text-white font-bold' : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── TAB 1: MY LEARNING (IN-PROGRESS COURSES) ── */}
      {activeTab === 'learning' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Active Learning & Enrolled Courses ({ENROLLED_COURSES.length})</span>
              </h2>
              <p className="text-xs text-muted-foreground">Pick up right where you left off with zero loss in progress.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ENROLLED_COURSES.map((course) => (
              <Card
                key={course.id}
                className="p-5 bg-card border-border rounded-3xl flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition-all shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-secondary text-purple-300 rounded-md border border-border">
                      {course.category}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">{course.lastAccessed}</span>
                  </div>

                  <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-2">{course.title}</h3>

                  <p className="text-xs text-muted-foreground line-clamp-2 pt-1 font-medium">
                    {course.currentLesson}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-border/60">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-bold text-emerald-400">{course.progressPercent}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-emerald-400 transition-all duration-500"
                        style={{ width: `${course.progressPercent}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono text-right">
                      {course.completedLessons}/{course.totalLessons} Lessons Done
                    </div>
                  </div>

                  <Link href={course.nextLessonHref}>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-9 rounded-xl gap-1.5 cursor-pointer shadow-md">
                      <PlayCircle className="w-4 h-4" />
                      <span>Resume Lesson</span>
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 2: FINISHED COURSES ── */}
      {activeTab === 'completed' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>Finished Courses & Completion Records ({COMPLETED_COURSES.length})</span>
              </h2>
              <p className="text-xs text-muted-foreground">All completed courses with verified test scores and downloadable certificates.</p>
            </div>
          </div>

          <div className="space-y-3">
            {COMPLETED_COURSES.map((course) => (
              <Card
                key={course.id}
                className="p-5 bg-card border-border rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-secondary/20 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-extrabold text-foreground">{course.title}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      100% Completed
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
                    <span>Category: <strong>{course.category}</strong></span>
                    <span>Completed on: <strong>{course.completedDate}</strong></span>
                    <span>Final Score: <strong className="text-emerald-400">{course.scorePercent}%</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href="/certificates/cert-1">
                    <Button
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-9 rounded-xl gap-1.5 cursor-pointer shadow-md"
                    >
                      <Award className="w-4 h-4" />
                      <span>View Certificate</span>
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: CERTIFICATES & CREDENTIALS ── */}
      {activeTab === 'certificates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Verified Certificates & Cryptographic Badges ({CERTIFICATES.length})</span>
              </h2>
              <p className="text-xs text-muted-foreground">Tamper-evident ISO 17024 and Open Badges 3.0 digital credentials with public verification links.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CERTIFICATES.map((cert) => (
              <Card
                key={cert.id}
                className="p-6 bg-gradient-to-br from-card via-secondary/40 to-card border-border rounded-3xl space-y-4 shadow-lg relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-md">
                      {cert.category}
                    </span>
                    <h3 className="text-base font-bold text-foreground">{cert.title}</h3>
                    <p className="text-xs text-muted-foreground font-mono">Issued: {cert.issuedDate}</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-2xl flex-shrink-0">
                    🏆
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-muted-foreground">Verified Skills:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {cert.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-secondary text-foreground border border-border"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-zinc-950 border border-border text-[11px] font-mono flex items-center justify-between text-muted-foreground">
                  <span>ID: <strong className="text-purple-300">{cert.credentialId}</strong></span>
                  <button
                    onClick={() => handleCopy(cert.credentialId, cert.id)}
                    className="hover:text-foreground cursor-pointer flex items-center gap-1"
                  >
                    {copiedKey === cert.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === cert.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <Link href={cert.verificationUrl} className="flex-1">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-9 rounded-xl gap-1.5 cursor-pointer">
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Verify & Download PDF</span>
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => handleCopy(`https://ainexus.platform.io/verify/${cert.credentialId}`, `share-${cert.id}`)}
                    className="border-border text-xs h-9 rounded-xl cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 mr-1" />
                    <span>{copiedKey === `share-${cert.id}` ? 'Link Copied!' : 'Share'}</span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 4: SHOPPING CART ── */}
      {activeTab === 'cart' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-blue-400" />
                <span>My Shopping Cart ({cart.length} Courses)</span>
              </h2>
              <p className="text-xs text-muted-foreground">Review your chosen courses and apply promo codes for instant discounts.</p>
            </div>
          </div>

          {cart.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cart Items List */}
              <div className="lg:col-span-2 space-y-3">
                {cart.map((item) => (
                  <Card
                    key={item.id}
                    className="p-5 bg-card border-border rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-2xl flex-shrink-0">
                        {item.thumbnail}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-secondary text-purple-300 rounded-md border border-border">
                            {item.level}
                          </span>
                          <span className="text-xs text-amber-400 font-bold flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-400" /> {item.rating}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-foreground leading-snug">{item.title}</h3>
                        <p className="text-xs text-muted-foreground">Instructor: {item.instructor} • {item.duration}</p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                      <div className="text-right font-mono">
                        <div className="text-base font-extrabold text-foreground">₹{item.price.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground line-through">₹{item.originalPrice.toLocaleString()}</div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFromCart(item.id)}
                        className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-xs h-7 gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Order Summary Checkout Card */}
              <Card className="p-6 bg-card border-border rounded-3xl space-y-6 h-fit shadow-xl">
                <h3 className="text-base font-bold text-foreground">Order Summary</h3>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Original Subtotal:</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  {couponApplied && (
                    <div className="flex items-center justify-between text-emerald-400 font-bold">
                      <span>Promo Discount (20% OFF):</span>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm font-bold text-foreground border-t border-border pt-3">
                    <span>Total Amount:</span>
                    <span className="text-lg text-purple-400 font-extrabold">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Coupon Code Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-purple-400" />
                    <span>Have a Promo Code?</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Try 'NEXUS20'"
                      className="bg-secondary border-border text-foreground text-xs h-9 rounded-xl font-mono uppercase"
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        if (couponCode.toUpperCase() === 'NEXUS20') {
                          setCouponApplied(true);
                        } else {
                          alert('Invalid coupon. Try coupon code "NEXUS20" for 20% discount.');
                        }
                      }}
                      className="bg-secondary hover:bg-secondary/80 text-foreground text-xs font-bold h-9 px-3 rounded-xl border border-border"
                    >
                      Apply
                    </Button>
                  </div>
                  {couponApplied && (
                    <p className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                      <Check className="w-3 h-3" /> Coupon NEXUS20 applied successfully!
                    </p>
                  )}
                </div>

                <Button
                  onClick={() => alert(`Simulated Payment Gateway: Order of ₹${total.toLocaleString()} completed successfully!`)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm h-11 rounded-2xl shadow-lg shadow-purple-950/40 gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Proceed to Checkout</span>
                </Button>
              </Card>
            </div>
          ) : (
            <Card className="p-12 bg-card border-border rounded-3xl text-center space-y-4">
              <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">Your Cart is Empty</h3>
                <p className="text-xs text-muted-foreground">Explore our real-world challenges, VTU papers, and AI engineering courses.</p>
              </div>
              <Link href="/challenges">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-10 px-6 rounded-xl cursor-pointer">
                  Explore AI Courses & Challenges
                </Button>
              </Link>
            </Card>
          )}
        </div>
      )}

      {/* ── TAB 5: WISHLIST ── */}
      {activeTab === 'wishlist' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>My Saved Wishlist ({wishlist.length} Courses)</span>
              </h2>
              <p className="text-xs text-muted-foreground">Courses and specializations you have bookmarked to learn next.</p>
            </div>
          </div>

          {wishlist.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wishlist.map((item) => (
                <Card
                  key={item.id}
                  className="p-5 bg-card border-border rounded-3xl flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition-all shadow-md"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-secondary text-purple-300 rounded-md border border-border">
                        {item.category}
                      </span>
                      <span className="text-xs text-amber-400 font-bold flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400" /> {item.rating}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-foreground leading-snug">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">Instructor: {item.instructor} • {item.duration}</p>
                    <div className="text-sm font-extrabold text-foreground font-mono pt-1">
                      ₹{item.price.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-border">
                    <Button
                      onClick={() => moveToCart(item)}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-9 rounded-xl gap-1.5 cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Move to Cart</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFromWishlist(item.id)}
                      className="text-muted-foreground hover:text-rose-400 text-xs h-9 px-3 rounded-xl cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 bg-card border-border rounded-3xl text-center space-y-4">
              <Heart className="w-12 h-12 text-muted-foreground mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">Your Wishlist is Empty</h3>
                <p className="text-xs text-muted-foreground">Bookmark topics, algorithms, or papers to save them for later.</p>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* ── TAB 6: OVERVIEW / PROFILE & SECURITY MANAGEMENT ── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Profile Information Form */}
            <Card className="lg:col-span-2 p-6 sm:p-8 bg-card border-border rounded-3xl space-y-6 shadow-md">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-400" />
                  <span>Personal Profile Information</span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  Update your public name, engineering handle, email, contact number, and professional bio.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Full Name</label>
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      className="bg-secondary border-border text-foreground text-xs h-10 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Username / Handle</label>
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="your_handle"
                      className="bg-secondary border-border text-foreground text-xs h-10 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-purple-400" />
                      <span>Email Address</span>
                    </label>
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@nexus.ai"
                      className="bg-secondary border-border text-foreground text-xs h-10 rounded-xl font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-purple-400" />
                      <span>Phone Number</span>
                    </label>
                    <Input
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="bg-secondary border-border text-foreground text-xs h-10 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Professional Bio & Headline</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell the community about your AI research interests, background, and tech stack..."
                    className="w-full p-3 bg-secondary border border-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/40 leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Button
                    onClick={() => {
                      setProfileSaveSuccess(true);
                      setTimeout(() => setProfileSaveSuccess(false), 3000);
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-10 px-6 rounded-xl gap-2 cursor-pointer shadow-md"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </Button>

                  {profileSaveSuccess && (
                    <span className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4" /> Profile updated successfully!
                    </span>
                  )}
                </div>
              </div>
            </Card>

            {/* Right Col: Password Reset & Security */}
            <div className="space-y-6">
              {/* Change Password Card */}
              <Card className="p-6 bg-card border-border rounded-3xl space-y-4 shadow-md">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-amber-400" />
                    <span>Change Password</span>
                  </h3>
                  <p className="text-xs text-muted-foreground">Update your account login credentials.</p>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-muted-foreground">Current Password</label>
                    <Input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="bg-secondary border-border text-foreground text-xs h-9 rounded-xl font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-muted-foreground">New Password</label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="bg-secondary border-border text-foreground text-xs h-9 rounded-xl font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-muted-foreground">Confirm New Password</label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="bg-secondary border-border text-foreground text-xs h-9 rounded-xl font-mono"
                    />
                  </div>

                  {passwordError && (
                    <p className="text-[11px] text-rose-400 font-mono">{passwordError}</p>
                  )}
                  {passwordSuccess && (
                    <p className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Password changed successfully!
                    </p>
                  )}

                  <Button
                    size="sm"
                    onClick={() => {
                      if (!currentPassword) {
                        setPasswordError('Please enter your current password.');
                        return;
                      }
                      if (newPassword.length < 6) {
                        setPasswordError('New password must be at least 6 characters.');
                        return;
                      }
                      if (newPassword !== confirmPassword) {
                        setPasswordError('New passwords do not match.');
                        return;
                      }
                      setPasswordError(null);
                      setPasswordSuccess(true);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                      setTimeout(() => setPasswordSuccess(false), 3000);
                    }}
                    className="w-full bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs h-9 rounded-xl border border-border cursor-pointer mt-1"
                  >
                    <Lock className="w-3.5 h-3.5 mr-1 text-amber-400" />
                    <span>Update Password</span>
                  </Button>
                </div>
              </Card>

              {/* Two-Factor Authentication Card */}
              <Card className="p-6 bg-card border-border rounded-3xl space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>2-Factor Authentication</span>
                    </h4>
                    <p className="text-[11px] text-muted-foreground">Extra security layer on login.</p>
                  </div>

                  <button
                    onClick={() => setTwoFactorEnabled((prev) => !prev)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      twoFactorEnabled ? 'bg-purple-600' : 'bg-secondary'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                        twoFactorEnabled ? 'left-6' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="text-[11px] font-mono text-muted-foreground flex items-center justify-between pt-1 border-t border-border/50">
                  <span>Status:</span>
                  <span className={`font-bold ${twoFactorEnabled ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                    {twoFactorEnabled ? '✓ Enabled (Authenticator App)' : 'Disabled'}
                  </span>
                </div>
              </Card>

              {/* Active Sessions */}
              <Card className="p-6 bg-card border-border rounded-3xl space-y-2.5 shadow-md">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Laptop className="w-4 h-4 text-purple-400" />
                  <span>Active Session</span>
                </span>
                <div className="p-3 bg-secondary/50 rounded-2xl border border-border text-xs space-y-1 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground font-bold">Chrome on macOS</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300">
                      Current
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Bengaluru, India • IP: 192.168.1.1</p>
                </div>
              </Card>
            </div>
          </div>

          {/* Full Width Card: Verified Skills & Engineering Competencies */}
          <Card className="p-6 sm:p-8 bg-card border-border rounded-3xl space-y-4 shadow-md">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-400" />
              <span>Verified Skills & Engineering Competencies</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Skills validated through automated benchmark evaluations and challenge test suites.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3.5 bg-secondary/50 rounded-2xl border border-border space-y-1">
                <span className="text-muted-foreground text-[10px] block">Model Training</span>
                <span className="font-bold text-purple-400">Transformers / LoRA</span>
              </div>
              <div className="p-3.5 bg-secondary/50 rounded-2xl border border-border space-y-1">
                <span className="text-muted-foreground text-[10px] block">Inference Kernels</span>
                <span className="font-bold text-emerald-400">Triton / CUDA</span>
              </div>
              <div className="p-3.5 bg-secondary/50 rounded-2xl border border-border space-y-1">
                <span className="text-muted-foreground text-[10px] block">Retrieval & RAG</span>
                <span className="font-bold text-blue-400">HNSW / Qdrant</span>
              </div>
              <div className="p-3.5 bg-secondary/50 rounded-2xl border border-border space-y-1">
                <span className="text-muted-foreground text-[10px] block">Cyber AI</span>
                <span className="font-bold text-amber-400">GNN Defense</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <NexusShell>
      <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading learner hub...</div>}>
        <ProfileContent />
      </Suspense>
    </NexusShell>
  );
}
