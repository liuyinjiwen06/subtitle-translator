import { Metadata } from 'next';
import { getMessagesForLocale } from '@/lib/get-messages';
import { isValidUILocale, type UILocale } from '@/config/ui-locales';
import { EnglishSubtitlePageClient } from '@/components/EnglishSubtitlePageClient';

// 生成动态 SEO metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  // 验证 locale
  if (!isValidUILocale(locale)) {
    return {
      title: 'English Subtitle Translator - Professional SRT Translation to English',
      description: 'Translate subtitles to English from 50+ languages. Professional English subtitle translation with AI technology.',
    };
  }

  // 获取翻译消息
  const messages = await getMessagesForLocale(locale as UILocale);

  // 优先使用 englishSubtitle.meta，如果不存在则回退到默认值
  const title = messages?.englishSubtitle?.meta?.title || 'English Subtitle Translator - Free AI-Powered English SRT Translation';
  const description = messages?.englishSubtitle?.meta?.description || 'Translate subtitles to English from 50+ languages. Professional English subtitle translation with AI technology. Fast, accurate English SRT translation for videos, movies, and content.';
  const keywords = messages?.englishSubtitle?.meta?.keywords || 'english subtitle, english srt, subtitle to english, translate subtitle english, english subtitle translator, srt to english, english video subtitles';

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: locale,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/${locale}/english-subtitle`,
      languages: {
        'en': '/en/english-subtitle',
        'zh': '/zh/english-subtitle',
        'ja': '/ja/english-subtitle',
        'fr': '/fr/english-subtitle',
        'de': '/de/english-subtitle',
        'es': '/es/english-subtitle',
        'ru': '/ru/english-subtitle',
        'it': '/it/english-subtitle',
        'pt': '/pt/english-subtitle',
        'ar': '/ar/english-subtitle',
        'hi': '/hi/english-subtitle',
        'ko': '/ko/english-subtitle',
        'th': '/th/english-subtitle',
        'vi': '/vi/english-subtitle',
        'tr': '/tr/english-subtitle',
        'pl': '/pl/english-subtitle',
        'nl': '/nl/english-subtitle',
        'sv': '/sv/english-subtitle',
      },
    },
  };
}

export default function EnglishSubtitlePage() {
  return <EnglishSubtitlePageClient />;
}
