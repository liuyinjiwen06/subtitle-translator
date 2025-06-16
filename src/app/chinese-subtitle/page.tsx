import { Metadata } from 'next';
import ServerPageTemplate from '@/components/ServerPageTemplate';
import { getPageConfig } from '@/lib/pageConfig';
import { headers } from 'next/headers';

// 获取用户语言偏好的函数
async function getUserLanguage(): Promise<string> {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || '';
  
  // 检查是否包含中文
  if (acceptLanguage.includes('zh')) {
    return 'zh';
  }
  // 检查是否包含日文
  if (acceptLanguage.includes('ja')) {
    return 'ja';
  }
  // 默认返回英文
  return 'en';
}

// 多语言metadata配置
const metadataConfig = {
  en: {
    title: 'Chinese Subtitle Translator - Free Online Translation Tool',
    description: 'Professional Chinese subtitle translation service. Convert subtitles to Chinese with AI-powered translation. Free, fast, and accurate SRT file translation.',
    keywords: 'chinese subtitle translation, srt to chinese, subtitle converter, ai translation, free subtitle translator',
    ogTitle: 'Chinese Subtitle Translator - Free Online Translation Tool',
    ogDescription: 'Professional Chinese subtitle translation service. Convert subtitles to Chinese with AI-powered translation.',
    structuredDataName: 'Chinese Subtitle Translator',
    structuredDataDescription: 'Professional Chinese subtitle translation service. Convert subtitles to Chinese with AI-powered translation.',
    featureList: [
      "Subtitle translation to Chinese",
      "SRT file support", 
      "AI-powered translation",
      "Free online tool"
    ]
  },
  zh: {
    title: '中文字幕翻译工具 - 免费在线字幕翻译',
    description: '专业中文字幕翻译服务，AI智能翻译字幕至中文。支持SRT格式，免费、快速、准确的字幕翻译工具。',
    keywords: '中文字幕翻译, srt翻译中文, 字幕转换器, AI翻译, 免费字幕翻译器',
    ogTitle: '中文字幕翻译工具 - 免费在线字幕翻译',
    ogDescription: '专业中文字幕翻译服务，AI智能翻译字幕至中文。',
    structuredDataName: '中文字幕翻译工具',
    structuredDataDescription: '专业中文字幕翻译服务，AI智能翻译字幕至中文。',
    featureList: [
      "字幕翻译至中文",
      "SRT文件支持",
      "AI智能翻译",
      "免费在线工具"
    ]
  },
  ja: {
    title: '中国語字幕翻訳ツール - 無料オンライン字幕翻訳',
    description: 'プロフェッショナルな中国語字幕翻訳サービス。AI技術で字幕を中国語に翻訳。SRTファイル対応、無料、高速、正確。',
    keywords: '中国語字幕翻訳,中国語翻訳,SRT中国語翻訳,字幕中国語翻訳,オンライン中国語翻訳,無料中国語字幕',
    ogTitle: '中国語字幕翻訳ツール - 無料オンライン字幕翻訳',
    ogDescription: 'プロフェッショナルな中国語字幕翻訳サービス。AI技術で字幕を中国語に翻訳。',
    structuredDataName: '中国語字幕翻訳ツール',
    structuredDataDescription: 'プロフェッショナルな中国語字幕翻訳サービス。AI技術で字幕を中国語に翻訳。',
    featureList: [
      "中国語字幕翻訳",
      "SRTファイル対応",
      "AI翻訳技術",
      "無料オンラインツール"
    ]
  }
};

export async function generateMetadata(): Promise<Metadata> {
  const userLang = await getUserLanguage();
  const config = metadataConfig[userLang as keyof typeof metadataConfig];

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    alternates: {
      canonical: 'https://subtitletranslator.cc/chinese-subtitle',
      languages: {
        'zh-CN': 'https://subtitletranslator.cc/chinese-subtitle',
        'en-US': 'https://subtitletranslator.cc/english-subtitle',
      },
    },
    openGraph: {
      title: config.ogTitle,
      description: config.ogDescription,
      url: 'https://subtitletranslator.cc/chinese-subtitle',
      type: 'website',
      locale: userLang === 'zh' ? 'zh_CN' : userLang === 'ja' ? 'ja_JP' : 'en_US',
    },
  };
}

export default async function ChineseSubtitlePage() {
  const pageConfig = getPageConfig('chineseSubtitle');
  const userLang = await getUserLanguage();
  const config = metadataConfig[userLang as keyof typeof metadataConfig];

  if (!pageConfig) {
    return <div>页面配置未找到 / Page configuration not found</div>;
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": config.structuredDataName,
            "description": config.structuredDataDescription,
            "url": "https://subtitletranslator.cc/chinese-subtitle",
            "applicationCategory": "Utility",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": config.featureList,
            "inLanguage": userLang === 'zh' ? 'zh-CN' : userLang === 'ja' ? 'ja-JP' : 'en-US'
          })
        }}
      />
      <ServerPageTemplate pageConfig={pageConfig} />
    </>
  );
} 