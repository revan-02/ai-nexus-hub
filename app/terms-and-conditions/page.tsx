'use client';

import React from 'react';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { Card } from '@/components/ui/card';
import {
  FileText,
  Shield,
  CheckCircle2,
  Building2,
  Scale,
  Award,
  AlertTriangle,
  Mail,
  ChevronRight,
  Zap,
  Globe
} from 'lucide-react';
import Link from 'next/link';

export default function TermsAndConditionsPage() {
  return (
    <NexusShell>
      <div className="space-y-8 max-w-5xl mx-auto py-2">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-purple-400 font-semibold">Terms and Conditions</span>
        </div>

        {/* Hero Header Banner */}
        <div className="bg-gradient-to-r from-purple-950/70 via-indigo-950/50 to-slate-900 border border-purple-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/30 text-purple-300 border border-purple-500/40 flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-[11px] font-semibold mb-1">
                <span>Platform User Agreement & Legal Terms</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Terms and Conditions
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-3xl">
            These Terms and Conditions govern your access and use of the AI Nexus Platform, courses, AI sandboxes, proctored examinations, and career services provided, managed, and maintained by <strong className="text-foreground">AalgoLabs (OPC) PVT.LTD.</strong>
          </p>
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-zinc-400 pt-2 border-t border-purple-500/20">
            <span>Effective Date: <strong>January 1, 2026</strong></span>
            <span>•</span>
            <span>Version: <strong>2026.2 Enterprise</strong></span>
            <span>•</span>
            <span className="text-purple-300 font-semibold flex items-center gap-1">
              <Scale className="w-3.5 h-3.5" /> Governed by Indian Commercial Law
            </span>
          </div>
        </div>

        {/* Corporate Identity Callout */}
        <Card className="p-5 bg-secondary/60 border-purple-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Building2 className="w-6 h-6 text-purple-400 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-foreground block">Operating & Contracting Entity</span>
              <span className="text-zinc-300">Managed and Maintained by <strong>AalgoLabs (OPC) PVT.LTD.</strong></span>
            </div>
          </div>
          <a
            href="mailto:legal@aalgolabs.com"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all inline-flex items-center gap-2 shrink-0"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact Legal Team</span>
          </a>
        </Card>

        {/* Terms Sections */}
        <div className="space-y-6 text-xs sm:text-sm text-zinc-300 leading-relaxed">
          {/* Section 1 */}
          <Card className="p-6 bg-card border-border rounded-2xl space-y-3">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-600/20 text-purple-300 text-xs font-mono font-bold flex items-center justify-center">1</span>
              <span>Acceptance of Terms & Account Integrity</span>
            </h2>
            <p>
              By creating an account or accessing the AI Nexus Platform, you agree to comply with these terms. You are responsible for safeguarding your credentials and any activity conducted under your authenticated session.
            </p>
          </Card>

          {/* Section 2 */}
          <Card className="p-6 bg-card border-border rounded-2xl space-y-3">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-600/20 text-purple-300 text-xs font-mono font-bold flex items-center justify-center">2</span>
              <span>Intellectual Property & User Code Ownership</span>
            </h2>
            <p>
              All interactive simulators, course curriculums, VTU question paper analysis tools, and platform software are the proprietary intellectual property of <strong>AalgoLabs (OPC) PVT.LTD.</strong>
            </p>
            <p className="text-zinc-400">
              <strong>User Code Ownership:</strong> All code, machine learning architectures, and prompt scripts written and created by learners in interactive labs and sandbox environments remain 100% the intellectual property of the student/developer.
            </p>
          </Card>

          {/* Section 3 */}
          <Card className="p-6 bg-card border-border rounded-2xl space-y-3">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-600/20 text-purple-300 text-xs font-mono font-bold flex items-center justify-center">3</span>
              <span>Proctored Exams & ISO 17024 Certification Rules</span>
            </h2>
            <p>
              Candidates participating in proctored certification examinations must maintain strict academic integrity. Any attempt to bypass anti-cheat protections (such as unauthorized browser tab switching or automated answer injection) will result in immediate disqualification and revocation of verified badges.
            </p>
          </Card>

          {/* Section 4 */}
          <Card className="p-6 bg-card border-border rounded-2xl space-y-3">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-600/20 text-purple-300 text-xs font-mono font-bold flex items-center justify-center">4</span>
              <span>Pricing, Payments & GST Invoicing</span>
            </h2>
            <p>
              All course and masterclass fees are listed in Indian Rupees (INR ₹) and United States Dollars (USD $). Payments are processed through secure gateways, with GST-compliant tax invoices provided for every transaction under the corporate registration of <strong>AalgoLabs (OPC) PVT.LTD.</strong>
            </p>
          </Card>

          {/* Section 5 */}
          <Card className="p-6 bg-card border-border rounded-2xl space-y-3">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-600/20 text-purple-300 text-xs font-mono font-bold flex items-center justify-center">5</span>
              <span>Governing Law & Jurisdiction</span>
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising in connection with the platform shall be subject to the exclusive jurisdiction of the competent courts in Bengaluru, Karnataka, India.
            </p>
            <div className="p-4 bg-secondary/50 rounded-xl space-y-1 text-xs text-zinc-300 font-mono">
              <div><strong>Operating Company:</strong> AalgoLabs (OPC) PVT.LTD.</div>
              <div><strong>Corporate Entity:</strong> One Person Company (OPC) Private Limited</div>
              <div><strong>Jurisdiction:</strong> Bengaluru, Karnataka, India</div>
              <div><strong>Legal Inquiries:</strong> legal@aalgolabs.com</div>
            </div>
          </Card>
        </div>
      </div>
    </NexusShell>
  );
}
