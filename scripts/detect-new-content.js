#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const ContentMerger = require('./merge-content-to-i18n');

/**
 * 自动检测新的内容文件并提供合并建议
 * 
 * 使用方法:
 * node scripts/detect-new-content.js           # 检测所有新内容
 * node scripts/detect-new-content.js --merge   # 检测并自动合并
 * node scripts/detect-new-content.js --list    # 仅列出文件
 */

class ContentDetector {
  constructor() {
    this.rootDir = path.resolve(__dirname, '..');
    this.generatedContentDir = path.join(this.rootDir, 'public/generated-content');
    this.localesDir = path.join(this.rootDir, 'src/lib/locales');
    
    // 语言代码映射
    this.languageMapping = {
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
      'turkish': 'tr',
      'polish': 'pl',
      'dutch': 'nl',
      'swedish': 'sv'
    };
  }

  /**
   * 扫描并检测新内容文件
   */
  async detectNewContent() {
    console.log('🔍 扫描生成内容目录...\n');

    if (!fs.existsSync(this.generatedContentDir)) {
      console.error(`❌ 生成内容目录不存在: ${this.generatedContentDir}`);
      return [];
    }

    // 1. 获取所有内容文件
    const contentFiles = this.getContentFiles();
    console.log(`📁 发现 ${contentFiles.length} 个内容文件:`);
    contentFiles.forEach(file => console.log(`   - ${file}`));

    // 2. 检查每个文件的合并状态
    const detectionResults = [];
    
    for (const file of contentFiles) {
      const result = await this.checkFileStatus(file);
      detectionResults.push(result);
    }

    // 3. 显示检测结果
    this.displayResults(detectionResults);
    
    return detectionResults;
  }

  /**
   * 获取所有内容文件
   */
  getContentFiles() {
    const files = fs.readdirSync(this.generatedContentDir);
    return files.filter(file => 
      file.endsWith('-subtitle-page.json') && 
      fs.statSync(path.join(this.generatedContentDir, file)).isFile()
    );
  }

  /**
   * 检查单个文件的状态
   */
  async checkFileStatus(filename) {
    const languageCode = filename.replace('-subtitle-page.json', '');
    const targetLocale = this.languageMapping[languageCode] || languageCode;
    
    const result = {
      filename,
      languageCode,
      targetLocale,
      contentExists: true,
      localeFileExists: false,
      hasPageContent: false,
      hasLayoutContent: false,
      needsMerging: false,
      error: null
    };

    try {
      // 检查目标语言文件是否存在
      const localeFilePath = path.join(this.localesDir, `${targetLocale}.json`);
      result.localeFileExists = fs.existsSync(localeFilePath);

      // 检查是否已经有页面内容
      if (result.localeFileExists) {
        const localeContent = JSON.parse(fs.readFileSync(localeFilePath, 'utf8'));
        const pageKey = `${languageCode}Subtitle`;
        result.hasPageContent = !!localeContent[pageKey];
        result.hasLayoutContent = !!(localeContent.layout && localeContent.layout[languageCode]);
      }

      // 判断是否需要合并
      result.needsMerging = !result.hasPageContent || !result.hasLayoutContent;

    } catch (error) {
      result.error = error.message;
      result.needsMerging = true;
    }

    return result;
  }

  /**
   * 显示检测结果
   */
  displayResults(results) {
    console.log('\n📊 检测结果:\n');

    const needsMerging = results.filter(r => r.needsMerging);
    const alreadyMerged = results.filter(r => !r.needsMerging);

    if (needsMerging.length > 0) {
      console.log('🆕 需要合并的内容文件:');
      needsMerging.forEach(result => {
        const status = [];
        if (!result.localeFileExists) status.push('缺少语言文件');
        if (!result.hasPageContent) status.push('缺少页面内容');
        if (!result.hasLayoutContent) status.push('缺少布局内容');
        if (result.error) status.push(`错误: ${result.error}`);

        console.log(`   ⭐ ${result.languageCode} → ${result.targetLocale}.json`);
        console.log(`      状态: ${status.join(', ')}`);
        console.log(`      建议: node scripts/merge-content-to-i18n.js ${result.languageCode} ${result.targetLocale}`);
      });
    }

    if (alreadyMerged.length > 0) {
      console.log('\n✅ 已合并的内容文件:');
      alreadyMerged.forEach(result => {
        console.log(`   ✓ ${result.languageCode} → ${result.targetLocale}.json (已完成)`);
      });
    }

    console.log(`\n📈 统计: ${needsMerging.length} 个需要合并, ${alreadyMerged.length} 个已完成`);
  }

  /**
   * 自动合并所有需要的内容
   */
  async autoMergeAll() {
    const results = await this.detectNewContent();
    const needsMerging = results.filter(r => r.needsMerging);

    if (needsMerging.length === 0) {
      console.log('\n🎉 所有内容都已合并，无需操作！');
      return;
    }

    console.log(`\n🚀 开始自动合并 ${needsMerging.length} 个文件...\n`);

    const merger = new ContentMerger();
    let successCount = 0;
    let errorCount = 0;

    for (const result of needsMerging) {
      try {
        console.log(`${'='.repeat(50)}`);
        await merger.mergeContent(result.languageCode, result.targetLocale);
        successCount++;
        
        // 添加延迟避免文件操作冲突
        await this.delay(500);
        
      } catch (error) {
        console.error(`❌ 合并 ${result.languageCode} 失败:`, error.message);
        errorCount++;
      }
    }

    console.log(`\n📊 合并完成统计:`);
    console.log(`   ✅ 成功: ${successCount} 个`);
    console.log(`   ❌ 失败: ${errorCount} 个`);

    if (successCount > 0) {
      console.log(`\n🎯 建议下一步: 使用翻译脚本翻译新合并的内容`);
      console.log(`   node scripts/translate-content.js all`);
    }
  }

  /**
   * 仅列出所有内容文件
   */
  async listContentFiles() {
    console.log('📋 生成内容文件列表:\n');

    const contentFiles = this.getContentFiles();
    
    if (contentFiles.length === 0) {
      console.log('   (未找到内容文件)');
      return;
    }

    contentFiles.forEach(file => {
      const languageCode = file.replace('-subtitle-page.json', '');
      const targetLocale = this.languageMapping[languageCode] || languageCode;
      const fileSize = this.getFileSize(path.join(this.generatedContentDir, file));
      
      console.log(`📄 ${file}`);
      console.log(`   语言: ${languageCode} → ${targetLocale}`);
      console.log(`   大小: ${fileSize}`);
      console.log('');
    });

    console.log(`📊 总计: ${contentFiles.length} 个文件`);
  }

  /**
   * 获取文件大小
   */
  getFileSize(filePath) {
    const stats = fs.statSync(filePath);
    const bytes = stats.size;
    
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  /**
   * 延迟函数
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 显示帮助信息
   */
  showHelp() {
    console.log(`
📚 内容检测脚本使用说明

用法:
  node scripts/detect-new-content.js [选项]

选项:
  (无参数)    检测所有新内容文件并显示状态
  --merge     检测并自动合并所有需要的内容
  --list      仅列出所有内容文件
  --help      显示此帮助信息

示例:
  node scripts/detect-new-content.js           # 检测新内容
  node scripts/detect-new-content.js --merge   # 自动合并
  node scripts/detect-new-content.js --list    # 列出文件

功能说明:
- 自动扫描 public/generated-content/ 目录
- 检测哪些内容文件还未合并到 i18n 系统
- 提供自动合并功能
- 支持批量处理多个语言文件

支持的语言映射:
${Object.entries(this.languageMapping).map(([lang, code]) => `  ${lang} → ${code}`).join('\n')}
`);
  }
}

// 主执行逻辑
async function main() {
  const args = process.argv.slice(2);
  const detector = new ContentDetector();

  try {
    if (args.includes('--help') || args.includes('-h')) {
      detector.showHelp();
    } else if (args.includes('--merge')) {
      await detector.autoMergeAll();
    } else if (args.includes('--list')) {
      await detector.listContentFiles();
    } else {
      await detector.detectNewContent();
      console.log('\n💡 提示:');
      console.log('   使用 --merge 参数可自动合并所有需要的内容');
      console.log('   使用 --list 参数可查看所有文件列表');
    }
  } catch (error) {
    console.error('❌ 执行失败:', error.message);
    process.exit(1);
  }
}

// 运行脚本
if (require.main === module) {
  main().catch(console.error);
}

module.exports = ContentDetector;