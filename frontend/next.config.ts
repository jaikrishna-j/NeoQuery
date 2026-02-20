import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Explicitly configure path resolution
  typescript: {
    ignoreBuildErrors: false,
  },
  // Ensure path aliases work in build
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "."),
    };
    return config;
  },
};

export default nextConfig;
