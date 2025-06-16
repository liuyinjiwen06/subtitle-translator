import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '页面未找到 - 字幕翻译工具 | Page Not Found - Subtitle Translator',
  description: '抱歉，您访问的页面不存在。返回首页继续使用字幕翻译工具。Sorry, the page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center px-4">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            页面未找到 / Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            抱歉，您访问的页面不存在。请检查网址是否正确，或返回首页继续使用。
            <br />
            Sorry, the page you are looking for does not exist. Please check the URL or return to the homepage.
          </p>
        </div>
        
        <div className="space-y-4">
          <a
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            返回首页 / Back to Home
          </a>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <a
              href="/english-subtitle"
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              English Subtitle Tool
            </a>
            <a
              href="/chinese-subtitle"
              className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              中文字幕工具
            </a>
          </div>
        </div>
        
        <div className="mt-12 text-sm text-gray-500">
          <p>如果您认为这是一个错误，请联系我们。</p>
          <p>If you believe this is an error, please contact us.</p>
        </div>
      </div>
    </div>
  );
} 