"use client";

import React, { useState, useRef, useEffect } from 'react';
import { PageConfig } from '@/lib/pageConfig';

const languages = [
  { code: "en", flag: "🇺🇸" },
  { code: "zh", flag: "🇨🇳" },
  { code: "ja", flag: "🇯🇵" },
  { code: "fr", flag: "🇫🇷" },
  { code: "de", flag: "🇩🇪" },
  { code: "es", flag: "🇪🇸" },
  { code: "ru", flag: "🇷🇺" },
  { code: "it", flag: "🇮🇹" },
  { code: "pt", flag: "🇵🇹" },
  { code: "ar", flag: "🇸🇦" },
  { code: "hi", flag: "🇮🇳" },
  { code: "ko", flag: "🇰🇷" },
  { code: "th", flag: "🇹🇭" },
  { code: "vi", flag: "🇻🇳" },
  { code: "tr", flag: "🇹🇷" },
  { code: "pl", flag: "🇵🇱" },
  { code: "nl", flag: "🇳🇱" },
  { code: "sv", flag: "🇸🇪" },
  { code: "da", flag: "🇩🇰" },
  { code: "no", flag: "🇳🇴" },
  { code: "fi", flag: "🇫🇮" },
  { code: "cs", flag: "🇨🇿" },
  { code: "hu", flag: "🇭🇺" },
  { code: "ro", flag: "🇷🇴" },
  { code: "bg", flag: "🇧🇬" },
  { code: "hr", flag: "🇭🇷" },
  { code: "sk", flag: "🇸🇰" },
  { code: "sl", flag: "🇸🇮" },
  { code: "et", flag: "🇪🇪" },
  { code: "lv", flag: "🇱🇻" },
  { code: "lt", flag: "🇱🇹" },
];

// 翻译服务选择器组件
function TranslationServiceSelector({ 
  currentService, 
  onServiceChange, 
  t 
}: { 
  currentService: string, 
  onServiceChange: (service: string) => void,
  t: (key: string) => string
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const services = [
    {
      value: 'google',
      icon: '🌐',
      name: 'Google Cloud',
      label: t('translation_services.google'),
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
      hoverColor: 'hover:bg-blue-100'
    },
    {
      value: 'openai',
      icon: '🤖',
      name: 'OpenAI GPT',
      label: t('translation_services.openai'),
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200',
      hoverColor: 'hover:bg-purple-100'
    }
  ];

  const currentServiceData = services.find(s => s.value === currentService) || services[0];

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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-4 bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 hover:border-gray-300 transition-all duration-300 ${currentServiceData.hoverColor}`}
      >
        <div className="flex items-center space-x-3">
          <span className="text-xl">{currentServiceData.icon}</span>
          <div className="text-left">
            <div className="font-semibold text-gray-800">{currentServiceData.name}</div>
            <div className="text-sm text-gray-500">{currentServiceData.label}</div>
          </div>
        </div>
        <svg 
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {services.map((service) => (
            <button
              key={service.value}
              onClick={() => {
                onServiceChange(service.value);
                setIsOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                service.value === currentService ? `${service.bgColor} ${service.borderColor} border-l-4` : ''
              }`}
            >
              <span className="text-xl flex-shrink-0">{service.icon}</span>
              <div className="flex-1 min-w-0">
                <div className={`font-semibold ${service.value === currentService ? service.textColor : 'text-gray-800'}`}>
                  {service.name} - {service.label}
                </div>
              </div>
              {service.value === currentService && (
                <svg className={`w-5 h-5 ${service.textColor} flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// 目标语言选择器组件
function TargetLanguageSelector({ 
  currentLang, 
  onLanguageChange, 
  t
}: { 
  currentLang: string, 
  onLanguageChange: (lang: string) => void, 
  t: (key: string) => string
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getLanguageName = (langCode: string) => {
    try {
      const name = t(`languages.${langCode}`);
      return name !== `languages.${langCode}` ? name : langCode.toUpperCase();
    } catch {
      return langCode.toUpperCase();
    }
  };

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

  const handleLanguageSelect = (langCode: string) => {
    onLanguageChange(langCode);
    setIsOpen(false);
  };

  const currentLanguage = languages.find(lang => lang.code === currentLang);
  const displayLanguage = currentLanguage || { code: currentLang, flag: "🌐" };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 hover:border-gray-300 transition-all duration-300"
      >
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{displayLanguage.flag}</span>
          <div className="text-left">
            <div className="font-semibold text-gray-800">
              {getLanguageName(currentLang)}
            </div>
          </div>
        </div>
        <svg 
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-2 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors ${
                lang.code === currentLang ? 'bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-400' : 'text-gray-700'
              }`}
            >
              <span className="text-xl flex-shrink-0">{lang.flag}</span>
              <div className="flex-1 min-w-0">
                <span className="truncate">{getLanguageName(lang.code)}</span>
              </div>
              {lang.code === currentLang && (
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// 主要的字幕翻译器组件
interface SubtitleTranslatorProps {
  pageConfig?: PageConfig;
  className?: string;
  translations?: any;
}

export default function SubtitleTranslator({ pageConfig, className = "", translations }: SubtitleTranslatorProps) {
  // 创建一个简单的翻译函数
  const t = (key: string): string => {
    if (!translations) return key;
    
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // 状态管理
  const [file, setFile] = useState<File | null>(null);
  const [targetLanguage, setTargetLanguage] = useState(pageConfig?.targetLanguage || "en");
  const [translationService, setTranslationService] = useState("google");
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(0);
  const [translatedContent, setTranslatedContent] = useState<string>("");
  const [translationError, setTranslationError] = useState<string>("");

  // 文件上传处理
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.name.endsWith('.srt')) {
      setFile(selectedFile);
      resetTranslationState();
    } else {
      alert(t('please_select_srt_file'));
    }
  };

  // 重置翻译状态
  const resetTranslationState = () => {
    setTranslatedContent("");
    setTranslationError("");
    setTranslationProgress(0);
    setIsTranslating(false);
  };

  // 翻译处理
  const handleTranslate = async () => {
    if (!file) {
      alert(t('please_upload_file_first'));
      return;
    }

    setIsTranslating(true);
    setTranslationError("");
    setTranslationProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('targetLang', targetLanguage);
    formData.append('translationService', translationService);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`${t('translation_failed')}: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error(t('cannot_read_response'));
      }

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'progress') {
                setTranslationProgress(data.progress);
              } else if (data.type === 'complete') {
                setTranslatedContent(data.result);
                setTranslationProgress(100);
                setIsTranslating(false);
                return;
              } else if (data.type === 'error') {
                throw new Error(data.message);
              }
            } catch (parseError) {
              // 忽略JSON解析错误，继续处理
              console.warn('Failed to parse SSE data:', line);
            }
          }
        }
      }
    } catch (error) {
      console.error('翻译错误:', error);
      setTranslationError(error instanceof Error ? error.message : t('translation_error_occurred'));
      setIsTranslating(false);
    }
  };

  // 下载翻译结果
  const handleDownload = () => {
    if (!translatedContent) return;

    const blob = new Blob([translatedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const originalName = file?.name.replace('.srt', '') || 'translated';
    const targetLangName = languages.find(l => l.code === targetLanguage)?.code || targetLanguage;
    a.href = url;
    a.download = `${originalName}_${targetLangName}.srt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 在组件未挂载或translations未准备好时显示加载状态
  if (!mounted || !translations) {
    return (
      <div className={`w-full p-6 bg-white rounded-2xl shadow-lg ${className}`}>
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full p-6 bg-white rounded-2xl shadow-lg ${className}`}>
      <div className="space-y-8">
        {/* 文件上传区 */}
        <div className="space-y-4">
          <label className="block">
            <div className="relative">
              <input
                type="file"
                accept=".srt"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`w-full p-8 border-3 border-dashed rounded-xl text-center transition-all duration-300 ${
                file 
                  ? 'border-green-400 bg-green-50' 
                  : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
              }`}>
                <div className="flex flex-col items-center space-y-4">
                  <div className="text-4xl">
                    {file ? '✅' : '📁'}
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-800">
                      {file ? file.name : t('upload')}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {file ? t('file_selected_click_to_reselect') : t('click_or_drag_to_upload')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </label>
        </div>

        {/* 翻译设置 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 目标语言选择 */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {t('select_language')}
            </label>
            <TargetLanguageSelector
              currentLang={targetLanguage}
              onLanguageChange={setTargetLanguage}
              t={t}
            />
          </div>

          {/* 翻译服务选择 */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {t('select_translation_service')}
            </label>
            <TranslationServiceSelector
              currentService={translationService}
              onServiceChange={(service) => setTranslationService(service as "google" | "openai")}
              t={t}
            />
          </div>
        </div>

        {/* 翻译按钮 */}
        <div className="text-center">
          <button
            onClick={handleTranslate}
            disabled={!file || isTranslating}
            className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform ${
              !file || isTranslating
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl'
            }`}
          >
            {isTranslating ? (
              <div className="flex items-center space-x-2">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{t('translating')} {translationProgress}%</span>
              </div>
            ) : (
              t('translate')
            )}
          </button>
        </div>

        {/* 翻译进度 */}
        {isTranslating && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{t('translation_progress')}</span>
              <span>{translationProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${translationProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* 错误显示 */}
        {translationError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center space-x-2">
              <span className="text-red-500">❌</span>
              <span className="text-red-700 font-medium">{t('translation_failed')}</span>
            </div>
            <p className="text-red-600 mt-2">{translationError}</p>
          </div>
        )}

        {/* 翻译完成 */}
        {translatedContent && !isTranslating && (
          <div className="space-y-4">
            <div className="p-6 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-green-500 text-2xl">🎉</span>
                  <span className="text-green-700 font-semibold text-lg">{t('translation_complete')}</span>
                </div>
                <button
                  onClick={handleDownload}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  {t('download')}
                </button>
              </div>
            </div>
            
            <div className="text-center">
              <button
                onClick={resetTranslationState}
                className="px-6 py-2 text-blue-600 hover:text-blue-700 underline"
              >
                {t('translate_again')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 