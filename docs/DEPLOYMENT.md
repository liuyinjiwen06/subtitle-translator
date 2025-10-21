# Cloudflare 部署指南

本文档详细说明如何将项目部署到 Cloudflare Pages 和 Workers。

## 常见部署问题及预防措施

### 1. 环境变量问题 ⚠️ **最常见**

**问题**：本地开发使用 `.env.local` 和 `.dev.vars`，但这些文件不会上传到 Git（被 `.gitignore` 忽略），部署后找不到环境变量。

**解决方案**：
- Cloudflare Pages：在 Cloudflare Dashboard 中手动配置环境变量
- Cloudflare Workers：使用 `wrangler secret put` 命令配置敏感信息

### 2. Workers KV 未配置

**问题**：`wrangler.toml` 中的 KV namespace ID 是占位符 `YOUR_KV_NAMESPACE_ID`，导致速率限制功能失败。

**解决方案**：
1. 创建 KV namespace
2. 更新 `wrangler.toml` 中的 ID

### 3. Workers URL 不匹配

**问题**：前端代码调用的 Workers URL 是本地地址 `http://localhost:8787`，部署后无法访问。

**解决方案**：
- 在 Cloudflare Pages 环境变量中设置正确的 `NEXT_PUBLIC_WORKERS_URL`

### 4. Node.js 版本不兼容

**问题**：Cloudflare Pages 默认使用较老的 Node.js 版本，可能不支持项目代码。

**解决方案**：
- 在环境变量中设置 `NODE_VERSION=18.17.0` 或更高

### 5. 构建命令错误

**问题**：Cloudflare Pages 使用错误的构建命令或输出目录。

**解决方案**：
- 构建命令：`npm run pages:build` (会自动删除缓存文件)
- 输出目录：`.next`
- 框架预设：Next.js

### 6. 文件大小超限 (25 MiB)  ⚠️ **重要**

**问题**：Next.js 构建时会生成 webpack 缓存文件 `.next/cache/webpack/server-production/0.pack`，可能超过 46 MiB，而 Cloudflare Pages 单文件限制为 25 MiB。

**错误信息**：
```
✘ Error: Pages only supports files up to 25 MiB in size
cache/webpack/server-production/0.pack is 46.1 MiB
```

**解决方案**：
项目已配置自动删除缓存：
- `package.json` 中的 `pages:build` 脚本会自动执行 `rm -rf .next/cache`
- `next.config.ts` 已禁用 webpack 缓存 (`config.cache = false`)
- 使用构建命令：`npm run pages:build` (不要使用 `npm run build`)

---

## 部署步骤

### Phase 1: 准备工作（本地）

#### 1.1 创建 Cloudflare KV Namespace

```bash
# 创建生产环境 KV
wrangler kv:namespace create "RATE_LIMIT_KV"

# 输出示例：
# ⛅️ wrangler 3.28.0
# 🌀 Creating namespace with title "subtitle-translator-RATE_LIMIT_KV"
# ✨ Success!
# Add the following to your wrangler.toml:
# [[kv_namespaces]]
# binding = "RATE_LIMIT_KV"
# id = "abc123def456"  <-- 复制这个 ID
```

#### 1.2 更新 wrangler.toml

将上一步获得的 KV namespace ID 填入 `wrangler.toml`：

```toml
[[kv_namespaces]]
binding = "RATE_LIMIT_KV"
id = "abc123def456"  # 替换为实际的 ID
```

#### 1.3 配置 Workers 密钥

```bash
# 配置 OpenAI API 密钥（不会上传到 Git）
wrangler secret put OPENAI_API_KEY
# 提示输入时，粘贴你的 OpenAI API key

# 配置速率限制（生产环境建议保持较低值）
wrangler secret put RATE_LIMIT_HOURLY
# 输入: 10

wrangler secret put RATE_LIMIT_DAILY
# 输入: 50
```

#### 1.4 测试 Workers 部署

```bash
# 部署 Workers（会部署到 Cloudflare）
npm run build:workers

# 部署后会显示 Workers URL，例如：
# https://subtitle-translator.your-subdomain.workers.dev
#
# 复制这个 URL，后面需要用到
```

### Phase 2: 部署 Next.js 到 Cloudflare Pages

#### 2.1 推送代码到 GitHub

```bash
git add .
git commit -m "准备部署到 Cloudflare"
git push origin main
```

#### 2.2 在 Cloudflare Dashboard 创建 Pages 项目

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
3. 选择你的 GitHub 仓库
4. 配置构建设置：
   - **框架预设**：Next.js
   - **构建命令**：`npm run pages:build` ⚠️ (必须使用此命令，不要使用 `npm run build`)
   - **构建输出目录**：`.next`
   - **Root directory**：`/`（保持默认）

#### 2.3 配置环境变量

在 Cloudflare Pages 项目设置中，添加以下环境变量：

**生产环境（Production）**：

| 变量名 | 值 | 说明 |
|-------|-----|------|
| `NODE_VERSION` | `18.17.0` | Node.js 版本 |
| `NEXT_PUBLIC_WORKERS_URL` | `https://subtitle-translator.your-subdomain.workers.dev` | Workers URL（替换为实际 URL） |
| `NEXT_PUBLIC_SITE_URL` | `https://your-site.pages.dev` | 网站 URL（部署后会获得） |

**注意**：
- 不要添加 `OPENAI_API_KEY`（这是 Workers 的密钥，不是 Pages 的）
- 确保 `NEXT_PUBLIC_WORKERS_URL` 使用 HTTPS，不是 HTTP

#### 2.4 触发部署

点击 **Save and Deploy**，Cloudflare 会自动构建和部署。

### Phase 3: 验证部署

#### 3.1 检查 Pages 部署状态

在 Cloudflare Dashboard 中查看部署日志，确保构建成功。

#### 3.2 检查 Workers 是否正常

访问 Workers URL 应该返回 405 错误（因为只接受 POST 请求）：

```bash
curl https://subtitle-translator.your-subdomain.workers.dev
# 预期输出：Method Not Allowed
```

#### 3.3 测试完整流程

1. 访问你的 Pages 网站
2. 上传一个 SRT 文件
3. 选择源语言和目标语言
4. 点击翻译
5. 下载翻译结果

---

## 常见部署后问题排查

### 问题 1：翻译时显示 "Network Error"

**可能原因**：
- `NEXT_PUBLIC_WORKERS_URL` 配置错误
- Workers 未正确部署
- CORS 问题

**排查步骤**：
```bash
# 1. 检查前端是否在调用正确的 URL
# 在浏览器控制台查看网络请求

# 2. 测试 Workers 是否可访问
curl -X POST https://subtitle-translator.your-subdomain.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"text":"test","sourceLanguage":"en","targetLanguage":"zh"}'

# 3. 检查 CORS 头是否正确
curl -I -X OPTIONS https://subtitle-translator.your-subdomain.workers.dev
```

**解决方案**：
- 确认 `NEXT_PUBLIC_WORKERS_URL` 环境变量正确
- 重新部署 Workers：`wrangler deploy workers/translator.ts`
- 检查 `workers/translator.ts` 中的 CORS 配置

### 问题 2：速率限制不工作（429 错误频繁或从不出现）

**可能原因**：
- KV namespace 未正确配置
- 环境变量未设置

**排查步骤**：
```bash
# 查看 Workers 日志
wrangler tail

# 检查 KV namespace
wrangler kv:namespace list
```

**解决方案**：
- 确认 `wrangler.toml` 中的 KV ID 正确
- 使用 `wrangler secret list` 检查密钥是否已设置
- 重新部署 Workers

### 问题 3：OpenAI API 调用失败

**可能原因**：
- API 密钥未配置或错误
- OpenAI API 配额用尽
- 网络问题

**排查步骤**：
```bash
# 查看 Workers 日志（会显示 OpenAI 错误）
wrangler tail

# 检查密钥是否已设置
wrangler secret list
# 应该显示 OPENAI_API_KEY
```

**解决方案**：
```bash
# 重新设置 API 密钥
wrangler secret put OPENAI_API_KEY

# 检查 OpenAI 账户配额
# https://platform.openai.com/usage
```

### 问题 4：页面样式错误或白屏

**可能原因**：
- Next.js 构建失败
- 静态资源路径错误
- 环境变量缺失

**排查步骤**：
- 查看 Cloudflare Pages 构建日志
- 检查浏览器控制台错误
- 验证环境变量配置

**解决方案**：
```bash
# 本地测试生产构建
npm run build
npm run start

# 如果本地正常，检查 Cloudflare 环境变量
# 特别是 NODE_VERSION
```

### 问题 5：多语言路由不工作（404 错误）

**可能原因**：
- Cloudflare Pages 未正确处理 Next.js 动态路由
- 需要配置 `_routes.json`

**解决方案**：

创建 `public/_routes.json`：
```json
{
  "version": 1,
  "include": ["/*"],
  "exclude": []
}
```

然后重新部署。

---

## 环境变量完整清单

### Cloudflare Pages 环境变量

| 变量名 | 示例值 | 必需 | 说明 |
|-------|--------|------|------|
| `NODE_VERSION` | `18.17.0` | ✅ | Node.js 版本 |
| `NEXT_PUBLIC_WORKERS_URL` | `https://subtitle-translator.xxx.workers.dev` | ✅ | Workers API URL |
| `NEXT_PUBLIC_SITE_URL` | `https://your-site.pages.dev` | ✅ | 网站完整 URL |

### Cloudflare Workers 密钥（使用 wrangler secret）

| 密钥名 | 示例值 | 必需 | 说明 |
|-------|--------|------|------|
| `OPENAI_API_KEY` | `sk-proj-xxx` | ✅ | OpenAI API 密钥 |
| `RATE_LIMIT_HOURLY` | `10` | ❌ | 每小时请求限制（默认 10） |
| `RATE_LIMIT_DAILY` | `50` | ❌ | 每天请求限制（默认 50） |

---

## 性能优化建议

### 1. 启用 Cloudflare 缓存

在 `wrangler.toml` 中添加：
```toml
[env.production]
routes = [
  { pattern = "your-domain.com/*", zone_name = "your-domain.com" }
]
```

### 2. 配置 Cache Rules

在 Cloudflare Dashboard 中为静态资源配置缓存规则：
- JS/CSS 文件：缓存 1 年
- 图片：缓存 1 个月
- HTML：缓存 1 小时

### 3. 启用 Auto Minify

在 Cloudflare Dashboard → Speed → Optimization：
- ✅ JavaScript
- ✅ CSS
- ✅ HTML

### 4. 启用 Brotli 压缩

默认已启用，无需配置。

---

## 回滚策略

### 回滚 Workers

```bash
# 查看部署历史
wrangler deployments list

# 回滚到特定版本
wrangler rollback [DEPLOYMENT_ID]
```

### 回滚 Pages

在 Cloudflare Dashboard → Pages → 你的项目 → Deployments：
- 找到之前成功的部署
- 点击 "Rollback to this deployment"

---

## 监控和日志

### 实时日志

```bash
# Workers 日志
wrangler tail

# 过滤错误日志
wrangler tail --status error
```

### 性能监控

在 Cloudflare Dashboard 中查看：
- **Analytics**：请求量、带宽、错误率
- **Workers Analytics**：CPU 时间、请求数、错误数

---

## 成本估算

### Cloudflare Pages（免费计划）
- ✅ 无限请求
- ✅ 无限带宽
- ✅ 500 次构建/月

### Cloudflare Workers（免费计划）
- ✅ 100,000 请求/天
- ✅ 10ms CPU 时间/请求

### Cloudflare KV（免费计划）
- ✅ 100,000 读取/天
- ✅ 1,000 写入/天
- ✅ 1GB 存储

**结论**：对于小型项目，完全免费计划足够使用。

---

## 下一步

部署成功后，建议：

1. ✅ 配置自定义域名
2. ✅ 设置 SSL/TLS（自动）
3. ✅ 添加 Google Analytics（可选）
4. ✅ 提交到 Google Search Console
5. ✅ 创建 sitemap.xml
6. ✅ 配置社交媒体分享卡片

---

## 需要帮助？

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [项目 GitHub Issues](https://github.com/your-username/subtitle-translator/issues)
