import { NextRequest } from "next/server";

export const runtime = "edge";

// 语言代码映射
const languageMap: { [key: string]: string } = {
  'zh': 'zh-cn',
  'en': 'en',
  'ja': 'ja',
  'fr': 'fr',
  'de': 'de',
  'es': 'es',
  'ru': 'ru',
  'it': 'it'
};

// 语言名称映射（用于OpenAI）
const languageNames: { [key: string]: string } = {
  'zh': 'Chinese',
  'en': 'English',
  'ja': 'Japanese',
  'fr': 'French',
  'de': 'German',
  'es': 'Spanish',
  'ru': 'Russian',
  'it': 'Italian'
};



// Google Cloud Translation API (官方付费服务)
async function translateWithGoogle(text: string, targetLang: string): Promise<string> {
  try {
    if (!text.trim()) return text;

    // 检查是否配置了Google Cloud API密钥
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    if (!apiKey) {
      throw new Error('Google Cloud Translation API key not configured');
    }

    const targetLangCode = languageMap[targetLang] || targetLang;
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        target: targetLangCode,
        format: 'text'
      }),
    });

    if (!response.ok) {
      throw new Error(`Google Cloud Translation API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.data && data.data.translations && data.data.translations[0]) {
      return data.data.translations[0].translatedText;
    } else {
      throw new Error('Google Cloud Translation API returned invalid response');
    }
  } catch (error) {
    console.error('Google翻译错误:', error);
    // 返回原文而不是抛出错误，确保翻译流程继续
    return text;
  }
}

// OpenAI翻译
async function translateWithOpenAI(text: string, targetLang: string): Promise<string> {
  try {
    if (!text.trim()) return text;

    const targetLanguage = languageNames[targetLang] || targetLang;
    
    // 注意：这里需要用户提供OpenAI API密钥
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a professional subtitle translator. Translate the given subtitle text to ${targetLanguage}. 
            Rules:
            - Only return the translated text, no explanations
            - Preserve the tone and style appropriate for subtitles
            - Keep the translation concise and natural
            - Maintain any formatting or special characters`
          },
          {
            role: 'user',
            content: text
          }
        ],
        max_tokens: 1000,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content.trim();
    } else {
      throw new Error('OpenAI API returned invalid response');
    }
  } catch (error) {
    console.error('OpenAI翻译错误:', error);
    // 返回原文而不是抛出错误，确保翻译流程继续
    return text;
  }
}

// 统一翻译函数
async function translateText(text: string, targetLang: string, service: string): Promise<string> {
  switch (service) {
    case 'google':
      return await translateWithGoogle(text, targetLang);
    case 'openai':
      return await translateWithOpenAI(text, targetLang);
    default:
      console.error(`不支持的翻译服务: ${service}`);
      return text; // 不支持的服务返回原文
  }
}

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const targetLang = formData.get("targetLang") as string;
        const translationService = formData.get("translationService") as string || 'google';
        
        if (!file || !targetLang) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: "参数缺失" })}\n\n`));
          controller.close();
          return;
        }

        const text = await file.text();
        const lines = text.split("\n");
        const translatedLines: string[] = [];

        // 计算需要翻译的行数（用于进度计算）
        const textLines = lines.filter(line => {
          const trimmed = line.trim();
          return trimmed !== "" && 
                 !/^\d+$/.test(trimmed) && 
                 !/^\d{2}:\d{2}:\d{2}/.test(trimmed);
        });

        let translatedCount = 0;

        // 发送开始信号
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          type: 'start', 
          total: textLines.length,
          service: translationService 
        })}\n\n`));

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          
          // 跳过序号行、时间戳行和空行
          if (/^\d+$/.test(line.trim()) || 
              /^\d{2}:\d{2}:\d{2}/.test(line) || 
              line.trim() === "") {
            translatedLines.push(line);
          } else {
            // 翻译字幕文本
            translatedCount++;
            const progress = Math.round((translatedCount / textLines.length) * 100);
            
            // 发送进度更新
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
              type: 'progress', 
              progress: progress,
              current: translatedCount,
              total: textLines.length,
              text: line.substring(0, 50) + (line.length > 50 ? '...' : '')
            })}\n\n`));
            
            const translatedLine = await translateText(line, targetLang, translationService);
            translatedLines.push(translatedLine);
            
            // 添加延迟避免API限制
            const delay = translationService === 'openai' ? 200 : 100;
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }

        const result = translatedLines.join("\n");
        
        // 生成新的文件名：原文件名_translated.srt
        const originalName = file.name.replace(/\.srt$/i, '');
        const newFileName = `${originalName}_translated.srt`;

        // 发送完成信号
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          type: 'complete', 
          result: result,
          filename: newFileName
        })}\n\n`));

        controller.close();
      } catch (error) {
        console.error('流式翻译错误:', error);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          type: 'error', 
          error: "翻译处理失败" 
        })}\n\n`));
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
} 