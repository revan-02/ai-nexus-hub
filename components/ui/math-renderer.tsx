'use client';

import React, { useMemo } from 'react';
import katex from 'katex';

interface MathRendererProps {
  math: string;
  block?: boolean;
  className?: string;
}

/**
 * Universal KaTeX Mathematical Formula Renderer
 * Renders LaTeX / mathematical expressions into standard textbook-grade typography
 * with graceful fallback to formatted Unicode math.
 */
export function MathRenderer({ math, block = false, className = '' }: MathRendererProps) {
  const html = useMemo(() => {
    if (!math) return '';

    // Normalize common ASCII/Unicode math notations to standard LaTeX if needed
    let sanitized = math
      .replace(/ŷ|ŷ/g, '\\hat{y}')
      .replace(/x̂|x̂/g, '\\hat{x}')
      .replace(/·/g, '\\cdot ')
      .replace(/ᵀ/g, '^T')
      .replace(/∑/g, '\\sum ')
      .replace(/∏/g, '\\prod ')
      .replace(/√\s*([a-zA-Z0-9_{}]+)/g, '\\sqrt{$1}')
      .replace(/∈/g, '\\in ')
      .replace(/ℝ\^/g, '\\mathbb{R}^')
      .replace(/ℝ/g, '\\mathbb{R}')
      .replace(/θ/g, '\\theta ')
      .replace(/η/g, '\\eta ')
      .replace(/∇/g, '\\nabla ')
      .replace(/σ/g, '\\sigma ')
      .replace(/δ/g, '\\delta ')
      .replace(/α/g, '\\alpha ')
      .replace(/β/g, '\\beta ')
      .replace(/ϵ/g, '\\epsilon ')
      .replace(/ε/g, '\\epsilon ')
      .replace(/λ/g, '\\lambda ')
      .replace(/Σ/g, '\\Sigma ')
      .replace(/Φ/g, '\\Phi ')
      .replace(/ϕ/g, '\\phi ')
      .replace(/⊙/g, '\\odot ')
      .replace(/𝔼/g, '\\mathbb{E}')
      .replace(/≻/g, '\\succ ')
      .replace(/≤/g, '\\le ')
      .replace(/≥/g, '\\ge ')
      .replace(/⟹/g, '\\implies ')
      .replace(/π/g, '\\pi ')
      .replace(/∂/g, '\\partial ');

    try {
      return katex.renderToString(sanitized, {
        displayMode: block,
        throwOnError: false,
        strict: false,
        output: 'htmlAndMathml',
      });
    } catch {
      // Fallback
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
        strict: false,
      });
    }
  }, [math, block]);

  return (
    <span
      className={`inline-math-container font-math ${block ? 'block my-1.5 overflow-x-auto text-center' : 'inline-block align-middle'} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default MathRenderer;
