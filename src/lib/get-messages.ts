// Edge Runtime compatible message loader
// Loads translations from /locales/ directory (root level)

import type { UILocale } from '@/config/ui-locales';

// Static imports of locale files from root /locales/ directory
// Only en and zh are available, all others fallback to English
import en from '@/../locales/en.json';
import zh from '@/../locales/zh.json';

// Locale messages map - only en and zh are available
const localeMessages: Record<UILocale, any> = {
  en,
  zh,
  // Fallback all other locales to English
  ar: en,
  de: en,
  es: en,
  fr: en,
  hi: en,
  id: en,
  it: en,
  ja: en,
  ko: en,
  nl: en,
  pl: en,
  pt: en,
  ru: en,
  sv: en,
  th: en,
  tr: en,
  uk: en,
  vi: en,
};

export async function getMessagesForLocale(locale: UILocale) {
  console.log(`[getMessagesForLocale] Loading locale: ${locale}`);

  try {
    const messages = localeMessages[locale];

    if (!messages) {
      console.warn(`[getMessagesForLocale] No messages found for locale: ${locale}, falling back to English`);
      return localeMessages.en || {};
    }

    console.log(`[getMessagesForLocale] Successfully loaded ${locale}, keys:`, Object.keys(messages).slice(0, 10));
    return messages;
  } catch (error) {
    console.error(`[getMessagesForLocale] ERROR loading messages for locale: ${locale}`,error);
    return localeMessages.en || {};
  }
}
