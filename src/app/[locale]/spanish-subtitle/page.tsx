import { Locale, i18nConfig } from "../../../../i18nConfig";
import { getServerTranslations } from "../../../lib/server-i18n";
import UniversalLanguagePage from "../../../components/UniversalLanguagePage";

export const runtime = 'edge';

export async function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const { t } = await getServerTranslations(locale);
  
  return {
    title: t("pages.spanishSubtitle.seo.title") || "Free Spanish Subtitle Translator - Translate SRT Online",
    description: t("pages.spanishSubtitle.seo.description") || "Professional Spanish subtitle translator",
    keywords: t("pages.spanishSubtitle.seo.keywords") || "spanish subtitle translator,translate subtitles to spanish",
    alternates: {
      canonical: `https://subtitletranslator.cc/${locale === "en" ? "" : locale}/spanish-subtitle`,
      languages: Object.fromEntries(
        i18nConfig.locales.map(loc => [
          loc,
          `https://subtitletranslator.cc/${loc === "en" ? "" : loc}/spanish-subtitle`
        ])
      )
    }
  };
}

export default async function SpanishSubtitlePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const { t, ...translations } = await getServerTranslations(locale);
  
  return (
    <UniversalLanguagePage 
      languageCode="spanish" 
      locale={locale} 
      translations={translations} 
    />
  );
}
