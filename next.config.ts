import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // reactStrictMode: true, // Temporarily disabled to debug auth
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
