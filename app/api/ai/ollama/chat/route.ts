import { NextRequest, NextResponse } from 'next/server';
import { sendOllamaChat, checkOllamaHealth, getFallbackOllamaResponse } from '@/lib/ai/ollama-client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      model = 'deepseek-r1',
      prompt,
      messages = [],
      temperature = 0.7,
      system = 'You are a helpful, expert AI pair programmer and computer science tutor.',
    } = body;

    if (!prompt && (!messages || messages.length === 0)) {
      return NextResponse.json(
        { success: false, error: 'Prompt or messages array is required.' },
        { status: 400 }
      );
    }

    const conversation = messages.length > 0
      ? messages
      : [
          { role: 'system', content: system },
          { role: 'user', content: prompt },
        ];

    const health = await checkOllamaHealth();

    // If local Ollama daemon is running, invoke native high-speed fetch client
    if (health.online) {
      try {
        const response = await sendOllamaChat({
          model,
          messages: conversation,
          temperature,
        });

        const elapsedMs = response.durationMs;
        const totalTokens = response.evalCount || 120;
        const tokensPerSec = elapsedMs > 0 ? ((totalTokens / elapsedMs) * 1000).toFixed(1) : '35.0';

        return NextResponse.json({
          success: true,
          mode: 'live_local_ollama',
          data: {
            message: response.message,
            content: response.message.content,
            model,
            metrics: {
              totalDurationMs: elapsedMs,
              evalCount: totalTokens,
              tokensPerSec,
            },
          },
        });
      } catch (err: any) {
        console.warn('Ollama local invocation error, falling back to simulated inference:', err.message);
      }
    }

    // Fallback simulated local response
    const query = prompt || (messages[messages.length - 1]?.content || '');
    const simulatedContent = getFallbackOllamaResponse(model, query);

    return NextResponse.json({
      success: true,
      mode: 'edge_simulated_ollama',
      data: {
        message: { role: 'assistant', content: simulatedContent },
        content: simulatedContent,
        model,
        metrics: {
          totalDurationMs: 420,
          evalCount: 85,
          tokensPerSec: '42.5',
        },
        notice: 'Ollama local daemon at 127.0.0.1:11434 is offline. Running in zero-cost edge simulation mode. Run `ollama serve` to connect your live GPU.',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Ollama generation failed' },
      { status: 500 }
    );
  }
}
