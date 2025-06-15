import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

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

// 简单的语言检测函数  
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function detectLanguage(text: string): string {
  // 检测中文字符
  if (/[\u4e00-\u9fff]/.test(text)) return 'zh';
  // 检测日文字符
  if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) return 'ja';
  // 检测俄文字符
  if (/[\u0400-\u04ff]/.test(text)) return 'ru';
  // 检测常见法语词汇
  if (/\b(le|la|les|de|du|des|et|est|une?|dans|pour|avec|sur)\b/i.test(text)) return 'fr';
  // 检测常见德语词汇
  if (/\b(der|die|das|und|ist|ein|eine|mit|von|zu|auf|für)\b/i.test(text)) return 'de';
  // 检测常见西班牙语词汇
  if (/\b(el|la|los|las|de|del|y|es|una?|en|con|por|para)\b/i.test(text)) return 'es';
  // 检测常见意大利语词汇
  if (/\b(il|la|lo|gli|le|di|del|e|è|una?|in|con|per|da)\b/i.test(text)) return 'it';
  // 默认英语
  return 'en';
}



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
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const targetLang = formData.get("targetLang") as string;
    const translationService = formData.get("translationService") as string || 'google';
    
    if (!file || !targetLang) {
      return NextResponse.json({ error: "参数缺失" }, { status: 400 });
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

    console.log(`开始翻译，目标语言: ${targetLang}，翻译服务: ${translationService}，共${textLines.length}行需要翻译`);

    let translatedCount = 0;

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
        console.log(`翻译进度: ${progress}% (${translatedCount}/${textLines.length}) - ${line.substring(0, 50)}...`);
        
        const translatedLine = await translateText(line, targetLang, translationService);
        translatedLines.push(translatedLine);
        
        // 添加延迟避免API限制
        const delay = translationService === 'openai' ? 200 : 100;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    const result = translatedLines.join("\n");
    console.log('翻译完成');

    // 生成新的文件名：原文件名_translated.srt
    const originalName = file.name.replace(/\.srt$/i, '');
    const newFileName = `${originalName}_translated.srt`;

    return new NextResponse(result, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(newFileName)}"`
      }
    });
  } catch (error) {
    console.error('API处理错误:', error);
    return NextResponse.json({ error: "翻译处理失败" }, { status: 500 });
  }
} 