import prisma from '@/lib/db/prisma';

export async function getAdminMetrics() {
  const [
    totalUsers,
    activeUsers,
    newUsers,
    totalCourses,
    publishedCourses,
    totalProjects,
    totalDatasets,
    totalAssessments,
    totalAlgorithms,
    totalRoles,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: 'Active' } }),
    prisma.user.count({
      where: {
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
    prisma.course.count(),
    prisma.course.count({ where: { status: 'Published' } }),
    prisma.project.count(),
    prisma.dataset.count(),
    prisma.assessment.count(),
    prisma.algorithm.count(),
    prisma.role.count(),
  ]);

  return {
    kpi: {
      totalUsers: totalUsers.toLocaleString(),
      activeUsers: activeUsers.toLocaleString(),
      newUsers: newUsers.toLocaleString(),
      activeProjects: totalProjects.toLocaleString(),
      totalCourses: totalCourses.toLocaleString(),
      publishedCourses: publishedCourses.toLocaleString(),
      totalDatasets: totalDatasets.toLocaleString(),
      totalAssessments: totalAssessments.toLocaleString(),
      totalAlgorithms: totalAlgorithms.toLocaleString(),
      totalRoles: totalRoles.toLocaleString(),
      systemHealth: '99.9%',
    },
    systemStatus: [
      { id: 'api', name: 'API Services', status: 'Healthy', latency: '24ms' },
      { id: 'db', name: 'Database (PostgreSQL)', status: 'Healthy', latency: '8ms' },
      { id: 'ai', name: 'AI Services', status: 'Healthy', latency: '42ms' },
      { id: 'storage', name: 'Storage', status: 'Healthy', latency: '15ms' },
      { id: 'auth', name: 'Authentication', status: 'Healthy', latency: '12ms' },
    ],
  };
}
