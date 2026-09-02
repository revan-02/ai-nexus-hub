import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  compress: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  devIndicators: false,
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'recharts',
      'framer-motion',
      'katex',
      'clsx',
      'tailwind-merge',
      '@tanstack/react-query',
    ],
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  async redirects() {
    return [
      {
        source: '/cms',
        destination: '/content',
        permanent: false,
      },
      {
        source: '/cms/login',
        destination: '/login',
        permanent: false,
      },
      {
        source: '/admin/login',
        destination: '/login',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
