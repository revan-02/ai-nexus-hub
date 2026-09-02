import { NextResponse } from 'next/server';
import { checkOllamaHealth, FREE_OLLAMA_MODELS } from '@/lib/ai/ollama-client';

export async function GET() {
  try {
    const health = await checkOllamaHealth();

    const enrichedModels = FREE_OLLAMA_MODELS.map((model) => {
      const isInstalled = health.installedModels.some(
        (installed) =>
          installed.toLowerCase().includes(model.id.toLowerCase()) ||
          installed.toLowerCase().includes(model.tag.toLowerCase())
      );
      return {
        ...model,
        isInstalled,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        ...health,
        models: enrichedModels,
        installHelp: {
          macLinux: 'curl -fsSL https://ollama.com/install.sh | sh',
          brew: 'brew install ollama && ollama serve',
          windows: 'https://ollama.com/download/windows',
          quickStart: 'ollama run deepseek-r1',
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to check Ollama status',
      },
      { status: 500 }
    );
  }
}
