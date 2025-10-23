// 这是一个通过 Cloudflare Workers 强制使用美国节点的方案
// 仅作为临时解决方案，需要配合 Workers 路由使用

export async function POST(request: Request) {
  // 将请求转发到美国的代理端点
  const proxyUrl = 'https://us-proxy.example.com/api/translate-stream';
  
  return fetch(proxyUrl, {
    method: 'POST',
    headers: request.headers,
    body: request.body
  });
}

// 注意：这个文件仅作为示例，实际使用需要：
// 1. 设置一个美国的代理服务器
// 2. 或使用 Cloudflare Workers 的地理路由功能
// 3. 或使用支持的 OpenAI 代理服务