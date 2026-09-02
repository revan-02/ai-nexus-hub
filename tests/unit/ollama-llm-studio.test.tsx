import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OllamaStudio } from '@/components/ai/ollama-studio';
import { NexusProvider } from '@/context/nexus-context';

describe('Ollama AI Chatbot & Custom Model Fine-Tuning Studio', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    global.fetch = vi.fn((url: any) => {
      if (url.toString().includes('/api/ai/ollama/chat')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              success: true,
              data: {
                content: 'Attention is computed as: Attention(Q, K, V) = softmax((Q K^T) / sqrt(d_k)) V',
                model: 'llama3.2',
                metrics: {
                  totalDurationMs: 320,
                  evalCount: 85,
                  tokensPerSec: '52.4',
                },
              },
            }),
        });
      }
      if (url.toString().includes('/api/ai/ollama/train')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              success: true,
              data: {
                modelId: 'custom-my-vtu-coach',
                modelName: 'my-vtu-coach',
                baseModel: 'llama3.2',
                modelfileContent: 'FROM llama3.2:latest\nSYSTEM "VTU Exam Coach"',
                trainingLogs: [
                  { epoch: 1, step: 150, loss: 2.1, accuracy: 68 },
                  { epoch: 2, step: 300, loss: 0.35, accuracy: 98 },
                ],
              },
            }),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    }) as any;
  });

  it('renders Ollama AI Chatbot with welcome message, model selector, and Quick Ask chips', () => {
    render(
      <NexusProvider>
        <OllamaStudio />
      </NexusProvider>
    );

    expect(screen.getByText(/Ollama AI Chatbot & Model Trainer/i)).toBeInTheDocument();
    expect(screen.getByText(/Ollama AI Chatbot \(Q&A\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Train & Fine-Tune Custom Model/i)).toBeInTheDocument();
    expect(screen.getByText(/Explain Transformer Self-Attention Math/i)).toBeInTheDocument();
  });

  it('sends question in Chatbot and renders assistant answer', async () => {
    render(
      <NexusProvider>
        <OllamaStudio />
      </NexusProvider>
    );

    const starterBtn = screen.getByText(/Explain Transformer Self-Attention Math/i);
    fireEvent.click(starterBtn);

    await waitFor(() => {
      expect(screen.getByText(/Attention is computed as/i)).toBeInTheDocument();
    });
  });

  it('switches to Model Trainer tab, triggers LoRA fine-tuning, and renders loss convergence chart', async () => {
    render(
      <NexusProvider>
        <OllamaStudio />
      </NexusProvider>
    );

    const trainerTab = screen.getByText(/Train & Fine-Tune Custom Model/i);
    fireEvent.click(trainerTab);

    expect(screen.getByText(/LoRA Fine-Tuning Hyperparameters/i)).toBeInTheDocument();
    expect(screen.getByText(/Domain Fine-Tuning Dataset/i)).toBeInTheDocument();

    const startTrainBtn = screen.getByText(/Start Model Training & LoRA Fine-Tuning/i);
    fireEvent.click(startTrainBtn);

    expect(screen.getByText(/Cross-Entropy Loss Minimization Curve/i)).toBeInTheDocument();
  });

  it('switches to Free Models Matrix and 1-Click Local CLI Setup tabs', () => {
    render(
      <NexusProvider>
        <OllamaStudio />
      </NexusProvider>
    );

    const modelsTab = screen.getByText(/Free Open Models Matrix/i);
    fireEvent.click(modelsTab);
    expect(screen.getAllByText(/Nexus AI Tutor/i).length).toBeGreaterThan(0);

    const installTab = screen.getByText(/1-Click Local CLI Setup/i);
    fireEvent.click(installTab);
    expect(screen.getByText(/How to Run Ollama Locally on Your Machine/i)).toBeInTheDocument();
  });
});
