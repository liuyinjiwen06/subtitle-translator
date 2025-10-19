# 页面扩展指南

本项目设计了一个可扩展的架构，支持快速创建针对不同目标语言的字幕翻译页面。目前已实现2个示例页面，架构支持扩展至100+页面。

## 🏗️ 架构概览

### 核心组件
- `PageConfig` - 页面配置系统
- `PageTemplate` - 通用页面模板
- `SubtitleTranslator` - 可复用翻译器组件
- `pageGenerator` - 页面生成器工具

### 已实现页面
1. `/english-subtitle` - 翻译字幕为英文
2. `/chinese-subtitle` - 翻译字幕为中文

## 📁 文件结构

```
src/
├── app/
│   ├── english-subtitle/
│   │   └── page.tsx              # 英文字幕页面
│   ├── chinese-subtitle/
│   │   └── page.tsx              # 中文字幕页面
│   └── [future-language]/         # 未来语言页面
├── components/
│   ├── PageTemplate.tsx          # 通用页面模板
│   └── SubtitleTranslator.tsx     # 翻译器组件
├── lib/
│   ├── pageConfig.ts             # 页面配置系统
│   ├── pageGenerator.ts          # 页面生成器
│   ├── locales/                  # 多语言翻译文件
│   │   ├── zh.json              # 中文翻译
│   │   ├── en.json              # 英文翻译
│   │   └── ja.json              # 日文翻译
│   └── i18n.ts                  # 国际化配置
```

## 🚀 快速添加新页面

### 1. 更新页面配置

在 `src/lib/pageConfig.ts` 中添加新的页面配置：

```typescript
export const PAGE_CONFIGS: Record<string, PageConfig> = {
  // 现有配置...
  japaneseSubtitle: {
    pageKey: 'japaneseSubtitle',
    targetLanguage: 'ja',
    targetLanguageKey: 'languages.ja',
    path: '/japanese-subtitle',
    showInNav: true,
    priority: 3,
    special: {
      presetTarget: true,
      preferredService: 'google'
    }
  }
};
```

### 2. 创建页面文件

创建 `src/app/japanese-subtitle/page.tsx`：

```typescript
"use client";

import { useEffect } from 'react';
import { getPageConfig, generatePageMetadata } from '@/lib/pageConfig';
import PageTemplate from '@/components/PageTemplate';
import { useTranslation } from 'react-i18next';
import '../../lib/i18n';

export default function JapaneseSubtitlePage() {
  const { t } = useTranslation();
  const pageConfig = getPageConfig('japaneseSubtitle');

  // SEO元数据设置...
  
  return <PageTemplate pageConfig={pageConfig} />;
}
```

### 3. 添加翻译内容

在多语言文件中添加对应的翻译内容：

```json
// src/lib/locales/zh.json
{
  "pages": {
    "japaneseSubtitle": {
      "title": "字幕翻译成日语 - 在线日语字幕翻译工具",
      "heroTitle": "字幕翻译成日语",
      "heroSubtitle": "将您的字幕快速、准确地翻译成日语，让内容触达日语观众"
    }
  }
}
```

## 🛠️ 使用页面生成器

项目提供了页面生成器工具，可以批量创建页面：

```typescript
import { 
  generatePageConfig, 
  generatePageFileContent,
  generateTranslationTemplate 
} from '@/lib/pageGenerator';

// 生成日语页面配置
const japaneseConfig = generatePageConfig('ja', 3);

// 生成页面文件内容
const pageContent = generatePageFileContent(japaneseConfig);

// 生成翻译模板
const translationTemplate = generateTranslationTemplate('ja', 'zh');
```

## 🎯 页面特色功能

### 1. 预设目标语言
每个页面可以预设特定的目标语言，用户界面会显示固定的目标语言选择器。

### 2. 个性化文案
每个页面都有专门的：
- 页面标题和描述
- Hero区域文案
- 特定优势说明
- 应用场景介绍

### 3. SEO优化
- 动态meta标签
- 结构化数据
- Open Graph标签
- 多语言sitemap支持

### 4. 智能翻译服务选择
根据目标语言自动选择最适合的翻译服务：
- 欧洲语言：偏好OpenAI
- 亚洲语言：偏好Google Cloud

## 📊 支持的语言

目前支持20种语言的页面生成：

| 语言 | 代码 | 示例路径 |
|------|------|----------|
| 英语 | en | `/english-subtitle` |
| 中文 | zh | `/chinese-subtitle` |
| 日语 | ja | `/japanese-subtitle` |
| 法语 | fr | `/french-subtitle` |
| 德语 | de | `/german-subtitle` |
| ... | ... | ... |

## 🔧 扩展到100页的步骤

### 1. 批量生成配置
```typescript
import { generateAllPageConfigs } from '@/lib/pageGenerator';

const allConfigs = generateAllPageConfigs();
// 更新 pageConfig.ts 中的 PAGE_CONFIGS
```

### 2. 批量创建页面文件
使用脚本或手工创建各语言的页面目录和文件。

### 3. 批量生成翻译内容
为每种界面语言生成对应的翻译模板。

### 4. 更新路由和导航
根据需要更新导航菜单和sitemap。

## 💡 最佳实践

### 1. 命名约定
- 页面key：`{languageCode}Subtitle`
- 路径：`/{languageCode}-subtitle`
- 组件名：`{LanguageName}SubtitlePage`

### 2. 性能优化
- 使用动态导入减少初始包大小
- 缓存翻译内容
- 优化图片和静态资源

### 3. SEO优化
- 每个页面独特的title和description
- 相关的关键词设置
- 规范化URL结构

### 4. 用户体验
- 响应式设计适配移动端
- 语言切换流畅体验
- 清晰的页面导航

## 🚧 未来扩展

1. **自动化工具**：开发CLI工具自动生成页面
2. **A/B测试**：不同页面布局的效果测试
3. **分析集成**：页面访问和转化数据分析
4. **CDN优化**：多地区部署优化访问速度

这个架构为项目的快速扩展奠定了坚实基础，支持从2页扩展到100+页面，同时保持代码的可维护性和用户体验的一致性。 