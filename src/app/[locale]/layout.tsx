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

  // 获取翻译消息，使用 try-catch 处理 Edge Runtime 兼容性
  let messages;
  try {
    messages = await getMessages({ locale });
  } catch (error) {
    console.error('Failed to load messages for locale:', locale, error);
    // 回退到空消息对象
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
