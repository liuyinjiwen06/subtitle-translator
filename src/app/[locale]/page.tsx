import { Locale } from '../../../i18nConfig';
import { getServerTranslations } from '../../lib/server-i18n';
import HomePageComponent from '../../components/HomePage';

export const runtime = 'edge';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const { t } = await getServerTranslations(locale);
  
  return {
    title: t('seo.title'),
    description: t('seo.description'),
    keywords: t('seo.keywords'),
    openGraph: {
      title: t('seo.title'),
      description: t('seo.description'),
      type: 'website',
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const { t, translations } = await getServerTranslations(locale);

  // 构建首页专用的 pageConfig
  const pageConfig = {
    title: translations.title,
    description: translations.description,
    seo: {
      title: translations.seo?.title || translations.title,
      description: translations.seo?.description || translations.description,
      keywords: translations.seo?.keywords || 'subtitle, translation, SRT'
    },
    benefits: translations.benefits ? Object.values(translations.benefits).filter((item: any) => item.title && item.description) : [],
    useCases: translations.useCases ? Object.values(translations.useCases).filter((item: any) => item.title && item.description) : [],
    faq: translations.faq ? Object.values(translations.faq).filter((item: any) => item.question && item.answer) : [],
    cta: {
      title: translations.cta?.title || t('cta.title', 'Get Started'),
      description: translations.cta?.description || t('cta.description', 'Start translating your subtitles now')
    }
  };

  return (
    <HomePageComponent 
      pageConfig={pageConfig}
      translations={translations}
      locale={locale}
    />
  );
} 