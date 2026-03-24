/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Hardening: disable Next.js image optimizer attack surface for now.
    // In production, prefer a CDN + explicit remotePatterns before enabling optimization.
    unoptimized: true,
  },
};

export default nextConfig;

