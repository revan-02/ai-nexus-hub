'use client';

import React from 'react';
import Link from 'next/link';
import {
  Brain,
  Shield,
  FileText,
  Lock,
  ExternalLink,
  Sparkles,
  Award,
  Activity,
  Heart,
  Globe,
  Building2,
  Cpu,
  GraduationCap,
  Briefcase
} from 'lucide-react';

export function NexusFooter() {
  return (
    <footer className="w-full border-t border-border bg-card/60 backdrop-blur-md mt-auto text-xs text-muted-foreground">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 py-10 lg:py-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-8 border-b border-border/80">
          {/* Brand & Attribution Column (Col 1 & 2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-900/40">
                <Brain className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-foreground bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">
                AI Nexus Platform
              </span>
            </div>
            
            <p className="text-zinc-300 text-xs leading-relaxed max-w-sm">
              Next-Generation AI Operating System, High-Performance Learning Ecosystem, and Industry Certification Hub for modern developers and engineers.
            </p>

            <div className="p-3.5 bg-secondary/60 border border-purple-500/20 rounded-2xl space-y-1.5 max-w-sm">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
                <Building2 className="w-4 h-4 text-purple-400" />
                <span>Managed and Maintained by</span>
              </div>
              <div className="font-mono text-xs font-bold text-foreground tracking-wide">
                AalgoLabs (OPC) PVT.LTD.
              </div>
              <p className="text-[11px] text-zinc-400 leading-normal">
                Enterprise AI Engineering, Quantitative Research & Intelligent Systems.
              </p>
            </div>

            {/* Live Operational Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 rounded-full text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational (99.99% Uptime)</span>
            </div>
          </div>

          {/* Column 2: AI Labs & Engineering */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              <span>AI Labs & Tools</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/prompt-engineering" className="hover:text-purple-300 transition-colors">
                  Prompt Engineering (0-100%)
                </Link>
              </li>
              <li>
                <Link href="/math-for-ai" className="hover:text-purple-300 transition-colors">
                  Math for AI & ML
                </Link>
              </li>
              <li>
                <Link href="/model-comparison" className="hover:text-purple-300 transition-colors">
                  LLM Model Comparison
                </Link>
              </li>
              <li>
                <Link href="/ai-architecture" className="hover:text-purple-300 transition-colors">
                  Architecture & LLMs
                </Link>
              </li>
              <li>
                <Link href="/security-center" className="hover:text-purple-300 transition-colors">
                  Security & Crypto Lab
                </Link>
              </li>
              <li>
                <Link href="/performance-test" className="hover:text-purple-300 transition-colors flex items-center gap-1 text-purple-300 font-semibold">
                  <span>100k Users Stress Test</span>
                  <span className="text-[10px] px-1 bg-purple-500/30 rounded">100k</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Careers & Academics */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
              <span>Careers & Exams</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/careers" className="hover:text-purple-300 transition-colors">
                  Careers & Job Portal
                </Link>
              </li>
              <li>
                <Link href="/vtu-question-papers" className="hover:text-purple-300 transition-colors">
                  VTU Exam Question Papers
                </Link>
              </li>
              <li>
                <Link href="/interview-prep" className="hover:text-purple-300 transition-colors">
                  AI Interview Prep (0-4y)
                </Link>
              </li>
              <li>
                <Link href="/quizzes" className="hover:text-purple-300 transition-colors">
                  Assessments & Quizzes
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-purple-300 transition-colors">
                  Undergraduate AI Roadmap
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-purple-300 transition-colors">
                  Community & Study Guilds
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal, Compliance & Trust */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Legal & Compliance</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/privacy-policy" className="hover:text-emerald-300 transition-colors font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-emerald-300 transition-colors font-semibold text-zinc-300 flex items-center gap-1.5">
                  <FileText className="w-3 h-3 text-emerald-400" />
                  <span>Terms and Conditions</span>
                </Link>
              </li>
              <li>
                <Link href="/security-center" className="hover:text-emerald-300 transition-colors">
                  Security & Anti-Cheat Standards
                </Link>
              </li>
              <li>
                <Link href="/certificates/cert-1" className="hover:text-emerald-300 transition-colors">
                  ISO 17024 Credentialing
                </Link>
              </li>
              <li>
                <Link href="/payment-reports" className="hover:text-emerald-300 transition-colors">
                  GST Invoicing & Billing
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Maintained By Strip */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left text-zinc-400">
            <span>
              &copy; {new Date().getFullYear()} <strong className="text-zinc-200">AI Nexus Platform</strong>. All rights reserved.
            </span>
            <span className="hidden sm:inline text-zinc-600">•</span>
            <span className="text-purple-300 font-semibold">
              Managed and Maintained by <strong className="text-foreground">AalgoLabs (OPC) PVT.LTD.</strong>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link href="/privacy-policy" className="hover:text-foreground text-zinc-400 font-medium transition-colors">
              Privacy Policy
            </Link>
            <span className="text-zinc-600">•</span>
            <Link href="/terms-and-conditions" className="hover:text-foreground text-zinc-400 font-medium transition-colors">
              Terms and Conditions
            </Link>
            <span className="text-zinc-600">•</span>
            <Link href="/security-center" className="hover:text-foreground text-zinc-400 font-medium transition-colors">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
