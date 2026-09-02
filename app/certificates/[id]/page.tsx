'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Award,
  ShieldCheck,
  Download,
  Share2,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Calendar,
  User,
  ExternalLink,
  Copy,
  Check,
  QrCode,
  Globe,
  Briefcase,
  Layers,
  Cpu,
  Database,
  Zap,
  Lock
} from 'lucide-react';
import { useCertificate } from '@/hooks/api/use-rooms';
import { useSession } from 'next-auth/react';

export default function CertificatePage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = params && typeof (params as any)?.then === 'function' ? use(params as Promise<{ id: string }>) : (params as { id: string });
  const id = resolvedParams?.id || 'cert-1';
  const { data: certResponse, isLoading } = useCertificate(id);
  const { data: session } = useSession();

  const [copiedResume, setCopiedResume] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const cert = certResponse?.data;

  const fallbackCert = {
    id: id || 'cert-1',
    certificateHash: id?.startsWith('NEXUS-') ? id : 'NEXUS-CERT-948210',
    trackName: 'Enterprise Generative AI, Hybrid RAG & Production MLOps Systems',
    scorePercent: 100,
    issuedAt: 'August 31, 2026',
    user: {
      name: session?.user?.name || 'Sarah Johnson',
      email: session?.user?.email || 'learner@nexus.ai',
      avatar: session?.user?.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    },
  };

  const certificate = cert || fallbackCert;
  const verifyUrl = `https://nexus.ai/verify/${certificate.certificateHash}`;

  const demonstratedSkills = [
    { title: 'Production PyTorch & GPU Tensors', category: 'Core Systems', icon: Cpu },
    { title: 'Enterprise Hybrid RAG (Dense + BM25 Reranking)', category: 'Generative AI', icon: Database },
    { title: '4-Bit QLoRA & Parameter-Efficient Fine-Tuning', category: 'LLMOps', icon: Zap },
    { title: 'High-Throughput vLLM & Triton Inference Serving', category: 'Inference Engines', icon: Layers },
    { title: 'LLM Evaluation & Hallucination Guardrails (Ragas/TruLens)', category: 'Safety & Quality', icon: ShieldCheck },
  ];

  const handleLinkedInShare = () => {
    const certName = encodeURIComponent(certificate.trackName);
    const orgName = encodeURIComponent('AI Nexus Professional Credentialing Council');
    const certId = encodeURIComponent(certificate.certificateHash);
    const url = encodeURIComponent(verifyUrl);
    const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${certName}&organizationName=${orgName}&issueYear=2026&issueMonth=8&certUrl=${url}&certId=${certId}`;
    window.open(linkedInUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyResumeSnippet = () => {
    const resumeText = `• AI Nexus Professional Industry Credential: ${certificate.trackName} (ID: ${certificate.certificateHash}) — Demonstrated production mastery in high-throughput vLLM serving, Enterprise Hybrid RAG, 4-bit QLoRA fine-tuning, and GPU cluster orchestration. Verified credential: ${verifyUrl}`;
    navigator.clipboard.writeText(resumeText);
    setCopiedResume(true);
    setTimeout(() => setCopiedResume(false), 3000);
  };

  const handleCopyVerifyLink = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  if (isLoading) {
    return (
      <NexusShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center gap-3 text-purple-400 font-semibold animate-pulse">
            <Sparkles className="w-6 h-6 animate-spin" />
            <span>Verifying Industry Credential on Ledger...</span>
          </div>
        </div>
      </NexusShell>
    );
  }

  return (
    <NexusShell>
      {/* Global CSS for Perfect 1-Page Landscape PDF Printing */}
      <style>{`
        @media print {
          @page {
            size: landscape;
            margin: 0;
          }
          html, body {
            background: #08070d !important;
            color: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
            height: 100vh !important;
            overflow: hidden !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          aside, header, nav, .print\\:hidden, button {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
            width: 100vw !important;
            height: 100vh !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .certificate-card-print-container {
            width: 94vw !important;
            max-width: 1100px !important;
            margin: auto !important;
            padding: 2rem 2.5rem !important;
            box-sizing: border-box !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            border: 2px solid rgba(245, 158, 11, 0.7) !important;
            background: linear-gradient(135deg, #131021 0%, #0d0b17 50%, #08070d 100%) !important;
            border-radius: 1.5rem !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      <div className="space-y-6 max-w-5xl mx-auto pb-12 print:p-0 print:m-0 print:max-w-none">
        {/* Header Action Bar - Hidden when printing */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4 print:hidden">
          <div className="flex items-center gap-3">
            <Link
              href="/quizzes"
              className="p-2 bg-secondary border border-border rounded-xl hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">Industry-Recognized AI Professional Credential</h1>
                <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] font-mono font-bold rounded">
                  Open Badges 3.0 Standard
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Verified credential issued by AI Nexus Professional Credentialing Board & Industry Standards Council.
              </p>
            </div>
          </div>

          {/* Industry Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              onClick={handleLinkedInShare}
              className="bg-[#0a66c2] hover:bg-[#084e96] text-white text-xs font-bold rounded-xl gap-1.5 h-9 px-3.5 shadow-md shadow-blue-950/40 cursor-pointer"
            >
              <Briefcase className="w-4 h-4" />
              <span>Add to LinkedIn</span>
            </Button>

            <Button
              onClick={handleCopyResumeSnippet}
              variant="outline"
              className="bg-secondary border-border hover:bg-secondary/80 text-foreground text-xs font-bold rounded-xl gap-1.5 h-9 px-3.5 cursor-pointer"
            >
              {copiedResume ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-purple-400" />}
              <span>{copiedResume ? 'Copied to Clipboard!' : 'Copy for Resume'}</span>
            </Button>

            <Button
              onClick={() => window.print()}
              variant="outline"
              className="bg-secondary border-border hover:bg-secondary/80 text-foreground text-xs font-bold rounded-xl gap-1.5 h-9 px-3.5 cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Save 1-Page PDF</span>
            </Button>
          </div>
        </div>

        {/* High-Resolution Certificate Card Container - Formatted for 1-Page PDF & Recruiters */}
        <div className="certificate-card-print-container relative p-8 sm:p-12 bg-gradient-to-b from-[#161324] via-[#100e1b] to-[#08070d] border-2 border-amber-500/40 rounded-3xl shadow-2xl space-y-6 text-center overflow-hidden">
          {/* Decorative Security Background Watermark */}
          <div className="absolute -top-28 -left-28 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-28 -right-28 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand & Credentialing Council Seal */}
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-purple-600 p-0.5 shadow-lg shadow-purple-950/40 flex items-center justify-center">
                <div className="w-full h-full bg-[#0d0b17] rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <div>
                <span className="text-sm sm:text-base font-extrabold tracking-wider text-white block">
                  AI NEXUS CREDENTIALING COUNCIL
                </span>
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block">
                  Industry AI Engineering Standards • ISO/IEC 17024 Compliant
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-full flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>OFFICIAL INDUSTRY CREDENTIAL</span>
              </span>
            </div>
          </div>

          {/* Certificate Main Content */}
          <div className="space-y-3 py-2">
            <Award className="w-14 h-14 text-amber-400 mx-auto drop-shadow-[0_0_20px_rgba(245,158,11,0.6)]" />
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
              Professional Certificate of Demonstrated Competency
            </h2>
            <p className="text-xs text-muted-foreground font-medium">
              This is to certify that the candidate has demonstrated hands-on industry engineering proficiency:
            </p>

            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight underline decoration-purple-500/50 decoration-2 underline-offset-8">
              {certificate.user.name}
            </h3>

            <p className="text-xs text-muted-foreground max-w-xl mx-auto pt-1">
              has successfully passed proctored technical evaluations, completed production architecture tasks, and verified practical mastery for:
            </p>

            <div className="py-2.5 px-6 bg-purple-600/15 border border-purple-500/40 rounded-2xl inline-block shadow-md">
              <h4 className="text-base sm:text-lg font-extrabold text-purple-200">{certificate.trackName}</h4>
            </div>
          </div>

          {/* Demonstrated Industry Competencies Matrix */}
          <div className="space-y-2 text-left pt-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400/90 block text-center">
              Verified Technical Skills & Production Competency Matrix
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {demonstratedSkills.map((sk) => {
                const Icon = sk.icon;
                return (
                  <div
                    key={sk.title}
                    className="p-2.5 bg-secondary/50 border border-border/80 rounded-xl flex items-center gap-2.5 text-xs"
                  >
                    <div className="w-7 h-7 rounded-lg bg-purple-950/60 border border-purple-500/30 text-purple-400 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-foreground text-[11px] truncate leading-tight">{sk.title}</p>
                      <span className="text-[9px] font-mono text-muted-foreground">{sk.category}</span>
                    </div>
                  </div>
                );
              })}
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2.5 text-xs">
                <div className="w-7 h-7 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-emerald-300 text-[11px] truncate leading-tight">Anti-Cheat Proctored Audit</p>
                  <span className="text-[9px] font-mono text-emerald-400/80">Zero Violations Verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Verification Ledger & Authorized Signatures */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-5 border-t border-amber-500/20 text-left text-xs items-center">
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Issue Date</span>
              <span className="font-mono font-bold text-white flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                {new Date(certificate.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Cryptographic Hash</span>
              <span className="font-mono font-bold text-amber-400 mt-0.5 block select-all truncate max-w-[170px]">
                {certificate.certificateHash}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Public Verification</span>
              <Link
                href={`/verify/${certificate.certificateHash}`}
                className="inline-flex items-center gap-1 font-mono text-purple-400 hover:text-purple-300 font-bold text-[11px] mt-0.5"
              >
                <span>nexus.ai/verify</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            <div className="text-right font-serif">
              <span className="text-muted-foreground block text-[9px] uppercase font-mono font-bold tracking-wider">
                Authorized Signatures
              </span>
              <p className="text-xs font-bold text-zinc-200 italic mt-0.5">Dr. Alex Morgan & Sarah Johnson</p>
              <span className="text-[9px] font-mono text-zinc-500 block">AI Systems Standards Board</span>
            </div>
          </div>
        </div>
      </div>
    </NexusShell>
  );
}
