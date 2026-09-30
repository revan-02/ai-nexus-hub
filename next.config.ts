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
  output: undefined,
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins.push({
        apply(compiler: any) {
          compiler.hooks.afterEmit.tap('EnsureNftJson', () => {
            try {
              const fs = require('fs');
              const path = require('path');
              const distDir = path.resolve(process.cwd(), '.next');
              if (!fs.existsSync(distDir)) {
                fs.mkdirSync(distDir, { recursive: true });
              }
              const nftFile = path.join(distDir, 'next-server.js.nft.json');
              if (!fs.existsSync(nftFile)) {
                fs.writeFileSync(nftFile, JSON.stringify({ version: 1, files: [] }));
              }
              const minimalNftFile = path.join(distDir, 'next-minimal-server.js.nft.json');
              if (!fs.existsSync(minimalNftFile)) {
                fs.writeFileSync(minimalNftFile, JSON.stringify({ version: 1, files: [] }));
              }
            } catch {}
          });
        },
      });
    }
    return config;
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
