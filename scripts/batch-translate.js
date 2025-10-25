#!/usr/bin/env node

/**
 * 批量翻译脚本 - 为所有缺失语言创建翻译文件
 */

const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
require('dotenv').config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 需要翻译的语言
const languages = {
  'ja': 'Japanese',
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
};

async function translateToLanguage(langCode, langName) {
  console.log(`\n🔄 开始翻译 ${langName} (${langCode})...`);

  const enPath = path.join(__dirname, '../locales/en.json');
  const targetPath = path.join(__dirname, `../locales/${langCode}.json`);

  // 检查文件是否已存在
  if (fs.existsSync(targetPath)) {
    console.log(`⏭️  ${langCode}.json 已存在，跳过`);
    return { success: true, skipped: true };
  }

  const enContent = JSON.parse(fs.readFileSync(enPath, 'utf-8'));

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate the following JSON content from English to ${langName}. Keep the JSON structure exactly the same, only translate the values. Maintain any placeholders like {count}, {filename}, {source}, {target}, etc. Return ONLY the translated JSON, no explanations.`
        },
        {
          role: 'user',
          content: JSON.stringify(enContent, null, 2)
        }
      ],
      temperature: 0.3,
      max_tokens: 4000
    });

    const translatedText = response.choices[0].message.content.trim();
    const jsonText = translatedText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    const translatedContent = JSON.parse(jsonText);

    // 更新 _meta
    translatedContent._meta = {
      lastUpdated: new Date().toISOString(),
      version: "1.0.0",
      language: langCode,
      translatedBy: "gpt-4o-mini"
    };

    fs.writeFileSync(targetPath, JSON.stringify(translatedContent, null, 2), 'utf-8');

    console.log(`✅ ${langName} 翻译完成 → ${targetPath}`);
    return { success: true, skipped: false };
  } catch (error) {
    console.error(`❌ ${langName} 翻译失败:`, error.message);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🌍 批量翻译开始...\n');

  const results = {
    success: [],
    skipped: [],
    failed: []
  };

  for (const [langCode, langName] of Object.entries(languages)) {
    const result = await translateToLanguage(langCode, langName);

    if (result.success) {
      if (result.skipped) {
        results.skipped.push(langCode);
      } else {
        results.success.push(langCode);
      }
    } else {
      results.failed.push({ code: langCode, error: result.error });
    }

    // 延迟以避免速率限制
    if (Object.keys(languages).indexOf(langCode) < Object.keys(languages).length - 1) {
      console.log('⏳ 等待 2 秒...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log('\n📊 翻译结果汇总:');
  console.log(`✅ 成功: ${results.success.length} 个 - ${results.success.join(', ')}`);
  console.log(`⏭️  跳过: ${results.skipped.length} 个 - ${results.skipped.join(', ')}`);
  console.log(`❌ 失败: ${results.failed.length} 个`);

  if (results.failed.length > 0) {
    console.log('\n失败详情:');
    results.failed.forEach(({ code, error }) => {
      console.log(`  - ${code}: ${error}`);
    });
  }
}

main().catch(console.error);
