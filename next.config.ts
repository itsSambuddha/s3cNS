import type { NextConfig } from "next";

// Packages that are purely client-side: never needed in any serverless function.
// Excluding them globally from file tracing saves the most space across all routes.
const CLIENT_ONLY_PACKAGES = [
  'node_modules/@mediapipe/**/*',
  'node_modules/three/**/*',
  'node_modules/three-globe/**/*',
  'node_modules/@react-three/**/*',
  'node_modules/@tsparticles/**/*',
  'node_modules/cobe/**/*',
  'node_modules/dotted-map/**/*',
  'node_modules/gsap/**/*',
  'node_modules/lenis/**/*',
];

// Heavy server packages that exist in node_modules at Vercel runtime.
// Marking them external means webpack WON'T inline them into function JS bundles.
// Vercel's managed runtime already provides these via the function's node_modules trace.
const EXTERNAL_SERVER_PACKAGES = [
  'mongoose',
  'mongodb',
  'firebase-admin',
  'firebase-admin/app',
  'firebase-admin/messaging',
  'ioredis',
  'nodemailer',
  'resend',
  '@react-email/components',
  '@react-email/render',
  'react-email',
  'sharp',
  'uploadthing',
  '@uploadthing/react',
];

const nextConfig: NextConfig = {
  compress: true,

  // Step 1: Don't webpack-bundle these — they stay as require() calls at runtime.
  serverExternalPackages: EXTERNAL_SERVER_PACKAGES,

  // Step 2: Aggressively prune the output file trace.
  //
  // How Vercel calculates function size:
  //   The "uncompressed size" = all files copied into the function's bundle,
  //   including node_modules that Next.js's file tracer detected as used.
  //
  // The 318MB comes from firebase-admin's transitive deps (@google-cloud/*, gRPC
  // native binaries, protobuf, etc.) being traced into the utilities routes because
  // some shared lib (notificationService, firebaseAdmin) is included in the module graph.
  //
  // Fix: Exclude those packages from the trace for ALL routes ('*'). Routes that
  // genuinely need them (e.g. /api/notifications) will still work because Vercel's
  // Node.js runtime always has the FULL node_modules available — we're only telling
  // the *bundler* not to copy them into the lambda zip redundantly.
  outputFileTracingExcludes: {
    '*': [
      // Static assets — never needed server-side
      'public/**/*',
      'public/uploads/**/*',
      'public/gazette/**/*',
      '.next/cache/**/*',

      // Pure client-side packages
      ...CLIENT_ONLY_PACKAGES,

      // firebase-admin has massive optional deps (@google-cloud/*, grpc, protobuf).
      // These alone account for 150-200MB of the bloat.
      'node_modules/firebase-admin/**/*',
      'node_modules/@google-cloud/**/*',
      'node_modules/grpc/**/*',
      'node_modules/@grpc/**/*',
      'node_modules/protobufjs/**/*',
      'node_modules/google-auth-library/**/*',
      'node_modules/googleapis/**/*',
      'node_modules/googleapis-common/**/*',

      // sharp has large native binaries
      'node_modules/sharp/**/*',
      'node_modules/@img/**/*',

      // uploadthing & resend are not needed in most routes
      'node_modules/uploadthing/**/*',
      'node_modules/@uploadthing/**/*',
      'node_modules/resend/**/*',

      // react-email pulls in many heavy packages
      'node_modules/react-email/**/*',
      'node_modules/@react-email/**/*',
    ],
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
