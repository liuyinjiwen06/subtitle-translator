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
  // 优化构建输出，排除大文件
  webpack: (config, { isServer }) => {
    // 禁用webpack缓存以减小输出大小
    config.cache = false;
    return config;
  },
  // 环境变量配置
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  }
};

export default nextConfig;
