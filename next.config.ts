import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the API checker: this environment suppresses the CLI checker's output.
  experimental: {
    useTypeScriptCli: false,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [85, 90, 95],
  },
};

export default nextConfig;
