'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  Star,
  Clock,
  BookOpen,
  Play,
  CheckCircle2,
  Award,
  Download,
  FileText,
  Code,
  Globe,
  Calendar,
  Share2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Lock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  Check
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CourseItem, CourseSection } from '@/lib/mock-data/courses-data';
import { validateCoupon, CouponValidationResult, formatNumberToINR } from '@/services/coupon-service';

interface CourseDetailModalProps {
  course: CourseItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CourseDetailModal({ course, isOpen, onClose }: CourseDetailModalProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'sec-0': true,
    'sec-1': true,
  });
  const [enrolled, setEnrolled] = useState(false);
  const [activePreviewLecture, setActivePreviewLecture] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState<string>('');
  const [couponResult, setCouponResult] = useState<CouponValidationResult | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState<boolean>(false);

  if (!isOpen || !course) return null;

  const toggleSection = (secId: string) => {
    setExpandedSections((prev) => ({ ...prev, [secId]: !prev[secId] }));
  };

  const toggleAllSections = (expand: boolean) => {
    const next: Record<string, boolean> = {};
    course.curriculum?.forEach((sec, idx) => {
      next[sec.id || `sec-${idx}`] = expand;
    });
    setExpandedSections(next);
  };

  const curriculumList: CourseSection[] = course.curriculum || [
    {
      id: 'sec-1',
      sectionNumber: 1,
      title: 'Introduction & Core Foundations',
      totalTime: '2h 45m',
      lectures: [
        { id: 'lec-1-1', title: 'Course Welcome & Learning Path', duration: '08:15', type: 'video', isPreview: true },
        { id: 'lec-1-2', title: 'Architecture Overview & Core Concepts', duration: '14:30', type: 'video', isPreview: true },
        { id: 'lec-1-3', title: 'Mathematical Underpinnings & Notation', duration: '22:45', type: 'video' },
        { id: 'lec-1-4', title: 'Setting Up Your GPU Workspace & Dependencies', duration: '16:20', type: 'video' },
        { id: 'lec-1-5', title: 'Quiz 1: Foundations Checkpoint', duration: '15:00', type: 'quiz' },
      ]
    },
    {
      id: 'sec-2',
      sectionNumber: 2,
      title: 'Deep Technical Architecture & Implementation',
      totalTime: '4h 10m',
      lectures: [
        { id: 'lec-2-1', title: 'Model Architecture Deep Dive', duration: '28:10', type: 'video', isPreview: true },
        { id: 'lec-2-2', title: 'Loss Formulation & Gradient Descent Derivations', duration: '32:40', type: 'video' },
        { id: 'lec-2-3', title: 'Vectorized Operations in Pure Python/PyTorch', duration: '24:15', type: 'video' },
        { id: 'lec-2-4', title: 'Coding Lab: Building Your First Model from Scratch', duration: '45:00', type: 'coding_lab' },
      ]
    },
    {
      id: 'sec-3',
      sectionNumber: 3,
      title: 'Optimization, Evaluation & Performance Tuning',
      totalTime: '3h 30m',
      lectures: [
        { id: 'lec-3-1', title: 'Hyperparameter Tuning & Cross-Validation', duration: '24:30', type: 'video' },
        { id: 'lec-3-2', title: 'Avoiding Overfitting & Regularization Strategies', duration: '29:15', type: 'video' },
        { id: 'lec-3-3', title: 'Benchmarking Inference Latency & Memory Footprint', duration: '35:00', type: 'video' },
      ]
    },
    {
      id: 'sec-4',
      sectionNumber: 4,
      title: 'Production Deployment & Capstone Project',
      totalTime: '5h 15m',
      lectures: [
        { id: 'lec-4-1', title: 'FastAPI Microservice Packaging & Containerization', duration: '34:20', type: 'video' },
        { id: 'lec-4-2', title: 'Monitoring Model Drift & Prometheus Telemetry', duration: '28:10', type: 'video' },
        { id: 'lec-4-3', title: 'Capstone Project: End-to-End Enterprise Deployment', duration: '75:00', type: 'coding_lab' },
        { id: 'lec-4-4', title: 'Final Certification Exam & Peer Review', duration: '45:00', type: 'quiz' },
      ]
    }
  ];

  const totalSectionsCount = curriculumList.length;
  const totalLecturesCount = course.totalLectures || curriculumList.reduce((acc, s) => acc + s.lectures.length, 0);
  const totalHoursDisplay = course.totalHours || '18.5 total hours';

  const objectivesList = course.objectives || [
    `Master theoretical and applied foundations of ${course.title}`,
    'Understand step-by-step mathematical proofs and cost function calculus',
    'Build production-grade AI pipelines and neural models in Python & PyTorch',
    'Benchmark inference latency, GPU memory saturation, and model accuracy',
    'Deploy containerized microservices to cloud Kubernetes clusters',
    'Earn a verifiable ISO/IEC 17024 Certificate of Mastery'
  ];

  const expectedOutcomes = course.expectedOutcomes || [
    'Complete real-world portfolio project hosted on GitHub',
    'Production-grade codebase ready for production deployments',
    'Verifiable AI Nexus Industry Credential with Open Badges 3.0',
    'Interview-ready mastery for junior and senior AI engineering positions'
  ];

  const prerequisitesList = course.prerequisites || [
    'Basic Python programming familiarity (loops, functions, lists)',
    'High school level mathematics (algebra, basic calculus intuition)',
    'No prior AI/ML experience required — everything is taught from first principles'
  ];

  const includesData = course.includes || {
    hoursVideo: totalHoursDisplay,
    articles: 22,
    codingExercises: 16,
    downloadableResources: 28,
    certificate: true,
    lifetimeAccess: true
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl my-auto bg-card border border-border rounded-3xl shadow-2xl shadow-purple-950/40 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Top Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-secondary/80 hover:bg-secondary text-foreground hover:text-purple-400 border border-border transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto scrollbar-thin">
          
          {/* ── 1. UDEMY-STYLE HERO HEADER ── */}
          <div className="bg-gradient-to-r from-zinc-950 via-purple-950/60 to-zinc-950 border-b border-border p-6 sm:p-8 text-foreground">
            <div className="max-w-3xl space-y-4">
              
              {/* Category & Academic Tier Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold rounded-full">
                  {course.category}
                </span>
                {course.academicTier && (
                  <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold rounded-full flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{course.academicTier}</span>
                  </span>
                )}
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  course.level === 'Beginner' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                  course.level === 'Intermediate' ? 'bg-blue-500/15 text-blue-400 border-blue-500/30' :
                  'bg-rose-500/15 text-rose-400 border-rose-500/30'
                }`}>
                  {course.level} Level
                </span>
              </div>

              {/* Title & Description */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {course.title}
              </h1>
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                {course.description}
              </p>

              {/* Ratings, Students, & Instructor */}
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-zinc-300 pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-amber-400 text-base">{course.rating || 4.9}</span>
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-zinc-400">({course.ratingsCount || `${course.students} ratings`})</span>
                </div>

                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span className="font-semibold text-zinc-200">{course.students}</span> students
                </div>

                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6 border border-purple-500/40">
                    <AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
                    <AvatarFallback>{course.instructor.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span className="text-zinc-400">Created by <span className="font-semibold text-purple-300">{course.instructor.name}</span></span>
                </div>
              </div>

              {/* Metadata Badges (Updated date, language, subtitles) */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-2 border-t border-zinc-800/80">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Last updated {course.updatedAt}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-zinc-500" />
                  <span>English [Auto], Hindi, Kannada, Tamil</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">ISO 17024 Accredited Certificate</span>
                </div>
              </div>

            </div>
          </div>

          {/* ── 2. TWO-COLUMN MAIN CONTENT ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 sm:p-8">
            
            {/* LEFT COLUMN (2/3): Objectives, Curriculum, Outcomes, Requirements */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* OBJECTIVES: "What you'll learn" */}
              <div className="p-6 bg-secondary/40 border border-border rounded-2xl space-y-4">
                <div className="flex items-center gap-2 text-foreground font-bold text-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h2>What you'll learn (Core Objectives)</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
                  {objectivesList.map((obj, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground leading-snug">{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CURRICULUM SYLLABUS ACCORDION */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Course content</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {totalSectionsCount} sections • {totalLecturesCount} lectures • {totalHoursDisplay}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleAllSections(true)}
                      className="text-xs font-semibold text-purple-400 hover:text-purple-300 cursor-pointer"
                    >
                      Expand all
                    </button>
                    <span className="text-muted-foreground">•</span>
                    <button
                      onClick={() => toggleAllSections(false)}
                      className="text-xs font-semibold text-purple-400 hover:text-purple-300 cursor-pointer"
                    >
                      Collapse all
                    </button>
                  </div>
                </div>

                {/* Section Accordions */}
                <div className="space-y-3">
                  {curriculumList.map((sec, secIdx) => {
                    const secKey = sec.id || `sec-${secIdx}`;
                    const isExpanded = expandedSections[secKey] ?? false;

                    return (
                      <div key={secKey} className="border border-border rounded-2xl overflow-hidden bg-card transition-all">
                        
                        {/* Section Header Bar */}
                        <button
                          onClick={() => toggleSection(secKey)}
                          className="w-full flex items-center justify-between p-4 bg-secondary/30 hover:bg-secondary/60 text-left transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-purple-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            )}
                            <div>
                              <span className="text-xs font-bold text-purple-400 mr-2">Section {sec.sectionNumber}:</span>
                              <span className="text-sm font-bold text-foreground">{sec.title}</span>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground font-mono">
                            {sec.lectures.length} lectures • {sec.totalTime}
                          </span>
                        </button>

                        {/* Section Lectures List */}
                        {isExpanded && (
                          <div className="divide-y divide-border/60 bg-card/50">
                            {sec.lectures.map((lec) => (
                              <div
                                key={lec.id}
                                className="flex items-center justify-between px-5 py-3 hover:bg-secondary/20 transition-all text-xs"
                              >
                                <div className="flex items-center gap-3 truncate">
                                  {lec.type === 'quiz' ? (
                                    <FileText className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                                  ) : lec.type === 'coding_lab' ? (
                                    <Code className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                                  ) : (
                                    <Play className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                                  )}
                                  <span className="text-foreground font-medium truncate">{lec.title}</span>
                                </div>

                                <div className="flex items-center gap-3 flex-shrink-0 font-mono text-muted-foreground">
                                  {lec.isPreview && (
                                    <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-400 text-[10px] font-bold border border-purple-500/30">
                                      Preview
                                    </span>
                                  )}
                                  <span>{lec.duration}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* REQUIREMENTS */}
              <div className="space-y-3 pt-4 border-t border-border">
                <h3 className="text-base font-bold text-foreground">Requirements & Prerequisites</h3>
                <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground list-disc pl-5">
                  {prerequisitesList.map((req, idx) => (
                    <li key={idx} className="leading-relaxed">{req}</li>
                  ))}
                </ul>
              </div>

              {/* EXPECTED OUTCOMES & CAPSTONE PROJECTS */}
              <div className="space-y-3 pt-4 border-t border-border">
                <h3 className="text-base font-bold text-foreground">Expected Outcomes & Capstone Deliverables</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {expectedOutcomes.map((out, idx) => (
                    <div key={idx} className="p-3 bg-secondary/30 border border-border rounded-xl text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-foreground">
                        <Award className="w-4 h-4 text-purple-400" />
                        <span>Outcome {idx + 1}</span>
                      </div>
                      <p className="text-muted-foreground leading-snug">{out}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN (1/3): Udemy Sticky Purchase / Enrollment Card */}
            <div className="space-y-6">
              <Card className="p-6 bg-card border-purple-500/30 rounded-3xl shadow-xl shadow-purple-950/20 space-y-6 sticky top-6">
                
                {/* Video Preview Card Box */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900 border border-border flex items-center justify-center group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 ml-0.5 fill-white" />
                    </div>
                    <span className="text-xs font-bold text-white tracking-wider">Preview this course</span>
                  </div>
                </div>

                {/* Price Display with Live Coupon Application */}
                <div className="space-y-1.5">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-extrabold text-foreground">
                      {couponResult?.isValid ? formatNumberToINR(couponResult.finalPrice) : course.price}
                    </span>
                    {couponResult?.isValid ? (
                      <>
                        <span className="text-sm line-through text-muted-foreground">{course.price}</span>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-md">
                          {couponResult.formattedDiscount}
                        </span>
                      </>
                    ) : course.price !== 'Free' ? (
                      <>
                        <span className="text-sm line-through text-muted-foreground">₹7,999</span>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-md">
                          75% off
                        </span>
                      </>
                    ) : null}
                  </div>
                </div>

                {/* Promo / Coupon Code Box */}
                {course.price !== 'Free' && (
                  <div className="p-3.5 bg-secondary/40 border border-border rounded-2xl space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-foreground">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Have a Promo Code?
                      </span>
                      {couponResult?.isValid && (
                        <span className="text-emerald-400 text-[10px] font-mono font-bold">APPLIED</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value.toUpperCase());
                          if (couponResult) setCouponResult(null);
                        }}
                        placeholder="e.g. NEXUS50, SUPERAI"
                        className="flex-1 px-3 py-1.5 bg-card border border-border text-foreground text-xs rounded-xl focus:border-purple-500 focus:outline-none uppercase font-mono font-bold"
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          if (!couponCode.trim()) return;
                          setIsApplyingCoupon(true);
                          const result = validateCoupon(couponCode, course.price);
                          setCouponResult(result);
                          setIsApplyingCoupon(false);
                        }}
                        className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-3 py-1.5 h-8 rounded-xl cursor-pointer"
                      >
                        Apply
                      </Button>
                    </div>

                    {/* Feedback Messages */}
                    {couponResult && (
                      <div className={`text-[11px] font-medium p-2 rounded-xl border ${
                        couponResult.isValid
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      }`}>
                        {couponResult.isValid
                          ? `🎉 Coupon "${couponResult.coupon?.code}" applied! You saved ₹${couponResult.discountAmount.toLocaleString('en-IN')}.`
                          : couponResult.error}
                      </div>
                    )}

                    {/* Quick Popular Coupon Chips */}
                    {!couponResult?.isValid && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        <span className="text-[10px] text-muted-foreground">Try:</span>
                        {['NEXUS50', 'SUPERAI', 'VTU100'].map((code) => (
                          <button
                            key={code}
                            type="button"
                            onClick={() => {
                              setCouponCode(code);
                              const res = validateCoupon(code, course.price);
                              setCouponResult(res);
                            }}
                            className="px-2 py-0.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold rounded border border-purple-500/30 transition-all cursor-pointer"
                          >
                            {code}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Action CTA Buttons */}
                <div className="space-y-2.5">
                  <Link href="/learn/room-1" className="block w-full">
                    <Button
                      onClick={() => setEnrolled(true)}
                      className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-6 text-sm rounded-2xl shadow-lg shadow-purple-950/50 gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>
                        {couponResult?.isValid && couponResult.finalPrice === 0
                          ? 'Claim 100% Free Scholarship & Start'
                          : couponResult?.isValid
                          ? `Pay ${formatNumberToINR(couponResult.finalPrice)} & Get Certified`
                          : course.price === 'Free'
                          ? 'Enroll for Free & Start'
                          : `Buy for ${course.price} & Get Certified`}
                      </span>
                    </Button>
                  </Link>

                  <Link href="/learn/room-1" className="block w-full">
                    <Button
                      variant="outline"
                      className="w-full border-border hover:bg-secondary text-foreground text-xs py-5 rounded-2xl gap-2 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 text-purple-400" />
                      <span>Launch Interactive Studio</span>
                    </Button>
                  </Link>
                </div>

                <p className="text-[11px] text-center text-muted-foreground">
                  30-Day Money-Back Guarantee · Full Lifetime Access
                </p>

                {/* This Course Includes Checklist */}
                <div className="space-y-3 pt-4 border-t border-border">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">This course includes:</h4>
                  <ul className="space-y-2.5 text-xs text-muted-foreground">
                    <li className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-purple-400" />
                      <span>{includesData.hoursVideo}</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-purple-400" />
                      <span>{includesData.articles} downloadable technical articles</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Code className="w-4 h-4 text-purple-400" />
                      <span>{includesData.codingExercises} GPU coding lab exercises</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Download className="w-4 h-4 text-purple-400" />
                      <span>{includesData.downloadableResources} downloadable resources & checkpoints</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Globe className="w-4 h-4 text-purple-400" />
                      <span>Full lifetime access on Web & Mobile</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Award className="w-4 h-4 text-emerald-400" />
                      <span className="font-semibold text-emerald-400">ISO 17024 Certificate of Completion</span>
                    </li>
                  </ul>
                </div>

                {/* Verified Accreditation Badge */}
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-xs text-emerald-300">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="leading-tight">
                    Accredited by AI Nexus Professional Credentialing Council.
                  </span>
                </div>

              </Card>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
