import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 导入翻译资源
import zh from './locales/zh.json';
import en from './locales/en.json';
import ja from './locales/ja.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import es from './locales/es.json';
import ru from './locales/ru.json';
import it from './locales/it.json';

const resources = {
  'zh': { translation: zh },
  'en': { translation: en },
  'ja': { translation: ja },
  'fr': { translation: fr },
  'de': { translation: de },
  'es': { translation: es },
  'ru': { translation: ru },
  'it': { translation: it },
};

// 只在客户端初始化 i18next
if (typeof window !== 'undefined') {
  // 清除可能存在的旧语言设置
  localStorage.removeItem('i18nextLng');
  
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'en', // 设置英语为fallback语言
      // 移除强制设置，让浏览器语言检测生效
      debug: process.env.NODE_ENV === 'development',
      
      interpolation: {
        escapeValue: false, // React 已经处理了 XSS
      },
      
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage'],
        lookupLocalStorage: 'i18nextLng',
        // 增强的语言映射
        convertDetectedLanguage: (lng: string) => {
          // 中文变种映射
          if (lng.startsWith('zh')) return 'zh';
          // 英文变种映射
          if (lng.startsWith('en')) return 'en';
          // 日文变种映射
          if (lng.startsWith('ja')) return 'ja';
          // 支持的语言直接返回
          if (['fr', 'de', 'es', 'ru', 'it'].includes(lng)) return lng;
          // 不支持的语言回退到英文
          return 'en';
        }
      },
      
      // 确保同步初始化
      initImmediate: false,
    });
} else {
  // 服务端简单初始化
  i18n
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'en', // 服务端也使用英语作为fallback
      lng: 'en', // 服务端默认英语
      debug: false,
      
      interpolation: {
        escapeValue: false,
      },
      
      // 服务端不使用语言检测
      initImmediate: false,
    });
}

export default i18n; 