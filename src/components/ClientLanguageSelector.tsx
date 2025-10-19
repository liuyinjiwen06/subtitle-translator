"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';
import '../lib/i18n'; // 确保 i18n 被初始化

const languages = [
  { code: "en", flag: "🇺🇸" },
  { code: "zh", flag: "🇨🇳" },
  { code: "ja", flag: "🇯🇵" },
  { code: "fr", flag: "🇫🇷" },
  { code: "de", flag: "🇩🇪" },
  { code: "es", flag: "🇪🇸" },
  { code: "ru", flag: "🇷🇺" },
  { code: "it", flag: "🇮🇹" },
];

export default function ClientLanguageSelector() {
  const { t, i18n, ready } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  // 在组件未挂载或i18n未准备好时显示占位符
  if (!mounted || !ready || !i18n.isInitialized) {
    return (
      <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-2 shadow-lg">
        <span className="text-sm text-gray-600">🌐</span>
        <span className="text-sm font-medium text-gray-700">Language</span>
      </div>
    );
  }

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center space-x-3 bg-gradient-to-r from-white via-gray-50 to-white border-2 border-gray-200 rounded-2xl px-5 py-3 text-sm font-semibold text-gray-700 hover:border-blue-300 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300 min-w-[160px] backdrop-blur-sm"
      >
        <div className="flex items-center space-x-2">
          <span className="text-xl drop-shadow-sm">{currentLanguage.flag}</span>
          <span className="text-gray-800 group-hover:text-blue-700 transition-colors duration-200">
            {t(`languages.${currentLanguage.code}`)}
          </span>
        </div>
        <svg 
          className={`w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-all duration-300 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-3 w-56 bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl shadow-2xl z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t('select_interface_language') || 'Select Interface Language'}</p>
          </div>
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-200 ${
                  lang.code === i18n.language ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className={`font-medium ${
                  lang.code === i18n.language ? 'text-blue-700' : 'text-gray-700'
                }`}>
                  {t(`languages.${lang.code}`)}
                </span>
                {lang.code === i18n.language && (
                  <svg className="w-4 h-4 text-blue-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 