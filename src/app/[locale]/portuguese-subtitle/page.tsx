import { Metadata } from 'next';
import { getServerTranslations } from '@/lib/server-i18n';
import { Locale, i18nConfig } from '../../../../i18nConfig';
import ClientNavigation from '@/components/ClientNavigation';
import LanguageDropdown from '@/components/LanguageDropdown';
import SubtitleTranslator from '@/components/SubtitleTranslator';
import UnifiedFooter from '@/components/UnifiedFooter';
import Link from 'next/link';


interface PortugueseSubtitlePageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

export async function generateMetadata({ params }: PortugueseSubtitlePageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t, translations } = await getServerTranslations(locale);
  const ps = translations.portugueseSubtitle || {};
  
  return {
    title: ps.meta?.title || 'Portuguese SRT Translator - Translate Portuguese Subtitles Online Free | SubTran',
    description: ps.meta?.description || 'Professional Portuguese subtitle translator. Translate SRT files from Portuguese to 30+ languages or translate any language to Portuguese. Free online tool with AI-powered accuracy for all Portuguese variants.',
    keywords: 'portuguese subtitle translator,translate portuguese subtitles,portuguese srt translator',
    alternates: {
      canonical: `https://subtitletranslator.cc/${locale}/portuguese-subtitle`,
      languages: Object.fromEntries(
        i18nConfig.locales.map(loc => [
          loc,
          `https://subtitletranslator.cc/${loc}/portuguese-subtitle`
        ])
      )
    },
  };
}

export default async function PortugueseSubtitlePage({ params }: PortugueseSubtitlePageProps) {
  const { locale } = await params;
  const { t, translations } = await getServerTranslations(locale);

  const ps = translations.portugueseSubtitle || {};

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
                currentPath="/portuguese-subtitle"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-100 via-green-50 to-emerald-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              {ps.hero?.headline || "Translate Portuguese Subtitles Instantly"}
            </h1>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {ps.hero?.subheadline || "Connect with 260+ million Portuguese speakers worldwide with culturally authentic and linguistically precise translations."}
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
                  pageKey: 'portugueseSubtitle',
                  targetLanguage: 'pt',
                  targetLanguageKey: 'languages.pt',
                  path: '/portuguese-subtitle'
                }}
                translations={translations}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Portuguese Subtitle Solutions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {ps.solutions?.title || "🇵🇹 Portuguese Subtitle Solutions"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {ps.solutions?.subtitle || "Bridge Brazilian, European, and African Portuguese markets with our advanced subtitle translation technology."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {Object.entries(ps.solutions?.items || {}).map(([key, item]: [string, any]) => (
              <div key={key} className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Supporting Features */}
          <div className="bg-green-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Supporting Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(ps.solutions?.features || []).map((feature: string, index: number) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="text-xl">{feature.split(' ')[0]}</div>
                  <span className="font-medium text-gray-800">{feature.substring(feature.indexOf(' ') + 1)}</span>
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
              {ps.supportedLanguages?.title || "🌍 Portuguese Translation Coverage"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {ps.supportedLanguages?.subtitle || "Connect Portuguese content with global audiences through comprehensive language support."}
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {ps.supportedLanguages?.fromPortuguese || "Translate Portuguese Subtitles To:"}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {ps.supportedLanguages?.description || "English • Spanish • French • German • Italian • Russian • Chinese • Japanese • Korean • Arabic • Hindi • Dutch • Swedish • Danish • Norwegian • Finnish • Polish • Czech • Hungarian • Romanian • Bulgarian • Croatian • Slovak • Slovenian • Estonian • Latvian • Lithuanian • Turkish • Thai • Vietnamese"}
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {ps.supportedLanguages?.toPortuguese || "Plus Reverse Translation:"}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {ps.supportedLanguages?.reverseNote || "Translate any of these languages to Portuguese with regional preference settings for Brazil, Portugal, or other Portuguese-speaking markets."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Portuguese Language Optimization */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {ps.optimization?.title || "🎯 Portuguese Language Optimization"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {ps.optimization?.subtitle || "Advanced processing specifically designed for the grammatical complexity and cultural diversity of Portuguese language content."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(ps.optimization?.items || {}).map(([key, item]: [string, any]) => (
              <div key={key} className="bg-gray-50 rounded-xl p-6">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Applications */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {ps.industries?.title || "🏢 Portuguese Content Industries"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {ps.industries?.subtitle || "Discover how Portuguese content creators and international businesses leverage our Portuguese subtitle translator."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(ps.industries?.items || {}).map(([key, item]: [string, any]) => (
              <div key={key} className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">{item.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                </div>
                <div className="space-y-3">
                  {Object.entries(item.applications || {}).map(([appKey, appText]: [string, any]) => (
                    <p key={appKey} className="text-gray-600 text-sm leading-relaxed">{appText}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality & Accuracy */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {ps.quality?.title || "🏆 Portuguese Translation Excellence"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {ps.quality?.subtitle || "Experience superior Portuguese translation quality with our culturally-aware AI engines."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* AI Engines */}
            <div className="bg-gray-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {ps.quality?.engines?.title || "🤖 Dual AI Engine Advantage"}
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Google Translate for Portuguese:</h4>
                  <p className="text-gray-600 text-sm">{ps.quality?.engines?.google}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">OpenAI for Portuguese:</h4>
                  <p className="text-gray-600 text-sm">{ps.quality?.engines?.openai}</p>
                </div>
              </div>
            </div>

            {/* Quality Checks & Metrics */}
            <div className="space-y-8">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {ps.quality?.checks?.title || "✅ Portuguese-Specific Quality Checks"}
                </h3>
                <ul className="space-y-2">
                  {(ps.quality?.checks?.items || []).map((item: string, index: number) => (
                    <li key={index} className="text-gray-600 text-sm">• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {ps.quality?.metrics?.title || "📊 Accuracy Metrics"}
                </h3>
                <ul className="space-y-2">
                  {(ps.quality?.metrics?.items || []).map((item: string, index: number) => (
                    <li key={index} className="text-gray-600 text-sm">• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {ps.technical?.title || "⚡ Portuguese Technical Specifications"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {ps.technical?.subtitle || "Built specifically to handle the technical requirements of Portuguese subtitle translation."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Processing Capabilities */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {ps.technical?.processing?.title || "⚡ Processing Capabilities"}
              </h3>
              <div className="space-y-3">
                <p className="text-gray-600 text-sm">{ps.technical?.processing?.fileSize}</p>
                <p className="text-gray-600 text-sm">{ps.technical?.processing?.character}</p>
                <p className="text-gray-600 text-sm">{ps.technical?.processing?.speed}</p>
                <p className="text-gray-600 text-sm">{ps.technical?.processing?.quality}</p>
              </div>
            </div>

            {/* Advanced Features */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {ps.technical?.features?.title || "🚀 Advanced Features"}
              </h3>
              <ul className="space-y-2">
                {(ps.technical?.features?.items || []).map((item: string, index: number) => (
                  <li key={index} className="text-gray-600 text-sm">• {item}</li>
                ))}
              </ul>
            </div>

            {/* Quality Assurance */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {ps.technical?.assurance?.title || "🛡️ Quality Assurance"}
              </h3>
              <ul className="space-y-2">
                {(ps.technical?.assurance?.items || []).map((item: string, index: number) => (
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
              {ps.faq?.title || "❓ Portuguese Subtitle Translation FAQ"}
            </h2>
            <p className="text-xl text-gray-600">
              {ps.faq?.subtitle || "Get answers to common questions about our Portuguese subtitle translation service."}
            </p>
          </div>
          
          <div className="space-y-6">
            {Object.entries(ps.faq?.items || {}).map(([key, faq]: [string, any]) => (
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