#!/usr/bin/env node

/**
 * 批量内容合并脚本
 * 基于 merge-config.js 配置文件批量合并指定的文件到翻译文件
 */

const ContentMerger = require('./merge-content-to-i18n');
const mergeConfig = require('./merge-config');
const fs = require('fs');
const path = require('path');

class BatchContentMerger {
  constructor() {
    this.merger = new ContentMerger();
    this.rootDir = path.resolve(__dirname, '..');
  }

  /**
   * 检查文件是否存在
   */
  checkFileExists(filePath) {
    const fullPath = path.resolve(this.rootDir, filePath);
    return fs.existsSync(fullPath);
  }

  /**
   * 根据配置文件执行合并任务
   */
  async executeConfiguredMerge() {
    console.log('🎯 执行配置的合并任务...\n');
    
    const activeTask = mergeConfig.getActiveTask();
    if (!activeTask) {
      console.log('❌ 没有活跃的合并任务');
      return;
    }

    const mergeItems = mergeConfig.getMergeItems();
    if (mergeItems.length === 0) {
      console.log('❌ 没有配置的合并项目');
      return;
    }

    console.log('📋 合并任务配置:');
    if (Array.isArray(activeTask)) {
      console.log('   任务模式: 所有启用的任务');
      activeTask.forEach(task => {
        console.log(`   - ${task.name}: ${task.description}`);
      });
    } else {
      console.log(`   任务名称: ${activeTask.name}`);
      console.log(`   任务描述: ${activeTask.description}`);
    }
    console.log(`   合并项目数: ${mergeItems.length}`);
    console.log('');

    let successCount = 0;
    let failCount = 0;
    let skipCount = 0;

    // 执行每个合并项目
    for (const item of mergeItems) {
      console.log(`\n🔄 处理 ${item.languageCode} (优先级: ${item.priority})...`);
      console.log(`   内容文件: ${item.contentFile}`);
      console.log(`   布局文件: ${item.layoutFile || '无'}`);
      
      // 检查内容文件是否存在
      if (mergeConfig.mergeOptions.checkFileExists && !this.checkFileExists(item.contentFile)) {
        console.log(`   ⚠️  跳过: 内容文件不存在 - ${item.contentFile}`);
        skipCount++;
        continue;
      }

      // 检查布局文件是否存在（如果指定了）
      if (item.layoutFile && mergeConfig.mergeOptions.checkFileExists && !this.checkFileExists(item.layoutFile)) {
        console.log(`   ⚠️  警告: 布局文件不存在 - ${item.layoutFile}`);
      }

      const targetLocales = Array.isArray(item.targetLocales) ? item.targetLocales : [item.targetLocales];
      
      for (const targetLocale of targetLocales) {
        try {
          console.log(`   📝 合并到 ${targetLocale}.json...`);
          
          await this.merger.mergeContent(item.languageCode, targetLocale);
          successCount++;
          
          // 添加批处理延迟
          if (mergeConfig.mergeOptions.batchDelay > 0) {
            await new Promise(resolve => setTimeout(resolve, mergeConfig.mergeOptions.batchDelay));
          }
          
        } catch (error) {
          console.error(`   ❌ 合并失败 (${item.languageCode} -> ${targetLocale}):`, error.message);
          failCount++;
          
          // 如果配置为出错时不继续，则退出
          if (!mergeConfig.mergeOptions.continueOnError) {
            throw error;
          }
        }
      }
    }

    console.log('\n📊 批量合并完成:');
    console.log(`   ✅ 成功: ${successCount} 个`);
    console.log(`   ❌ 失败: ${failCount} 个`);
    console.log(`   ⚠️  跳过: ${skipCount} 个`);
  }

  /**
   * 合并指定的文件
   */
  async mergeSpecificFiles(filePaths, targetLocales = null) {
    targetLocales = targetLocales || mergeConfig.defaultTargetLocales;
    
    console.log('🎯 指定文件合并任务:');
    console.log(`   文件数量: ${filePaths.length}`);
    console.log(`   目标语言: ${targetLocales.join(', ')}`);
    console.log('');

    let successCount = 0;
    let failCount = 0;
    let skipCount = 0;

    for (const filePath of filePaths) {
      console.log(`\n🔄 处理文件: ${filePath}...`);
      
      // 检查文件是否存在
      if (!this.checkFileExists(filePath)) {
        console.log(`   ⚠️  跳过: 文件不存在 - ${filePath}`);
        skipCount++;
        continue;
      }

      // 从文件名推断语言代码
      const fileName = path.basename(filePath, '.json');
      const languageCode = fileName.replace('-subtitle-page', '').replace('-layout', '');
      
      console.log(`   推断语言代码: ${languageCode}`);
      
      for (const targetLocale of targetLocales) {
        try {
          console.log(`   📝 合并到 ${targetLocale}.json...`);
          await this.merger.mergeContent(languageCode, targetLocale);
          successCount++;
          
          // 添加批处理延迟
          if (mergeConfig.mergeOptions.batchDelay > 0) {
            await new Promise(resolve => setTimeout(resolve, mergeConfig.mergeOptions.batchDelay));
          }
          
        } catch (error) {
          console.error(`   ❌ 合并失败 (${languageCode} -> ${targetLocale}):`, error.message);
          failCount++;
          
          if (!mergeConfig.mergeOptions.continueOnError) {
            throw error;
          }
        }
      }
    }

    console.log('\n📊 指定文件合并完成:');
    console.log(`   ✅ 成功: ${successCount} 个`);
    console.log(`   ❌ 失败: ${failCount} 个`);
    console.log(`   ⚠️  跳过: ${skipCount} 个`);
  }

  /**
   * 显示配置信息
   */
  showConfig() {
    console.log('🔧 当前合并配置:\n');
    
    console.log('🎯 活跃任务:', mergeConfig.mergeTasks.activeTask);
    
    const activeTask = mergeConfig.getActiveTask();
    if (activeTask) {
      if (Array.isArray(activeTask)) {
        console.log('\n📋 启用的任务:');
        activeTask.forEach(task => {
          console.log(`   - ${task.name}: ${task.description}`);
        });
      } else {
        console.log(`\n📋 任务详情:`);
        console.log(`   名称: ${activeTask.name}`);
        console.log(`   描述: ${activeTask.description}`);
      }
    }
    
    const mergeItems = mergeConfig.getMergeItems();
    console.log('\n🔄 合并项目:');
    mergeItems.forEach((item, index) => {
      const targetLocales = Array.isArray(item.targetLocales) 
        ? item.targetLocales.join(', ') 
        : item.targetLocales;
      console.log(`   ${index + 1}. ${item.contentFile}`);
      console.log(`      布局文件: ${item.layoutFile || '无'}`);
      console.log(`      语言代码: ${item.languageCode}`);
      console.log(`      目标语言: [${targetLocales}]`);
      console.log(`      优先级: ${item.priority}`);
      console.log(`      文件存在: ${this.checkFileExists(item.contentFile) ? '✅' : '❌'}`);
      console.log('');
    });
    
    console.log('📁 文件路径:');
    console.log(`   生成内容目录: ${mergeConfig.paths.generatedContentDir}`);
    console.log(`   翻译文件目录: ${mergeConfig.paths.localesDir}`);
    
    console.log('\n⚙️  合并选项:');
    console.log(`   创建备份: ${mergeConfig.mergeOptions.createBackup ? '是' : '否'}`);
    console.log(`   跳过已有翻译: ${mergeConfig.mergeOptions.skipExisting ? '是' : '否'}`);
    console.log(`   出错时继续: ${mergeConfig.mergeOptions.continueOnError ? '是' : '否'}`);
    console.log(`   批处理延迟: ${mergeConfig.mergeOptions.batchDelay}ms`);
    console.log(`   检查文件存在: ${mergeConfig.mergeOptions.checkFileExists ? '是' : '否'}`);
  }

  /**
   * 显示帮助信息
   */
  showHelp() {
    console.log(`
📚 批量内容合并脚本使用说明

用法:
  node scripts/batch-merge-content.js [选项] [文件路径...]

选项:
  --config, -c        执行配置文件中定义的合并任务
  --list, -l          列出所有可用的语言内容文件
  --show-config       显示当前配置信息
  --help, -h          显示帮助信息

示例:
  # 执行配置的合并任务
  node scripts/batch-merge-content.js --config
  
  # 合并指定的文件
  node scripts/batch-merge-content.js public/generated-content/spanish-subtitle-page.json public/generated-content/french-subtitle-page.json
  
  # 显示当前配置
  node scripts/batch-merge-content.js --show-config
  
  # 列出可用的语言内容文件
  node scripts/batch-merge-content.js --list

配置文件:
  合并任务配置在 scripts/merge-config.js 中定义
  当前活跃任务: ${mergeConfig.mergeTasks.activeTask}
  
配置文件格式:
  在 scripts/merge-config.js 中，每个合并项包含:
  - contentFile: 内容文件路径 (如: 'public/generated-content/spanish-subtitle-page.json')
  - layoutFile: 布局文件路径 (如: 'public/generated-content/layouts/spanish-layout.json')
  - languageCode: 语言代码 (如: 'spanish')
  - targetLocales: 目标翻译文件 (如: ['en', 'zh', 'es'])
  - priority: 执行优先级 (数字，越小越优先)
`);
  }

  /**
   * 列出所有可用的语言内容文件
   */
  listAvailableContents() {
    console.log('📋 扫描可用的语言内容文件...\n');
    
    const generatedContentDir = path.join(this.rootDir, mergeConfig.paths.generatedContentDir);
    const layoutsDir = path.join(this.rootDir, mergeConfig.paths.layoutsDir);
    
    if (!fs.existsSync(generatedContentDir)) {
      console.log('❌ 生成内容目录不存在:', generatedContentDir);
      return;
    }

    const contentFiles = [];
    const layoutFiles = [];

    // 扫描内容文件
    if (fs.existsSync(generatedContentDir)) {
      const files = fs.readdirSync(generatedContentDir);
      files.forEach(file => {
        if (file.endsWith('-subtitle-page.json')) {
          contentFiles.push(file);
        }
      });
    }

    // 扫描布局文件
    if (fs.existsSync(layoutsDir)) {
      const files = fs.readdirSync(layoutsDir);
      files.forEach(file => {
        if (file.endsWith('-layout.json')) {
          layoutFiles.push(file);
        }
      });
    }

    console.log('✅ 可用的内容文件:');
    contentFiles.forEach(file => {
      const fullPath = `${mergeConfig.paths.generatedContentDir}/${file}`;
      console.log(`   📄 ${fullPath}`);
    });

    console.log('\n✅ 可用的布局文件:');
    layoutFiles.forEach(file => {
      const fullPath = `${mergeConfig.paths.layoutsDir}/${file}`;
      console.log(`   📐 ${fullPath}`);
    });

    console.log(`\n🎯 配置的默认目标语言: ${mergeConfig.defaultTargetLocales.join(', ')}`);
    
    console.log('\n💡 提示:');
    console.log('   你可以将这些文件路径复制到 scripts/merge-config.js 中的配置项里');
    console.log('   例如: contentFile: "public/generated-content/spanish-subtitle-page.json"');
  }
}

// 主执行逻辑
async function main() {
  const args = process.argv.slice(2);
  const batchMerger = new BatchContentMerger();
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    batchMerger.showHelp();
    return;
  }

  if (args.includes('--show-config')) {
    batchMerger.showConfig();
    return;
  }

  if (args.includes('--list') || args.includes('-l')) {
    batchMerger.listAvailableContents();
    return;
  }

  if (args.includes('--config') || args.includes('-c')) {
    await batchMerger.executeConfiguredMerge();
    return;
  }

  // 处理指定的文件路径
  const filePaths = args.filter(arg => !arg.startsWith('--'));
  if (filePaths.length > 0) {
    await batchMerger.mergeSpecificFiles(filePaths);
  } else {
    console.log('❌ 请指定要合并的文件路径或使用 --config 选项');
    batchMerger.showHelp();
  }
}

// 运行脚本
if (require.main === module) {
  main().catch(console.error);
}

module.exports = BatchContentMerger; 