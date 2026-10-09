'use client';

import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Copy, CheckCircle2 } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

/**
 * Normalizes LaTeX / mathematical expressions in markdown while safeguarding code blocks.
 * - Preserves ```fenced code blocks``` and `inline code` completely untouched.
 * - Converts LaTeX display math \[ ... \] to display blocks.
 * - Ensures single-line $$ ... $$ are placed on their own block lines so remark-math parses them as display equations.
 * - Converts LaTeX inline math \( ... \) to standard $...$.
 */
function preprocessMath(raw: string): string {
  if (!raw) return '';

  const codeBlockRegex = /(```[\s\S]*?```|`[^`\n]*`)/g;
  const parts = raw.split(codeBlockRegex);

  return parts
    .map((part, index) => {
      // Odd indices are code blocks; preserve them exactly as-is
      if (index % 2 === 1) {
        return part;
      }

      return part
        // Normalize LaTeX block math \[ ... \] to display math block
        .replace(/\\\[([\s\S]*?)\\\]/g, (_, formula) => `\n\n$$\n${formula.trim()}\n$$\n\n`)
        // Normalize single-line $$ ... $$ to display math block with newlines
        .replace(/\$\$([\s\S]*?)\$\$/g, (_, formula) => `\n\n$$\n${formula.trim()}\n$$\n\n`)
        // Normalize LaTeX inline math \( ... \) to $ ... $
        .replace(/\\\(([\s\S]*?)\\\)/g, (_, formula) => `$${formula.trim()}$`);
    })
    .join('');
}

function CodeBlock({ inline, className, children, ...props }: any) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const code = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (inline) {
    return (
      <code className="px-1.5 py-0.5 bg-purple-500/15 text-purple-300 border border-purple-500/20 rounded text-[0.8em] font-mono" {...props}>
        {children}
      </code>
    );
  }

  return (
    <div className="relative group my-3 rounded-xl overflow-hidden border border-border bg-zinc-950">
      {/* Code Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-border">
        <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      {/* Code Content */}
      <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed">
        <code className={`font-mono text-zinc-200 ${className || ''}`} {...props}>
          {children}
        </code>
      </pre>
    </div>
  );
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const processedContent = useMemo(() => preprocessMath(content), [content]);

  return (
    <div className="prose prose-invert prose-sm max-w-none text-sm leading-relaxed [&_.katex-display]:overflow-x-auto [&_.katex-display]:py-2 [&_.katex-display]:my-2 [&_.katex-display]:scrollbar-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          [rehypeKatex, { output: 'htmlAndMathml', strict: false, throwOnError: false }]
        ]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-foreground mt-4 mb-2 border-b border-border pb-2">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-bold text-foreground mt-4 mb-2">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-bold text-foreground mt-3 mb-1.5">{children}</h3>
          ),
          // Paragraphs — use div to avoid invalid nesting when code or display math blocks appear inside
          p: ({ children }) => (
            <div className="text-foreground leading-relaxed mb-3 last:mb-0">{children}</div>
          ),
          // Lists
          ul: ({ children }) => (
            <ul className="list-disc list-outside pl-5 mb-3 space-y-1 text-foreground">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside pl-5 mb-3 space-y-1 text-foreground">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-foreground leading-relaxed">{children}</li>
          ),
          // Bold & Italic
          strong: ({ children }) => (
            <strong className="font-bold text-foreground">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-zinc-300">{children}</em>
          ),
          // Code
          code: CodeBlock,
          // Blockquote
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-purple-500/50 pl-4 py-1 my-3 bg-purple-500/5 rounded-r-lg text-zinc-300 italic">
              {children}
            </blockquote>
          ),
          // Table
          table: ({ children }) => (
            <div className="overflow-x-auto my-3">
              <table className="w-full border-collapse text-xs">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border bg-secondary px-3 py-2 text-left font-bold text-foreground">{children}</th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-3 py-2 text-foreground">{children}</td>
          ),
          // Horizontal Rule
          hr: () => <hr className="border-border my-4" />,
          // Links
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors">
              {children}
            </a>
          ),
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
