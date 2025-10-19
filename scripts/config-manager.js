#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const config = require('./translate-config');

/**
 * 配置管理脚本
 * 用于动态修改界面翻译配置，无需手动编辑配置文件
 * 
 * 🔍 重要说明：
 * 此脚本管理界面翻译任务配置，不涉及页面内容
 * 
 * 使用方法:
 * node scripts/config-manager.js status                         # 查看当前配置状态
 * node scripts/config-manager.js set-mode newlyMergedContent    # 设置活跃模式
 * node scripts/config-manager.js enable-task chineseUi          # 启用快速任务
 */

const configPath = path.join(__dirname, 'translate-config.js');

// 读取配置文件内容
function readConfigFile() {
  try {
    const content = fs.readFileSync(configPath, 'utf8');
    return content;
  } catch (error) {
    console.error('❌ 读取配置文件失败:', error.message);
    process.exit(1);
  }
}

// 写入配置文件
function writeConfigFile(content) {
  try {
    fs.writeFileSync(configPath, content, 'utf8');
    console.log('✅ 配置文件已更新');
  } catch (error) {
    console.error('❌ 写入配置文件失败:', error.message);
    process.exit(1);
  }
}

// 获取当前配置对象
function getCurrentConfig() {
  // 清除require缓存以获取最新配置
  delete require.cache[require.resolve('./translate-config')];
  return require('./translate-config');
}

// 🎯 显示当前配置状态
function showStatus() {
  console.log('🔧 界面翻译配置状态:\n');
  
  const activeMode = config.uiTranslationTasks.activeMode;
  const activeLanguages = config.getActiveUiTranslationLanguages();
  
  console.log(`🎯 当前活跃模式: ${activeMode}`);
  console.log(`📋 当前翻译界面语言: ${activeLanguages.join(', ')}`);
  
  console.log('\n🌍 支持的界面翻译语言:');
  config.uiTranslationLanguages.forEach(lang => {
    console.log(`  ${lang} - ${config.uiLanguageNames[lang] || lang}`);
  });
  
  console.log('\n📋 翻译模式状态:');
  Object.entries(config.uiTranslationTasks.modes).forEach(([mode, modeConfig]) => {
    const status = modeConfig.enabled ? '✅ 已启用' : '⭕ 未启用';
    const languages = modeConfig.languages === 'all' ? '所有界面语言' : modeConfig.languages.join(', ');
    console.log(`  ${mode}: ${status} - ${modeConfig.description}`);
    console.log(`    语言: ${languages}`);
  });
}

// 🔄 切换翻译模式
function switchMode(modeName) {
  if (!config.uiTranslationTasks.modes[modeName]) {
    console.error(`❌ 模式 "${modeName}" 不存在`);
    console.log('📋 可用模式:');
    Object.keys(config.uiTranslationTasks.modes).forEach(mode => {
      console.log(`  - ${mode}`);
    });
    return;
  }
  
  const success = config.setActiveMode(modeName);
  if (success) {
    console.log(`\n✅ 已切换到模式: ${modeName}`);
    const activeLanguages = config.getActiveUiTranslationLanguages();
    console.log(`📋 当前翻译语言: ${activeLanguages.join(', ')}`);
  }
}

// 🎨 修改部分翻译的语言列表
function setPartialLanguages(languages) {
  const langArray = languages.split(',').map(lang => lang.trim());
  
  // 验证语言代码
  const validLangs = langArray.filter(lang => config.uiTranslationLanguages.includes(lang));
  const invalidLangs = langArray.filter(lang => !config.uiTranslationLanguages.includes(lang));
  
  if (invalidLangs.length > 0) {
    console.error(`❌ 无效的语言代码: ${invalidLangs.join(', ')}`);
    console.log('📋 支持的语言代码:');
    config.uiTranslationLanguages.forEach(lang => {
      console.log(`  ${lang} - ${config.uiLanguageNames[lang] || lang}`);
    });
    return;
  }
  
  config.uiTranslationTasks.modes.partial.languages = validLangs;
  console.log(`✅ 已设置部分翻译语言: ${validLangs.join(', ')}`);
}

// 📖 显示帮助信息
function showHelp() {
  console.log('🔧 翻译配置管理工具\n');
  console.log('📋 可用命令:');
  console.log('  status                    - 显示当前配置状态');
  console.log('  switch <mode>            - 切换翻译模式 (all/partial)');
  console.log('  set-partial <languages>  - 设置部分翻译的语言列表 (用逗号分隔)');
  console.log('  help                     - 显示帮助信息');
  console.log('\n📝 示例:');
  console.log('  node scripts/config-manager.js status');
  console.log('  node scripts/config-manager.js switch all');
  console.log('  node scripts/config-manager.js switch partial');
  console.log('  node scripts/config-manager.js set-partial fr,es,de');
}

// 🚀 主函数
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'status':
      showStatus();
      break;
      
    case 'switch':
      if (!args[1]) {
        console.error('❌ 请指定要切换的模式');
        console.log('📋 可用模式: all, partial');
        return;
      }
      switchMode(args[1]);
      break;
      
    case 'set-partial':
      if (!args[1]) {
        console.error('❌ 请指定语言列表 (用逗号分隔)');
        console.log('📝 示例: node scripts/config-manager.js set-partial fr,es,de');
        return;
      }
      setPartialLanguages(args[1]);
      break;
      
    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;
      
    default:
      console.error(`❌ 未知命令: ${command}`);
      showHelp();
      break;
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = {
  showStatus,
  switchMode,
  setPartialLanguages,
  showHelp
}; 