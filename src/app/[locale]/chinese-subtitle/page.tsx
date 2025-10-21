import { Metadata } from 'next';
import { getServerTranslations } from '@/lib/server-i18n';
import { Locale, i18nConfig } from '../../../../i18nConfig';
import ClientNavigation from '@/components/ClientNavigation';
import LanguageDropdown from '@/components/LanguageDropdown';
import SubtitleTranslator from '@/components/SubtitleTranslator';
import UnifiedFooter from '@/components/UnifiedFooter';
import Link from 'next/link';

interface ChineseSubtitlePageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

export async function generateMetadata({ params }: ChineseSubtitlePageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getServerTranslations(locale);
  
  return {
    title: t('chineseSubtitle.meta.title'),
    description: t('chineseSubtitle.meta.description'),
    keywords: t('chineseSubtitle.meta.keywords', 'chinese subtitle translator,translate chinese subtitles,chinese srt translator'),
    alternates: {
      canonical: `https://subtitletranslator.cc/${locale}/chinese-subtitle`,
      languages: Object.fromEntries(
        i18nConfig.locales.map(loc => [
          loc,
          `https://subtitletranslator.cc/${loc}/chinese-subtitle`
        ])
      )
    },
  };
}

export default async function ChineseSubtitlePage({ params }: ChineseSubtitlePageProps) {
  const { locale } = await params;
  const { t, translations } = await getServerTranslations(locale);

  const cs = translations.chineseSubtitle || {};

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
                currentPath="/chinese-subtitle"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-100 via-red-50 to-orange-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              {cs.hero?.headline || "Professional Chinese Subtitle Translator"}
            </h1>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {cs.hero?.subheadline || "Translate Chinese subtitles to 30+ languages or convert any language to Chinese with perfect accuracy."}
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
                  pageKey: 'chineseSubtitle',
                  targetLanguage: 'zh',
                  targetLanguageKey: 'languages.zh',
                  path: '/chinese-subtitle'
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
              {cs.solutions?.title || "🏮 Chinese Subtitle Solutions"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {cs.solutions?.subtitle || "Bridge Eastern and Western content markets with our advanced Chinese subtitle translation technology."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {Object.entries(cs.solutions?.items || {}).map(([key, item]: [string, any]) => (
              <div key={key} className="bg-gray-50 rounded-xl p-6">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(cs.solutions?.features || []).map((feature: string, index: number) => (
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
              {cs.supportedLanguages?.title || "🌍 Supported Languages"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {cs.supportedLanguages?.subtitle || "Connect Chinese content with global audiences through comprehensive language support."}
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {cs.supportedLanguages?.fromChinese || "Translate Chinese Subtitles To:"}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {cs.supportedLanguages?.description}
              </p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {cs.supportedLanguages?.toChinese || "Plus Reverse Translation:"}
              </h3>
              <p className="text-gray-600">
                {cs.supportedLanguages?.reverseNote}
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
              {cs.optimization?.title || "🀄 Chinese Language Optimization"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {cs.optimization?.subtitle || "Advanced processing specifically designed for the unique characteristics of Chinese language content."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(cs.optimization?.items || {}).map(([key, item]: [string, any]) => (
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
              {cs.industries?.title || "🏢 Industry Applications"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {cs.industries?.subtitle || "Discover how Chinese content creators leverage our Chinese subtitle translator."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(cs.industries?.items || {}).map(([key, industry]: [string, any]) => (
              <div key={key} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-4">{industry.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900">{industry.title}</h3>
                </div>
                <div className="space-y-3">
                  {Object.entries(industry.applications || {}).map(([appKey, app]: [string, any]) => (
                    <p key={appKey} className="text-gray-600 text-sm">
                      <strong>{appKey}:</strong> {app}
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
              {cs.quality?.title || "🏆 Quality & Accuracy"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {cs.quality?.subtitle || "Experience superior Chinese translation quality with our culturally-aware AI engines."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* AI Engines */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {cs.quality?.engines?.title || "🤖 Dual AI Engine Advantage"}
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Google Translate:</h4>
                  <p className="text-gray-600 text-sm">{cs.quality?.engines?.google}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">OpenAI:</h4>
                  <p className="text-gray-600 text-sm">{cs.quality?.engines?.openai}</p>
                </div>
              </div>
            </div>

            {/* Quality Checks */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {cs.quality?.checks?.title || "✅ Chinese-Specific Quality Checks"}
              </h3>
              <ul className="space-y-2">
                {(cs.quality?.checks?.items || []).map((item: string, index: number) => (
                  <li key={index} className="text-gray-600 text-sm">• {item}</li>
                ))}
              </ul>
            </div>

            {/* Accuracy Metrics */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {cs.quality?.metrics?.title || "📊 Accuracy Metrics"}
              </h3>
              <ul className="space-y-2">
                {(cs.quality?.metrics?.items || []).map((item: string, index: number) => (
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
              {cs.technical?.title || "⚡ Technical Specifications"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {cs.technical?.subtitle || "Built specifically to handle the technical requirements of Chinese subtitle translation."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Processing Capabilities */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {cs.technical?.processing?.title || "⚡ Processing Capabilities"}
              </h3>
              <div className="space-y-3">
                <p className="text-gray-600 text-sm">{cs.technical?.processing?.fileSize}</p>
                <p className="text-gray-600 text-sm">{cs.technical?.processing?.character}</p>
                <p className="text-gray-600 text-sm">{cs.technical?.processing?.speed}</p>
                <p className="text-gray-600 text-sm">{cs.technical?.processing?.quality}</p>
              </div>
            </div>

            {/* Advanced Features */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {cs.technical?.features?.title || "🚀 Advanced Features"}
              </h3>
              <ul className="space-y-2">
                {(cs.technical?.features?.items || []).map((item: string, index: number) => (
                  <li key={index} className="text-gray-600 text-sm">• {item}</li>
                ))}
              </ul>
            </div>

            {/* Quality Assurance */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {cs.technical?.assurance?.title || "🛡️ Quality Assurance"}
              </h3>
              <ul className="space-y-2">
                {(cs.technical?.assurance?.items || []).map((item: string, index: number) => (
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
              {cs.faq?.title || "❓ Frequently Asked Questions"}
            </h2>
            <p className="text-xl text-gray-600">
              {cs.faq?.subtitle || "Get answers to common questions about our Chinese subtitle translation service."}
            </p>
          </div>
          
          <div className="space-y-6">
            {Object.entries(cs.faq?.items || {}).map(([key, faq]: [string, any]) => (
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