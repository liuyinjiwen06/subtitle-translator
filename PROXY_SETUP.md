# OpenAI 代理配置指南

## 问题说明
由于 Cloudflare 会根据用户位置自动选择最近的数据中心，如果选择了不被 OpenAI 支持的地区（如香港），会导致 API 调用失败。

## 解决方案

### 方案 1：使用第三方 OpenAI 代理（推荐）

在 Cloudflare Pages 环境变量中添加：

```
OPENAI_BASE_URL = https://api.openai-proxy.com
```

常用的代理服务：

1. **OpenAI-SB**（免费）
   ```
   OPENAI_BASE_URL = https://api.openai-sb.com
   ```

2. **AI Proxy**（付费，更稳定）
   ```
   OPENAI_BASE_URL = https://api.aiproxy.io
   ```

3. **OpenAI API2D**（国内可用）
   ```
   OPENAI_BASE_URL = https://openai.api2d.net
   ```

### 方案 2：使用 Cloudflare Workers 代理

创建一个 Worker 来代理 OpenAI 请求：

```javascript
// worker.js
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // 替换为 OpenAI 的实际 URL
    url.host = 'api.openai.com';
    
    // 转发请求
    return fetch(url, {
      method: request.method,
      headers: request.headers,
      body: request.body
    });
  }
};
```

然后在环境变量中配置：
```
OPENAI_BASE_URL = https://your-worker.workers.dev
```

### 方案 3：使用其他翻译服务

如果 OpenAI 持续有地区限制问题，建议使用：
- Google Translate（已集成，全球可用）
- DeepL API（欧洲服务，质量高）
- 百度翻译（亚太地区稳定）

## 测试步骤

1. 配置环境变量后，访问诊断端点：
   ```
   https://你的域名/api/test-openai
   ```

2. 查看日志中的 API URL：
   ```
   [OPENAI] 使用 API URL: https://你配置的代理地址/v1/chat/completions
   ```

3. 确认没有地区限制错误：
   - ✅ 正常：返回 200 状态码
   - ❌ 异常：`unsupported_country_region_territory`

## 注意事项

1. **API 密钥安全**：确保代理服务可信，不会泄露你的 API 密钥
2. **性能考虑**：代理可能会增加延迟
3. **成本控制**：某些代理服务可能收费
4. **合规性**：确保使用代理符合 OpenAI 的服务条款