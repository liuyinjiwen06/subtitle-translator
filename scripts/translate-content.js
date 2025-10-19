#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
const config = require('./translate-config');

/**
 * OpenAI API 界面翻译脚本
 * 
 * 🔍 重要说明：
 * 此脚本专门用于翻译界面文案 (UI Translation)，不涉及页面内容翻译
 * 翻译目标：src/lib/locales/ 中的界面翻译文件
 * 
 * 使用方法:
 * node scripts/translate-content.js                # 使用配置文件预设
 * node scripts/translate-content.js <ui-language>  # 翻译指定界面语言
 * node scripts/translate-content.js all            # 翻译所有界面语言
 * 
 * 例如:
 * node scripts/translate-content.js zh   # 翻译中文界面
 * node scripts/translate-content.js fr   # 翻译法语界面
 * node scripts/translate-content.js all  # 翻译所有界面语言
 */

// 初始化 OpenAI 客户端
const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});

// 工具函数：深度扁平化对象
function flattenObject(obj, prefix = '') {
  const flattened = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(flattened, flattenObject(obj[key], newKey));
      } else {
        flattened[newKey] = obj[key];
      }
    }
  }
  
  return flattened;
}

// 工具函数：从扁平化对象重建嵌套对象
function unflattenObject(flattened) {
  const result = {};
  
  for (const key in flattened) {
    const keys = key.split('.');
    let current = result;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current)) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = flattened[key];
  }
  
  return result;
}

// 创建备份文件
function createBackup(filePath) {
  if (!config.translationOptions.createBackup) return;
  
  const backupDir = path.join(process.cwd(), config.paths.backupDir);
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  const fileName = path.basename(filePath);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDir, `${fileName}.${timestamp}.backup`);
  
  try {
    fs.copyFileSync(filePath, backupPath);
    console.log(`📁 已创建备份: ${backupPath}`);
  } catch (error) {
    console.warn(`⚠️  创建备份失败: ${error.message}`);
  }
}

// 翻译函数
async function translateText(text, targetUiLanguage) {
  const targetLanguageName = config.uiLanguageNames[targetUiLanguage] || targetUiLanguage;
  
  try {
    const response = await openai.chat.completions.create({
      model: config.openai.model,
      messages: [
        {
          role: "system",
          content: `你是一个专业的界面翻译助手。请将以下界面文本翻译成${targetLanguageName}。保持原文的语气、风格和格式。如果是技术术语或专有名词，请保持准确性。对于UI文本，要简洁明了。`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: config.openai.temperature,
      max_tokens: config.openai.maxTokens,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error(`❌ 翻译失败: ${error.message}`);
    return null;
  }
}

// 批量翻译
async function translateBatch(entries, targetUiLanguage) {
  const results = {};
  const batchSize = config.openai.batchSize;
  
  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = entries.slice(i, i + batchSize);
    console.log(`📝 翻译批次 ${Math.floor(i/batchSize) + 1}/${Math.ceil(entries.length/batchSize)} (${batch.length} 条目)`);
    
    const batchPromises = batch.map(async ([key, value]) => {
      if (typeof value !== 'string') return [key, value];
      
      const translated = await translateText(value, targetUiLanguage);
      return [key, translated || value];
    });
    
    const batchResults = await Promise.all(batchPromises);
    batchResults.forEach(([key, value]) => {
      results[key] = value;
    });
    
    // 批次间延迟
    if (i + batchSize < entries.length) {
      console.log(`⏳ 等待 ${config.openai.delayBetweenBatches}ms...`);
      await new Promise(resolve => setTimeout(resolve, config.openai.delayBetweenBatches));
    }
  }
  
  return results;
}

// 主翻译函数
async function translateUiLanguage(targetUiLanguage) {
  const sourceFilePath = path.join(config.paths.localesDir, config.paths.sourceFile);
  const targetFilePath = path.join(config.paths.localesDir, `${targetUiLanguage}.json`);
  
  console.log(`\n🌍 开始翻译界面语言: ${config.uiLanguageNames[targetUiLanguage] || targetUiLanguage} (${targetUiLanguage})`);
  
  // 检查是否是有效的界面翻译语言
  if (!config.uiTranslationLanguages.includes(targetUiLanguage)) {
    console.error(`❌ "${targetUiLanguage}" 不是有效的界面翻译语言`);
    console.log('📋 支持的界面翻译语言:');
    config.uiTranslationLanguages.forEach(lang => {
      console.log(`  ${lang} - ${config.uiLanguageNames[lang] || lang}`);
    });
    return false;
  }
  
  // 读取源文件
  if (!fs.existsSync(sourceFilePath)) {
    console.error(`❌ 源文件不存在: ${sourceFilePath}`);
    return false;
  }
  
  const sourceContent = JSON.parse(fs.readFileSync(sourceFilePath, 'utf8'));
  
  // 读取目标文件（如果存在）
  let targetContent = {};
  if (fs.existsSync(targetFilePath)) {
    targetContent = JSON.parse(fs.readFileSync(targetFilePath, 'utf8'));
    createBackup(targetFilePath);
  }
  
  // 扁平化处理
  const flatSource = flattenObject(sourceContent);
  const flatTarget = flattenObject(targetContent);
  
  // 找出需要翻译的条目
  const toTranslate = [];
  for (const [key, value] of Object.entries(flatSource)) {
    if (typeof value === 'string' && value.trim()) {
      // 跳过特殊键
      if (config.translationOptions.skipKeys.some(skipKey => key.includes(skipKey))) {
        continue;
      }
      
      // 如果目标文件中不存在或为空，则需要翻译
      if (config.translationOptions.skipExisting && flatTarget[key] && flatTarget[key].trim()) {
        continue;
      }
      
      toTranslate.push([key, value]);
    }
  }
  
  if (toTranslate.length === 0) {
    console.log(`✅ ${targetUiLanguage} 界面无需翻译（所有内容已存在）`);
    return true;
  }
  
  console.log(`📊 需要翻译 ${toTranslate.length} 个界面条目`);
  
  // 执行翻译
  const translatedFlat = await translateBatch(toTranslate, targetUiLanguage);
  
  // 合并结果
  const mergedFlat = { ...flatTarget, ...translatedFlat };
  const finalContent = unflattenObject(mergedFlat);
  
  // 写入文件
  fs.writeFileSync(targetFilePath, JSON.stringify(finalContent, null, 2), 'utf8');
  console.log(`✅ 界面翻译完成: ${targetFilePath}`);
  
  return true;
}

// 🎯 主执行函数 - 支持配置文件预设
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // 没有参数时，使用配置文件中的活跃模式
    console.log('🎯 使用配置文件中的预设界面翻译任务...\n');
    
    const activeLanguages = config.getActiveUiTranslationLanguages();
    
    if (activeLanguages.length === 0) {
      console.log('❌ 没有找到活跃的界面翻译任务');
      console.log('💡 请在配置文件中设置 activeMode 或使用命令行参数');
      console.log('\n📋 可用命令:');
      console.log('  node scripts/translate-content.js fr        # 翻译法语界面');
      console.log('  node scripts/translate-content.js all       # 翻译所有界面语言');
      console.log('  node scripts/translate-content.js --config  # 查看配置');
      return;
    }
    
    console.log(`🚀 当前模式: ${config.uiTranslationTasks.activeMode}`);
    console.log(`📋 翻译界面语言: ${activeLanguages.join(', ')}\n`);
    
    // 执行翻译
    for (const lang of activeLanguages) {
      await translateUiLanguage(lang);
    }
    
    console.log('\n🎉 所有界面翻译任务完成！');
    return;
  }
  
  const command = args[0];
  
  // 处理特殊命令
  if (command === '--config' || command === 'config') {
    // 显示配置信息
    require('./translate-config');
    return;
  }
  
  if (command === 'all') {
    // 翻译所有界面语言
    console.log('🌍 翻译所有配置的界面语言...\n');
    for (const lang of config.uiTranslationLanguages) {
      await translateUiLanguage(lang);
    }
    console.log('\n🎉 所有界面语言翻译完成！');
    return;
  }
  
  // 检查是否是快速任务
  const quickTask = config.getQuickTask(command);
  if (quickTask && quickTask.enabled) {
    console.log(`⚡ 执行快速任务: ${command}`);
    console.log(`📋 翻译界面语言: ${quickTask.languages.join(', ')}\n`);
    
    for (const lang of quickTask.languages) {
      await translateUiLanguage(lang);
    }
    
    console.log('\n🎉 快速任务完成！');
    return;
  }
  
  // 单个界面语言翻译
  if (config.uiTranslationLanguages.includes(command)) {
    await translateUiLanguage(command);
    console.log('\n🎉 界面翻译完成！');
  } else {
    console.error(`❌ 不支持的界面语言代码: ${command}`);
    console.log('\n📋 支持的界面翻译语言:');
    config.uiTranslationLanguages.forEach(lang => {
      console.log(`  ${lang} - ${config.uiLanguageNames[lang] || lang}`);
    });
  }
}

// 错误处理
process.on('unhandledRejection', (error) => {
  console.error('❌ 未处理的错误:', error);
  process.exit(1);
});

// 执行主函数
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { translateUiLanguage };