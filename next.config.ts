import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages 配置
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true
  },
  // 保持默认输出模式以支持API路由
  experimental: {
    esmExternals: false
  },
  // 环境变量配置
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  }
};

export default nextConfig;
