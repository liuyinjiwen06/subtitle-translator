#!/usr/bin/env node

/**
 * 简单合并配置文件
 * 只需要在这里填写要合并的文件列表
 */

const simpleMergeConfig = {
  // 🎯 要合并的文件列表 - 在这里填写你要合并的文件
  filesToMerge: [
    'spanish-subtitle-page.json',
    'portuguese-subtitle-page.json', 
    'french-subtitle-page.json',
  ],

  // 🎯 目标翻译文件 - 默认合并到 en.json
  targetLocale: 'en',

  // 📁 文件路径配置
  sourceDir: 'public/generated-content',  // 源文件目录
  targetDir: 'src/lib/locales',           // 目标翻译文件目录

  // ⚙️ 选项
  options: {
    createBackup: true,     // 是否创建备份
    verbose: true,          // 是否显示详细日志
    continueOnError: true   // 出错时是否继续
  }
};

module.exports = simpleMergeConfig;

// 如果直接运行此文件，显示配置信息
if (require.main === module) {
  console.log('📋 简单合并配置:\n');
  
  console.log('🎯 要合并的文件:');
  simpleMergeConfig.filesToMerge.forEach((file, index) => {
    console.log(`  ${index + 1}. ${file}`);
  });
  
  console.log(`\n📄 目标文件: ${simpleMergeConfig.targetDir}/${simpleMergeConfig.targetLocale}.json`);
  console.log(`📁 源文件目录: ${simpleMergeConfig.sourceDir}`);
  
  console.log('\n💡 使用说明:');
  console.log('1. 编辑 filesToMerge 数组，添加或删除要合并的文件');
  console.log('2. 运行: node scripts/simple-merge.js');
  console.log('3. 文件将自动合并到 en.json 中');
} 