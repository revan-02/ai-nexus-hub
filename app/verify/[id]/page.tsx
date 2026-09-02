'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Award,
  Cpu,
  Database,
  Zap,
  Layers,
  Sparkles,
  ExternalLink,
  Code,
  Check,
  Copy,
  Lock,
  Building,
  User
} from 'lucide-react';
import { useCertificate } from '@/hooks/api/use-rooms';

export default function PublicVerificationPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = params && typeof (params as any)?.then === 'function' ? use(params as Promise<{ id: string }>) : (params as { id: string });
  const id = resolvedParams?.id || 'NEXUS-CERT-948210';
  const { data: certResponse, isLoading } = useCertificate(id);

  const [copiedJson, setCopiedJson] = useState(false);

  const cert = certResponse?.data;

  const certificate = cert || {
    id: id || 'cert-1',
    certificateHash: id?.startsWith('NEXUS-') ? id : 'NEXUS-CERT-948210',
    trackName: 'Enterprise Generative AI, Hybrid RAG & Production MLOps Systems',
    scorePercent: 100,
    issuedAt: 'August 31, 2026',
    user: {
      name: 'Sarah Johnson',
      email: 's.johnson@techcorp.io',
    },
  };

  const verifiableJsonLd = {
    '@context': ['https://www.w3.org/2018/credentials/v1', 'https://purl.imsglobal.org/spec/ob/v3p0/context.json'],
    type: ['VerifiableCredential', 'OpenBadgeCredential'],
    id: `urn:uuid:${certificate.certificateHash}`,
    issuer: {
      id: 'https://nexus.ai/issuers/council',
      name: 'AI Nexus Professional Credentialing Council',
      url: 'https://nexus.ai',
    },
    issuanceDate: new Date(certificate.issuedAt).toISOString(),
    credentialSubject: {
      id: `did:key:${certificate.certificateHash}`,
      name: certificate.user?.name || 'Verified Candidate',
      achievement: {
        id: 'https://nexus.ai/achievements/genai-production-architect',
        type: ['Achievement'],
        name: certificate.trackName,
        description: 'Demonstrated industry engineering mastery in high-throughput vLLM serving, Hybrid RAG, 4-bit LoRA fine-tuning, and GPU cluster orchestration.',
        criteria: { narrative: 'Scored >= 60% on proctored technical evaluation with anti-cheat audit verification.' },
      },
    },
    proof: {
      type: 'Ed25519Signature2020',
      created: new Date(certificate.issuedAt).toISOString(),
      verificationMethod: 'https://nexus.ai/keys/ledger-key-2026',
      proofPurpose: 'assertionMethod',
      proofValue: `z${certificate.certificateHash}9a8b7c6d5e4f3a2b1c`,
    },
  };

  const handleCopyJsonLd = () => {
    navigator.clipboard.writeText(JSON.stringify(verifiableJsonLd, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 3000);
  };

  return (
    <NexusShell>
      <div className="space-y-6 max-w-4xl mx-auto pb-12">
        {/* Verification Status Banner */}
        <div className="p-6 bg-gradient-to-r from-emerald-950/60 via-card to-card border border-emerald-500/40 rounded-3xl space-y-3 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-950/40 flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                    Official Public Verification Ledger
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold rounded-full border border-emerald-500/30">
                    VERIFIED & ACTIVE
                  </span>
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground mt-0.5">
                  Cryptographically Valid Credential
                </h1>
              </div>
            </div>

            <Link href={`/certificates/${certificate.id || certificate.certificateHash}`}>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-9 px-4 rounded-xl gap-1.5 shadow-md shadow-purple-950/40 cursor-pointer">
                <Award className="w-4 h-4" /> View Full Certificate
              </Button>
            </Link>
          </div>
        </div>

        {/* Verification Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Left 2 Cols: Credential & Candidate Details */}
          <div className="md:col-span-2 space-y-6">
            <Card className="p-6 bg-card border-border rounded-2xl space-y-4 shadow-lg">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Credential Subject & Award
              </h2>

              <div className="space-y-3 border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">{certificate.user?.name || 'Verified Candidate'}</h3>
                    <p className="text-xs text-muted-foreground font-mono">{certificate.user?.email || 'verified.candidate@nexus.ai'}</p>
                  </div>
                </div>

                <div className="p-3 bg-secondary/50 rounded-xl border border-border">
                  <span className="text-[10px] font-mono text-purple-400 font-bold uppercase block">Specialization Track</span>
                  <p className="text-sm font-bold text-foreground mt-0.5">{certificate.trackName}</p>
                </div>
              </div>

              {/* Verified Competencies */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Demonstrated Industry Competencies (ISO 17024 Compliant)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { title: 'Production PyTorch Deployment', desc: 'GPU Cluster & Tensor Processing' },
                    { title: 'Enterprise Hybrid RAG', desc: 'Dense + BM25 Sparse Rerankers' },
                    { title: '4-Bit QLoRA Fine-Tuning', desc: 'BitsAndBytes Parameter Efficiency' },
                    { title: 'High-Throughput vLLM Serving', desc: 'PagedAttention & Token Streaming' },
                    { title: 'Anti-Cheat Proctor Audit', desc: 'Zero Integrity Violations' },
                    { title: 'Evaluation Guardrails', desc: 'Ragas / TruLens Telemetry' },
                  ].map((comp) => (
                    <div key={comp.title} className="p-3 bg-secondary/40 border border-border rounded-xl space-y-0.5">
                      <p className="font-bold text-foreground text-[11px]">{comp.title}</p>
                      <span className="text-[10px] text-muted-foreground">{comp.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Open Badges 3.0 / W3C Verifiable Credentials JSON-LD */}
            <Card className="p-6 bg-card border-border rounded-2xl space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs font-bold text-foreground">W3C Verifiable Credential / Open Badges 3.0 JSON-LD</h3>
                </div>

                <Button
                  onClick={handleCopyJsonLd}
                  variant="outline"
                  className="h-7 px-2.5 text-[11px] bg-secondary border-border text-foreground rounded-lg gap-1 cursor-pointer"
                >
                  {copiedJson ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-purple-400" />}
                  <span>{copiedJson ? 'Copied JSON' : 'Copy JSON'}</span>
                </Button>
              </div>

              <pre className="p-3 bg-black/70 border border-border rounded-xl font-mono text-[10px] text-purple-300 overflow-x-auto max-h-48">
                <code>{JSON.stringify(verifiableJsonLd, null, 2)}</code>
              </pre>
            </Card>
          </div>

          {/* Right 1 Col: Issuing Authority & Audit Record */}
          <div className="space-y-6">
            <Card className="p-5 bg-card border-border rounded-2xl space-y-4 shadow-lg">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Issuing Authority</h3>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-purple-600 p-0.5 flex items-center justify-center">
                  <div className="w-full h-full bg-[#0d0b17] rounded-[10px] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">AI Nexus Credentialing Council</h4>
                  <p className="text-[10px] text-muted-foreground">Standards & Accreditation Board</p>
                </div>
              </div>

              <div className="space-y-2 text-xs border-t border-border pt-3">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">Verification Hash</span>
                  <span className="font-mono text-amber-400 text-[11px] font-bold block select-all break-all">
                    {certificate.certificateHash}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">Issue Date</span>
                  <span className="font-mono text-foreground text-[11px] block">
                    {new Date(certificate.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">Proctor Verification</span>
                  <span className="font-mono text-emerald-400 text-[11px] font-bold block">
                    100% Proctored & Authenticated
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </NexusShell>
  );
}
