import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isValidUILocale } from '@/config/ui-locales';

// 强制动态渲染以支持 next-intl
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

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
    notFound();
  }

  // 获取翻译消息
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="min-h-screen flex flex-col">
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
