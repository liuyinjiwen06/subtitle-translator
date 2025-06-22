import { Locale } from '../../i18nConfig';

// 翻译文件缓存
const translationCache = new Map<string, any>();

// 加载翻译文件
async function loadTranslations(locale: Locale) {
  if (translationCache.has(locale)) {
    return translationCache.get(locale);
  }

  try {
    const translations = await import(`../lib/locales/${locale}.json`);
    translationCache.set(locale, translations.default);
    return translations.default;
  } catch (error) {
    console.warn(`Failed to load translations for locale: ${locale}`);
    // 回退到英语
    if (locale !== 'en') {
      return loadTranslations('en');
    }
    return {};
  }
}

// 服务端翻译函数
export async function getServerTranslations(locale: Locale) {
  const translations = await loadTranslations(locale);
  
  const t = (key: string, fallback?: string): string => {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return fallback || key;
      }
    }
    
    return typeof value === 'string' ? value : fallback || key;
  };

  return { t, translations };
}

// 获取页面特定配置
export async function getPageConfig(locale: Locale, pageKey: 'englishSubtitle' | 'chineseSubtitle') {
  const { t, translations } = await getServerTranslations(locale);
  
  // 从 pages 下面获取页面数据
  const pageData = translations.pages?.[pageKey];
  
  if (!pageData) {
    console.warn(`Page config not found for pages.${pageKey} in ${locale}`);
    // 返回基础配置
    return {
      title: t('title'),
      description: t('description'),
      seo: {
        title: t('title'),
        description: t('description'),
        keywords: t('seo.keywords', 'subtitle, translation, SRT')
      },
      benefits: [],
      useCases: [],
      faq: [],
      cta: {
        title: t('cta.title', 'Get Started'),
        description: t('cta.description', 'Start translating your subtitles now')
      }
    };
  }

  // 转换benefits数据结构
  const benefitsArray = pageData.benefits?.items ? 
    Object.entries(pageData.benefits.items).map(([key, item]: [string, any]) => ({
      title: item.title,
      description: item.description,
      icon: item.icon
    })) : [];

  // 转换useCases数据结构
  const useCasesArray = pageData.useCases?.items ? 
    Object.entries(pageData.useCases.items).map(([key, item]: [string, any]) => ({
      title: item.title,
      description: item.description,
      icon: item.icon
    })) : [];

  return {
    title: pageData.title || t('title'),
    description: pageData.description || t('description'),
    seo: pageData.seo || {
      title: t('title'),
      description: t('description'),
      keywords: t('seo.keywords', 'subtitle, translation, SRT')
    },
    benefits: benefitsArray,
    useCases: useCasesArray,
    faq: pageData.faq || [],
    cta: pageData.cta || {
      title: t('cta.title', 'Get Started'),
      description: t('cta.description', 'Start translating your subtitles now')
    }
  };
} 