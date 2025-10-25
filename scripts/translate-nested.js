#!/usr/bin/env node

/**
 * 翻译脚本 - 保持嵌套结构
 * 使用 zh.json 作为源文件，确保翻译后的文件保持相同的嵌套结构
 */

const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const languageMap = {
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

async function translateJSON(jsonData, targetLang) {
  const targetLanguage = languageMap[targetLang];

  const prompt = `You are a professional translator for a subtitle translation web application.
Translate the following JSON content from Chinese to ${targetLanguage}.

CRITICAL RULES:
1. **MAINTAIN THE EXACT NESTED STRUCTURE** - Do not flatten the JSON
2. Translate only the string values, not the keys
3. Keep all object structures exactly as they are
4. For technical terms like "SRT", "API", "GPT", keep them as-is
5. For brand names like "OpenAI", "Google", keep them as-is
6. Preserve HTML tags and special formatting (like {count}, {filename}, etc.)
7. Keep emoji as-is
8. Maintain professional but friendly tone

Content to translate:
${JSON.stringify(jsonData, null, 2)}

Return ONLY the translated JSON without any additional text, markdown formatting, or code blocks.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.3,
      max_tokens: 4000,
      messages: [
        { role: 'system', content: 'You are a professional translator. Return only valid JSON with exact same structure.' },
        { role: 'user', content: prompt }
      ],
    });

    let translatedText = response.choices[0].message.content.trim();

    // Remove markdown code blocks if present
    translatedText = translatedText.replace(/^```json\n?/,  '').replace(/\n?```$/, '');

    return JSON.parse(translatedText);
  } catch (error) {
    console.error(`❌ Translation failed for ${targetLang}:`, error.message);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting nested structure translation...\n');

  // Read source file (Chinese)
  const sourceFile = './locales/zh.json';
  const sourceData = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));

  // Get target languages from command line
  const args = process.argv.slice(2);
  const langArg = args.find(arg => arg.startsWith('--lang='));

  if (!langArg) {
    console.error('❌ Please specify languages: --lang=ja,de,es');
    process.exit(1);
  }

  const targetLangs = langArg.split('=')[1].split(',');

  console.log(`📝 Source: Chinese (zh.json)`);
  console.log(`🎯 Target languages: ${targetLangs.join(', ')}\n`);

  for (const lang of targetLangs) {
    console.log(`🌍 Translating to ${languageMap[lang]} (${lang})...`);

    try {
      const translated = await translateJSON(sourceData, lang);

      // Save to file
      const outputFile = `./locales/${lang}.json`;
      fs.writeFileSync(outputFile, JSON.stringify(translated, null, 2), 'utf8');

      console.log(`   ✅ Saved: ${outputFile}\n`);

      // Delay between translations to avoid rate limiting
      if (targetLangs.indexOf(lang) < targetLangs.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(`   ❌ Failed: ${lang}\n`);
      continue;
    }
  }

  console.log('🎉 Translation complete!');
}

main().catch(console.error);
