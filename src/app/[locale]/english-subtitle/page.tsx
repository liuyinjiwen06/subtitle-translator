import { Locale, i18nConfig } from '../../../../i18nConfig';
import { getServerTranslations, getPageConfig } from '../../../lib/server-i18n';
import UniversalLanguagePage from '../../../components/UniversalLanguagePage';

export async function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const { t } = await getServerTranslations(locale);
  
  return {
    title: t("pages.englishSubtitle.seo.title") || "English Subtitle Translator - Free Online Tool",
    description: t("pages.englishSubtitle.seo.description") || "Professional English subtitle translator supporting 30+ languages",
    keywords: t("pages.englishSubtitle.seo.keywords") || "english subtitle translator,translate subtitles to english",
    alternates: {
      canonical: `https://subtitletranslator.cc/${locale === 'en' ? '' : locale}/english-subtitle`,
      languages: Object.fromEntries(
        i18nConfig.locales.map(loc => [
          loc,
          `https://subtitletranslator.cc/${loc === 'en' ? '' : loc}/english-subtitle`
        ])
      )
    },
  };
}

export default async function EnglishSubtitlePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const { t, ...translations } = await getServerTranslations(locale);

  return (
    <UniversalLanguagePage 
      languageCode="english"
      locale={locale}
      translations={translations}
    />
  );
} 