# 翻译脚本使用说明

本目录包含多个翻译脚本，用于维护项目的多语言内容。

## 脚本列表

### 1. translate-config.js
**配置文件** - 统一管理所有翻译相关的变量和设置。

**功能：**
- 存储 OpenAI API 密钥
- 配置目标语言列表
- 设置翻译参数（批次大小、延迟等）
- 定义文件路径和翻译选项

**查看配置：**
```bash
node scripts/translate-config.js
```

### 2. translate-content.js
**主翻译脚本** - 使用 OpenAI API 将英文内容翻译为其他语种。

**用途：**
- 自动识别缺失的翻译内容
- 调用 OpenAI GPT-4 进行高质量翻译
- 保持现有翻译不变，只补充缺失部分
- 支持分批处理大文件
- 自动创建备份文件

**使用方法：**
```bash
# 1. 翻译单个语言
node scripts/translate-content.js <target-language>

# 2. 翻译所有配置的语言
node scripts/translate-content.js all

# 示例
node scripts/translate-content.js zh     # 翻译中文
node scripts/translate-content.js fr     # 翻译法语
node scripts/translate-content.js all    # 翻译所有语言
```

### 3. run-translation.js
**快速执行脚本** - 简化的翻译执行器，使用配置文件设置。

**用途：**
- 快速执行翻译任务
- 显示当前配置信息
- 简化的命令行界面

**使用方法：**
```bash
# 快速翻译指定语言
node scripts/run-translation.js zh

# 快速翻译所有语言
node scripts/run-translation.js
```

### 4. merge-content-to-i18n.js
将生成的页面内容合并到 i18n 翻译文件中。

**使用方法：**
```bash
node scripts/merge-content-to-i18n.js <language-name> <language-code>

# 示例
node scripts/merge-content-to-i18n.js chinese zh
node scripts/merge-content-to-i18n.js english en
```

## 快速开始

### 1. 配置 API 密钥
编辑 `scripts/translate-config.js` 文件，设置你的 OpenAI API 密钥：
```javascript
const config = {
  openai: {
    apiKey: 'your-openai-api-key-here',
    // ... 其他配置
  }
};
```

### 2. 查看配置
```bash
node scripts/translate-config.js
```

### 3. 开始翻译
```bash
# 推荐：使用快速脚本
node scripts/run-translation.js zh

# 或者使用主脚本
node scripts/translate-content.js zh
```

## 配置选项

### OpenAI API 配置
```javascript
openai: {
  apiKey: 'your-api-key',        // API 密钥
  model: 'gpt-4',                // 使用的模型
  temperature: 0.3,              // 翻译温度
  maxTokens: 4000,               // 最大 tokens
  batchSize: 20,                 // 批次大小
  delayBetweenBatches: 1000      // 批次间延迟（毫秒）
}
```

### 目标语言配置
```javascript
targetLanguages: [
  'zh',  // 中文
  'fr',  // 法语
  'es',  // 西班牙语
  // ... 更多语言
]
```

### 翻译选项
```javascript
translationOptions: {
  createBackup: true,            // 创建备份
  skipExisting: true,            // 跳过已有翻译
  verbose: true,                 // 详细日志
  skipKeys: ['languages'],       // 跳过的键
  specialKeys: ['seo.keywords']  // 特殊处理的键
}
```

## 支持的语言

当前配置支持以下语言：
- `zh` - 中文
- `fr` - 法语  
- `es` - 西班牙语
- `de` - 德语
- `ja` - 日语
- `ko` - 韩语
- `pt` - 葡萄牙语
- `it` - 意大利语
- `ru` - 俄语
- `ar` - 阿拉伯语
- `hi` - 印地语
- `th` - 泰语
- `vi` - 越南语
- `tr` - 土耳其语
- `pl` - 波兰语
- `nl` - 荷兰语
- `sv` - 瑞典语

## 工作流程建议

### 完整的多语言内容创建流程：

1. **配置API密钥**
   ```bash
   # 编辑 scripts/translate-config.js
   vim scripts/translate-config.js
   ```

2. **生成页面内容**（如果有新的语言页面）
   ```bash
   # 将页面内容文件放在 public/generated-content/ 目录下
   ```

3. **合并页面内容到 i18n**
   ```bash
   node scripts/merge-content-to-i18n.js chinese zh
   ```

4. **翻译缺失的内容**
   ```bash
   node scripts/run-translation.js zh
   ```

5. **验证翻译结果**
   - 检查生成的翻译文件
   - 在本地测试页面显示效果
   - 必要时手动调整翻译内容

### 批量翻译多种语言：

```bash
# 翻译所有配置的语言
node scripts/run-translation.js

# 或者
node scripts/translate-content.js all
```

## 注意事项

### API 使用
- ✅ API 密钥统一在配置文件中管理
- ✅ 使用 GPT-4 模型，确保翻译质量
- ✅ 自动分批处理，避免 API 限制
- ✅ 包含延迟机制防止频率限制

### 翻译质量保证
- ✅ 脚本会保持原有翻译不变
- ✅ 只翻译缺失或与英文相同的内容
- ✅ 保持 JSON 结构和键名不变
- ✅ 支持嵌套对象和数组翻译

### 文件安全
- ✅ 自动创建备份文件（在 `backups/` 目录）
- ✅ 深拷贝避免意外修改
- ✅ 完整的错误处理和日志输出

### 成本控制
- ✅ 智能识别需要翻译的内容
- ✅ 避免重复翻译已有内容
- ✅ 分批处理控制单次 API 调用大小

## 故障排除

### 常见问题

**1. API 密钥错误**
```
❌ OpenAI API key is required
```
解决：在 `translate-config.js` 中设置正确的 API 密钥

**2. 配置文件加载失败**
```
❌ Cannot find module './translate-config'
```
解决：确保 `translate-config.js` 文件存在且语法正确

**3. JSON 解析失败**
```
❌ 翻译结果JSON解析失败
```
解决：检查 API 响应，可能需要重试或调整批次大小

**4. 文件权限问题**
```
❌ EACCES: permission denied
```
解决：检查文件权限，确保有写入权限

### 调试技巧

1. **查看配置**
   ```bash
   node scripts/translate-config.js
   ```

2. **查看帮助信息**
   ```bash
   node scripts/translate-content.js --help
   ```

3. **测试单个语言**
   ```bash
   node scripts/translate-content.js zh
   ```

4. **检查备份文件**
   ```bash
   ls -la backups/
   ```

## 扩展开发

### 添加新语言
在 `translate-config.js` 中添加：
```javascript
targetLanguages: [
  // ... 现有语言
  'new-lang-code'
],
languageNames: {
  // ... 现有映射
  'new-lang-code': '新语言名称'
}
```

### 调整翻译参数
在配置文件中修改：
```javascript
openai: {
  batchSize: 10,        // 减少批次大小
  temperature: 0.1,     // 更保守的翻译
  delayBetweenBatches: 2000  // 增加延迟
}
```

### 自定义跳过规则
```javascript
translationOptions: {
  skipKeys: [
    'languages',
    'nav',
    'custom-section'
  ]
}
``` 