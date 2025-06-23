import { Locale, i18nConfig } from "../../../../i18nConfig";
import { getServerTranslations } from "../../../lib/server-i18n";
import UniversalLanguagePage from "../../../components/UniversalLanguagePage";

export const runtime = 'edge';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const { t } = await getServerTranslations(locale);
  
  return {
    title: t("pages.portugueseSubtitle.seo.title") || "Free Portuguese Subtitle Translator - Translate SRT Online",
    description: t("pages.portugueseSubtitle.seo.description") || "Professional Portuguese subtitle translator",
    keywords: t("pages.portugueseSubtitle.seo.keywords") || "portuguese subtitle translator,translate subtitles to portuguese",
    alternates: {
      canonical: `https://subtitletranslator.cc/${locale === "en" ? "" : locale}/portuguese-subtitle`,
      languages: Object.fromEntries(
        i18nConfig.locales.map(loc => [
          loc,
          `https://subtitletranslator.cc/${loc === "en" ? "" : loc}/portuguese-subtitle`
        ])
      )
    }
  };
}

export default async function PortugueseSubtitlePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const { t, ...translations } = await getServerTranslations(locale);
  
  return (
    <UniversalLanguagePage 
      languageCode="portuguese" 
      locale={locale} 
      translations={translations} 
    />
  );
}
