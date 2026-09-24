import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  outputFileTracingExcludes: {
    '*': [
      'public/**/*',
      'public/uploads/**/*',
      'public/uploads/utilities/**/*',
      'public/gazette/**/*',
      '.next/cache/**/*',
      'node_modules/@mediapipe/**/*',
      'node_modules/three/**/*',
      'node_modules/@tsparticles/**/*'
    ],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
