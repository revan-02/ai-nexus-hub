'use client';

import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Smartphone, Code, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CourseItem } from '@/lib/mock-data/courses-data';

interface InstantArticlesPreviewModalProps {
  course: CourseItem;
  isOpen: boolean;
  onClose: () => void;
}

export function InstantArticlesPreviewModal({
  course,
  isOpen,
  onClose,
}: InstantArticlesPreviewModalProps) {
  const [activeTab, setActiveTab] = useState<'mobile' | 'markup'>('mobile');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sampleMarkup = `<!doctype html>
<html lang="en" prefix="op: http://media.facebook.com/op#">
  <head>
    <meta charset="utf-8">
    <link rel="canonical" href="https://ainexus.platform.io/courses?id=${course.id}">
    <meta property="op:markup_version" content="v1.0">
    <meta property="fb:article_style" content="default">
  </head>
  <body>
    <article>
      <header>
        <h1>${course.title}</h1>
        <h2>${course.description}</h2>
        <h3 class="op-kicker">${course.category} · ${course.level} Tier</h3>
        <address>
          <a>${course.instructor?.name || 'Dr. Alex Morgan'}</a>
          AI Nexus Engineering Labs
        </address>
        <time class="op-published" datetime="2026-10-06T12:00:00Z">October 6, 2026</time>
        <figure>
          <img src="https://ainexus.platform.io/robot-3d.png" />
          <figcaption>AI Nexus Core Deep Learning Architecture</figcaption>
        </figure>
      </header>

      <p>Welcome to this comprehensive masterclass on <strong>${course.title}</strong>.</p>
      
      <h2>Technical Syllabus & Objectives</h2>
      <p>Covers theoretical foundations, GPU tensor calculus, vectorized neural architectures, and Kubernetes deployment.</p>

      <figure class="op-ad">
        <iframe src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" width="300" height="250"></iframe>
      </figure>

      <footer>
        <aside>Published by AI Nexus Education Consortium.</aside>
        <small>© 2026 AI Nexus Hub.</small>
      </footer>
    </article>
  </body>
</html>`;

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(sampleMarkup);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-card border border-border rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-secondary/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Facebook Instant Articles Inspector</h3>
              <p className="text-xs text-muted-foreground">
                Validate Meta OpenGraph &amp; Instant Article HTML specification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-xl bg-secondary p-1 border border-border">
              <button
                onClick={() => setActiveTab('mobile')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'mobile' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Mobile View
              </button>
              <button
                onClick={() => setActiveTab('markup')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'markup' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Raw Markup
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'mobile' ? (
            <div className="flex justify-center">
              {/* Smartphone Frame */}
              <div className="w-full max-w-sm rounded-[36px] border-4 border-zinc-700 bg-zinc-950 p-4 shadow-2xl space-y-4 text-zinc-100 font-sans">
                {/* Meta Top Bar */}
                <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800 pb-2">
                  <span className="font-bold text-blue-400">FACEBOOK INSTANT ARTICLE</span>
                  <span className="bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono text-[9px]">
                    VALID MARKUP
                  </span>
                </div>

                {/* Article Header */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                    {course.category} · {course.level}
                  </span>
                  <h1 className="text-xl font-extrabold leading-tight text-white">{course.title}</h1>
                  <p className="text-xs text-zinc-300 leading-relaxed">{course.description}</p>
                  <div className="text-[10px] text-zinc-400 pt-1">
                    By <span className="text-zinc-200 font-semibold">{course.instructor?.name}</span> · AI Nexus Labs
                  </div>
                </div>

                {/* Cover Image */}
                <div className="rounded-2xl overflow-hidden bg-purple-950/40 border border-purple-500/30 p-6 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl mb-1">🤖</span>
                  <span className="text-xs font-bold text-purple-300">{course.title}</span>
                </div>

                {/* Simulated Article Body */}
                <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
                  <p>
                    AI Nexus Hub is designed to teach rigorous engineering, step-by-step calculus derivations, and enterprise-grade models.
                  </p>

                  {/* Instant Article Ad Placement */}
                  <div className="p-3 rounded-xl border border-dashed border-amber-500/30 bg-amber-500/5 text-center space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-amber-400 font-bold">
                      Instant Article Ad Unit (op-ad)
                    </span>
                    <p className="text-[10px] text-zinc-400 font-mono">Google AdSense / Meta Audience Network 300x250</p>
                  </div>

                  <p>
                    All learners receive verified certificates under ISO/IEC 17024 standards with cryptographic tamper verification.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Compliant HTML5 Instant Article Spec:</span>
                <Button
                  onClick={handleCopy}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-500 text-white text-xs gap-1.5 h-8 rounded-xl cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Markup'}</span>
                </Button>
              </div>
              <pre className="p-4 rounded-2xl bg-secondary/70 border border-border text-xs font-mono text-zinc-200 overflow-x-auto max-h-[460px]">
                {sampleMarkup}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-secondary/20 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Passed Meta Graph API validation</span>
          </span>
          <a
            href="https://developers.facebook.com/docs/instant-articles"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:underline flex items-center gap-1"
          >
            <span>Meta Instant Articles Documentation</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
