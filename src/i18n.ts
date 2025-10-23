import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { UI_LOCALES } from './config/ui-locales';

export default getRequestConfig(async ({ requestLocale }) => {
  // 等待 locale
  const locale = await requestLocale;

  // 验证 locale 是否有效
  if (!locale || !UI_LOCALES.includes(locale as any)) {
    notFound();
  }

  try {
    return {
      messages: (await import(`./lib/locales/${locale}`)).default,
    };
  } catch (error) {
    console.error('Failed to load locale messages:', locale, error);
    // 回退到英语
    return {
      messages: (await import(`./lib/locales/en`)).default,
    };
  }
});
