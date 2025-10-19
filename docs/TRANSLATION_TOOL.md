# UI 文案翻译工具文档

本文档说明如何使用自动化翻译工具，将 UI 文案从英语翻译成其他 19 种语言。

---

## 📋 目录

- [工具概述](#工具概述)
- [核心功能](#核心功能)
- [使用方法](#使用方法)
- [增量更新机制](#增量更新机制)
- [翻译质量保证](#翻译质量保证)
- [常见场景](#常见场景)
- [技术实现](#技术实现)
- [故障排除](#故障排除)

---

## 🎯 工具概述

### 目的
自动将 `locales/en.json`（英语基准文件）中的文案翻译成其他 19 种 UI 语言，减少手动翻译工作量。

### 工作原理
```
英语基准文件 (en.json)
    ↓
翻译工具检测变化
    ↓
调用 OpenAI API 翻译缺失/修改的文案
    ↓
更新目标语言文件 (zh.json, fr.json, ...)
    ↓
保留元数据（时间戳、版本号）
```

### 适用场景
- ✅ 初次创建所有语言文件
- ✅ 添加新的文案键值
- ✅ 修改现有文案内容
- ✅ 定期批量更新
- ✅ 单独更新某一种语言

### 不适用场景
- ❌ 翻译字幕内容（使用主应用功能）
- ❌ 翻译文档（手动翻译更准确）
- ❌ 替代专业人工校对

---

## ⚙️ 核心功能

### 1. 增量翻译
- 只翻译新增或修改的文案
- 已翻译的内容不会重复调用 API
- 节省成本和时间

### 2. 版本控制
- 每个语言文件包含 `_meta` 元数据
- 记录最后更新时间和版本号
- 追踪翻译来源（机器翻译 vs 人工校对）

### 3. 批量操作
- 一次性翻译所有 19 种语言
- 支持并发翻译（提高速度）
- 进度实时显示

### 4. 质量检查
- 检测缺失的翻译键
- 验证 JSON 格式正确性
- 生成翻译报告

---

## 🚀 使用方法

### 前提条件

确保已配置 OpenAI API 密钥：

```bash
# .env.local
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```

### 基本命令

#### 1. 翻译所有语言

```bash
npm run translate:all
```

**效果：**
- 检查 `locales/en.json` 作为基准
- 更新所有 19 种目标语言文件
- 只翻译缺失或修改的文案
- 生成翻译报告

**输出示例：**
```
🌍 Starting UI translation...

📖 Base language: en (19 keys)
🎯 Target languages: 19

Translating to zh (Chinese)...
  ✓ Translated 3 new keys
  ⏭ Skipped 16 existing keys

Translating to fr (French)...
  ✓ Translated 3 new keys
  ⏭ Skipped 16 existing keys

...

✅ Translation complete!
📊 Summary:
  - Total keys translated: 57
  - Total API calls: 57
  - Estimated cost: $0.11
  - Duration: 45 seconds
```

#### 2. 翻译特定语言

```bash
npm run translate:locale -- zh
```

**效果：**
- 只更新中文（`zh.json`）
- 适合单独修复或更新某一语言

**输出示例：**
```
🌍 Translating to: zh (Chinese)

📖 Base file: locales/en.json (19 keys)
📝 Target file: locales/zh.json (16 keys)

Detecting changes...
  - 3 new keys to translate
  - 16 existing keys (unchanged)

Translating...
  ✓ common.newFeature → 新功能
  ✓ errors.timeout → 请求超时
  ✓ upload.retry → 重试

✅ zh.json updated successfully!
```

#### 3. 检查缺失的翻译

```bash
npm run translate:check
```

**效果：**
- 不进行翻译，只检测问题
- 列出所有缺失的键
- 验证文件格式

**输出示例：**
```
🔍 Checking translation completeness...

✅ en.json (base): 19 keys
⚠️  zh.json: 16 keys (3 missing)
  - common.newFeature
  - errors.timeout
  - upload.retry

✅ fr.json: 19 keys (complete)
⚠️  de.json: 18 keys (1 missing)
  - common.newFeature

...

📊 Summary:
  - Complete: 5 languages
  - Incomplete: 14 languages
  - Total missing keys: 42
```

#### 4. 强制重新翻译所有内容

```bash
npm run translate:force
```

**效果：**
- 忽略现有翻译，全部重新翻译
- ⚠️ 警告：会覆盖所有人工校对的内容
- 仅在需要统一翻译风格时使用

---

## 🔄 增量更新机制

### 工作原理

翻译工具通过以下步骤判断是否需要翻译某个键：

#### 1. 比对基准文件和目标文件

```typescript
// locales/en.json (基准)
{
  "common": {
    "upload": "Upload SRT File",
    "translate": "Start Translation",
    "newFeature": "New Feature"  // ← 新增的键
  }
}

// locales/zh.json (目标)
{
  "common": {
    "upload": "上传SRT文件",
    "translate": "开始翻译"
    // ← 缺少 "newFeature"
  }
}
```

#### 2. 检测三种情况

| 情况 | 操作 |
|-----|------|
| 键在目标文件中不存在 | ✅ 翻译 |
| 键存在，但值为空字符串 | ✅ 翻译 |
| 键存在，且有内容 | ⏭ 跳过（除非使用 `--force`）|

#### 3. 翻译并合并

```typescript
// 翻译后的 zh.json
{
  "common": {
    "upload": "上传SRT文件",        // 保留原有翻译
    "translate": "开始翻译",        // 保留原有翻译
    "newFeature": "新功能"          // ✅ 新翻译的内容
  },
  "_meta": {
    "lastUpdated": "2025-01-19T12:00:00Z",  // 更新时间戳
    "version": "1.0.1",                     // 版本号递增
    "translatedBy": "gpt-3.5-turbo"
  }
}
```

### 版本控制元数据

每个翻译文件底部包含 `_meta` 对象：

```json
{
  "_meta": {
    "lastUpdated": "2025-01-19T12:00:00Z",  // ISO 8601 时间戳
    "version": "1.0.1",                     // 语义化版本号
    "translatedBy": "gpt-3.5-turbo",        // 翻译来源
    "reviewedBy": null,                     // 人工校对者（可选）
    "notes": ""                             // 备注（可选）
  }
}
```

**字段说明：**
- `lastUpdated`：最后一次修改时间
- `version`：版本号（遵循 Semantic Versioning）
- `translatedBy`：翻译来源（`gpt-3.5-turbo` 或 `manual`）
- `reviewedBy`：人工校对者姓名（如有）
- `notes`：特殊说明

---

## 🎨 翻译质量保证

### 1. 翻译提示词优化

工具使用专门优化的提示词，确保翻译质量：

```typescript
const systemPrompt = `You are a professional UI/UX translator.
Translate the following UI text from English to {targetLanguage}.

Requirements:
1. Keep the tone friendly and professional
2. Preserve placeholders like {variable}, {{template}}, <html>
3. Maintain formatting (line breaks, punctuation)
4. Use native speakers' conventions
5. For technical terms (API, URL, etc.), keep them in English
6. Keep the translation concise (suitable for UI buttons/labels)

Return ONLY the translated text, without explanations.`;
```

### 2. 占位符保护

自动识别和保护特殊字符：

| 类型 | 示例 | 翻译结果 |
|-----|------|---------|
| 变量占位符 | `{count} files` | `{count} 个文件` ✅ |
| 模板语法 | `{{username}}` | `{{username}}` ✅ |
| HTML 标签 | `<strong>Error</strong>` | `<strong>错误</strong>` ✅ |
| 技术术语 | `SRT file format` | `SRT 文件格式` ✅ |

### 3. 人工校对流程

**推荐工作流：**

1. 运行自动翻译：`npm run translate:all`
2. 生成待校对列表：`npm run translate:check`
3. 人工校对重要语言（如 zh, es, fr）
4. 更新 `_meta.reviewedBy` 字段：
   ```json
   {
     "_meta": {
       "translatedBy": "gpt-3.5-turbo",
       "reviewedBy": "Zhang San",  // 添加校对者
       "lastUpdated": "2025-01-19T14:00:00Z"
     }
   }
   ```

### 4. 质量检查清单

在每次翻译后手动检查：

- [ ] 按钮文字长度适中（不超出容器）
- [ ] 错误提示清晰易懂
- [ ] 占位符位置正确
- [ ] 语气一致（友好/正式）
- [ ] 无机翻痕迹（如"的的的"、语序错误）
- [ ] 技术术语准确

---

## 📚 常见场景

### 场景 1：首次创建所有翻译文件

**情况：** 刚完成 `en.json`，需要创建其他 19 种语言文件

```bash
# 1. 确保 en.json 完整
cat locales/en.json

# 2. 运行翻译工具
npm run translate:all

# 3. 检查结果
npm run translate:check
```

**预期结果：**
- 创建 19 个语言文件（zh.json, fr.json, ...）
- 每个文件包含所有键的翻译
- 总 API 调用次数：`英语键数量 × 19`

**成本估算：**
假设 `en.json` 有 50 个键：
- API 调用：50 × 19 = 950 次
- 成本：约 $1.90（GPT-3.5-turbo）

---

### 场景 2：添加新功能，新增 5 个文案键

**情况：** 开发了新功能，在 `en.json` 中添加了 5 个新键

```json
// locales/en.json（新增内容）
{
  "newFeature": {
    "title": "Batch Translation",
    "description": "Translate multiple files at once",
    "upload": "Upload Files",
    "maxFiles": "Maximum {count} files",
    "processing": "Processing {current} of {total}..."
  }
}
```

**操作：**

```bash
# 增量翻译（只翻译新增的 5 个键）
npm run translate:all
```

**预期结果：**
- 检测到 5 个新键
- 翻译到 19 种语言
- API 调用：5 × 19 = 95 次
- 成本：约 $0.19

---

### 场景 3：修改现有文案

**情况：** 修改了 `en.json` 中某个按钮的文字

```json
// 修改前
{
  "common": {
    "upload": "Upload SRT File"
  }
}

// 修改后
{
  "common": {
    "upload": "Upload Your Subtitle File"
  }
}
```

**问题：** 增量翻译不会检测到"修改"，只检测"新增"

**解决方案：**

**方法 A：手动删除需要重新翻译的键**
```bash
# 使用脚本删除特定键
npm run translate:remove-key -- common.upload

# 重新翻译
npm run translate:all
```

**方法 B：强制重新翻译所有内容**
```bash
npm run translate:force
```
⚠️ 注意：会覆盖所有人工校对的内容！

**方法 C：手动修改目标语言文件（推荐）**
- 如果只改了 1-2 个键，手动修改更快
- 使用 AI 辅助翻译（如 ChatGPT）
- 保留 `_meta.reviewedBy` 标记为人工校对

---

### 场景 4：单独修复某一种语言

**情况：** 用户反馈中文翻译有问题

```bash
# 1. 检查中文文件
cat locales/zh.json

# 2. 只重新翻译中文
npm run translate:locale -- zh

# 或者手动修改后标记为已校对
# 编辑 zh.json，然后更新元数据：
npm run translate:mark-reviewed -- zh "Your Name"
```

---

### 场景 5：准备发布前的质量检查

**情况：** 上线前确保所有翻译完整

```bash
# 1. 检查缺失的翻译
npm run translate:check

# 2. 如果有缺失，补全翻译
npm run translate:all

# 3. 生成翻译报告
npm run translate:report > translation-report.txt

# 4. 验证 JSON 格式
npm run lint:locales
```

---

## 🛠️ 技术实现

### 脚本架构

位置：`scripts/translate-locales.ts`

```typescript
import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';
import { UI_LOCALES, UI_LOCALE_NAMES } from '@/config/ui-locales';

interface TranslationMeta {
  lastUpdated: string;
  version: string;
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
  private baseLocale = 'en';
  private localesDir = path.join(process.cwd(), 'locales');

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  // 读取基准文件
  async readBaseFile(): Promise<TranslationFile> {
    const filePath = path.join(this.localesDir, `${this.baseLocale}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  }

  // 读取目标语言文件（如果存在）
  async readTargetFile(locale: string): Promise<TranslationFile> {
    const filePath = path.join(this.localesDir, `${locale}.json`);
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch {
      return {}; // 文件不存在，返回空对象
    }
  }

  // 提取所有需要翻译的键值对（扁平化）
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

  // 检测缺失的键
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

  // 调用 OpenAI 翻译
  async translate(
    text: string,
    targetLocale: string
  ): Promise<string> {
    const targetLanguage = UI_LOCALE_NAMES[targetLocale].english;

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

Return ONLY the translated text, without explanations.`
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.3, // 降低随机性，提高一致性
    });

    return response.choices[0].message.content?.trim() || text;
  }

  // 重新构建嵌套对象
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

  // 翻译单个语言
  async translateLocale(
    targetLocale: string,
    force = false
  ): Promise<void> {
    console.log(`\n🌍 Translating to: ${targetLocale} (${UI_LOCALE_NAMES[targetLocale].native})`);

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
      await new Promise(resolve => setTimeout(resolve, 100));
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
        translatedBy: 'gpt-3.5-turbo',
        reviewedBy: targetFile._meta?.reviewedBy || null,
        notes: targetFile._meta?.notes || ''
      }
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

  // 翻译所有语言
  async translateAll(force = false): Promise<void> {
    console.log('🌍 Starting translation for all locales...\n');

    const targetLocales = UI_LOCALES.filter(locale => locale !== this.baseLocale);

    for (const locale of targetLocales) {
      await this.translateLocale(locale, force);
    }

    console.log('\n✅ All translations complete!');
  }

  // 检查缺失的键
  async check(): Promise<void> {
    console.log('🔍 Checking translation completeness...\n');

    const baseFile = await this.readBaseFile();
    const baseKeys = this.flattenKeys(baseFile);
    const totalBaseKeys = Object.keys(baseKeys).length;

    console.log(`📖 Base locale (${this.baseLocale}): ${totalBaseKeys} keys\n`);

    const targetLocales = UI_LOCALES.filter(locale => locale !== this.baseLocale);

    for (const locale of targetLocales) {
      const targetFile = await this.readTargetFile(locale);
      const targetKeys = this.flattenKeys(targetFile);
      const missing = this.detectMissingKeys(baseKeys, targetKeys);
      const missingCount = Object.keys(missing).length;

      if (missingCount === 0) {
        console.log(`✅ ${locale}: Complete (${totalBaseKeys} keys)`);
      } else {
        console.log(`⚠️  ${locale}: ${missingCount} missing keys`);
        for (const key of Object.keys(missing)) {
          console.log(`     - ${key}`);
        }
      }
    }
  }
}

// CLI 入口
async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('❌ Error: OPENAI_API_KEY not found in environment variables');
    process.exit(1);
  }

  const tool = new TranslationTool(apiKey);
  const command = process.argv[2];
  const args = process.argv.slice(3);

  switch (command) {
    case 'all':
      await tool.translateAll(args.includes('--force'));
      break;

    case 'locale':
      const locale = args[0];
      if (!locale || !UI_LOCALES.includes(locale as any)) {
        console.error(`❌ Invalid locale: ${locale}`);
        process.exit(1);
      }
      await tool.translateLocale(locale, args.includes('--force'));
      break;

    case 'check':
      await tool.check();
      break;

    default:
      console.log(`
Usage:
  npm run translate:all              # Translate all locales
  npm run translate:all -- --force   # Force re-translate all
  npm run translate:locale -- zh     # Translate specific locale
  npm run translate:check            # Check completeness
      `);
  }
}

main();
```

### package.json 脚本配置

```json
{
  "scripts": {
    "translate:all": "tsx scripts/translate-locales.ts all",
    "translate:force": "tsx scripts/translate-locales.ts all --force",
    "translate:locale": "tsx scripts/translate-locales.ts locale",
    "translate:check": "tsx scripts/translate-locales.ts check"
  }
}
```

---

## ❓ 故障排除

### 问题 1: OpenAI API 调用失败

**错误信息：**
```
Error: 401 Unauthorized
```

**解决方案：**
1. 检查 `.env.local` 中的 `OPENAI_API_KEY` 是否正确
2. 确认 API 密钥未过期
3. 检查 OpenAI 账户余额

---

### 问题 2: 翻译结果包含乱码

**原因：** 文件编码问题

**解决方案：**
```bash
# 确保所有 JSON 文件使用 UTF-8 编码
file locales/*.json  # 应显示 "UTF-8 Unicode text"

# 如果不是 UTF-8，转换编码
iconv -f ISO-8859-1 -t UTF-8 locales/zh.json > locales/zh.json.new
mv locales/zh.json.new locales/zh.json
```

---

### 问题 3: 翻译后 JSON 格式错误

**错误信息：**
```
SyntaxError: Unexpected token } in JSON
```

**解决方案：**
```bash
# 使用 JSON 校验工具
npm run lint:locales

# 手动修复或重新生成
npm run translate:locale -- zh --force
```

---

### 问题 4: 占位符被翻译了

**示例：**
```json
// 错误：{count} 被翻译成了 {数量}
{
  "upload": "{数量} files uploaded"
}
```

**解决方案：**
1. 检查翻译提示词是否包含"保留占位符"的指令
2. 手动修复该键
3. 标记为已校对（防止被覆盖）：
   ```bash
   npm run translate:mark-reviewed -- zh "Your Name"
   ```

---

### 问题 5: 成本超出预算

**情况：** API 调用次数过多

**优化方案：**
1. 使用 `translate:check` 先检查，避免不必要的翻译
2. 只翻译特定语言：`npm run translate:locale -- zh`
3. 批量操作时添加延迟，避免速率限制额外重试

---

## 📊 成本估算工具

在翻译前估算成本：

```bash
npm run translate:estimate
```

**输出示例：**
```
📊 Translation Cost Estimation

Base file: locales/en.json
Total keys: 50

Target languages: 19
Total translations needed: 950

GPT-3.5-turbo pricing:
  - Input: $0.0015 / 1K tokens
  - Output: $0.002 / 1K tokens

Estimated tokens:
  - Input: ~10,000 tokens ($0.015)
  - Output: ~12,000 tokens ($0.024)

💰 Total estimated cost: $0.04 - $0.06
```

---

**最后更新：** 2025-01-19
**文档版本：** 1.0.0
