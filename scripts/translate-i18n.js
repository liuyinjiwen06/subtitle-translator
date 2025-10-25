#!/usr/bin/env node

/**
 * 智能翻译脚本 - 支持增量翻译和新语言添加
 * 
 * 使用方式：
 * node scripts/translate-i18n.js                    # 翻译所有缺失内容
 * node scripts/translate-i18n.js --lang zh,ja      # 只翻译指定语言
 * node scripts/translate-i18n.js --force           # 强制重新翻译所有内容
 * node scripts/translate-i18n.js --keys homepage   # 只翻译指定key
 */

const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');

// 配置
const CONFIG = {
  sourceFile: './locales/en.json',
  targetDir: './locales',
  i18nConfigFile: './i18nConfig.ts',
  openai: {
    model: 'gpt-4o-mini',
    temperature: 0.5,
    maxTokens: 2000,
    batchSize: 5, // 每批翻译的key数量
    delayBetweenBatches: 1000, // 批次间延迟(ms)
  },
  // 语言映射表
  languageMap: {
    'en': 'English',
    'zh': 'Chinese (Simplified)',
    'ja': 'Japanese',
    'fr': 'French',
    'de': 'German',
    'es': 'Spanish',
    'ru': 'Russian',
    'it': 'Italian',
    'pt': 'Portuguese',
    'ar': 'Arabic',
    'hi': 'Hindi',
    'ko': 'Korean',
    'th': 'Thai',
    'vi': 'Vietnamese',
    'tr': 'Turkish',
    'pl': 'Polish',
    'nl': 'Dutch',
    'sv': 'Swedish'
  }
};

class I18nTranslator {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.sourceData = {};
    this.supportedLocales = [];
  }

  // 初始化
  async init() {
    console.log('🚀 初始化翻译脚本...');
    
    // 读取源文件
    this.sourceData = JSON.parse(fs.readFileSync(CONFIG.sourceFile, 'utf8'));
    
    // 获取支持的语言列表
    this.supportedLocales = this.getSupportedLocales();
    
    console.log(`📝 源文件: ${CONFIG.sourceFile}`);
    console.log(`🌍 支持的语言: ${this.supportedLocales.join(', ')}`);
  }

  // 获取支持的语言列表
  getSupportedLocales() {
    try {
      const i18nConfig = fs.readFileSync(CONFIG.i18nConfigFile, 'utf8');
      const match = i18nConfig.match(/locales:\s*\[(.*?)\]/s);
      if (match) {
        return match[1]
          .split(',')
          .map(lang => lang.trim().replace(/['"]/g, ''))
          .filter(lang => lang !== 'en'); // 排除英文源语言
      }
    } catch (error) {
      console.warn('⚠️ 无法读取i18nConfig，使用默认语言列表');
    }
    
    // 默认语言列表
    return ['zh', 'ja', 'fr', 'de', 'es', 'ru', 'it', 'pt', 'ar', 'hi', 'ko', 'th', 'vi', 'tr', 'pl', 'nl'];
  }

  // 获取需要翻译的内容
  getMissingTranslations(targetLang, specificKeys = null) {
    const targetFile = path.join(CONFIG.targetDir, `${targetLang}.json`);
    let targetData = {};
    
    // 读取目标文件（如果存在）
    if (fs.existsSync(targetFile)) {
      targetData = JSON.parse(fs.readFileSync(targetFile, 'utf8'));
    }
    
    const missing = {};
    
    // 递归检查缺失的key
    const checkMissing = (sourceObj, targetObj, currentPath = '') => {
      for (const [key, value] of Object.entries(sourceObj)) {
        const fullPath = currentPath ? `${currentPath}.${key}` : key;
        
        // 如果指定了特定key，只处理匹配的
        if (specificKeys && !specificKeys.some(k => fullPath.startsWith(k))) {
          continue;
        }
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          // 递归处理对象
          if (!targetObj[key]) targetObj[key] = {};
          const nestedMissing = {};
          checkMissing(value, targetObj[key], fullPath);
          if (Object.keys(nestedMissing).length > 0) {
            missing[key] = nestedMissing;
          }
        } else {
          // 检查字符串值
          if (!targetObj[key] || targetObj[key] === value) {
            if (!missing[key]) {
              missing[key] = value;
            }
          }
        }
      }
    };
    
    checkMissing(this.sourceData, targetData);
    return { missing, targetData };
  }

  // 翻译单个批次
  async translateBatch(texts, targetLang) {
    const targetLanguage = CONFIG.languageMap[targetLang] || targetLang;
    
    const prompt = `You are a professional translator for a subtitle translation web application. 
Translate the following JSON content from English to ${targetLanguage}.

IMPORTANT RULES:
1. Maintain the exact JSON structure
2. Translate only the string values, not the keys
3. For technical terms like "SRT", "API", "GPT", keep them as-is
4. For brand names like "SubTran", "OpenAI", "Google", keep them as-is
5. Preserve HTML tags and special formatting
6. Maintain the tone: professional but friendly
7. For UI elements, use commonly accepted translations
8. For emoji, keep them as-is

Content to translate:
${JSON.stringify(texts, null, 2)}

Return only the translated JSON without any additional text or markdown formatting.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: CONFIG.openai.model,
        temperature: CONFIG.openai.temperature,
        max_tokens: CONFIG.openai.maxTokens,
        messages: [
          { role: 'system', content: 'You are a professional translator. Return only valid JSON.' },
          { role: 'user', content: prompt }
        ],
      });

      const translatedText = response.choices[0].message.content.trim();
      
      // 尝试解析JSON
      try {
        return JSON.parse(translatedText);
      } catch (parseError) {
        console.error(`❌ JSON解析失败 (${targetLang}):`, parseError.message);
        console.error('原始响应:', translatedText);
        return null;
      }
    } catch (error) {
      console.error(`❌ 翻译失败 (${targetLang}):`, error.message);
      return null;
    }
  }

  // 分批翻译
  async translateMissing(missing, targetLang) {
    const keys = Object.keys(missing);
    const translations = {};
    
    // 分批处理
    for (let i = 0; i < keys.length; i += CONFIG.openai.batchSize) {
      const batch = {};
      const batchKeys = keys.slice(i, i + CONFIG.openai.batchSize);
      
      batchKeys.forEach(key => {
        batch[key] = missing[key];
      });
      
      console.log(`  📝 翻译批次 ${Math.floor(i / CONFIG.openai.batchSize) + 1}: [${batchKeys.join(', ')}]`);
      
      const batchTranslations = await this.translateBatch(batch, targetLang);
      
      if (batchTranslations) {
        Object.assign(translations, batchTranslations);
        console.log(`  ✅ 批次完成`);
      } else {
        console.log(`  ❌ 批次失败，跳过`);
      }
      
      // 延迟以避免API限制
      if (i + CONFIG.openai.batchSize < keys.length) {
        await new Promise(resolve => setTimeout(resolve, CONFIG.openai.delayBetweenBatches));
      }
    }
    
    return translations;
  }

  // 深度合并对象
  deepMerge(target, source) {
    const result = { ...target };
    
    for (const [key, value] of Object.entries(source)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result[key] = this.deepMerge(result[key] || {}, value);
      } else {
        result[key] = value;
      }
    }
    
    return result;
  }

  // 保存翻译结果
  saveTranslation(targetLang, translations, originalData) {
    const targetFile = path.join(CONFIG.targetDir, `${targetLang}.json`);
    const mergedData = this.deepMerge(originalData, translations);
    
    fs.writeFileSync(targetFile, JSON.stringify(mergedData, null, 2), 'utf8');
    console.log(`💾 已保存: ${targetFile}`);
  }

  // 主翻译流程
  async translateLanguage(targetLang, force = false, specificKeys = null) {
    console.log(`\n🌍 开始翻译: ${targetLang} (${CONFIG.languageMap[targetLang] || targetLang})`);
    
    const { missing, targetData } = this.getMissingTranslations(targetLang, specificKeys);
    
    if (!force && Object.keys(missing).length === 0) {
      console.log(`  ✅ 无需翻译，所有内容已存在`);
      return;
    }
    
    const toTranslate = force ? this.sourceData : missing;
    console.log(`  📋 需要翻译 ${Object.keys(toTranslate).length} 个项目`);
    
    if (Object.keys(toTranslate).length === 0) {
      return;
    }
    
    const translations = await this.translateMissing(toTranslate, targetLang);
    
    if (translations && Object.keys(translations).length > 0) {
      this.saveTranslation(targetLang, translations, force ? {} : targetData);
      console.log(`  🎉 完成翻译: ${targetLang}`);
    } else {
      console.log(`  ❌ 翻译失败: ${targetLang}`);
    }
  }

  // 主执行方法
  async run() {
    const args = process.argv.slice(2);
    const force = args.includes('--force');
    const langArg = args.find(arg => arg.startsWith('--lang='));
    const keysArg = args.find(arg => arg.startsWith('--keys='));
    
    const targetLangs = langArg 
      ? langArg.split('=')[1].split(',').map(l => l.trim())
      : this.supportedLocales;
    
    const specificKeys = keysArg 
      ? keysArg.split('=')[1].split(',').map(k => k.trim())
      : null;
    
    console.log(`\n🎯 翻译配置:`);
    console.log(`  - 目标语言: ${targetLangs.join(', ')}`);
    console.log(`  - 强制翻译: ${force ? '是' : '否'}`);
    console.log(`  - 指定Key: ${specificKeys ? specificKeys.join(', ') : '全部'}`);
    
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ 请设置 OPENAI_API_KEY 环境变量');
      process.exit(1);
    }
    
    await this.init();
    
    for (const lang of targetLangs) {
      if (!this.supportedLocales.includes(lang)) {
        console.warn(`⚠️ 跳过不支持的语言: ${lang}`);
        continue;
      }
      
      try {
        await this.translateLanguage(lang, force, specificKeys);
      } catch (error) {
        console.error(`❌ 翻译 ${lang} 时发生错误:`, error.message);
      }
    }
    
    console.log('\n🎉 翻译完成！');
  }
}

// 执行脚本
if (require.main === module) {
  const translator = new I18nTranslator();
  translator.run().catch(console.error);
}

module.exports = I18nTranslator;