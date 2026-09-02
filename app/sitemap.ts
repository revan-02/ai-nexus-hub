import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ainexus.platform.io';
  const now = new Date();

  // Public Core & Feature Routes
  const publicRoutes = [
    '',
    '/dashboard',
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

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '' || route === '/dashboard' || route === '/challenges' || route === '/daily-challenge' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route === '/daily-challenge' ? 1.0 : route === '/challenges' || route === '/careers' || route === '/vtu-question-papers' ? 0.9 : 0.8,
  }));
}
