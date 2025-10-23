// Edge Runtime compatible message loader
// Directly imports translation modules instead of using next-intl's getMessages

import type { UILocale } from '@/config/ui-locales';

export async function getMessagesForLocale(locale: UILocale) {
  console.log(`[getMessagesForLocale] Attempting to load locale: ${locale}`);

  try {
    // Dynamic import of the TypeScript module
    console.log(`[getMessagesForLocale] Importing: ./locales/${locale}`);
    const messages = await import(`./locales/${locale}`);
    console.log(`[getMessagesForLocale] Import successful, has default:`, !!messages.default);
    console.log(`[getMessagesForLocale] Message keys:`, Object.keys(messages.default || {}).slice(0, 10));
    return messages.default;
  } catch (error) {
    console.error(`[getMessagesForLocale] ERROR loading messages for locale: ${locale}`);
    console.error(`[getMessagesForLocale] Error type:`, error?.constructor?.name);
    console.error(`[getMessagesForLocale] Error message:`, error instanceof Error ? error.message : String(error));
    console.error(`[getMessagesForLocale] Error stack:`, error instanceof Error ? error.stack : 'No stack');

    // Fallback to English
    if (locale !== 'en') {
      console.log(`[getMessagesForLocale] Attempting fallback to English`);
      try {
        const fallback = await import('./locales/en');
        console.log(`[getMessagesForLocale] Fallback successful`);
        return fallback.default;
      } catch (fallbackError) {
        console.error('[getMessagesForLocale] Fallback to English also failed:', fallbackError);
      }
    }

    // Return empty object as last resort
    console.warn('[getMessagesForLocale] Returning empty object as last resort');
    return {};
  }
}
