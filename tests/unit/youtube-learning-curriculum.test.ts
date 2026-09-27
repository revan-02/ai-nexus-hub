import { describe, it, expect } from 'vitest';
import {
  getTopicCurriculum,
  getAllCurricula,
  TOPIC_CURRICULA,
  YouTubeLearningResource,
} from '@/lib/data/youtube-learning-resources';

describe('YouTube Educational Content & Learning Room Architecture', () => {
  it('should retrieve a comprehensive curriculum for room-1 (What is AI?)', () => {
    const curriculum = getTopicCurriculum('room-1');

    expect(curriculum).toBeDefined();
    expect(curriculum.topicId).toBe('room-1');
    expect(curriculum.topicTitle).toContain('What is AI');
    expect(curriculum.category).toBe('AI Foundations & Machine Learning');
    expect(curriculum.level).toBe('Novice');
    expect(curriculum.aiNexusExplanation.length).toBeGreaterThan(50);

    // 1. Learning Objectives
    expect(curriculum.learningObjectives.length).toBeGreaterThanOrEqual(4);

    // 2. Recommended YouTube Videos
    expect(curriculum.recommendedVideos.length).toBeGreaterThanOrEqual(2);

    // 3. What You Should Learn
    expect(curriculum.whatYouShouldLearn.length).toBeGreaterThanOrEqual(3);

    // 4. AI Nexus Notes & Code Walkthrough
    expect(curriculum.aiNexusNotes.length).toBeGreaterThanOrEqual(1);
    expect(curriculum.aiNexusNotes[0].codeSnippet).toBeDefined();

    // 5. Practice Questions
    expect(curriculum.practiceQuestions.length).toBeGreaterThanOrEqual(2);

    // 6. Real-World Enterprise Challenge
    expect(curriculum.realWorldChallenge).toBeDefined();
    expect(curriculum.realWorldChallenge.companyContext).toBeDefined();
    expect(curriculum.realWorldChallenge.requirements.length).toBeGreaterThanOrEqual(2);
    expect(curriculum.realWorldChallenge.solutionGuide.length).toBeGreaterThan(30);

    // 7. Placement & Interview Preparation
    expect(curriculum.placementPrep).toBeDefined();
    expect(curriculum.placementPrep.companyNames.length).toBeGreaterThanOrEqual(3);
    expect(curriculum.placementPrep.interviewQuestions.length).toBeGreaterThanOrEqual(2);
    expect(curriculum.placementPrep.practicalCodingTask).toBeDefined();
  });

  it('should enforce strict YouTube copyright, attribution and embed compliance', () => {
    const allCurricula = getAllCurricula();

    for (const curriculum of allCurricula) {
      for (const video of curriculum.recommendedVideos) {
        // Must have non-empty video title & channel name
        expect(video.title.trim().length).toBeGreaterThan(0);
        expect(video.channelName.trim().length).toBeGreaterThan(0);

        // Must have official YouTube source URL
        expect(video.sourceUrl).toMatch(/^https:\/\/(www\.)?youtube\.com\/watch\?v=/);

        // Must have official privacy-enhanced embed URL
        expect(video.embedUrl).toMatch(/^https:\/\/www\.youtube-nocookie\.com\/embed\//);

        // Must have YouTube video ID matching URL parameter
        expect(video.embedUrl).toContain(video.youtubeVideoId);
        expect(video.sourceUrl).toContain(video.youtubeVideoId);

        // Must include creator attribution and copyright notice
        expect(video.copyrightNotice).toBeDefined();
        expect(video.copyrightNotice.toLowerCase()).toContain(video.channelName.toLowerCase());
        expect(video.copyrightNotice).toContain('YouTube');

        // Must provide relevance explanation
        expect(video.relevanceReason.length).toBeGreaterThan(20);

        // Must provide key takeaway concepts
        expect(video.keyTakeaways.length).toBeGreaterThanOrEqual(2);

        // Must specify duration and difficulty
        expect(video.duration).toBeDefined();
        expect(['Beginner', 'Intermediate', 'Advanced', 'Expert']).toContain(video.difficulty);
      }
    }
  });

  it('should gracefully synthesize a structured curriculum for dynamic room IDs', () => {
    const unknownCurriculum = getTopicCurriculum('room-quantum-ml');

    expect(unknownCurriculum).toBeDefined();
    expect(unknownCurriculum.topicId).toBe('room-quantum-ml');
    expect(unknownCurriculum.topicTitle).toContain('Quantum Ml');
    expect(unknownCurriculum.recommendedVideos.length).toBeGreaterThanOrEqual(1);
    expect(unknownCurriculum.learningObjectives.length).toBeGreaterThanOrEqual(1);
    expect(unknownCurriculum.aiNexusNotes.length).toBeGreaterThanOrEqual(1);
    expect(unknownCurriculum.practiceQuestions.length).toBeGreaterThanOrEqual(1);
    expect(unknownCurriculum.realWorldChallenge).toBeDefined();
    expect(unknownCurriculum.placementPrep).toBeDefined();
  });

  it('should have valid practice quiz answers matching available options', () => {
    const room1 = getTopicCurriculum('room-1');

    for (const q of room1.practiceQuestions) {
      expect(q.options).toContain(q.correctAnswer);
      expect(q.explanation.length).toBeGreaterThan(15);
    }
  });
});
