import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Skip type checking and linting during production build
  // (these should be done in CI/CD or locally before deploy)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
