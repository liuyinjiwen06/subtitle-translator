import createMiddleware from 'next-intl/middleware';
import { UI_LOCALES, DEFAULT_LOCALE } from './config/ui-locales';

export default createMiddleware({
  locales: UI_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'always', // 总是显示语言前缀: /en, /zh
});

export const config = {
  // 匹配所有路径，除了 api、_next、静态文件
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
