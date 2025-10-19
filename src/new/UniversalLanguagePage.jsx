// UniversalLanguagePage.jsx - 通用语种页面渲染器
import React, { useState, useEffect } from 'react';

// 🎯 组件映射 - 将布局配置中的component名称映射到实际React组件
const COMPONENT_MAP = {
  // 核心组件
  'SEOMeta': SEOMeta,
  'HeroSection': HeroSection,
  'LanguageBenefits': LanguageBenefits,
  'CTASection': CTASection,
  'Footer': Footer,
  
  // 动态组件
  'CultureSection': CultureSection,
  'IndustrySection': IndustrySection,
  'LearningSection': LearningSection,
  'StatsSection': StatsSection,
  'RegionalSection': RegionalSection,
  'TipsSection': TipsSection,
  'ContentSection': ContentSection,
  'TechSection': TechSection,
  'StoriesSection': StoriesSection,
  'FAQSection': FAQSection
};

// 🚀 主要的通用渲染器
const UniversalLanguagePage = ({ languageCode }) => {
  const [layout, setLayout] = useState(null);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLanguagePageData(languageCode);
  }, [languageCode]);

  // 加载语种页面数据
  const loadLanguagePageData = async (langCode) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔄 Loading ${langCode} page data...`);
      
      // 并行加载布局配置和页面内容
      const [layoutResponse, contentResponse] = await Promise.all([
        fetch(`/api/layouts/${langCode}-layout.json`),
        fetch(`/api/content/${langCode}-subtitle-page.json`)
      ]);

      if (!layoutResponse.ok) {
        throw new Error(`Layout not found for ${langCode}`);
      }
      
      if (!contentResponse.ok) {
        throw new Error(`Content not found for ${langCode}`);
      }

      const layoutData = await layoutResponse.json();
      const contentData = await contentResponse.json();

      console.log(`✅ Loaded ${langCode} page:`, {
        sections: layoutData.sections.length,
        title: layoutData.title
      });

      setLayout(layoutData);
      setContent(contentData);
      
    } catch (err) {
      console.error(`❌ Failed to load ${langCode} page:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 渲染状态处理
  if (loading) {
    return <PageLoadingSkeleton languageCode={languageCode} />;
  }

  if (error) {
    return <PageErrorView error={error} languageCode={languageCode} onRetry={() => loadLanguagePageData(languageCode)} />;
  }

  if (!layout || !content) {
    return <PageNotFoundView languageCode={languageCode} />;
  }

  return (
    <div className={`universal-language-page language-${languageCode}`}>
      {/* SEO Head - 特殊处理 */}
      <PageHead seo={content.seo} language={content.language} />
      
      {/* 动态渲染所有sections */}
      <main className="page-content">
        {layout.sections
          .filter(section => section.id !== 'seo') // SEO已经在head中处理
          .sort((a, b) => a.order - b.order)
          .map(section => (
            <SectionRenderer
              key={section.id}
              section={section}
              content={content}
              language={content.language}
            />
          ))}
      </main>
      
      {/* 页面底部信息 */}
      <PageDebugInfo layout={layout} content={content} />
    </div>
  );
};

// 🧩 Section渲染器 - 核心组件
const SectionRenderer = ({ section, content, language }) => {
  // 获取对应的React组件
  const Component = COMPONENT_MAP[section.component];
  
  if (!Component) {
    console.warn(`⚠️ Component ${section.component} not found for section ${section.id}`);
    return <FallbackSection section={section} />;
  }

  // 获取section的数据
  const sectionData = getSectionData(section, content);
  
  // 必需section但没有数据 = 错误
  if (!sectionData && section.required) {
    console.error(`❌ Required section ${section.id} has no data`);
    return <ErrorSection section={section} />;
  }

  // 可选section没有数据 = 不渲染
  if (!sectionData && !section.required) {
    console.log(`⚪ Optional section ${section.id} skipped (no data)`);
    return null;
  }

  return (
    <section 
      id={`section-${section.id}`}
      className={`page-section section-${section.type} ${section.required ? 'required' : 'optional'}`}
      data-component={section.component}
      data-section-type={section.type}
    >
      <Component 
        data={sectionData}
        language={language}
        sectionConfig={section}
        className={`${section.component.toLowerCase()}-wrapper`}
      />
    </section>
  );
};

// 🔍 获取section数据的智能函数
function getSectionData(section, content) {
  const sectionId = section.id;
  const sectionType = section.type;
  
  // 1. 直接通过ID查找
  if (content[sectionId]) {
    return content[sectionId];
  }
  
  // 2. 通过type查找
  if (content[sectionType]) {
    return content[sectionType];
  }
  
  // 3. 在dynamicSections中查找
  if (content.dynamicSections && content.dynamicSections[sectionId]) {
    return content.dynamicSections[sectionId].data || content.dynamicSections[sectionId];
  }
  
  // 4. 兼容旧格式的特殊处理
  const alternativeKeys = [
    sectionId.replace(/([A-Z])/g, '_$1').toLowerCase(), // camelCase to snake_case
    sectionId.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`), // camelCase to kebab-case
    sectionType
  ];
  
  for (const key of alternativeKeys) {
    if (content[key]) {
      return content[key];
    }
  }
  
  console.log(`🔍 Section data not found for ${sectionId}/${sectionType}`);
  return null;
}

// 📱 页面组件们

const PageHead = ({ seo, language }) => {
  useEffect(() => {
    if (seo?.title) {
      document.title = seo.title;
    }
    
    if (seo?.description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', seo.description);
      }
    }
  }, [seo]);

  return null; // SEO数据通过useEffect设置到document
};

const PageLoadingSkeleton = ({ languageCode }) => (
  <div className="page-loading-skeleton">
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      <div className="h-32 bg-gray-200 rounded"></div>
      <div className="h-64 bg-gray-200 rounded"></div>
      <div className="h-48 bg-gray-200 rounded"></div>
      <div className="h-24 bg-gray-200 rounded"></div>
    </div>
    <p className="text-center mt-4 text-gray-500">
      Loading {languageCode} page...
    </p>
  </div>
);

const PageErrorView = ({ error, languageCode, onRetry }) => (
  <div className="page-error-view text-center p-8">
    <h1 className="text-2xl font-bold text-red-600 mb-4">
      Failed to load {languageCode} page
    </h1>
    <p className="text-gray-600 mb-6">{error}</p>
    <div className="space-x-4">
      <button 
        onClick={onRetry}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Retry
      </button>
      <button 
        onClick={() => window.location.href = '/'}
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        Back to Home
      </button>
    </div>
  </div>
);

const PageNotFoundView = ({ languageCode }) => (
  <div className="page-not-found text-center p-8">
    <h1 className="text-2xl font-bold mb-4">
      Language "{languageCode}" not found
    </h1>
    <p className="text-gray-600 mb-6">
      This language page hasn't been generated yet.
    </p>
    <button 
      onClick={() => window.location.href = '/'}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      View Available Languages
    </button>
  </div>
);

const FallbackSection = ({ section }) => (
  <div className="fallback-section p-4 border-2 border-dashed border-gray-300 bg-gray-50">
    <h3 className="font-bold text-gray-700">
      Section: {section.title || section.id}
    </h3>
    <p className="text-gray-500">
      Component "{section.component}" not implemented yet
    </p>
    <p className="text-xs text-gray-400 mt-2">
      Type: {section.type} | Required: {section.required ? 'Yes' : 'No'}
    </p>
  </div>
);

const ErrorSection = ({ section }) => (
  <div className="error-section p-4 bg-red-50 border border-red-200">
    <h3 className="font-bold text-red-700">
      Error in section: {section.id}
    </h3>
    <p className="text-red-600">
      Required data missing for {section.component}
    </p>
  </div>
);

const PageDebugInfo = ({ layout, content }) => {
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div className="page-debug-info fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs max-w-xs">
      <div>Language: {layout.language}</div>
      <div>Sections: {layout.sections.length}</div>
      <div>Quality: {content.generation?.qualityScore}/100</div>
      <div>Generated: {new Date(content.generatedAt).toLocaleDateString()}</div>
    </div>
  );
};

// 🔌 Next.js 集成示例

// pages/languages/[language].js 或 app/languages/[language]/page.js
const LanguageSubtitlePage = ({ params }) => {
  const { language } = params;
  
  return (
    <div className="min-h-screen">
      {/* 网站头部 */}
      <Header />
      
      {/* 主要内容 - 使用通用渲染器 */}
      <UniversalLanguagePage languageCode={language} />
      
      {/* 网站底部 */}
      <SiteFooter />
    </div>
  );
};

// 🚀 静态生成支持（Next.js App Router）
export async function generateStaticParams() {
  try {
    // 读取布局索引获取所有支持的语种
    const layoutIndexPath = path.join(process.cwd(), 'public/api/layouts/index.json');
    const layoutIndex = JSON.parse(fs.readFileSync(layoutIndexPath, 'utf8'));
    
    return Object.keys(layoutIndex.languages).map(languageCode => ({
      language: languageCode
    }));
  } catch (error) {
    console.error('Failed to generate static params:', error);
    return [{ language: 'english' }]; // 默认至少生成英语页面
  }
}

// 📡 API路由示例

// pages/api/layouts/[...path].js 或 app/api/layouts/[...path]/route.js
export async function GET(request, { params }) {
  const { path } = params;
  const filePath = path.join('/');
  
  try {
    const fullPath = path.join(process.cwd(), 'generated-content/layouts', filePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    return Response.json(JSON.parse(content), {
      headers: {
        'Cache-Control': 'public, max-age=3600', // 缓存1小时
      }
    });
  } catch (error) {
    return Response.json(
      { error: 'Layout not found', path: filePath }, 
      { status: 404 }
    );
  }
}

// pages/api/content/[...path].js
export async function GET(request, { params }) {
  const { path } = params;
  const filePath = path.join('/');
  
  try {
    const fullPath = path.join(process.cwd(), 'generated-content', filePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    return Response.json(JSON.parse(content), {
      headers: {
        'Cache-Control': 'public, max-age=3600',
      }
    });
  } catch (error) {
    return Response.json(
      { error: 'Content not found', path: filePath }, 
      { status: 404 }
    );
  }
}

// 🎯 使用示例

// 在任何页面中使用：
const App = () => {
  return (
    <div>
      {/* 英语页面 */}
      <UniversalLanguagePage languageCode="english" />
      
      {/* 中文页面 */}
      <UniversalLanguagePage languageCode="chinese" />
      
      {/* 西班牙语页面 */}
      <UniversalLanguagePage languageCode="spanish" />
      
      {/* 支持任意语种，只要生成了对应的文件 */}
    </div>
  );
};

export { 
  UniversalLanguagePage, 
  SectionRenderer, 
  LanguageSubtitlePage,
  generateStaticParams,
  COMPONENT_MAP 
};