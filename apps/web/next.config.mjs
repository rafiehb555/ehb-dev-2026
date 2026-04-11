/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Hardening: disable Next.js image optimizer attack surface for now.
    // In production, prefer a CDN + explicit remotePatterns before enabling optimization.
    unoptimized: true,
  },
  experimental: {
    // Tree-shake lucide-react per icon file — avoids missing ./vendor-chunks/lucide-react.js in dev/SSR.
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;

