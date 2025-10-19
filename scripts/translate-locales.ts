#!/usr/bin/env tsx
/**
 * UI 文案翻译工具
 * 功能：自动将 locales/en.json 翻译成其他 19 种语言
 */

import { config } from 'dotenv';
import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';
import { UI_LOCALES, UI_LOCALE_NAMES, UILocale } from '../src/config/ui-locales';

// 加载 .env.local 文件
config({ path: path.join(process.cwd(), '.env.local') });

interface TranslationMeta {
  lastUpdated: string;
  version: string;
  language: string;
  translatedBy: string;
  reviewedBy?: string | null;
  notes?: string;
}

interface TranslationFile {
  [key: string]: any;
  _meta?: TranslationMeta;
}

class TranslationTool {
  private openai: OpenAI;
  private baseLocale: UILocale = 'en';
  private localesDir = path.join(process.cwd(), 'locales');

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  /**
   * 读取基准文件（英语）
   */
  async readBaseFile(): Promise<TranslationFile> {
    const filePath = path.join(this.localesDir, `${this.baseLocale}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  }

  /**
   * 读取目标语言文件（如果存在）
   */
  async readTargetFile(locale: UILocale): Promise<TranslationFile> {
    const filePath = path.join(this.localesDir, `${locale}.json`);
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch {
      return {}; // 文件不存在，返回空对象
    }
  }

  /**
   * 提取所有键值对（扁平化）
   * 跳过 _meta 对象
   */
  flattenKeys(obj: any, prefix = ''): Record<string, string> {
    const result: Record<string, string> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (key === '_meta') continue; // 跳过元数据

      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === 'string') {
        result[fullKey] = value;
      } else if (typeof value === 'object' && value !== null) {
        Object.assign(result, this.flattenKeys(value, fullKey));
      }
    }

    return result;
  }

  /**
   * 检测缺失的键
   */
  detectMissingKeys(
    baseKeys: Record<string, string>,
    targetKeys: Record<string, string>
  ): Record<string, string> {
    const missing: Record<string, string> = {};

    for (const [key, value] of Object.entries(baseKeys)) {
      if (!targetKeys[key] || targetKeys[key].trim() === '') {
        missing[key] = value;
      }
    }

    return missing;
  }

  /**
   * 调用 OpenAI 翻译
   */
  async translate(text: string, targetLocale: UILocale): Promise<string> {
    const targetLanguage = UI_LOCALE_NAMES[targetLocale].english;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a professional UI/UX translator.
Translate the following UI text from English to ${targetLanguage}.

Requirements:
1. Keep the tone friendly and professional
2. Preserve placeholders like {variable}, {{template}}, <html>
3. Maintain formatting (line breaks, punctuation)
4. Use native speakers' conventions
5. For technical terms (API, URL, SRT, etc.), keep them in English
6. Keep the translation concise (suitable for UI buttons/labels)

Return ONLY the translated text, without explanations.`,
          },
          {
            role: 'user',
            content: text,
          },
        ],
        temperature: 0.3, // 降低随机性，提高一致性
      });

      return response.choices[0].message.content?.trim() || text;
    } catch (error) {
      console.error(`Translation error for "${text}":`, error);
      return text; // 失败时返回原文
    }
  }

  /**
   * 重新构建嵌套对象
   */
  unflattenKeys(flat: Record<string, string>): any {
    const result: any = {};

    for (const [key, value] of Object.entries(flat)) {
      const keys = key.split('.');
      let current = result;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
    }

    return result;
  }

  /**
   * 翻译单个语言
   */
  async translateLocale(
    targetLocale: UILocale,
    force = false
  ): Promise<void> {
    console.log(
      `\n🌍 Translating to: ${targetLocale} (${UI_LOCALE_NAMES[targetLocale].native})`
    );

    // 读取文件
    const baseFile = await this.readBaseFile();
    const targetFile = await this.readTargetFile(targetLocale);

    // 扁平化
    const baseKeys = this.flattenKeys(baseFile);
    const targetKeys = this.flattenKeys(targetFile);

    // 检测缺失或需要更新的键
    const keysToTranslate = force
      ? baseKeys
      : this.detectMissingKeys(baseKeys, targetKeys);

    const totalKeys = Object.keys(keysToTranslate).length;

    if (totalKeys === 0) {
      console.log('  ✅ All keys are up to date');
      return;
    }

    console.log(`  📝 Translating ${totalKeys} keys...`);

    // 批量翻译
    const translations: Record<string, string> = { ...targetKeys };

    let count = 0;
    for (const [key, value] of Object.entries(keysToTranslate)) {
      count++;
      process.stdout.write(`\r  ⏳ Progress: ${count}/${totalKeys}`);

      const translated = await this.translate(value, targetLocale);
      translations[key] = translated;

      // 避免触发速率限制
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    console.log('\n  ✅ Translation complete');

    // 重新构建嵌套结构
    const unflattenedTranslations = this.unflattenKeys(translations);

    // 添加元数据
    const version = targetFile._meta?.version || '1.0.0';
    const [major, minor, patch] = version.split('.').map(Number);
    const newVersion = force
      ? `${major + 1}.0.0`
      : `${major}.${minor}.${patch + 1}`;

    const resultFile: TranslationFile = {
      ...unflattenedTranslations,
      _meta: {
        lastUpdated: new Date().toISOString(),
        version: newVersion,
        language: targetLocale,
        translatedBy: 'gpt-3.5-turbo',
        reviewedBy: targetFile._meta?.reviewedBy || null,
        notes: targetFile._meta?.notes || '',
      },
    };

    // 保存文件
    const filePath = path.join(this.localesDir, `${targetLocale}.json`);
    await fs.writeFile(
      filePath,
      JSON.stringify(resultFile, null, 2) + '\n',
      'utf-8'
    );

    console.log(`  💾 Saved: ${filePath}`);
  }

  /**
   * 翻译所有语言
   */
  async translateAll(force = false): Promise<void> {
    console.log('🌍 Starting translation for all locales...\n');

    const targetLocales = UI_LOCALES.filter(
      (locale) => locale !== this.baseLocale
    );

    let successCount = 0;
    let failCount = 0;

    for (const locale of targetLocales) {
      try {
        await this.translateLocale(locale, force);
        successCount++;
      } catch (error) {
        failCount++;
        console.error(`\n❌ Error translating ${locale}:`, error);
      }
    }

    console.log(`\n✅ Translation complete!`);
    console.log(`   Success: ${successCount} languages`);
    if (failCount > 0) {
      console.log(`   Failed: ${failCount} languages`);
    }
  }

  /**
   * 检查缺失的键
   */
  async check(): Promise<void> {
    console.log('🔍 Checking translation completeness...\n');

    const baseFile = await this.readBaseFile();
    const baseKeys = this.flattenKeys(baseFile);
    const totalBaseKeys = Object.keys(baseKeys).length;

    console.log(
      `📖 Base locale (${this.baseLocale}): ${totalBaseKeys} keys\n`
    );

    const targetLocales = UI_LOCALES.filter(
      (locale) => locale !== this.baseLocale
    );

    let completeCount = 0;
    let incompleteCount = 0;

    for (const locale of targetLocales) {
      const targetFile = await this.readTargetFile(locale);
      const targetKeys = this.flattenKeys(targetFile);
      const missing = this.detectMissingKeys(baseKeys, targetKeys);
      const missingCount = Object.keys(missing).length;

      if (missingCount === 0) {
        console.log(
          `✅ ${locale} (${UI_LOCALE_NAMES[locale].native}): Complete (${totalBaseKeys} keys)`
        );
        completeCount++;
      } else {
        console.log(
          `⚠️  ${locale} (${UI_LOCALE_NAMES[locale].native}): ${missingCount} missing keys`
        );
        incompleteCount++;

        // 显示前 5 个缺失的键
        const missingKeys = Object.keys(missing).slice(0, 5);
        for (const key of missingKeys) {
          console.log(`     - ${key}`);
        }
        if (Object.keys(missing).length > 5) {
          console.log(`     ... and ${Object.keys(missing).length - 5} more`);
        }
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Complete: ${completeCount} languages`);
    console.log(`   Incomplete: ${incompleteCount} languages`);
  }
}

// CLI 入口
async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error(
      '❌ Error: OPENAI_API_KEY not found in environment variables'
    );
    console.error('   Please set it in .env.local file');
    process.exit(1);
  }

  const tool = new TranslationTool(apiKey);
  const command = process.argv[2];
  const args = process.argv.slice(3);

  try {
    switch (command) {
      case 'all':
        await tool.translateAll(args.includes('--force'));
        break;

      case 'locale': {
        const locale = args[0];
        if (!locale || !UI_LOCALES.includes(locale as any)) {
          console.error(`❌ Invalid locale: ${locale}`);
          console.error(
            `   Valid locales: ${UI_LOCALES.join(', ')}`
          );
          process.exit(1);
        }
        await tool.translateLocale(
          locale as UILocale,
          args.includes('--force')
        );
        break;
      }

      case 'check':
        await tool.check();
        break;

      default:
        console.log(`
📖 UI Translation Tool

Usage:
  npm run translate:all              # Translate all locales (19 languages)
  npm run translate:all -- --force   # Force re-translate all
  npm run translate:locale -- zh     # Translate specific locale
  npm run translate:check            # Check completeness

Examples:
  npm run translate:locale -- zh     # Translate Chinese
  npm run translate:locale -- fr     # Translate French
        `);
    }
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

main();
