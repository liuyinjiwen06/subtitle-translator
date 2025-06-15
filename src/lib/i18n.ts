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
      fallbackLng: 'zh',
      lng: 'zh', // 强制设置默认语言
      debug: process.env.NODE_ENV === 'development',
      
      interpolation: {
        escapeValue: false, // React 已经处理了 XSS
      },
      
      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
        lookupLocalStorage: 'i18nextLng',
        lookupFromPathIndex: 0,
        lookupFromSubdomainIndex: 0,
        // 语言映射
        convertDetectedLanguage: (lng: string) => {
          // 将 zh-CN, zh-cn, zh_CN 等都映射到 zh
          if (lng.startsWith('zh')) return 'zh';
          return lng;
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
      fallbackLng: 'zh',
      lng: 'zh',
      debug: false,
      
      interpolation: {
        escapeValue: false,
      },
      
      // 服务端不使用语言检测
      initImmediate: false,
    });
}

export default i18n; 