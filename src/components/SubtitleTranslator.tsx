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
  const [currentTranslatingText, setCurrentTranslatingText] = useState<string>("");
  const [translationStats, setTranslationStats] = useState<{
    currentIndex: number;
    totalCount: number;
    service: string;
  }>({ currentIndex: 0, totalCount: 0, service: "" });
  const [showEnvDiagnostics, setShowEnvDiagnostics] = useState(false);
  const [envDiagnostics, setEnvDiagnostics] = useState<any>(null);
  
  // 增强功能状态
  const [autoSaveCount, setAutoSaveCount] = useState(0);
  const [fileLineCount, setFileLineCount] = useState(0);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  // 分析文件内容
  const analyzeFile = async (file: File) => {
    const content = await file.text();
    const lines = content.split('\n');
    const textLines = lines.filter(line => {
      const trimmed = line.trim();
      return trimmed !== "" && 
             !/^\d+$/.test(trimmed) && 
             !/^\d{2}:\d{2}:\d{2}/.test(trimmed);
    });
    setFileLineCount(textLines.length);
    return content;
  };

  // 文件上传处理
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.name.endsWith('.srt')) {
      setFile(selectedFile);
      await analyzeFile(selectedFile);
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
    setCurrentTranslatingText("");
    setTranslationStats({ currentIndex: 0, totalCount: 0, service: "" });
    setAutoSaveCount(0);
  };

  // 增强翻译处理（大文件或需要高级功能时使用）
  const handleAdvancedTranslate = async (resume = false) => {
    try {
      const fileContent = await file!.text();
      const requestBody = {
        content: fileContent,
        targetLang: targetLanguage,
        translationService: translationService,
        skipTranslated: true,
        batchMode: fileLineCount > 100 ? 'auto' : 'off'
      };

      abortControllerRef.current = new AbortController();

      const response = await fetch('/api/translate-advanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${t('translation_failed')}: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error(t('cannot_read_response'));
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines[lines.length - 1];

        for (const line of lines.slice(0, -1)) {
          if (line.startsWith('data: ')) {
            try {
              const jsonString = line.substring(6).trim();
              if (jsonString) {
                const data = JSON.parse(jsonString);
                handleAdvancedStreamEvent(data);
              }
            } catch (e) {
              console.error('Error parsing stream data:', e, 'Line:', line);
            }
          }
        }

      }
    } catch (error) {
      console.error('Advanced translation error:', error);
      setTranslationError(error instanceof Error ? error.message : t('translation_failed'));
      setIsTranslating(false);
    }
  };

  // 处理增强流事件
  const handleAdvancedStreamEvent = (data: any) => {
    switch (data.type) {
      case 'env_status':
        setEnvDiagnostics(data);
        break;
        
        
      case 'start':
        setTranslationStats(prev => ({ ...prev, totalCount: data.total }));
        break;
        
      case 'progress':
        setTranslationProgress(data.progress);
        setCurrentTranslatingText(data.currentText);
        setTranslationStats(prev => ({ 
          ...prev, 
          currentIndex: data.current,
          totalCount: data.total 
        }));
        break;
        
      case 'auto_save':
        setAutoSaveCount(data.savedCount);
        break;
        
        
      case 'complete':
        setTranslatedContent(data.result);
        setTranslationProgress(100);
        setIsTranslating(false);
        setTranslationStats(prev => ({ ...prev, currentIndex: data.totalTranslated }));
        if (data.failedLines && data.failedLines.length > 0) {
          setTranslationError(`Translation completed with ${data.failedLines.length} failed lines.`);
        }
        break;
        
      case 'error':
        setTranslationError(data.error);
        setIsTranslating(false);
        break;
    }
  };


  // 翻译处理
  const handleTranslate = async (resume = false) => {
    if (!file) {
      alert(t('please_upload_file_first'));
      return;
    }

    setIsTranslating(true);
    setTranslationError("");
    if (!resume) {
      setTranslationProgress(0);
      setCurrentTranslatingText("");
      setTranslationStats({ currentIndex: 0, totalCount: 0, service: translationService });
      setAutoSaveCount(0);
    }

    // 在Cloudflare环境下使用stream API，在其他环境使用unified API
    // 修复Cloudflare检测逻辑，支持更多Cloudflare域名
    const isCloudflare = typeof window !== 'undefined' && (
      window.location.hostname.includes('.pages.dev') || 
      window.location.hostname.includes('.workers.dev') ||
      window.location.hostname.includes('.cloudflare.com') ||
      window.location.hostname.includes('.cf.dev') ||
      window.location.hostname.includes('.cf-ipfs.com') ||
      // 如果域名包含cloudflare相关关键词，也认为是Cloudflare环境
      window.location.hostname.includes('cloudflare') ||
      // 生产环境默认使用stream API（更稳定）
      window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1')
    );
    
    const apiEndpoint = isCloudflare ? '/api/translate-stream' : '/api/translate-unified';
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('targetLang', targetLanguage);
    formData.append('translationService', translationService);

    try {
      console.log(`[智能翻译开始] 准备发送请求到 ${apiEndpoint}`);
      console.log(`[环境检测] Cloudflare环境: ${isCloudflare}`);
      console.log(`[翻译参数] 文件: ${file.name}, 目标语言: ${targetLanguage}, 服务: ${translationService}`);
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData,
      });

      console.log(`[API响应] 状态码: ${response.status}, 状态文本: ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[API错误] 响应内容: ${errorText}`);
        throw new Error(`${t('translation_failed')}: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error(t('cannot_read_response'));
      }

      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;
          
          // 将新数据添加到缓冲区
          buffer += decoder.decode(value, { stream: true });
          
          // 处理完整的行
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // 保留最后一个不完整的行
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                
                if (data.type === 'env_status') {
                  console.log(`[环境状态]`, data);
                  if (!data.googleConfigured && !data.openaiConfigured) {
                    throw new Error('翻译服务未配置：缺少API密钥。请检查环境变量配置。');
                  }
                } else if (data.type === 'analysis_complete') {
                  console.log(`[文件分析完成] 总行数: ${data.totalLines}, 需翻译: ${data.needTranslation}, 已翻译: ${data.alreadyTranslated}`);
                  setCurrentTranslatingText(`分析完成：${data.needTranslation}句需翻译，${data.alreadyTranslated}句已翻译`);
                } else if (data.type === 'start') {
                  console.log(`[开始翻译] 总计需翻译: ${data.total} 句`);
                  setTranslationStats({ 
                    currentIndex: 0, 
                    totalCount: data.total, 
                    service: data.service || translationService 
                  });
                  // 不再设置批次信息
                } else if (data.type === 'group_start') {
                  console.log(`[组开始] 第 ${data.groupNumber}/${data.totalGroups} 组, ${data.groupSize}句, 并发数: ${data.concurrentSize}`);
                  // 不再显示批次信息，只在控制台记录
                } else if (data.type === 'translation_start') {
                  setCurrentTranslatingText(data.text);
                } else if (data.type === 'translation_success') {
                  console.log(`[翻译成功] ${data.original} -> ${data.translated} (${data.service}, ${data.responseTime}ms)`);
                } else if (data.type === 'translation_failure') {
                  console.warn(`[翻译失败] ${data.text} - ${data.error}`);
                } else if (data.type === 'progress') {
                  console.log(`[进度更新] ${data.progress}% (${data.completed}/${data.total})`);
                  setTranslationProgress(data.progress);
                  setTranslationStats(prev => ({
                    ...prev,
                    currentIndex: data.completed,
                    totalCount: data.total,
                    service: data.serviceStats ? 
                      (data.serviceStats.google.successRate > data.serviceStats.openai.successRate ? 'google' : 'openai') 
                      : prev.service
                  }));
                  // 移除批次信息显示
                } else if (data.type === 'group_complete') {
                  console.log(`[组完成] 第 ${data.groupNumber} 组: 成功 ${data.groupSuccess}, 失败 ${data.groupFailures}`);
                } else if (data.type === 'concurrent_adjusted') {
                  console.log(`[并发调整] ${data.oldSize} -> ${data.newSize} (${data.reason})`);
                } else if (data.type === 'auto_save') {
                  console.log(`[自动保存] ${data.savedLines} 句已保存`);
                  setAutoSaveCount(data.savedLines);
                } else if (data.type === 'service_switch') {
                  // 服务切换通知
                  console.log(`[SSE服务切换] ${data.from} -> ${data.to} - ${data.message}`);
                  setTranslationStats(prev => ({ ...prev, service: data.to }));
                } else if (data.type === 'retry_phase_start') {
                  console.log(`[重试阶段开始] ${data.failureCount} 句失败，开始重试`);
                  setCurrentTranslatingText(`重试 ${data.failureCount} 句失败翻译...`);
                } else if (data.type === 'retry_progress') {
                  console.log(`[重试进度] ${data.progress}% (${data.current}/${data.total}) - ${data.currentText}`);
                  setCurrentTranslatingText(`重试进度: ${data.progress}% - ${data.currentText}`);
                } else if (data.type === 'retry_success') {
                  console.log(`[重试成功] ${data.original} -> ${data.translated} (总尝试: ${data.totalAttempts})`);
                } else if (data.type === 'retry_failed') {
                  console.warn(`[重试失败] ${data.text} - ${data.finalError}`);
                } else if (data.type === 'retry_phase_complete') {
                  console.log(`[重试阶段完成] 重试 ${data.retriedCount} 句，成功 ${data.successfulRetries} 句`);
                  setCurrentTranslatingText("重试阶段完成");
                } else if (data.type === 'translated') {
                  // 处理stream API的单条翻译结果
                  console.log(`[单条翻译] ${data.original} -> ${data.translated}`);
                  setCurrentTranslatingText(data.translated);
                } else if (data.type === 'complete') {
                  console.log(`[翻译完成]`, data.statistics || `共翻译${data.totalTranslated || 0}句`);
                  setTranslatedContent(data.result);
                  setTranslationProgress(100);
                  setCurrentTranslatingText("");
                  
                  // 清除错误信息
                  if (translationError) {
                    setTranslationError("");
                  }
                  
                  // 添加小延迟确保UI更新
                  setTimeout(() => {
                    setIsTranslating(false);
                  }, 100);
                  
                  // 确保关闭 reader
                  await reader.cancel();
                  return;
                } else if (data.type === 'fatal_error') {
                  setCurrentTranslatingText("");
                  setTranslationError(data.error || '翻译服务配置错误');
                  setIsTranslating(false);
                  setTranslationProgress(0);
                  console.error('[致命错误]', data.error);
                  return;
                } else if (data.type === 'error') {
                  setCurrentTranslatingText("");
                  // 检查是否是地区限制错误
                  const errorMsg = data.error || 'Translation failed';
                  if (errorMsg.includes('unsupported_country_region_territory') || 
                      errorMsg.includes('Country, region, or territory not supported')) {
                    throw new Error('OpenAI service is not available in your region. Please use Google Translate or configure a proxy service. See console logs for details.');
                  }
                  throw new Error(errorMsg);
                }
              } catch (parseError) {
                // 忽略JSON解析错误，继续处理
                console.warn('Failed to parse SSE data:', line);
              }
            }
          }
        }
        
        // 处理最后的缓冲区数据
        if (buffer.trim()) {
          console.warn('Incomplete SSE data in buffer:', buffer);
        }
      } finally {
        // 确保 reader 被关闭
        await reader.cancel();
      }
    } catch (error) {
      console.error('翻译错误:', error);
      setTranslationError(error instanceof Error ? error.message : t('translation_error_occurred'));
      setIsTranslating(false);
      setCurrentTranslatingText("");
      setTranslationProgress(0);
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

  // Environment diagnostics
  const runEnvDiagnostics = async () => {
    try {
      console.log('[Environment Diagnostics] Starting check...');
      const response = await fetch('/api/test-env');
      const data = await response.json();
      console.log('[Environment Diagnostics] Results:', data);
      setEnvDiagnostics(data);
      setShowEnvDiagnostics(true);
    } catch (error) {
      console.error('[Environment Diagnostics] Failed:', error);
      setEnvDiagnostics({ error: error instanceof Error ? error.message : 'Diagnostics failed' });
      setShowEnvDiagnostics(true);
    }
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

        {/* 文件信息和增强功能提示 */}
        {file && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-800">
                  <span className="font-medium">{file.name}</span> ({fileLineCount} translatable lines)
                </p>
              </div>
              {autoSaveCount > 0 && (
                <span className="text-sm text-green-600 font-medium">
                  💾 Auto-saved: {autoSaveCount} lines
                </span>
              )}
            </div>
          </div>
        )}


        {/* 翻译按钮区域 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!isTranslating && !translatedContent && (
            <button
              onClick={() => handleTranslate()}
              disabled={!file}
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform ${
                !file
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl'
              }`}
            >
              {t('translate')}
            </button>
          )}

          {translatedContent && !isTranslating && (
            <button
              onClick={handleDownload}
              className="px-8 py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-green-500 to-teal-600 text-white hover:from-green-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{t('download')}</span>
              </div>
            </button>
          )}
        </div>

        {/* 翻译进度 */}
        {isTranslating && (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-gray-700">{t('translation_progress')}: {translationProgress}%</span>
              <div className="flex items-center space-x-4 text-xs text-gray-600">
                <span>{translationStats.currentIndex} / {translationStats.totalCount}</span>
                {autoSaveCount > 0 && (
                  <span className="text-green-600 font-medium">
                    💾 Auto-saved: {autoSaveCount}
                  </span>
                )}
              </div>
            </div>
            
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-full transition-all duration-300 ease-out relative"
                  style={{ width: `${translationProgress}%` }}
                >
                  <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                </div>
              </div>
            </div>
            
            {/* 翻译状态信息 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-blue-700">Translating...</span>
              </div>
              
              {currentTranslatingText && (
                <div className="space-y-1">
                  <div className="text-xs text-gray-600">Currently translating:</div>
                  <div className="text-sm text-gray-800 bg-white rounded-md p-2 border border-gray-200 font-mono leading-relaxed">
                    {currentTranslatingText.length > 100 
                      ? `${currentTranslatingText.substring(0, 100)}...` 
                      : currentTranslatingText
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 错误显示 */}
        {translationError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-red-500">❌</span>
                  <span className="text-red-700 font-medium">{t('translation_failed')}</span>
                </div>
                <p className="text-red-600 mt-2">{translationError}</p>
              </div>
              <button
                onClick={runEnvDiagnostics}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                🔍 Run Diagnostics
              </button>
            </div>
          </div>
        )}

        {/* 环境诊断结果 */}
        {showEnvDiagnostics && envDiagnostics && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Diagnostic Results</h3>
              <button
                onClick={() => setShowEnvDiagnostics(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <pre className="text-xs bg-white p-3 rounded border border-gray-200 overflow-x-auto">
              {JSON.stringify(envDiagnostics, null, 2)}
            </pre>
          </div>
        )}

        {/* 翻译完成 */}
        {translatedContent && !isTranslating && (
          <div className="space-y-4">
            <div className="p-6 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center space-x-2">
                <span className="text-green-500 text-2xl">🎉</span>
                <span className="text-green-700 font-semibold text-lg">{t('translation_complete')}</span>
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