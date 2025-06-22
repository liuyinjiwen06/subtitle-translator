import { Locale, i18nConfig } from '../../../../i18nConfig';
import { getServerTranslations, getPageConfig } from '../../../lib/server-i18n';
import UniversalLanguagePage from '../../../components/UniversalLanguagePage';

export async function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  
  // 尝试从生成的内容获取SEO信息
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/generated-content/chinese-subtitle-page.json`);
    if (response.ok) {
      const content = await response.json();
      return {
        title: content.seo.title,
        description: content.seo.description,
        keywords: content.seo.keywords,
        alternates: {
          canonical: `https://subtitletranslator.cc/${locale === 'en' ? '' : locale}/chinese-subtitle`,
          languages: Object.fromEntries(
            i18nConfig.locales.map(loc => [
              loc,
              `https://subtitletranslator.cc/${loc === 'en' ? '' : loc}/chinese-subtitle`
            ])
          )
        },
      };
    }
  } catch (error) {
    console.log('Failed to load generated content for metadata, using fallback');
  }

  // 回退到原有逻辑
  const pageConfig = await getPageConfig(locale, 'chineseSubtitle');
  
  return {
    title: pageConfig.seo?.title || 'Chinese Subtitle Translator',
    description: pageConfig.seo?.description || 'Professional Chinese subtitle translation service',
    keywords: pageConfig.seo?.keywords || ['chinese', 'subtitle', 'translation'],
    alternates: {
      canonical: `https://subtitletranslator.cc/${locale === 'en' ? '' : locale}/chinese-subtitle`,
      languages: Object.fromEntries(
        i18nConfig.locales.map(loc => [
          loc,
          `https://subtitletranslator.cc/${loc === 'en' ? '' : loc}/chinese-subtitle`
        ])
      )
    },
  };
}

export default async function ChineseSubtitlePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const translations = await getServerTranslations(locale);

  // 只传递纯数据，避免将函数传递给客户端组件
  const translationData = {
    nav: translations.translations.nav,
    chineseSubtitle: translations.translations.chineseSubtitle,
    layout: translations.translations.layout
  };

  return (
    <UniversalLanguagePage 
      languageCode="chinese"
      locale={locale}
      translations={translationData}
    />
  );
} 