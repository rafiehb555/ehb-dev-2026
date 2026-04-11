import path from 'path';
import type { NextConfig } from 'next';

/** Monorepo: Next infers the workspace root from a parent `package-lock.json`; point tracing at the repo root (`EHB landing-2026/`). */
const repoRoot = path.resolve(process.cwd(), '../../../../..');

const nextConfig: NextConfig = {
  outputFileTracingRoot: repoRoot,
  eslint: {
    // ESLint 9 + `react-hooks/rules-of-hooks` can throw `a.getScope is not a function` during `next build` (known toolchain mismatch).
    // Run `npm run lint` from this folder when upgrading `eslint-config-next`; keep CI/build green until upstream fix.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
