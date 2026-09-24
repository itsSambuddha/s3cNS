import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  outputFileTracingExcludes: {
    '*': [
      './public/uploads/**/*',
      './public/**/*',
      './node_modules/@mediapipe/**/*',
      './node_modules/three/**/*'
    ],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
