"use client";

import { useTranslation } from 'react-i18next';
import { PageConfig } from '@/lib/pageConfig';
import SubtitleTranslator from './SubtitleTranslator';
import { useEffect } from 'react';
import Link from 'next/link';

interface PageTemplateProps {
  pageConfig: PageConfig;
  className?: string;
}

interface PageData {
  title?: string;
  benefits?: {
    title?: string;
    subtitle?: string;
    items?: Record<string, {
      icon: string;
      title: string;
      description: string;
    }>;
  };
  useCases?: {
    title?: string;
    items?: Record<string, {
      icon: string;
      title: string;
      description: string;
    }>;
  };
  [key: string]: unknown;
}

interface BenefitItem {
  icon: string;
  title: string;
  description: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

export default function PageTemplate({ pageConfig, className = "" }: PageTemplateProps) {
  const { t, i18n } = useTranslation();

  // 动态更新页面标题
  useEffect(() => {
    try {
      const pageData = t(`pages.${pageConfig.pageKey}`, { returnObjects: true }) as PageData;
      if (pageData?.title) {
        document.title = pageData.title;
      }
    } catch (error) {
      console.error('Failed to set page title:', error);
    }
  }, [pageConfig.pageKey, t, i18n.language]);

  const getPageData = (key: string) => {
    try {
      const pageData = t(`pages.${pageConfig.pageKey}`, { returnObjects: true }) as PageData;
      return pageData?.[key] || '';
    } catch {
      return '';
    }
  };

  const getBenefitsData = () => {
    try {
      const pageData = t(`pages.${pageConfig.pageKey}`, { returnObjects: true }) as PageData;
      return pageData?.benefits || {};
    } catch {
      return {};
    }
  };

  const getUseCasesData = () => {
    try {
      const pageData = t(`pages.${pageConfig.pageKey}`, { returnObjects: true }) as PageData;
      return pageData?.useCases || {};
    } catch {
      return {};
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const benefits = getBenefitsData();
  const useCases = getUseCasesData();

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 ${className}`}>
      {/* 语言切换器 - 右上角 */}
      <div className="fixed top-6 right-6 z-50">
        <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-2 shadow-lg">
          <span className="text-sm text-gray-600">🌐</span>
          <select
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer"
          >
            <option value="zh">中文</option>
            <option value="en">English</option>
            <option value="ja">日本語</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="es">Español</option>
            <option value="ru">Русский</option>
            <option value="it">Italiano</option>
          </select>
        </div>
      </div>

      {/* Hero区域 */}
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 面包屑导航 */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  {t('title')}
                </Link>
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-900 font-medium">
                  {getPageData('heroTitle')}
                </span>
              </li>
            </ol>
          </nav>

          {/* 页面标题和描述 */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {getPageData('heroTitle')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {getPageData('heroSubtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* 翻译器组件 */}
      <div className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SubtitleTranslator pageConfig={pageConfig} />
        </div>
      </div>

      {/* 页面特定优势 */}
      {benefits?.title && (
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {benefits.title}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {benefits.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits?.items && Object.entries(benefits.items).map(([key, item]: [string, BenefitItem]) => (
                <div key={key} className="text-center p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 页面特定应用场景 */}
      {useCases?.title && (
        <div className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {useCases.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {useCases?.items && Object.entries(useCases.items).map(([key, item]: [string, BenefitItem]) => (
                <div key={key} className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 通用优势 - 复用主页面的内容 */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('benefits.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('benefits.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(t('benefits.items', { returnObjects: true }) as Record<string, BenefitItem>).map(([key, item]: [string, BenefitItem]) => (
              <div key={key} className="p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('faq.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('faq.subtitle')}
            </p>
          </div>

          <div className="space-y-6">
            {Object.entries(t('faq.items', { returnObjects: true }) as Record<string, FAQItem>).map(([key, item]: [string, FAQItem]) => (
              <div key={key} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {item.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#translator"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
            >
              {t('cta.startButton')}
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-colors"
            >
              {t('cta.learnMore')}
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">
              {t('footer.title')}
            </h3>
            <p className="text-gray-300 mb-8 max-w-3xl mx-auto">
              {t('footer.description')}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">8+</div>
                <div className="text-gray-300">{t('footer.stats.languages')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">100%</div>
                <div className="text-gray-300">{t('footer.stats.free')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{t('footer.stats.speedValue')}</div>
                <div className="text-gray-300">{t('footer.stats.speed')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">AI</div>
                <div className="text-gray-300">智能翻译</div>
              </div>
            </div>

            <div className="text-center">
              <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors">
                ← {t('back_to_home')}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 