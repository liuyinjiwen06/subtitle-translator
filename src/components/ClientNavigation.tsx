"use client";

import Link from 'next/link';
import LanguageChanger from './LanguageChanger';

interface ClientNavigationProps {
  locale: string;
  translations: {
    title: string;
    englishButton: string;
    chineseButton: string;
    frenchButton: string;
  };
}

export default function ClientNavigation({ locale, translations }: ClientNavigationProps) {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link 
              href={locale === 'en' ? '/' : `/${locale}`} 
              className="text-xl font-bold text-gray-900 hover:text-red-600 transition-colors"
            >
              {translations.title}
            </Link>
            
            <div className="hidden md:flex space-x-6">
              <Link 
                href={locale === 'en' ? '/english-subtitle' : `/${locale}/english-subtitle`}
                className="text-gray-600 hover:text-red-600 transition-colors font-medium"
              >
                {translations.englishButton}
              </Link>
              <Link 
                href={locale === 'en' ? '/chinese-subtitle' : `/${locale}/chinese-subtitle`}
                className="text-gray-600 hover:text-red-600 transition-colors font-medium"
              >
                {translations.chineseButton}
              </Link>
              <Link 
                href={locale === 'en' ? '/french-subtitle' : `/${locale}/french-subtitle`}
                className="text-gray-600 hover:text-red-600 transition-colors font-medium"
              >
                {translations.frenchButton}
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
  );
} 