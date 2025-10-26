# 🎯 Sub-Trans4 项目完整架构解析

## 📂 一、项目结构总览

```
sub-trans-1018/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── layout.tsx          # 根布局（全局 HTML 结构）
│   │   ├── page.tsx            # 根页面（重定向到 /en）
│   │   ├── [locale]/           # 动态路由：支持所有语言
│   │   │   ├── layout.tsx      # 语言布局（含 i18n Provider + 动态 SEO）
│   │   │   └── page.tsx        # 主页面（字幕翻译器）
│   │   └── api/                # API 路由
│   │       ├── translate/      # 主翻译 API
│   │       └── translate-stream/ # 流式翻译 API
│   ├── components/             # React 组件
│   ├── lib/                    # 工具库
│   ├── config/                 # 配置文件
│   ├── store/                  # Zustand 状态管理
│   └── middleware.ts           # Next.js 中间件
├── locales/                    # 翻译文件（18种语言）
├── scripts/                    # 脚本工具
│   └── translate-i18n.js       # AI 翻译脚本
├── i18nConfig.ts               # i18n 配置
└── next.config.ts              # Next.js 配置
```

---

## 🌐 二、路由系统详解

### 1. **入口流程**

**访问路径：** `/` → 自动重定向到 `/en`

**文件：** `src/app/page.tsx`
```typescript
export default function RootPage() {
  redirect('/en');  // 总是重定向到英语版本
}
```

### 2. **语言路由架构**

**动态路由：** `/[locale]` 支持所有语言

**URL 格式：**
- 英语：`/en`
- 中文：`/zh`
- 日语：`/ja`
- 法语：`/fr`
- 德语：`/de`
- 西班牙语：`/es`
- 俄语：`/ru`
- 意大利语：`/it`
- 葡萄牙语：`/pt`
- 阿拉伯语：`/ar`
- 印地语：`/hi`
- 韩语：`/ko`
- 泰语：`/th`
- 越南语：`/vi`
- 土耳其语：`/tr`
- 波兰语：`/pl`
- 荷兰语：`/nl`
- 瑞典语：`/sv`
- 印尼语：`/id`（回退到英语）
- 乌克兰语：`/uk`（回退到英语）

**主页面位置：** `src/app/[locale]/page.tsx`

### 3. **中间件路由逻辑**

**文件：** `middleware.ts`

**功能：**
1. 检测用户首选语言（从 Accept-Language 头或 Cookie）
2. 验证路径是否包含有效的语言前缀
3. 自动重定向非英语用户到对应语言版本
4. 跳过静态资源和 API 路由

**示例流程：**
```
用户访问 /
  ↓
middleware 检测浏览器语言 = zh
  ↓
重定向到 /zh
  ↓
渲染中文版本页面
```

**关键代码：**
```typescript
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 跳过静态资源和API路由
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // 检查路径是否已经包含语言前缀
  const pathnameHasLocale = i18nConfig.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // 如果路径没有语言前缀，检测用户首选语言
  if (!pathnameHasLocale) {
    const locale = getLocale(request);

    // 如果首选语言不是英语，重定向到相应的语言前缀
    if (locale !== 'en') {
      return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}
```

---

## 🔧 三、国际化系统（i18n）

### 1. **配置文件**

#### A. UI 语言配置
**文件：** `src/config/ui-locales.ts`

**支持的 20 种界面语言：**
```typescript
export const UI_LOCALES = [
  'en',  // English
  'zh',  // Chinese (Simplified)
  'es',  // Spanish
  'fr',  // French
  'de',  // German
  'ja',  // Japanese
  'ko',  // Korean
  'pt',  // Portuguese
  'ru',  // Russian
  'ar',  // Arabic
  'hi',  // Hindi
  'it',  // Italian
  'tr',  // Turkish
  'vi',  // Vietnamese
  'th',  // Thai
  'pl',  // Polish
  'nl',  // Dutch
  'id',  // Indonesian
  'uk',  // Ukrainian
  'sv',  // Swedish
] as const;

export type UILocale = (typeof UI_LOCALES)[number];
export const DEFAULT_LOCALE: UILocale = 'en';
```

#### B. i18n 配置
**文件：** `i18nConfig.ts`
```typescript
export const i18nConfig = {
  locales: ['en', 'zh', 'ja', 'fr', 'de', 'es', 'ru', 'it', 'pt', 'ar', 'hi', 'ko', 'th', 'vi', 'tr', 'pl', 'nl', 'sv'],
  defaultLocale: 'en',
  prefixDefault: false  // 注意：虽然设置为 false，但实际上所有语言都使用前缀
} as const;
```

**重要说明：** 虽然 `prefixDefault: false`，但实际应用中**所有语言（包括英语）都使用 `/[locale]` 前缀路由**，以简化路由逻辑。

### 2. **翻译文件结构**

**位置：** `/locales/{语言代码}.json`

**完整的 JSON 嵌套结构：**
```json
{
  "meta": {
    "title": "Subtitle Translator - AI-Powered SRT Translation",
    "description": "Translate SRT subtitles to 50+ languages using advanced AI technology. Fast, accurate, and free.",
    "keywords": "subtitle translation, SRT translator, AI translation, video subtitles"
  },
  "common": {
    "title": "Subtitle Translator",
    "description": "Translate SRT subtitles to 50+ languages using AI",
    "upload": "Upload SRT File",
    "translate": "Start Translation",
    "download": "Download",
    "loading": "Processing...",
    "cancel": "Cancel",
    "retry": "Retry",
    "close": "Close",
    "dismiss": "Dismiss"
  },
  "steps": {
    "step1": "Step 1",
    "step2": "Step 2",
    "step3": "Step 3",
    "uploadFile": "Upload SRT File",
    "selectLanguages": "Select Languages",
    "selectFormat": "Select Output Format"
  },
  "fileInfo": {
    "fileName": "File Name",
    "fileSize": "File Size",
    "subtitleCount": "Subtitle Count",
    "encoding": "Encoding"
  },
  "upload": {
    "dragDrop": "Drag and drop your SRT file here",
    "or": "or",
    "browse": "Browse Files",
    "supported": "Supported format: .srt",
    "maxSize": "Maximum file size: 10MB"
  },
  "language": {
    "source": "Source Language",
    "target": "Target Language",
    "select": "Select a language",
    "auto": "Auto Detect"
  },
  "output": {
    "format": "Output Format",
    "mono": "Translated Only",
    "bilingual": "Bilingual (Original + Translation)",
    "monoDesc": "Only the translated subtitles",
    "bilingualDesc": "Original text followed by translation"
  },
  "progress": {
    "parsing": "Parsing file...",
    "translating": "Translating...",
    "generating": "Generating file...",
    "complete": "Translation complete!",
    "current": "Current",
    "total": "Total"
  },
  "errors": {
    "title": "Error",
    "noFileSelected": "Please upload a file first",
    "invalidFile": "Invalid SRT file format",
    "fileTooLarge": "File is too large (max 10MB)",
    "uploadFailed": "Failed to upload file",
    "parseFailed": "Failed to parse SRT file",
    "translationFailed": "Translation failed",
    "networkError": "Network error. Please check your connection.",
    "apiError": "API error. Please try again later.",
    "sameLanguage": "Source and target languages must be different"
  },
  "success": {
    "uploadComplete": "File uploaded successfully",
    "translationComplete": "Translation completed successfully",
    "downloadReady": "Your file is ready for download"
  },
  "footer": {
    "copyright": "© 2024 Subtitle Translator. All rights reserved.",
    "privacy": "Privacy Policy",
    "terms": "Terms of Service",
    "contact": "Contact Us"
  },
  "benefits": { ... },
  "howToUse": { ... },
  "faq": { ... }
}
```

**关键特性：**
- ✅ **嵌套结构**：使用 `meta`, `common`, `steps` 等顶层对象分类
- ✅ **SEO 元数据**：`meta` 对象专门用于页面 `<head>` 标签
- ✅ **语义化键名**：便于理解和维护
- ✅ **18 种语言一致性**：所有语言文件保持相同的结构

### 3. **翻译加载机制**

#### A. 服务端加载（Edge Runtime 兼容）
**文件：** `src/lib/get-messages.ts`

**为什么需要静态导入？**
- Cloudflare Pages 使用 Edge Runtime
- Edge Runtime **不支持** Node.js 的 `fs` 模块
- 必须在编译时静态导入所有翻译文件

**工作原理：**
```typescript
// 静态导入所有翻译文件（Cloudflare Pages 要求）
import en from '@/../locales/en.json';
import zh from '@/../locales/zh.json';
import fr from '@/../locales/fr.json';
import ja from '@/../locales/ja.json';
import de from '@/../locales/de.json';
import es from '@/../locales/es.json';
import ru from '@/../locales/ru.json';
import it from '@/../locales/it.json';
import pt from '@/../locales/pt.json';
import ar from '@/../locales/ar.json';
import hi from '@/../locales/hi.json';
import ko from '@/../locales/ko.json';
import th from '@/../locales/th.json';
import vi from '@/../locales/vi.json';
import tr from '@/../locales/tr.json';
import pl from '@/../locales/pl.json';
import nl from '@/../locales/nl.json';
import sv from '@/../locales/sv.json';

// Locale messages map
const localeMessages: Record<UILocale, any> = {
  en, zh, fr, ja, de, es, ru, it, pt, ar, hi, ko, th, vi, tr, pl, nl, sv,
  // id 和 uk 回退到英语（没有独立翻译）
  id: en,
  uk: en,
};

export async function getMessagesForLocale(locale: UILocale) {
  console.log(`[getMessagesForLocale] Loading locale: ${locale}`);

  try {
    const messages = localeMessages[locale];

    if (!messages) {
      console.warn(`[getMessagesForLocale] No messages found for locale: ${locale}, falling back to English`);
      return localeMessages.en || {};
    }

    console.log(`[getMessagesForLocale] Successfully loaded ${locale}`);
    return messages;
  } catch (error) {
    console.error(`[getMessagesForLocale] ERROR loading messages for locale: ${locale}`, error);
    return localeMessages.en || {};
  }
}
```

#### B. next-intl 配置
**文件：** `src/i18n.ts`

**功能：** 配合 `next-intl` 库动态加载翻译

```typescript
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { UI_LOCALES } from './config/ui-locales';

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  // 验证 locale 是否有效
  if (!locale || !UI_LOCALES.includes(locale as any)) {
    notFound();
  }

  try {
    // 从根目录 /locales/ 加载
    return {
      messages: (await import(`../locales/${locale}.json`)).default,
    };
  } catch (error) {
    console.error('Failed to load locale messages:', locale, error);
    // 回退到英语
    return {
      messages: (await import(`../locales/en.json`)).default,
    };
  }
});
```

---

## 🎨 四、主页面架构

### 1. **布局层次结构**

```
RootLayout (app/layout.tsx)
  └── HTML + Body + 全局样式
      └── LocaleLayout (app/[locale]/layout.tsx)
          └── NextIntlClientProvider (i18n 上下文)
              └── HomePage (app/[locale]/page.tsx)
                  ├── LanguageChanger (语言切换器)
                  ├── FileUploader (文件上传)
                  ├── LanguageSelector (语言选择)
                  ├── OutputFormatSelector (格式选择)
                  ├── TranslationProgress (进度显示)
                  ├── DownloadButtons (下载按钮)
                  ├── BenefitsSection (优势区块)
                  ├── HowToUseSection (使用说明)
                  └── FAQSection (FAQ 区块)
```

### 2. **根布局（Root Layout）**

**文件：** `src/app/layout.tsx`

**功能：**
- 定义全局 HTML 结构
- 加载 Inter 字体
- 设置默认 SEO metadata（会被 locale layout 的 `generateMetadata` 覆盖）

**代码：**
```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Subtitle Translator - AI-Powered SRT Translation',
  description: 'Translate SRT subtitles to 50+ languages using advanced AI technology. Fast, accurate, and free.',
  keywords: 'subtitle translation, SRT translator, AI translation, video subtitles',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

### 3. **语言布局（Locale Layout）**

**文件：** `src/app/[locale]/layout.tsx`

**关键功能：**

#### A. 动态 SEO 元数据（重要！）
```typescript
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  // 验证 locale
  if (!isValidUILocale(locale)) {
    return {
      title: 'Subtitle Translator',
      description: 'Translate SRT subtitles using AI'
    };
  }

  // 获取该语言的翻译消息
  const messages = await getMessagesForLocale(locale as UILocale);

  return {
    title: messages?.meta?.title || 'Subtitle Translator - AI-Powered SRT Translation',
    description: messages?.meta?.description || 'Translate SRT subtitles to 50+ languages using advanced AI technology. Fast, accurate, and free.',
    keywords: messages?.meta?.keywords || 'subtitle translation, SRT translator, AI translation, video subtitles',
  };
}
```

**效果：** 每种语言有独立的 SEO meta 标签
- `/en` → 页面标题：`"Subtitle Translator - AI-Powered SRT Translation"`
- `/zh` → 页面标题：`"字幕翻译器 - 基于AI的SRT翻译"`
- `/ja` → 页面标题：`"字幕翻訳者 - AI搭載のSRT翻訳"`
- `/fr` → 页面标题：`"Traducteur de Sous-titres - Traduction SRT Alimentée par l'IA"`

**SEO 优势：**
- ✅ 搜索引擎看到本地化的标题和描述
- ✅ 提高各语言市场的搜索排名
- ✅ 用户在搜索结果中看到母语内容

#### B. i18n Provider 包装
```typescript
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // 验证 locale
  if (!isValidUILocale(locale)) {
    notFound();
  }

  // 获取翻译消息
  const messages = await getMessagesForLocale(locale as UILocale);

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <div className="min-h-screen flex flex-col">
        {children}
        <UnifiedFooter />
      </div>
    </NextIntlClientProvider>
  );
}
```

**作用：**
- 提供 i18n 上下文给所有子组件
- 子组件可以使用 `useTranslations()` 钩子获取翻译

### 4. **主页面（HomePage）**

**文件：** `src/app/[locale]/page.tsx`

**类型：** 客户端组件（`'use client'`）

**为什么是客户端组件？**
- 需要使用 React 状态管理（useState, Zustand）
- 需要处理用户交互（文件上传、点击事件）
- 需要调用浏览器 API（FileReader, Blob）

**核心组件结构：**

```tsx
'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useTranslationStore } from '@/store/translation-store';
import { translateSubtitles } from '@/lib/translation-client';
// ... 其他导入

export default function HomePage() {
  // 1. 获取当前语言
  const params = useParams();
  const currentLocale = (params?.locale as string) || 'en';

  // 2. 获取翻译函数
  const t = useTranslations('common');
  const tSteps = useTranslations('steps');
  const tFileInfo = useTranslations('fileInfo');
  const tError = useTranslations('errors');

  // 3. Zustand 状态管理
  const {
    file,
    originalEntries,
    sourceLanguage,
    targetLanguage,
    status,
    error,
    setSourceLanguage,
    setTargetLanguage,
    setStatus,
    setCurrentIndex,
    setError,
    updateTranslatedEntry,
  } = useTranslationStore();

  // 4. 翻译处理函数
  const handleStartTranslation = async () => {
    // 验证
    if (!file || !sourceLanguage || !targetLanguage) {
      setError(tError('noFileSelected'));
      return;
    }

    if (sourceLanguage === targetLanguage) {
      setError(tError('sameLanguage'));
      return;
    }

    // 开始翻译
    setStatus('translating');
    setError(null);

    const result = await translateSubtitles(
      originalEntries,
      sourceLanguage,
      targetLanguage,
      (current, total, translatedEntry) => {
        // 更新进度回调
        setCurrentIndex(current);
        updateTranslatedEntry(current - 1, translatedEntry.translatedText);
      }
    );

    if (!result.success) {
      setError(result.error || tError('apiError'));
      setStatus('error');
      return;
    }

    setStatus('complete');
  };

  return (
    <main className="flex-1 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* 语言切换器 - 右上角 */}
          <div className="flex justify-end mb-4">
            <LanguageChanger currentLocale={currentLocale} />
          </div>

          {/* 标题 */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">
              {t('title')}
            </h1>
            <p className="text-xl text-gray-600">{t('description')}</p>
          </div>

          {/* 主要内容卡片 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
            {/* 错误提示 */}
            {error && status === 'error' && (
              <div className="border border-destructive/50 rounded-lg p-4 bg-destructive/10">
                {/* 错误内容 */}
              </div>
            )}

            {/* 步骤 1: 上传文件 */}
            <div>
              <h2 className="text-lg font-semibold mb-4">
                {tSteps('step1')}: {tSteps('uploadFile')}
              </h2>
              <FileUploader />
            </div>

            {/* 步骤 2: 选择语言 */}
            {file && originalEntries.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">
                  {tSteps('step2')}: {tSteps('selectLanguages')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <LanguageSelector
                    type="source"
                    value={sourceLanguage}
                    onChange={setSourceLanguage}
                    excludeLanguage={targetLanguage}
                  />
                  <LanguageSelector
                    type="target"
                    value={targetLanguage}
                    onChange={setTargetLanguage}
                    excludeLanguage={sourceLanguage}
                  />
                </div>
              </div>
            )}

            {/* 步骤 3: 选择输出格式 */}
            {sourceLanguage && targetLanguage && (
              <div>
                <h2 className="text-lg font-semibold mb-4">
                  {tSteps('step3')}: {tSteps('selectFormat')}
                </h2>
                <OutputFormatSelector />
              </div>
            )}

            {/* 开始翻译按钮 */}
            {canTranslate && status !== 'complete' && (
              <div className="flex justify-center pt-4">
                <Button
                  size="lg"
                  onClick={handleStartTranslation}
                  disabled={!canTranslate}
                >
                  {t('translate')}
                </Button>
              </div>
            )}

            {/* 翻译进度 */}
            <TranslationProgress />

            {/* 下载按钮 */}
            <DownloadButtons />

            {/* 文件信息 */}
            {file && originalEntries.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                <p>
                  {tFileInfo('fileName')}: <span className="font-medium">{file.name}</span>
                </p>
                <p>
                  {tFileInfo('subtitleCount')}:{' '}
                  <span className="font-medium">{originalEntries.length}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEO 内容区块 */}
      <div className="container mx-auto px-4 pb-12">
        <BenefitsSection />
        <HowToUseSection />
        <FAQSection />
      </div>
    </main>
  );
}
```

**页面流程：**
1. 用户上传 SRT 文件 → `FileUploader` 组件解析并存储到 Zustand
2. 用户选择源语言和目标语言 → `LanguageSelector` 更新 store
3. 用户选择输出格式 → `OutputFormatSelector` 更新 store
4. 用户点击"开始翻译" → `handleStartTranslation` 调用 API
5. 实时显示进度 → `TranslationProgress` 组件
6. 翻译完成 → `DownloadButtons` 显示下载按钮

---

## 🔄 五、状态管理（Zustand）

### 为什么选择 Zustand？

| 特性 | Zustand | Redux | React Context |
|------|---------|-------|---------------|
| 学习曲线 | ⭐ 简单 | ⭐⭐⭐ 复杂 | ⭐⭐ 中等 |
| 性能 | ⭐⭐⭐ 优秀 | ⭐⭐⭐ 优秀 | ⭐ 差（重新渲染） |
| 代码量 | ⭐⭐⭐ 少 | ⭐ 多 | ⭐⭐ 中等 |
| TypeScript 支持 | ⭐⭐⭐ 原生 | ⭐⭐ 需配置 | ⭐⭐ 需配置 |

### 状态结构

**文件：** `src/store/translation-store.ts`

```typescript
export type TranslationStatus =
  | 'idle'         // 空闲
  | 'parsing'      // 解析文件
  | 'translating'  // 翻译中
  | 'generating'   // 生成文件
  | 'complete'     // 完成
  | 'error';       // 错误

export interface TranslationState {
  // 文件相关
  file: File | null;
  filename: string;
  originalEntries: SubtitleEntry[];      // 原始字幕条目
  translatedEntries: TranslatedEntry[];  // 翻译后的条目

  // 语言选择
  sourceLanguage: TranslationLanguage | null;
  targetLanguage: TranslationLanguage | null;

  // 输出格式
  outputFormat: OutputFormat;  // 'mono' | 'bilingual'

  // 翻译进度
  status: TranslationStatus;
  progress: number;       // 0-100
  currentIndex: number;   // 当前翻译到第几条
  totalCount: number;     // 总共多少条

  // 错误信息
  error: string | null;

  // Actions（状态更新函数）
  setFile: (file: File | null) => void;
  setOriginalEntries: (entries: SubtitleEntry[]) => void;
  setSourceLanguage: (lang: TranslationLanguage) => void;
  setTargetLanguage: (lang: TranslationLanguage) => void;
  setOutputFormat: (format: OutputFormat) => void;
  setStatus: (status: TranslationStatus) => void;
  setProgress: (progress: number) => void;
  setCurrentIndex: (index: number) => void;
  setError: (error: string | null) => void;
  updateTranslatedEntry: (index: number, translatedText: string) => void;
  reset: () => void;
}
```

### 使用示例

```typescript
// 在组件中
import { useTranslationStore } from '@/store/translation-store';

function MyComponent() {
  // 只订阅需要的状态（性能优化）
  const file = useTranslationStore(state => state.file);
  const status = useTranslationStore(state => state.status);
  const setFile = useTranslationStore(state => state.setFile);

  // 或者一次性获取多个
  const { file, status, setFile, setStatus } = useTranslationStore();

  return (
    <div>
      <p>Status: {status}</p>
      <button onClick={() => setStatus('translating')}>Start</button>
    </div>
  );
}
```

---

## 🧩 六、核心组件详解

### 1. **LanguageChanger（语言切换器）**

**文件：** `src/components/LanguageChanger.tsx`

**功能：** 下拉菜单，切换界面语言

**关键逻辑：**
```typescript
const handleLanguageChange = (newLocale: string) => {
  setIsOpen(false);

  // 获取当前路径，移除语言前缀
  let currentPath = pathname;

  // 移除当前语言前缀
  for (const locale of i18nConfig.locales) {
    if (currentPath.startsWith(`/${locale}/`)) {
      currentPath = currentPath.replace(`/${locale}`, '');
      break;
    } else if (currentPath === `/${locale}`) {
      currentPath = '/';
      break;
    }
  }

  // 确保路径以 / 开头
  if (!currentPath.startsWith('/')) {
    currentPath = '/' + currentPath;
  }

  // 构建新路径 - 所有语言都使用前缀（包括英语）
  const newPath = `/${newLocale}${currentPath}`;

  router.push(newPath);
};
```

**示例流程：**
- 当前 URL：`/zh` → 点击 "English" → 新 URL：`/en`
- 当前 URL：`/ja` → 点击 "中文" → 新 URL：`/zh`

**UI 特性：**
- ✅ 显示国旗 emoji
- ✅ 显示母语名称
- ✅ 当前语言高亮显示
- ✅ 点击外部自动关闭

### 2. **FileUploader（文件上传器）**

**文件：** `src/components/FileUploader.tsx`

**功能：**
- 拖拽上传 SRT 文件
- 点击浏览文件
- 解析 SRT 格式
- 验证文件大小（最大 10MB）
- 存储到 Zustand store

**工作流程：**
```
用户选择文件
  ↓
验证文件类型（.srt）
  ↓
验证文件大小（< 10MB）
  ↓
读取文件内容（FileReader）
  ↓
解析 SRT 格式（srt-parser.ts）
  ↓
存储到 store（originalEntries）
```

### 3. **LanguageSelector（语言选择器）**

**文件：** `src/components/LanguageSelector.tsx`

**功能：**
- 选择源语言（Source Language）
- 选择目标语言（Target Language）
- 支持 50+ 翻译语言
- 显示国旗图标
- 排除已选择的另一个语言

**语言数据来源：** `src/config/languages.ts`

### 4. **OutputFormatSelector（输出格式选择器）**

**文件：** `src/components/OutputFormatSelector.tsx`

**两种输出格式：**

#### A. 单语格式（Mono）
```srt
1
00:00:01,000 --> 00:00:03,000
これはテストです

2
00:00:04,000 --> 00:00:06,000
こんにちは
```

#### B. 双语格式（Bilingual）
```srt
1
00:00:01,000 --> 00:00:03,000
This is a test
これはテストです

2
00:00:04,000 --> 00:00:06,000
Hello
こんにちは
```

### 5. **TranslationProgress（翻译进度）**

**文件：** `src/components/TranslationProgress.tsx`

**显示内容：**
- 进度条（0-100%）
- 当前翻译数 / 总数
- 翻译状态文本

**状态映射：**
```typescript
status === 'parsing' → "正在解析文件..."
status === 'translating' → "正在翻译... (5/100)"
status === 'generating' → "正在生成文件..."
status === 'complete' → "翻译完成！"
status === 'error' → "翻译失败"
```

### 6. **DownloadButtons（下载按钮）**

**文件：** `src/components/DownloadButtons.tsx`

**功能：**
- 生成 SRT 文件（使用 `srt-generator.ts`）
- 创建 Blob 对象
- 触发浏览器下载
- 支持两种格式下载

**下载流程：**
```typescript
点击下载按钮
  ↓
从 store 获取 translatedEntries
  ↓
调用 generateSRT() 生成内容
  ↓
创建 Blob(内容, { type: 'text/plain' })
  ↓
创建临时 URL（URL.createObjectURL）
  ↓
创建 <a> 标签并点击
  ↓
释放 URL（URL.revokeObjectURL）
```

### 7. **BenefitsSection / HowToUseSection / FAQSection**

**功能：**
- SEO 优化的内容区块
- 从翻译文件读取内容
- 多语言自适应
- 结构化数据展示

**数据来源：** `locales/{locale}.json` 的 `benefits`, `howToUse`, `faq` 对象

---

## 🚀 七、翻译流程详解

### 1. **用户操作流程**

```
1. 用户访问 /en 或其他语言页面
   ↓
2. 上传 SRT 文件
   ↓
3. 选择源语言（例如：English）
   ↓
4. 选择目标语言（例如：Japanese）
   ↓
5. 选择输出格式（单语 / 双语）
   ↓
6. 点击"开始翻译"按钮
   ↓
7. 实时显示翻译进度（1/100, 2/100, ...）
   ↓
8. 翻译完成，显示下载按钮
   ↓
9. 下载翻译后的 SRT 文件
```

### 2. **技术流程**

#### A. 文件解析
**文件：** `src/lib/srt-parser.ts`

**功能：**
- 解析 SRT 格式
- 提取序号、时间戳、文本
- 处理换行符和空行
- 返回 `SubtitleEntry[]`

**SRT 格式示例：**
```srt
1
00:00:01,000 --> 00:00:03,000
This is the first subtitle

2
00:00:04,000 --> 00:00:06,000
This is the second subtitle
```

**解析结果：**
```typescript
[
  {
    index: 1,
    startTime: '00:00:01,000',
    endTime: '00:00:03,000',
    text: 'This is the first subtitle'
  },
  {
    index: 2,
    startTime: '00:00:04,000',
    endTime: '00:00:06,000',
    text: 'This is the second subtitle'
  }
]
```

#### B. 翻译请求
**文件：** `src/lib/translation-client.ts`

**功能：**
- 调用 `/api/translate-stream` API
- 使用 Server-Sent Events (SSE) 流式传输
- 实时更新进度
- 错误处理和重试

**关键代码：**
```typescript
export async function translateSubtitles(
  entries: SubtitleEntry[],
  sourceLanguage: string,
  targetLanguage: string,
  onProgress?: (current: number, total: number, entry: TranslatedEntry) => void
): Promise<TranslationResult> {
  const response = await fetch('/api/translate-stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      entries,
      sourceLanguage,
      targetLanguage,
    }),
  });

  // 读取 SSE 流
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = JSON.parse(line.slice(6));

        if (data.type === 'progress') {
          onProgress?.(data.current, data.total, data.entry);
        } else if (data.type === 'error') {
          throw new Error(data.message);
        }
      }
    }
  }

  return { success: true };
}
```

#### C. API 处理
**文件：** `src/app/api/translate-stream/route.ts`

**功能：**
- Edge Runtime 兼容
- 调用 Google Cloud Translate 或 OpenAI API
- 批量翻译字幕条目
- 流式返回结果

**工作流程：**
```
接收 POST 请求（entries, sourceLanguage, targetLanguage）
  ↓
验证参数
  ↓
创建 ReadableStream
  ↓
循环翻译每个条目：
  ├─ 调用翻译 API
  ├─ 发送进度事件：{ type: 'progress', current, total, entry }
  └─ 延迟 100ms（避免 API 限流）
  ↓
发送完成事件：{ type: 'complete' }
  ↓
关闭流
```

**API 选择逻辑：**
```typescript
// 优先使用 Google Cloud Translate（速度快、成本低）
if (process.env.GOOGLE_CLOUD_API_KEY) {
  return await translateWithGoogle(text, targetLanguage);
}

// 回退到 OpenAI（质量高、成本稍高）
if (process.env.OPENAI_API_KEY) {
  return await translateWithOpenAI(text, sourceLanguage, targetLanguage);
}

throw new Error('No translation API configured');
```

#### D. 文件生成
**文件：** `src/lib/srt-generator.ts`

**功能：**
- 生成 SRT 格式
- 支持单语 / 双语输出
- 触发浏览器下载

**单语格式生成：**
```typescript
export function generateSRT(
  entries: TranslatedEntry[],
  format: 'mono'
): string {
  return entries.map((entry, index) => {
    return `${index + 1}\n${entry.startTime} --> ${entry.endTime}\n${entry.translatedText}\n`;
  }).join('\n');
}
```

**双语格式生成：**
```typescript
export function generateSRT(
  entries: TranslatedEntry[],
  format: 'bilingual'
): string {
  return entries.map((entry, index) => {
    return `${index + 1}\n${entry.startTime} --> ${entry.endTime}\n${entry.text}\n${entry.translatedText}\n`;
  }).join('\n');
}
```

---

## 📊 八、翻译文件管理

### 1. **翻译脚本**

**文件：** `scripts/translate-i18n.js`

**功能：**
- 使用 OpenAI GPT-4o-mini 翻译
- 保持 JSON 嵌套结构
- 支持分块翻译（避免超时）
- 自动重试机制

**核心算法：分块翻译**

**问题：** 一次性翻译整个 JSON 文件（9.3KB）会导致：
- OpenAI API 超时（socket hang up）
- 请求体过大被拒绝
- 耗时过长无响应

**解决方案：** 按顶层键分块翻译

```typescript
async translateMissing(sourceData, targetLang) {
  const topLevelKeys = Object.keys(sourceData);
  const result = {};

  // 按顶层 key 分批翻译（每次 3 个 key）
  const chunkSize = 3;
  for (let i = 0; i < topLevelKeys.length; i += chunkSize) {
    const chunkKeys = topLevelKeys.slice(i, i + chunkSize);
    const chunk = {};

    chunkKeys.forEach(key => {
      chunk[key] = sourceData[key];
    });

    console.log(`翻译块 ${i / chunkSize + 1}: [${chunkKeys.join(', ')}]`);

    // 翻译这个块
    const chunkTranslation = await this.translateBatch(chunk, targetLang);

    if (chunkTranslation) {
      Object.assign(result, chunkTranslation);
      console.log('块完成');
    } else {
      console.log('块失败，跳过');
    }

    // 延迟以避免 API 限制
    if (i + chunkSize < topLevelKeys.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return result;
}
```

**翻译流程示例：**
```
en.json 有 6 个顶层键：meta, common, steps, fileInfo, upload, language

块 1: [meta, common, steps]
  ↓ 翻译成功
  ✅ 保存

延迟 1 秒

块 2: [fileInfo, upload, language]
  ↓ 翻译成功
  ✅ 保存

翻译完成！
```

### 2. **使用示例**

```bash
# 翻译特定语言
node scripts/translate-i18n.js --lang=ja,de,es

# 翻译特定键
node scripts/translate-i18n.js --lang=zh --keys=meta

# 翻译所有语言
node scripts/translate-i18n.js --lang=zh,fr,ja,de,es,ru,it,pt,ar,hi,ko,th,vi,tr,pl,nl,sv

# 强制重新翻译（覆盖已有翻译）
node scripts/translate-i18n.js --lang=fr --force
```

### 3. **配置**

**API 配置：**
```javascript
const config = {
  openai: {
    model: 'gpt-4o-mini',
    temperature: 0.5,
    maxTokens: 8000,  // 增加到 8000 以容纳完整的 JSON 翻译
    batchSize: 5,
    delayBetweenBatches: 1000,
  },
};
```

**超时和重试：**
```javascript
constructor() {
  this.openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 60000,  // 60 秒超时
    maxRetries: 3,   // 最多重试 3 次
  });
}
```

### 4. **翻译质量保证**

- ✅ 所有 18 种语言保持相同的 JSON 结构
- ✅ 使用专业的 AI 翻译（GPT-4o-mini）
- ✅ 保留格式化和特殊字符
- ✅ 支持 RTL 语言（阿拉伯语）
- ✅ 上下文感知翻译（不是逐字翻译）

**翻译提示词：**
```javascript
const prompt = `You are a professional translator. Translate the following JSON object to ${targetLang}.

IMPORTANT RULES:
1. Maintain the EXACT same JSON structure (all keys, nested objects, arrays)
2. Only translate the VALUES, never translate the KEYS
3. Preserve all formatting, line breaks, and special characters
4. Use natural, native-like ${targetLang} expressions
5. Return ONLY valid JSON, no explanations

Source JSON:
${JSON.stringify(chunk, null, 2)}`;
```

---

## 🎯 九、数据流向图

### 完整数据流

```
1. 用户访问 /zh
   ↓
2. middleware.ts 验证语言代码
   ↓
3. app/[locale]/layout.tsx
   ├─ generateMetadata()
   │  └─ 加载 zh.json 的 meta 对象
   │     └─ 返回 { title: "字幕翻译器 - 基于AI的SRT翻译", ... }
   │
   └─ getMessagesForLocale('zh')
      └─ 加载完整的 zh.json
         └─ 返回 { meta: {...}, common: {...}, steps: {...}, ... }
   ↓
4. NextIntlClientProvider 提供翻译上下文
   ↓
5. app/[locale]/page.tsx (HomePage)
   ├─ useTranslations('common')
   │  └─ t('title') = "字幕翻译器"
   │
   ├─ useTranslations('steps')
   │  └─ tSteps('step1') = "步骤 1"
   │
   └─ 所有组件显示中文文本
```

### 翻译流程数据流

```
用户上传 file.srt
  ↓
FileUploader 组件
  ├─ FileReader 读取文件
  ├─ srt-parser.ts 解析 SRT
  └─ store.setOriginalEntries(entries)
  ↓
用户选择语言
  ├─ store.setSourceLanguage('en')
  └─ store.setTargetLanguage('ja')
  ↓
用户点击"开始翻译"
  ↓
handleStartTranslation()
  ├─ store.setStatus('translating')
  └─ translateSubtitles(entries, 'en', 'ja', onProgress)
      ↓
      fetch('/api/translate-stream', { entries, sourceLanguage, targetLanguage })
      ↓
      API Route (Edge Runtime)
      ├─ 验证参数
      ├─ 创建 ReadableStream
      └─ 循环翻译每个条目
          ├─ 调用 Google Cloud Translate API
          ├─ 返回 SSE: { type: 'progress', current: 1, total: 100, entry: {...} }
          └─ onProgress 回调
              ├─ store.setCurrentIndex(1)
              └─ store.updateTranslatedEntry(0, translatedText)
      ↓
      TranslationProgress 组件实时更新 UI
      ↓
      所有条目翻译完成
      ├─ store.setStatus('complete')
      └─ DownloadButtons 组件显示
          ↓
          用户点击下载
          ├─ srt-generator.ts 生成 SRT 文件
          ├─ 创建 Blob
          └─ 触发浏览器下载
```

---

## 🔑 十、关键设计决策

### 1. **为什么使用 Edge Runtime？**

**原因：** Cloudflare Pages 只支持 Edge Runtime

**Edge Runtime 限制：**
- ❌ 不能使用 Node.js `fs` 模块
- ❌ 不能使用 Node.js `path` 模块
- ❌ 不能使用动态 `require()`
- ❌ 冷启动时间要求 < 50ms

**解决方案：**
- ✅ 使用 ES6 `import` 静态导入翻译文件
- ✅ 避免使用 Node.js 专有 API
- ✅ 使用 Web 标准 API（fetch, Request, Response）

**配置：**
```typescript
// next.config.ts
export default {
  runtime: 'edge',  // 使用 Edge Runtime
};
```

### 2. **为什么英语也用 /en 前缀？**

**原因：** 简化路由逻辑，统一处理

**好处：**
- ✅ 语言切换器逻辑一致（不需要特殊判断）
- ✅ middleware 逻辑简单（统一处理所有语言）
- ✅ SEO 友好（每种语言有独立的 URL）
- ✅ 避免根路径冲突（`/` 只用于重定向）

**对比：**

| 方案 | 英语 URL | 中文 URL | 逻辑复杂度 |
|------|---------|---------|-----------|
| 方案 A（当前） | `/en` | `/zh` | ⭐ 简单 |
| 方案 B（备选） | `/` | `/zh` | ⭐⭐⭐ 复杂 |

### 3. **为什么使用 Zustand 而非 React Context？**

**性能对比：**

| 场景 | Zustand | React Context |
|------|---------|---------------|
| 单个状态更新 | ✅ 只重新渲染订阅该状态的组件 | ❌ 重新渲染所有使用 Context 的组件 |
| 多个独立状态 | ✅ 可独立订阅 | ❌ 任何状态变化都触发全部重新渲染 |
| TypeScript 支持 | ✅ 原生 | ⚠️ 需要额外配置 |
| 代码量 | ✅ 少 | ⚠️ 中等 |

**示例：**

```typescript
// Zustand - 只订阅需要的状态
const file = useTranslationStore(state => state.file);  // 只有 file 变化才重新渲染

// React Context - 任何状态变化都重新渲染
const { file, status, progress, ... } = useContext(TranslationContext);  // 全部重新渲染
```

### 4. **为什么分块翻译？**

**问题：** OpenAI API 对单次请求有限制

| 限制类型 | 限制值 | 影响 |
|---------|-------|-----|
| 请求超时 | 60 秒 | socket hang up 错误 |
| 请求体大小 | ~100KB | 请求被拒绝 |
| Token 限制 | 8192 tokens | 翻译不完整 |

**解决方案：** 按顶层键分块（每次 3 个键）

**效果：**
- ✅ 每个请求 < 10 秒
- ✅ 请求体 < 10KB
- ✅ 成功率 > 95%

**配置：**
```javascript
const chunkSize = 3;  // 每次翻译 3 个顶层键
const delay = 1000;   // 两次请求间隔 1 秒
```

### 5. **为什么使用 next-intl 而非 react-i18next？**

**对比：**

| 特性 | next-intl | react-i18next |
|------|-----------|---------------|
| Next.js 集成 | ✅ 原生支持 App Router | ⚠️ 需要额外配置 |
| SSR 支持 | ✅ 完美 | ⚠️ 需要手动处理 |
| 类型安全 | ✅ TypeScript 原生 | ⚠️ 需要插件 |
| 性能 | ✅ 优秀（编译时优化） | ⚠️ 中等（运行时处理） |
| 学习曲线 | ✅ 简单 | ⚠️ 中等 |

**next-intl 优势：**
- ✅ 为 Next.js 15 App Router 设计
- ✅ 支持 Server Components 和 Client Components
- ✅ 自动处理 locale 路由
- ✅ 内置 TypeScript 类型推断

---

## 📝 十一、文件职责总结表

| 文件/目录 | 职责 | 关键特性 | 依赖 |
|----------|------|---------|------|
| `src/app/page.tsx` | 根页面 | 重定向到 /en | Next.js |
| `src/app/layout.tsx` | 全局布局 | HTML 结构、字体、默认 SEO | Next.js, Inter 字体 |
| `src/app/[locale]/layout.tsx` | 语言布局 | 动态 SEO、i18n Provider | next-intl, get-messages.ts |
| `src/app/[locale]/page.tsx` | 主页面 | 字幕翻译器界面 | next-intl, Zustand, 所有组件 |
| `middleware.ts` | 路由中间件 | 语言检测、重定向 | i18nConfig, Negotiator |
| `i18nConfig.ts` | i18n 配置 | 语言列表、默认语言 | - |
| `src/i18n.ts` | next-intl 配置 | 动态加载翻译 | next-intl |
| `src/lib/get-messages.ts` | 翻译加载器 | Edge 兼容、静态导入 | ui-locales.ts |
| `src/store/translation-store.ts` | 状态管理 | Zustand store | Zustand |
| `src/components/LanguageChanger.tsx` | 语言切换器 | 下拉菜单、路由切换 | next/navigation |
| `src/components/FileUploader.tsx` | 文件上传 | 拖拽上传、SRT 解析 | srt-parser.ts, Zustand |
| `src/components/LanguageSelector.tsx` | 语言选择 | 源/目标语言选择 | languages.ts, Zustand |
| `src/components/OutputFormatSelector.tsx` | 格式选择 | 单语/双语格式 | Zustand |
| `src/components/TranslationProgress.tsx` | 进度显示 | 进度条、状态文本 | Zustand, next-intl |
| `src/components/DownloadButtons.tsx` | 下载按钮 | 生成并下载 SRT | srt-generator.ts, Zustand |
| `src/components/BenefitsSection.tsx` | 优势区块 | SEO 内容 | next-intl |
| `src/components/HowToUseSection.tsx` | 使用说明 | SEO 内容 | next-intl |
| `src/components/FAQSection.tsx` | FAQ 区块 | SEO 内容 | next-intl |
| `src/lib/srt-parser.ts` | SRT 解析器 | 解析 SRT 格式 | - |
| `src/lib/srt-generator.ts` | SRT 生成器 | 生成 SRT 文件 | - |
| `src/lib/translation-client.ts` | 翻译客户端 | 调用 API、SSE 流 | - |
| `src/app/api/translate-stream/route.ts` | 翻译 API | Edge Runtime、流式返回 | Google/OpenAI API |
| `src/config/ui-locales.ts` | UI 语言配置 | 20 种语言定义 | - |
| `src/config/languages.ts` | 翻译语言配置 | 50+ 翻译语言 | - |
| `locales/*.json` | 翻译文件 | 18 种语言翻译 | - |
| `scripts/translate-i18n.js` | 翻译脚本 | AI 自动翻译 | OpenAI API |

---

## 🎓 十二、总结

### 技术栈

这是一个**现代化的多语言 SRT 字幕翻译应用**，采用：

- ✅ **Next.js 15.5.2** - 最新的 React 框架，App Router 架构
- ✅ **Edge Runtime** - Cloudflare Pages 部署，全球 CDN 加速
- ✅ **next-intl** - 完整的 i18n 支持，SSR 友好
- ✅ **Zustand** - 轻量级状态管理，性能优秀
- ✅ **TypeScript** - 类型安全，开发体验好
- ✅ **Tailwind CSS** - 现代化样式，响应式设计
- ✅ **OpenAI GPT-4o-mini** - AI 自动翻译脚本
- ✅ **Google Cloud Translate** - 高质量字幕翻译
- ✅ **Server-Sent Events** - 实时进度推送

### 核心特性

#### 🌍 国际化
- **18 种界面语言**：en, zh, ja, fr, de, es, ru, it, pt, ar, hi, ko, th, vi, tr, pl, nl, sv
- **独立 SEO 元数据**：每种语言有本地化的 title, description, keywords
- **自动语言检测**：根据浏览器设置自动跳转到对应语言
- **语言切换器**：实时切换界面语言，URL 同步更新

#### 🚀 翻译功能
- **50+ 翻译语言**：支持全球主要语言
- **实时进度显示**：SSE 流式传输，实时更新翻译进度
- **两种输出格式**：单语（仅翻译）、双语（原文+翻译）
- **拖拽上传**：支持拖拽或点击上传 SRT 文件
- **错误处理**：完善的错误提示和重试机制

#### 📊 SEO 优化
- **多语言 meta 标签**：每种语言独立的 SEO 元数据
- **结构化内容**：Benefits, How to Use, FAQ 区块
- **语义化 HTML**：正确的标题层级和语义标签
- **响应式设计**：移动端友好

#### ⚡ 性能优化
- **Edge Runtime**：全球 CDN 加速，低延迟
- **静态导入**：编译时优化，减少运行时开销
- **状态管理**：Zustand 避免不必要的重新渲染
- **代码分割**：按需加载组件

### 主页面位置

**核心文件：** `src/app/[locale]/page.tsx`

**访问方式：**
- 英语：`https://your-domain.com/en`
- 中文：`https://your-domain.com/zh`
- 日语：`https://your-domain.com/ja`
- 其他：`https://your-domain.com/{locale}`

### 部署平台

- **主要平台**：Cloudflare Pages
- **备选平台**：Vercel, Netlify（需调整配置）
- **构建命令**：`npm run build` 或 `npm run pages:build`
- **输出目录**：`.next` 或 `out`（静态导出）

### 环境变量

```bash
# Google Cloud Translate API（推荐）
GOOGLE_CLOUD_API_KEY=your_google_api_key

# OpenAI API（备选）
OPENAI_API_KEY=your_openai_api_key

# 翻译脚本专用
OPENAI_API_KEY=sk-proj-...  # 用于 scripts/translate-i18n.js
```

---

## 📚 相关文档

- [Next.js 15 文档](https://nextjs.org/docs)
- [next-intl 文档](https://next-intl-docs.vercel.app/)
- [Zustand 文档](https://zustand-demo.pmnd.rs/)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

---

## 🔄 最近更新

### 2024-10-26
- ✅ 添加多语言 SEO meta 标签支持（`generateMetadata` 函数）
- ✅ 修复语言切换器在选择英语时无响应的问题
- ✅ 翻译所有 18 种语言的 meta 对象（title, description, keywords）
- ✅ 统一所有语言使用 `/[locale]` 前缀路由

### 2024-12 （之前）
- ✅ 修复翻译文件结构不匹配问题（flat → nested）
- ✅ 实现分块翻译算法（避免 API 超时）
- ✅ 添加 16 种语言的完整翻译
- ✅ 优化翻译脚本（增加超时和重试机制）

---

**文档版本：** 1.0
**最后更新：** 2024-10-26
**维护者：** Sub-Trans4 Team
