'use client';

import { REV_BODH_PYTHON_COURSE } from '@/lib/data/revbodh-python-course';
import {
  RevBodhCourse,
  RevBodhModule,
  RevBodhLesson,
  RevBodhQuizQuestion,
  RevBodhPracticeChallenge,
  RevBodhInterviewQuestion,
  ContentStatus,
} from '@/types/revbodh-course';

const STORAGE_KEY_COURSES = 'revbodh_custom_courses';
const STORAGE_KEY_PROGRESS = 'revbodh_user_progress';

export interface UserCourseProgressData {
  completedLessons: string[]; // lesson ids
  quizScores: Record<string, { score: number; total: number; percentage: number; passed: boolean }>; // lessonId -> score
  completedChallenges: string[]; // challenge ids
  completedProjects: string[]; // project ids
  lastActiveLessonId?: string;
  notes?: Record<string, string>;
}

export class RevBodhCourseService {
  /**
   * Retrieves all courses (Default Python Course + any admin-created courses)
   */
  static getCourses(): RevBodhCourse[] {
    if (typeof window === 'undefined') {
      return [REV_BODH_PYTHON_COURSE];
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY_COURSES);
      if (stored) {
        const customCourses: RevBodhCourse[] = JSON.parse(stored);
        // Replace or merge with default python course
        const hasPython = customCourses.some((c) => c.id === REV_BODH_PYTHON_COURSE.id);
        return hasPython ? customCourses : [REV_BODH_PYTHON_COURSE, ...customCourses];
      }
    } catch {
      // Fallback
    }

    return [REV_BODH_PYTHON_COURSE];
  }

  /**
   * Retrieves a single course by ID or slug
   */
  static getCourseById(courseId: string): RevBodhCourse | null {
    const courses = this.getCourses();
    const found = courses.find((c) => c.id === courseId || c.slug === courseId);
    return found || REV_BODH_PYTHON_COURSE;
  }

  /**
   * Retrieves a specific lesson by lessonId across a course
   */
  static getLesson(courseId: string, lessonId: string): {
    course: RevBodhCourse;
    module: RevBodhModule;
    lesson: RevBodhLesson;
    prevLesson?: RevBodhLesson;
    nextLesson?: RevBodhLesson;
  } | null {
    const course = this.getCourseById(courseId);
    if (!course) return null;

    // Flatten all lessons
    const allLessons: { module: RevBodhModule; lesson: RevBodhLesson }[] = [];
    course.modules.forEach((mod) => {
      mod.lessons.forEach((les) => {
        allLessons.push({ module: mod, lesson: les });
      });
    });

    const index = allLessons.findIndex((item) => item.lesson.id === lessonId);
    if (index === -1) {
      // Return first lesson as fallback if any exist
      if (allLessons.length > 0) {
        return {
          course,
          module: allLessons[0].module,
          lesson: allLessons[0].lesson,
          nextLesson: allLessons[1]?.lesson,
        };
      }
      return null;
    }

    return {
      course,
      module: allLessons[index].module,
      lesson: allLessons[index].lesson,
      prevLesson: allLessons[index - 1]?.lesson,
      nextLesson: allLessons[index + 1]?.lesson,
    };
  }

  /**
   * User Progress Tracking
   */
  static getUserProgress(courseId: string): UserCourseProgressData {
    if (typeof window === 'undefined') {
      return { completedLessons: [], quizScores: {}, completedChallenges: [], completedProjects: [] };
    }

    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PROGRESS}_${courseId}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }

    return { completedLessons: [], quizScores: {}, completedChallenges: [], completedProjects: [] };
  }

  static markLessonComplete(courseId: string, lessonId: string): UserCourseProgressData {
    const current = this.getUserProgress(courseId);
    if (!current.completedLessons.includes(lessonId)) {
      current.completedLessons.push(lessonId);
    }
    current.lastActiveLessonId = lessonId;

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`${STORAGE_KEY_PROGRESS}_${courseId}`, JSON.stringify(current));
      } catch {
        // ignore
      }
    }
    return current;
  }

  static recordQuizScore(
    courseId: string,
    lessonId: string,
    score: number,
    total: number
  ): UserCourseProgressData {
    const current = this.getUserProgress(courseId);
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    current.quizScores[lessonId] = {
      score,
      total,
      percentage,
      passed: percentage >= 70,
    };

    if (percentage >= 70 && !current.completedLessons.includes(lessonId)) {
      current.completedLessons.push(lessonId);
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`${STORAGE_KEY_PROGRESS}_${courseId}`, JSON.stringify(current));
      } catch {
        // ignore
      }
    }
    return current;
  }

  static recordChallengeComplete(courseId: string, challengeId: string): UserCourseProgressData {
    const current = this.getUserProgress(courseId);
    if (!current.completedChallenges.includes(challengeId)) {
      current.completedChallenges.push(challengeId);
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`${STORAGE_KEY_PROGRESS}_${courseId}`, JSON.stringify(current));
      } catch {
        // ignore
      }
    }
    return current;
  }

  static calculateCourseStats(courseId: string): {
    totalLessons: number;
    completedCount: number;
    percentComplete: number;
    recommendedNextLesson?: RevBodhLesson;
    weakTopics: string[];
    strongTopics: string[];
  } {
    const course = this.getCourseById(courseId);
    const progress = this.getUserProgress(courseId);

    if (!course) {
      return { totalLessons: 0, completedCount: 0, percentComplete: 0, weakTopics: [], strongTopics: [] };
    }

    const allLessons: RevBodhLesson[] = [];
    course.modules.forEach((mod) => {
      mod.lessons.forEach((l) => allLessons.push(l));
    });

    const totalLessons = allLessons.length;
    const completedCount = allLessons.filter((l) => progress.completedLessons.includes(l.id)).length;
    const percentComplete = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    // Find first uncompleted lesson
    const recommendedNextLesson = allLessons.find((l) => !progress.completedLessons.includes(l.id)) || allLessons[0];

    // Weak / Strong topics analysis based on quiz results
    const weakTopics: string[] = [];
    const strongTopics: string[] = [];

    Object.entries(progress.quizScores).forEach(([lessonId, attempt]) => {
      const match = allLessons.find((l) => l.id === lessonId);
      if (match) {
        if (attempt.percentage < 70) {
          weakTopics.push(match.title);
        } else if (attempt.percentage >= 90) {
          strongTopics.push(match.title);
        }
      }
    });

    return {
      totalLessons,
      completedCount,
      percentComplete,
      recommendedNextLesson,
      weakTopics,
      strongTopics,
    };
  }

  /**
   * ───────────────────────────────────────────────────────────────────────────
   * CMS / Content Management Functions (Admin / Instructors)
   * ───────────────────────────────────────────────────────────────────────────
   */
  static saveCourse(updatedCourse: RevBodhCourse): void {
    if (typeof window === 'undefined') return;

    const courses = this.getCourses();
    const index = courses.findIndex((c) => c.id === updatedCourse.id);

    if (index >= 0) {
      courses[index] = updatedCourse;
    } else {
      courses.push(updatedCourse);
    }

    try {
      localStorage.setItem(STORAGE_KEY_COURSES, JSON.stringify(courses));
    } catch {
      // ignore
    }
  }

  static updateLessonStatus(
    courseId: string,
    moduleId: string,
    lessonId: string,
    status: ContentStatus
  ): void {
    const course = this.getCourseById(courseId);
    if (!course) return;

    const mod = course.modules.find((m) => m.id === moduleId);
    if (!mod) return;

    const lesson = mod.lessons.find((l) => l.id === lessonId);
    if (!lesson) return;

    lesson.status = status;
    this.saveCourse(course);
  }

  static addLesson(courseId: string, moduleId: string, lesson: RevBodhLesson): void {
    const course = this.getCourseById(courseId);
    if (!course) return;

    const mod = course.modules.find((m) => m.id === moduleId);
    if (!mod) return;

    mod.lessons.push(lesson);
    course.totalLessons += 1;
    this.saveCourse(course);
  }

  static addModule(courseId: string, newModule: RevBodhModule): void {
    const course = this.getCourseById(courseId);
    if (!course) return;

    course.modules.push(newModule);
    course.totalModules = course.modules.length;
    this.saveCourse(course);
  }
}
