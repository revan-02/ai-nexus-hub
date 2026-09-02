import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AI Nexus Hub — Enterprise AI Knowledge & Placement Platform',
    short_name: 'AI Nexus',
    description:
      'Production-grade AI Knowledge Hub. Solve 10 innovative Agriculture AI challenges, FinTech cyber defense, VTU old papers with derivations, and AI interview simulators.',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#7c3aed',
    icons: [
      {
        src: '/robot-3d.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/robot-3d.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
