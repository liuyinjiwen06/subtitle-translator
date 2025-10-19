# 语言配置说明

本文档详细说明项目中两种不同的语言系统配置，以及如何正确区分和使用它们。

---

## 🚨 重要概念区分

本项目涉及**两种不同的语言系统**，必须严格区分：

| 语言系统 | 用途 | 代码格式 | 数量 | URL示例 |
|---------|------|---------|------|---------|
| **UI 语言** | 页面界面显示语言 | 简写（ISO 639-1）| 20种 | `/en`, `/zh`, `/fr` |
| **翻译语言** | 字幕翻译的源/目标语言 | 全称（英文名）| 50种 | `/en/french-to-chinese` |

### 为什么要区分？

1. **URL 清晰度**：`/zh/french-to-chinese` 表示"用中文界面查看法语翻译成中文的页面"
2. **SEO 优化**：搜索引擎更容易理解语义明确的 URL
3. **代码可维护性**：避免混淆 `fr`（UI法语）和 `french`（翻译源/目标语言）

---

## 📱 UI 语言（页面界面语言）

### 概述
- **数量**：20 种
- **格式**：ISO 639-1 代码（2个字母简写）
- **用途**：控制网站界面显示的语言（按钮、标题、提示文字等）
- **路由位置**：`/[locale]` 部分

### 支持的 UI 语言列表

| 语言 | 代码 | 母语名称 | 英文名称 |
|-----|------|---------|---------|
| 英语 | `en` | English | English |
| 中文（简体）| `zh` | 简体中文 | Chinese (Simplified) |
| 西班牙语 | `es` | Español | Spanish |
| 法语 | `fr` | Français | French |
| 德语 | `de` | Deutsch | German |
| 日语 | `ja` | 日本語 | Japanese |
| 韩语 | `ko` | 한국어 | Korean |
| 葡萄牙语 | `pt` | Português | Portuguese |
| 俄语 | `ru` | Русский | Russian |
| 阿拉伯语 | `ar` | العربية | Arabic |
| 印地语 | `hi` | हिन्दी | Hindi |
| 意大利语 | `it` | Italiano | Italian |
| 土耳其语 | `tr` | Türkçe | Turkish |
| 越南语 | `vi` | Tiếng Việt | Vietnamese |
| 泰语 | `th` | ไทย | Thai |
| 波兰语 | `pl` | Polski | Polish |
| 荷兰语 | `nl` | Nederlands | Dutch |
| 印尼语 | `id` | Bahasa Indonesia | Indonesian |
| 乌克兰语 | `uk` | Українська | Ukrainian |
| 瑞典语 | `sv` | Svenska | Swedish |

### UI 语言配置文件

位置：`config/ui-locales.ts`

```typescript
export const UI_LOCALES = [
  'en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'pt', 'ru', 'ar',
  'hi', 'it', 'tr', 'vi', 'th', 'pl', 'nl', 'id', 'uk', 'sv'
] as const;

export type UILocale = typeof UI_LOCALES[number];

export const UI_LOCALE_NAMES: Record<UILocale, { native: string; english: string }> = {
  en: { native: 'English', english: 'English' },
  zh: { native: '简体中文', english: 'Chinese (Simplified)' },
  es: { native: 'Español', english: 'Spanish' },
  // ... 其余18种语言
};

export const DEFAULT_LOCALE: UILocale = 'en';
```

### 翻译文件结构

位置：`locales/`

```
locales/
├── en.json          # 英语
├── zh.json          # 中文
├── es.json          # 西班牙语
├── fr.json          # 法语
├── de.json          # 德语
├── ja.json          # 日语
├── ko.json          # 韩语
├── pt.json          # 葡萄牙语
├── ru.json          # 俄语
├── ar.json          # 阿拉伯语
├── hi.json          # 印地语
├── it.json          # 意大利语
├── tr.json          # 土耳其语
├── vi.json          # 越南语
├── th.json          # 泰语
├── pl.json          # 波兰语
├── nl.json          # 荷兰语
├── id.json          # 印尼语
├── uk.json          # 乌克兰语
└── sv.json          # 瑞典语
```

### 翻译文件示例（en.json）

```json
{
  "common": {
    "title": "Subtitle Translator",
    "description": "Translate SRT subtitles to 50+ languages using AI",
    "upload": "Upload SRT File",
    "translate": "Start Translation",
    "download": "Download",
    "loading": "Processing..."
  },
  "upload": {
    "dragDrop": "Drag and drop your SRT file here",
    "or": "or",
    "browse": "Browse Files",
    "maxSize": "Maximum file size: 5MB",
    "formatSupport": "Only .srt format is supported"
  },
  "language": {
    "source": "Source Language",
    "target": "Target Language",
    "selectPlaceholder": "Select a language..."
  },
  "output": {
    "title": "Select Output Format",
    "monoSubtitle": "Target language only",
    "bilingualSubtitle": "Bilingual (source + target)",
    "both": "Both formats"
  },
  "progress": {
    "parsing": "Parsing SRT file...",
    "translating": "Translating subtitle {current} of {total}...",
    "generating": "Generating subtitle files...",
    "complete": "Translation complete!"
  },
  "errors": {
    "invalidFile": "Invalid SRT file format",
    "fileTooLarge": "File size exceeds 5MB",
    "apiError": "Translation service error. Please try again.",
    "rateLimitHourly": "Hourly limit reached (10 translations). Please try again later.",
    "rateLimitDaily": "Daily limit reached (50 translations). Please come back tomorrow.",
    "networkError": "Network connection error. Please check your internet."
  },
  "_meta": {
    "lastUpdated": "2025-01-19T10:00:00Z",
    "version": "1.0.0"
  }
}
```

### URL 路由示例

```
/en              → 英语界面，主页
/zh              → 中文界面，主页
/fr              → 法语界面，主页
/ja              → 日语界面，主页
```

---

## 🌍 翻译语言（字幕翻译支持的语言）

### 概述
- **数量**：50 种
- **格式**：英文全称（小写，用连字符连接）
- **用途**：字幕翻译的源语言和目标语言
- **路由位置**：`/[locale]/[language-pair]` 中的 `[language-pair]` 部分

### 支持的翻译语言列表

| 序号 | 英文全称 | 代码简写 | 中文名称 | 母语人数（百万）|
|-----|---------|---------|---------|----------------|
| 1 | english | en | 英语 | 1,450 |
| 2 | chinese | zh | 中文（简体）| 1,120 |
| 3 | hindi | hi | 印地语 | 602 |
| 4 | spanish | es | 西班牙语 | 548 |
| 5 | french | fr | 法语 | 274 |
| 6 | arabic | ar | 阿拉伯语 | 274 |
| 7 | bengali | bn | 孟加拉语 | 272 |
| 8 | portuguese | pt | 葡萄牙语 | 264 |
| 9 | russian | ru | 俄语 | 258 |
| 10 | urdu | ur | 乌尔都语 | 231 |
| 11 | indonesian | id | 印尼语 | 199 |
| 12 | german | de | 德语 | 134 |
| 13 | japanese | ja | 日语 | 125 |
| 14 | swahili | sw | 斯瓦希里语 | 98 |
| 15 | marathi | mr | 马拉地语 | 95 |
| 16 | telugu | te | 泰卢固语 | 95 |
| 17 | turkish | tr | 土耳其语 | 88 |
| 18 | tamil | ta | 泰米尔语 | 86 |
| 19 | vietnamese | vi | 越南语 | 85 |
| 20 | korean | ko | 韩语 | 82 |
| 21 | italian | it | 意大利语 | 68 |
| 22 | polish | pl | 波兰语 | 40 |
| 23 | ukrainian | uk | 乌克兰语 | 40 |
| 24 | malay | ms | 马来语 | 77 |
| 25 | thai | th | 泰语 | 61 |
| 26 | dutch | nl | 荷兰语 | 25 |
| 27 | greek | el | 希腊语 | 13 |
| 28 | czech | cs | 捷克语 | 10 |
| 29 | swedish | sv | 瑞典语 | 13 |
| 30 | romanian | ro | 罗马尼亚语 | 24 |
| 31 | hungarian | hu | 匈牙利语 | 13 |
| 32 | hebrew | he | 希伯来语 | 9 |
| 33 | danish | da | 丹麦语 | 6 |
| 34 | finnish | fi | 芬兰语 | 5 |
| 35 | norwegian | no | 挪威语 | 5 |
| 36 | slovak | sk | 斯洛伐克语 | 5 |
| 37 | bulgarian | bg | 保加利亚语 | 8 |
| 38 | croatian | hr | 克罗地亚语 | 5 |
| 39 | slovenian | sl | 斯洛文尼亚语 | 2 |
| 40 | lithuanian | lt | 立陶宛语 | 3 |
| 41 | latvian | lv | 拉脱维亚语 | 2 |
| 42 | estonian | et | 爱沙尼亚语 | 1 |
| 43 | persian | fa | 波斯语 | 77 |
| 44 | filipino | fil | 菲律宾语 | 45 |
| 45 | gujarati | gu | 古吉拉特语 | 60 |
| 46 | kannada | kn | 卡纳达语 | 44 |
| 47 | burmese | my | 缅甸语 | 33 |
| 48 | nepali | ne | 尼泊尔语 | 16 |
| 49 | sinhala | si | 僧伽罗语 | 17 |
| 50 | kazakh | kk | 哈萨克语 | 13 |

### 翻译语言配置文件

位置：`config/languages.ts`

```typescript
export const TRANSLATION_LANGUAGES = [
  'english', 'chinese', 'hindi', 'spanish', 'french', 'arabic',
  'bengali', 'portuguese', 'russian', 'urdu', 'indonesian', 'german',
  'japanese', 'swahili', 'marathi', 'telugu', 'turkish', 'tamil',
  'vietnamese', 'korean', 'italian', 'polish', 'ukrainian', 'malay',
  'thai', 'dutch', 'greek', 'czech', 'swedish', 'romanian',
  'hungarian', 'hebrew', 'danish', 'finnish', 'norwegian', 'slovak',
  'bulgarian', 'croatian', 'slovenian', 'lithuanian', 'latvian',
  'estonian', 'persian', 'filipino', 'gujarati', 'kannada',
  'burmese', 'nepali', 'sinhala', 'kazakh'
] as const;

export type TranslationLanguage = typeof TRANSLATION_LANGUAGES[number];

export const LANGUAGE_DISPLAY_NAMES: Record<TranslationLanguage, {
  english: string;
  native: string;
  code: string; // ISO 639-1 代码，用于调用 OpenAI API
}> = {
  english: { english: 'English', native: 'English', code: 'en' },
  chinese: { english: 'Chinese (Simplified)', native: '简体中文', code: 'zh' },
  french: { english: 'French', native: 'Français', code: 'fr' },
  german: { english: 'German', native: 'Deutsch', code: 'de' },
  // ... 其余46种语言
};
```

### 语言对页面生成

位置：`config/language-pairs.ts`

```typescript
import { TRANSLATION_LANGUAGES } from './languages';

// 生成所有可能的语言对（50 × 49 = 2,450 个）
// 注意：不包括相同语言的翻译（如 english-to-english）
export function generateLanguagePairs() {
  const pairs: string[] = [];

  for (const source of TRANSLATION_LANGUAGES) {
    for (const target of TRANSLATION_LANGUAGES) {
      if (source !== target) {
        pairs.push(`${source}-to-${target}`);
      }
    }
  }

  return pairs; // 返回 2,450 个语言对
}

// 解析语言对 URL
export function parseLanguagePair(pair: string): {
  source: TranslationLanguage;
  target: TranslationLanguage;
} | null {
  const match = pair.match(/^(\w+)-to-(\w+)$/);
  if (!match) return null;

  const [, source, target] = match;

  if (
    TRANSLATION_LANGUAGES.includes(source as TranslationLanguage) &&
    TRANSLATION_LANGUAGES.includes(target as TranslationLanguage)
  ) {
    return {
      source: source as TranslationLanguage,
      target: target as TranslationLanguage
    };
  }

  return null;
}
```

### URL 路由示例

```
/en/french-to-chinese       → 英语界面，法语翻译成中文
/zh/german-to-korean        → 中文界面，德语翻译成韩语
/fr/english-to-spanish      → 法语界面，英语翻译成西班牙语
/ja/chinese-to-japanese     → 日语界面，中文翻译成日语
```

---

## 🔀 两种语言系统的映射关系

### 重叠的语言

有些语言既是 UI 语言，也是翻译语言。注意它们的格式不同：

| 语言 | UI 代码 | 翻译全称 | 示例 URL |
|-----|---------|---------|---------|
| 英语 | `en` | `english` | `/en/french-to-english` |
| 中文 | `zh` | `chinese` | `/zh/english-to-chinese` |
| 法语 | `fr` | `french` | `/fr/german-to-french` |
| 德语 | `de` | `german` | `/de/french-to-german` |
| 日语 | `ja` | `japanese` | `/ja/english-to-japanese` |
| 韩语 | `ko` | `korean` | `/ko/chinese-to-korean` |

### 转换函数

位置：`lib/language-utils.ts`

```typescript
import { UILocale } from '@/config/ui-locales';
import { TranslationLanguage, LANGUAGE_DISPLAY_NAMES } from '@/config/languages';

// UI 语言代码 → 翻译语言全称
export function uiLocaleToTranslationLanguage(locale: UILocale): TranslationLanguage | null {
  const mapping: Partial<Record<UILocale, TranslationLanguage>> = {
    en: 'english',
    zh: 'chinese',
    es: 'spanish',
    fr: 'french',
    de: 'german',
    ja: 'japanese',
    ko: 'korean',
    pt: 'portuguese',
    ru: 'russian',
    ar: 'arabic',
    hi: 'hindi',
    it: 'italian',
    tr: 'turkish',
    vi: 'vietnamese',
    th: 'thai',
    pl: 'polish',
    nl: 'dutch',
    id: 'indonesian',
    uk: 'ukrainian',
    sv: 'swedish'
  };

  return mapping[locale] || null;
}

// 翻译语言全称 → UI 语言代码
export function translationLanguageToUILocale(language: TranslationLanguage): UILocale | null {
  const code = LANGUAGE_DISPLAY_NAMES[language].code;
  return code as UILocale; // 注意：不是所有翻译语言都有对应的 UI 语言
}

// 翻译语言全称 → ISO 639-1 代码（用于 OpenAI API）
export function translationLanguageToCode(language: TranslationLanguage): string {
  return LANGUAGE_DISPLAY_NAMES[language].code;
}
```

---

## 📝 代码使用示例

### 在组件中使用 UI 语言

```typescript
'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { UILocale } from '@/config/ui-locales';

export default function UploadButton() {
  const t = useTranslations('common');
  const params = useParams();
  const locale = params.locale as UILocale; // 'en', 'zh', 'fr' 等

  return (
    <button>
      {t('upload')} {/* 根据当前 UI 语言显示 "Upload" 或 "上传" */}
    </button>
  );
}
```

### 在页面中处理翻译语言

```typescript
// app/[locale]/[language-pair]/page.tsx

import { parseLanguagePair } from '@/config/language-pairs';
import { LANGUAGE_DISPLAY_NAMES } from '@/config/languages';

export default function LanguagePairPage({
  params
}: {
  params: { locale: string; 'language-pair': string }
}) {
  const pair = parseLanguagePair(params['language-pair']);

  if (!pair) {
    return <div>Invalid language pair</div>;
  }

  const { source, target } = pair;

  // 获取语言的显示名称
  const sourceName = LANGUAGE_DISPLAY_NAMES[source].english; // "French"
  const targetName = LANGUAGE_DISPLAY_NAMES[target].english; // "Chinese"

  return (
    <div>
      <h1>Translate from {sourceName} to {targetName}</h1>
      {/* 翻译界面组件 */}
    </div>
  );
}
```

### 调用 OpenAI API 时使用语言代码

```typescript
import { translationLanguageToCode } from '@/lib/language-utils';
import { TranslationLanguage } from '@/config/languages';

async function translateSubtitle(
  text: string,
  sourceLang: TranslationLanguage,
  targetLang: TranslationLanguage
) {
  const sourceCode = translationLanguageToCode(sourceLang); // 'fr'
  const targetCode = translationLanguageToCode(targetLang); // 'zh'

  const response = await fetch('/api/translate', {
    method: 'POST',
    body: JSON.stringify({
      text,
      sourceLanguage: sourceCode, // 发送给 OpenAI 的是 'fr'，不是 'french'
      targetLanguage: targetCode  // 发送 'zh'，不是 'chinese'
    })
  });

  return response.json();
}
```

---

## ⚠️ 常见错误及避免方法

### ❌ 错误 1：混淆 UI 语言和翻译语言

```typescript
// 错误示例
const url = `/${locale}/fr-to-zh`; // 错误！应该用全称
```

```typescript
// 正确示例
const url = `/${locale}/french-to-chinese`; // 正确！
```

### ❌ 错误 2：在 API 调用中使用全称

```typescript
// 错误示例
await openai.translate({
  text: "Hello",
  from: "french",  // 错误！OpenAI API 不认识全称
  to: "chinese"
});
```

```typescript
// 正确示例
await openai.translate({
  text: "Hello",
  from: "fr",  // 正确！使用 ISO 639-1 代码
  to: "zh"
});
```

### ❌ 错误 3：在文件路径中使用全称

```typescript
// 错误示例
import messages from '@/locales/english.json'; // 错误！
```

```typescript
// 正确示例
import messages from '@/locales/en.json'; // 正确！
```

---

## 📊 语言系统对照表

| 使用场景 | 格式 | 示例 | 配置文件 |
|---------|------|------|---------|
| URL 路由（UI 语言）| 简写 | `/en`, `/zh` | `config/ui-locales.ts` |
| URL 路由（语言对）| 全称 | `/french-to-chinese` | `config/languages.ts` |
| 翻译文件路径 | 简写 | `locales/en.json` | `locales/` |
| OpenAI API 调用 | 简写 | `{ from: 'fr', to: 'zh' }` | - |
| 数据库存储（如有）| 简写 | `source_lang: 'fr'` | - |
| 用户界面显示 | 母语名称 | "Français", "中文" | `LANGUAGE_DISPLAY_NAMES` |

---

## 🔧 维护指南

### 添加新的 UI 语言

1. 在 `config/ui-locales.ts` 中添加语言代码
2. 创建 `locales/{code}.json` 文件
3. 运行翻译工具：`npm run translate:locale -- {code}`
4. 测试路由：`/{code}`

### 添加新的翻译语言

1. 在 `config/languages.ts` 中添加语言全称
2. 在 `LANGUAGE_DISPLAY_NAMES` 中添加元数据
3. 重新生成语言对：`npm run generate:pairs`
4. 测试语言对页面：`/en/{language}-to-{other}`

---

**最后更新：** 2025-01-19
**文档版本：** 1.0.0
