import { z } from 'zod';

export type LearnerAgeBracket = '3-5' | '6-8' | '9-12' | '13-15' | '16-18' | '18+';

export interface AgePedagogyProfile {
  bracket: LearnerAgeBracket;
  label: string;
  maxSentenceWords: number;
  targetSpeakingWpm: number;
  complexityLevel: 'very_basic' | 'basic' | 'intermediate_beginner' | 'intermediate' | 'advanced_school' | 'configurable_adult';
  teachingApproach: string;
  allowedJargonLevel: 'none' | 'strictly_defined' | 'guided_technical' | 'full_technical';
  toneGuidance: string;
  exampleDomains: string[];
  primaryModality: string;
}

export const AGE_PEDAGOGY_PROFILES: Record<LearnerAgeBracket, AgePedagogyProfile> = {
  '3-5': {
    bracket: '3-5',
    label: 'Early Learners (Ages 3–5)',
    maxSentenceWords: 8,
    targetSpeakingWpm: 95,
    complexityLevel: 'very_basic',
    teachingApproach: 'Pictures, familiar toys, animals, rhymes, short sentences',
    allowedJargonLevel: 'none',
    toneGuidance: 'Warm, playful, highly enthusiastic, using friendly story characters',
    exampleDomains: ['Teddy bears', 'Apples & bananas', 'Puppies & kittens', 'Toy cars', 'Drawing colors'],
    primaryModality: 'visual_storytelling_tactile',
  },
  '6-8': {
    bracket: '6-8',
    label: 'Primary Explorers (Ages 6–8)',
    maxSentenceWords: 12,
    targetSpeakingWpm: 110,
    complexityLevel: 'basic',
    teachingApproach: 'Stories, colourful animations, everyday fun examples, interactive guessing',
    allowedJargonLevel: 'strictly_defined',
    toneGuidance: 'Encouraging, curious, adventure-themed',
    exampleDomains: ['Lego building blocks', 'Video game characters', 'Sorting school bags', 'Weather patterns'],
    primaryModality: 'gamified_interactive_visual',
  },
  '9-12': {
    bracket: '9-12',
    label: 'Upper Primary & Middle School (Ages 9–12)',
    maxSentenceWords: 16,
    targetSpeakingWpm: 125,
    complexityLevel: 'intermediate_beginner',
    teachingApproach: 'Practical experiments, guided explanations, interactive puzzles, visual logic',
    allowedJargonLevel: 'strictly_defined',
    toneGuidance: 'Inquisitive, hands-on maker attitude, step-by-step logic',
    exampleDomains: ['Scratch animations', 'Robotics sensors', 'Smartphone voice assistants', 'Sports scores'],
    primaryModality: 'logic_blocks_hands_on',
  },
  '13-15': {
    bracket: '13-15',
    label: 'Secondary Innovators (Ages 13–15)',
    maxSentenceWords: 20,
    targetSpeakingWpm: 135,
    complexityLevel: 'intermediate',
    teachingApproach: 'Real-world applications, charts, coordinate graphs, step-by-step algorithmic reasoning',
    allowedJargonLevel: 'guided_technical',
    toneGuidance: 'Inspiring, practical engineering mindset, cause-and-effect clarity',
    exampleDomains: ['Python coding', 'Social media recommendation feeds', 'Gaming physics', 'Weather forecasting'],
    primaryModality: 'applied_coding_visual_analytics',
  },
  '16-18': {
    bracket: '16-18',
    label: 'Pre-University & High School (Ages 16–18)',
    maxSentenceWords: 24,
    targetSpeakingWpm: 140,
    complexityLevel: 'advanced_school',
    teachingApproach: 'Detailed theoretical concepts, worked mathematical examples, formal problem-solving',
    allowedJargonLevel: 'full_technical',
    toneGuidance: 'Intellectually rigorous, university-prep, foundational STEM depth',
    exampleDomains: ['Linear algebra matrices', 'Calculus rates of change', 'Neural networks', 'Algorithmic time complexity'],
    primaryModality: 'mathematical_foundations_lab',
  },
  '18+': {
    bracket: '18+',
    label: 'Higher Education & Adult Professional (18+)',
    maxSentenceWords: 28,
    targetSpeakingWpm: 145,
    complexityLevel: 'configurable_adult',
    teachingApproach: 'System architectures, production engineering, enterprise workflows, research papers',
    allowedJargonLevel: 'full_technical',
    toneGuidance: 'Professional, concise, outcome-oriented, architectural precision',
    exampleDomains: ['Distributed multi-GPU training', 'Enterprise RAG pipelines', 'Kubernetes clusters', 'Production inference'],
    primaryModality: 'production_engineering_architecture',
  },
};

export const LessonValidationInputSchema = z.object({
  title: z.string().min(3),
  ageBracket: z.enum(['3-5', '6-8', '9-12', '13-15', '16-18', '18+']),
  content: z.string().min(10),
  learningObjectives: z.array(z.string()).min(1),
});

export interface AgeValidationResult {
  isValid: boolean;
  isSuitable: boolean;
  score: number; // 0 to 100
  targetBracket: LearnerAgeBracket;
  averageSentenceLength: number;
  maxSentenceWordsAllowed: number;
  detectedForbiddenJargon: string[];
  complexWordsFound: string[];
  recommendations: string[];
  recommendedActions: string[];
  simplifiedContent?: string;
}

// Banned or discouraged technical terms for young ages unless accompanied by immediate simplified definitions
const COMPLEX_TERMS_RESTRICTIONS: Record<LearnerAgeBracket, string[]> = {
  '3-5': [
    'algorithm', 'matrix', 'tensor', 'hyperparameter', 'asymptotic', 'vector',
    'backpropagation', 'derivative', 'gradient', 'convolutional', 'inference',
    'heuristic', 'optimization', 'eigenvalue', 'quantization', 'latency'
  ],
  '6-8': [
    'asymptotic', 'backpropagation', 'derivative', 'gradient', 'convolutional',
    'eigenvalue', 'quantization', 'loss function', 'cross-entropy', 'hyperparameter'
  ],
  '9-12': [
    'asymptotic', 'eigenvalue', 'loss gradient', 'hessian', 'backprop calculus',
    'kl divergence', 'hilbert space'
  ],
  '13-15': [
    'hessian', 'hilbert space', 'spectral radius', 'lagrangian multiplier'
  ],
  '16-18': [],
  '18+': [],
};

/**
 * Validates lesson content against the configured learner age bracket.
 */
export function validateContentForAge(
  content: string,
  ageBracket: LearnerAgeBracket
): AgeValidationResult {
  const profile = AGE_PEDAGOGY_PROFILES[ageBracket] || AGE_PEDAGOGY_PROFILES['18+'];
  const textClean = content.replace(/```[\s\S]*?```/g, ' ').replace(/[#*_`]/g, ' ');
  const sentences = textClean
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  let totalWords = 0;
  let maxEncountered = 0;
  sentences.forEach((sentence) => {
    const wordCount = sentence.split(/\s+/).filter(Boolean).length;
    totalWords += wordCount;
    if (wordCount > maxEncountered) maxEncountered = wordCount;
  });

  const avgWordsPerSentence = sentences.length > 0 ? Math.round(totalWords / sentences.length) : 0;

  // Check forbidden jargon
  const restrictedWords = COMPLEX_TERMS_RESTRICTIONS[ageBracket] || [];
  const lowerContent = content.toLowerCase();
  const detectedForbiddenJargon: string[] = [];

  for (const term of restrictedWords) {
    const regex = new RegExp(`\\b${term}\\b`, 'i');
    if (regex.test(lowerContent)) {
      detectedForbiddenJargon.push(term);
    }
  }

  const recommendations: string[] = [];
  let score = 100;

  // Sentence length penalty
  if (avgWordsPerSentence > profile.maxSentenceWords) {
    const excess = avgWordsPerSentence - profile.maxSentenceWords;
    const penalty = Math.min(35, excess * 4);
    score -= penalty;
    recommendations.push(
      `Sentences average ${avgWordsPerSentence} words, which exceeds the ${profile.maxSentenceWords}-word ceiling for ${profile.label}. Break sentences into shorter thoughts.`
    );
  }

  // Jargon penalty
  if (detectedForbiddenJargon.length > 0) {
    const penalty = Math.min(45, detectedForbiddenJargon.length * 15);
    score -= penalty;
    recommendations.push(
      `Found advanced technical vocabulary inappropriate for ${profile.label}: [${detectedForbiddenJargon.join(', ')}]. Replace with intuitive metaphors (${profile.teachingApproach}).`
    );
  }

  const isValid = score >= 70 && detectedForbiddenJargon.length === 0;

  return {
    isValid,
    isSuitable: isValid,
    score: Math.max(0, Math.min(100, score)),
    targetBracket: ageBracket,
    averageSentenceLength: avgWordsPerSentence,
    maxSentenceWordsAllowed: profile.maxSentenceWords,
    detectedForbiddenJargon,
    complexWordsFound: detectedForbiddenJargon,
    recommendations,
    recommendedActions: recommendations,
  };
}

/**
 * Automatically simplifies educational content to match the configured age bracket.
 */
export function simplifyForAgeGroup(content: string, ageBracket: LearnerAgeBracket): string {
  let simplified = content;

  if (ageBracket === '3-5') {
    simplified = simplified
      .replace(/algorithm/gi, 'step-by-step recipe')
      .replace(/computer brain|artificial intelligence|ai/gi, 'smart friendly robot')
      .replace(/training data/gi, 'fun picture books')
      .replace(/neural network/gi, 'thinking brain puzzle')
      .replace(/parameters/gi, 'tuning knobs')
      .replace(/optimization/gi, 'getting better with practice')
      .replace(/prediction/gi, 'clever guess');
  } else if (ageBracket === '6-8') {
    simplified = simplified
      .replace(/backpropagation|gradient descent/gi, 'learning from mistakes step by step')
      .replace(/neural network/gi, 'connected helper brain')
      .replace(/parameters/gi, 'tuning knobs')
      .replace(/optimization/gi, 'practice improvement')
      .replace(/loss function/gi, 'scorekeeper checking points')
      .replace(/training dataset/gi, 'collection of practice examples');
  } else if (ageBracket === '9-12') {
    simplified = simplified
      .replace(/backpropagation/gi, 'reverse error adjustment (backprop)')
      .replace(/hyperparameters|parameters/gi, 'tuning knobs and settings')
      .replace(/loss function/gi, 'error metric measuring difference between guess and reality');
  }

  return simplified;
}
