import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isValidUILocale } from '@/config/ui-locales';

// 强制动态渲染以支持 next-intl
export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'zh' },
    { locale: 'es' },
    { locale: 'fr' },
    { locale: 'de' },
    { locale: 'ja' },
    { locale: 'ko' },
    { locale: 'pt' },
    { locale: 'ru' },
    { locale: 'ar' },
    { locale: 'hi' },
    { locale: 'it' },
    { locale: 'tr' },
    { locale: 'vi' },
    { locale: 'th' },
    { locale: 'pl' },
    { locale: 'nl' },
    { locale: 'id' },
    { locale: 'uk' },
    { locale: 'sv' },
  ];
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
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
