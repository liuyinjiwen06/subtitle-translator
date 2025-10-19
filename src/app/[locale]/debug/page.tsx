'use client';

import { useState, useEffect } from 'react';

export default function DebugPage() {
  const [envStatus, setEnvStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkEnvironment();
  }, []);

  const checkEnvironment = async () => {
    try {
      const response = await fetch('/api/check-env');
      const data = await response.json();
      setEnvStatus(data);
    } catch (error) {
      setEnvStatus({ error: '无法获取环境信息' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">检查环境配置中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">环境配置调试</h1>
          
          {envStatus?.error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-red-800 font-medium">错误</h3>
              <p className="text-red-600">{envStatus.error}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* 时间戳 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">检查时间</h3>
                <p className="text-gray-600">{envStatus?.timestamp}</p>
              </div>

              {/* 环境信息 */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">运行环境</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">运行时:</span> {envStatus?.environment?.runtime}</p>
                  <p><span className="font-medium">Node版本:</span> {envStatus?.environment?.nodeVersion}</p>
                </div>
              </div>

              {/* API密钥状态 */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className={`rounded-lg p-4 ${envStatus?.apiKeys?.google?.configured ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <h3 className={`font-medium mb-2 ${envStatus?.apiKeys?.google?.configured ? 'text-green-900' : 'text-red-900'}`}>
                    Google翻译API
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">状态:</span> 
                      <span className={`ml-1 ${envStatus?.apiKeys?.google?.configured ? 'text-green-600' : 'text-red-600'}`}>
                        {envStatus?.apiKeys?.google?.configured ? '✅ 已配置' : '❌ 未配置'}
                      </span>
                    </p>
                    <p><span className="font-medium">长度:</span> {envStatus?.apiKeys?.google?.length}</p>
                    <p><span className="font-medium">前缀:</span> {envStatus?.apiKeys?.google?.prefix}</p>
                  </div>
                </div>

                <div className={`rounded-lg p-4 ${envStatus?.apiKeys?.openai?.configured ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <h3 className={`font-medium mb-2 ${envStatus?.apiKeys?.openai?.configured ? 'text-green-900' : 'text-red-900'}`}>
                    OpenAI API
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">状态:</span> 
                      <span className={`ml-1 ${envStatus?.apiKeys?.openai?.configured ? 'text-green-600' : 'text-red-600'}`}>
                        {envStatus?.apiKeys?.openai?.configured ? '✅ 已配置' : '❌ 未配置'}
                      </span>
                    </p>
                    <p><span className="font-medium">长度:</span> {envStatus?.apiKeys?.openai?.length}</p>
                    <p><span className="font-medium">前缀:</span> {envStatus?.apiKeys?.openai?.prefix}</p>
                  </div>
                </div>
              </div>

              {/* 连通性测试 */}
              <div className="bg-yellow-50 rounded-lg p-4">
                <h3 className="font-medium text-yellow-900 mb-4">网络连通性测试</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-800">Google API</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">状态:</span> 
                        <span className={`ml-1 ${envStatus?.connectivity?.google?.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                          {envStatus?.connectivity?.google?.status === 'success' ? '✅ 正常' : '❌ 失败'}
                        </span>
                      </p>
                      <p><span className="font-medium">响应时间:</span> {envStatus?.connectivity?.google?.time}ms</p>
                      {envStatus?.connectivity?.google?.error && (
                        <p><span className="font-medium">错误:</span> <span className="text-red-600">{envStatus.connectivity.google.error}</span></p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-800">OpenAI API</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">状态:</span> 
                        <span className={`ml-1 ${envStatus?.connectivity?.openai?.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                          {envStatus?.connectivity?.openai?.status === 'success' ? '✅ 正常' : '❌ 失败'}
                        </span>
                      </p>
                      <p><span className="font-medium">响应时间:</span> {envStatus?.connectivity?.openai?.time}ms</p>
                      {envStatus?.connectivity?.openai?.error && (
                        <p><span className="font-medium">错误:</span> <span className="text-red-600">{envStatus.connectivity.openai.error}</span></p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 建议 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">配置建议</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  {!envStatus?.apiKeys?.google?.configured && !envStatus?.apiKeys?.openai?.configured && (
                    <p>⚠️ 没有配置任何翻译API密钥，请至少配置Google或OpenAI其中一个</p>
                  )}
                  {!envStatus?.apiKeys?.google?.configured && envStatus?.apiKeys?.openai?.configured && (
                    <p>💡 建议配置Google翻译API作为备用服务</p>
                  )}
                  {envStatus?.apiKeys?.google?.configured && !envStatus?.apiKeys?.openai?.configured && (
                    <p>💡 建议配置OpenAI API以获得更好的翻译质量</p>
                  )}
                  {envStatus?.connectivity?.openai?.status === 'error' && (
                    <p>🌐 OpenAI API连接失败，可能需要代理或检查网络环境</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={checkEnvironment}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              重新检查
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 