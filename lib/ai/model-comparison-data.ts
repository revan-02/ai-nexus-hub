export interface AIModelSpec {
  id: string;
  name: string;
  creator: 'OpenAI' | 'Google DeepMind' | 'Anthropic' | 'DeepSeek' | 'Meta' | 'Mistral AI' | 'Alibaba' | 'Microsoft';
  creatorLogo: string;
  licenseType: string;
  isOpenSource: boolean;
  isFreeToHost: boolean;
  category: 'Reasoning & Math' | 'General Frontier' | 'Coding Specialist' | 'Fast & Cost-Efficient' | 'Edge & On-Device';
  badge: string;
  badgeColor: string;
  bestFor: string;
  
  // Pricing per 1M tokens
  inputPricePerMillionUSD: number;
  outputPricePerMillionUSD: number;
  cachedInputPriceUSD?: number;
  inputPriceINR: string; // e.g. "₹215 / 1M tokens ($2.50)"
  outputPriceINR: string; // e.g. "₹860 / 1M tokens ($10.00)"
  
  // Context & Parameters
  contextWindowTokens: number;
  contextWindowDisplay: string; // e.g. "128K", "200K", "1M", "2M"
  maxOutputTokens: number;
  maxOutputDisplay: string;
  parameterCount?: string; // e.g. "70B", "671B (37B active MoE)"
  
  // Capabilities
  supportsVision: boolean;
  supportsAudio: boolean;
  supportsVideo: boolean;
  supportsFunctionCalling: boolean;
  supportsJSONSchema: boolean;
  
  // Benchmarks
  mmluProScore: number; // 0-100
  humanEvalCodingScore: number; // 0-100
  mathScore: number; // 0-100 (GSM8K/MATH)
  arenaElo: number; // LMSYS Chatbot Arena
  speedTokensPerSec: number; // Avg inference speed
  
  description: string;
  idealUseCases: string[];
  limitations: string[];
  ollamaCommand?: string;
  apiSampleSnippet: string;
}

export const AI_MODELS_DATABASE: AIModelSpec[] = [
  // ── 1. OPENAI MODELS ──
  {
    id: 'openai-o1',
    name: 'OpenAI o1',
    creator: 'OpenAI',
    creatorLogo: '🟢',
    licenseType: 'Commercial API',
    isOpenSource: false,
    isFreeToHost: false,
    category: 'Reasoning & Math',
    badge: 'State of the Art Reasoning',
    badgeColor: 'emerald',
    bestFor: 'Deep multi-step reasoning, competitive math, PhD-level science, and complex code refactoring.',
    inputPricePerMillionUSD: 15.00,
    outputPricePerMillionUSD: 60.00,
    cachedInputPriceUSD: 7.50,
    inputPriceINR: '₹1,290 / 1M tokens ($15.00)',
    outputPriceINR: '₹5,160 / 1M tokens ($60.00)',
    contextWindowTokens: 200000,
    contextWindowDisplay: '200K',
    maxOutputTokens: 100000,
    maxOutputDisplay: '100K',
    supportsVision: true,
    supportsAudio: false,
    supportsVideo: false,
    supportsFunctionCalling: true,
    supportsJSONSchema: true,
    mmluProScore: 89.6,
    humanEvalCodingScore: 92.4,
    mathScore: 96.4,
    arenaElo: 1358,
    speedTokensPerSec: 28,
    description: 'Trained with large-scale reinforcement learning to think before answering. Generates an internal chain of thought to solve complex logic, mathematical theorems, and multi-file architecture problems.',
    idealUseCases: [
      'Autonomous debugging of complex software architectures',
      'Formal mathematical proofs & Olympiad problem solving',
      'Biomedical literature review and algorithmic trading modeling',
      'Multi-step strategic planning and contract vulnerability audits'
    ],
    limitations: [
      'Higher latency due to chain-of-thought generation',
      'Higher cost compared to general-purpose conversational models'
    ],
    apiSampleSnippet: `import OpenAI from "openai";\nconst openai = new OpenAI();\nconst response = await openai.chat.completions.create({\n  model: "o1",\n  messages: [{ role: "user", content: "Solve this calculus optimization problem..." }]\n});`
  },
  {
    id: 'openai-gpt4o',
    name: 'GPT-4o Omnimodal',
    creator: 'OpenAI',
    creatorLogo: '🟢',
    licenseType: 'Commercial API',
    isOpenSource: false,
    isFreeToHost: false,
    category: 'General Frontier',
    badge: 'Flagship Omnimodal',
    badgeColor: 'purple',
    bestFor: 'Real-time conversational agents, high-speed vision & voice analysis, and general-purpose enterprise RAG.',
    inputPricePerMillionUSD: 2.50,
    outputPricePerMillionUSD: 10.00,
    cachedInputPriceUSD: 1.25,
    inputPriceINR: '₹215 / 1M tokens ($2.50)',
    outputPriceINR: '₹860 / 1M tokens ($10.00)',
    contextWindowTokens: 128000,
    contextWindowDisplay: '128K',
    maxOutputTokens: 16384,
    maxOutputDisplay: '16K',
    supportsVision: true,
    supportsAudio: true,
    supportsVideo: true,
    supportsFunctionCalling: true,
    supportsJSONSchema: true,
    mmluProScore: 85.9,
    humanEvalCodingScore: 90.2,
    mathScore: 92.0,
    arenaElo: 1335,
    speedTokensPerSec: 72,
    description: 'Native omnimodal model combining text, vision, and audio in a single neural network with low latency and high quality.',
    idealUseCases: [
      'Enterprise customer service & voice conversational agents',
      'Visual document OCR, diagram parsing, and UI mockup translation',
      'Structured JSON extraction and database tool calling'
    ],
    limitations: ['200K+ context requires chunking or Gemini alternative'],
    apiSampleSnippet: `const response = await openai.chat.completions.create({\n  model: "gpt-4o",\n  messages: [{ role: "user", content: "Analyze this image and schema" }],\n  response_format: { type: "json_object" }\n});`
  },
  {
    id: 'openai-gpt4o-mini',
    name: 'GPT-4o mini',
    creator: 'OpenAI',
    creatorLogo: '🟢',
    licenseType: 'Commercial API',
    isOpenSource: false,
    isFreeToHost: false,
    category: 'Fast & Cost-Efficient',
    badge: 'Ultra Low Cost Frontier',
    badgeColor: 'blue',
    bestFor: 'High-volume background tasks, classification, summarization, and cost-sensitive consumer apps.',
    inputPricePerMillionUSD: 0.15,
    outputPricePerMillionUSD: 0.60,
    cachedInputPriceUSD: 0.075,
    inputPriceINR: '₹12.90 / 1M tokens ($0.15)',
    outputPriceINR: '₹51.60 / 1M tokens ($0.60)',
    contextWindowTokens: 128000,
    contextWindowDisplay: '128K',
    maxOutputTokens: 16384,
    maxOutputDisplay: '16K',
    supportsVision: true,
    supportsAudio: false,
    supportsVideo: false,
    supportsFunctionCalling: true,
    supportsJSONSchema: true,
    mmluProScore: 78.4,
    humanEvalCodingScore: 82.0,
    mathScore: 84.8,
    arenaElo: 1276,
    speedTokensPerSec: 110,
    description: 'Massively optimized small model delivering near GPT-4 capability at a fraction of the cost. Ideal for high-throughput pipelines.',
    idealUseCases: [
      'High-frequency semantic tagging and classification',
      'Customer support initial triage and routing',
      'Embeddings synthesis and lightweight query rewriting'
    ],
    limitations: ['Less suitable for deep multi-file architectural refactoring'],
    apiSampleSnippet: `const response = await openai.chat.completions.create({\n  model: "gpt-4o-mini",\n  messages: [{ role: "user", content: "Summarize this article in 3 bullets" }]\n});`
  },

  // ── 2. GOOGLE DEEPMIND MODELS ──
  {
    id: 'google-gemini-2-flash',
    name: 'Gemini 2.0 Flash',
    creator: 'Google DeepMind',
    creatorLogo: '✨',
    licenseType: 'Commercial API',
    isOpenSource: false,
    isFreeToHost: false,
    category: 'Fast & Cost-Efficient',
    badge: 'Sub-Second Multimodal Speed',
    badgeColor: 'cyan',
    bestFor: 'Real-time multimodal streaming, live video understanding, ultra-fast agent tool execution, and budget-friendly pipelines.',
    inputPricePerMillionUSD: 0.10,
    outputPricePerMillionUSD: 0.40,
    cachedInputPriceUSD: 0.025,
    inputPriceINR: '₹8.60 / 1M tokens ($0.10)',
    outputPriceINR: '₹34.40 / 1M tokens ($0.40)',
    contextWindowTokens: 1048576,
    contextWindowDisplay: '1M',
    maxOutputTokens: 8192,
    maxOutputDisplay: '8K',
    supportsVision: true,
    supportsAudio: true,
    supportsVideo: true,
    supportsFunctionCalling: true,
    supportsJSONSchema: true,
    mmluProScore: 84.2,
    humanEvalCodingScore: 88.5,
    mathScore: 91.2,
    arenaElo: 1332,
    speedTokensPerSec: 145,
    description: 'Next-generation multimodal model from Google DeepMind engineered for sub-second responses, native audio/video streaming, and 1M token context.',
    idealUseCases: [
      'Real-time streaming agent interactions and live video feeds',
      'Large PDF and video transcript analysis (up to 1 hour video)',
      'Sub-second tool calling and web browsing automation'
    ],
    limitations: ['Max output capped at 8,192 tokens per single turn'],
    apiSampleSnippet: `import { GoogleGenAI } from "@google/genai";\nconst ai = new GoogleGenAI();\nconst response = await ai.models.generateContent({\n  model: 'gemini-2.0-flash',\n  contents: 'Analyze this multimodal stream'\n});`
  },
  {
    id: 'google-gemini-1-5-pro',
    name: 'Gemini 1.5 Pro',
    creator: 'Google DeepMind',
    creatorLogo: '✨',
    licenseType: 'Commercial API',
    isOpenSource: false,
    isFreeToHost: false,
    category: 'General Frontier',
    badge: 'Industry-Leading 2M Context',
    badgeColor: 'purple',
    bestFor: 'Massive codebase ingestion, multi-hour video analysis, entire library search, and cross-document synthesis.',
    inputPricePerMillionUSD: 1.25,
    outputPricePerMillionUSD: 5.00,
    cachedInputPriceUSD: 0.3125,
    inputPriceINR: '₹107.50 / 1M tokens ($1.25)',
    outputPriceINR: '₹430.00 / 1M tokens ($5.00)',
    contextWindowTokens: 2097152,
    contextWindowDisplay: '2M',
    maxOutputTokens: 8192,
    maxOutputDisplay: '8K',
    supportsVision: true,
    supportsAudio: true,
    supportsVideo: true,
    supportsFunctionCalling: true,
    supportsJSONSchema: true,
    mmluProScore: 86.4,
    humanEvalCodingScore: 89.7,
    mathScore: 90.8,
    arenaElo: 1340,
    speedTokensPerSec: 55,
    description: 'World-record 2 Million token context window allowing direct upload of 60,000 lines of code, 30 financial books, or 2 hours of HD video with perfect "needle-in-a-haystack" retrieval.',
    idealUseCases: [
      'Full repository analysis without requiring vector databases or chunking',
      'Enterprise financial annual report comparative auditing (10-K/10-Q)',
      'Cross-referencing legal contracts and multi-language archives'
    ],
    limitations: ['Costs double when context exceeds 128K tokens'],
    apiSampleSnippet: `const response = await ai.models.generateContent({\n  model: 'gemini-1.5-pro',\n  contents: [{ text: 'Examine entire 500-page codebase document' }]\n});`
  },

  // ── 3. ANTHROPIC MODELS ──
  {
    id: 'anthropic-claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    creator: 'Anthropic',
    creatorLogo: '🟧',
    licenseType: 'Commercial API',
    isOpenSource: false,
    isFreeToHost: false,
    category: 'Coding Specialist',
    badge: 'Gold Standard for Coding',
    badgeColor: 'amber',
    bestFor: 'End-to-end full-stack software development, architectural design, debugging, tool-use computer automation, and nuanced writing.',
    inputPricePerMillionUSD: 3.00,
    outputPricePerMillionUSD: 15.00,
    cachedInputPriceUSD: 0.30,
    inputPriceINR: '₹258 / 1M tokens ($3.00)',
    outputPriceINR: '₹1,290 / 1M tokens ($15.00)',
    contextWindowTokens: 200000,
    contextWindowDisplay: '200K',
    maxOutputTokens: 8192,
    maxOutputDisplay: '8K',
    supportsVision: true,
    supportsAudio: false,
    supportsVideo: false,
    supportsFunctionCalling: true,
    supportsJSONSchema: true,
    mmluProScore: 88.7,
    humanEvalCodingScore: 93.7,
    mathScore: 91.6,
    arenaElo: 1349,
    speedTokensPerSec: 62,
    description: 'Universally recognized as the leading coding and reasoning model for software engineers. Excels at generating clean TypeScript/Python, understanding complex frameworks, and Computer Use GUI interaction.',
    idealUseCases: [
      'Full-stack Next.js, React, and Python system development',
      'Automated code reviews, refactoring, and test suite generation',
      'Computer Use GUI automation & agentic browser navigation',
      'High-nuance technical documentation and system design specs'
    ],
    limitations: ['Prompt caching is essential to keep high-frequency costs low'],
    apiSampleSnippet: `import Anthropic from '@anthropic-ai/sdk';\nconst anthropic = new Anthropic();\nconst message = await anthropic.messages.create({\n  model: "claude-3-5-sonnet-20241022",\n  max_tokens: 4096,\n  messages: [{ role: "user", content: "Build a production React component with hooks" }]\n});`
  },
  {
    id: 'anthropic-claude-3-5-haiku',
    name: 'Claude 3.5 Haiku',
    creator: 'Anthropic',
    creatorLogo: '🟧',
    licenseType: 'Commercial API',
    isOpenSource: false,
    isFreeToHost: false,
    category: 'Fast & Cost-Efficient',
    badge: 'Blazing Fast Coding',
    badgeColor: 'emerald',
    bestFor: 'Sub-second code completion, low-latency agent sub-tasks, and high-throughput data extraction.',
    inputPricePerMillionUSD: 0.80,
    outputPricePerMillionUSD: 4.00,
    cachedInputPriceUSD: 0.08,
    inputPriceINR: '₹68.80 / 1M tokens ($0.80)',
    outputPriceINR: '₹344.00 / 1M tokens ($4.00)',
    contextWindowTokens: 200000,
    contextWindowDisplay: '200K',
    maxOutputTokens: 8192,
    maxOutputDisplay: '8K',
    supportsVision: true,
    supportsAudio: false,
    supportsVideo: false,
    supportsFunctionCalling: true,
    supportsJSONSchema: true,
    mmluProScore: 80.5,
    humanEvalCodingScore: 86.8,
    mathScore: 88.0,
    arenaElo: 1290,
    speedTokensPerSec: 125,
    description: 'Anthropic’s fastest model, outperforming Claude 3 Opus on standard benchmarks while operating at blazing speeds.',
    idealUseCases: [
      'IDE inline autocomplete and syntax linting',
      'High-speed data extraction and entity normalization',
      'Real-time customer interaction and agent tool routing'
    ],
    limitations: ['Slightly higher cost than GPT-4o mini'],
    apiSampleSnippet: `const message = await anthropic.messages.create({\n  model: "claude-3-5-haiku-20241022",\n  max_tokens: 2048,\n  messages: [{ role: "user", content: "Validate schema inputs" }]\n});`
  },

  // ── 4. DEEPSEEK MODELS (REVOLUTIONARY VALUE & OPEN WEIGHTS) ──
  {
    id: 'deepseek-r1',
    name: 'DeepSeek-R1',
    creator: 'DeepSeek',
    creatorLogo: '🐋',
    licenseType: 'Open Source (Apache 2.0 / MIT)',
    isOpenSource: true,
    isFreeToHost: true,
    category: 'Reasoning & Math',
    badge: 'Open Weights Reasoning Giant',
    badgeColor: 'blue',
    bestFor: 'Cost-free local private hosting, competitive math & reasoning, verifiable chain of thought, and self-hosted enterprise security.',
    inputPricePerMillionUSD: 0.55,
    outputPricePerMillionUSD: 2.19,
    cachedInputPriceUSD: 0.14,
    inputPriceINR: '₹47.30 / 1M tokens ($0.55) [FREE via Ollama]',
    outputPriceINR: '₹188.34 / 1M tokens ($2.19) [FREE via Ollama]',
    contextWindowTokens: 128000,
    contextWindowDisplay: '128K',
    maxOutputTokens: 8192,
    maxOutputDisplay: '8K',
    parameterCount: '671B (37B active MoE)',
    supportsVision: false,
    supportsAudio: false,
    supportsVideo: false,
    supportsFunctionCalling: true,
    supportsJSONSchema: true,
    mmluProScore: 88.5,
    humanEvalCodingScore: 92.8,
    mathScore: 97.3,
    arenaElo: 1354,
    speedTokensPerSec: 35,
    description: 'Groundbreaking open-weights reasoning model developed with pure reinforcement learning (DeepSeek-R1-Zero). Matches OpenAI o1 in math, coding, and logical derivation at 1/27th the API price or 100% FREE self-hosted.',
    idealUseCases: [
      '100% Offline private mathematical and algorithmic reasoning',
      'Enterprise data privacy with zero third-party cloud data leak',
      'Distilled versions (7B, 14B, 32B) runnable on MacBooks and RTX 4090s',
      'Autonomous smart contract auditing and algorithmic theorem proving'
    ],
    limitations: ['Full 671B requires multi-GPU server; use 7B/14B/32B for consumer hardware'],
    ollamaCommand: 'ollama run deepseek-r1:14b',
    apiSampleSnippet: `curl https://api.deepseek.com/chat/completions -H "Authorization: Bearer $KEY" -d '{"model": "deepseek-reasoner", "messages": [{"role": "user", "content": "Prove Cauchy-Schwarz inequality"}]}'`
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek-V3',
    creator: 'DeepSeek',
    creatorLogo: '🐋',
    licenseType: 'Open Source (Apache 2.0 / MIT)',
    isOpenSource: true,
    isFreeToHost: true,
    category: 'General Frontier',
    badge: 'Highest Value Open MoE',
    badgeColor: 'indigo',
    bestFor: 'General enterprise conversational AI, coding, multi-language translation, and ultra-cheap high-volume API requests.',
    inputPricePerMillionUSD: 0.14,
    outputPricePerMillionUSD: 0.28,
    cachedInputPriceUSD: 0.014,
    inputPriceINR: '₹12.04 / 1M tokens ($0.14) [FREE via Ollama]',
    outputPriceINR: '₹24.08 / 1M tokens ($0.28) [FREE via Ollama]',
    contextWindowTokens: 128000,
    contextWindowDisplay: '128K',
    maxOutputTokens: 8192,
    maxOutputDisplay: '8K',
    parameterCount: '671B (37B active MoE)',
    supportsVision: false,
    supportsAudio: false,
    supportsVideo: false,
    supportsFunctionCalling: true,
    supportsJSONSchema: true,
    mmluProScore: 85.2,
    humanEvalCodingScore: 89.1,
    mathScore: 89.3,
    arenaElo: 1328,
    speedTokensPerSec: 65,
    description: '671B Parameter Mixture-of-Experts model with Multi-head Latent Attention (MLA) and DeepSeekMoE architecture. Delivers GPT-4o level performance at unprecedentedly low operational costs.',
    idealUseCases: [
      'High-throughput RAG search answer generation',
      'Multi-turn conversational customer assistant',
      'Automated code generation and database query translation'
    ],
    limitations: ['Text-only (multimodal vision requires Janus-Pro model)'],
    ollamaCommand: 'ollama run deepseek-v3',
    apiSampleSnippet: `curl https://api.deepseek.com/chat/completions -H "Authorization: Bearer $KEY" -d '{"model": "deepseek-chat", "messages": [{"role": "user", "content": "Explain RAG architecture in detail"}]}'`
  },

  // ── 5. META MODELS (FREE OPEN WEIGHTS) ──
  {
    id: 'meta-llama-3-3-70b',
    name: 'Llama 3.3 70B Instruct',
    creator: 'Meta',
    creatorLogo: '🦙',
    licenseType: 'Open Weights / Free Self-Hosted',
    isOpenSource: true,
    isFreeToHost: true,
    category: 'General Frontier',
    badge: 'Leading Open Source Foundation',
    badgeColor: 'blue',
    bestFor: 'Self-hosted enterprise deployment, custom fine-tuning with LoRA/QLoRA, and total data sovereign AI.',
    inputPricePerMillionUSD: 0.40,
    outputPricePerMillionUSD: 0.90,
    inputPriceINR: '₹34.40 / 1M tokens ($0.40) [FREE via Ollama]',
    outputPriceINR: '₹77.40 / 1M tokens ($0.90) [FREE via Ollama]',
    contextWindowTokens: 128000,
    contextWindowDisplay: '128K',
    maxOutputTokens: 8192,
    maxOutputDisplay: '8K',
    parameterCount: '70B Dense',
    supportsVision: false,
    supportsAudio: false,
    supportsVideo: false,
    supportsFunctionCalling: true,
    supportsJSONSchema: true,
    mmluProScore: 86.0,
    humanEvalCodingScore: 88.2,
    mathScore: 88.6,
    arenaElo: 1320,
    speedTokensPerSec: 50,
    description: 'Meta’s latest flagship open-weight model matching the original Llama 3 405B capabilities within a compact 70B parameter footprint. Supports 128K context and commercial use.',
    idealUseCases: [
      'Self-hosted on-premise enterprise knowledge bases',
      'Domain-specific fine-tuning (Medical, Legal, Finance)',
      'High-privacy enterprise RAG pipelines'
    ],
    limitations: ['Requires at least 48GB VRAM (e.g. 2x RTX 3090/4090 or Mac M3/M4 Max 64GB)'],
    ollamaCommand: 'ollama run llama3.3:70b',
    apiSampleSnippet: `ollama run llama3.3:70b "Analyze this system architecture diagram in ASCII"`
  },
  {
    id: 'meta-llama-3-2-3b',
    name: 'Llama 3.2 3B & 1B',
    creator: 'Meta',
    creatorLogo: '🦙',
    licenseType: 'Open Weights / Free Self-Hosted',
    isOpenSource: true,
    isFreeToHost: true,
    category: 'Edge & On-Device',
    badge: 'Ultra-Lightweight Edge Model',
    badgeColor: 'emerald',
    bestFor: 'Mobile devices, Raspberry Pi, offline laptops, real-time edge processing, and battery-friendly AI.',
    inputPricePerMillionUSD: 0.05,
    outputPricePerMillionUSD: 0.15,
    inputPriceINR: '₹4.30 / 1M tokens ($0.05) [FREE via Ollama]',
    outputPriceINR: '₹12.90 / 1M tokens ($0.15) [FREE via Ollama]',
    contextWindowTokens: 128000,
    contextWindowDisplay: '128K',
    maxOutputTokens: 4096,
    maxOutputDisplay: '4K',
    parameterCount: '3B & 1B',
    supportsVision: true,
    supportsAudio: false,
    supportsVideo: false,
    supportsFunctionCalling: true,
    supportsJSONSchema: true,
    mmluProScore: 68.2,
    humanEvalCodingScore: 72.4,
    mathScore: 74.0,
    arenaElo: 1195,
    speedTokensPerSec: 180,
    description: 'Designed specifically for on-device and edge deployment. Runs smoothly on standard smartphones and standard 8GB RAM laptops while supporting 128K context and multimodal vision.',
    idealUseCases: [
      'Edge IoT and smart camera visual intelligence',
      'Mobile apps with zero cloud dependence and instant response',
      'Private offline desktop personal assistants'
    ],
    limitations: ['Simpler reasoning compared to 70B+ parameter models'],
    ollamaCommand: 'ollama run llama3.2:3b',
    apiSampleSnippet: `ollama run llama3.2:3b "Summarize this log entry"`
  },

  // ── 6. MISTRAL AI MODELS ──
  {
    id: 'mistral-large-2',
    name: 'Mistral Large 2',
    creator: 'Mistral AI',
    creatorLogo: '🌪️',
    licenseType: 'Commercial API / Research Weights',
    isOpenSource: false,
    isFreeToHost: false,
    category: 'General Frontier',
    badge: 'European Frontier Flagship',
    badgeColor: 'amber',
    bestFor: 'Multi-lingual European fluency (French, German, Spanish, Italian), code synthesis, and precise structured output adherence.',
    inputPricePerMillionUSD: 2.00,
    outputPricePerMillionUSD: 6.00,
    inputPriceINR: '₹172 / 1M tokens ($2.00)',
    outputPriceINR: '₹516 / 1M tokens ($6.00)',
    contextWindowTokens: 128000,
    contextWindowDisplay: '128K',
    maxOutputTokens: 8192,
    maxOutputDisplay: '8K',
    parameterCount: '123B',
    supportsVision: false,
    supportsAudio: false,
    supportsVideo: false,
    supportsFunctionCalling: true,
    supportsJSONSchema: true,
    mmluProScore: 84.0,
    humanEvalCodingScore: 89.5,
    mathScore: 88.2,
    arenaElo: 1318,
    speedTokensPerSec: 58,
    description: '123B parameter frontier flagship from Paris-based Mistral AI with top-tier multi-language fluency and advanced reasoning.',
    idealUseCases: [
      'Multilingual document translation and legal analysis',
      'Enterprise JSON tool calling workflows',
      'Code generation across 80+ programming languages'
    ],
    limitations: ['Text only; use Pixtral for vision tasks'],
    apiSampleSnippet: `import { MistralClient } from '@mistralai/mistralai';\nconst client = new MistralClient();\nconst res = await client.chat({ model: 'mistral-large-latest', messages: [{ role: 'user', content: 'Generate schema' }] });`
  },

  // ── 7. ALIBABA QWEN MODELS (FREE CODING SPECIALIST) ──
  {
    id: 'alibaba-qwen-2-5-coder-32b',
    name: 'Qwen 2.5 Coder 32B',
    creator: 'Alibaba',
    creatorLogo: '🦾',
    licenseType: 'Open Source (Apache 2.0 / MIT)',
    isOpenSource: true,
    isFreeToHost: true,
    category: 'Coding Specialist',
    badge: 'Open Weights Coding Champion',
    badgeColor: 'cyan',
    bestFor: 'Open-weights coding that rivals GPT-4o, IDE copilot integration, and local repository repair on consumer hardware.',
    inputPricePerMillionUSD: 0.30,
    outputPricePerMillionUSD: 0.80,
    inputPriceINR: '₹25.80 / 1M tokens ($0.30) [FREE via Ollama]',
    outputPriceINR: '₹68.80 / 1M tokens ($0.80) [FREE via Ollama]',
    contextWindowTokens: 128000,
    contextWindowDisplay: '128K',
    maxOutputTokens: 8192,
    maxOutputDisplay: '8K',
    parameterCount: '32B Dense',
    supportsVision: false,
    supportsAudio: false,
    supportsVideo: false,
    supportsFunctionCalling: true,
    supportsJSONSchema: true,
    mmluProScore: 83.2,
    humanEvalCodingScore: 92.7,
    mathScore: 90.4,
    arenaElo: 1330,
    speedTokensPerSec: 68,
    description: 'A 32B parameter coding powerhouse trained on 5.5 Trillion tokens of source code and math. Matches or beats commercial models on SWE-bench and HumanEval.',
    idealUseCases: [
      'Local VS Code / Cursor Copilot server with Continue.dev',
      'Automated pull request code refactoring',
      'Complex algorithmic problem generation and verification'
    ],
    limitations: ['Requires 20GB VRAM (runs on RTX 3090 / 4080 or Mac with 24GB Unified RAM)'],
    ollamaCommand: 'ollama run qwen2.5-coder:32b',
    apiSampleSnippet: `ollama run qwen2.5-coder:32b "Refactor this async SQL connection pool in TypeScript"`
  },

  // ── 8. MICROSOFT PHI-4 ──
  {
    id: 'microsoft-phi-4',
    name: 'Microsoft Phi-4 14B',
    creator: 'Microsoft',
    creatorLogo: '🪟',
    licenseType: 'Open Source (MIT)',
    isOpenSource: true,
    isFreeToHost: true,
    category: 'Reasoning & Math',
    badge: 'Compact Math & Logic Powerhouse',
    badgeColor: 'purple',
    bestFor: 'Academic research, high-quality synthetic data generation, and running advanced math models on modest hardware.',
    inputPricePerMillionUSD: 0.20,
    outputPricePerMillionUSD: 0.50,
    inputPriceINR: '₹17.20 / 1M tokens ($0.20) [FREE via Ollama]',
    outputPriceINR: '₹43.00 / 1M tokens ($0.50) [FREE via Ollama]',
    contextWindowTokens: 16384,
    contextWindowDisplay: '16K',
    maxOutputTokens: 4096,
    maxOutputDisplay: '4K',
    parameterCount: '14B Dense',
    supportsVision: false,
    supportsAudio: false,
    supportsVideo: false,
    supportsFunctionCalling: true,
    supportsJSONSchema: true,
    mmluProScore: 84.8,
    humanEvalCodingScore: 87.6,
    mathScore: 92.5,
    arenaElo: 1310,
    speedTokensPerSec: 85,
    description: 'Microsoft’s breakthrough 14B model trained on highly curated "Textbooks Are All You Need" synthetic datasets. Punches above its weight class in math, logic, and scientific reasoning.',
    idealUseCases: [
      'Offline scientific calculation and logic validation',
      'High-throughput synthetic data creation for smaller student models',
      'Local execution on standard gaming PCs (10GB+ VRAM)'
    ],
    limitations: ['Context window is 16K tokens (use Llama 3.3 or Gemini for massive documents)'],
    ollamaCommand: 'ollama run phi4',
    apiSampleSnippet: `ollama run phi4 "Solve this linear algebra eigenvector problem with full step-by-step calculus"`
  }
];

export const MODEL_PURPOSE_RECOMMENDATIONS = [
  {
    purpose: 'Deep Multi-Step Mathematical & Algorithmic Reasoning',
    icon: '🧠',
    topPick: 'OpenAI o1 / DeepSeek-R1',
    why: 'Uses internal reinforcement learning chain-of-thought to plan and verify proofs before answering.',
    bestFreeChoice: 'DeepSeek-R1 (Ollama FREE)',
    bestCommercialChoice: 'OpenAI o1 ($15/1M in, $60/1M out)'
  },
  {
    purpose: 'Full-Stack Software Engineering & Complex Coding',
    icon: '💻',
    topPick: 'Claude 3.5 Sonnet / Qwen 2.5 Coder',
    why: 'Highest HumanEval & SWE-bench accuracy, cleanest TypeScript/Python output, and excellent architectural awareness.',
    bestFreeChoice: 'Qwen 2.5 Coder 32B (Ollama FREE)',
    bestCommercialChoice: 'Claude 3.5 Sonnet ($3/1M in, $15/1M out)'
  },
  {
    purpose: 'Best Real-Time Speed & Ultra-Low Cost',
    icon: '⚡',
    topPick: 'Gemini 2.0 Flash / GPT-4o mini',
    why: 'Sub-second latency (110–145 tokens/sec), under $0.15/1M tokens, and exceptional function-calling capability.',
    bestFreeChoice: 'Llama 3.2 3B (Ollama FREE)',
    bestCommercialChoice: 'Gemini 2.0 Flash (₹8.60 / 1M in, ₹34.40 / 1M out)'
  },
  {
    purpose: 'Massive Document & Multi-Hour Video Analysis',
    icon: '📚',
    topPick: 'Google Gemini 1.5 Pro',
    why: 'World-record 2 Million token context window allowing entire repositories and multi-hour HD video processing without vector databases.',
    bestFreeChoice: 'Llama 3.3 70B (128K Context)',
    bestCommercialChoice: 'Gemini 1.5 Pro (2M Tokens Context)'
  },
  {
    purpose: 'Complete Privacy, Offline On-Premise & Data Sovereignty',
    icon: '🛡️',
    topPick: 'DeepSeek-R1 / Llama 3.3 70B',
    why: '100% open weights with Apache 2.0 / MIT licenses. Zero data leaves your local GPU or private data center.',
    bestFreeChoice: 'DeepSeek-R1 + Llama 3.3 70B',
    bestCommercialChoice: 'Self-Hosted vLLM / Ollama ($0 API Cost)'
  }
];
