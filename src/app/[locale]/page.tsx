import HomePage from '@/components/HomePage';
import { getMessagesForLocale } from '@/lib/get-messages';
import { isValidUILocale, type UILocale } from '@/config/ui-locales';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidUILocale(locale)) {
    notFound();
  }

  // Load translations
  const translations = await getMessagesForLocale(locale as UILocale);

  // Pass translations and locale to the client component
  return (
    <HomePage
      pageConfig={{}}
      translations={translations}
      locale={locale}
    />
  );
}
