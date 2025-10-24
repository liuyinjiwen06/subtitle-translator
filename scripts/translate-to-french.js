#!/usr/bin/env node

/**
 * 将 /locales/en.json 翻译为法语
 */

const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
require('dotenv').config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function translateToFrench() {
  console.log('🔄 开始翻译英文到法语...');

  // 读取英文文件
  const enPath = path.join(__dirname, '../locales/en.json');
  const frPath = path.join(__dirname, '../locales/fr.json');

  const enContent = JSON.parse(fs.readFileSync(enPath, 'utf-8'));

  console.log('📖 读取英文内容完成');
  console.log('🤖 使用 OpenAI 翻译...');

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional translator. Translate the following JSON content from English to French. Keep the JSON structure exactly the same, only translate the values. Maintain any placeholders like {count}, {filename}, etc. Return ONLY the translated JSON, no explanations.'
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

    // 移除可能的代码块标记
    const jsonText = translatedText.replace(/^```json\n?/, '').replace(/\n?```$/, '');

    // 验证是否为有效JSON
    const frContent = JSON.parse(jsonText);

    // 写入法语文件
    fs.writeFileSync(frPath, JSON.stringify(frContent, null, 2), 'utf-8');

    console.log('✅ 翻译完成！');
    console.log(`📝 法语文件已保存到: ${frPath}`);

    // 显示统计
    const enKeys = Object.keys(enContent).length;
    const frKeys = Object.keys(frContent).length;
    console.log(`\n📊 统计:`);
    console.log(`   英文键数: ${enKeys}`);
    console.log(`   法语键数: ${frKeys}`);

  } catch (error) {
    console.error('❌ 翻译失败:', error.message);
    process.exit(1);
  }
}

translateToFrench();
