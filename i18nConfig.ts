export const i18nConfig = {
  locales: ['en', 'zh', 'ja', 'fr', 'de', 'es', 'ru', 'it', 'pt', 'ar', 'hi', 'ko', 'th', 'vi', 'tr', 'pl', 'nl', 'sv'],
  defaultLocale: 'en',
  prefixDefault: false // 默认语言不使用前缀
} as const;

export type Locale = typeof i18nConfig.locales[number]; 