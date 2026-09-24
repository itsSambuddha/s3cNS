import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,

  // Prevent heavy packages from being bundled INTO serverless functions.
  // These are kept as external dependencies loaded from node_modules at runtime.
  // This is the primary fix for the Vercel 250MB uncompressed function size limit.
  serverExternalPackages: [
    // Database & backend
    'mongoose',
    'mongodb',
    'firebase-admin',
    'ioredis',
    // Email
    'nodemailer',
    'resend',
    '@react-email/components',
    '@react-email/render',
    'react-email',
    // Heavy ML / 3D / graphics — server-side imports that leak through shared lib
    '@mediapipe/tasks-vision',
    'three',
    'three-globe',
    '@react-three/fiber',
    '@react-three/drei',
    // Particles
    '@tsparticles/engine',
    '@tsparticles/react',
    '@tsparticles/slim',
    // Misc large
    'sharp',
    'uploadthing',
    '@uploadthing/react',
  ],

  // Also exclude heavy assets from the file tracing step
  outputFileTracingExcludes: {
    '*': [
      'public/**/*',
      'public/uploads/**/*',
      'public/uploads/utilities/**/*',
      'public/gazette/**/*',
      '.next/cache/**/*',
      'node_modules/@mediapipe/**/*',
      'node_modules/three/**/*',
      'node_modules/@tsparticles/**/*',
      'node_modules/sharp/**/*',
      'node_modules/firebase-admin/**/*',
      'node_modules/@google-cloud/**/*',
      'node_modules/mongodb/**/*',
      'node_modules/mongoose/**/*',
    ],
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
