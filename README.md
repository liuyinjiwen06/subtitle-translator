# 在线字幕翻译工具（Next.js 多语言版）

## 简介
基于 Next.js + Tailwind CSS + next-i18next 的多语言 SRT 字幕翻译工具，支持多语言界面、SEO、SRT 上传与翻译。

## 安装依赖
```bash
npm install
```

## 启动开发环境
```bash
npm run dev
```

## 主要功能
- SRT 字幕上传与格式校验
- 多语言界面与路由
- SEO 友好
- 翻译进度与下载
- 现代化 UI

## 目录结构
- `/src/app` 主要页面与组件
- `/public/locales` 多语言文案
- `/pages/api/translate.ts` 字幕翻译 API

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
