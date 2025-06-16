"use client";

import { useEffect } from 'react';
import { getPageConfig, generatePageMetadata } from '@/lib/pageConfig';
import PageTemplate from '@/components/PageTemplate';
import { useTranslation } from 'react-i18next';
import '../../lib/i18n';

export default function ChineseSubtitlePage() {
  const { t } = useTranslation();
  const pageConfig = getPageConfig('chineseSubtitle');

  // 设置页面元数据
  useEffect(() => {
    // 设置专用的页面标题和描述
    document.title = '中文字幕翻译工具 - 免费在线字幕翻译 | 字幕翻译工具';
    
    // 更新meta描述
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', '专业中文字幕翻译服务，AI智能翻译字幕至中文。免费、快速、准确的SRT字幕文件翻译工具。');
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = '专业中文字幕翻译服务，AI智能翻译字幕至中文。免费、快速、准确的SRT字幕文件翻译工具。';
      document.head.appendChild(newMetaDescription);
    }

    // 更新关键词
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', '中文字幕翻译,字幕翻译中文,SRT翻译,字幕转换,AI翻译,免费字幕翻译');
    } else {
      const newMetaKeywords = document.createElement('meta');
      newMetaKeywords.name = 'keywords';
      newMetaKeywords.content = '中文字幕翻译,字幕翻译中文,SRT翻译,字幕转换,AI翻译,免费字幕翻译';
      document.head.appendChild(newMetaKeywords);
    }

    // 添加canonical链接
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', 'https://www.subtitleconverter.cc/chinese-subtitle');
    } else {
      const newCanonicalLink = document.createElement('link');
      newCanonicalLink.rel = 'canonical';
              newCanonicalLink.href = 'https://www.subtitleconverter.cc/chinese-subtitle';
      document.head.appendChild(newCanonicalLink);
    }

    // 添加hreflang标签
          const hreflangLinks = [
        { hreflang: 'zh-CN', href: 'https://www.subtitleconverter.cc/chinese-subtitle' },
        { hreflang: 'en-US', href: 'https://www.subtitleconverter.cc/english-subtitle' },
        { hreflang: 'x-default', href: 'https://www.subtitleconverter.cc' },
      ];

    hreflangLinks.forEach(({ hreflang, href }) => {
      const existingLink = document.querySelector(`link[hreflang="${hreflang}"]`);
      if (existingLink) {
        existingLink.setAttribute('href', href);
      } else {
        const newHreflangLink = document.createElement('link');
        newHreflangLink.rel = 'alternate';
        newHreflangLink.setAttribute('hreflang', hreflang);
        newHreflangLink.href = href;
        document.head.appendChild(newHreflangLink);
      }
    });

    // 更新Open Graph标签
    const ogData = [
      { property: 'og:title', content: '中文字幕翻译工具 - 免费在线字幕翻译' },
      { property: 'og:description', content: '专业中文字幕翻译服务，AI智能翻译字幕至中文。' },
              { property: 'og:url', content: 'https://www.subtitleconverter.cc/chinese-subtitle' },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'zh_CN' },
    ];

    ogData.forEach(({ property, content }) => {
      const ogElement = document.querySelector(`meta[property="${property}"]`);
      if (ogElement) {
        ogElement.setAttribute('content', content);
      } else {
        const newOgElement = document.createElement('meta');
        newOgElement.setAttribute('property', property);
        newOgElement.content = content;
        document.head.appendChild(newOgElement);
      }
    });

    // 添加结构化数据
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "中文字幕翻译工具",
      "description": "专业中文字幕翻译服务，AI智能翻译字幕至中文。",
              "url": "https://www.subtitleconverter.cc/chinese-subtitle",
      "applicationCategory": "Utility",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "字幕翻译至中文",
        "SRT文件支持",
        "AI智能翻译",
        "免费在线工具"
      ],
      "inLanguage": "zh-CN"
    };

    const structuredDataScript = document.querySelector('#structured-data-chinese');
    if (structuredDataScript) {
      structuredDataScript.textContent = JSON.stringify(structuredData);
    } else {
      const newStructuredDataScript = document.createElement('script');
      newStructuredDataScript.id = 'structured-data-chinese';
      newStructuredDataScript.type = 'application/ld+json';
      newStructuredDataScript.textContent = JSON.stringify(structuredData);
      document.head.appendChild(newStructuredDataScript);
    }
  }, []);

  if (!pageConfig) {
    return <div>{t('pageConfigNotFound', '页面配置未找到')}</div>;
  }

  return <PageTemplate pageConfig={pageConfig} />;
} 