// 页面配置系统 - 为多页面扩展设计
export interface PageConfig {
  // 页面标识
  pageKey: string;
  // 目标语言代码
  targetLanguage: string;
  // 目标语言显示名称的翻译key
  targetLanguageKey: string;
  // 默认源语言（可选）
  defaultSourceLanguage?: string;
  // SEO路径
  path: string;
  // 是否在导航中显示
  showInNav?: boolean;
  // 页面优先级（用于排序）
  priority?: number;
  // 特殊配置
  special?: {
    // 是否预设目标语言
    presetTarget?: boolean;
    // 自定义翻译服务偏好
    preferredService?: 'google' | 'openai';
  }
}

// 页面配置映射
export const PAGE_CONFIGS: Record<string, PageConfig> = {
  englishSubtitle: {
    pageKey: 'englishSubtitle',
    targetLanguage: 'en',
    targetLanguageKey: 'languages.en',
    path: '/english-subtitle',
    showInNav: true,
    priority: 1,
    special: {
      presetTarget: true,
      preferredService: 'openai'
    }
  },
  chineseSubtitle: {
    pageKey: 'chineseSubtitle', 
    targetLanguage: 'zh',
    targetLanguageKey: 'languages.zh',
    path: '/chinese-subtitle',
    showInNav: true,
    priority: 2,
    special: {
      presetTarget: true,
      preferredService: 'google'
    }
  }
  // 未来可以轻松添加更多页面配置
  // japaneseSubtitle: { ... },
  // frenchSubtitle: { ... },
  // germanSubtitle: { ... },
  // ... 最多100页配置
};

// 获取页面配置
export function getPageConfig(pageKey: string): PageConfig | null {
  return PAGE_CONFIGS[pageKey] || null;
}

// 获取所有页面配置
export function getAllPageConfigs(): PageConfig[] {
  return Object.values(PAGE_CONFIGS).sort((a, b) => (a.priority || 0) - (b.priority || 0));
}

// 根据路径获取页面配置
export function getPageConfigByPath(path: string): PageConfig | null {
  return Object.values(PAGE_CONFIGS).find(config => config.path === path) || null;
}

// 生成页面元数据
export function generatePageMetadata(pageKey: string, t: (key: string, options?: any) => any) {
  const config = getPageConfig(pageKey);
  if (!config) return null;

  const pageData = t(`pages.${pageKey}`, { returnObjects: true });
  
  return {
    title: pageData?.seo?.title || pageData?.title,
    description: pageData?.seo?.description || pageData?.description,
    keywords: pageData?.seo?.keywords,
    openGraph: {
      title: pageData?.seo?.title || pageData?.title,
      description: pageData?.seo?.description || pageData?.description,
      type: 'website',
      locale: 'zh_CN',
      alternateLocale: ['en_US', 'ja_JP']
    },
    twitter: {
      card: 'summary_large_image',
      title: pageData?.seo?.title || pageData?.title,
      description: pageData?.seo?.description || pageData?.description
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    alternates: {
      canonical: config.path,
      languages: {
        'zh-CN': `${config.path}?lang=zh`,
        'en-US': `${config.path}?lang=en`,
        'ja-JP': `${config.path}?lang=ja`
      }
    }
  };
} 