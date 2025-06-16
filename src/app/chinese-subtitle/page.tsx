import { Metadata } from 'next';
import ServerPageTemplate from '@/components/ServerPageTemplate';
import { getPageConfig } from '@/lib/pageConfig';

export const metadata: Metadata = {
  title: '中文字幕翻译工具 - 免费在线字幕翻译 | Chinese Subtitle Translator',
  description: '专业中文字幕翻译服务，AI智能翻译字幕至中文。支持SRT格式，免费、快速、准确的字幕翻译工具。',
  keywords: '中文字幕翻译, srt翻译中文, 字幕转换器, AI翻译, 免费字幕翻译器',
  alternates: {
    canonical: 'https://subtitletranslator.cc/chinese-subtitle',
    languages: {
      'zh-CN': 'https://subtitletranslator.cc/chinese-subtitle',
      'en-US': 'https://subtitletranslator.cc/english-subtitle',
    },
  },
  openGraph: {
    title: '中文字幕翻译工具 - 免费在线字幕翻译',
    description: '专业中文字幕翻译服务，AI智能翻译字幕至中文。',
    url: 'https://subtitletranslator.cc/chinese-subtitle',
    type: 'website',
    locale: 'zh_CN',
  },
};

export default function ChineseSubtitlePage() {
  const pageConfig = getPageConfig('chineseSubtitle');

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
            "name": "中文字幕翻译工具",
            "description": "专业中文字幕翻译服务，AI智能翻译字幕至中文。",
            "url": "https://subtitletranslator.cc/chinese-subtitle",
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
          })
        }}
      />
      <ServerPageTemplate pageConfig={pageConfig} />
    </>
  );
} 