import { describe, it, expect } from 'vitest';
import { getLearnerDashboardData } from '@/services/dashboard-service';

describe('DashboardService Business Logic', () => {
  it('should fetch database-driven learner dashboard data with structured fields', async () => {
    const data = await getLearnerDashboardData('usr-7');

    expect(data).toBeDefined();
    expect(data.user).toBeDefined();
    expect(data.user.id).toBe('usr-7');
    expect(data.levelMeta).toBeDefined();
    expect(typeof data.levelMeta.completionPercent).toBe('number');
    expect(typeof data.levelMeta.lessonsCompleted).toBe('number');
    expect(typeof data.levelMeta.quizzesTaken).toBe('number');
    expect(typeof data.levelMeta.projectsCompleted).toBe('number');
    expect(typeof data.levelMeta.streakDays).toBe('number');
    expect(typeof data.levelMeta.timeSpent).toBe('string');
  });

  it('should return 6 learning phases with valid progression status', async () => {
    const data = await getLearnerDashboardData('usr-7');

    expect(data.steps.length).toBeGreaterThanOrEqual(6);
    for (const step of data.steps) {
      expect(['completed', 'in_progress', 'available', 'locked']).toContain(step.status);
      expect(typeof step.progress).toBe('number');
      expect(step.progress).toBeGreaterThanOrEqual(0);
      expect(step.progress).toBeLessThanOrEqual(100);
    }
  });

  it('should calculate active course progress dynamically from database records', async () => {
    const data = await getLearnerDashboardData('usr-7');

    expect(Array.isArray(data.activeCourses)).toBe(true);
    for (const course of data.activeCourses) {
      expect(['completed', 'in_progress', 'available', 'locked']).toContain(course.status);
      expect(['Review', 'Continue', 'Start Lesson', 'Locked']).toContain(course.action);
      expect(typeof course.progress).toBe('number');
    }
  });
});
