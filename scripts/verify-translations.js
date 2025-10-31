#!/usr/bin/env node

/**
 * 验证翻译完整性脚本
 * 检查所有语言文件是否包含指定的键
 */

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = './locales';
const LANGUAGES = ['en', 'zh', 'fr', 'de', 'es', 'ja', 'ru', 'it', 'pt', 'ar', 'hi', 'ko', 'th', 'vi', 'tr', 'pl', 'nl', 'sv'];
const KEY_TO_CHECK = 'englishSubtitle';

console.log('🔍 开始验证翻译完整性...\n');

const results = {
  complete: [],
  incomplete: [],
  missing: []
};

LANGUAGES.forEach(lang => {
  const filePath = path.join(LOCALES_DIR, `${lang}.json`);

  if (!fs.existsSync(filePath)) {
    results.missing.push(lang);
    console.log(`❌ ${lang}: 文件不存在`);
    return;
  }

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (data[KEY_TO_CHECK]) {
      const keys = Object.keys(data[KEY_TO_CHECK]);
      const expectedKeys = ['meta', 'hero', 'useCases', 'linguisticExplanation'];
      const hasAllKeys = expectedKeys.every(k => keys.includes(k));

      if (hasAllKeys) {
        // 检查 linguisticExplanation 的子键
        const lingKeys = Object.keys(data[KEY_TO_CHECK].linguisticExplanation || {});
        const expectedLingKeys = ['title', 'subtitle', 'intro', 'challenges', 'advantages'];
        const hasAllLingKeys = expectedLingKeys.every(k => lingKeys.includes(k));

        if (hasAllLingKeys) {
          results.complete.push(lang);
          console.log(`✅ ${lang}: 翻译完整 (包含所有 ${expectedKeys.length} 个主键和 ${expectedLingKeys.length} 个子键)`);
        } else {
          results.incomplete.push(lang);
          console.log(`⚠️  ${lang}: 翻译不完整 (缺少 linguisticExplanation 的子键)`);
        }
      } else {
        results.incomplete.push(lang);
        const missingKeys = expectedKeys.filter(k => !keys.includes(k));
        console.log(`⚠️  ${lang}: 翻译不完整 (缺少键: ${missingKeys.join(', ')})`);
      }
    } else {
      results.incomplete.push(lang);
      console.log(`⚠️  ${lang}: 缺少 ${KEY_TO_CHECK} 键`);
    }
  } catch (error) {
    results.incomplete.push(lang);
    console.log(`❌ ${lang}: 解析错误 - ${error.message}`);
  }
});

console.log('\n📊 统计结果:');
console.log(`✅ 完整翻译: ${results.complete.length}/${LANGUAGES.length}`);
console.log(`⚠️  不完整: ${results.incomplete.length}`);
console.log(`❌ 文件缺失: ${results.missing.length}`);

if (results.complete.length === LANGUAGES.length) {
  console.log('\n🎉 所有语言翻译完整！');
  process.exit(0);
} else {
  console.log('\n⚠️  仍有语言需要翻译:');
  if (results.incomplete.length > 0) {
    console.log(`   不完整: ${results.incomplete.join(', ')}`);
  }
  if (results.missing.length > 0) {
    console.log(`   缺失文件: ${results.missing.join(', ')}`);
  }
  process.exit(1);
}
