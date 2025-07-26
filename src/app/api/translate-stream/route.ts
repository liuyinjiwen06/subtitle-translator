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
  const startTime = Date.now();
  try {
    if (!text.trim()) return text;

    // 检查是否配置了Google Cloud API密钥
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    if (!apiKey) {
      console.error('[GOOGLE_TRANSLATE] API key not configured in environment');
      throw new Error('翻译服务暂时不可用，请稍后再试');
    }

    const targetLangCode = languageMap[targetLang] || targetLang;
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    
    console.log(`[GOOGLE_TRANSLATE] 开始翻译 - 目标语言: ${targetLangCode}, 文本长度: ${text.length}, 文本预览: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
    
    // 添加超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 30000); // 30秒超时

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
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const elapsedTime = Date.now() - startTime;
    console.log(`[GOOGLE_TRANSLATE] API响应时间: ${elapsedTime}ms, 状态码: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`[GOOGLE_TRANSLATE] API错误详情:`, {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorData,
        requestText: text.substring(0, 100),
        targetLang: targetLangCode,
        elapsedTime
      });
      
      if (response.status === 403) {
        throw new Error('Google翻译服务访问被拒绝，请检查API配额或密钥权限');
      } else if (response.status === 400) {
        throw new Error('请求格式错误，请检查文本内容后重试');
      } else if (response.status === 429) {
        throw new Error('API请求频率过高，请稍后再试');
      } else if (response.status >= 500) {
        throw new Error('Google翻译服务器错误，请稍后再试');
      } else {
        throw new Error(`Google翻译服务暂时不可用 (错误码: ${response.status})`);
      }
    }

    const data = await response.json();
    console.log(`[GOOGLE_TRANSLATE] 翻译成功 - 耗时: ${elapsedTime}ms, 原文: "${text.substring(0, 30)}...", 译文: "${data.data?.translations?.[0]?.translatedText?.substring(0, 30) || 'N/A'}..."`);
    
    if (data.data && data.data.translations && data.data.translations[0]) {
      return data.data.translations[0].translatedText;
    } else {
      console.error('[GOOGLE_TRANSLATE] API响应结构异常:', {
        responseData: data,
        hasData: !!data.data,
        hasTranslations: !!data.data?.translations,
        translationsLength: data.data?.translations?.length || 0
      });
      throw new Error('翻译服务返回异常，请稍后再试');
    }
  } catch (error) {
    const elapsedTime = Date.now() - startTime;
    console.error(`[GOOGLE_TRANSLATE] 翻译失败详情:`, {
      error: error instanceof Error ? error.message : String(error),
      errorName: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined,
      textPreview: text.substring(0, 100),
      targetLang,
      elapsedTime,
      isAbortError: error instanceof Error && error.name === 'AbortError',
      isNetworkError: error instanceof TypeError && error.message.includes('fetch')
    });
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('翻译请求超时，请检查网络连接后重试');
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('网络连接失败，请检查网络后重试');
    }
    
    if (error instanceof Error && error.message.includes('翻译服务')) {
      throw error;
    }
    
    throw new Error('翻译服务出现问题，请稍后再试');
  }
}

// OpenAI翻译
async function translateWithOpenAI(text: string, targetLang: string): Promise<string> {
  const startTime = Date.now();
  try {
    if (!text.trim()) return text;

    const targetLanguage = languageNames[targetLang] || targetLang;
    
    // 注意：这里需要用户提供OpenAI API密钥
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('[OPENAI] API key not configured in environment');
      throw new Error('翻译服务暂时不可用，请稍后再试');
    }

    console.log(`[OPENAI] 开始翻译 - 目标语言: ${targetLanguage}, 文本长度: ${text.length}, 文本预览: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);

    // 添加超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 45000); // 45秒超时（OpenAI通常需要更长时间）

    // 检查是否配置了代理 URL
    const openaiBaseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com';
    const apiUrl = `${openaiBaseUrl}/v1/chat/completions`;
    
    console.log(`[OPENAI] 使用 API URL: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo', // 可通过环境变量配置，默认使用 gpt-3.5-turbo
        messages: [
          {
            role: 'system',
            content: `Translate this subtitle to ${targetLanguage}. Return only the translation, no explanations:`
          },
          {
            role: 'user',
            content: text
          }
        ],
        max_tokens: Math.min(text.length * 2, 200), // 动态计算token数，最大200
        temperature: 0.1, // 降低创造性，提高速度
        top_p: 0.9, // 限制采样范围，提高速度
        frequency_penalty: 0,
        presence_penalty: 0
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const elapsedTime = Date.now() - startTime;
    console.log(`[OPENAI] API响应时间: ${elapsedTime}ms, 状态码: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`[OPENAI] API错误详情:`, {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorData,
        requestText: text.substring(0, 100),
        targetLang: targetLanguage,
        elapsedTime
      });
      
      if (response.status === 401) {
        throw new Error('OpenAI服务认证失败，请检查API密钥');
      } else if (response.status === 429) {
        throw new Error('OpenAI服务请求过多，请稍后再试');
      } else if (response.status === 500) {
        throw new Error('OpenAI服务暂时不可用，请稍后再试');
      } else if (response.status === 503) {
        throw new Error('OpenAI服务器过载，请稍后再试');
      } else {
        throw new Error(`OpenAI翻译服务暂时不可用 (错误码: ${response.status})`);
      }
    }

    const data = await response.json();
    console.log(`[OPENAI] 翻译成功 - 耗时: ${elapsedTime}ms, 原文: "${text.substring(0, 30)}...", 译文: "${data.choices?.[0]?.message?.content?.substring(0, 30) || 'N/A'}..."`);
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content.trim();
    } else {
      console.error('[OPENAI] API响应结构异常:', {
        responseData: data,
        hasChoices: !!data.choices,
        choicesLength: data.choices?.length || 0,
        hasMessage: !!data.choices?.[0]?.message
      });
      throw new Error('翻译服务返回异常，请稍后再试');
    }
  } catch (error) {
    const elapsedTime = Date.now() - startTime;
    console.error(`[OPENAI] 翻译失败详情:`, {
      error: error instanceof Error ? error.message : String(error),
      errorName: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined,
      textPreview: text.substring(0, 100),
      targetLang,
      elapsedTime,
      isAbortError: error instanceof Error && error.name === 'AbortError',
      isNetworkError: error instanceof TypeError && error.message.includes('fetch')
    });
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('翻译请求超时，请检查网络连接后重试');
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('网络连接失败，请检查网络后重试');
    }
    
    if (error instanceof Error && error.message.includes('翻译服务')) {
      throw error;
    }
    
    throw new Error('翻译服务出现问题，请稍后再试');
  }
}

// 统一翻译函数（带重试机制）
async function translateText(text: string, targetLang: string, service: string, maxRetries: number = 3): Promise<string> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[翻译尝试] 第 ${attempt} 次尝试 - 服务: ${service}, 文本: "${text.substring(0, 30)}..."`);
      
      switch (service) {
        case 'google':
          return await translateWithGoogle(text, targetLang);
        case 'openai':
          return await translateWithOpenAI(text, targetLang);
        default:
          console.error(`不支持的翻译服务: ${service}`);
          return text; // 不支持的服务返回原文
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`[翻译重试] 第 ${attempt} 次尝试失败:`, lastError.message);
      
      // 如果是认证错误或配置错误，不需要重试
      if (lastError.message.includes('认证失败') || 
          lastError.message.includes('API密钥') || 
          lastError.message.includes('访问被拒绝') ||
          lastError.message.includes('不可用')) {
        console.log(`[翻译重试] 检测到配置错误，停止重试: ${lastError.message}`);
        break;
      }
      
      // 最后一次尝试失败，不再等待
      if (attempt < maxRetries) {
        const backoffDelay = Math.min(1000 * Math.pow(2, attempt - 1), 5000); // 指数退避，最大5秒
        console.log(`[翻译重试] 等待 ${backoffDelay}ms 后重试...`);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
    }
  }
  
  console.error(`[翻译失败] 所有重试均失败，最后错误:`, lastError?.message);
  throw lastError || new Error('翻译失败，已达到最大重试次数');
}

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // 详细的环境检测和日志记录
        console.log('[环境检测] 开始检查环境配置...');
        console.log('[环境检测] 运行时:', runtime);
        console.log('[环境检测] Node版本:', process.version || 'unknown');
        console.log('[环境检测] 环境变量状态:', {
          GOOGLE_TRANSLATE_API_KEY: {
            exists: !!process.env.GOOGLE_TRANSLATE_API_KEY,
            length: process.env.GOOGLE_TRANSLATE_API_KEY?.length || 0,
            prefix: process.env.GOOGLE_TRANSLATE_API_KEY?.substring(0, 10) + '...' || 'not configured'
          },
          OPENAI_API_KEY: {
            exists: !!process.env.OPENAI_API_KEY,
            length: process.env.OPENAI_API_KEY?.length || 0,
            prefix: process.env.OPENAI_API_KEY?.substring(0, 10) + '...' || 'not configured'
          }
        });

        // 立即发送环境状态信息
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          type: 'env_status',
          googleConfigured: !!process.env.GOOGLE_TRANSLATE_API_KEY,
          openaiConfigured: !!process.env.OPENAI_API_KEY,
          runtime: runtime,
          timestamp: new Date().toISOString()
        })}\n\n`));

        const formData = await req.formData();
        const file = formData.get("file") as File;
        const targetLang = formData.get("targetLang") as string;
        const translationService = formData.get("translationService") as string || 'google';
        
        console.log(`[请求参数] 目标语言: ${targetLang}, 翻译服务: ${translationService}, 文件名: ${file?.name}`);

        if (!file || !targetLang) {
          const errorMsg = "参数缺失: " + (!file ? "文件未上传" : "") + (!targetLang ? "目标语言未指定" : "");
          console.error('[参数错误]', errorMsg);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: errorMsg })}\n\n`));
          controller.close();
          return;
        }

        // 检查选择的翻译服务是否可用
        if (translationService === 'openai' && !process.env.OPENAI_API_KEY) {
          console.warn('[服务切换] OpenAI API密钥未配置，强制切换到Google翻译');
          const switchMsg = "OpenAI API密钥未配置，已自动切换到Google翻译";
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'service_switch', 
            message: switchMsg,
            from: 'openai',
            to: 'google'
          })}\n\n`));
        }

        if (translationService === 'google' && !process.env.GOOGLE_TRANSLATE_API_KEY) {
          console.error('[配置错误] Google翻译API密钥未配置');
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'error', 
            error: "Google翻译API密钥未配置，请检查环境变量GOOGLE_TRANSLATE_API_KEY" 
          })}\n\n`));
          controller.close();
          return;
        }

        // 如果两个API都没配置
        if (!process.env.GOOGLE_TRANSLATE_API_KEY && !process.env.OPENAI_API_KEY) {
          console.error('[配置错误] 没有配置任何翻译API密钥');
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'error', 
            error: "翻译服务未配置：缺少GOOGLE_TRANSLATE_API_KEY和OPENAI_API_KEY环境变量" 
          })}\n\n`));
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
            
            console.log(`[翻译进度] ${progress}% (${translatedCount}/${textLines.length}) - 正在翻译: "${line.substring(0, 50)}${line.length > 50 ? '...' : ''}"`);
            
            // 发送进度更新，包含当前翻译的句子
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
              type: 'progress', 
              progress: progress,
              current: translatedCount,
              total: textLines.length,
              currentText: line.trim(),
              currentTextPreview: line.substring(0, 50) + (line.length > 50 ? '...' : ''),
              service: translationService
            })}\n\n`));
            
            try {
              const translationStartTime = Date.now();
              const translatedLine = await translateText(line, targetLang, translationService);
              const translationTime = Date.now() - translationStartTime;
              
              console.log(`[翻译完成] 耗时: ${translationTime}ms, 原文: "${line.substring(0, 30)}...", 译文: "${translatedLine.substring(0, 30)}..."`);
              
              translatedLines.push(translatedLine);
              
              // 发送翻译完成的单条结果
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                type: 'translated', 
                original: line.trim(),
                translated: translatedLine.trim(),
                index: translatedCount,
                time: translationTime
              })}\n\n`));
              
            } catch (translateError) {
              console.error(`[翻译失败] 行 ${translatedCount}: "${line.substring(0, 50)}..." - 错误:`, translateError);
              const errorMessage = translateError instanceof Error ? translateError.message : '翻译失败';
              
              // 发送错误信息但不立即关闭连接，允许用户选择继续或停止
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                type: 'translation_error', 
                error: errorMessage,
                failedText: line.trim(),
                currentIndex: translatedCount,
                progress: progress,
                canContinue: true
              })}\n\n`));
              
              // 添加原文作为翻译失败的占位符
              translatedLines.push(`[翻译失败] ${line}`);
              
              // 检查是否是致命错误（如API密钥问题）
              if (errorMessage.includes('认证失败') || 
                  errorMessage.includes('API密钥') || 
                  errorMessage.includes('访问被拒绝')) {
                console.log(`[致命错误] 检测到配置问题，停止翻译: ${errorMessage}`);
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                  type: 'fatal_error', 
                  error: errorMessage,
                  partialResult: translatedLines.join('\n')
                })}\n\n`));
                controller.close();
                return;
              }
              
              // 非致命错误继续翻译下一行
              console.log(`[继续翻译] 跳过失败的行，继续处理下一行`);
            }
            
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
        console.error('[流式翻译错误] 详细信息:', {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          timestamp: new Date().toISOString(),
          environment: {
            googleApiKey: !!process.env.GOOGLE_TRANSLATE_API_KEY,
            openaiApiKey: !!process.env.OPENAI_API_KEY
          }
        });
        
        let userFriendlyError = "翻译处理失败";
        if (error instanceof Error) {
          if (error.message.includes('API密钥') || error.message.includes('not configured')) {
            userFriendlyError = "翻译服务配置错误：请检查API密钥设置";
          } else if (error.message.includes('网络') || error.message.includes('fetch')) {
            userFriendlyError = "网络连接失败：请检查网络连接或稍后重试";
          } else if (error.message.includes('参数')) {
            userFriendlyError = "请求参数错误：" + error.message;
          } else {
            userFriendlyError = "翻译服务暂时不可用：" + error.message;
          }
        }
        
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          type: 'error', 
          error: userFriendlyError,
          technical_details: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString()
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