// Edge Runtime compatible message loader
// Loads translations from /locales/ directory (root level)

import type { UILocale } from '@/config/ui-locales';

// Static imports of locale files from root /locales/ directory
// All 18 locales now have full translations
import en from '@/../locales/en.json';
import zh from '@/../locales/zh.json';
import fr from '@/../locales/fr.json';
import ja from '@/../locales/ja.json';
import de from '@/../locales/de.json';
import es from '@/../locales/es.json';
import ru from '@/../locales/ru.json';
import it from '@/../locales/it.json';
import pt from '@/../locales/pt.json';
import ar from '@/../locales/ar.json';
import hi from '@/../locales/hi.json';
import ko from '@/../locales/ko.json';
import th from '@/../locales/th.json';
import vi from '@/../locales/vi.json';
import tr from '@/../locales/tr.json';
import pl from '@/../locales/pl.json';
import nl from '@/../locales/nl.json';
import sv from '@/../locales/sv.json';

// Locale messages map
const localeMessages: Record<UILocale, any> = {
  en,
  zh,
  fr,
  ja,
  de,
  es,
  ru,
  it,
  pt,
  ar,
  hi,
  ko,
  th,
  vi,
  tr,
  pl,
  nl,
  sv,
  // id and uk fallback to English (not in translation list)
  id: en,
  uk: en,
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
