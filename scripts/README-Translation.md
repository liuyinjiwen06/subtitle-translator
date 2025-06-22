# 界面翻译系统使用指南

## 🔍 重要概念区分

### 1. 页面内容语言 (Page Content Languages)
- **用途**: 特定页面的内容文件
- **位置**: `public/generated-content/`
- **示例**: `chinese-subtitle-page.json`, `french-subtitle-page.json`
- **对应页面**: `/zh/chinese-subtitle`, `/fr/french-subtitle`

### 2. 界面翻译语言 (UI Translation Languages)  
- **用途**: 通用界面文案翻译
- **位置**: `src/lib/locales/`
- **示例**: `zh.json`, `fr.json`, `es.json`
- **对应界面**: 导航栏、按钮、表单等通用界面元素

### 3. 语言映射关系
```
页面内容语言    →  界面翻译语言
chinese        →  zh (中文)
english        →  en (英语)  
french         →  fr (法语)
portuguese     →  pt (葡萄牙语)
spanish        →  es (西班牙语)
```

## 🛠️ 使用方法

### 查看当前配置
```bash
# 查看详细配置信息
node scripts/translate-config.js

# 查看配置状态
node scripts/config-manager.js status
```

### 修改配置

#### 切换翻译模式
```bash
# 切换到新合并内容模式 (翻译 fr, pt, es)
node scripts/config-manager.js set-mode newlyMergedContent

# 切换到所有语言模式  
node scripts/config-manager.js set-mode allUiLanguages

# 切换到优先级语言模式 (翻译 zh, fr, es, ja)
node scripts/config-manager.js set-mode priorityUiLanguages
```

#### 启用快速任务
```bash
# 启用中文界面翻译
node scripts/config-manager.js enable-task chineseUi

# 启用欧洲语言界面翻译
node scripts/config-manager.js enable-task europeanUi

# 启用亚洲语言界面翻译  
node scripts/config-manager.js enable-task asianUi
```

### 执行翻译

#### 使用预设配置翻译
```bash
# 使用当前活跃模式翻译 (推荐)
node scripts/translate-content.js
```

#### 手动指定语言翻译
```bash
# 翻译单个界面语言
node scripts/translate-content.js fr   # 法语界面
node scripts/translate-content.js zh   # 中文界面
node scripts/translate-content.js pt   # 葡萄牙语界面

# 翻译所有界面语言
node scripts/translate-content.js all
```

## 📋 预设模式说明

### newlyMergedContent (当前活跃)
- **描述**: 翻译新合并页面内容对应的界面语言
- **语言**: fr, pt, es
- **用途**: 为新添加的法语、葡萄牙语、西班牙语页面提供界面翻译

### allUiLanguages  
- **描述**: 翻译所有配置的界面语言
- **语言**: 所有17种界面语言
- **用途**: 全面翻译所有界面语言

### priorityUiLanguages
- **描述**: 翻译优先级界面语言  
- **语言**: zh, fr, es, ja
- **用途**: 优先翻译主要市场语言

### customUiLanguages
- **描述**: 自定义界面翻译语言列表
- **语言**: zh, fr (可修改)
- **用途**: 灵活的自定义翻译组合

## ⚡ 快速任务说明

### chineseUi
- **语言**: zh
- **用途**: 仅翻译中文界面

### europeanUi  
- **语言**: fr, es, de, it
- **用途**: 翻译欧洲主要语言界面

### asianUi
- **语言**: zh, ja, ko  
- **用途**: 翻译亚洲主要语言界面

## 🔧 在配置文件中修改设置

你可以直接编辑 `scripts/translate-config.js` 文件来：

1. **修改活跃模式**:
   ```javascript
   activeMode: 'newlyMergedContent'  // 改为其他模式名
   ```

2. **修改模式语言列表**:
   ```javascript
   newlyMergedContent: {
     languages: ['fr', 'pt', 'es', 'de'], // 添加德语
     enabled: true
   }
   ```

3. **添加新的快速任务**:
   ```javascript
   quickTasks: {
     myCustomTask: {
       description: '我的自定义任务',
       languages: ['zh', 'ja'],
       enabled: false
     }
   }
   ```

## 💡 最佳实践

1. **使用预设配置**: 优先使用 `node scripts/translate-content.js` 而不是手动指定语言
2. **检查配置状态**: 翻译前先运行 `node scripts/config-manager.js status` 确认配置
3. **备份重要文件**: 翻译会自动创建备份，但重要修改前建议手动备份
4. **分批翻译**: 对于大量语言，建议分批翻译避免API限制

## 🚨 注意事项

- ⚠️ 此翻译系统仅处理界面文案，不涉及页面内容翻译
- ⚠️ 翻译前确保 OpenAI API 密钥已正确配置
- ⚠️ 翻译会跳过已存在的内容，如需重新翻译请先删除目标文件
- ⚠️ 修改配置文件后无需重启，工具会自动读取最新配置 