#!/usr/bin/env node

/**
 * 简单合并脚本
 * 读取 simple-merge-config.js 中的文件列表，合并到 en.json
 */

const config = require('./simple-merge-config');
const ContentMerger = require('./merge-content-to-i18n');
const fs = require('fs');
const path = require('path');

class SimpleMerger {
  constructor() {
    this.merger = new ContentMerger();
    this.rootDir = path.resolve(__dirname, '..');
  }

  /**
   * 执行简单合并
   */
  async executeMerge() {
    console.log('🚀 开始简单合并任务...\n');
    
    console.log('📋 配置信息:');
    console.log(`   源文件目录: ${config.sourceDir}`);
    console.log(`   目标文件: ${config.targetDir}/${config.targetLocale}.json`);
    console.log(`   要合并的文件数: ${config.filesToMerge.length}`);
    console.log('');

    let successCount = 0;
    let failCount = 0;
    let skipCount = 0;

    // 处理每个文件
    for (let i = 0; i < config.filesToMerge.length; i++) {
      const fileName = config.filesToMerge[i];
      const filePath = path.join(this.rootDir, config.sourceDir, fileName);
      
      console.log(`\n🔄 [${i + 1}/${config.filesToMerge.length}] 处理: ${fileName}`);
      
      // 检查文件是否存在
      if (!fs.existsSync(filePath)) {
        console.log(`   ⚠️  跳过: 文件不存在 - ${filePath}`);
        skipCount++;
        continue;
      }

      try {
        // 从文件名推断语言代码
        const languageCode = fileName.replace('-subtitle-page.json', '').replace('-layout.json', '');
        console.log(`   📝 语言代码: ${languageCode}`);
        console.log(`   📄 文件路径: ${filePath}`);
        
        // 执行合并
        await this.merger.mergeContent(languageCode, config.targetLocale);
        
        console.log(`   ✅ 成功合并到 ${config.targetLocale}.json`);
        successCount++;
        
      } catch (error) {
        console.error(`   ❌ 合并失败:`, error.message);
        failCount++;
        
        if (!config.options.continueOnError) {
          throw error;
        }
      }
    }

    console.log('\n📊 合并完成:');
    console.log(`   ✅ 成功: ${successCount} 个`);
    console.log(`   ❌ 失败: ${failCount} 个`);
    console.log(`   ⚠️  跳过: ${skipCount} 个`);
    
    if (successCount > 0) {
      console.log(`\n🎉 合并完成！请检查 ${config.targetDir}/${config.targetLocale}.json 文件`);
    }
  }

  /**
   * 显示可用文件
   */
  listAvailableFiles() {
    console.log('📋 扫描可用文件...\n');
    
    const sourceDir = path.join(this.rootDir, config.sourceDir);
    
    if (!fs.existsSync(sourceDir)) {
      console.log(`❌ 源文件目录不存在: ${sourceDir}`);
      return;
    }

    const files = fs.readdirSync(sourceDir);
    const subtitleFiles = files.filter(file => file.endsWith('-subtitle-page.json'));
    
    console.log('✅ 可用的字幕页面文件:');
    subtitleFiles.forEach(file => {
      const isConfigured = config.filesToMerge.includes(file);
      const status = isConfigured ? '✅ 已配置' : '⚪ 未配置';
      console.log(`   ${status} ${file}`);
    });
    
    console.log('\n💡 提示:');
    console.log('   将文件名添加到 scripts/simple-merge-config.js 的 filesToMerge 数组中');
    console.log('   例如: "spanish-subtitle-page.json",');
  }

  /**
   * 显示帮助
   */
  showHelp() {
    console.log(`
📚 简单合并脚本使用说明

用法:
  node scripts/simple-merge.js [选项]

选项:
  --list, -l      列出所有可用的文件
  --help, -h      显示帮助信息

步骤:
  1. 编辑 scripts/simple-merge-config.js 文件
  2. 在 filesToMerge 数组中添加要合并的文件名
  3. 运行 node scripts/simple-merge.js

示例配置 (scripts/simple-merge-config.js):
  filesToMerge: [
    'spanish-subtitle-page.json',
    'portuguese-subtitle-page.json',
    'french-subtitle-page.json'
  ]

当前配置:
  目标文件: ${config.targetDir}/${config.targetLocale}.json
  源文件目录: ${config.sourceDir}
  配置的文件数: ${config.filesToMerge.length}
`);
  }
}

// 主执行逻辑
async function main() {
  const args = process.argv.slice(2);
  const merger = new SimpleMerger();
  
  if (args.includes('--help') || args.includes('-h')) {
    merger.showHelp();
    return;
  }

  if (args.includes('--list') || args.includes('-l')) {
    merger.listAvailableFiles();
    return;
  }

  // 检查是否有配置的文件
  if (config.filesToMerge.length === 0) {
    console.log('❌ 没有配置要合并的文件');
    console.log('💡 请编辑 scripts/simple-merge-config.js 文件，在 filesToMerge 数组中添加文件名');
    console.log('📋 运行 node scripts/simple-merge.js --list 查看可用文件');
    return;
  }

  await merger.executeMerge();
}

// 运行脚本
if (require.main === module) {
  main().catch(console.error);
} 