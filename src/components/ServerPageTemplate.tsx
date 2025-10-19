'use client';

import { PageConfig } from '@/lib/pageConfig';
import SubtitleTranslator from './SubtitleTranslator';
import ClientLanguageSelector from './ClientLanguageSelector';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import '../lib/i18n';

interface ServerPageTemplateProps {
  pageConfig: PageConfig;
  className?: string;
}

export default function ServerPageTemplate({ pageConfig, className = "" }: ServerPageTemplateProps) {
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && i18n.isInitialized) {
      setReady(true);
    }
  }, [mounted, i18n.isInitialized]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 ${className}`}>
      {/* 语言切换器 */}
      <div className="fixed top-6 right-6 z-50">
        <ClientLanguageSelector />
      </div>

      {/* Hero区域 */}
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 面包屑导航 */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  {t('pageTemplate.breadcrumb.home')}
                </Link>
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-900 font-medium">
                  {t(`pageTemplate.breadcrumb.${pageConfig.pageKey}`)}
                </span>
              </li>
            </ol>
          </nav>

          {/* 页面标题和描述 */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {t(`pageTemplate.hero.${pageConfig.pageKey}.title`)}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {t(`pageTemplate.hero.${pageConfig.pageKey}.subtitle`)}
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

      {/* 静态优势展示 */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t(`pageTemplate.benefits.${pageConfig.pageKey}.title`)}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t(`pageTemplate.benefits.${pageConfig.pageKey}.subtitle`)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['accuracy', 'speed', 'free'].map((key) => (
              <div key={key} className="text-center p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm">
                <div className="text-4xl mb-4">
                  {t(`pageTemplate.benefits.${pageConfig.pageKey}.items.${key}.icon`)}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {t(`pageTemplate.benefits.${pageConfig.pageKey}.items.${key}.title`)}
                </h3>
                <p className="text-gray-600">
                  {t(`pageTemplate.benefits.${pageConfig.pageKey}.items.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 