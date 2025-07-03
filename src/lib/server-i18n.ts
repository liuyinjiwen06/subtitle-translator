import { Locale } from '../../i18nConfig';

// 翻译文件缓存
const translationCache = new Map<string, any>();

// 加载翻译文件
async function loadTranslations(locale: Locale) {
  // 添加调试信息
  console.log(`🔍 Loading translations for locale: "${locale}"`);
  console.log(`🔍 Locale type: ${typeof locale}`);
  console.log(`🔍 Call stack:`, new Error().stack?.split('\n').slice(1, 5).join('\n'));
  
  if (translationCache.has(locale)) {
    console.log(`✅ Found cached translations for locale: ${locale}`);
    return translationCache.get(locale);
  }

  try {
    console.log(`📂 Attempting to import: ../lib/locales/${locale}.json`);
    const translations = await import(`../lib/locales/${locale}.json`);
    translationCache.set(locale, translations.default);
    console.log(`✅ Successfully loaded translations for locale: ${locale}`);
    return translations.default;
  } catch (error) {
    console.error(`❌ Failed to load translations for locale: ${locale}`);
    console.error(`❌ Error details:`, error);
    console.error(`❌ Error message:`, error instanceof Error ? error.message : 'Unknown error');
    console.error(`❌ Call stack when error occurred:`, new Error().stack);
    
    // 回退到英语
    if (locale !== 'en') {
      console.warn(`🔄 Falling back to English translations for failed locale: ${locale}`);
      return loadTranslations('en');
    }
    console.error(`💥 Critical: Even English translations failed to load!`);
    return {};
  }
}

// 服务端翻译函数
export async function getServerTranslations(locale: Locale) {
  const translations = await loadTranslations(locale);
  
  const t = (key: string, options?: { returnObjects?: boolean } | string): any => {
    // 处理参数
    let returnObjects = false;
    let fallback: string | undefined;
    
    if (typeof options === 'object' && options !== null) {
      returnObjects = options.returnObjects || false;
    } else if (typeof options === 'string') {
      fallback = options;
    }
    
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return fallback || key;
      }
    }
    
    // 如果 returnObjects 为 true，返回原始值（可能是数组或对象）
    if (returnObjects) {
      return value;
    }
    
    // 否则只返回字符串
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