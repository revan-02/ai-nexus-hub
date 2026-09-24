export interface FreeOllamaModel {
  id: string;
  name: string;
  tag: string;
  parameterSize: string;
  contextWindow: string;
  quantization: string;
  description: string;
  license: string;
  family: 'DeepSeek' | 'Llama' | 'Qwen' | 'Phi' | 'Mistral' | 'Gemma';
  isInstalled?: boolean;
  pullCommand: string;
}

export const FREE_OLLAMA_MODELS: FreeOllamaModel[] = [
  {
    id: 'nexus-tutor',
    name: 'Nexus AI Tutor (Custom Modelfile)',
    tag: 'nexus-tutor:latest',
    parameterSize: '3B / 7B Custom',
    contextWindow: '4096 tokens',
    quantization: 'Q4_K_M',
    description: 'Custom AI Nexus Tutor tuned for deep mathematical derivations, step-by-step algorithms, and production Python architectures.',
    license: 'Open Custom Modelfile',
    family: 'Qwen',
    isInstalled: true,
    pullCommand: 'ollama run nexus-tutor',
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek-R1 (Reasoning)',
    tag: 'deepseek-r1:latest',
    parameterSize: '7B / 8B / 14B',
    contextWindow: '128K tokens',
    quantization: 'Q4_K_M',
    description: 'State-of-the-art open reasoning model rivaling OpenAI o1. Excels at complex mathematics, step-by-step logic, and code synthesis.',
    license: 'MIT (100% Free & Open Source)',
    family: 'DeepSeek',
    pullCommand: 'ollama run deepseek-r1',
  },
  {
    id: 'llama3.2',
    name: 'Meta Llama 3.2 (General & Tool Use)',
    tag: 'llama3.2:latest',
    parameterSize: '3B (Lightweight) / 1B (Ultra-fast)',
    contextWindow: '128K tokens',
    quantization: 'Q4_K_M',
    description: 'Ultra-fast, lightweight open model by Meta optimized for edge devices, structured JSON output, tool calling, and low-latency chat.',
    license: 'Llama 3.2 Community (Free)',
    family: 'Llama',
    pullCommand: 'ollama run llama3.2',
  },
  {
    id: 'qwen2.5-coder',
    name: 'Qwen 2.5 Coder (Full-Stack Coding)',
    tag: 'qwen2.5-coder:7b',
    parameterSize: '7B / 14B / 32B',
    contextWindow: '128K tokens',
    quantization: 'Q4_K_M',
    description: 'Top-ranking open-source code generation model by Alibaba. Supports 92 programming languages, debugging, and unit test generation.',
    license: 'Apache 2.0 (100% Free Commercial & Personal)',
    family: 'Qwen',
    pullCommand: 'ollama run qwen2.5-coder:7b',
  },
  {
    id: 'phi4',
    name: 'Microsoft Phi-4 (Synthetic Reasoning SLM)',
    tag: 'phi4:latest',
    parameterSize: '14B',
    contextWindow: '16K tokens',
    quantization: 'Q4_K_M',
    description: 'Microsoft state-of-the-art Small Language Model (SLM) trained on curated synthetic data for exceptional STEM and math reasoning.',
    license: 'MIT (100% Free & Open Source)',
    family: 'Phi',
    pullCommand: 'ollama run phi4',
  },
  {
    id: 'mistral-nemo',
    name: 'Mistral NeMo (12B Enterprise Multi-Lingual)',
    tag: 'mistral-nemo:latest',
    parameterSize: '12B',
    contextWindow: '128K tokens',
    quantization: 'Q4_K_M',
    description: 'Developed jointly by Mistral AI and NVIDIA with Tekken tokenizer for high-speed multi-lingual and agentic reasoning.',
    license: 'Apache 2.0 (100% Free)',
    family: 'Mistral',
    pullCommand: 'ollama run mistral-nemo',
  },
  {
    id: 'gemma2',
    name: 'Google Gemma 2 (High Efficiency)',
    tag: 'gemma2:9b',
    parameterSize: '9B / 27B',
    contextWindow: '8K tokens',
    quantization: 'Q4_K_M',
    description: 'Google DeepMind lightweight open model built on Gemini research with sliding window attention and knowledge distillation.',
    license: 'Gemma Open Terms (Free)',
    family: 'Gemma',
    pullCommand: 'ollama run gemma2:9b',
  },
];

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';

export async function checkOllamaHealth(): Promise<{
  online: boolean;
  host: string;
  version?: string;
  installedModels: string[];
  latencyMs?: number;
}> {
  const start = Date.now();
  try {
    const res = await fetch(`${OLLAMA_HOST}/api/tags`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      const data = await res.json();
      const models = (data.models || []).map((m: any) => m.name || m.model);
      return {
        online: true,
        host: OLLAMA_HOST,
        installedModels: models,
        latencyMs: Date.now() - start,
      };
    }
  } catch {
    // Ollama daemon not running or unreachable
  }

  return {
    online: false,
    host: OLLAMA_HOST,
    installedModels: [],
  };
}

export async function sendOllamaChat(params: {
  model: string;
  messages: Array<{ role: string; content: string }>;
  temperature?: number;
}): Promise<{
  message: { role: string; content: string };
  evalCount: number;
  durationMs: number;
}> {
  const start = Date.now();
  const res = await fetch(`${OLLAMA_HOST}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: params.model,
      messages: params.messages,
      stream: false,
      options: {
        temperature: params.temperature ?? 0.7,
      },
    }),
    signal: AbortSignal.timeout(120000),
  });

  if (!res.ok) {
    throw new Error(`Ollama responded with status: ${res.status}`);
  }

  const data = await res.json();
  return {
    message: data.message || { role: 'assistant', content: data.response || '' },
    evalCount: data.eval_count || 100,
    durationMs: Date.now() - start,
  };
}

export function getFallbackOllamaResponse(model: string, prompt: string): string {
  return `⚠️ **Ollama is offline or timed out.**

The local Ollama model (\`${model}\`) did not respond in time. This usually happens because:

- **Ollama is not running** → Open a terminal and run: \`ollama serve\`
- **The model is slow on your hardware** → A long reasoning question like yours can take 1–2 minutes on CPU. Wait a bit longer.
- **The model isn't downloaded** → Run: \`ollama run ${model}\`

**To fix right now:**
\`\`\`bash
# Step 1: Start Ollama
ollama serve

# Step 2: In another terminal, pull the model if missing
ollama pull ${model}

# Step 3: Test it works
ollama run ${model} "Hello"
\`\`\`

Once Ollama is running, **send your question again** — it will work correctly.`;
}

