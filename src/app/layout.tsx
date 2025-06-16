import { Metadata } from 'next';
import '../lib/i18n';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.subtitleconverter.cc'),
  title: {
    default: '字幕翻译工具 - 免费在线SRT字幕翻译',
    template: '%s | 字幕翻译工具'
  },
  description: '免费在线字幕翻译工具，支持SRT格式，AI智能翻译，支持多种语言互译。专业的字幕翻译服务，简单易用。',
  keywords: '字幕翻译,SRT翻译,在线翻译,字幕转换,AI翻译,免费翻译,subtitle translation',
  authors: [{ name: '字幕翻译工具' }],
  creator: '字幕翻译工具',
  publisher: '字幕翻译工具',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    alternateLocale: ['en_US', 'ja_JP'],
    url: 'https://www.subtitleconverter.cc',
    siteName: '字幕翻译工具',
    title: '字幕翻译工具 - 免费在线SRT字幕翻译',
    description: '免费在线字幕翻译工具，支持SRT格式，AI智能翻译，支持多种语言互译。',
    images: [
      {
        url: '/icon.png',
        width: 800,
        height: 600,
        alt: '字幕翻译工具',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '字幕翻译工具 - 免费在线SRT字幕翻译',
    description: '免费在线字幕翻译工具，支持SRT格式，AI智能翻译，支持多种语言互译。',
    images: ['/icon.png'],
  },
  alternates: {
    canonical: 'https://www.subtitleconverter.cc',
    languages: {
      'zh-CN': 'https://www.subtitleconverter.cc',
      'en-US': 'https://www.subtitleconverter.cc/english-subtitle',
      'ja-JP': 'https://www.subtitleconverter.cc',
    },
  },
  verification: {
    google: 'your-google-verification-code', // 需要替换为实际的验证码
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        {/* Canonical URL */}
        <link rel="canonical" href="https://www.subtitleconverter.cc" />
        
        {/* Hreflang标签 - 多语言SEO */}
        <link rel="alternate" hrefLang="zh-CN" href="https://www.subtitleconverter.cc" />
        <link rel="alternate" hrefLang="en-US" href="https://www.subtitleconverter.cc/english-subtitle" />
        <link rel="alternate" hrefLang="ja-JP" href="https://www.subtitleconverter.cc" />
        <link rel="alternate" hrefLang="x-default" href="https://www.subtitleconverter.cc" />
        
        {/* 额外的SEO元标签 */}
        <meta name="theme-color" content="#3b82f6" />
        <meta name="color-scheme" content="light" />
        <meta httpEquiv="Content-Language" content="zh-CN" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* 结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "字幕翻译工具",
              "alternateName": "Subtitle Translator",
              "url": "https://www.subtitleconverter.cc",
              "description": "免费在线字幕翻译工具，支持SRT格式，AI智能翻译，支持多种语言互译。",
              "applicationCategory": "UtilityApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "SRT字幕文件翻译",
                "多语言支持",
                "AI智能翻译",
                "免费在线使用",
                "实时翻译进度"
              ],
              "inLanguage": ["zh-CN", "en-US", "ja-JP"],
              "availableLanguage": ["Chinese", "English", "Japanese", "French", "German", "Spanish", "Russian", "Italian"]
            })
          }}
        />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {children}
      </body>
    </html>
  );
}
