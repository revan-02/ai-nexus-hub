import { describe, it, expect } from 'vitest';
import { getFallbackOllamaResponse } from '@/lib/ai/ollama-client';

describe('Intelligent Ollama Knowledge Engine & Fallback Tests', () => {
  it('should NEVER return offline/timeout error message', () => {
    const response = getFallbackOllamaResponse('nexus-tutor', 'How does neural network learning work?');
    expect(response).not.toContain('Ollama is offline or timed out');
    expect(response).not.toContain('ollama serve');
    expect(response).not.toContain('ollama pull');
  });

  it('should return a friendly and structured greeting when greeted', () => {
    const resHi = getFallbackOllamaResponse('nexus-tutor', 'hello');
    expect(resHi).toContain('AI Nexus Intelligence Tutor');
    expect(resHi).toContain('Deep Learning & Mathematics');

    const resHey = getFallbackOllamaResponse('llama3.2', 'hi!');
    expect(resHey).toContain('AI Nexus Intelligence Tutor');
  });

  it('should provide complete mathematical and PyTorch code for Attention mechanisms', () => {
    const res = getFallbackOllamaResponse('nexus-tutor', 'Explain the Self-Attention mechanism in Transformers');
    expect(res).toContain('Scaled Dot-Product & Multi-Head Self-Attention');
    expect(res).toContain('softmax');
    expect(res).toContain('MultiHeadSelfAttention');
    expect(res).toContain('class MultiHeadSelfAttention(nn.Module):');
    expect(res).toContain('FlashAttention-2');
  });

  it('should derive Backpropagation and gradient descent updates', () => {
    const res = getFallbackOllamaResponse('nexus-tutor', 'Explain backpropagation with chain rule and calculus');
    expect(res).toContain('Backpropagation & Computational Graphs');
    expect(res).toContain('Chain Rule');
    expect(res).toContain('loss.backward()');
    expect(res).toContain('Adam');
  });

  it('should derive Loss functions and explain numerical stability', () => {
    const res = getFallbackOllamaResponse('nexus-tutor', 'Derive the formula for Binary Cross Entropy Loss');
    expect(res).toContain('Loss Functions in Deep Learning');
    expect(res).toContain('Binary Cross-Entropy (BCE) Loss');
    expect(res).toContain('BCEWithLogitsLoss');
  });

  it('should generate DeepSeek reasoning block (<think>) when model is deepseek-r1', () => {
    const res = getFallbackOllamaResponse('deepseek-r1', 'Derive the Loss function for Binary Logistic Regression');
    expect(res).toContain('<think>');
    expect(res).toContain('</think>');
    expect(res).toContain('Binary Cross-Entropy (BCE) Loss');
  });

  it('should accurately provide VTU curriculum exam answers', () => {
    const res = getFallbackOllamaResponse('nexus-tutor', 'Explain VTU 21AI63 Decision Tree ID3 Information Gain');
    expect(res).toContain('VTU AI & Machine Learning Comprehensive Study Guide');
    expect(res).toContain('Entropy');
    expect(res).toContain('Information Gain');
    expect(res).toContain('Naive Bayes');
    expect(res).toContain('Support Vector Machines');
  });

  it('should provide structured synthesis for any arbitrary query without failing', () => {
    const res = getFallbackOllamaResponse('llama3.2', 'How to architect a real-time speech translation pipeline?');
    expect(res).toContain('Technical Analysis & Solution');
    expect(res).toContain('Core Principles & Architecture');
    expect(res).toContain('Production-ready implementation pattern');
    expect(res).toContain('Real-World Enterprise Considerations');
  });
});
