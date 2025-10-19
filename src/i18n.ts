import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { UI_LOCALES } from './config/ui-locales';

export default getRequestConfig(async ({ locale }) => {
  // 验证 locale 是否有效
  if (!UI_LOCALES.includes(locale as any)) {
    notFound();
  }

  return {
    messages: (await import(`../locales/${locale}.json`)).default,
  };
});
