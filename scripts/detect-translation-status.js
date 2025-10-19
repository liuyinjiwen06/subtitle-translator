#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const config = require('./translate-config');

/**
 * 翻译状态检测脚本
 * 自动检测哪些语言已经翻译过，哪些还没有
 * 
 * 使用方法:
 * node scripts/detect-translation-status.js          # 检测所有语言
 * node scripts/detect-translation-status.js missing  # 只显示缺失的翻译
 * node scripts/detect-translation-status.js complete # 只显示完整的翻译
 */

// 检查翻译文件是否存在且有内容
function checkTranslationFile(languageCode) {
  const filePath = path.join(config.paths.localesDir, `${languageCode}.json`);
  
  if (!fs.existsSync(filePath)) {
    return {
      exists: false,
      hasContent: false,
      keyCount: 0,
      fileSize: 0
    };
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(content);
    const keyCount = countNestedKeys(jsonData);
    const fileSize = fs.statSync(filePath).size;
    
    return {
      exists: true,
      hasContent: keyCount > 0,
      keyCount: keyCount,
      fileSize: fileSize,
      filePath: filePath
    };
  } catch (error) {
    return {
      exists: true,
      hasContent: false,
      keyCount: 0,
      fileSize: 0,
      error: error.message
    };
  }
}

// 递归计算嵌套对象的键数量
function countNestedKeys(obj) {
  let count = 0;
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        count += countNestedKeys(obj[key]);
      } else {
        count++;
      }
    }
  }
  
  return count;
}

// 获取源文件的键数量作为参考
function getSourceKeyCount() {
  const sourceFilePath = path.join(config.paths.localesDir, config.paths.sourceFile);
  
  if (!fs.existsSync(sourceFilePath)) {
    console.warn(`⚠️  源文件不存在: ${sourceFilePath}`);
    return 0;
  }
  
  try {
    const content = fs.readFileSync(sourceFilePath, 'utf8');
    const jsonData = JSON.parse(content);
    return countNestedKeys(jsonData);
  } catch (error) {
    console.warn(`⚠️  读取源文件失败: ${error.message}`);
    return 0;
  }
}

// 格式化文件大小
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// 计算翻译完成度
function calculateCompleteness(keyCount, sourceKeyCount) {
  if (sourceKeyCount === 0) return 0;
  return Math.round((keyCount / sourceKeyCount) * 100);
}

// 主检测函数
function detectTranslationStatus(filter = 'all') {
  console.log('🔍 翻译状态检测报告\n');
  
  const sourceKeyCount = getSourceKeyCount();
  console.log(`📄 源文件 (${config.paths.sourceFile}): ${sourceKeyCount} 个翻译键\n`);
  
  const results = {
    complete: [],
    partial: [],
    missing: [],
    error: []
  };
  
  // 检测所有界面翻译语言
  config.uiTranslationLanguages.forEach(languageCode => {
    const status = checkTranslationFile(languageCode);
    const languageName = config.uiLanguageNames[languageCode] || languageCode;
    const completeness = calculateCompleteness(status.keyCount, sourceKeyCount);
    
    const info = {
      code: languageCode,
      name: languageName,
      status: status,
      completeness: completeness
    };
    
    if (status.error) {
      results.error.push(info);
    } else if (!status.exists) {
      results.missing.push(info);
    } else if (completeness >= 90) {
      results.complete.push(info);
    } else {
      results.partial.push(info);
    }
  });
  
  // 显示结果
  if (filter === 'all' || filter === 'complete') {
    console.log('✅ 翻译完整的语言:');
    if (results.complete.length === 0) {
      console.log('  (无)');
    } else {
      results.complete.forEach(info => {
        console.log(`  ${info.code} (${info.name}): ${info.status.keyCount} 键, ${formatFileSize(info.status.fileSize)}, ${info.completeness}%`);
      });
    }
    console.log('');
  }
  
  if (filter === 'all' || filter === 'partial') {
    console.log('⚠️  翻译不完整的语言:');
    if (results.partial.length === 0) {
      console.log('  (无)');
    } else {
      results.partial.forEach(info => {
        console.log(`  ${info.code} (${info.name}): ${info.status.keyCount} 键, ${formatFileSize(info.status.fileSize)}, ${info.completeness}%`);
      });
    }
    console.log('');
  }
  
  if (filter === 'all' || filter === 'missing') {
    console.log('❌ 缺失翻译的语言:');
    if (results.missing.length === 0) {
      console.log('  (无)');
    } else {
      results.missing.forEach(info => {
        console.log(`  ${info.code} (${info.name}): 文件不存在`);
      });
    }
    console.log('');
  }
  
  if (results.error.length > 0) {
    console.log('💥 翻译文件错误:');
    results.error.forEach(info => {
      console.log(`  ${info.code} (${info.name}): ${info.status.error}`);
    });
    console.log('');
  }
  
  // 统计摘要
  console.log('📊 统计摘要:');
  console.log(`  完整翻译: ${results.complete.length} 个语言`);
  console.log(`  不完整翻译: ${results.partial.length} 个语言`);
  console.log(`  缺失翻译: ${results.missing.length} 个语言`);
  console.log(`  错误文件: ${results.error.length} 个语言`);
  console.log(`  总计: ${config.uiTranslationLanguages.length} 个语言`);
  
  // 返回需要翻译的语言列表
  const needTranslation = [
    ...results.missing.map(info => info.code),
    ...results.partial.map(info => info.code)
  ];
  
  if (needTranslation.length > 0) {
    console.log('\n💡 建议翻译的语言:');
    console.log(`  ${needTranslation.join(', ')}`);
    console.log('\n🚀 可以运行以下命令进行翻译:');
    console.log(`  node scripts/translate-content.js ${needTranslation.slice(0, 5).join(' ')}`);
  }
  
  return {
    complete: results.complete,
    partial: results.partial,
    missing: results.missing,
    error: results.error,
    needTranslation: needTranslation
  };
}

// 主函数
function main() {
  const args = process.argv.slice(2);
  const filter = args[0] || 'all';
  
  if (!['all', 'missing', 'complete', 'partial'].includes(filter)) {
    console.log('❌ 无效的过滤参数');
    console.log('📋 可用参数:');
    console.log('  all      - 显示所有翻译状态 (默认)');
    console.log('  missing  - 只显示缺失的翻译');
    console.log('  complete - 只显示完整的翻译');
    console.log('  partial  - 只显示不完整的翻译');
    return;
  }
  
  detectTranslationStatus(filter);
}

// 执行主函数
if (require.main === module) {
  main();
}

module.exports = {
  detectTranslationStatus,
  checkTranslationFile,
  getSourceKeyCount
}; 