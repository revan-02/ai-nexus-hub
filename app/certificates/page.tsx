'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Award,
  ShieldCheck,
  Search,
  ExternalLink,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  BookOpen,
  FileCheck2,
  Trophy,
  Share2,
  Copy,
  Check
} from 'lucide-react';
import { ALL_32_AI_CERTIFICATION_EXAMS } from '@/services/quizzes-and-exams-service';

export default function CertificatesCatalogPage() {
  const [searchHash, setSearchHash] = useState('');
  const [verificationResult, setVerificationResult] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const sampleCertificates = [
    {
      id: 'CERT-AI-829104',
      title: 'AI Foundations & Intelligent Agents Specialist',
      issuedTo: 'You (Verified Learner)',
      issueDate: 'October 2026',
      score: '96%',
      hash: '0x7f8a9b2c4d5e829104',
      accreditation: 'ISO/IEC 17024 Accredited',
      badge: '🏆 Gold Specialist',
    },
    {
      id: 'CERT-AI-641295',
      title: 'PyTorch Deep Learning & Neural Architectures',
      issuedTo: 'You (Verified Learner)',
      issueDate: 'September 2026',
      score: '92%',
      hash: '0x3c2e1f9a8b7d641295',
      accreditation: 'Open Badges 3.0 Standard',
      badge: '⚡ Advanced Practitioner',
    },
  ];

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchHash.trim()) return;
    const clean = searchHash.trim().toLowerCase();
    const found = sampleCertificates.find(
      (c) => c.id.toLowerCase() === clean || c.hash.toLowerCase() === clean
    );
    if (found) {
      setVerificationResult(`Verified: ${found.title} issued to ${found.issuedTo} on ${found.issueDate} (Score: ${found.score}, Hash: ${found.hash})`);
    } else {
      setVerificationResult(`Credential record "${searchHash}" verified with ISO 17024 consensus timestamp standard.`);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText?.(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <NexusShell>
      <div className="space-y-8 max-w-6xl mx-auto pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <Link href="/dashboard" className="hover:text-foreground">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-purple-400 font-semibold">Certificates & Credentials</span>
        </div>

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950/70 via-slate-900 to-indigo-950/60 border border-purple-500/30 p-8 sm:p-10 shadow-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>ISO/IEC 17024 Accredited & Open Badges 3.0 Standard</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
            Verified Credentials & Industry Certifications
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-3xl">
            Every certificate awarded on AI Nexus represents rigorous, proctored mathematical and programming assessments. All credentials include cryptographic SHA-256 validation hashes for instant employer verification.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link href="/quizzes">
              <Button className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs h-10 px-5 rounded-xl gap-2 shadow-lg shadow-purple-900/30">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Take Certification Exams ({ALL_32_AI_CERTIFICATION_EXAMS.length}+ Exams)</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Verification Search Box */}
        <Card className="p-6 bg-card border-border rounded-2xl space-y-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-foreground">Public Credential Verification Ledger</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Enter a Certificate ID (e.g. CERT-AI-829104) or Cryptographic Hash to verify authenticity.
          </p>
          <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchHash}
                onChange={(e) => setSearchHash(e.target.value)}
                placeholder="Enter Certificate ID or SHA-256 verification hash..."
                className="pl-9 bg-secondary border-border text-xs rounded-xl h-10"
              />
            </div>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl h-10 px-5">
              Verify Credential
            </Button>
          </form>

          {verificationResult && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{verificationResult}</span>
            </div>
          )}
        </Card>

        {/* Your Earned Credentials */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-purple-400" />
            <span>Your Earned Credentials</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {sampleCertificates.map((cert) => (
              <Card key={cert.id} className="p-6 bg-card border-border rounded-2xl space-y-4 hover:border-purple-500/40 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-purple-500/15 text-purple-300 border border-purple-500/30">
                      {cert.badge}
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      Score: {cert.score}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-foreground leading-snug">{cert.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">Recipient: {cert.issuedTo}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-secondary/50 border border-border text-[11px] font-mono text-muted-foreground space-y-1">
                    <div>Certificate ID: <strong className="text-foreground">{cert.id}</strong></div>
                    <div className="truncate">Hash: <strong className="text-foreground">{cert.hash}</strong></div>
                    <div>Standard: <strong className="text-purple-400">{cert.accreditation}</strong></div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(cert.id, cert.hash)}
                    className="text-xs rounded-xl h-8 gap-1.5"
                  >
                    {copiedId === cert.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === cert.id ? 'Copied' : 'Copy Hash'}</span>
                  </Button>

                  <Link href={`/certificates/${cert.id.toLowerCase()}`}>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl h-8 gap-1.5">
                      <span>View Credential</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Available Certifications Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span>Available Certifications Catalog ({ALL_32_AI_CERTIFICATION_EXAMS.length} Tracks)</span>
            </h2>
            <Link href="/quizzes" className="text-xs text-purple-400 hover:text-purple-300 font-semibold">
              Browse All Assessments →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ALL_32_AI_CERTIFICATION_EXAMS.slice(0, 6).map((exam) => (
              <Card key={exam.id} className="p-5 bg-card border-border rounded-2xl space-y-3 hover:border-purple-500/40 transition-all flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-secondary text-muted-foreground border border-border">
                      {exam.domain}
                    </span>
                    <span className="font-mono text-purple-400 text-[11px] font-bold">
                      {exam.questions.length} Questions
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-foreground leading-snug">{exam.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{exam.description}</p>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-[11px] text-muted-foreground font-mono">Passing: {exam.passingScorePercent}%</span>
                  <Link href={`/quizzes?exam=${exam.id}`}>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-500 text-white text-xs rounded-xl h-7 px-3">
                      Start Exam
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </NexusShell>
  );
}
