import { performance } from 'perf_hooks';
import { prisma } from '../lib/db/prisma';

async function breakdownQueries() {
  console.log('=== DASHBOARD QUERY PERFORMANCE BREAKDOWN ===');

  // Query 1: User Lookup
  const t0 = performance.now();
  const user = await prisma.user.findFirst({
    where: { status: 'Active' },
    select: { id: true, name: true, email: true, role: true, avatar: true, certificates: { select: { id: true } } },
  });
  const t1 = performance.now();
  console.log(`Query 1 — User Lookup | Exec Time: ${(t1 - t0).toFixed(2)} ms | Rows: 1`);

  // Query 2: Learning Phases
  const t2 = performance.now();
  const phases = await prisma.learningPhase.findMany({
    orderBy: { order: 'asc' },
    select: { id: true, order: true, title: true, description: true, courses: { select: { lessons: { select: { id: true } } } } },
  });
  const t3 = performance.now();
  console.log(`Query 2 — Learning Phases | Exec Time: ${(t3 - t2).toFixed(2)} ms | Rows: ${phases.length}`);

  // Query 3: Published Courses
  const t4 = performance.now();
  const courses = await prisma.course.findMany({
    where: { status: 'Published' },
    select: { id: true, title: true, description: true, level: true, category: true, phaseId: true, thumbnailIcon: true, lessons: { select: { id: true, durationMinutes: true } } },
    orderBy: { createdAt: 'desc' },
  });
  const t5 = performance.now();
  console.log(`Query 3 — Published Courses | Exec Time: ${(t5 - t4).toFixed(2)} ms | Rows: ${courses.length}`);

  // Query 4: Lessons List
  const t6 = performance.now();
  const lessons = await prisma.lesson.findMany({ select: { id: true } });
  const t7 = performance.now();
  console.log(`Query 4 — Lessons Summary | Exec Time: ${(t7 - t6).toFixed(2)} ms | Rows: ${lessons.length}`);

  // Query 5: Assessments
  const t8 = performance.now();
  const assessments = await prisma.assessment.findMany({
    where: { status: 'Published' },
    select: { id: true, name: true, type: true, difficulty: true },
  });
  const t9 = performance.now();
  console.log(`Query 5 — Assessments | Exec Time: ${(t9 - t8).toFixed(2)} ms | Rows: ${assessments.length}`);

  // Query 6: Projects
  const t10 = performance.now();
  const projects = await prisma.project.findMany({
    where: { status: 'Published' },
    select: { id: true, name: true, category: true, level: true, status: true },
  });
  const t11 = performance.now();
  console.log(`Query 6 — Projects | Exec Time: ${(t11 - t10).toFixed(2)} ms | Rows: ${projects.length}`);

  // Query 7: Contents
  const t12 = performance.now();
  const contents = await prisma.content.findMany({
    where: { status: 'Published' },
    select: { id: true, title: true, type: true, category: true },
    take: 10,
  });
  const t13 = performance.now();
  console.log(`Query 7 — Contents | Exec Time: ${(t13 - t12).toFixed(2)} ms | Rows: ${contents.length}`);

  // Query 8: Algorithms
  const t14 = performance.now();
  const algorithms = await prisma.algorithm.findMany({
    where: { status: 'Published' },
    select: { id: true, name: true, complexity: true, category: true },
    take: 10,
  });
  const t15 = performance.now();
  console.log(`Query 8 — Algorithms | Exec Time: ${(t15 - t14).toFixed(2)} ms | Rows: ${algorithms.length}`);

  // Query 9: Rooms
  const t16 = performance.now();
  const rooms = await prisma.learningRoom.findMany({
    select: { id: true, title: true, category: true, estimatedTime: true },
    take: 10,
  });
  const t17 = performance.now();
  console.log(`Query 9 — Learning Rooms | Exec Time: ${(t17 - t16).toFixed(2)} ms | Rows: ${rooms.length}`);

  // Query 10: User Activity (Indexed)
  const t18 = performance.now();
  const activities = await prisma.userActivity.findMany({
    where: { userId: user?.id },
    select: { durationSeconds: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  const t19 = performance.now();
  console.log(`Query 10 — User Activity (Indexed) | Exec Time: ${(t19 - t18).toFixed(2)} ms | Rows: ${activities.length}`);

  await prisma.$disconnect();
}

breakdownQueries();
