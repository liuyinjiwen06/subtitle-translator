# 🌍 多语言翻译脚本使用指南

## 概述
智能翻译脚本 `translate-i18n.js` 支持增量翻译和新语言添加，避免重复翻译已有内容，节省API成本。

## 前置要求
1. 设置OpenAI API Key：
```bash
export OPENAI_API_KEY="your-api-key-here"
```

2. 确保依赖已安装：
```bash
npm install openai
```

## 使用方式

### 1. 完整翻译（推荐首次使用）
```bash
# 翻译所有17种语言的缺失内容
node scripts/translate-i18n.js
```

### 2. 指定语言翻译
```bash
# 只翻译中文和日文
node scripts/translate-i18n.js --lang=zh,ja

# 只翻译法语
node scripts/translate-i18n.js --lang=fr
```

### 3. 指定Key翻译（用于新增内容）
```bash
# 只翻译homepage相关的新增内容
node scripts/translate-i18n.js --keys=homepage

# 翻译多个指定key
node scripts/translate-i18n.js --keys=homepage,footer,seo
```

### 4. 强制重新翻译
```bash
# 强制重新翻译所有内容（慎用，会产生较高API费用）
node scripts/translate-i18n.js --force

# 强制重新翻译指定语言
node scripts/translate-i18n.js --lang=zh --force
```

### 5. 组合使用
```bash
# 强制重新翻译中文的homepage部分
node scripts/translate-i18n.js --lang=zh --keys=homepage --force
```

## 工作流程

### 场景1：初次使用
```bash
# 翻译所有语言的所有内容
node scripts/translate-i18n.js
```

### 场景2：en.json新增内容后
```bash
# 假设你在en.json中新增了 "newFeature" 相关内容
node scripts/translate-i18n.js --keys=newFeature

# 或者直接运行，脚本会自动检测缺失的内容
node scripts/translate-i18n.js
```

### 场景3：新增支持语言
1. 在 `i18nConfig.ts` 中添加新语言代码
2. 在脚本的 `languageMap` 中添加对应的语言名称
3. 运行翻译：
```bash
# 脚本会自动检测新语言并翻译
node scripts/translate-i18n.js
```

## 脚本特性

### ✅ 智能增量翻译
- 自动检测缺失的翻译内容
- 避免重复翻译已有内容
- 节省API调用成本

### ✅ 灵活的参数控制
- `--lang`: 指定目标语言
- `--keys`: 指定翻译的key范围
- `--force`: 强制重新翻译

### ✅ 自适应配置
- 自动读取 `i18nConfig.ts` 获取支持的语言
- 动态语言映射
- 支持新语言无需修改脚本核心逻辑

## 最佳实践

1. **首次使用**：直接运行完整翻译
2. **日常维护**：只使用 `--keys` 参数翻译新增内容
3. **质量检查**：定期检查翻译质量，必要时使用 `--force` 重新翻译
4. **备份**：翻译前备份现有翻译文件
5. **批量操作**：避免频繁的小批量翻译，建议积累后批量处理