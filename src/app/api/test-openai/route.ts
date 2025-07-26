import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    return new Response(JSON.stringify({
      error: "OpenAI API key not configured"
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // 测试 API 密钥是否有效
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      }
    });

    const responseText = await response.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }

    return new Response(JSON.stringify({
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      data: responseData,
      apiKeyInfo: {
        length: apiKey.length,
        prefix: apiKey.substring(0, 10) + '...',
        format: apiKey.startsWith('sk-') ? 'Valid format' : 'Invalid format'
      }
    }, null, 2), {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : String(error),
      apiKeyInfo: {
        length: apiKey.length,
        prefix: apiKey.substring(0, 10) + '...',
        format: apiKey.startsWith('sk-') ? 'Valid format' : 'Invalid format'
      }
    }, null, 2), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}