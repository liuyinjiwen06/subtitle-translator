#!/usr/bin/env node

/**
 * 快速翻译执行脚本
 * 使用配置文件中的设置快速执行翻译任务
 */

const ContentTranslator = require('./translate-content');
const config = require('./translate-config');

async function quickTranslate() {
  console.log('🚀 开始快速翻译任务...\n');
  
  // 显示配置信息
  console.log('📋 当前配置:');
  console.log(`   API密钥: ${config.openai.apiKey ? '✅ 已配置' : '❌ 未配置'}`);
  console.log(`   目标语言: ${config.targetLanguages.join(', ')}`);
  console.log(`   批次大小: ${config.openai.batchSize}`);
  console.log(`   创建备份: ${config.translationOptions.createBackup ? '是' : '否'}`);
  console.log('');

  if (!config.openai.apiKey) {
    console.error('❌ 请在 translate-config.js 中配置 OpenAI API 密钥');
    process.exit(1);
  }

  try {
    const translator = new ContentTranslator();
    
    // 询问用户要翻译哪些语言
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
      console.log('🌍 将翻译所有配置的语言...');
      await translator.translateAllLanguages();
    } else if (args[0] === 'zh') {
      console.log('🇨🇳 翻译中文...');
      await translator.translateContent('zh');
    } else if (args[0] === 'fr') {
      console.log('🇫🇷 翻译法语...');
      await translator.translateContent('fr');
    } else if (args[0] === 'es') {
      console.log('🇪🇸 翻译西班牙语...');
      await translator.translateContent('es');
    } else {
      console.log(`🎯 翻译 ${args[0]}...`);
      await translator.translateContent(args[0]);
    }
    
    console.log('\n✅ 翻译任务完成！');
    
  } catch (error) {
    console.error('\n❌ 翻译失败:', error.message);
    process.exit(1);
  }
}

// 运行快速翻译
if (require.main === module) {
  quickTranslate().catch(console.error);
} 