# i18n 多语言系统完整指南

本文档详细解释项目的国际化（i18n）多语言系统架构和使用方法。

---

## 📖 目录

1. [核心概念](#核心概念)
2. [文件结构](#文件结构)
3. [如何使用翻译](#如何使用翻译)
4. [如何添加新文案](#如何添加新文案)
5. [翻译工作流程](#翻译工作流程)
6. [SEO 优化策略](#seo-优化策略)
7. [最佳实践](#最佳实践)

---

## 核心概念

### 什么是 i18n？

**i18n** = Internationalization（国际化）
- "i" 和 "n" 之间有 18 个字母
- 让应用支持多种语言的过程
- 用户根据浏览器语言或 URL 自动看到对应语言

### 项目使用的技术栈

- **next-intl**: Next.js 官方推荐的 i18n 库
- **JSON 文件**: 存储所有翻译文案
- **动态路由**: `/[locale]` 支持多语言 URL

---

## 文件结构

```
subtitle-translator/
├── locales/                    # 翻译文件目录
│   ├── en.json                # 英文（基准语言）
│   ├── zh.json                # 简体中文
│   ├── es.json                # 西班牙语
│   └── ... (20种语言)
│
├── src/
│   ├── config/
│   │   └── ui-locales.ts      # UI 语言配置
│   │
│   ├── i18n.ts                # i18n 配置文件
│   │
│   ├── app/
│   │   └── [locale]/          # 动态语言路由
│   │       ├── layout.tsx     # 布局（包含 NextIntlClientProvider）
│   │       └── page.tsx       # 主页
│   │
│   └── components/
│       ├── BenefitsSection.tsx
│       ├── HowToUseSection.tsx
│       └── FAQSection.tsx
│
└── scripts/
    └── translate-locales.ts   # 自动翻译工具
```

---

## 如何使用翻译

### 1. 在 React 组件中使用

```tsx
'use client';

import { useTranslations } from 'next-intl';

export function MyComponent() {
  // 加载 'common' 命名空间的翻译
  const t = useTranslations('common');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

### 2. 使用多个命名空间

```tsx
export function HomePage() {
  const t = useTranslations('common');
  const tSteps = useTranslations('steps');
  const tError = useTranslations('errors');

  return (
    <div>
      <h1>{t('title')}</h1>
      <h2>{tSteps('step1')}</h2>
      <p>{tError('invalidFile')}</p>
    </div>
  );
}
```

### 3. 使用嵌套的翻译键

```tsx
const t = useTranslations('benefits');

// 访问嵌套的键
t('aiPowered.title')        // "AI-Powered Accuracy"
t('aiPowered.description')  // "Advanced AI technology..."
```

### 4. 使用动态值（插值）

```tsx
const t = useTranslations('progress');

// en.json: "translating": "Translating subtitle {current} of {total}..."
t('translating', { current: 5, total: 100 })
// 输出: "Translating subtitle 5 of 100..."
```

---

## 如何添加新文案

### 步骤 1: 在 `locales/en.json` 中添加英文文案

```json
{
  "myNewSection": {
    "title": "My New Title",
    "description": "This is a description",
    "items": {
      "item1": "First item",
      "item2": "Second item"
    }
  }
}
```

**命名规范**：
- 使用 camelCase（驼峰命名）
- 有意义的键名（避免 `text1`, `text2`）
- 使用嵌套结构组织相关内容

### 步骤 2: 在组件中使用

```tsx
export function MyNewSection() {
  const t = useTranslations('myNewSection');

  return (
    <div>
      <h2>{t('title')}</h2>
      <p>{t('description')}</p>
      <ul>
        <li>{t('items.item1')}</li>
        <li>{t('items.item2')}</li>
      </ul>
    </div>
  );
}
```

### 步骤 3: 运行自动翻译工具

```bash
# 翻译所有语言（增量翻译，只翻译新增内容）
npm run translate:all

# 或翻译特定语言
npm run translate:locale zh
```

---

## 翻译工作流程

### 自动翻译流程

```
┌─────────────────┐
│  修改 en.json    │  开发者添加新文案（英文）
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ npm run         │  运行翻译工具
│ translate:all   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 检测缺失的键     │  对比 en.json 和其他语言文件
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 调用 OpenAI API │  使用 GPT-3.5-turbo 翻译
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 更新语言文件     │  zh.json, es.json, fr.json...
└─────────────────┘
```

### 翻译工具的智能功能

1. **增量翻译**: 只翻译新增或修改的键，不覆盖已有翻译
2. **上下文感知**: OpenAI 理解键的层级结构和上下文
3. **保留格式**: 自动保留 `{variable}` 插值变量
4. **元数据追踪**: 记录翻译时间和版本

---

## SEO 优化策略

### 1. URL 多语言化

项目使用动态路由 `[locale]` 支持多语言 URL：

```
https://your-site.com/en          # 英文
https://your-site.com/zh          # 中文
https://your-site.com/es          # 西班牙语
https://your-site.com/fr          # 法语
```

**SEO 好处**：
- ✅ Google 自动识别语言
- ✅ 用户分享链接时保留语言
- ✅ 每种语言独立的搜索排名

### 2. 关键词优化策略

在 `locales/en.json` 中，我们特意包含了用户会搜索的关键词：

#### 主要关键词（Primary Keywords）
```json
{
  "benefits": {
    "title": "Why Choose Our SRT Translator?",  // "SRT Translator" - 核心关键词
  },
  "faq": {
    "q1": {
      "question": "What is an SRT file and how do I get one?",  // "SRT file" - 高频搜索
      "answer": "An SRT (SubRip Subtitle) file..."  // 解释术语，增加权威性
    }
  }
}
```

#### 长尾关键词（Long-tail Keywords）
```json
{
  "faq": {
    "q3": {
      "question": "Can I translate subtitles for YouTube videos?",  // "translate subtitles for YouTube"
      "answer": "Yes! Our tool is perfect for YouTube creators..."
    }
  }
}
```

#### 相关动词和名词
```json
{
  "benefits": {
    "instantTranslation": {
      "title": "Instant Translation",
      "description": "Translate hundreds of subtitle lines..."  // "translate" 动词重复出现
    }
  },
  "howToUse": {
    "step1": {
      "title": "Upload Your SRT File",  // "upload" 动词
      "description": "Drag and drop your subtitle file..."  // "subtitle file" 名词
    },
    "step3": {
      "title": "Download Translated Subtitles",  // "download" + "translated subtitles"
      "description": "...download your translated SRT file..."
    }
  }
}
```

### 3. SEO 关键词分布

| 关键词 | 出现位置 | 频率 |
|--------|---------|------|
| SRT translator | 标题、Benefits | 5+ 次 |
| subtitle translation | 描述、FAQ | 10+ 次 |
| translate subtitles | How to Use、FAQ | 8+ 次 |
| YouTube subtitles | FAQ | 3 次 |
| bilingual subtitles | Benefits、FAQ | 4 次 |
| free subtitle translator | Benefits | 2 次 |

### 4. 语义化 HTML 标签

组件使用正确的 HTML 标签增强 SEO：

```tsx
<section>  {/* 语义化区块 */}
  <h2>     {/* 主标题 - H2 权重高 */}
  <h3>     {/* 子标题 */}
  <p>      {/* 段落 */}
  <ul>     {/* 列表 */}
</section>
```

---

## 多语言逻辑详解

### 系统架构

```
用户访问 → 检测语言 → 加载对应翻译 → 渲染页面
```

### 1. 语言检测流程

```typescript
// src/i18n.ts
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  return {
    messages: (await import(`../locales/${locale}.json`)).default
  };
});
```

**工作原理**：
1. 用户访问 `/zh` → `locale = 'zh'`
2. 系统加载 `locales/zh.json`
3. 所有 `useTranslations()` 读取这个文件

### 2. 路由配置

```typescript
// src/app/[locale]/layout.tsx
export default function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

**工作原理**：
- `[locale]` 是动态路由参数
- 自动从 URL 提取语言代码
- `NextIntlClientProvider` 让所有子组件能使用 `useTranslations()`

### 3. 组件使用翻译

```typescript
// src/components/BenefitsSection.tsx
export function BenefitsSection() {
  const t = useTranslations('benefits');  // 加载 'benefits' 命名空间

  const benefits = [
    'aiPowered',
    'instantTranslation',
    'multiLanguage'
  ];

  return (
    <div>
      {benefits.map((benefit) => (
        <div key={benefit}>
          <h3>{t(`${benefit}.title`)}</h3>      {/* benefits.aiPowered.title */}
          <p>{t(`${benefit}.description`)}</p>  {/* benefits.aiPowered.description */}
        </div>
      ))}
    </div>
  );
}
```

**为什么这样设计？**

✅ **类型安全**: TypeScript 会检查键是否存在
✅ **DRY 原则**: 不重复代码，用循环生成
✅ **易维护**: 添加新项目只需修改数组
✅ **自动翻译**: 运行翻译工具会自动处理所有语言

---

## 最佳实践

### ✅ DO（推荐做法）

1. **使用嵌套结构组织相关内容**
   ```json
   {
     "benefits": {
       "aiPowered": {
         "title": "...",
         "description": "..."
       }
     }
   }
   ```

2. **使用有意义的键名**
   ```json
   {
     "errors": {
       "invalidFile": "...",      // ✅ 好
       "fileTooLarge": "..."      // ✅ 好
     }
   }
   ```

3. **插值变量使用描述性名称**
   ```json
   {
     "progress": {
       "translating": "Translating subtitle {current} of {total}..."  // ✅ 好
     }
   }
   ```

4. **在英文文案中包含 SEO 关键词**
   ```json
   {
     "faq": {
       "q3": {
         "question": "Can I translate subtitles for YouTube videos?"  // ✅ 包含关键词
       }
     }
   }
   ```

### ❌ DON'T（避免做法）

1. **❌ 不要硬编码文本**
   ```tsx
   // ❌ 错误
   <h1>Subtitle Translator</h1>

   // ✅ 正确
   <h1>{t('title')}</h1>
   ```

2. **❌ 不要使用无意义的键名**
   ```json
   {
     "text1": "...",    // ❌ 不好
     "text2": "...",    // ❌ 不好
     "error1": "..."    // ❌ 不好
   }
   ```

3. **❌ 不要在代码中拼接翻译**
   ```tsx
   // ❌ 错误
   <p>{t('step')} 1: {t('upload')}</p>

   // ✅ 正确
   <p>{t('step1')}: {t('step1Description')}</p>
   ```

4. **❌ 不要在翻译中包含 HTML**
   ```json
   {
     "message": "<strong>Error</strong>: Something went wrong"  // ❌ 不要这样
   }
   ```
   应该在组件中处理格式：
   ```tsx
   <p><strong>{t('error')}</strong>: {t('errorMessage')}</p>
   ```

---

## 实际案例分析

### 案例 1: Benefits 板块

**需求**: 展示 6 个产品优势，支持 20 种语言

**JSON 结构**:
```json
{
  "benefits": {
    "title": "Why Choose Our SRT Translator?",
    "subtitle": "Powerful features...",
    "aiPowered": {
      "title": "AI-Powered Accuracy",
      "description": "Advanced AI technology..."
    },
    "instantTranslation": { ... },
    "multiLanguage": { ... },
    "bilingualOutput": { ... },
    "freeToUse": { ... },
    "privacyFirst": { ... }
  }
}
```

**组件实现**:
```tsx
export function BenefitsSection() {
  const t = useTranslations('benefits');

  const benefits = [
    'aiPowered',
    'instantTranslation',
    'multiLanguage',
    'bilingualOutput',
    'freeToUse',
    'privacyFirst',
  ] as const;

  return (
    <section>
      <h2>{t('title')}</h2>
      <p>{t('subtitle')}</p>

      <div>
        {benefits.map((benefit) => (
          <div key={benefit}>
            <h3>{t(`${benefit}.title`)}</h3>
            <p>{t(`${benefit}.description`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

**为什么这样设计？**

1. **可扩展**: 添加新优势只需：
   - 在 JSON 添加新键
   - 在数组添加新项
   - 运行 `npm run translate:all`

2. **类型安全**:
   ```typescript
   const benefits = [...] as const;  // TypeScript 确保这些键存在
   ```

3. **自动化**: 翻译工具自动处理所有语言

---

### 案例 2: FAQ 板块（带交互）

**需求**: 可展开的常见问题，支持多语言

**JSON 结构**:
```json
{
  "faq": {
    "title": "Frequently Asked Questions",
    "subtitle": "Everything you need to know...",
    "q1": {
      "question": "What is an SRT file?",
      "answer": "An SRT file is..."
    },
    "q2": { ... }
  }
}
```

**组件实现**:
```tsx
export function FAQSection() {
  const t = useTranslations('faq');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const questions = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'] as const;

  return (
    <section>
      <h2>{t('title')}</h2>

      {questions.map((q, index) => (
        <div key={q}>
          <button onClick={() => setOpenIndex(index)}>
            {t(`${q}.question`)}
          </button>
          {openIndex === index && (
            <div>{t(`${q}.answer`)}</div>
          )}
        </div>
      ))}
    </section>
  );
}
```

**关键点**:
- 状态管理（展开/折叠）独立于翻译
- 所有文本都可翻译，交互逻辑不变
- SEO 友好：所有问题和答案都在 HTML 中（即使隐藏）

---

## 翻译工作流程示例

### 场景: 添加新的 "Pricing" 板块

#### 步骤 1: 添加英文文案

编辑 `locales/en.json`:
```json
{
  "pricing": {
    "title": "Simple, Transparent Pricing",
    "subtitle": "Choose the plan that works for you",
    "free": {
      "title": "Free",
      "price": "$0",
      "features": [
        "50 translations per day",
        "All 50 languages",
        "Bilingual subtitles"
      ]
    },
    "pro": {
      "title": "Pro",
      "price": "$9.99/month",
      "features": [
        "Unlimited translations",
        "Priority support",
        "API access"
      ]
    }
  }
}
```

#### 步骤 2: 创建组件

```tsx
// src/components/PricingSection.tsx
'use client';

import { useTranslations } from 'next-intl';

export function PricingSection() {
  const t = useTranslations('pricing');

  return (
    <section>
      <h2>{t('title')}</h2>
      <p>{t('subtitle')}</p>

      <div>
        {/* Free Plan */}
        <div>
          <h3>{t('free.title')}</h3>
          <p>{t('free.price')}</p>
          <ul>
            {/* 注意：数组需要特殊处理 */}
            <li>{t('free.features.0')}</li>
            <li>{t('free.features.1')}</li>
            <li>{t('free.features.2')}</li>
          </ul>
        </div>

        {/* Pro Plan */}
        <div>
          <h3>{t('pro.title')}</h3>
          <p>{t('pro.price')}</p>
          <ul>
            <li>{t('pro.features.0')}</li>
            <li>{t('pro.features.1')}</li>
            <li>{t('pro.features.2')}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
```

**注意**: JSON 数组的处理方式
- `features` 是数组，用索引访问：`features.0`, `features.1`
- 或者改为对象结构更灵活

#### 步骤 3: 运行翻译工具

```bash
# 检查需要翻译的内容
npm run translate:check

# 翻译所有语言
npm run translate:all
```

输出示例：
```
🔍 开始检查翻译状态...

en.json: 基准文件，包含 85 个键
zh.json: 缺少 15 个键
  - pricing.title
  - pricing.subtitle
  - pricing.free.title
  ...

开始翻译 zh.json...
✅ 翻译 pricing.title
✅ 翻译 pricing.subtitle
...
翻译完成！共翻译 15 个新键

翻译西班牙语...
✅ 翻译完成

所有语言翻译完成！
```

#### 步骤 4: 验证翻译

```bash
# 启动开发服务器
npm run dev

# 访问不同语言版本
# http://localhost:3000/en  (英文)
# http://localhost:3000/zh  (中文)
# http://localhost:3000/es  (西班牙语)
```

---

## 故障排查

### 问题 1: 翻译显示为键名而不是文本

**症状**: 页面显示 `benefits.title` 而不是 "Why Choose Our SRT Translator?"

**原因**:
1. JSON 文件中缺少该键
2. 命名空间错误
3. 语言文件未正确加载

**解决方案**:
```bash
# 检查文件是否存在
cat locales/en.json | grep "benefits"

# 重新运行翻译
npm run translate:all
```

### 问题 2: 翻译工具报错 "OPENAI_API_KEY not found"

**原因**: `.env.local` 文件缺失或未正确配置

**解决方案**:
```bash
# 确认文件存在
ls -la .env.local

# 检查内容
cat .env.local | grep OPENAI_API_KEY

# 如果缺失，添加
echo 'OPENAI_API_KEY=your-key-here' >> .env.local
```

### 问题 3: 新语言未生效

**原因**: 语言代码未添加到配置中

**解决方案**:
```typescript
// src/config/ui-locales.ts
export const UI_LOCALES = [
  'en', 'zh', 'es', 'fr', 'de',
  'ja', 'ko', 'pt', 'ru', 'ar',
  // ... 添加新语言代码
  'sv',  // 瑞典语
] as const;
```

---

## 总结

### 多语言系统的关键要点

1. **单一真相源**: `en.json` 是唯一手动编辑的文件
2. **自动化**: 其他语言通过工具自动翻译
3. **类型安全**: TypeScript 确保翻译键存在
4. **SEO 优化**: 文案包含关键词，支持多语言 URL
5. **用户友好**: 根据 URL 自动切换语言

### 开发工作流

```
编辑 en.json → 创建组件 → 运行翻译工具 → 测试 → 部署
```

### 常用命令

```bash
# 翻译所有语言
npm run translate:all

# 翻译单一语言
npm run translate:locale zh

# 检查翻译状态
npm run translate:check

# 强制重新翻译
npm run translate:force
```

---

**🎉 现在你已经完全理解了项目的 i18n 多语言系统！**

需要添加新语言或新文案时，参考这个文档即可。
