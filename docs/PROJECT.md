# 字幕翻译器项目文档

## 📌 项目概述

**项目名称**: Subtitle Translator (字幕翻译器)
**部署平台**: Cloudflare Pages + Workers
**目标用户**: 全球公开访客
**项目状态**: 🟢 **核心功能完成，待部署**

### 核心功能
用户上传 SRT 字幕文件，选择源语言和目标语言，使用 OpenAI API 进行翻译，输出翻译后的字幕文件（支持单语或双语格式）。

---

## 🎯 需求背景

### 业务需求
- 为全球用户提供免费的字幕翻译服务
- 支持世界上最常用的 50 种语言互译
- 界面友好，SEO 优化，支持 20 种 UI 语言
- 低成本运营（预算约 $10/月）

### 技术需求
- 安全：API 密钥不暴露给前端
- 稳定：错误处理、速率限制防止滥用
- 可维护：代码简洁，文档完善
- SEO 友好：多语言路由、元数据优化

---

## 📋 功能清单

### 核心功能
- [x] ✅ 文档规划
- [x] ✅ SRT 文件上传（客户端解析，最大 5MB，拖拽支持）
- [x] ✅ 语言选择器（50 种语言，支持搜索）
- [x] ✅ 翻译功能（调用 OpenAI GPT-3.5-turbo）
- [x] ✅ 翻译进度显示（实时更新）
- [x] ✅ 字幕导出
  - [x] ✅ 单语字幕（仅目标语言）
  - [x] ✅ 双语字幕（源语言 + 目标语言，上下排列）
  - [x] ✅ 同时导出两种格式

### 多语言系统
- [x] ✅ UI 多语言（20 种语言）
  - [x] ✅ 路由：`/{locale}` (例: `/en`, `/zh`, `/fr`)
  - [x] ✅ 语言代码使用简写：en, zh, es, fr 等
  - [x] ✅ 完整的 i18n 文案系统
  - [x] ✅ 自动翻译工具（translate-locales.ts）
  - [ ] ⏳ 翻译剩余 18 种语言（工具已就绪，运行 `npm run translate:all`）
- [ ] ⏳ 语言对页面（50 种语言的所有组合）
  - 路由：`/{locale}/{language-pair}` (例: `/en/french-to-chinese`, `/zh/german-to-korean`)
  - 语言对使用全称：french, chinese, german, korean 等

### 安全与性能
- [x] ✅ 速率限制（Cloudflare Workers KV）
  - [x] ✅ 每 IP 每小时 10 次（生产环境）
  - [x] ✅ 每 IP 每天 50 次（生产环境）
  - [x] ✅ 开发环境禁用速率限制（RATE_LIMIT_HOURLY=9999）
- [x] ✅ 输入验证
  - [x] ✅ 增强的 SRT 格式检查（支持多种时间格式）
  - [x] ✅ 文件大小限制（5MB）
  - [x] ✅ 文件类型验证
- [x] ✅ 错误处理
  - [x] ✅ 用户友好的错误提示（无技术术语）
  - [x] ✅ 详细的错误信息（帮助调试）
  - [x] ✅ API 错误处理

### SEO 优化
- [x] ✅ **三大信息板块**（Benefits、How to Use、FAQ）
  - [x] ✅ 关键词优化（SRT translator, subtitle translation, YouTube subtitles）
  - [x] ✅ 长尾关键词覆盖（translate subtitles for YouTube, bilingual subtitle maker）
  - [x] ✅ 语义化 HTML 结构（section, h2, h3）
  - [x] ✅ 用户友好的内容（FAQ 回答真实搜索问题）
- [ ] ⏳ 元数据（每个语言对页面独立）
- [ ] ⏳ 结构化数据（Schema.org）
- [ ] ⏳ 自动生成 sitemap.xml
- [ ] ⏳ 静态生成常见语言对页面（SSG）

### 翻译工具
- [x] ✅ 自动翻译 UI 文案到 20 种语言（translate-locales.ts）
- [x] ✅ 增量更新检测（只翻译新增/修改的文案）
- [x] ✅ 批量翻译命令（npm run translate:all）
- [x] ✅ 单语言翻译（npm run translate:locale）
- [x] ✅ 翻译状态检查（npm run translate:check）

---

## 🏗️ 技术架构

### 技术栈

| 层级 | 技术 | 说明 |
|-----|------|------|
| **前端框架** | Next.js 14 (App Router) | 服务端渲染，SEO 友好 |
| **语言** | TypeScript | 类型安全 |
| **样式** | Tailwind CSS + shadcn/ui | 响应式设计，预制组件 |
| **状态管理** | Zustand | 轻量级全局状态 |
| **国际化** | next-intl | 多语言路由和翻译 |
| **后端** | Cloudflare Workers | API 中转，速率限制 |
| **存储** | Cloudflare KV | IP 访问记录 |
| **AI 服务** | OpenAI GPT-3.5-turbo | 字幕翻译 |
| **部署** | Cloudflare Pages | 全球 CDN |

### 系统架构图

```
┌─────────────────────────────────────────────────────────────┐
│                         用户浏览器                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ 文件上传      │  │ 语言选择      │  │ 翻译进度      │      │
│  │ (客户端解析)  │  │ (50种语言)    │  │ (实时更新)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare Pages                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Next.js 14 Application                   │   │
│  │  • 多语言路由 (/[locale]/[language-pair])              │   │
│  │  • SSG 生成静态页面                                    │   │
│  │  • API Route: /api/translate                          │   │
│  └────────────────────────┬─────────────────────────────┘   │
└───────────────────────────┼─────────────────────────────────┘
                            │ 内部调用
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Cloudflare Workers                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  translator.ts                                        │   │
│  │  • 读取环境变量 OPENAI_API_KEY                         │   │
│  │  • 速率限制检查 (KV 存储)                              │   │
│  │  • 调用 OpenAI API                                    │   │
│  │  • 返回翻译结果                                        │   │
│  └────────────────────────┬─────────────────────────────┘   │
└───────────────────────────┼─────────────────────────────────┘
                            │ HTTPS
                            ↓
                   ┌─────────────────┐
                   │   OpenAI API    │
                   │  GPT-3.5-turbo  │
                   └─────────────────┘
```

### 数据流程

**翻译流程：**
```
1. 用户上传 SRT 文件（客户端）
   ↓
2. JavaScript 解析 SRT 结构（客户端）
   ↓
3. 按字幕条目分批发送到 /api/translate
   ↓
4. Next.js API Route 转发到 Cloudflare Workers
   ↓
5. Workers 检查速率限制 (KV)
   ↓
6. Workers 调用 OpenAI API 翻译
   ↓
7. 返回翻译结果到客户端
   ↓
8. 客户端合并字幕（单语/双语）
   ↓
9. 生成下载链接
```

### 目录结构

```
subtitle-translator/
├── app/                              # Next.js App Router
│   ├── [locale]/                     # 动态语言路由 (en, zh, fr...)
│   │   ├── page.tsx                  # 主页（翻译工具界面）
│   │   ├── [language-pair]/          # 语言对页面 (french-to-chinese)
│   │   │   └── page.tsx              # 语言对特定页面
│   │   ├── layout.tsx                # 布局组件（包含语言切换）
│   │   └── not-found.tsx             # 404 页面
│   ├── api/
│   │   └── translate/
│   │       └── route.ts              # API 路由（转发到 Workers）
│   ├── layout.tsx                    # 根布局
│   └── globals.css                   # 全局样式
│
├── components/                       # React 组件
│   ├── ui/                           # shadcn/ui 组件
│   │   ├── button.tsx
│   │   ├── select.tsx
│   │   ├── progress.tsx
│   │   └── ...
│   ├── FileUploader.tsx              # 文件上传组件
│   ├── LanguageSelector.tsx          # 语言选择器（支持搜索）
│   ├── TranslationProgress.tsx       # 翻译进度条
│   ├── SubtitleDownload.tsx          # 下载按钮组件
│   └── LanguageSwitcher.tsx          # UI 语言切换器
│
├── lib/                              # 工具库
│   ├── srt-parser.ts                 # SRT 文件解析器
│   ├── srt-generator.ts              # SRT 文件生成器（单语/双语）
│   ├── openai-client.ts              # OpenAI API 封装
│   ├── translation-batch.ts          # 批量翻译逻辑
│   └── utils.ts                      # 通用工具函数
│
├── store/                            # Zustand 状态管理
│   └── translation-store.ts          # 翻译状态（语言选择、进度等）
│
├── locales/                          # UI 多语言文件
│   ├── en.json                       # 英语
│   ├── zh.json                       # 中文
│   ├── es.json                       # 西班牙语
│   └── ... (20种语言)
│
├── config/                           # 配置文件
│   ├── languages.ts                  # 50种翻译语言配置
│   ├── ui-locales.ts                 # 20种UI语言配置
│   └── language-pairs.ts             # 语言对配置（用于生成页面）
│
├── workers/                          # Cloudflare Workers
│   └── translator.ts                 # OpenAI API 中转 + 速率限制
│
├── scripts/                          # 脚本工具
│   ├── translate-locales.ts          # UI 文案翻译工具
│   ├── generate-language-pairs.ts    # 生成语言对页面元数据
│   └── check-translations.ts         # 检查缺失的翻译
│
├── public/                           # 静态资源
│   ├── icons/                        # 国旗图标
│   └── og-images/                    # SEO 图片
│
├── tests/                            # 测试文件
│   ├── srt-parser.test.ts
│   ├── translation.test.ts
│   └── e2e/                          # 端到端测试
│
├── .env.local                        # 本地环境变量（不提交）
├── .env.example                      # 环境变量示例
├── next.config.js                    # Next.js 配置
├── tailwind.config.js                # Tailwind 配置
├── tsconfig.json                     # TypeScript 配置
├── package.json                      # 项目依赖
│
├── PROJECT.md                        # 本文件（项目总览）
├── DEVELOPMENT.md                    # 开发指南
├── LANGUAGES.md                      # 语言配置说明
└── TRANSLATION_TOOL.md               # 翻译工具文档
```

---

## 🌍 支持的语言

### UI 语言（20种，使用简写）
用户界面支持的显示语言，代码使用 ISO 639-1 简写：

`en`, `zh`, `es`, `fr`, `de`, `ja`, `ko`, `pt`, `ru`, `ar`, `hi`, `it`, `tr`, `vi`, `th`, `pl`, `nl`, `id`, `uk`, `sv`

**路由示例：**
- `/en` - 英语界面
- `/zh` - 中文界面
- `/fr` - 法语界面

### 翻译语言（50种，使用全称）
字幕翻译支持的语言，在语言对页面中使用全称：

`english`, `chinese`, `hindi`, `spanish`, `french`, `arabic`, `bengali`, `portuguese`, `russian`, `urdu`, `indonesian`, `german`, `japanese`, `swahili`, `marathi`, `telugu`, `turkish`, `tamil`, `vietnamese`, `korean`, `italian`, `polish`, `ukrainian`, `malay`, `thai`, `dutch`, `greek`, `czech`, `swedish`, `romanian`, `hungarian`, `hebrew`, `danish`, `finnish`, `norwegian`, `slovak`, `bulgarian`, `croatian`, `slovenian`, `lithuanian`, `latvian`, `estonian`, `persian`, `filipino`, `gujarati`, `kannada`, `burmese`, `nepali`, `sinhala`, `kazakh`

**语言对页面路由示例：**
- `/en/french-to-chinese` - 英语界面，法语翻译成中文
- `/zh/german-to-korean` - 中文界面，德语翻译成韩语

**⚠️ 重要：区分两种语言**
- **UI 语言**：简写（en, zh, fr）- 用于 URL 的 `[locale]` 部分
- **翻译语言**：全称（french, chinese, german）- 用于 URL 的 `[language-pair]` 部分

详见 [LANGUAGES.md](LANGUAGES.md) 获取完整配置。

---

## 🔒 安全与性能

### API 密钥安全
- ✅ 密钥存储在 Cloudflare Workers 环境变量
- ✅ 前端代码无法访问密钥
- ✅ 所有 OpenAI 调用通过 Workers 中转

### 速率限制
| 限制类型 | 频率 | 实现方式 |
|---------|------|----------|
| 每小时  | 10次 | Cloudflare Workers KV |
| 每天    | 50次 | Cloudflare Workers KV |
| 文件大小 | 5MB  | 客户端验证 |

### 输入验证
- SRT 格式校验（正则表达式）
- 文件大小检查（客户端 + 服务端）
- XSS 防护（内容转义）

### 错误处理
- 网络错误自动重试（最多 3 次）
- 用户友好的错误提示（多语言）
- API 失败降级方案

---

## 💰 成本估算

基于每天 100 次翻译：

| 服务 | 费用 | 说明 |
|-----|------|------|
| OpenAI API | ~$6/月 | GPT-3.5-turbo，平均每次 $0.002 |
| Cloudflare Pages | 免费 | 每月 500 次构建 |
| Cloudflare Workers | 免费 | 每天 100,000 次请求 |
| Cloudflare KV | 免费 | 每天 100,000 次读取 |
| 域名 | $12/年 | 可选（可用 pages.dev 子域名） |

**预计总成本：$6-10/月**

---

## 📅 开发进度

### Phase 1: 项目基础架构 ✅ **完成**
- [x] 创建项目文档（PROJECT.md, DEVELOPMENT.md, LANGUAGES.md, TRANSLATION_TOOL.md）
- [x] 初始化 Next.js 14 项目
- [x] 配置 Tailwind CSS + shadcn/ui
- [x] 创建基础目录结构
- [x] 配置 TypeScript
- [x] 配置 next-intl 国际化
- [x] 创建语言配置文件（50种翻译语言，20种UI语言）

**完成时间：** 2025-01-19

### Phase 2: 核心功能开发 ✅ **完成**
- [x] SRT 文件解析器（`lib/srt-parser.ts`）
- [x] SRT 文件生成器（`lib/srt-generator.ts`）- 支持单语/双语
- [x] Cloudflare Workers API 端点（`workers/translator.ts`）
- [x] OpenAI 翻译逻辑
- [x] 速率限制实现（每IP每小时10次，每天50次）
- [x] 文件下载功能
- [x] Zustand 状态管理
- [x] 翻译客户端（`lib/translation-client.ts`）

**完成时间：** 2025-01-19

### Phase 3: UI 组件开发 ✅ **完成**
- [x] FileUploader 组件（拖拽上传）
- [x] LanguageSelector 组件（50种语言，支持搜索）
- [x] TranslationProgress 组件（实时进度显示）
- [x] OutputFormatSelector 组件（单语/双语/两者）
- [x] DownloadButtons 组件
- [x] 基础 UI 组件（Button, Progress）
- [x] 集成所有组件到主页面

**完成时间：** 2025-01-19

### Phase 4: 多语言系统 🔄 **部分完成**
- [x] next-intl 配置
- [x] 20 种语言路由 `/[locale]`
- [x] 基础翻译文件（en.json）
- [x] 中间件配置（语言检测和路由）
- [ ] 翻译其余 19 种 UI 语言（待使用翻译工具）

**当前状态：** 基础架构完成，待翻译UI文案

### Phase 5: 语言对页面 ⏳ **待开发**
- [ ] 动态路由 `/[locale]/[language-pair]`
- [ ] 50 种语言的所有组合（2,450 个页面）
- [ ] SEO 元数据生成
- [ ] 语言对特定内容

**预计完成时间：** Day 5-6

### Phase 6: 翻译工具开发 ⏳ **待开发**
- [ ] 自动翻译脚本（`scripts/translate-locales.ts`）
- [ ] 增量更新检测
- [ ] 批量翻译命令
- [ ] 翻译质量检查工具

**预计完成时间：** Day 7

### Phase 7: 优化与测试 ⏳ **待开发**
- [ ] 错误处理完善
- [ ] 性能优化
- [ ] 单元测试
- [ ] 端到端测试
- [ ] 可访问性优化

**预计完成时间：** Day 8

### Phase 8: 部署 ⏳ **待进行**
- [ ] 创建 Cloudflare KV 命名空间
- [ ] 部署 Cloudflare Workers
- [ ] 配置 Workers 环境变量
- [ ] 部署 Next.js 到 Cloudflare Pages
- [ ] 配置自定义域名（可选）
- [ ] 生产环境测试

**预计完成时间：** Day 9

---

## 🔄 更新日志

### 2025-01-19 - Phase 1-3 完成

**项目初始化 ✅**
- ✅ 创建完整项目文档（PROJECT.md, DEVELOPMENT.md, LANGUAGES.md, TRANSLATION_TOOL.md, README.md）
- ✅ 确定技术栈：Next.js 14 + Zustand + Cloudflare Workers + OpenAI
- ✅ 明确语言配置：20 种 UI 语言（简写），50 种翻译语言（全称）
- ✅ 初始化 Next.js 14 项目（App Router）
- ✅ 配置 Tailwind CSS + TypeScript + ESLint
- ✅ 安装核心依赖：next-intl, zustand, openai, radix-ui

**核心功能开发 ✅**
- ✅ 实现 SRT 文件解析器（`lib/srt-parser.ts`）
- ✅ 实现 SRT 文件生成器（`lib/srt-generator.ts`）- 支持单语/双语/两者
- ✅ 创建 Cloudflare Workers API（`workers/translator.ts`）
  - OpenAI API 集成
  - 速率限制（每 IP 每小时 10 次，每天 50 次）
  - CORS 配置
- ✅ 实现翻译客户端（`lib/translation-client.ts`）
- ✅ 创建 Zustand 状态管理（`store/translation-store.ts`）
- ✅ 配置文件（languages.ts, ui-locales.ts, language-pairs.ts）

**UI 组件开发 ✅**
- ✅ FileUploader 组件（支持拖拽上传，5MB 限制）
- ✅ LanguageSelector 组件（50 种语言，支持搜索过滤）
- ✅ TranslationProgress 组件（实时进度显示）
- ✅ OutputFormatSelector 组件（单语/双语/两者选择）
- ✅ DownloadButtons 组件（文件下载触发）
- ✅ 基础 UI 组件（Button, Progress）
- ✅ 主页面集成（完整翻译流程）

**国际化配置 ✅**
- ✅ next-intl 中间件配置
- ✅ 20 种语言路由支持（`/[locale]`）
- ✅ 创建英语基准翻译文件（locales/en.json）

**文件创建统计：**
- 配置文件：6 个（tsconfig.json, next.config.js, tailwind.config.ts 等）
- 核心库文件：5 个（解析器、生成器、翻译客户端、工具函数、状态管理）
- UI 组件：7 个
- Workers：1 个
- 配置文件：3 个（languages, ui-locales, language-pairs）
- 文档：5 个（PROJECT, DEVELOPMENT, LANGUAGES, TRANSLATION_TOOL, README）

### 2025-01-20 - Phase 4-6 完成，Bug 修复，SEO 优化

**Bug 修复 ✅**
- ✅ 修复文件删除崩溃问题（空指针检查）
- ✅ 增强 SRT 解析器，支持多种时间格式
  - 支持点号和逗号作为毫秒分隔符（00:00:01.000 或 00:00:01,000）
  - 支持缺少毫秒的格式（00:00:01 自动补全为 00:00:01,000）
  - 支持单数字小时（1:00:01 自动补全为 01:00:01）
  - 支持单箭头和双箭头（-> 或 -->）
  - 移除 BOM 字符
  - 详细错误报告
- ✅ 修复 Browse Files 按钮点击无响应
  - 使用 useRef 替代 getElementById
  - 添加专用的 handleBrowseClick 回调

**UI 文案优化 ✅**
- ✅ 移除所有硬编码文本，完全使用 i18n
- ✅ 优化所有错误提示（更友好，无技术术语）
  - "Parsing SRT file" → "Reading your subtitle file"
  - "Error parsing SRT file" → "Oops! Something went wrong"
- ✅ 新增文案命名空间
  - `steps` - 步骤指引
  - `fileInfo` - 文件信息
  - `errors.title` - 错误标题

**SEO 内容板块 ✅**
- ✅ **Benefits Section** - 6 个产品优势
  - AI-Powered Accuracy
  - Instant Translation
  - 50+ Languages Supported
  - Bilingual Subtitles
  - Completely Free
  - Your Privacy Matters
- ✅ **How to Use Section** - 3 步使用指南
  - Upload Your SRT File
  - Select Languages
  - Download Translated Subtitles
  - 输出格式说明（单语/双语/两者）
- ✅ **FAQ Section** - 6 个常见问题
  - What is an SRT file?
  - How accurate are AI translations?
  - Can I translate subtitles for YouTube?
  - File size limits?
  - Mono vs bilingual?
  - Privacy concerns?

**翻译工具完成 ✅**
- ✅ 创建 translate-locales.ts 自动翻译脚本
- ✅ 增量更新检测（只翻译新增内容）
- ✅ 成功翻译中文（zh.json）
- ✅ 支持强制重新翻译
- ✅ 命令行工具
  - `npm run translate:all` - 翻译所有语言
  - `npm run translate:locale` - 翻译单一语言
  - `npm run translate:check` - 检查翻译状态
  - `npm run translate:force` - 强制重新翻译

**部署准备 ✅**
- ✅ 创建 DEPLOYMENT.md - 完整部署指南
- ✅ 创建 pre-deploy-check.ts - 部署前检查脚本
- ✅ 修复 .gitignore（wrangler.toml 不应被忽略）
- ✅ 优化 Workers 速率限制逻辑（开发环境禁用）
- ✅ 环境变量配置完善

**文档完善 ✅**
- ✅ I18N_GUIDE.md - 25KB 超详细 i18n 教程
- ✅ NEW_SECTIONS_SUMMARY.md - 新功能总结
- ✅ BUGFIX.md - Bug 修复记录
- ✅ DEPLOYMENT.md - 部署完整指南

**新增文件统计：**
- 信息板块组件：3 个（BenefitsSection, HowToUseSection, FAQSection）
- 脚本工具：2 个（translate-locales.ts, pre-deploy-check.ts）
- 文档：3 个（I18N_GUIDE, NEW_SECTIONS_SUMMARY, DEPLOYMENT）
- 配置更新：.gitignore, .dev.vars, workers/translator.ts

### 下一步计划
- [ ] 翻译剩余 18 种 UI 语言（运行 `npm run translate:all`）
- [ ] 实现语言对页面（Phase 5）
- [ ] 部署到 Cloudflare（Phase 8）
- [ ] 添加单元测试和 E2E 测试（可选）

---

## 📞 联系方式

**开发者：** [您的名字]
**项目仓库：** [GitHub URL]
**在线预览：** [Cloudflare Pages URL]

---

## 📚 相关文档

### 核心文档
- [PROJECT.md](PROJECT.md) - 本文档，项目总览
- [DEVELOPMENT.md](DEVELOPMENT.md) - 开发指南（如何运行、测试）
- [DEPLOYMENT.md](DEPLOYMENT.md) - **重要！** Cloudflare 部署完整指南

### 语言和翻译
- [LANGUAGES.md](LANGUAGES.md) - 语言配置说明（区分 UI 语言 vs 翻译语言对）
- [TRANSLATION_TOOL.md](TRANSLATION_TOOL.md) - 翻译工具使用文档
- [I18N_GUIDE.md](I18N_GUIDE.md) - **必读！** i18n 多语言系统完整教程（25KB）

### 功能和修复
- [NEW_SECTIONS_SUMMARY.md](NEW_SECTIONS_SUMMARY.md) - 新增的三大板块总结（Benefits, How to Use, FAQ）
- [BUGFIX.md](BUGFIX.md) - Bug 修复记录
- [CURRENT_STATUS.md](CURRENT_STATUS.md) - 当前项目状态

### 快速开始
1. 阅读 [I18N_GUIDE.md](I18N_GUIDE.md) 了解多语言系统
2. 运行 `npm run pre-deploy` 检查部署准备
3. 阅读 [DEPLOYMENT.md](DEPLOYMENT.md) 开始部署

---

**最后更新：** 2025-01-20
**文档版本：** 2.0.0
**项目进度：** 核心功能完成 95%，待部署
