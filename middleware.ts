import { NextRequest, NextResponse } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { i18nConfig } from './i18nConfig';

// 语言代码到名称的映射
const langCodeToName: Record<string, string> = {
  'en': 'english',
  'zh': 'chinese',
  'es': 'spanish',
  'fr': 'french',
  'pt': 'portuguese'
};

// 语言名称到代码的映射
const langNameToCode: Record<string, string> = Object.entries(langCodeToName).reduce((acc, [code, name]) => {
  acc[name] = code;
  return acc;
}, {} as Record<string, string>);

function getLocale(request: NextRequest): string {
  // 检查cookie中的语言设置
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && i18nConfig.locales.includes(cookieLocale as any)) {
    return cookieLocale;
  }

  // 从Accept-Language头部获取首选语言
  const acceptLanguage = request.headers.get('Accept-Language');
  if (!acceptLanguage) return i18nConfig.defaultLocale;

  const headers = { 'accept-language': acceptLanguage };
  const languages = new Negotiator({ headers }).languages();
  
  try {
    return match(languages, i18nConfig.locales as any, i18nConfig.defaultLocale);
  } catch {
    return i18nConfig.defaultLocale;
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // 跳过静态资源和API路由
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // 检查是否使用了旧格式的URL（如 /chinese-subtitle/spanish-subtitle）
  const oldFormatMatch = pathname.match(/^\/([a-z]+-subtitle)\/([a-z]+-subtitle)$/);
  if (oldFormatMatch) {
    const [_, sourcePath, targetPath] = oldFormatMatch;
    // 从源路径中提取语言名称
    const sourceMatch = sourcePath.match(/^([a-z]+)-subtitle$/);
    if (sourceMatch) {
      const sourceLangName = sourceMatch[1];
      // 获取对应的语言代码，如果没有找到就使用默认语言
      const sourceLangCode = langNameToCode[sourceLangName] || i18nConfig.defaultLocale;
      return NextResponse.redirect(new URL(`/${sourceLangCode}/${targetPath}`, request.url));
    }
  }

  // 检查路径是否已经包含语言前缀
  const pathnameHasLocale = i18nConfig.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // 如果路径没有语言前缀，这可能是英语（默认语言）的请求
  if (!pathnameHasLocale) {
    // 检测用户的首选语言
    const locale = getLocale(request);
    
    // 如果首选语言不是英语，重定向到相应的语言前缀
    if (locale !== 'en') {
      return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
    }
    
    // 如果是英语，继续处理（让根路径的page.tsx处理重定向）
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // 跳过所有内部路径 (_next)
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)',
    // 可选：只在根路径上运行
    '/',
    '/(api|trpc)(.*)'
  ]
}; 