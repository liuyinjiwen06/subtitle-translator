import { Locale, i18nConfig } from '../../../../i18nConfig';
import { getServerTranslations } from '../../../lib/server-i18n';
import UniversalLanguagePage from '../../../components/UniversalLanguagePage';

export const runtime = 'edge';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const { t } = await getServerTranslations(locale);
  
  return {
    title: t("pages.chineseSubtitle.seo.title") || "Chinese Subtitle Translator - Free Online Tool",
    description: t("pages.chineseSubtitle.seo.description") || "Professional Chinese subtitle translator",
    keywords: t("pages.chineseSubtitle.seo.keywords") || "chinese subtitle translator,translate subtitles to chinese",
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
  const { t, ...translations } = await getServerTranslations(locale);

  return (
    <UniversalLanguagePage 
      languageCode="chinese"
      locale={locale}
      translations={translations}
    />
  );
} 