# 🚀 翻译脚本新手操作指导

## 📋 目录
- [快速开始](#快速开始)
- [配置管理](#配置管理)
- [翻译操作](#翻译操作)
- [常见问题](#常见问题)

## 🎯 快速开始

### 1. 查看当前配置状态
```bash
node scripts/config-manager.js status
```

### 2. 开始翻译
```bash
node scripts/translate-content.js
```

## ⚙️ 配置管理

### 翻译模式
系统提供两种翻译模式：

#### 🌍 全翻译模式 (all)
- 翻译所有17种支持的语言
- 适合：完整的多语言发布

```bash
# 切换到全翻译模式
node scripts/config-manager.js switch all
```

#### 🎯 部分翻译模式 (partial)
- 只翻译指定的语言
- 适合：测试或特定市场发布

```bash
# 切换到部分翻译模式
node scripts/config-manager.js switch partial

# 设置要翻译的语言（用逗号分隔）
node scripts/config-manager.js set-partial fr,es,de
```

### 支持的语言代码
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

## 🔄 翻译操作

### 主要脚本
1. **translate-content.js** - 主翻译脚本
2. **config-manager.js** - 配置管理工具
3. **merge-content-to-i18n.js** - 内容合并脚本
4. **detect-new-content.js** - 新内容检测脚本

### 典型工作流程

#### 1. 检查配置
```bash
node scripts/config-manager.js status
```

#### 2. 设置翻译范围
```bash
# 如果只想翻译几种语言
node scripts/config-manager.js switch partial
node scripts/config-manager.js set-partial zh,fr,es

# 如果要翻译所有语言
node scripts/config-manager.js switch all
```

#### 3. 开始翻译
```bash
node scripts/translate-content.js
```

#### 4. 检测新内容（可选）
```bash
node scripts/detect-new-content.js
```

## 🛠️ 常见问题

### Q1: 如何只翻译中文？
```bash
node scripts/config-manager.js switch partial
node scripts/config-manager.js set-partial zh
node scripts/translate-content.js
```

### Q2: 如何翻译欧洲主要语言？
```bash
node scripts/config-manager.js switch partial
node scripts/config-manager.js set-partial fr,es,de,it
node scripts/translate-content.js
```

### Q3: 翻译出错了怎么办？
- 检查 OpenAI API 密钥是否正确
- 查看错误日志
- 系统会自动创建备份，可以恢复

### Q4: 如何查看翻译进度？
翻译脚本会显示实时进度：
- 显示当前翻译的语言
- 显示翻译进度百分比
- 显示预计剩余时间

### Q5: 如何验证翻译结果？
翻译完成后检查：
- `src/lib/locales/` 目录下的翻译文件
- 启动开发服务器测试页面显示

## 📁 文件结构

```
scripts/
├── translate-config.js          # 配置文件
├── config-manager.js           # 配置管理工具
├── translate-content.js        # 主翻译脚本
├── merge-content-to-i18n.js    # 内容合并脚本
├── detect-new-content.js       # 新内容检测
└── README-新手操作指导.md      # 本文档

src/lib/locales/                # 翻译文件目录
├── en.json                     # 英文源文件
├── zh.json                     # 中文翻译
├── fr.json                     # 法语翻译
└── ...                         # 其他语言文件
```

## 🎉 完成！

按照以上步骤，你就可以轻松管理多语言翻译了！如果遇到问题，请检查配置文件或查看脚本输出的错误信息。 