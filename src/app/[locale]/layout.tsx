import { Locale, i18nConfig } from '../../../i18nConfig';
import { getServerTranslations } from '../../lib/server-i18n';

export async function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const { t } = await getServerTranslations(locale);
  
  return {
    title: t('title'),
    description: t('description'),
    keywords: t('seo.keywords'),
    alternates: {
      canonical: `https://subtitletranslator.cc/${locale === 'en' ? '' : locale}`,
      languages: Object.fromEntries(
        i18nConfig.locales.map(loc => [
          loc,
          `https://subtitletranslator.cc/${loc === 'en' ? '' : loc}`
        ])
      )
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `https://subtitletranslator.cc/${locale === 'en' ? '' : locale}`,
      siteName: t('title'),
      locale: locale,
      type: 'website',
    },
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  return children;
}