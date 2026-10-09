import { describe, it, expect } from 'vitest';
import {
  getTopicCurriculum,
  getAllCurricula,
  TOPIC_CURRICULA,
} from '@/lib/data/youtube-learning-resources';
import { REV_BODH_PYTHON_COURSE } from '@/lib/data/revbodh-python-course';
import { RevBodhCourseService } from '@/services/revbodh-course-service';

describe('RevBodh Original Educational Content & Flagship Curriculum', () => {
  it('should verify the Python Programming flagship course contains all 18 structured modules', () => {
    expect(REV_BODH_PYTHON_COURSE).toBeDefined();
    expect(REV_BODH_PYTHON_COURSE.id).toBe('revbodh-python-mastery');
    expect(REV_BODH_PYTHON_COURSE.modules.length).toBe(18);

    // Verify Modules 1 through 18
    const moduleTitles = REV_BODH_PYTHON_COURSE.modules.map((m) => m.title);
    expect(moduleTitles[0]).toContain('Python Fundamentals');
    expect(moduleTitles[1]).toContain('Operators');
    expect(moduleTitles[2]).toContain('Conditional Statements');
    expect(moduleTitles[3]).toContain('Loops');
    expect(moduleTitles[4]).toContain('Functions');
    expect(moduleTitles[5]).toContain('Lists, Tuples');
    expect(moduleTitles[17]).toContain('Capstone Projects');
  });

  it('should verify lessons adhere to RevBodh pedagogical standard (Objectives, Concept, Mistakes, Sandbox, Quiz)', () => {
    const modulesWithLessons = REV_BODH_PYTHON_COURSE.modules.filter((m) => m.lessons.length > 0);
    expect(modulesWithLessons.length).toBeGreaterThan(0);

    for (const mod of modulesWithLessons) {
      for (const lesson of mod.lessons) {
        // Objectives
        expect(lesson.learningObjectives.length).toBeGreaterThanOrEqual(2);

        // Concept Explanation (Original Markdown)
        expect(lesson.conceptExplanation.detailedMarkdown.length).toBeGreaterThan(50);

        // Code Examples
        expect(lesson.examples.length).toBeGreaterThanOrEqual(1);
        expect(lesson.examples[0].code.length).toBeGreaterThan(10);

        // Common Mistakes
        expect(lesson.commonMistakes.length).toBeGreaterThanOrEqual(1);
        expect(lesson.commonMistakes[0].howToAvoid.length).toBeGreaterThan(10);

        // Real-World Application
        expect(lesson.realWorldApplication.industryContext.length).toBeGreaterThan(10);

        // Practice Challenge (if present on lesson)
        if (lesson.practiceChallenge) {
          expect(lesson.practiceChallenge.starterCode.length).toBeGreaterThan(5);
        }

        // Quiz Questions
        expect(lesson.quizQuestions.length).toBeGreaterThanOrEqual(1);
        expect(lesson.quizQuestions[0].options.length).toBeGreaterThanOrEqual(2);
        expect(lesson.quizQuestions[0].correctAnswerIndex).toBeGreaterThanOrEqual(0);

        // Interview Questions
        expect(lesson.interviewQuestions.length).toBeGreaterThanOrEqual(1);
        expect(lesson.interviewQuestions[0].exampleAnswer.length).toBeGreaterThan(20);
      }
    }
  });

  it('should verify the course includes full capstone projects', () => {
    expect(REV_BODH_PYTHON_COURSE.capstoneProjects.length).toBe(3);
    const projectTitles = REV_BODH_PYTHON_COURSE.capstoneProjects.map((p) => p.title);
    expect(projectTitles).toContain('Personal Finance & Expense Tracker CLI');
    expect(projectTitles).toContain('Student Academic Management & Grading System');
    expect(projectTitles).toContain('AI Resume Analyzer & Job Fit Scoring Engine');
  });

  it('should track user progress and quiz evaluations correctly through RevBodhCourseService', () => {
    const courseId = REV_BODH_PYTHON_COURSE.id;
    const lessonId = REV_BODH_PYTHON_COURSE.modules[0].lessons[0].id;

    // Record quiz score
    const updated = RevBodhCourseService.recordQuizScore(courseId, lessonId, 4, 4);
    expect(updated.quizScores[lessonId].percentage).toBe(100);
    expect(updated.quizScores[lessonId].passed).toBe(true);
    expect(updated.completedLessons).toContain(lessonId);

    // Calculate course stats
    const stats = RevBodhCourseService.calculateCourseStats(courseId);
    expect(stats.totalLessons).toBeGreaterThan(0);
    expect(stats.completedCount).toBeGreaterThanOrEqual(1);
  });

  it('should verify zero YouTube links or video dependencies in Python curriculum', () => {
    const serialized = JSON.stringify(REV_BODH_PYTHON_COURSE);
    expect(serialized).not.toContain('youtube.com');
    expect(serialized).not.toContain('youtu.be');
  });

  it('should retrieve a comprehensive curriculum for room-1', () => {
    const curriculum = getTopicCurriculum('room-1');
    expect(curriculum).toBeDefined();
    expect(curriculum.topicId).toBe('room-1');
    expect(curriculum.topicTitle).toContain('What is AI');
    expect(curriculum.learningObjectives.length).toBeGreaterThanOrEqual(4);
    expect(curriculum.aiNexusNotes.length).toBeGreaterThanOrEqual(1);
    expect(curriculum.practiceQuestions.length).toBeGreaterThanOrEqual(2);
    expect(curriculum.realWorldChallenge).toBeDefined();
    expect(curriculum.placementPrep).toBeDefined();
  });
});
