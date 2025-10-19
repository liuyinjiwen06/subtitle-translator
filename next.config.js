/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig = {
  reactStrictMode: true,

  // 优化配置
  compress: true,

  // 图片优化
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },

  // 环境变量（只暴露 NEXT_PUBLIC_ 开头的）
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    NEXT_PUBLIC_WORKERS_URL: process.env.NEXT_PUBLIC_WORKERS_URL || 'http://localhost:8787',
  },

  // 页面扩展名
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
};

module.exports = withNextIntl(nextConfig);
