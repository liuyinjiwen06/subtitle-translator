import { Metadata } from 'next';
import ServerPageTemplate from '@/components/ServerPageTemplate';
import { getPageConfig } from '@/lib/pageConfig';

export const metadata: Metadata = {
  title: 'English Subtitle Translator - Free Online Translation Tool | 字幕翻译工具',
  description: 'Professional English subtitle translation service. Convert subtitles to English with AI-powered translation. Free, fast, and accurate SRT file translation.',
  keywords: 'english subtitle translation, srt to english, subtitle converter, ai translation, free subtitle translator',
  alternates: {
    canonical: 'https://www.subtitleconverter.cc/english-subtitle',
    languages: {
      'en-US': 'https://www.subtitleconverter.cc/english-subtitle',
      'zh-CN': 'https://www.subtitleconverter.cc/chinese-subtitle',
    },
  },
  openGraph: {
    title: 'English Subtitle Translator - Free Online Translation Tool',
    description: 'Professional English subtitle translation service. Convert subtitles to English with AI-powered translation.',
    url: 'https://www.subtitleconverter.cc/english-subtitle',
    type: 'website',
    locale: 'en_US',
  },
};

export default function EnglishSubtitlePage() {
  const pageConfig = getPageConfig('englishSubtitle');

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
          })
        }}
      />
      <ServerPageTemplate pageConfig={pageConfig} />
    </>
  );
} 