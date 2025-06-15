// 页面生成器 - 用于扩展多页面
import { PageConfig } from './pageConfig';

// 支持的语言列表（用于生成页面）
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: '英语', flag: '🇺🇸' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日语', flag: '🇯🇵' },
  { code: 'fr', name: 'French', nativeName: '法语', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: '德语', flag: '🇩🇪' },
  { code: 'es', name: 'Spanish', nativeName: '西班牙语', flag: '🇪🇸' },
  { code: 'ru', name: 'Russian', nativeName: '俄语', flag: '🇷🇺' },
  { code: 'it', name: 'Italian', nativeName: '意大利语', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: '葡萄牙语', flag: '🇵🇹' },
  { code: 'ar', name: 'Arabic', nativeName: '阿拉伯语', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: '印地语', flag: '🇮🇳' },
  { code: 'ko', name: 'Korean', nativeName: '韩语', flag: '🇰🇷' },
  { code: 'th', name: 'Thai', nativeName: '泰语', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamese', nativeName: '越南语', flag: '🇻🇳' },
  { code: 'tr', name: 'Turkish', nativeName: '土耳其语', flag: '🇹🇷' },
  { code: 'pl', name: 'Polish', nativeName: '波兰语', flag: '🇵🇱' },
  { code: 'nl', name: 'Dutch', nativeName: '荷兰语', flag: '🇳🇱' },
  { code: 'sv', name: 'Swedish', nativeName: '瑞典语', flag: '🇸🇪' },
  { code: 'da', name: 'Danish', nativeName: '丹麦语', flag: '🇩🇰' },
  { code: 'no', name: 'Norwegian', nativeName: '挪威语', flag: '🇳🇴' },
];

// 页面类型定义
export interface PageGeneratorConfig {
  targetLanguage: string;
  pageKey: string;
  urlPath: string;
  priority: number;
  preferredService?: 'google' | 'openai';
  presetTarget?: boolean;
}

// 生成页面配置
export function generatePageConfig(targetLang: string, priority: number = 50): PageGeneratorConfig {
  const language = SUPPORTED_LANGUAGES.find(lang => lang.code === targetLang);
  if (!language) {
    throw new Error(`Unsupported language: ${targetLang}`);
  }

  return {
    targetLanguage: targetLang,
    pageKey: `${targetLang}Subtitle`,
    urlPath: `/${targetLang}-subtitle`,
    priority,
    preferredService: ['en', 'fr', 'de', 'es'].includes(targetLang) ? 'openai' : 'google',
    presetTarget: true
  };
}

// 生成页面文件内容
export function generatePageFileContent(config: PageGeneratorConfig): string {
  const language = SUPPORTED_LANGUAGES.find(lang => lang.code === config.targetLanguage);
  const capitalizedLang = language?.name || config.targetLanguage;
  const componentName = `${capitalizedLang}SubtitlePage`;

  return `"use client";

import { useEffect } from 'react';
import { getPageConfig, generatePageMetadata } from '@/lib/pageConfig';
import PageTemplate from '@/components/PageTemplate';
import { useTranslation } from 'react-i18next';
import '../../lib/i18n';

export default function ${componentName}() {
  const { t } = useTranslation();
  const pageConfig = getPageConfig('${config.pageKey}');

  // 设置页面元数据
  useEffect(() => {
    if (pageConfig) {
      const metadata = generatePageMetadata('${config.pageKey}', t);
      if (metadata) {
        // 更新页面标题
        document.title = metadata.title || '';
        
        // 更新meta描述
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', metadata.description || '');
        } else {
          const newMetaDescription = document.createElement('meta');
          newMetaDescription.name = 'description';
          newMetaDescription.content = metadata.description || '';
          document.head.appendChild(newMetaDescription);
        }

        // 更新关键词
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
          metaKeywords.setAttribute('content', metadata.keywords || '');
        } else if (metadata.keywords) {
          const newMetaKeywords = document.createElement('meta');
          newMetaKeywords.name = 'keywords';
          newMetaKeywords.content = metadata.keywords;
          document.head.appendChild(newMetaKeywords);
        }

        // 添加结构化数据
        const structuredData = {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": metadata.title,
          "description": metadata.description,
          "applicationCategory": "Utility",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "featureList": [
            "Subtitle translation to ${language?.name}",
            "SRT file support",
            "AI-powered translation",
            "Free online tool"
          ]
        };

        const structuredDataScript = document.querySelector('#structured-data');
        if (structuredDataScript) {
          structuredDataScript.textContent = JSON.stringify(structuredData);
        } else {
          const newStructuredDataScript = document.createElement('script');
          newStructuredDataScript.id = 'structured-data';
          newStructuredDataScript.type = 'application/ld+json';
          newStructuredDataScript.textContent = JSON.stringify(structuredData);
          document.head.appendChild(newStructuredDataScript);
        }
      }
    }
  }, [pageConfig, t]);

  if (!pageConfig) {
    return <div>页面配置未找到</div>;
  }

  return <PageTemplate pageConfig={pageConfig} />;
}`;
}

// 生成翻译文件内容模板
export function generateTranslationTemplate(targetLang: string, forLocale: string = 'zh'): Record<string, unknown> {
  const language = SUPPORTED_LANGUAGES.find(lang => lang.code === targetLang);
  if (!language) return {};

  const pageKey = `${targetLang}Subtitle`;
  
  // 根据不同语言环境生成不同的翻译内容
  const templates = {
    zh: {
      title: `字幕翻译成${language.nativeName} - 在线${language.nativeName}字幕翻译工具`,
      description: `专业的字幕翻译成${language.nativeName}工具，支持SRT文件上传，AI智能翻译，高质量${language.nativeName}字幕输出。`,
      seo: {
        title: `字幕翻译成${language.nativeName} - 免费在线${language.nativeName}字幕翻译器 | 高质量SRT${language.nativeName}翻译`,
        description: `专业的字幕翻译成${language.nativeName}工具，支持中文、英文、日文等多种语言翻译成${language.nativeName}字幕。AI智能翻译，准确流畅，完全免费。立即上传SRT文件开始翻译！`,
        keywords: `字幕翻译成${language.nativeName},${language.nativeName}字幕翻译,SRT${language.nativeName}翻译,在线${language.nativeName}字幕工具,免费${language.nativeName}翻译`
      },
      heroTitle: `字幕翻译成${language.nativeName}`,
      heroSubtitle: `将您的字幕快速、准确地翻译成${language.nativeName}，让内容触达${language.nativeName}观众`
    },
    en: {
      title: `Translate Subtitles to ${language.name} - Online ${language.name} Subtitle Translator`,
      description: `Professional subtitle to ${language.name} translation tool. Upload SRT files, AI-powered translation, high-quality ${language.name} subtitle output.`,
      seo: {
        title: `Translate Subtitles to ${language.name} - Free Online ${language.name} Subtitle Translator | High-Quality SRT ${language.name} Translation`,
        description: `Professional subtitle to ${language.name} translation tool supporting multiple languages to ${language.name} subtitles. AI-powered translation, accurate and fluent, completely free. Upload SRT files and start translating now!`,
        keywords: `translate subtitles to ${language.name.toLowerCase()},${language.name.toLowerCase()} subtitle translation,SRT ${language.name.toLowerCase()} translation,online ${language.name.toLowerCase()} subtitle tool,free ${language.name.toLowerCase()} translation`
      },
      heroTitle: `Translate Subtitles to ${language.name}`,
      heroSubtitle: `Quickly and accurately translate your subtitles to ${language.name}, making your content accessible to ${language.name} audiences`
    }
  };

  const template = templates[forLocale as keyof typeof templates] || templates.zh;
  
  return {
    [pageKey]: {
      ...template,
      targetLanguage: language.nativeName,
      // 可以添加更多特定于语言的内容
    }
  };
}

// 批量生成页面配置
export function generateAllPageConfigs(): Record<string, PageConfig> {
  const configs: Record<string, PageConfig> = {};
  
  SUPPORTED_LANGUAGES.forEach((lang, index) => {
    const pageConfig = generatePageConfig(lang.code, index + 1);
    configs[pageConfig.pageKey] = {
      pageKey: pageConfig.pageKey,
      targetLanguage: lang.code,
      targetLanguageKey: `languages.${lang.code}`,
      path: pageConfig.urlPath,
      showInNav: true,
      priority: pageConfig.priority,
      special: {
        presetTarget: pageConfig.presetTarget,
        preferredService: pageConfig.preferredService
      }
    };
  });

  return configs;
}

// 生成sitemap条目
export function generateSitemapEntries(baseUrl: string = 'https://yourdomain.com'): string[] {
  return SUPPORTED_LANGUAGES.map(lang => {
    const config = generatePageConfig(lang.code);
    return `${baseUrl}${config.urlPath}`;
  });
}

// 导出工具函数
export {
  SUPPORTED_LANGUAGES as languages,
  generatePageConfig as createPageConfig,
  generatePageFileContent as createPageFile,
  generateTranslationTemplate as createTranslationTemplate
}; 