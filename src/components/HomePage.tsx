"use client";

import SubtitleTranslator from './SubtitleTranslator';
import LanguageChanger from './LanguageChanger';
import UnifiedFooter from './UnifiedFooter';
import Link from 'next/link';

interface HomePageProps {
  pageConfig: any;
  translations: any;
  locale: string;
}

export default function HomePage({ pageConfig, translations, locale }: HomePageProps) {
  const getLocalizedPath = (path: string) => {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `/${locale}/${cleanPath}`;
  };

  const hp = translations.homepage || {};

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - 保持原有导航栏 */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href={`/${locale}`} className="text-xl font-bold text-blue-600">
                SubTran
              </Link>
            </div>
            <div className="flex items-center">
              <LanguageChanger currentLocale={locale} />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-100 via-blue-50 to-blue-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              {hp.hero?.headline || "Translate SRT Subtitle Files Instantly"}
            </h1>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {hp.hero?.subheadline || "Professional subtitle translator supporting 30+ languages"}
            </p>
          </div>
        </div>
      </section>

      {/* Translator Functionality Section - 保持原有功能区 */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <SubtitleTranslator 
                pageConfig={pageConfig}
                translations={translations}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Key Features 
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {hp.keyFeatures?.title || "✨ Why Choose SubTran"}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {(hp.keyFeatures?.items || []).map((feature: string, index: number) => (
              <div key={index} className="flex items-center space-x-3 bg-blue-50 rounded-lg p-4">
                <div className="text-2xl">{feature.split(' ')[0]}</div>
                <span className="font-medium text-gray-800">{feature.substring(feature.indexOf(' ') + 1)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>*/}

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {hp.howItWorks?.title || "How It Works"}
            </h2>
            <p className="text-xl text-gray-600">
              {hp.howItWorks?.subtitle || "Simple 4-step process"}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(hp.howItWorks?.steps || {}).map(([key, step]: [string, any], index) => (
              <div key={key} className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {index + 1}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Why Choose SubTran */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {hp.whyChoose?.title || "🚀 Why Choose SubTran"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {hp.whyChoose?.subtitle || "Transform your subtitle translation experience"}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(hp.whyChoose?.items || {}).map(([key, item]: [string, any]) => (
              <div key={key} className="text-center">
                <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Languages */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {hp.supportedLanguages?.title || "Supported Languages"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              {hp.supportedLanguages?.subtitle || "Connect with global audiences"}
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <p className="text-center text-gray-700 leading-relaxed">
              {hp.supportedLanguages?.description || "31 languages supported"}
            </p>
          </div>
        </div>
      </section>

      {/* Language Selection Buttons - 保持原有语言按钮 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {translations.specializedTools?.title || "Professional Subtitle Translation Tools"}
            </h2>
            <p className="text-xl text-gray-600">
              {translations.specializedTools?.subtitle || "Specialized translation services for different languages"}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { code: 'en', name: 'english', color: 'blue' },
              { code: 'zh', name: 'chinese', color: 'red' },
              { code: 'es', name: 'spanish', color: 'yellow' },
              { code: 'fr', name: 'french', color: 'blue' },
              { code: 'pt', name: 'portuguese', color: 'green' }
            ].map((lang) => (
              <Link 
                key={lang.code}
                href={`/${locale}/${lang.name}-subtitle`}
                className={`bg-white hover:bg-${lang.color}-50 rounded-xl shadow-md hover:shadow-lg transition-all p-4 text-center`}
              >
                <div className="text-gray-900 font-medium">
                  {translations.specializedTools?.languageButtons?.[lang.name] || lang.name.charAt(0).toUpperCase() + lang.name.slice(1)}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {hp.useCases?.title || "Perfect for These Use Cases"}
            </h2>
            <p className="text-xl text-gray-600">
              {hp.useCases?.subtitle || "Discover how SubTran serves various industries"}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(hp.useCases?.items || {}).map(([key, useCase]: [string, any]) => (
              <div key={key} className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{useCase.title}</h3>
                <p className="text-gray-600">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engine Comparison */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {hp.engineComparison?.title || "Translation Engine Comparison"}
            </h2>
            <p className="text-xl text-gray-600">
              {hp.engineComparison?.subtitle || "Choose the right engine for your needs"}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Google Translate */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {hp.engineComparison?.google?.title || "Google Translate Engine"}
              </h3>
              <div className="space-y-4">
                <div>
                  <span className="font-semibold text-gray-700">Best for: </span>
                  <span className="text-gray-600">{hp.engineComparison?.google?.bestFor}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Strengths: </span>
                  <span className="text-gray-600">{hp.engineComparison?.google?.strengths}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Ideal when: </span>
                  <span className="text-gray-600">{hp.engineComparison?.google?.idealWhen}</span>
                </div>
              </div>
            </div>
            
            {/* OpenAI */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {hp.engineComparison?.openai?.title || "OpenAI Translation Engine"}
              </h3>
              <div className="space-y-4">
                <div>
                  <span className="font-semibold text-gray-700">Best for: </span>
                  <span className="text-gray-600">{hp.engineComparison?.openai?.bestFor}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Strengths: </span>
                  <span className="text-gray-600">{hp.engineComparison?.openai?.strengths}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Ideal when: </span>
                  <span className="text-gray-600">{hp.engineComparison?.openai?.idealWhen}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600 max-w-4xl mx-auto">
              {hp.engineComparison?.note}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {hp.faq?.title || "Frequently Asked Questions"}
            </h2>
            <p className="text-xl text-gray-600">
              {hp.faq?.subtitle || "Get answers to common questions"}
            </p>
          </div>
          
          <div className="space-y-6">
            {Object.entries(hp.faq?.items || {}).map(([key, faq]: [string, any]) => (
              <div key={key} className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - 保持统一的Footer */}
      <UnifiedFooter translations={translations} />
    </div>
  );
}