import { PageConfig } from '@/lib/pageConfig';
import SubtitleTranslator from './SubtitleTranslator';
import Link from 'next/link';

interface ServerPageTemplateProps {
  pageConfig: PageConfig;
  className?: string;
}

export default function ServerPageTemplate({ pageConfig, className = "" }: ServerPageTemplateProps) {
  // 根据页面类型设置静态内容
  const getStaticContent = () => {
    if (pageConfig.pageKey === 'englishSubtitle') {
      return {
        heroTitle: 'English Subtitle Translator',
        heroSubtitle: 'Professional English subtitle translation service. Convert subtitles to English with AI-powered translation.',
        breadcrumbTitle: 'English Subtitle Tool'
      };
    } else if (pageConfig.pageKey === 'chineseSubtitle') {
      return {
        heroTitle: '中文字幕翻译工具',
        heroSubtitle: '专业中文字幕翻译服务，AI智能翻译字幕至中文。支持SRT格式，免费、快速、准确。',
        breadcrumbTitle: '中文字幕工具'
      };
    }
    return {
      heroTitle: '字幕翻译工具',
      heroSubtitle: '专业字幕翻译服务',
      breadcrumbTitle: '字幕工具'
    };
  };

  const content = getStaticContent();

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 ${className}`}>
      {/* 语言切换器占位 - 将由客户端组件处理 */}
      <div className="fixed top-6 right-6 z-50">
        <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-2 shadow-lg">
          <span className="text-sm text-gray-600">🌐</span>
          <span className="text-sm font-medium text-gray-700">Language</span>
        </div>
      </div>

      {/* Hero区域 */}
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 面包屑导航 */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  字幕翻译工具
                </Link>
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-900 font-medium">
                  {content.breadcrumbTitle}
                </span>
              </li>
            </ol>
          </nav>

          {/* 页面标题和描述 */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {content.heroTitle}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {content.heroSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* 翻译器组件 */}
      <div className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SubtitleTranslator pageConfig={pageConfig} />
        </div>
      </div>

      {/* 静态优势展示 */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {pageConfig.pageKey === 'englishSubtitle' ? 'Why Choose Our English Translator?' : '为什么选择我们的中文翻译？'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {pageConfig.pageKey === 'englishSubtitle' 
                ? 'Professional translation service with advanced AI technology'
                : '专业翻译服务，采用先进AI技术'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pageConfig.pageKey === 'englishSubtitle' ? (
              <>
                <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Accurate Translation</h3>
                  <p className="text-gray-600">AI-powered translation ensures high accuracy and natural English expression.</p>
                </div>
                <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm">
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Fast Processing</h3>
                  <p className="text-gray-600">Quick subtitle translation with real-time progress tracking.</p>
                </div>
                <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm">
                  <div className="text-4xl mb-4">🆓</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Completely Free</h3>
                  <p className="text-gray-600">No registration required, unlimited usage for all users.</p>
                </div>
              </>
            ) : (
              <>
                <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">精准翻译</h3>
                  <p className="text-gray-600">AI智能翻译，确保高准确度和自然的中文表达。</p>
                </div>
                <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm">
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">快速处理</h3>
                  <p className="text-gray-600">快速字幕翻译，实时进度跟踪。</p>
                </div>
                <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm">
                  <div className="text-4xl mb-4">🆓</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">完全免费</h3>
                  <p className="text-gray-600">无需注册，所有用户无限制使用。</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 