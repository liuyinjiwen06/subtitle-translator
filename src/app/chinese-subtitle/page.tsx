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
    if (pageConfig) {
      const metadata = generatePageMetadata('chineseSubtitle', t);
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

        // 更新Open Graph标签
        if (metadata.openGraph) {
          // OG Title
          const ogTitle = document.querySelector('meta[property="og:title"]');
          if (ogTitle) {
            ogTitle.setAttribute('content', metadata.openGraph.title || '');
          } else {
            const newOgTitle = document.createElement('meta');
            newOgTitle.setAttribute('property', 'og:title');
            newOgTitle.content = metadata.openGraph.title || '';
            document.head.appendChild(newOgTitle);
          }

          // OG Description
          const ogDescription = document.querySelector('meta[property="og:description"]');
          if (ogDescription) {
            ogDescription.setAttribute('content', metadata.openGraph.description || '');
          } else {
            const newOgDescription = document.createElement('meta');
            newOgDescription.setAttribute('property', 'og:description');
            newOgDescription.content = metadata.openGraph.description || '';
            document.head.appendChild(newOgDescription);
          }

          // OG Type
          const ogType = document.querySelector('meta[property="og:type"]');
          if (ogType) {
            ogType.setAttribute('content', metadata.openGraph.type || 'website');
          } else {
            const newOgType = document.createElement('meta');
            newOgType.setAttribute('property', 'og:type');
            newOgType.content = metadata.openGraph.type || 'website';
            document.head.appendChild(newOgType);
          }
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
            "Subtitle translation to Chinese",
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
    return <div>{t('pageConfigNotFound', '页面配置未找到')}</div>;
  }

  return <PageTemplate pageConfig={pageConfig} />;
} 