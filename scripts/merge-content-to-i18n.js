#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 通用脚本：将生成的内容文件合并到 i18n 翻译文件中
 * 
 * 使用方法:
 * node scripts/merge-content-to-i18n.js <language-code> [target-locale]
 * 
 * 例如:
 * node scripts/merge-content-to-i18n.js chinese zh
 * node scripts/merge-content-to-i18n.js english en
 * node scripts/merge-content-to-i18n.js spanish es
 */

class ContentMerger {
  constructor() {
    this.rootDir = path.resolve(__dirname, '..');
    this.generatedContentDir = path.join(this.rootDir, 'public/generated-content');
    this.localesDir = path.join(this.rootDir, 'src/lib/locales');
  }

  /**
   * 主要合并逻辑
   */
  async mergeContent(languageCode, targetLocale) {
    try {
      console.log(`🚀 开始合并 ${languageCode} 内容到 ${targetLocale}.json...`);

      // 1. 读取生成的内容文件
      const contentData = await this.loadGeneratedContent(languageCode);
      const layoutData = await this.loadLayoutContent(languageCode);

      // 2. 读取现有的翻译文件
      const existingTranslations = await this.loadExistingTranslations(targetLocale);

      // 3. 转换和合并数据
      const mergedTranslations = this.mergeTranslations(
        existingTranslations,
        contentData,
        layoutData,
        languageCode
      );

      // 4. 写入更新后的翻译文件
      await this.saveTranslations(targetLocale, mergedTranslations);

      console.log(`✅ 成功合并 ${languageCode} 内容到 ${targetLocale}.json`);
      console.log(`📄 输出文件: ${path.join(this.localesDir, `${targetLocale}.json`)}`);

    } catch (error) {
      console.error(`❌ 合并失败:`, error.message);
      process.exit(1);
    }
  }

  /**
   * 加载生成的页面内容
   */
  async loadGeneratedContent(languageCode) {
    const contentPath = path.join(this.generatedContentDir, `${languageCode}-subtitle-page.json`);
    
    if (!fs.existsSync(contentPath)) {
      throw new Error(`内容文件不存在: ${contentPath}`);
    }

    const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
    console.log(`📖 已加载内容文件: ${languageCode}-subtitle-page.json`);
    return content;
  }

  /**
   * 加载布局配置
   */
  async loadLayoutContent(languageCode) {
    const layoutPath = path.join(this.generatedContentDir, 'layouts', `${languageCode}-layout.json`);
    
    if (!fs.existsSync(layoutPath)) {
      console.log(`⚠️  布局文件不存在，跳过: ${layoutPath}`);
      return null;
    }

    const layout = JSON.parse(fs.readFileSync(layoutPath, 'utf8'));
    console.log(`📖 已加载布局文件: ${languageCode}-layout.json`);
    return layout;
  }

  /**
   * 加载现有翻译文件
   */
  async loadExistingTranslations(locale) {
    const translationsPath = path.join(this.localesDir, `${locale}.json`);
    
    if (!fs.existsSync(translationsPath)) {
      console.log(`⚠️  翻译文件不存在，将创建新文件: ${translationsPath}`);
      return {};
    }

    const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));
    console.log(`📖 已加载现有翻译文件: ${locale}.json`);
    return translations;
  }

  /**
   * 合并翻译数据
   */
  mergeTranslations(existingTranslations, contentData, layoutData, languageCode) {
    const merged = { ...existingTranslations };

    // 1. 合并页面特定内容
    const pageKey = `${languageCode}Subtitle`;
    merged[pageKey] = {
      ...merged[pageKey],
      ...this.transformContentData(contentData, languageCode)
    };

    // 2. 合并布局信息
    if (layoutData) {
      merged.layout = {
        ...merged.layout,
        [languageCode]: this.transformLayoutData(layoutData)
      };
    }

    // 3. 合并通用导航翻译（如果内容中有相关信息）
    if (contentData.navigation) {
      merged.nav = {
        ...merged.nav,
        ...this.transformNavigationData(contentData.navigation)
      };
    }

    return merged;
  }

  /**
   * 转换内容数据为翻译格式
   */
  transformContentData(contentData, languageCode) {
    const transformed = {};

    // SEO 信息
    if (contentData.seo) {
      transformed.seo = {
        title: contentData.seo.title,
        description: contentData.seo.description,
        keywords: contentData.seo.keywords
      };
    }

    // Hero 区域
    if (contentData.hero) {
      transformed.hero = {
        title: contentData.hero.title,
        description: contentData.hero.description,
        flag: contentData.hero.flag
      };
    }

    // 语言优势
    if (contentData.languageBenefits) {
      transformed.benefits = {
        title: contentData.languageBenefits.title,
        subtitle: contentData.languageBenefits.subtitle,
        items: {}
      };

      if (contentData.languageBenefits.benefits) {
        contentData.languageBenefits.benefits.forEach((benefit, index) => {
          const key = benefit.key || `benefit_${index}`;
          transformed.benefits.items[key] = {
            icon: benefit.icon,
            title: benefit.title,
            description: benefit.description
          };
        });
      }
    }

    // 使用案例
    if (contentData.industryUseCases) {
      transformed.useCases = {
        title: contentData.industryUseCases.title,
        subtitle: contentData.industryUseCases.subtitle,
        items: {}
      };

      if (contentData.industryUseCases.cases) {
        contentData.industryUseCases.cases.forEach((useCase, index) => {
          const key = useCase.key || `case_${index}`;
          transformed.useCases.items[key] = {
            icon: useCase.icon,
            title: useCase.title,
            description: useCase.description
          };
        });
      }
    }

    // 语言统计
    if (contentData.languageStats) {
      transformed.stats = {
        title: contentData.languageStats.title,
        subtitle: contentData.languageStats.subtitle,
        items: {}
      };

      if (contentData.languageStats.stats) {
        contentData.languageStats.stats.forEach((stat, index) => {
          const key = stat.key || `stat_${index}`;
          transformed.stats.items[key] = {
            icon: stat.icon,
            number: stat.number,
            title: stat.title,
            description: stat.description
          };
        });
      }
    }

    // FAQ
    if (contentData.faq || contentData.common_questions) {
      const faqData = contentData.faq || contentData.common_questions;
      transformed.faq = {
        title: faqData.title,
        subtitle: faqData.subtitle,
        items: {}
      };

      if (faqData.questions) {
        faqData.questions.forEach((qa, index) => {
          const key = qa.key || `faq_${index}`;
          transformed.faq.items[key] = {
            question: qa.question,
            answer: qa.answer
          };
        });
      }
    }

    // CTA 区域
    if (contentData.cta) {
      transformed.cta = {
        title: contentData.cta.title,
        description: contentData.cta.description,
        buttonText: contentData.cta.buttonText || contentData.cta.button_text
      };
    }

    return transformed;
  }

  /**
   * 转换布局数据
   */
  transformLayoutData(layoutData) {
    const transformed = {
      title: layoutData.title,
      description: layoutData.description,
      sections: {},
      metadata: layoutData.metadata
    };

    if (layoutData.sections) {
      layoutData.sections.forEach(section => {
        transformed.sections[section.id] = {
          title: section.title,
          component: section.component,
          order: section.order,
          required: section.required,
          optional: section.optional
        };
      });
    }

    return transformed;
  }

  /**
   * 转换导航数据
   */
  transformNavigationData(navigationData) {
    return {
      home: navigationData.home || '首页',
      english_subtitle: navigationData.english_subtitle || '英文字幕翻译器',
      chinese_subtitle: navigationData.chinese_subtitle || '中文字幕翻译器'
    };
  }

  /**
   * 保存翻译文件
   */
  async saveTranslations(locale, translations) {
    const translationsPath = path.join(this.localesDir, `${locale}.json`);
    
    // 确保目录存在
    if (!fs.existsSync(this.localesDir)) {
      fs.mkdirSync(this.localesDir, { recursive: true });
    }

    // 格式化并写入文件
    const formattedJson = JSON.stringify(translations, null, 2);
    fs.writeFileSync(translationsPath, formattedJson, 'utf8');
    
    console.log(`💾 已保存翻译文件: ${translationsPath}`);
  }

  /**
   * 显示帮助信息
   */
  showHelp() {
    console.log(`
📚 内容合并脚本使用说明

用法:
  node scripts/merge-content-to-i18n.js <language-code> [target-locale]

参数:
  language-code    生成内容的语言代码 (例如: chinese, english, spanish)
  target-locale    目标翻译文件的语言代码 (例如: zh, en, es)
                   如果不提供，将自动推断

示例:
  node scripts/merge-content-to-i18n.js chinese zh
  node scripts/merge-content-to-i18n.js english en
  node scripts/merge-content-to-i18n.js spanish es

支持的语言映射:
  chinese  -> zh
  english  -> en
  spanish  -> es
  french   -> fr
  german   -> de
  japanese -> ja
  korean   -> ko
`);
  }

  /**
   * 自动推断目标语言代码
   */
  inferTargetLocale(languageCode) {
    const mapping = {
      'chinese': 'zh',
      'english': 'en',
      'spanish': 'es',
      'french': 'fr',
      'german': 'de',
      'japanese': 'ja',
      'korean': 'ko',
      'portuguese': 'pt',
      'italian': 'it',
      'russian': 'ru',
      'arabic': 'ar',
      'hindi': 'hi',
      'thai': 'th',
      'vietnamese': 'vi',
      'dutch': 'nl',
      'swedish': 'sv',
      'norwegian': 'no'
    };

    return mapping[languageCode.toLowerCase()] || languageCode.substring(0, 2);
  }
}

// 主执行逻辑
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    new ContentMerger().showHelp();
    return;
  }

  const languageCode = args[0];
  const merger = new ContentMerger();
  const targetLocale = args[1] || merger.inferTargetLocale(languageCode);

  console.log(`🎯 语言代码: ${languageCode}`);
  console.log(`🎯 目标语言: ${targetLocale}`);
  console.log('');

  await merger.mergeContent(languageCode, targetLocale);
}

// 运行脚本
if (require.main === module) {
  main().catch(console.error);
}

module.exports = ContentMerger; 