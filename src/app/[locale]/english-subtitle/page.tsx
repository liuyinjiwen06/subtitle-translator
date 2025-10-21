import { Metadata } from 'next';
import { getServerTranslations } from '@/lib/server-i18n';
import { Locale, i18nConfig } from '../../../../i18nConfig';
import ClientNavigation from '@/components/ClientNavigation';
import LanguageDropdown from '@/components/LanguageDropdown';
import SubtitleTranslator from '@/components/SubtitleTranslator';
import UnifiedFooter from '@/components/UnifiedFooter';
import Link from 'next/link';

export const runtime = 'edge';

interface EnglishSubtitlePageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

export async function generateMetadata({ params }: EnglishSubtitlePageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getServerTranslations(locale);
  
  return {
    title: t('englishSubtitle.meta.title'),
    description: t('englishSubtitle.meta.description'),
    keywords: t('englishSubtitle.meta.keywords', 'english subtitle translator,translate english subtitles,english srt translator'),
    alternates: {
      canonical: `https://subtitletranslator.cc/${locale}/english-subtitle`,
      languages: Object.fromEntries(
        i18nConfig.locales.map(loc => [
          loc,
          `https://subtitletranslator.cc/${loc}/english-subtitle`
        ])
      )
    },
  };
}

export default async function EnglishSubtitlePage({ params }: EnglishSubtitlePageProps) {
  const { locale } = await params;
  const { t, translations } = await getServerTranslations(locale);

  const es = translations.englishSubtitle || {};

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href={`/${locale}`} className="text-xl font-bold text-blue-600">
                SubTran
              </Link>
            </div>
            <div className="flex items-center">
              <LanguageDropdown 
                currentLocale={locale}
                currentPath="/english-subtitle"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              {es.hero?.headline || "Translate English Subtitles Instantly"}
            </h1>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {es.hero?.subheadline || "Translate English subtitles to 30+ languages or convert any language to English with perfect accuracy."}
            </p>
          </div>
        </div>
      </section>

      {/* Translator Functionality Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <SubtitleTranslator
                pageConfig={{
                  pageKey: 'englishSubtitle',
                  targetLanguage: 'en',
                  targetLanguageKey: 'languages.en',
                  path: '/english-subtitle'
                }}
                translations={translations}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {es.solutions?.title || "🌟 English Subtitle Solutions"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {es.solutions?.subtitle || "Master the global content market with our specialized English subtitle translation technology."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {Object.entries(es.solutions?.items || {}).map(([key, item]: [string, any]) => (
              <div key={key} className="bg-gray-50 rounded-xl p-6">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(es.solutions?.features || []).map((feature: string, index: number) => (
                <div key={index} className="text-sm text-blue-800 font-medium">
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Supported Languages */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {es.supportedLanguages?.title || "🌍 Supported Languages"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {es.supportedLanguages?.subtitle || "Transform your English subtitles for global audiences with comprehensive language support."}
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {es.supportedLanguages?.fromEnglish || "Translate English Subtitles To:"}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {es.supportedLanguages?.description}
              </p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {es.supportedLanguages?.toEnglish || "Plus Reverse Translation:"}
              </h3>
              <p className="text-gray-600">
                {es.supportedLanguages?.reverseNote}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Optimization Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {es.optimization?.title || "🔧 English Content Optimization"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {es.optimization?.subtitle || "Advanced features specifically designed to handle the complexities of English language content."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(es.optimization?.items || {}).map(([key, item]: [string, any]) => (
              <div key={key} className="bg-gray-50 rounded-xl p-6">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {es.industries?.title || "🏢 Industry Applications"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {es.industries?.subtitle || "Discover how professionals across industries rely on our English subtitle translator."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(es.industries?.items || {}).map(([key, industry]: [string, any]) => (
              <div key={key} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-4">{industry.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900">{industry.title}</h3>
                </div>
                <div className="space-y-3">
                  {Object.entries(industry.applications || {}).map(([appKey, app]: [string, any]) => (
                    <p key={appKey} className="text-gray-600 text-sm">
                      <strong className="capitalize">{appKey}:</strong> {app}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {es.quality?.title || "🏆 Quality & Accuracy"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {es.quality?.subtitle || "Experience superior translation quality with our English-specialized AI engines."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* AI Engines */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {es.quality?.engines?.title || "🤖 Dual AI Engine Advantage"}
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Google Translate:</h4>
                  <p className="text-gray-600 text-sm">{es.quality?.engines?.google}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">OpenAI:</h4>
                  <p className="text-gray-600 text-sm">{es.quality?.engines?.openai}</p>
                </div>
              </div>
            </div>

            {/* Quality Checks */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {es.quality?.checks?.title || "✅ English-Specific Quality Checks"}
              </h3>
              <ul className="space-y-2">
                {(es.quality?.checks?.items || []).map((item: string, index: number) => (
                  <li key={index} className="text-gray-600 text-sm">• {item}</li>
                ))}
              </ul>
            </div>

            {/* Accuracy Metrics */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {es.quality?.metrics?.title || "📊 Accuracy Metrics"}
              </h3>
              <ul className="space-y-2">
                {(es.quality?.metrics?.items || []).map((item: string, index: number) => (
                  <li key={index} className="text-gray-600 text-sm">• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {es.technical?.title || "⚡ Technical Specifications"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {es.technical?.subtitle || "Built specifically to handle the technical requirements of English subtitle translation."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Processing Capabilities */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {es.technical?.processing?.title || "⚡ Processing Capabilities"}
              </h3>
              <div className="space-y-3">
                <p className="text-gray-600 text-sm">{es.technical?.processing?.fileSize}</p>
                <p className="text-gray-600 text-sm">{es.technical?.processing?.format}</p>
                <p className="text-gray-600 text-sm">{es.technical?.processing?.speed}</p>
                <p className="text-gray-600 text-sm">{es.technical?.processing?.quality}</p>
              </div>
            </div>

            {/* Advanced Features */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {es.technical?.features?.title || "🚀 Advanced Features"}
              </h3>
              <ul className="space-y-2">
                {(es.technical?.features?.items || []).map((item: string, index: number) => (
                  <li key={index} className="text-gray-600 text-sm">• {item}</li>
                ))}
              </ul>
            </div>

            {/* Quality Assurance */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {es.technical?.assurance?.title || "🛡️ Quality Assurance"}
              </h3>
              <ul className="space-y-2">
                {(es.technical?.assurance?.items || []).map((item: string, index: number) => (
                  <li key={index} className="text-gray-600 text-sm">• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {es.faq?.title || "❓ Frequently Asked Questions"}
            </h2>
            <p className="text-xl text-gray-600">
              {es.faq?.subtitle || "Get answers to common questions about our English subtitle translation service."}
            </p>
          </div>
          
          <div className="space-y-6">
            {Object.entries(es.faq?.items || {}).map(([key, faq]: [string, any]) => (
              <div key={key} className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <UnifiedFooter translations={translations} />
    </div>
  );
}