#!/usr/bin/env node

/**
 * 翻译脚本配置文件
 * 统一管理API密钥、目标语言等变量
 * 
 * 🔍 重要概念：
 * - 所有页面都会翻译为所有界面语言
 * - 界面翻译语言 (UI Translation Languages): 对应 locales 中的通用界面翻译文件
 */

const config = {
  // OpenAI API 配置
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '', // 从环境变量读取API密钥
    model: 'gpt-4o-mini',
    temperature: 0.3,
    maxTokens: 4000,
    batchSize: 20, // 每次翻译的条目数量
    delayBetweenBatches: 1000 // 批次间延迟（毫秒）
  },

  // 🌍 界面翻译语言配置 (UI Translation Languages)
  // 用于翻译 src/lib/locales/ 中的界面文案
  // 所有页面都会翻译为这些语言
  uiTranslationLanguages: [
    'zh',  // 中文
    'fr',  // 法语
    'es',  // 西班牙语
    'de',  // 德语
    'ja',  // 日语
    'ko',  // 韩语
    'pt',  // 葡萄牙语
    'it',  // 意大利语
    'ru',  // 俄语
    'ar',  // 阿拉伯语
    'hi',  // 印地语
    'th',  // 泰语
    'vi',  // 越南语
    'tr',  // 土耳其语
    'pl',  // 波兰语
    'nl',  // 荷兰语
    'sv'   // 瑞典语
  ],

  // 界面翻译语言名称映射
  uiLanguageNames: {
    'en': '英语',
    'zh': '中文',
    'es': '西班牙语',
    'fr': '法语',
    'de': '德语',
    'ja': '日语',
    'ko': '韩语',
    'pt': '葡萄牙语',
    'it': '意大利语',
    'ru': '俄语',
    'ar': '阿拉伯语',
    'hi': '印地语',
    'th': '泰语',
    'vi': '越南语',
    'tr': '土耳其语',
    'pl': '波兰语',
    'nl': '荷兰语',
    'sv': '瑞典语'
  },

  // 文件路径配置
  paths: {
    localesDir: 'src/lib/locales',           // 界面翻译文件目录
    sourceFile: 'en.json',                   // 源翻译文件
    backupDir: 'backups',                    // 备份目录
    generatedContentDir: 'public/generated-content' // 页面内容文件目录
  },

  // 翻译选项
  translationOptions: {
    // 是否在翻译前创建备份
    createBackup: true,
    
    // 是否跳过已存在的翻译
    skipExisting: true,
    
    // 是否显示详细日志
    verbose: true,
    
    // 特殊处理的键（不翻译）
    skipKeys: [
      'languages', // 语言代码映射通常不需要翻译
    ],
    
    // 需要特别注意的键（会在翻译时提示）
    specialKeys: [
      'seo.keywords',
      'nav',
      'pageTemplate'
    ]
  },

  // 🎯 界面翻译任务配置 (UI Translation Tasks)
  uiTranslationTasks: {
    // 当前活跃的任务模式
    activeMode: 'all', // 'all' 或 'partial'
    
    // 翻译模式配置
    modes: {
      // 翻译所有界面语言
      all: {
        description: '翻译所有界面语言',
        languages: 'all',
        enabled: true
      },
      
      // 部分翻译
      partial: {
        description: '翻译指定的界面语言',
        languages: ['fr', 'pt', 'es'], // 可修改为任何你想要的语言
        enabled: false
      }
    }
  }
};

// 🔧 配置工具函数
config.getActiveUiTranslationLanguages = function() {
  const activeMode = this.uiTranslationTasks.activeMode;
  const modeConfig = this.uiTranslationTasks.modes[activeMode];
  
  if (!modeConfig || !modeConfig.enabled) {
    console.warn(`⚠️  活跃模式 "${activeMode}" 未启用或不存在`);
    return [];
  }
  
  if (modeConfig.languages === 'all') {
    return this.uiTranslationLanguages;
  }
  
  return modeConfig.languages || [];
};

// 获取可翻译的语言列表
config.getUiLanguageNames = function() {
  return this.uiLanguageNames;
};

config.setActiveMode = function(modeName) {
  if (!this.uiTranslationTasks.modes[modeName]) {
    console.error(`❌ 模式 "${modeName}" 不存在`);
    return false;
  }
  
  // 禁用所有模式
  Object.keys(this.uiTranslationTasks.modes).forEach(mode => {
    this.uiTranslationTasks.modes[mode].enabled = false;
  });
  
  // 启用指定模式
  this.uiTranslationTasks.modes[modeName].enabled = true;
  this.uiTranslationTasks.activeMode = modeName;
  
  console.log(`✅ 已切换到模式: ${modeName}`);
  return true;
};

// 导出配置
module.exports = config;

// 如果直接运行此文件，显示配置信息
if (require.main === module) {
  console.log('🔧 翻译脚本配置信息:\n');
  
  console.log('📡 OpenAI API:');
  console.log(`  模型: ${config.openai.model}`);
  console.log(`  批次大小: ${config.openai.batchSize} 条目`);
  console.log(`  API密钥: ${config.openai.apiKey ? '已配置' : '未配置'}`);
  
  console.log('\n🌍 界面翻译语言 (所有页面都会翻译为这些语言):');
  config.uiTranslationLanguages.forEach(lang => {
    console.log(`  ${lang} - ${config.uiLanguageNames[lang] || lang}`);
  });
  
  console.log('\n📁 文件路径:');
  console.log(`  界面翻译文件目录: ${config.paths.localesDir}`);
  console.log(`  页面内容文件目录: ${config.paths.generatedContentDir}`);
  console.log(`  源文件: ${config.paths.sourceFile}`);
  console.log(`  备份目录: ${config.paths.backupDir}`);
  
  console.log('\n⚙️  翻译选项:');
  console.log(`  创建备份: ${config.translationOptions.createBackup ? '是' : '否'}`);
  console.log(`  跳过已有翻译: ${config.translationOptions.skipExisting ? '是' : '否'}`);
  console.log(`  详细日志: ${config.translationOptions.verbose ? '是' : '否'}`);

  console.log('\n🎯 界面翻译任务配置:');
  console.log(`  当前活跃模式: ${config.uiTranslationTasks.activeMode}`);
  
  const activeLanguages = config.getActiveUiTranslationLanguages();
  console.log(`  当前翻译语言: ${activeLanguages.join(', ')}`);
  
  console.log('\n📋 可用模式:');
  Object.entries(config.uiTranslationTasks.modes).forEach(([mode, modeConfig]) => {
    const status = modeConfig.enabled ? '✅ 已启用' : '⭕ 未启用';
    const languages = modeConfig.languages === 'all' ? '所有界面语言' : modeConfig.languages.join(', ');
    console.log(`  ${mode}: ${status} - ${modeConfig.description}`);
    console.log(`    语言: ${languages}`);
  });
}