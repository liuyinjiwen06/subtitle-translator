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

// 统一的初始化配置
const initConfig = {
  resources,
  fallbackLng: 'en',
  debug: process.env.NODE_ENV === 'development',
  interpolation: {
    escapeValue: false, // React 已经处理了 XSS
  },
  react: {
    useSuspense: false, // 关闭Suspense避免SSR问题
  },
  initImmediate: false,
};

// 客户端和服务端分别初始化
if (typeof window !== 'undefined') {
  // 客户端初始化 - 使用语言检测
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      ...initConfig,
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
    });
} else {
  // 服务端初始化 - 固定英语
  i18n
    .use(initReactI18next)
    .init({
      ...initConfig,
      lng: 'en', // 服务端固定使用英语
      debug: false, // 服务端关闭调试
    });
}

export default i18n; 