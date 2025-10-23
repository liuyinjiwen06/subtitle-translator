// Edge Runtime compatible message loader
// Directly imports translation modules instead of using next-intl's getMessages

import type { UILocale } from '@/config/ui-locales';

export async function getMessagesForLocale(locale: UILocale) {
  try {
    // Dynamic import of the TypeScript module
    const messages = await import(`./locales/${locale}`);
    return messages.default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);

    // Fallback to English
    if (locale !== 'en') {
      try {
        const fallback = await import('./locales/en');
        return fallback.default;
      } catch (fallbackError) {
        console.error('Failed to load fallback English messages', fallbackError);
      }
    }

    // Return empty object as last resort
    return {};
  }
}
