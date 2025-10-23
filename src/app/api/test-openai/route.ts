import { NextRequest } from "next/server";


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

  const results: any = {
    timestamp: new Date().toISOString(),
    runtime: 'nodejs',
    apiKeyInfo: {
      length: apiKey.length,
      prefix: apiKey.substring(0, 10) + '...',
      format: apiKey.startsWith('sk-') ? 'Valid format' : 'Invalid format'
    },
    tests: {} as any
  };

  // 测试1：获取模型列表
  try {
    const modelsResponse = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      }
    });

    const modelsData = await modelsResponse.json();
    results.tests.modelsList = {
      status: modelsResponse.status,
      statusText: modelsResponse.statusText,
      availableModels: modelsData.data ? modelsData.data.map((m: any) => m.id).filter((id: string) => 
        id.includes('gpt') || id.includes('turbo')
      ) : [],
      hasGpt4oMini: modelsData.data ? modelsData.data.some((m: any) => m.id === 'gpt-4o-mini') : false,
      hasGpt35Turbo: modelsData.data ? modelsData.data.some((m: any) => m.id === 'gpt-3.5-turbo') : false
    };
  } catch (error) {
    results.tests.modelsList = {
      error: error instanceof Error ? error.message : String(error)
    };
  }

  // 测试2：测试 gpt-3.5-turbo
  try {
    const gpt35Response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Say "test ok"' }],
        max_tokens: 10
      })
    });

    const gpt35Data = await gpt35Response.json();
    results.tests.gpt35Turbo = {
      status: gpt35Response.status,
      statusText: gpt35Response.statusText,
      success: gpt35Response.ok,
      response: gpt35Data.choices?.[0]?.message?.content || gpt35Data.error || gpt35Data
    };
  } catch (error) {
    results.tests.gpt35Turbo = {
      error: error instanceof Error ? error.message : String(error)
    };
  }

  // 测试3：测试 gpt-4o-mini
  try {
    const gpt4oMiniResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Say "test ok"' }],
        max_tokens: 10
      })
    });

    const gpt4oMiniData = await gpt4oMiniResponse.json();
    results.tests.gpt4oMini = {
      status: gpt4oMiniResponse.status,
      statusText: gpt4oMiniResponse.statusText,
      success: gpt4oMiniResponse.ok,
      response: gpt4oMiniData.choices?.[0]?.message?.content || gpt4oMiniData.error || gpt4oMiniData,
      headers: {
        'cf-ray': gpt4oMiniResponse.headers.get('cf-ray'),
        'x-request-id': gpt4oMiniResponse.headers.get('x-request-id')
      }
    };
  } catch (error) {
    results.tests.gpt4oMini = {
      error: error instanceof Error ? error.message : String(error)
    };
  }

  // 获取请求源信息
  results.requestInfo = {
    'cf-connecting-ip': req.headers.get('cf-connecting-ip'),
    'cf-ipcountry': req.headers.get('cf-ipcountry'),
    'cf-ray': req.headers.get('cf-ray'),
    'x-forwarded-for': req.headers.get('x-forwarded-for'),
    'user-agent': req.headers.get('user-agent')
  };

  return new Response(JSON.stringify(results, null, 2), {
    headers: { 
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });
}