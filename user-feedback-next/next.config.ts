import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Convex expects ESM
  transpilePackages: ["convex"],
};

export default nextConfig;
