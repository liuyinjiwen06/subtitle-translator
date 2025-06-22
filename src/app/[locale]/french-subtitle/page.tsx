import { Locale, i18nConfig } from "../../../../i18nConfig";
import { getServerTranslations } from "../../../lib/server-i18n";
import UniversalLanguagePage from "../../../components/UniversalLanguagePage";

export async function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
  const { t } = await getServerTranslations(locale);
  
  return {
    title: t("pages.frenchSubtitle.seo.title") || "Free French Subtitle Translator - Translate SRT Online",
    description: t("pages.frenchSubtitle.seo.description") || "Professional French subtitle translator",
    keywords: t("pages.frenchSubtitle.seo.keywords") || "french subtitle translator,translate subtitles to french",
    alternates: {
      canonical: `https://subtitletranslator.cc/${locale === "en" ? "" : locale}/french-subtitle`,
      languages: Object.fromEntries(
        i18nConfig.locales.map(loc => [
          loc,
          `https://subtitletranslator.cc/${loc === "en" ? "" : loc}/french-subtitle`
        ])
      )
    }
  };
}

export default async function FrenchSubtitlePage({ params: { locale } }: { params: { locale: Locale } }) {
  const { t, ...translations } = await getServerTranslations(locale);
  
  return (
    <UniversalLanguagePage 
      languageCode="french" 
      locale={locale} 
      translations={translations} 
    />
  );
}
