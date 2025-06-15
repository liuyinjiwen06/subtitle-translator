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

// 界面语言选择器组件 - 美观版本
function LanguageSelector({ currentLang, onLanguageChange, t }: { currentLang: string, onLanguageChange: (lang: string) => void, t: (key: string) => string }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0];

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
                onClick={() => {
                  onLanguageChange(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-4 px-4 py-3 text-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group ${
                  lang.code === currentLang 
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-r-4 border-blue-400' 
                    : 'text-gray-700'
                }`}
              >
                <span className="text-lg drop-shadow-sm group-hover:scale-110 transition-transform duration-200">
                  {lang.flag}
                </span>
                <div className="flex-1 text-left">
                  <span className={`font-medium ${lang.code === currentLang ? 'text-blue-700' : 'text-gray-800 group-hover:text-blue-700'} transition-colors duration-200`}>
                    {t(`languages.${lang.code}`)}
                  </span>
                </div>
                {lang.code === currentLang && (
                  <div className="flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
          <div className="px-3 py-2 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">✨ {t('multilingual_interface_support') || 'Multilingual Interface Support'}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// 目标语言选择器组件
function TargetLanguageSelector({ currentLang, onLanguageChange, t }: { currentLang: string, onLanguageChange: (lang: string) => void, t: (key: string) => string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0];

  // 获取语言显示名称
  const getLanguageName = (langCode: string) => {
    return t(`languages.${langCode}`);
  };

  // 过滤语言列表
  const filteredLanguages = languages.filter(lang => {
    const langName = getLanguageName(lang.code);
    return langName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           lang.code.toLowerCase().includes(searchTerm.toLowerCase());
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
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
    setSearchTerm("");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 hover:border-gray-300 transition-all duration-300"
      >
        <div className="flex items-center space-x-3">
          <span className="text-xl">{currentLanguage.flag}</span>
          <div className="text-left">
            <div className="font-semibold text-gray-800">{getLanguageName(currentLanguage.code)}</div>
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
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* 搜索框 */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder={t('search_languages') || 'Search languages...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>
          </div>
          
          {/* 语言列表 */}
          <div className="max-h-64 overflow-y-auto py-2">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors ${
                    lang.code === currentLang ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                  }`}
                >
                  <span className="text-lg flex-shrink-0">{lang.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium ${lang.code === currentLang ? 'text-blue-700' : 'text-gray-800'}`}>
                      {getLanguageName(lang.code)}
                    </div>
                  </div>
                  {lang.code === currentLang && (
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-center text-gray-500 text-sm">
                {t('no_matching_languages') || 'No matching languages found'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const { t, i18n, ready } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [targetLang, setTargetLang] = useState('zh');
  const [translationService, setTranslationService] = useState('google');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [downloadFileName, setDownloadFileName] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  // 确保组件在客户端挂载后才渲染
  useEffect(() => {
    setMounted(true);
    if (i18n.isInitialized) {
      setTargetLang(i18n.language || 'zh');
    }
  }, [i18n.isInitialized, i18n.language]);

  useEffect(() => {
    if (i18n.isInitialized) {
      setTargetLang(i18n.language || 'zh');
    }
  }, [i18n.language, i18n.isInitialized]);

  // 监听翻译设置变化，重置翻译状态但保留文件
  useEffect(() => {
    if (file) {
      resetTranslationState();
    }
  }, [targetLang, translationService]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
      // 清除之前的翻译结果
      resetTranslationState();
    }
  };

  // 重置翻译状态但保留文件
  const resetTranslationState = () => {
    setProgress(0);
    setCurrentText("");
    setDownloadUrl("");
    setDownloadFileName("");
    setError("");
    setLoading(false);
  };

  const handleTranslate = async () => {
    if (!file) return;
    setLoading(true);
    setProgress(0);
    setCurrentText("");
    setDownloadUrl("");
    setDownloadFileName("");
    setError("");
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("targetLang", targetLang);
    formData.append("translationService", translationService);
    
    try {
      const response = await fetch("/api/translate-stream", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No reader available');
      }

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              switch (data.type) {
                case 'start':
                  console.log(`开始翻译，共${data.total}行，使用${data.service}服务`);
                  break;
                  
                case 'progress':
                  setProgress(data.progress);
                  setCurrentText(data.text);
                  break;
                  
                case 'complete':
                  setProgress(100);
                  setCurrentText("");
                  // 创建下载链接
                  const blob = new Blob([data.result], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  setDownloadUrl(url);
                  setDownloadFileName(data.filename);
                  
                  // 设置下载文件名
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = data.filename;
                  break;
                  
                case 'error':
                  setError(data.error);
                  break;
              }
            } catch (e) {
              console.error('解析SSE数据失败:', e);
            }
          }
        }
      }
    } catch (err) {
      console.error('翻译错误:', err);
      setError(t('translation_failed'));
    }
    
    setLoading(false);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  // 动态设置页面title和meta标签
  useEffect(() => {
    if (ready && t) {
      // 设置页面标题
      document.title = t('seo.title');
      
      // 设置meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', t('seo.description'));
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = t('seo.description');
        document.head.appendChild(meta);
      }
      
      // 设置meta keywords
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', t('seo.keywords'));
      } else {
        const meta = document.createElement('meta');
        meta.name = 'keywords';
        meta.content = t('seo.keywords');
        document.head.appendChild(meta);
      }

      // 设置Open Graph标签
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', t('seo.title'));
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'og:title');
        meta.content = t('seo.title');
        document.head.appendChild(meta);
      }

      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', t('seo.description'));
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'og:description');
        meta.content = t('seo.description');
        document.head.appendChild(meta);
      }

      // 设置Twitter Card标签
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      if (twitterTitle) {
        twitterTitle.setAttribute('content', t('seo.title'));
      } else {
        const meta = document.createElement('meta');
        meta.name = 'twitter:title';
        meta.content = t('seo.title');
        document.head.appendChild(meta);
      }

      const twitterDescription = document.querySelector('meta[name="twitter:description"]');
      if (twitterDescription) {
        twitterDescription.setAttribute('content', t('seo.description'));
      } else {
        const meta = document.createElement('meta');
        meta.name = 'twitter:description';
        meta.content = t('seo.description');
        document.head.appendChild(meta);
      }
    }
  }, [ready, t, i18n.language]);

  // 在 i18n 未准备好或组件未挂载时显示加载状态
  if (!mounted || !ready || !i18n.isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* 语言切换器 */}
        <div className="fixed top-6 right-6 z-50">
          <LanguageSelector 
            currentLang={i18n.language || 'zh'} 
            onLanguageChange={changeLanguage}
            t={t}
          />
        </div>

        {/* 主要功能区域 */}
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* 标题区域 */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {t('title')}
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {t('description')}
              </p>
            </div>

            {/* 功能卡片区域 */}
            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              {/* 左侧：使用方法 */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      📋
                    </span>
                    {t('howToUse.title')}
                  </h3>
                  <ol className="space-y-3">
                    {['step1', 'step2', 'step3', 'step4'].map((step, index) => (
                      <li key={step} className="flex items-start">
                        <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5 flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{t(`howToUse.steps.${step}`)}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* 中间：主要功能区 */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V1a1 1 0 011-1h2a1 1 0 011 1v3m0 0h8m-8 0V1" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('upload')}
                      </label>
                      <div className="relative">
                        <input 
                          type="file" 
                          accept=".srt" 
                          onChange={handleFileChange} 
                          className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-400 transition-colors"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('select_language')}
                      </label>
                      <TargetLanguageSelector
                        currentLang={targetLang}
                        onLanguageChange={setTargetLang}
                        t={t}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
                        <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-2"></span>
                        {t('select_translation_service')}
                      </label>
                      <TranslationServiceSelector
                        currentService={translationService}
                        onServiceChange={setTranslationService}
                        t={t}
                      />
                    </div>
                    
                    <button
                      onClick={handleTranslate}
                      disabled={!file || loading}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {t('translating')}
                        </span>
                      ) : t('translate')}
                    </button>

                    {loading && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                          <span>{t('translation_progress')}</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-2 text-center">
                          {progress < 100 ? (
                            <div>
                              <div className="mb-1">{t('translating_please_wait')}</div>
                              {currentText && (
                                <div className="text-gray-400 italic">
                                  {t('current_translating')}: {currentText}
                                </div>
                              )}
                            </div>
                          ) : (
                            t('translation_complete')
                          )}
                        </div>
                      </div>
                    )}
                    
                    {downloadUrl && (
                      <a
                        href={downloadUrl}
                        download={downloadFileName}
                        className="w-full inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {t('download')}
                      </a>
                    )}
                    
                    {error && (
                      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 右侧：功能特点 */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      ⭐
                    </span>
                    {t('features.title')}
                  </h3>
                  <div className="space-y-4">
                    {['fast', 'multilang', 'privacy', 'free'].map((feature) => (
                      <div key={feature} className="flex items-start">
                        <span className="text-2xl mr-3 flex-shrink-0">{t(`features.items.${feature}.icon`)}</span>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">{t(`features.items.${feature}.title`)}</h4>
                          <p className="text-sm text-gray-600">{t(`features.items.${feature}.description`)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* 核心优势板块 */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {t('benefits.title')}
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {t('benefits.subtitle')}
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {['accuracy', 'speed', 'security', 'support', 'cost', 'ease'].map((benefit) => (
                  <div key={benefit} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                      <span className="text-2xl">{t(`benefits.items.${benefit}.icon`)}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {t(`benefits.items.${benefit}.title`)}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {t(`benefits.items.${benefit}.description`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 使用场景板块 */}
        <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {t('useCases.title')}
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {t('useCases.subtitle')}
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {['education', 'business', 'entertainment', 'personal'].map((useCase) => (
                  <div key={useCase} className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">{t(`useCases.items.${useCase}.icon`)}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {t(`useCases.items.${useCase}.title`)}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {t(`useCases.items.${useCase}.description`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ板块 */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {t('faq.title')}
                </h2>
                <p className="text-xl text-gray-600">
                  {t('faq.subtitle')}
                </p>
              </div>
              <div className="space-y-6">
                {['format', 'languages', 'quality', 'privacy', 'cost', 'speed'].map((faq) => (
                  <div key={faq} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
                        Q
                      </span>
                      {t(`faq.items.${faq}.question`)}
                    </h3>
                    <div className="ml-9 text-gray-700 leading-relaxed">
                      {t(`faq.items.${faq}.answer`)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA板块 */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('cta.title')}
              </h2>
              <p className="text-xl mb-8 opacity-90">
                {t('cta.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  {t('cta.startButton')}
                </button>
                <a 
                  href="#features" 
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                >
                  {t('cta.learnMore')}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 底部文案区域 */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">{t('footer.title')}</h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                {t('footer.description')}
              </p>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-400 mb-2">8+</div>
                  <div className="text-gray-300">{t('footer.stats.languages')}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-400 mb-2">100%</div>
                  <div className="text-gray-300">{t('footer.stats.free')}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400 mb-2">{t('footer.stats.speedValue')}</div>
                  <div className="text-gray-300">{t('footer.stats.speed')}</div>
                </div>
              </div>
            </div>
          </div>
        </footer>
    </div>
  );
}
