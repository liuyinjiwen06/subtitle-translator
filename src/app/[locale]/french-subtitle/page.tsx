import { Metadata } from 'next';
import { getServerTranslations } from '@/lib/server-i18n';
import { Locale } from '../../../../i18nConfig';
import ClientNavigation from '@/components/ClientNavigation';
import LanguageDropdown from '@/components/LanguageDropdown';
import SubtitleTranslator from '@/components/SubtitleTranslator';
import UnifiedFooter from '@/components/UnifiedFooter';
import Link from 'next/link';

interface FrenchSubtitlePageProps {
  params: {
    locale: Locale;
  };
}

export async function generateMetadata({ params: { locale } }: FrenchSubtitlePageProps): Promise<Metadata> {
  const { t, translations } = await getServerTranslations(locale);
  const fs = translations.frenchSubtitle || {};
  
  return {
    title: fs.meta?.title || 'French SRT Translator - Translate French Subtitles Online Free | SubTran',
    description: fs.meta?.description || 'Professional French subtitle translator. Translate SRT files from French to 30+ languages or translate any language to French. Free online tool with AI-powered accuracy for all French variants.',
    keywords: 'french subtitle translator,translate french subtitles,french srt translator',
  };
}

export default async function FrenchSubtitlePage({ params: { locale } }: FrenchSubtitlePageProps) {
  const { t, translations } = await getServerTranslations(locale);

  const fs = translations.frenchSubtitle || {};

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
                currentPath="/french-subtitle"
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
              {fs.hero?.headline || "Translate French Subtitles Instantly"}
            </h1>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {fs.hero?.subheadline || "Transform French content for global audiences or bring international content to French-speaking markets with linguistic precision and cultural authenticity."}
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
                pageConfig={{}}
                translations={translations}
              />
            </div>
          </div>
        </div>
      </section>

      {/* French Subtitle Solutions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {fs.solutions?.title || "🇫🇷 French Subtitle Solutions"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {fs.solutions?.subtitle || "Bridge French and international markets with our advanced French subtitle translation technology."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {Object.entries(fs.solutions?.items || {}).map(([key, item]: [string, any]) => (
              <div key={key} className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Supporting Features */}
          <div className="bg-blue-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Supporting Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(fs.solutions?.features || []).map((feature: string, index: number) => (
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
              {fs.supportedLanguages?.title || "🌍 French Translation Coverage"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {fs.supportedLanguages?.subtitle || "Connect French content with global audiences through comprehensive language support."}
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {fs.supportedLanguages?.fromFrench || "Translate French Subtitles To:"}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {fs.supportedLanguages?.description || "English • Spanish • German • Italian • Portuguese • Russian • Chinese • Japanese • Korean • Arabic • Hindi • Dutch • Swedish • Danish • Norwegian • Finnish • Polish • Czech • Hungarian • Romanian • Bulgarian • Croatian • Slovak • Slovenian • Estonian • Latvian • Lithuanian • Turkish • Thai • Vietnamese"}
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {fs.supportedLanguages?.toFrench || "Plus Reverse Translation:"}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {fs.supportedLanguages?.reverseNote || "Translate any of these languages to French with regional preference settings for France, Quebec, Belgium, or other French-speaking markets."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* French Language Optimization */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {fs.optimization?.title || "🎭 French Language Optimization"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {fs.optimization?.subtitle || "Advanced processing specifically designed for the sophisticated grammar structure and cultural nuances of French language content."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(fs.optimization?.items || {}).map(([key, item]: [string, any]) => (
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
              {fs.industries?.title || "🏢 French Content Industries"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {fs.industries?.subtitle || "Discover how French content creators and international businesses leverage our French subtitle translator."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(fs.industries?.items || {}).map(([key, item]: [string, any]) => (
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
              {fs.quality?.title || "🏆 French Translation Excellence"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {fs.quality?.subtitle || "Experience superior French translation quality with our culturally-aware AI engines."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* AI Engines */}
            <div className="bg-gray-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {fs.quality?.engines?.title || "🤖 Dual AI Engine Advantage"}
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Google Translate for French:</h4>
                  <p className="text-gray-600 text-sm">{fs.quality?.engines?.google}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">OpenAI for French:</h4>
                  <p className="text-gray-600 text-sm">{fs.quality?.engines?.openai}</p>
                </div>
              </div>
            </div>

            {/* Quality Checks & Metrics */}
            <div className="space-y-8">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {fs.quality?.checks?.title || "✅ French-Specific Quality Checks"}
                </h3>
                <ul className="space-y-2">
                  {(fs.quality?.checks?.items || []).map((item: string, index: number) => (
                    <li key={index} className="text-gray-600 text-sm">• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {fs.quality?.metrics?.title || "📊 Accuracy Metrics"}
                </h3>
                <ul className="space-y-2">
                  {(fs.quality?.metrics?.items || []).map((item: string, index: number) => (
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
              {fs.technical?.title || "⚡ French Technical Specifications"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {fs.technical?.subtitle || "Built specifically to handle the technical requirements of French subtitle translation."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Processing Capabilities */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {fs.technical?.processing?.title || "⚡ Processing Capabilities"}
              </h3>
              <div className="space-y-3">
                <p className="text-gray-600 text-sm">{fs.technical?.processing?.fileSize}</p>
                <p className="text-gray-600 text-sm">{fs.technical?.processing?.character}</p>
                <p className="text-gray-600 text-sm">{fs.technical?.processing?.speed}</p>
                <p className="text-gray-600 text-sm">{fs.technical?.processing?.quality}</p>
              </div>
            </div>

            {/* Advanced Features */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {fs.technical?.features?.title || "🚀 Advanced Features"}
              </h3>
              <ul className="space-y-2">
                {(fs.technical?.features?.items || []).map((item: string, index: number) => (
                  <li key={index} className="text-gray-600 text-sm">• {item}</li>
                ))}
              </ul>
            </div>

            {/* Quality Assurance */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {fs.technical?.assurance?.title || "🛡️ Quality Assurance"}
              </h3>
              <ul className="space-y-2">
                {(fs.technical?.assurance?.items || []).map((item: string, index: number) => (
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
              {fs.faq?.title || "❓ French Subtitle Translation FAQ"}
            </h2>
            <p className="text-xl text-gray-600">
              {fs.faq?.subtitle || "Get answers to common questions about our French subtitle translation service."}
            </p>
          </div>
          
          <div className="space-y-6">
            {Object.entries(fs.faq?.items || {}).map(([key, faq]: [string, any]) => (
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
