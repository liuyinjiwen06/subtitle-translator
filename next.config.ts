import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages with @cloudflare/next-on-pages 配置
  eslint: {
    // 在构建时忽略ESLint错误
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 在构建时忽略TypeScript错误
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true
  },
  // 环境变量配置
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  }
};

export default nextConfig;
