'use client';

import React from 'react';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { Card } from '@/components/ui/card';
import {
  Shield,
  Lock,
  Eye,
  Server,
  FileText,
  Building2,
  CheckCircle2,
  Cpu,
  RefreshCw,
  Mail,
  ChevronRight,
  Globe
} from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <NexusShell>
      <div className="space-y-8 max-w-5xl mx-auto py-2">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-purple-400 font-semibold">Privacy Policy</span>
        </div>

        {/* Hero Header Banner */}
        <div className="bg-gradient-to-r from-purple-950/70 via-indigo-950/50 to-slate-900 border border-purple-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/30 text-purple-300 border border-purple-500/40 flex items-center justify-center shadow-lg">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-[11px] font-semibold mb-1">
                <span>Enterprise Data Privacy & Security Standard</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Privacy Policy
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-3xl">
            This Privacy Policy outlines how AI Nexus Platform collects, utilizes, encrypts, and protects your personal, telemetry, and examination data. The platform is operated, managed, and maintained by <strong className="text-foreground">AalgoLabs (OPC) PVT.LTD.</strong>
          </p>
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-zinc-400 pt-2 border-t border-purple-500/20">
            <span>Effective Date: <strong>January 1, 2026</strong></span>
            <span>•</span>
            <span>Last Updated: <strong>September 2, 2026</strong></span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> ISO 27001 & Open Badges 3.0 Aligned
            </span>
          </div>
        </div>

        {/* Managed & Maintained Callout */}
        <Card className="p-5 bg-secondary/60 border-purple-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Building2 className="w-6 h-6 text-purple-400 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-foreground block">Data Controller & Operating Entity</span>
              <span className="text-zinc-300">Managed and Maintained by <strong>AalgoLabs (OPC) PVT.LTD.</strong></span>
            </div>
          </div>
          <a
            href="mailto:privacy@aalgolabs.com"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all inline-flex items-center gap-2 shrink-0"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact Privacy Office</span>
          </a>
        </Card>

        {/* Privacy Sections */}
        <div className="space-y-6 text-xs sm:text-sm text-zinc-300 leading-relaxed">
          {/* Section 1 */}
          <Card className="p-6 bg-card border-border rounded-2xl space-y-3">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-600/20 text-purple-300 text-xs font-mono font-bold flex items-center justify-center">1</span>
              <span>Information We Collect</span>
            </h2>
            <p>
              When you register, engage with AI courses, attempt VTU exam assessments, or apply for developer roles, we collect:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
              <li><strong>Personal Identifiers:</strong> Name, verified email address, phone number (for OTP authentication and invoice receipts), and university/company affiliation.</li>
              <li><strong>Assessment & Skill Telemetry:</strong> Code submissions, quiz responses, exam completion timestamps, proctored anti-cheat telemetry (tab-focus status, keystroke rates), and ISO 17024 certificates.</li>
              <li><strong>Transaction & Invoicing Data:</strong> Purchase histories, coupon codes redeemed, GST identification (if provided), and tax invoices generated. We do not store raw credit card numbers.</li>
            </ul>
          </Card>

          {/* Section 2 */}
          <Card className="p-6 bg-card border-border rounded-2xl space-y-3">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-600/20 text-purple-300 text-xs font-mono font-bold flex items-center justify-center">2</span>
              <span>Zero-Data Retention for Local AI & Sandbox Inference</span>
            </h2>
            <p>
              We believe in student privacy and ethical AI computing:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
              <li><strong>Local Ollama Studio:</strong> When using on-device models via the Ollama playground, all inference occurs 100% on your local hardware. No prompt or response leaves your browser.</li>
              <li><strong>Cloud AI Multi-Model Inference:</strong> Code and prompts submitted to cloud LLMs (GPT-4o, Claude 3.5 Sonnet, DeepSeek-R1) are routed through enterprise zero-data-retention APIs and are never used for public model retraining.</li>
            </ul>
          </Card>

          {/* Section 3 */}
          <Card className="p-6 bg-card border-border rounded-2xl space-y-3">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-600/20 text-purple-300 text-xs font-mono font-bold flex items-center justify-center">3</span>
              <span>How We Protect and Encrypt Your Data</span>
            </h2>
            <p>
              <strong>AalgoLabs (OPC) PVT.LTD.</strong> implements rigorous cryptographic security controls across all microservices:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
              <li><strong>Encryption at Rest & in Transit:</strong> All data is encrypted with AES-256 at rest and TLS 1.3 during network transmission.</li>
              <li><strong>Cryptographic Credential Hashing:</strong> Certifications and badges are signed with SHA-256 cryptographic checksums allowing third-party verification without exposing sensitive personal identifiers.</li>
            </ul>
          </Card>

          {/* Section 4 */}
          <Card className="p-6 bg-card border-border rounded-2xl space-y-3">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-600/20 text-purple-300 text-xs font-mono font-bold flex items-center justify-center">4</span>
              <span>Your Data Rights & Compliance Contact</span>
            </h2>
            <p>
              You have the full right to access, export, update, or permanently delete your account data and learning telemetry.
            </p>
            <div className="p-4 bg-secondary/50 rounded-xl space-y-1 text-xs text-zinc-300 font-mono">
              <div><strong>Company:</strong> AalgoLabs (OPC) PVT.LTD.</div>
              <div><strong>Email:</strong> privacy@aalgolabs.com / support@aalgolabs.com</div>
              <div><strong>Jurisdiction:</strong> Bengaluru, Karnataka, India</div>
            </div>
          </Card>
        </div>
      </div>
    </NexusShell>
  );
}
