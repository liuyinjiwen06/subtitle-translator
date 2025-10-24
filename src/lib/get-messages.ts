// Edge Runtime compatible message loader
// Uses static imports to ensure compatibility with Cloudflare Workers

import type { UILocale } from '@/config/ui-locales';

// Static imports of all locale files
import ar from './locales/ar';
import de from './locales/de';
import en from './locales/en';
import es from './locales/es';
import fr from './locales/fr';
import hi from './locales/hi';
import it from './locales/it';
import ja from './locales/ja';
import ko from './locales/ko';
import nl from './locales/nl';
import pl from './locales/pl';
import pt from './locales/pt';
import ru from './locales/ru';
import sv from './locales/sv';
import th from './locales/th';
import tr from './locales/tr';
import vi from './locales/vi';
import zh from './locales/zh';

// Locale messages map
const localeMessages: Record<UILocale, any> = {
  ar,
  de,
  en,
  es,
  fr,
  hi,
  it,
  ja,
  ko,
  nl,
  pl,
  pt,
  ru,
  sv,
  th,
  tr,
  vi,
  zh,
  // TODO: Add translations for Indonesian and Ukrainian
  id: en, // Fallback to English for Indonesian
  uk: en, // Fallback to English for Ukrainian
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
