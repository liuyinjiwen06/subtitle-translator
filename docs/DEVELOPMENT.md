# 开发指南

本文档提供字幕翻译器项目的开发、部署和维护指南。

---

## 📋 目录

- [环境要求](#环境要求)
- [快速开始](#快速开始)
- [环境变量配置](#环境变量配置)
- [本地开发](#本地开发)
- [测试](#测试)
- [部署到 Cloudflare](#部署到-cloudflare)
- [常见问题](#常见问题)

---

## 🔧 环境要求

### 必需软件
| 软件 | 版本 | 说明 |
|-----|------|------|
| Node.js | ≥ 18.17.0 | 推荐使用 LTS 版本 |
| npm | ≥ 9.0.0 | 或使用 pnpm/yarn |
| Git | ≥ 2.0 | 版本控制 |

### 必需账户
- **Cloudflare 账户**（免费）：用于部署 Pages 和 Workers
- **OpenAI 账户**：获取 API 密钥（需要信用卡）

### 推荐工具
- **VS Code**：推荐的代码编辑器
- **VS Code 插件**：
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript Vue Plugin (Volar)

---

## 🚀 快速开始

### 1. 克隆项目（如果已有仓库）

```bash
git clone <your-repo-url>
cd subtitle-translator
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

创建 `.env.local` 文件：

```bash
cp .env.example .env.local
```

编辑 `.env.local`，填入您的 OpenAI API 密钥：

```env
# OpenAI API 配置（仅用于本地开发）
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx

# Cloudflare Workers URL（本地开发可留空）
NEXT_PUBLIC_WORKERS_URL=http://localhost:8787
```

⚠️ **注意：** `.env.local` 已添加到 `.gitignore`，不会提交到 Git。

### 4. 启动开发服务器

```bash
npm run dev
```

浏览器访问 [http://localhost:3000](http://localhost:3000)

---

## 🔐 环境变量配置

### 前端环境变量（Next.js）

文件：`.env.local`

```env
# OpenAI API Key（仅本地开发使用，生产环境不使用）
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx

# Cloudflare Workers URL
NEXT_PUBLIC_WORKERS_URL=http://localhost:8787  # 本地开发
# NEXT_PUBLIC_WORKERS_URL=https://translator.your-domain.workers.dev  # 生产环境
```

**变量说明：**
- `OPENAI_API_KEY`：仅用于本地测试，生产环境中 API 密钥存储在 Cloudflare Workers
- `NEXT_PUBLIC_WORKERS_URL`：Workers API 端点（`NEXT_PUBLIC_` 前缀表示会暴露给浏览器）

### Cloudflare Workers 环境变量

**生产环境配置（通过 Cloudflare Dashboard）：**

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** → 选择您的 Worker
3. 点击 **Settings** → **Variables**
4. 添加以下环境变量：

| 变量名 | 值 | 类型 | 说明 |
|-------|---|------|------|
| `OPENAI_API_KEY` | `sk-proj-xxxxx` | Secret | OpenAI API 密钥 |
| `RATE_LIMIT_HOURLY` | `10` | Plain | 每小时请求限制 |
| `RATE_LIMIT_DAILY` | `50` | Plain | 每天请求限制 |

**本地开发配置（wrangler.toml）：**

创建 `.dev.vars` 文件（不提交到 Git）：

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
RATE_LIMIT_HOURLY=10
RATE_LIMIT_DAILY=50
```

---

## 💻 本地开发

### 启动 Next.js 开发服务器

```bash
npm run dev
```

- 地址：http://localhost:3000
- 热重载：代码修改自动刷新
- TypeScript 类型检查：实时错误提示

### 启动 Cloudflare Workers 本地开发

在新的终端窗口运行：

```bash
cd workers
npx wrangler dev
```

- 地址：http://localhost:8787
- 模拟 Cloudflare Workers 环境
- 读取 `.dev.vars` 中的环境变量

### 同时运行前端和后端

```bash
npm run dev:all
```

这个命令会并行启动：
- Next.js 开发服务器（端口 3000）
- Cloudflare Workers 本地服务（端口 8787）

### 项目脚本命令

```bash
# 开发
npm run dev                 # 启动 Next.js 开发服务器
npm run dev:workers         # 启动 Workers 本地开发
npm run dev:all             # 同时启动前端和后端

# 构建
npm run build               # 构建 Next.js 应用
npm run build:workers       # 构建 Workers

# 代码质量
npm run lint                # 运行 ESLint 检查
npm run lint:fix            # 自动修复 ESLint 错误
npm run format              # 运行 Prettier 格式化
npm run type-check          # TypeScript 类型检查

# 测试
npm run test                # 运行单元测试
npm run test:watch          # 监听模式运行测试
npm run test:e2e            # 运行端到端测试

# 翻译工具（Phase 5 开发）
npm run translate:all       # 翻译所有 UI 文案到 20 种语言
npm run translate:check     # 检查缺失的翻译
npm run translate:locale -- zh  # 只翻译特定语言

# 工具脚本
npm run generate:pairs      # 生成语言对页面配置
npm run generate:sitemap    # 生成 sitemap.xml
```

---

## 🧪 测试

### 单元测试

使用 Jest + React Testing Library：

```bash
# 运行所有测试
npm run test

# 监听模式（开发时推荐）
npm run test:watch

# 生成覆盖率报告
npm run test:coverage
```

### 端到端测试

使用 Playwright：

```bash
# 安装浏览器（首次运行）
npx playwright install

# 运行 E2E 测试
npm run test:e2e

# 以 UI 模式运行（可视化调试）
npm run test:e2e:ui
```

### 测试关键功能

**必测项目清单：**
- [ ] SRT 文件上传和解析
- [ ] 语言选择器（50 种语言）
- [ ] 翻译 API 调用（成功/失败情况）
- [ ] 单语/双语字幕生成
- [ ] 文件下载
- [ ] 速率限制（模拟多次请求）
- [ ] 多语言路由（20 种 UI 语言）
- [ ] 语言对页面（随机抽查 10 个）

---

## 🚢 部署到 Cloudflare

### 前提条件

1. 拥有 Cloudflare 账户
2. 安装 Wrangler CLI：
   ```bash
   npm install -g wrangler
   ```
3. 登录 Wrangler：
   ```bash
   wrangler login
   ```

### 部署步骤

#### 1. 部署 Cloudflare Workers

```bash
cd workers
wrangler deploy
```

部署后会得到 Workers URL，例如：
```
https://translator.your-username.workers.dev
```

记下这个 URL，稍后配置到 Next.js。

#### 2. 配置 Workers 环境变量

通过 Cloudflare Dashboard 配置：

1. 进入 **Workers & Pages** → 选择 `translator` Worker
2. **Settings** → **Variables** → **Add variable**
3. 添加以下变量：

```
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx  (Secret)
RATE_LIMIT_HOURLY=10  (Plain)
RATE_LIMIT_DAILY=50   (Plain)
```

或使用命令行：

```bash
wrangler secret put OPENAI_API_KEY
# 输入您的 API 密钥
```

#### 3. 部署 Next.js 到 Cloudflare Pages

**方法 A：通过 Git 自动部署（推荐）**

1. 将代码推送到 GitHub/GitLab
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
4. 选择您的仓库
5. 配置构建设置：
   - **Framework preset**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
   - **Root directory**: `/`
6. 添加环境变量：
   ```
   NEXT_PUBLIC_WORKERS_URL=https://translator.your-username.workers.dev
   ```
7. 点击 **Save and Deploy**

**方法 B：通过 Wrangler 手动部署**

```bash
# 构建 Next.js
npm run build

# 部署到 Pages
npx wrangler pages deploy .next --project-name=subtitle-translator
```

#### 4. 配置自定义域名（可选）

1. 在 Cloudflare Pages 设置中添加自定义域名
2. 更新 DNS 记录（自动完成）
3. 等待 SSL 证书生成（几分钟）

---

## 🔄 持续集成/持续部署（CI/CD）

### GitHub Actions 配置

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Cloudflare

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test

      - name: Build
        run: npm run build

      - name: Deploy Workers
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          workingDirectory: 'workers'

      - name: Deploy Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: subtitle-translator
          directory: .next
```

在 GitHub 仓库设置中添加 Secrets：
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

---

## 🐛 常见问题

### Q1: 本地开发时 OpenAI API 调用失败

**问题：** 提示 "API key not found" 或 401 错误

**解决方案：**
1. 检查 `.env.local` 文件是否存在且包含 `OPENAI_API_KEY`
2. 确认 API 密钥格式正确（以 `sk-` 开头）
3. 重启开发服务器（`npm run dev`）
4. 检查 OpenAI 账户余额是否充足

### Q2: Workers 本地开发无法连接

**问题：** `npm run dev:workers` 启动失败

**解决方案：**
1. 确保已安装 Wrangler：`npm install -g wrangler`
2. 检查 `.dev.vars` 文件是否存在
3. 检查端口 8787 是否被占用：
   ```bash
   lsof -i :8787  # macOS/Linux
   netstat -ano | findstr :8787  # Windows
   ```

### Q3: 部署后 API 调用 CORS 错误

**问题：** 浏览器控制台显示跨域错误

**解决方案：**
在 `workers/translator.ts` 中添加 CORS 头：
```typescript
return new Response(JSON.stringify(result), {
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://your-domain.pages.dev',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }
})
```

### Q4: 多语言路由 404 错误

**问题：** 访问 `/zh` 或 `/fr` 返回 404

**解决方案：**
1. 检查 `next.config.js` 中 `i18n` 配置是否正确
2. 确认 `locales/` 目录下存在对应的语言文件
3. 清除 Next.js 缓存：
   ```bash
   rm -rf .next
   npm run build
   ```

### Q5: 速率限制不生效

**问题：** 用户可以无限次调用 API

**解决方案：**
1. 确认 Cloudflare KV 命名空间已创建并绑定到 Worker
2. 检查 Workers 环境变量 `RATE_LIMIT_HOURLY` 和 `RATE_LIMIT_DAILY`
3. 在 Cloudflare Dashboard 查看 KV 存储是否有记录

### Q6: 构建时 TypeScript 类型错误

**问题：** `npm run build` 失败，提示类型错误

**解决方案：**
```bash
# 运行类型检查查看详细错误
npm run type-check

# 如果是第三方库的类型问题，安装对应的 @types 包
npm install --save-dev @types/<package-name>
```

---

## 📊 性能优化建议

### 1. 图片优化
- 使用 Next.js Image 组件
- 国旗图标使用 SVG 格式
- 启用 Cloudflare Image Resizing（付费功能）

### 2. 代码分割
- 语言对页面使用动态导入
- 组件懒加载（React.lazy）

### 3. 缓存策略
- 静态资源启用 CDN 缓存
- API 响应添加合理的 Cache-Control 头

### 4. Bundle 大小
```bash
# 分析 bundle 大小
npm run build
npm run analyze  # 需要配置 @next/bundle-analyzer
```

---

## 🔐 安全检查清单

上线前必须完成：

- [ ] API 密钥存储在 Workers 环境变量（Secret 类型）
- [ ] `.env.local` 和 `.dev.vars` 已添加到 `.gitignore`
- [ ] 速率限制已配置并测试
- [ ] CORS 策略已正确设置（只允许自己的域名）
- [ ] 输入验证已实现（文件大小、格式检查）
- [ ] 错误信息不暴露敏感数据（如 API 密钥、内部路径）
- [ ] 依赖包已更新到最新版本（`npm audit fix`）
- [ ] CSP（内容安全策略）头已配置

---

## 📞 获取帮助

- **项目文档：** [PROJECT.md](PROJECT.md)
- **语言配置：** [LANGUAGES.md](LANGUAGES.md)
- **翻译工具：** [TRANSLATION_TOOL.md](TRANSLATION_TOOL.md)
- **Next.js 文档：** https://nextjs.org/docs
- **Cloudflare Workers 文档：** https://developers.cloudflare.com/workers/
- **OpenAI API 文档：** https://platform.openai.com/docs

---

**最后更新：** 2025-01-19
**文档版本：** 1.0.0
