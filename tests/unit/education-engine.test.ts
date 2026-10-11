import { describe, it, expect, beforeEach } from 'vitest';
import {
  validateContentForAge,
  simplifyForAgeGroup,
  AGE_PEDAGOGY_PROFILES,
} from '@/lib/education/age-adaptive-engine';
import {
  generateDurationLessonPlan,
  validateLessonContentDepth,
} from '@/lib/education/duration-lesson-planner';
import { SceneEngine, SceneDefinition } from '@/lib/education/scene-engine';
import { VoiceSyncEngine } from '@/lib/education/voice-sync-engine';
import { evaluateLessonQuality } from '@/lib/education/quality-evaluator';

describe('AI Educational Content Engine — Complete Test Suite', () => {
  describe('1. Age-Adaptive Pedagogy Engine', () => {
    it('should detect complex academic jargon as inappropriate for young ages (3-5)', () => {
      const advancedText =
        'This algorithm minimizes asymptotic computational complexity through stochastic gradient descent optimization.';
      const result = validateContentForAge(advancedText, '3-5');

      expect(result.isSuitable).toBe(false);
      expect(result.complexWordsFound.length).toBeGreaterThan(0);
      expect(result.recommendedActions.length).toBeGreaterThan(0);
    });

    it('should approve simple narrative language for young ages (3-5)', () => {
      const simpleText = 'Look at the robot. It can see a red ball! Good job, robot.';
      const result = validateContentForAge(simpleText, '3-5');

      expect(result.isSuitable).toBe(true);
      expect(result.complexWordsFound.length).toBe(0);
    });

    it('should simplify complex vocabulary into child-friendly concepts', () => {
      const complexText =
        'The neural network utilizes optimization and parameters for classification of tokens.';
      const simplified = simplifyForAgeGroup(complexText, '6-8');

      expect(simplified.toLowerCase()).toContain('brain');
      expect(simplified.toLowerCase()).toContain('tuning');
      expect(simplified.toLowerCase()).not.toContain('neural network');
    });

    it('should expose appropriate pedagogy profiles for all six age brackets', () => {
      const brackets = ['3-5', '6-8', '9-12', '13-15', '16-18', '18+'] as const;
      brackets.forEach((b) => {
        const profile = AGE_PEDAGOGY_PROFILES[b];
        expect(profile).toBeDefined();
        expect(profile.maxSentenceWords).toBeGreaterThan(0);
        expect(profile.primaryModality).toBeDefined();
      });
    });
  });

  describe('2. Duration-Aware Lesson Planner (4-5 Minute Rigor)', () => {
    it('should generate a structured 6-phase curriculum for a 300-second lesson', () => {
      const plan = generateDurationLessonPlan({
        topic: 'Attention Mechanism in Transformers',
        targetDurationSec: 300,
        ageBracket: '16-18',
        difficulty: 'intermediate',
      });

      expect(plan.phases.length).toBe(6);
      expect(plan.totalDurationSec).toBe(300);
      expect(plan.phases.map((p) => p.phaseType)).toEqual([
        'introduction',
        'concept',
        'demonstration',
        'real_world_example',
        'interactive_practice',
        'recap',
      ]);
      expect(plan.targetBulletPoints).toBeGreaterThanOrEqual(18);
    });

    it('should reject superficial 4-5 bullet point lessons for a 5-minute video', () => {
      const superficialBullets = [
        'AI is fast.',
        'It has models.',
        'Data is trained.',
        'Here is the end.',
      ];
      const validation = validateLessonContentDepth(superficialBullets, 240);

      expect(validation.isSufficient).toBe(false);
      expect(validation.reason).toContain('Insufficient educational density');
    });

    it('should accept rich, multifaceted lesson content meeting duration targets', () => {
      const richBullets = Array.from(
        { length: 12 },
        (_, i) =>
          `Phase ${i + 1}: Here is a comprehensive analytical deep dive into Transformer Multi-Head Attention mechanisms, dot-product scaling, softmax distribution properties, and computational runtime complexity for real-time model inference and neural generation.`
      );
      const validation = validateLessonContentDepth(richBullets, 240);

      expect(validation.isSufficient).toBe(true);
    });
  });

  describe('3. Scene Studio & Isolated Delta Engine', () => {
    let initialScenes: SceneDefinition[];
    let engine: SceneEngine;

    beforeEach(() => {
      initialScenes = [
        {
          sceneId: 'scene-1',
          title: 'Introduction to Tensors',
          narrationText: 'Tensors are multidimensional arrays.',
          durationSec: 30,
          startTimeSec: 0,
          status: 'ready',
          version: 1,
        },
        {
          sceneId: 'scene-2',
          title: 'Matrix Multiplication',
          narrationText: 'Multiplying weights by inputs.',
          durationSec: 60,
          startTimeSec: 30,
          status: 'ready',
          version: 1,
        },
        {
          sceneId: 'scene-3',
          title: 'Gradient Descent',
          narrationText: 'Backpropagating through layers.',
          durationSec: 90,
          startTimeSec: 90,
          status: 'ready',
          version: 1,
        },
      ];
      engine = new SceneEngine('course-matrix-101', initialScenes);
    });

    it('should update only the targeted scene without mutating sibling versions', () => {
      const updateResult = engine.updateScene('scene-2', {
        title: 'High-Performance Matrix Ops',
        narrationText: 'Updated GEMM kernel explanation.',
      });

      expect(updateResult.success).toBe(true);
      expect(updateResult.updatedScene?.version).toBe(2);

      const allScenes = engine.getScenes();
      const scene1 = allScenes.find((s) => s.sceneId === 'scene-1');
      const scene2 = allScenes.find((s) => s.sceneId === 'scene-2');
      const scene3 = allScenes.find((s) => s.sceneId === 'scene-3');

      expect(scene1?.version).toBe(1);
      expect(scene2?.version).toBe(2);
      expect(scene3?.version).toBe(1);
      expect(scene2?.title).toBe('High-Performance Matrix Ops');
    });

    it('should automatically ripple start times forward when a scene duration changes', () => {
      engine.updateScene('scene-2', { durationSec: 100 });
      const allScenes = engine.getScenes();

      const scene2 = allScenes.find((s) => s.sceneId === 'scene-2');
      const scene3 = allScenes.find((s) => s.sceneId === 'scene-3');

      expect(scene2?.startTimeSec).toBe(30);
      expect(scene3?.startTimeSec).toBe(130); // 30 + 100
    });

    it('should record history snapshots and rollback successfully upon request', () => {
      engine.updateScene('scene-1', { title: 'Experimental Bad Title' });
      expect(engine.getScenes()[0].title).toBe('Experimental Bad Title');

      const rollbackResult = engine.rollback();
      expect(rollbackResult.success).toBe(true);
      expect(engine.getScenes()[0].title).toBe('Introduction to Tensors');
      expect(engine.getScenes()[0].version).toBe(1);
    });
  });

  describe('4. Voice Sync & Anti-Loop Engine', () => {
    let voiceEngine: VoiceSyncEngine;

    beforeEach(() => {
      voiceEngine = new VoiceSyncEngine();
    });

    it('should generate consistent SHA-like hashes for segments', () => {
      const id1 = voiceEngine.generateSegmentId('scene-1', 'Hello learners');
      const id2 = voiceEngine.generateSegmentId('scene-1', 'Hello learners');
      const id3 = voiceEngine.generateSegmentId('scene-1', 'Different text');

      expect(id1).toBe(id2);
      expect(id1).not.toBe(id3);
    });

    it('should reject duplicate execution requests for the same segment ID to prevent infinite loops', () => {
      const segId = 'seg-abc-123';
      const firstAttempt = voiceEngine.startSegment(segId, 'First attempt');
      expect(firstAttempt.allowed).toBe(true);

      const secondAttempt = voiceEngine.startSegment(segId, 'Repeat attempt');
      expect(secondAttempt.allowed).toBe(false);
      expect(secondAttempt.reason).toContain('Duplicate execution prevented');
    });

    it('should complete segment cleanly and update playback stats', () => {
      const segId = 'seg-xyz-789';
      voiceEngine.startSegment(segId, 'Test narration');
      voiceEngine.completeSegment(segId);

      const status = voiceEngine.getStatus();
      expect(status.completedSegmentsCount).toBe(1);
      expect(status.activeSegmentId).toBeNull();
    });
  });

  describe('5. Automated 10-Dimension Educational Quality Evaluator', () => {
    it('should compute comprehensive audit report with all 10 dimensions', () => {
      const report = evaluateLessonQuality({
        title: 'Mastering Convolutional Neural Networks',
        content: `
          Welcome to the deep dive into Convolutional Neural Networks!
          In this session, we will break down convolution kernels, feature maps, and max pooling step by step.
          First, let us explore the mathematical intuition behind 2D convolutions with concrete matrices.
          Next, examine the live interactive demo where we filter an edge-detection image.
          Notice how the horizontal and vertical Sobel filters extract high-frequency gradients.
          Now, compare this with real-world applications in autonomous driving and medical imaging MRI diagnosis.
          Try adjusting the stride and padding parameters to observe feature map dimension shifts.
          In summary, CNNs provide spatial invariance and parameter sharing essential for vision AI.
        `,
        ageBracket: '16-18',
        targetDurationSec: 280,
        scenesCount: 6,
      });

      expect(report.dimensions.length).toBe(10);
      expect(report.overallScore).toBeGreaterThanOrEqual(75);
      expect(['A+', 'A', 'B']).toContain(report.grade);

      const dimNames = report.dimensions.map((d) => d.name);
      expect(dimNames).toContain('Age Appropriateness');
      expect(dimNames).toContain('Duration & Depth Planning');
      expect(dimNames).toContain('Pacing & Cognitive Load');
      expect(dimNames).toContain('Visual & Audio Synchronicity');
      expect(dimNames).toContain('Concept Depth & Clarity');
      expect(dimNames).toContain('Interactive Retention');
    });
  });
});
