"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import LanguageChanger from './LanguageChanger';
import SubtitleTranslator from './SubtitleTranslator';

interface UniversalLanguagePageProps {
  languageCode: string;
  locale: string;
  translations?: any;
}

interface LayoutData {
  language: string;
  languageName: string;
  title: string;
  description: string;
  sections: any[];
  metadata: any;
}

interface ContentData {
  language: any;
  seo: any;
  hero: any;
  languageBenefits: any;
  languageStats?: any;
  contentTypes?: any;
  faq?: any;
  common_questions?: any;
  cta: any;
  footer: any;
  industryUseCases?: any;
  languageLearning?: any;
  [key: string]: any;
}

const UniversalLanguagePage: React.FC<UniversalLanguagePageProps> = ({ languageCode, locale, translations }) => {
  const [layout, setLayout] = useState<LayoutData | null>(null);
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLanguagePageData(languageCode);
  }, [languageCode]);

  const loadLanguagePageData = async (langCode: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔄 Loading ${langCode} page data...`);
      
      const [layoutResponse, contentResponse] = await Promise.all([
        fetch(`/generated-content/layouts/${langCode}-layout.json`),
        fetch(`/generated-content/${langCode}-subtitle-page.json`)
      ]);

      if (!layoutResponse.ok) {
        throw new Error(`Layout not found for ${langCode}`);
      }
      
      if (!contentResponse.ok) {
        throw new Error(`Content not found for ${langCode}`);
      }

      const layoutData = await layoutResponse.json();
      const contentData = await contentResponse.json();

      console.log(`✅ Loaded ${langCode} page:`, {
        sections: layoutData.sections.length,
        title: layoutData.title
      });

      setLayout(layoutData);
      setContent(contentData);
      
    } catch (err) {
      console.error(`❌ Failed to load ${langCode} page:`, err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedPath = (path: string) => {
    return `/${locale}${path}`;
  };

  if (loading) {
    return (
      <div className="page-loading-skeleton min-h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
          <p className="text-center mt-4 text-gray-500">
            Loading {languageCode} page...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-error-view text-center p-8 min-h-screen flex items-center justify-center">
        <div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Failed to load {languageCode} page
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-4">
            <button 
              onClick={() => loadLanguagePageData(languageCode)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Retry
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!layout || !content) {
    return (
      <div className="page-not-found text-center p-8 min-h-screen flex items-center justify-center">
        <div>
          <h1 className="text-2xl font-bold mb-4">
            Language "{languageCode}" not found
          </h1>
          <p className="text-gray-600 mb-6">
            This language page hasn't been generated yet.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            View Available Languages
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`universal-language-page language-${languageCode} min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50`}>
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href={`/${locale}`} className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                {translations?.nav?.home || 'Subtitle Translator'}
              </Link>
              

            </div>

            <div className="flex items-center">
              <LanguageChanger currentLocale={locale} />
            </div>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      {(translations?.[`${languageCode}Subtitle`]?.hero || content.hero) && (
        <div className="hero-section bg-gradient-to-r from-blue-600 to-purple-700 text-white py-24">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="text-6xl mb-4">
              {translations?.[`${languageCode}Subtitle`]?.hero?.flag || content.hero?.flag}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-relaxed">
              {translations?.[`${languageCode}Subtitle`]?.hero?.title || content.hero?.title}
            </h1>
            <p className="text-sm md:text-sm text-blue-100 max-w-3xl mx-auto">
              {translations?.[`${languageCode}Subtitle`]?.hero?.description || content.hero?.description}
            </p>
          </div>
        </div>
      )}

      {/* Translator Functionality Section */}
      <div className="translator-section py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <SubtitleTranslator 
                pageConfig={{
                  pageKey: languageCode,
                  targetLanguage: content.language?.code || languageCode,
                  targetLanguageKey: `languages.${content.language?.code || languageCode}`,
                  path: `/${languageCode}-subtitle`,
                  showInNav: true,
                  priority: 1
                }}
                translations={{
                  title: `${content.language?.name || languageCode} Subtitle Translator`,
                  upload: "Upload SRT File",
                  select_language: "Target Language",
                  translate: `Translate to ${content.language?.name || languageCode}`,
                  translating: "Translating...",
                  download: "Download Translated File",
                  please_select_srt_file: "Please select an .srt subtitle file",
                  please_upload_file_first: "Please upload a subtitle file first",
                  translation_failed: "Translation Failed",
                  cannot_read_response: "Cannot read response stream",
                  translation_error_occurred: "An error occurred during translation",
                  file_selected_click_to_reselect: "File selected, click to reselect",
                  click_or_drag_to_upload: "Click or drag to upload SRT subtitle file",
                  select_translation_service: "Select Translation Service",
                  translation_services: {
                    google: "Google Translate",
                    openai: "OpenAI Translation"
                  },
                  search_languages: "Search languages...",
                  no_matching_languages: "No matching languages found",
                  languages: {
                    en: "English",
                    zh: "Chinese",
                    ja: "Japanese",
                    fr: "French",
                    de: "German",
                    es: "Spanish",
                    ru: "Russian",
                    it: "Italian",
                    pt: "Portuguese",
                    ar: "Arabic",
                    hi: "Hindi",
                    ko: "Korean"
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Language Benefits */}
      {(translations?.[`${languageCode}Subtitle`]?.benefits || content.languageBenefits) && (
        <div className="language-benefits py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {translations?.[`${languageCode}Subtitle`]?.benefits?.title || content.languageBenefits?.title}
              </h2>
              <p className="text-xl text-gray-600">
                {translations?.[`${languageCode}Subtitle`]?.benefits?.subtitle || content.languageBenefits?.subtitle}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(translations?.[`${languageCode}Subtitle`]?.benefits?.items 
                ? Object.values(translations[`${languageCode}Subtitle`].benefits.items)
                : content.languageBenefits?.benefits || []
              ).map((benefit: any, index: number) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-lg">
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Language Stats Section */}
      {content.languageStats && (
        <div className="language-stats py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{content.languageStats.title}</h2>
              <p className="text-xl text-gray-600">{content.languageStats.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {content.languageStats.stats?.map((stat: any, index: number) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 shadow-lg text-center">
                  <div className="text-4xl mb-4">{stat.icon}</div>
                  <div className="text-2xl font-bold text-blue-600 mb-2">{stat.number}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{stat.title}</h3>
                  <p className="text-gray-600 text-sm">{stat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Industry Use Cases Section */}
      {content.industryUseCases && (
        <div className="industry-use-cases py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{content.industryUseCases.title}</h2>
              <p className="text-xl text-gray-600">{content.industryUseCases.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {content.industryUseCases.cases?.map((useCase: any, index: number) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="text-4xl mb-4 text-center">{useCase.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{useCase.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{useCase.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Language Learning Section */}
      {content.languageLearning && (
        <div className="language-learning py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{content.languageLearning.title}</h2>
              <p className="text-xl text-gray-600">{content.languageLearning.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {content.languageLearning.methods?.map((method: any, index: number) => (
                <div key={index} className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-8 shadow-lg">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl flex-shrink-0">{method.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{method.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{method.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content Types Section */}
      {content.contentTypes && (
        <div className="content-types py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{content.contentTypes.title}</h2>
              <p className="text-xl text-gray-600">{content.contentTypes.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {content.contentTypes.types?.map((type: any, index: number) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="text-3xl mb-4 text-center">{type.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">{type.title}</h3>
                  <p className="text-gray-600 text-sm text-center">{type.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      {(content.faq || content.common_questions) && (
        <div className="faq-section py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {content.faq?.title || "Frequently Asked Questions"}
              </h2>
              <p className="text-xl text-gray-600">
                {content.faq?.subtitle || "Common questions about Chinese subtitle translation"}
              </p>
            </div>
            <div className="space-y-6">
              {content.faq?.questions?.map((item: any, index: number) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{item.question}</h3>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              )) || 
              // Fallback to common_questions format
              Object.entries(content.common_questions || {}).map(([key, value], index: number) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
                  <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: String(value).replace(/Q: (.*?) A: (.*)/, '<h3 class="text-lg font-bold text-gray-900 mb-3">$1</h3><p>$2</p>') }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      {(translations?.[`${languageCode}Subtitle`]?.cta || content.cta) && (
        <div className="cta-section bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              {translations?.[`${languageCode}Subtitle`]?.cta?.title || content.cta?.title}
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              {translations?.[`${languageCode}Subtitle`]?.cta?.description || content.cta?.description}
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
              {translations?.[`${languageCode}Subtitle`]?.cta?.buttonText || content.cta?.button || "开始翻译"}
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      {content.footer && (
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">{content.footer.brandName}</h3>
                <p className="text-gray-300 text-sm">{content.footer.description}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Features</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  {content.footer.features?.map((feature: any, index: number) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Support</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  {content.footer.support?.map((item: any, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
              <p className="text-sm">{content.footer.copyright}</p>
            </div>
          </div>
        </footer>
      )}

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && layout && content && (
        <div className="page-debug-info fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs max-w-xs z-50">
          <div>Language: {layout.language}</div>
          <div>Sections: {layout.sections.length}</div>
          <div>Quality: {content.generation?.qualityScore}/100</div>
          <div>Generated: {new Date(content.generatedAt).toLocaleDateString()}</div>
        </div>
      )}
    </div>
  );
};

export default UniversalLanguagePage;
