import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages 动态部署配置（支持 API 路由）
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
    // 禁用缓存以避免生成超过 25MB 的缓存文件
    config.cache = false;

    // 确保客户端代码不会在服务端运行
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },
  // 环境变量配置
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  }
};

export default nextConfig;
