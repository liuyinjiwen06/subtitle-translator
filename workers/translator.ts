/**
 * Cloudflare Workers - 翻译 API 中转
 * 功能：
 * 1. 接收翻译请求
 * 2. 速率限制检查
 * 3. 调用 OpenAI API
 * 4. 返回翻译结果
 */

interface Env {
  OPENAI_API_KEY: string;
  RATE_LIMIT_KV: KVNamespace;
  RATE_LIMIT_HOURLY?: string;
  RATE_LIMIT_DAILY?: string;
}

interface TranslationRequest {
  text: string;
  sourceLanguage: string; // ISO 639-1 code (e.g., 'en', 'zh')
  targetLanguage: string;
}

interface TranslationResponse {
  success: boolean;
  translatedText?: string;
  error?: string;
  rateLimitInfo?: {
    hourlyRemaining: number;
    dailyRemaining: number;
  };
}

// CORS 头
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // 生产环境应该限制为特定域名
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/**
 * 获取客户端 IP 地址
 */
function getClientIP(request: Request): string {
  return request.headers.get('CF-Connecting-IP') || 'unknown';
}

/**
 * 检查速率限制
 */
async function checkRateLimit(
  ip: string,
  kv: KVNamespace,
  hourlyLimit: number,
  dailyLimit: number
): Promise<{ allowed: boolean; hourlyRemaining: number; dailyRemaining: number }> {
  const now = new Date();
  const currentHour = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}-${String(now.getUTCHours()).padStart(2, '0')}`;
  const currentDay = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;

  const hourlyKey = `rate:hourly:${ip}:${currentHour}`;
  const dailyKey = `rate:daily:${ip}:${currentDay}`;

  // 获取当前计数
  const hourlyCount = parseInt((await kv.get(hourlyKey)) || '0');
  const dailyCount = parseInt((await kv.get(dailyKey)) || '0');

  // 检查是否超限
  if (hourlyCount >= hourlyLimit || dailyCount >= dailyLimit) {
    return {
      allowed: false,
      hourlyRemaining: Math.max(0, hourlyLimit - hourlyCount),
      dailyRemaining: Math.max(0, dailyLimit - dailyCount),
    };
  }

  // 增加计数
  await kv.put(hourlyKey, String(hourlyCount + 1), { expirationTtl: 3600 }); // 1小时
  await kv.put(dailyKey, String(dailyCount + 1), { expirationTtl: 86400 }); // 1天

  return {
    allowed: true,
    hourlyRemaining: hourlyLimit - hourlyCount - 1,
    dailyRemaining: dailyLimit - dailyCount - 1,
  };
}

/**
 * 调用 OpenAI API 翻译
 */
async function translateWithOpenAI(
  text: string,
  sourceLanguage: string,
  targetLanguage: string,
  apiKey: string
): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a professional subtitle translator. Translate the following subtitle text from ${sourceLanguage} to ${targetLanguage}. Keep the tone natural and preserve any formatting, line breaks, or special characters. Only return the translated text without any explanations.`,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

/**
 * 处理 OPTIONS 请求（CORS 预检）
 */
function handleOptions(): Response {
  return new Response(null, {
    headers: corsHeaders,
  });
}

/**
 * 处理翻译请求
 */
async function handleTranslation(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    // 解析请求体
    const body: TranslationRequest = await request.json();
    const { text, sourceLanguage, targetLanguage } = body;

    // 验证输入
    if (!text || !sourceLanguage || !targetLanguage) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing required fields: text, sourceLanguage, targetLanguage',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // 获取客户端 IP
    const clientIP = getClientIP(request);

    // 速率限制检查（生产环境）
    const hourlyLimit = parseInt(env.RATE_LIMIT_HOURLY || '10');
    const dailyLimit = parseInt(env.RATE_LIMIT_DAILY || '50');

    // 本地开发时跳过速率限制（当 KV 未配置或限制设置很高时）
    let rateLimitResult = {
      allowed: true,
      hourlyRemaining: hourlyLimit,
      dailyRemaining: dailyLimit,
    };

    // 只在生产环境（KV 已配置）且限制不是超高值时才启用速率限制
    if (env.RATE_LIMIT_KV && hourlyLimit < 999) {
      rateLimitResult = await checkRateLimit(
        clientIP,
        env.RATE_LIMIT_KV,
        hourlyLimit,
        dailyLimit
      );

      if (!rateLimitResult.allowed) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Rate limit exceeded',
            rateLimitInfo: {
              hourlyRemaining: rateLimitResult.hourlyRemaining,
              dailyRemaining: rateLimitResult.dailyRemaining,
            },
          }),
          {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // 调用 OpenAI 翻译
    const translatedText = await translateWithOpenAI(
      text,
      sourceLanguage,
      targetLanguage,
      env.OPENAI_API_KEY
    );

    // 返回成功响应
    const response: TranslationResponse = {
      success: true,
      translatedText,
      rateLimitInfo: {
        hourlyRemaining: rateLimitResult.hourlyRemaining,
        dailyRemaining: rateLimitResult.dailyRemaining,
      },
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Translation error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}

/**
 * Worker 入口
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // 处理 CORS 预检请求
    if (request.method === 'OPTIONS') {
      return handleOptions();
    }

    // 只允许 POST 请求
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', {
        status: 405,
        headers: corsHeaders,
      });
    }

    // 处理翻译请求
    return handleTranslation(request, env);
  },
};
