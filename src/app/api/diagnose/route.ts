// 生产环境诊断API
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const results = {
    timestamp: new Date().toISOString(),
    environment: {
      runtime: "edge",
      region: request.headers.get('cf-ray') ? 'Cloudflare' : 'Unknown',
      cfRay: request.headers.get('cf-ray') || 'N/A',
      country: request.headers.get('cf-ipcountry') || 'Unknown',
    },
    apiKeys: {
      google: !!process.env.GOOGLE_TRANSLATE_API_KEY,
      openai: !!process.env.OPENAI_API_KEY,
      openaiBaseUrl: process.env.OPENAI_BASE_URL || 'default',
    },
    performance: {
      serverResponseTime: 0,
      googleApiLatency: 0,
      openaiApiLatency: 0,
    },
    errors: []
  };

  // 测试 Google API 延迟
  try {
    const googleStart = Date.now();
    const googleResponse = await fetch('https://translation.googleapis.com/language/translate/v2/languages?key=test', {
      signal: AbortSignal.timeout(5000)
    });
    results.performance.googleApiLatency = Date.now() - googleStart;
  } catch (error) {
    results.errors.push(`Google API test failed: ${error}`);
  }

  // 测试 OpenAI API 延迟
  try {
    const openaiStart = Date.now();
    const openaiUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com';
    const openaiResponse = await fetch(`${openaiUrl}/v1/models`, {
      signal: AbortSignal.timeout(5000)
    });
    results.performance.openaiApiLatency = Date.now() - openaiStart;
  } catch (error) {
    results.errors.push(`OpenAI API test failed: ${error}`);
  }

  results.performance.serverResponseTime = Date.now() - startTime;

  // 添加建议
  const recommendations = [];
  
  if (results.performance.googleApiLatency > 2000) {
    recommendations.push("Google API 延迟较高，考虑使用更近的服务器区域");
  }
  
  if (results.performance.openaiApiLatency > 3000) {
    recommendations.push("OpenAI API 延迟较高，建议配置 OPENAI_BASE_URL 使用代理服务");
  }
  
  if (results.environment.region === 'Cloudflare') {
    recommendations.push("运行在 Cloudflare Pages，注意 30 秒超时限制");
  }

  return NextResponse.json({
    ...results,
    recommendations
  });
}