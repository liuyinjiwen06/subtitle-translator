import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { isValidUILocale, type UILocale } from '@/config/ui-locales';
import { getMessagesForLocale } from '@/lib/get-messages';

// 强制动态渲染以支持 next-intl
export const dynamic = 'force-dynamic';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // 验证 locale 是否有效
  if (!isValidUILocale(locale)) {
    console.error('[Layout] Invalid locale:', locale);
    notFound();
  }

  // 获取翻译消息 - Edge Runtime 兼容的方式
  let messages;
  try {
    console.log('[Layout] Loading messages for locale:', locale);
    messages = await getMessagesForLocale(locale as UILocale);
    console.log('[Layout] Messages loaded successfully, keys:', Object.keys(messages || {}).slice(0, 5));
  } catch (error) {
    console.error('[Layout] CRITICAL ERROR loading messages for locale:', locale);
    console.error('[Layout] Error details:', error);
    console.error('[Layout] Error stack:', error instanceof Error ? error.stack : 'No stack');
    // 使用空对象作为后备
    messages = {};
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="min-h-screen flex flex-col">
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
