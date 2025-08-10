# 在线字幕翻译工具（Next.js 多语言版）

## 简介
基于 Next.js + Tailwind CSS + next-i18next 的多语言 SRT 字幕翻译工具，支持多语言界面、SEO、SRT 上传与翻译。

## 🆕 最新更新：translate-unified API

新增了统一翻译API (`/api/translate-unified`)，整合了所有翻译功能的优点：

### 主要特性
- **智能并发处理**：5-12个并发请求，速度提升5-10倍
- **智能内容分析**：自动跳过已翻译内容，避免重复处理  
- **三阶段错误处理**：主翻译 → 分类重试 → 兜底处理，确保100%覆盖
- **动态服务切换**：Google/OpenAI智能选择和自动切换
- **实时进度保存**：防止长时间翻译中断导致的进度丢失
- **完整用户反馈**：详细的进度显示、批次信息、服务状态

### API对比
| API | 适用场景 | 优点 | 缺点 |
|-----|---------|------|------|
| **translate-unified** | 🏆 **推荐** | 智能并发+完整性保证+最佳体验 | 新功能，需验证 |
| translate-stream | 小文件 | 重试机制完善 | 串行处理速度慢 |
| translate-advanced | 大文件 | 智能跳过+批处理 | 无重试机制 |
| translate | ❌ 已废弃 | 无 | 单点失败会中断 |

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
