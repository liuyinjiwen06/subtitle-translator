"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { i18nConfig } from '../../i18nConfig';

const languageNames = {
  en: 'English',
  zh: '中文',
  ja: '日本語',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  ru: 'Русский',
  it: 'Italiano',
  pt: 'Português',
  ar: 'العربية',
  hi: 'हिन्दी',
  ko: '한국어',
  th: 'ไทย',
  vi: 'Tiếng Việt',
  tr: 'Türkçe',
  pl: 'Polski',
  nl: 'Nederlands',
  sv: 'Svenska'
};

const languageFlags = {
  en: '🇺🇸',
  zh: '🇨🇳',
  ja: '🇯🇵',
  fr: '🇫🇷',
  de: '🇩🇪',
  es: '🇪🇸',
  ru: '🇷🇺',
  it: '🇮🇹',
  pt: '🇵🇹',
  ar: '🇸🇦',
  hi: '🇮🇳',
  ko: '🇰🇷',
  th: '🇹🇭',
  vi: '🇻🇳',
  tr: '🇹🇷',
  pl: '🇵🇱',
  nl: '🇳🇱',
  sv: '🇸🇪'
};

interface LanguageChangerProps {
  currentLocale: string;
}

export default function LanguageChanger({ currentLocale }: LanguageChangerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // 确保currentLocale是有效的语言代码
  const validLocale = i18nConfig.locales.includes(currentLocale as any) ? currentLocale : 'en';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (newLocale: string) => {
    setIsOpen(false);
    
    // 获取当前路径，移除语言前缀
    let currentPath = pathname;
    
    // 如果当前路径包含语言前缀，移除它
    for (const locale of i18nConfig.locales) {
      if (currentPath.startsWith(`/${locale}/`)) {
        currentPath = currentPath.replace(`/${locale}`, '');
        break;
      } else if (currentPath === `/${locale}`) {
        currentPath = '/';
        break;
      }
    }
    
    // 确保路径以/开头
    if (!currentPath.startsWith('/')) {
      currentPath = '/' + currentPath;
    }
    
    // 构建新路径
    let newPath;
    if (newLocale === 'en') {
      // 英语使用根路径（无前缀）
      newPath = currentPath;
    } else {
      // 其他语言添加前缀
      newPath = `/${newLocale}${currentPath}`;
    }
    
    router.push(newPath);
  };

  const currentLanguage = {
    code: validLocale,
    name: languageNames[validLocale as keyof typeof languageNames] || validLocale,
    flag: languageFlags[validLocale as keyof typeof languageFlags] || '🌐'
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
      >
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="font-medium text-gray-700">{currentLanguage.name}</span>
        <svg 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
          {i18nConfig.locales.map((locale) => {
            const language = {
              code: locale,
              name: languageNames[locale as keyof typeof languageNames] || locale,
              flag: languageFlags[locale as keyof typeof languageFlags] || '🌐'
            };

            return (
              <button
                key={locale}
                onClick={() => handleLanguageChange(locale)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                  locale === validLocale ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <span className="text-lg flex-shrink-0">{language.flag}</span>
                <span className={`font-medium ${
                  locale === validLocale ? 'text-blue-700' : 'text-gray-700'
                }`}>
                  {language.name}
                </span>
                {locale === validLocale && (
                  <svg className="w-4 h-4 text-blue-600 ml-auto flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
} 