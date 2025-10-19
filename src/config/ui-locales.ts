/**
 * UI 语言配置
 * 这些是页面界面显示的语言（使用 ISO 639-1 简写代码）
 * 用于路由：/[locale] (例如: /en, /zh, /fr)
 */

export const UI_LOCALES = [
  'en', // English
  'zh', // Chinese (Simplified)
  'es', // Spanish
  'fr', // French
  'de', // German
  'ja', // Japanese
  'ko', // Korean
  'pt', // Portuguese
  'ru', // Russian
  'ar', // Arabic
  'hi', // Hindi
  'it', // Italian
  'tr', // Turkish
  'vi', // Vietnamese
  'th', // Thai
  'pl', // Polish
  'nl', // Dutch
  'id', // Indonesian
  'uk', // Ukrainian
  'sv', // Swedish
] as const;

export type UILocale = (typeof UI_LOCALES)[number];

export const DEFAULT_LOCALE: UILocale = 'en';

/**
 * UI 语言显示名称
 */
export const UI_LOCALE_NAMES: Record<
  UILocale,
  {
    native: string; // 母语名称
    english: string; // 英文名称
  }
> = {
  en: { native: 'English', english: 'English' },
  zh: { native: '简体中文', english: 'Chinese (Simplified)' },
  es: { native: 'Español', english: 'Spanish' },
  fr: { native: 'Français', english: 'French' },
  de: { native: 'Deutsch', english: 'German' },
  ja: { native: '日本語', english: 'Japanese' },
  ko: { native: '한국어', english: 'Korean' },
  pt: { native: 'Português', english: 'Portuguese' },
  ru: { native: 'Русский', english: 'Russian' },
  ar: { native: 'العربية', english: 'Arabic' },
  hi: { native: 'हिन्दी', english: 'Hindi' },
  it: { native: 'Italiano', english: 'Italian' },
  tr: { native: 'Türkçe', english: 'Turkish' },
  vi: { native: 'Tiếng Việt', english: 'Vietnamese' },
  th: { native: 'ไทย', english: 'Thai' },
  pl: { native: 'Polski', english: 'Polish' },
  nl: { native: 'Nederlands', english: 'Dutch' },
  id: { native: 'Bahasa Indonesia', english: 'Indonesian' },
  uk: { native: 'Українська', english: 'Ukrainian' },
  sv: { native: 'Svenska', english: 'Swedish' },
};

/**
 * 验证语言代码是否有效
 */
export function isValidUILocale(locale: string): locale is UILocale {
  return UI_LOCALES.includes(locale as UILocale);
}
