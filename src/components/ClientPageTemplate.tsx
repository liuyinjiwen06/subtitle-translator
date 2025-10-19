"use client";

import SubtitleTranslator from './SubtitleTranslator';
import LanguageChanger from './LanguageChanger';
import { PageConfig } from '@/lib/pageConfig';
import Link from 'next/link';

interface ClientPageTemplateProps {
  pageConfig: any;
  translations: any;
  locale: string;
}

export default function ClientPageTemplate({ pageConfig, translations, locale }: ClientPageTemplateProps) {
  const getLocalizedPath = (path: string) => {
    // 始终返回绝对路径，包含语言前缀
    return `/${locale}${path}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Navigation Links */}
            <div className="flex items-center space-x-8">
              <Link href={getLocalizedPath('/')} className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                {translations.title || 'Subtitle Translator'}
              </Link>
              
              <div className="hidden md:flex space-x-6">
                <Link 
                  href={getLocalizedPath('/english-subtitle')} 
                  className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                  {translations.nav?.english_subtitle || 'English Subtitle'}
                </Link>
                <Link 
                  href={getLocalizedPath('/chinese-subtitle')} 
                  className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                  {translations.nav?.chinese_subtitle || 'Chinese Subtitle'}
                </Link>
              </div>
            </div>

            {/* Language Selector */}
            <div className="flex items-center">
              <LanguageChanger currentLocale={locale} />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {pageConfig?.title || translations?.englishSubtitle?.title || translations?.title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              {pageConfig?.description || translations?.englishSubtitle?.description || translations?.description}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Translator Section - 居中显示 */}
        <div className="flex justify-center mb-12">
          <div className="w-full max-w-4xl">
            <SubtitleTranslator pageConfig={pageConfig} translations={translations} />
          </div>
        </div>

        {/* Benefits and Use Cases Grid */}
        {((pageConfig.benefits && pageConfig.benefits.length > 0) || (pageConfig.useCases && pageConfig.useCases.length > 0)) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Benefits Section */}
            {pageConfig.benefits && pageConfig.benefits.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {translations.benefits?.title || 'Benefits'}
                </h2>
                <div className="space-y-4">
                  {pageConfig.benefits.map((benefit: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
                        <p className="text-gray-600 text-sm">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Use Cases */}
            {pageConfig.useCases && pageConfig.useCases.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {translations.useCases?.title || 'Use Cases'}
                </h2>
                <div className="space-y-4">
                  {pageConfig.useCases.map((useCase: any, index: number) => (
                    <div key={index} className="border-l-4 border-blue-400 pl-4">
                      <h3 className="font-semibold text-gray-900">{useCase.title}</h3>
                      <p className="text-gray-600 text-sm">{useCase.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* FAQ Section */}
        {pageConfig.faq && pageConfig.faq.length > 0 && (
          <div className="mt-16">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                {translations.faq?.title || 'Frequently Asked Questions'}
              </h2>
              <div className="space-y-6">
                {pageConfig.faq.map((item: any, index: number) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.question}</h3>
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        {pageConfig.cta && (
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl shadow-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">{pageConfig.cta.title}</h2>
            <p className="text-xl text-blue-100 mb-8">{pageConfig.cta.description}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">{translations.title || 'Subtitle Translator'}</h3>
              <p className="text-gray-300">{translations.description || 'Free online subtitle translation tool'}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">{translations.footer?.quick_links || 'Quick Links'}</h3>
              <div className="space-y-2">
                <Link href={getLocalizedPath('/')} className="block text-gray-300 hover:text-white transition-colors">
                  {translations.nav?.home || 'Home'}
                </Link>
                <Link href={getLocalizedPath('/english-subtitle')} className="block text-gray-300 hover:text-white transition-colors">
                  {translations.nav?.english_subtitle || 'English Subtitle'}
                </Link>
                <Link href={getLocalizedPath('/chinese-subtitle')} className="block text-gray-300 hover:text-white transition-colors">
                  {translations.nav?.chinese_subtitle || 'Chinese Subtitle'}
                </Link>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">{translations.footer?.languages || 'Languages'}</h3>
              <div className="text-gray-300">
                {translations.footer?.supported_languages || 'Supports 17+ languages for translation'}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 {translations.title || 'Subtitle Translator'}. {translations.footer?.rights || 'All rights reserved.'}</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 