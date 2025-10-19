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
    // 添加详细的调试信息
    console.log(`🔍 UniversalLanguagePage useEffect triggered`);
    console.log(`🔍 languageCode: "${languageCode}"`);
    console.log(`🔍 locale: "${locale}"`);
    console.log(`🔍 translations exists: ${!!translations}`);
    console.log(`🔍 translations keys:`, translations ? Object.keys(translations) : 'N/A');
    
    // 尝试多种 key 格式
    const possibleKeys = [
      `new${languageCode}subtitle`,  // 新格式：newchinesesubtitle
      `${languageCode}Subtitle`,     // 原格式：englishSubtitle
      `${languageCode}subtitle`      // 小写格式：englishsubtitle
    ];
    
    console.log(`🔍 Trying keys:`, possibleKeys);
    
    let pageData = null;
    let foundKey = null;
    
    // 查找可用的数据
    for (const key of possibleKeys) {
      if (translations && translations[key]) {
        pageData = translations[key];
        foundKey = key;
        console.log(`✅ Found data with key: "${key}"`);
        break;
      }
    }
    
    if (!pageData) {
      console.log(`❌ No data found for any key. Available keys:`, translations ? Object.keys(translations) : 'N/A');
    }
    
    // 如果有服务器端翻译数据，优先使用它们
    if (pageData) {
      console.log(`✅ Using server-side translations for ${languageCode} with key: ${foundKey}`);
      console.log(`🔍 Page data structure:`, Object.keys(pageData));
      
      // 根据数据结构适配不同的字段
      const seoData = pageData.seo || {};
      const heroData = pageData.hero || {};
      const benefitsData = pageData.languageBenefits || pageData.benefits || {};
      const useCasesData = pageData.industryUseCases || pageData.useCases || {};
      const statsData = pageData.languageStats || {};
      const learningData = pageData.languageLearning || {};
      const ctaData = pageData.cta || {};
      const footerData = pageData.footer || {};
      
      // 构建布局数据
      const mockLayout: LayoutData = {
        language: languageCode,
        languageName: heroData.title || pageData.title || `${languageCode} Subtitle`,
        title: seoData.title || pageData.title || `${languageCode} Subtitle Translator`,
        description: seoData.description || pageData.description || `Professional ${languageCode} subtitle translator`,
        sections: [],
        metadata: seoData
      };

      // 构建内容数据
      const mockContent: ContentData = {
        language: {
          code: languageCode,
          name: heroData.title || pageData.title || languageCode
        },
        seo: seoData,
        hero: heroData,
        languageBenefits: benefitsData,
        languageStats: statsData,
        contentTypes: pageData.contentTypes,
        faq: pageData.faq,
        common_questions: pageData.faq,
        cta: ctaData,
        footer: footerData,
        industryUseCases: useCasesData,
        languageLearning: learningData
      };

      console.log(`🔍 Built content structure:`, {
        seo: !!mockContent.seo,
        hero: !!mockContent.hero,
        benefits: !!mockContent.languageBenefits,
        useCases: !!mockContent.industryUseCases,
        stats: !!mockContent.languageStats,
        learning: !!mockContent.languageLearning
      });

      setLayout(mockLayout);
      setContent(mockContent);
      setLoading(false);
      return;
    }

    // 如果没有服务器端数据，尝试加载JSON文件
    console.log(`🔄 No i18n data found, falling back to JSON files for ${languageCode}`);
    loadLanguagePageData(languageCode);
  }, [languageCode, locale, translations]);

  const loadLanguagePageData = async (langCode: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔄 Loading ${langCode} page data from JSON files...`);
      
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

      console.log(`✅ Loaded ${langCode} page from JSON:`, {
        sections: layoutData.sections.length,
        title: layoutData.title
      });

      setLayout(layoutData);
      setContent(contentData);
      
    } catch (err) {
      console.error(`❌ Failed to load ${langCode} page:`, err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      
      // 如果JSON加载失败，使用基础的fallback数据
      if (translations) {
        console.log(`🔄 Using fallback data for ${langCode}`);
        const fallbackLayout: LayoutData = {
          language: languageCode,
          languageName: `${languageCode} Subtitle`,
          title: `${languageCode} Subtitle Translator`,
          description: `Professional ${languageCode} subtitle translator`,
          sections: [],
          metadata: {}
        };

        const fallbackContent: ContentData = {
          language: {
            code: languageCode,
            name: languageCode.charAt(0).toUpperCase() + languageCode.slice(1)
          },
          seo: {},
          hero: {
            title: `${languageCode.charAt(0).toUpperCase() + languageCode.slice(1)} Subtitle Translator`,
            description: `Professional ${languageCode} subtitle translation service`,
            flag: getLanguageFlag(languageCode)
          },
          languageBenefits: {
            title: "Why Choose Our Translator?",
            subtitle: "Professional, fast, and accurate translation service",
            benefits: []
          },
          cta: {
            title: "Start Translating Now",
            description: "Upload your subtitle file and get started"
          },
          footer: {}
        };

        setLayout(fallbackLayout);
        setContent(fallbackContent);
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const getLanguageFlag = (langCode: string): string => {
    const flags: Record<string, string> = {
      'english': '🇺🇸',
      'chinese': '🇨🇳',
      'spanish': '🇪🇸',
      'french': '🇫🇷',
      'portuguese': '🇵🇹',
      'german': '🇩🇪',
      'italian': '🇮🇹',
      'japanese': '🇯🇵',
      'korean': '🇰🇷',
      'russian': '🇷🇺'
    };
    return flags[langCode] || '🌐';
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
            {translations?.loading || `Loading ${languageCode} page...`}
          </p>
        </div>
      </div>
    );
  }

  if (error && !content) {
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
                {translations?.title || 'Subtitle Translator'}
              </Link>
            </div>

            <div className="flex items-center">
              <LanguageChanger currentLocale={locale} />
            </div>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      {content.hero && (
        <div className="hero-section bg-gradient-to-r from-blue-600 to-purple-700 text-white py-24">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="text-6xl mb-4">
              {content.hero.flag}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-relaxed">
              {content.hero.title}
            </h1>
            <p className="text-sm md:text-sm text-blue-100 max-w-3xl mx-auto">
              {content.hero.description}
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
                  title: content.hero?.title || `${content.language?.name || languageCode} Subtitle Translator`,
                  upload: translations?.upload || "Upload SRT File",
                  select_language: translations?.select_language || "Target Language",
                  translate: translations?.translate || `Translate to ${content.language?.name || languageCode}`,
                  translating: translations?.translating || "Translating...",
                  download: translations?.download || "Download Translated File",
                  please_select_srt_file: translations?.please_select_srt_file || "Please select an .srt subtitle file",
                  please_upload_file_first: translations?.please_upload_file_first || "Please upload a subtitle file first",
                  translation_failed: translations?.translation_failed || "Translation Failed",
                  cannot_read_response: translations?.cannot_read_response || "Cannot read response stream",
                  translation_error_occurred: translations?.translation_error_occurred || "An error occurred during translation",
                  file_selected_click_to_reselect: translations?.file_selected_click_to_reselect || "File selected, click to reselect",
                  click_or_drag_to_upload: translations?.click_or_drag_to_upload || "Click or drag to upload SRT subtitle file",
                  select_translation_service: translations?.select_translation_service || "Select Translation Service",
                  translation_services: translations?.translation_services || {
                    google: "Google Translate",
                    openai: "OpenAI Translation"
                  },
                  search_languages: translations?.search_languages || "Search languages...",
                  no_matching_languages: translations?.no_matching_languages || "No matching languages found",
                  languages: translations?.languages || {
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
      {content.languageBenefits && (
        <div className="language-benefits py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {content.languageBenefits.title}
              </h2>
              <p className="text-xl text-gray-600">
                {content.languageBenefits.subtitle}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(content.languageBenefits.benefits || content.languageBenefits.items ? 
                Object.values(content.languageBenefits.items || content.languageBenefits.benefits || {}) :
                []
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
                <div key={index} className="bg-white rounded-lg p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
                  <div className="text-3xl mb-3">{type.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{type.title}</h3>
                  <p className="text-gray-600 text-sm">{type.description}</p>
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
                {content.faq?.title || content.common_questions?.title || "Frequently Asked Questions"}
              </h2>
              <p className="text-xl text-gray-600">
                {content.faq?.subtitle || content.common_questions?.subtitle || ""}
              </p>
            </div>
            <div className="space-y-6">
              {((content.faq?.items || content.common_questions?.items) ? 
                Object.values(content.faq?.items || content.common_questions?.items || {}) :
                []
              ).map((faqItem: any, index: number) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{faqItem.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faqItem.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      {content.cta && (
        <div className="cta-section py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.cta.title}</h2>
            <p className="text-xl text-blue-100 mb-8">{content.cta.description}</p>
            <button 
              onClick={() => document.querySelector('.translator-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              {content.cta.button || translations?.cta?.startButton || "Start Translating"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversalLanguagePage;
