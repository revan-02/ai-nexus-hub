import { LearnerAgeBracket, AGE_PEDAGOGY_PROFILES } from './age-adaptive-engine';

export interface LessonPhasePlan {
  phaseId: string;
  order: number;
  title: string;
  phaseType: 'introduction' | 'concept' | 'demonstration' | 'real_world_example' | 'interactive_practice' | 'recap';
  durationSec: number;
  targetWordCount: number;
  teachingGoal: string;
  visualRequirement: string;
}

export interface StructuredLessonPlan {
  lessonId: string;
  topicTitle: string;
  ageBracket: LearnerAgeBracket;
  targetDurationSec: number; // e.g. 300 (5 mins)
  totalDurationSec?: number;
  targetBulletPoints?: number;
  phases: LessonPhasePlan[];
  estimatedTotalWords: number;
  expectedAudioDurationSec: number;
  minPointsPerLesson: number;
}

/**
 * Standard 6-Phase Lesson Blueprint for 5-minute (300-second) educational videos
 */
export const FIVE_MINUTE_LESSON_BLUEPRINT: Array<{
  phaseType: LessonPhasePlan['phaseType'];
  title: string;
  durationSec: number;
  teachingGoal: string;
  visualRequirement: string;
}> = [
  {
    phaseType: 'introduction',
    title: 'Introduction & Clear Learning Objectives',
    durationSec: 20,
    teachingGoal: 'Hook the learner, state what they will build or understand by the end',
    visualRequirement: 'Hero title card, animated objective checklist, smiling mentor badge',
  },
  {
    phaseType: 'concept',
    title: 'Core Concept & First-Principles Explanation',
    durationSec: 60,
    teachingGoal: 'Explain the fundamental intuition without unnecessary jargon, using progressive breakdown',
    visualRequirement: 'Diagrammatic concept flow, progressive highlight cards, conceptual metaphor',
  },
  {
    phaseType: 'demonstration',
    title: 'Step-by-Step Hands-On Demonstration',
    durationSec: 90,
    teachingGoal: 'Walk through concrete action, interactive code/simulator or visual experiment',
    visualRequirement: '60fps interactive simulator canvas, live code execution, animated parameters',
  },
  {
    phaseType: 'real_world_example',
    title: 'Real-World Case Study & Application',
    durationSec: 70,
    teachingGoal: 'Connect the concept to real-world applications the learner recognizes',
    visualRequirement: 'Real-world visual showcase, telemetry graphs, industry context card',
  },
  {
    phaseType: 'interactive_practice',
    title: 'Guided Practice & Comprehension Check',
    durationSec: 40,
    teachingGoal: 'Active learner recall with an interactive question or challenge',
    visualRequirement: 'Interactive multiple choice or sandbox slider, instant visual feedback',
  },
  {
    phaseType: 'recap',
    title: 'Key Takeaways & Next Milestone',
    durationSec: 20,
    teachingGoal: 'Summarize core insights and provide a preview of the upcoming lesson',
    visualRequirement: 'Summary milestone badge, reward stars, unlocked achievement',
  },
];

/**
 * Generates a duration-aware educational content plan tailored to age and target duration.
 */
export function generateDurationLessonPlan(
  topicTitle: string,
  ageBracket: LearnerAgeBracket,
  targetDurationSec: number = 300 // default 5 minutes
): StructuredLessonPlan {
  const profile = AGE_PEDAGOGY_PROFILES[ageBracket] || AGE_PEDAGOGY_PROFILES['18+'];
  const speakingWps = profile.targetSpeakingWpm / 60; // words per second

  // Scale phases proportionally if target duration differs from 300s
  const scale = targetDurationSec / 300;

  const phases: LessonPhasePlan[] = FIVE_MINUTE_LESSON_BLUEPRINT.map((b, idx) => {
    const duration = Math.round(b.durationSec * scale);
    const targetWordCount = Math.round(duration * speakingWps);
    return {
      phaseId: `phase-${idx + 1}-${b.phaseType}`,
      order: idx + 1,
      title: `${idx + 1}. ${b.title}`,
      phaseType: b.phaseType,
      durationSec: duration,
      targetWordCount,
      teachingGoal: b.teachingGoal,
      visualRequirement: b.visualRequirement,
    };
  });

  const totalWords = phases.reduce((acc, p) => acc + p.targetWordCount, 0);

  return {
    lessonId: `plan-${Date.now()}`,
    topicTitle,
    ageBracket,
    targetDurationSec,
    totalDurationSec: targetDurationSec,
    targetBulletPoints: 18,
    phases,
    estimatedTotalWords: totalWords,
    expectedAudioDurationSec: targetDurationSec,
    minPointsPerLesson: 6, // Mandatory 6 distinct structured phases
  };
}

/**
 * Validates whether a lesson's content contains sufficient substance for a 4–5 minute video.
 * Rejects sparse lessons with only 4-5 brief bullet points.
 */
export function validateLessonContentDepth(
  content: string | string[],
  targetDurationSec: number = 240
): {
  isSufficient: boolean;
  wordCount: number;
  minimumRequiredWords: number;
  sectionsCount: number;
  issues: string[];
  reason?: string;
} {
  const isArray = Array.isArray(content);
  const text = isArray ? content.join('\n') : (content || '');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  // For a 4-minute lesson at minimum 100wpm, we need at least 250 meaningful words (accounting for pauses/visuals)
  const minimumRequiredWords = Math.round((targetDurationSec / 60) * 75);
  const sections = text.split(/#{1,3}\s+/).filter((s) => s.trim().length > 20);

  const issues: string[] = [];

  if (isArray && content.length < 6) {
    issues.push(
      `Insufficient educational density: only ${content.length} bullet points provided. A 4-5 minute lesson requires deep, multi-phase points.`
    );
  }

  if (words < minimumRequiredWords) {
    issues.push(
      `Content has only ${words} words, which is insufficient for a ${Math.round(targetDurationSec / 60)}-minute lesson (minimum ${minimumRequiredWords} words required).`
    );
  }

  if (!isArray && sections.length < 4) {
    issues.push(
      `Lesson contains only ${sections.length} major sections. A complete lesson requires structured Introduction, Concept Explanation, Demonstration, and Real-World Example.`
    );
  }

  const isSufficient = issues.length === 0;

  return {
    isSufficient,
    wordCount: words,
    minimumRequiredWords,
    sectionsCount: isArray ? content.length : sections.length,
    issues,
    reason: issues.join('; '),
  };
}
