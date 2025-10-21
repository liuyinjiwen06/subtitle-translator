import { Metadata } from 'next';
import { getServerTranslations } from '@/lib/server-i18n';
import { Locale, i18nConfig } from '../../../../i18nConfig';
import ClientNavigation from '@/components/ClientNavigation';
import LanguageDropdown from '@/components/LanguageDropdown';
import SubtitleTranslator from '@/components/SubtitleTranslator';
import UnifiedFooter from '@/components/UnifiedFooter';
import Link from 'next/link';

export const runtime = 'edge';

interface SpanishSubtitlePageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

export async function generateMetadata({ params }: SpanishSubtitlePageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t, translations } = await getServerTranslations(locale);
  const ss = translations.spanishSubtitle || {};
  
  return {
    title: ss.meta?.title || 'Spanish SRT Translator - Translate Spanish Subtitles Online Free | SubTran',
    description: ss.meta?.description || 'Professional Spanish subtitle translator. Translate SRT files from Spanish to 30+ languages or translate any language to Spanish. Free online tool with AI-powered accuracy for all Spanish variants.',
    keywords: 'spanish subtitle translator,translate spanish subtitles,spanish srt translator',
    alternates: {
      canonical: `https://subtitletranslator.cc/${locale}/spanish-subtitle`,
      languages: Object.fromEntries(
        i18nConfig.locales.map(loc => [
          loc,
          `https://subtitletranslator.cc/${loc}/spanish-subtitle`
        ])
      )
    },
  };
}

export default async function SpanishSubtitlePage({ params }: SpanishSubtitlePageProps) {
  const { locale } = await params;
  const { t, translations } = await getServerTranslations(locale);

  const ss = translations.spanishSubtitle || {};

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
                currentPath="/spanish-subtitle"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-100 via-orange-50 to-yellow-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              {ss.hero?.headline || "Professional Spanish Subtitle Translator"}
            </h1>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {ss.hero?.subheadline || "Transform your content for 500+ million Spanish speakers worldwide with culturally accurate Spanish subtitles."}
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
                  pageKey: 'spanishSubtitle',
                  targetLanguage: 'es',
                  targetLanguageKey: 'languages.es',
                  path: '/spanish-subtitle'
                }}
                translations={translations}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Spanish Subtitle Solutions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {ss.solutions?.title || "🌶️ Spanish Subtitle Solutions"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {ss.solutions?.subtitle || "Bridge global markets with our advanced Spanish subtitle translation technology designed for the diverse Hispanic world."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {Object.entries(ss.solutions?.items || {}).map(([key, item]: [string, any]) => (
              <div key={key} className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Supporting Features */}
          <div className="bg-orange-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Supporting Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(ss.solutions?.features || []).map((feature: string, index: number) => (
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
              {ss.supportedLanguages?.title || "🌍 Spanish Translation Coverage"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {ss.supportedLanguages?.subtitle || "Connect Spanish content with global audiences through comprehensive language support."}
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {ss.supportedLanguages?.fromSpanish || "Translate Spanish Subtitles To:"}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {ss.supportedLanguages?.description || "English • Chinese • Japanese • French • German • Russian • Italian • Portuguese • Arabic • Hindi • Korean • Thai • Vietnamese • Turkish • Polish • Dutch • Swedish • Danish • Norwegian • Finnish • Czech • Hungarian • Romanian • Bulgarian • Croatian • Slovak • Slovenian • Estonian • Latvian • Lithuanian"}
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {ss.supportedLanguages?.toSpanish || "Plus Reverse Translation:"}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {ss.supportedLanguages?.reverseNote || "Translate any of these languages to Spanish with regional sensitivity and cultural accuracy."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Spanish Language Optimization */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {ss.optimization?.title || "🌮 Spanish Language Optimization"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {ss.optimization?.subtitle || "Advanced processing specifically designed for the unique characteristics and regional complexities of Spanish language content."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(ss.optimization?.items || {}).map(([key, item]: [string, any]) => (
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
              {ss.industries?.title || "🏢 Spanish Content Industries"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {ss.industries?.subtitle || "Discover how Spanish content creators and international businesses leverage our Spanish subtitle translator."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(ss.industries?.items || {}).map(([key, item]: [string, any]) => (
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
              {ss.quality?.title || "🏆 Spanish Translation Excellence"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {ss.quality?.subtitle || "Experience superior Spanish translation quality with our culturally-aware AI engines."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* AI Engines */}
            <div className="bg-gray-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {ss.quality?.engines?.title || "🤖 Dual AI Engine Advantage"}
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Google Translate for Spanish:</h4>
                  <p className="text-gray-600 text-sm">{ss.quality?.engines?.google}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">OpenAI for Spanish:</h4>
                  <p className="text-gray-600 text-sm">{ss.quality?.engines?.openai}</p>
                </div>
              </div>
            </div>

            {/* Quality Checks & Metrics */}
            <div className="space-y-8">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {ss.quality?.checks?.title || "✅ Spanish-Specific Quality Checks"}
                </h3>
                <ul className="space-y-2">
                  {(ss.quality?.checks?.items || []).map((item: string, index: number) => (
                    <li key={index} className="text-gray-600 text-sm">• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {ss.quality?.metrics?.title || "📊 Accuracy Metrics"}
                </h3>
                <ul className="space-y-2">
                  {(ss.quality?.metrics?.items || []).map((item: string, index: number) => (
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
              {ss.technical?.title || "⚡ Spanish Technical Specifications"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {ss.technical?.subtitle || "Built specifically to handle the technical requirements of Spanish subtitle translation."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Processing Capabilities */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {ss.technical?.processing?.title || "⚡ Processing Capabilities"}
              </h3>
              <div className="space-y-3">
                <p className="text-gray-600 text-sm">{ss.technical?.processing?.fileSize}</p>
                <p className="text-gray-600 text-sm">{ss.technical?.processing?.character}</p>
                <p className="text-gray-600 text-sm">{ss.technical?.processing?.speed}</p>
                <p className="text-gray-600 text-sm">{ss.technical?.processing?.quality}</p>
              </div>
            </div>

            {/* Advanced Features */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {ss.technical?.features?.title || "🚀 Advanced Features"}
              </h3>
              <ul className="space-y-2">
                {(ss.technical?.features?.items || []).map((item: string, index: number) => (
                  <li key={index} className="text-gray-600 text-sm">• {item}</li>
                ))}
              </ul>
            </div>

            {/* Quality Assurance */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {ss.technical?.assurance?.title || "🛡️ Quality Assurance"}
              </h3>
              <ul className="space-y-2">
                {(ss.technical?.assurance?.items || []).map((item: string, index: number) => (
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
              {ss.faq?.title || "❓ Spanish Subtitle Translation FAQ"}
            </h2>
            <p className="text-xl text-gray-600">
              {ss.faq?.subtitle || "Get answers to common questions about our Spanish subtitle translation service."}
            </p>
          </div>
          
          <div className="space-y-6">
            {Object.entries(ss.faq?.items || {}).map(([key, faq]: [string, any]) => (
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
