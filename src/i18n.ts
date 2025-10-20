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

  return {
    messages: (await import(`../locales/${locale}.json`)).default,
  };
});
