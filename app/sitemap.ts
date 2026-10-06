import { MetadataRoute } from 'next';
import { mockCoursesList } from '@/lib/mock-data/courses-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ainexus.platform.io';
  const now = new Date();

  // Public Core & Feature Routes
  const publicRoutes = [
    '',
    '/courses',
    '/model-comparison',
    '/pricing',
    '/daily-challenge',
    '/challenges',
    '/careers',
    '/interview-prep',
    '/vtu-question-papers',
    '/prompt-engineering',
    '/ollama',
    '/ai-architecture',
    '/ai-overview',
    '/roadmap',
    '/algorithms',
    '/use-cases',
    '/real-world-problems',
    '/datasets',
    '/ai-tools',
    '/create-ai',
    '/projects',
    '/community',
    '/quizzes',
    '/performance-test',
    '/privacy-policy',
    '/terms-and-conditions',
    '/reports',
    '/learning/beginner',
    '/learning/intermediate',
    '/learning/advanced',
    '/learning/expert',
  ];

  const staticEntries: MetadataRoute.Sitemap = publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency:
      route === '' || route === '/courses' || route === '/daily-challenge' || route === '/challenges'
        ? 'daily'
        : 'weekly',
    priority:
      route === ''
        ? 1.0
        : route === '/courses' || route === '/daily-challenge'
        ? 0.95
        : route === '/challenges' || route === '/careers' || route === '/vtu-question-papers' || route === '/model-comparison'
        ? 0.9
        : 0.8,
  }));

  // Dynamic Course Entries for Rich Search Indexing
  const courseEntries: MetadataRoute.Sitemap = mockCoursesList
    .filter((c) => c.status === 'Published')
    .map((c) => ({
      url: `${baseUrl}/courses?id=${c.id}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    }));

  return [...staticEntries, ...courseEntries];
}
