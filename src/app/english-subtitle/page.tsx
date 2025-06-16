"use client";

import { useEffect } from 'react';
import { getPageConfig, generatePageMetadata } from '@/lib/pageConfig';
import PageTemplate from '@/components/PageTemplate';
import { useTranslation } from 'react-i18next';
import '../../lib/i18n';

export default function EnglishSubtitlePage() {
  const { t } = useTranslation();
  const pageConfig = getPageConfig('englishSubtitle');

  // 设置页面元数据
  useEffect(() => {
    // 设置专用的页面标题和描述
    document.title = 'English Subtitle Translator - Free Online Translation Tool | 字幕翻译工具';
    
    // 更新meta描述
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Professional English subtitle translation service. Convert subtitles to English with AI-powered translation. Free, fast, and accurate SRT file translation.');
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = 'Professional English subtitle translation service. Convert subtitles to English with AI-powered translation. Free, fast, and accurate SRT file translation.';
      document.head.appendChild(newMetaDescription);
    }

    // 更新关键词
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'english subtitle translation, srt to english, subtitle converter, ai translation, free subtitle translator');
    } else {
      const newMetaKeywords = document.createElement('meta');
      newMetaKeywords.name = 'keywords';
      newMetaKeywords.content = 'english subtitle translation, srt to english, subtitle converter, ai translation, free subtitle translator';
      document.head.appendChild(newMetaKeywords);
    }

    // 添加canonical链接
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', 'https://www.subtitleconverter.cc/english-subtitle');
    } else {
      const newCanonicalLink = document.createElement('link');
      newCanonicalLink.rel = 'canonical';
              newCanonicalLink.href = 'https://www.subtitleconverter.cc/english-subtitle';
      document.head.appendChild(newCanonicalLink);
    }

    // 添加hreflang标签
          const hreflangLinks = [
        { hreflang: 'en-US', href: 'https://www.subtitleconverter.cc/english-subtitle' },
        { hreflang: 'zh-CN', href: 'https://www.subtitleconverter.cc/chinese-subtitle' },
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
      { property: 'og:title', content: 'English Subtitle Translator - Free Online Translation Tool' },
      { property: 'og:description', content: 'Professional English subtitle translation service. Convert subtitles to English with AI-powered translation.' },
              { property: 'og:url', content: 'https://www.subtitleconverter.cc/english-subtitle' },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'en_US' },
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
      "name": "English Subtitle Translator",
      "description": "Professional English subtitle translation service. Convert subtitles to English with AI-powered translation.",
              "url": "https://www.subtitleconverter.cc/english-subtitle",
      "applicationCategory": "Utility",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "Subtitle translation to English",
        "SRT file support",
        "AI-powered translation",
        "Free online tool"
      ],
      "inLanguage": "en-US"
    };

    const structuredDataScript = document.querySelector('#structured-data-english');
    if (structuredDataScript) {
      structuredDataScript.textContent = JSON.stringify(structuredData);
    } else {
      const newStructuredDataScript = document.createElement('script');
      newStructuredDataScript.id = 'structured-data-english';
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