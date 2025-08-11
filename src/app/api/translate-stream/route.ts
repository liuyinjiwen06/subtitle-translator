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
    console.log(`[DEBUG] Google翻译开始，文本: "${text}", 目标语言: ${targetLang}`);
    
    if (!text.trim()) {
      console.log(`[DEBUG] 文本为空，直接返回`);
      return text;
    }

    // 检查是否配置了Google Cloud API密钥
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    console.log(`[DEBUG] Google API密钥检查: ${apiKey ? '已配置' : '未配置'}`);
    
    if (!apiKey) {
      console.error('[GOOGLE_TRANSLATE] API key not configured in environment');
      throw new Error('翻译服务暂时不可用，请稍后再试');
    }

    const targetLangCode = languageMap[targetLang] || targetLang;
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    
    console.log(`[DEBUG] Google翻译API调用详情:`);
    console.log(`[DEBUG] - 目标语言代码: ${targetLangCode}`);
    console.log(`[DEBUG] - API URL: ${url}`);
    console.log(`[DEBUG] - 文本长度: ${text.length}`);
    console.log(`[DEBUG] - 文本预览: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
    
    console.log(`[GOOGLE_TRANSLATE] 开始翻译 - 目标语言: ${targetLangCode}, 文本长度: ${text.length}, 文本预览: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
    
    // 添加超时控制 - 适应Cloudflare Pages 30秒限制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 25000); // 25秒超时（为Cloudflare 30秒限制留出缓冲）

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

    // 添加超时控制 - 适应Cloudflare Pages 30秒限制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 25000); // 25秒超时（为Cloudflare 30秒限制留出缓冲）

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
  console.log('[DEBUG] ===== translate-stream API 开始执行 =====');
  console.log('[DEBUG] 请求方法: POST');
  console.log('[DEBUG] 请求时间:', new Date().toISOString());
  
  const encoder = new TextEncoder();
  
  // 检测是否在Cloudflare环境中运行
  const isCloudflare = typeof process === 'undefined' || 
    (process.env && (process.env.CF_PAGES || process.env.CF_WORKER || process.env.CF_RAY_ID));
  
  console.log('[DEBUG] Cloudflare环境检测结果:', isCloudflare);
  console.log('[DEBUG] process对象:', typeof process);
  console.log('[DEBUG] process.env:', process.env ? '存在' : '不存在');
  if (process.env) {
    console.log('[DEBUG] CF_PAGES:', process.env.CF_PAGES);
    console.log('[DEBUG] CF_WORKER:', process.env.CF_WORKER);
    console.log('[DEBUG] CF_RAY_ID:', process.env.CF_RAY_ID);
  }
  
  const stream = new ReadableStream({
    async start(controller) {
      console.log('[DEBUG] ===== ReadableStream start 开始执行 =====');
      try {
        // 详细的环境检测和日志记录
        console.log('[环境检测] 开始检查环境配置...');
        console.log('[环境检测] Cloudflare环境:', isCloudflare);
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

        console.log('[DEBUG] ===== 开始解析请求参数 =====');
        const formData = await req.formData();
        console.log('[DEBUG] FormData解析完成');
        
        const file = formData.get("file") as File;
        const targetLang = formData.get("targetLang") as string;
        const translationService = formData.get("translationService") as string || 'google';
        
        console.log('[DEBUG] 请求参数解析结果:');
        console.log('[DEBUG] - file:', file ? `存在 (${file.name}, ${file.size} bytes)` : '不存在');
        console.log('[DEBUG] - targetLang:', targetLang);
        console.log('[DEBUG] - translationService:', translationService);
        
        console.log(`[请求参数] 目标语言: ${targetLang}, 翻译服务: ${translationService}, 文件名: ${file?.name}`);
        console.log(`[DEBUG] 文件大小: ${file?.size} bytes`);
        console.log(`[DEBUG] 文件类型: ${file?.type}`);
        console.log(`[DEBUG] 文件最后修改时间: ${file?.lastModified}`);

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

        console.log('[DEBUG] ===== 开始读取文件内容 =====');
        const text = await file.text();
        console.log(`[DEBUG] 文件内容读取完成，长度: ${text.length} 字符`);
        console.log(`[DEBUG] 文件内容前200字符预览: "${text.substring(0, 200)}..."`);
        
        const lines = text.split("\n");
        console.log(`[DEBUG] 文件按换行符分割完成，行数: ${lines.length}`);
        console.log(`[DEBUG] 前5行内容:`, lines.slice(0, 5));
        const translatedLines: string[] = [];
        const failedTranslations: { lineIndex: number; lineContent: string; textIndex: number }[] = [];

        // 计算需要翻译的行数（用于进度计算）
        console.log(`[DEBUG] 原始文件总行数: ${lines.length}`);
        console.log(`[DEBUG] 原始文件前10行预览:`, lines.slice(0, 10));
        
        const textLines = lines.filter(line => {
          const trimmed = line.trim();
          const isNumber = /^\d+$/.test(trimmed);
          const isTimestamp = /^\d{2}:\d{2}:\d{2}/.test(trimmed);
          const isEmpty = trimmed === "";
          
          console.log(`[DEBUG] 行内容: "${line}", 修剪后: "${trimmed}", 是否数字: ${isNumber}, 是否时间戳: ${isTimestamp}, 是否空行: ${isEmpty}`);
          
          return trimmed !== "" && !isNumber && !isTimestamp;
        });
        
        console.log(`[DEBUG] 过滤后需要翻译的行数: ${textLines.length}`);
        console.log(`[DEBUG] 需要翻译的前5行:`, textLines.slice(0, 5));

        let translatedCount = 0;
        
        // 在Cloudflare环境中，如果文件较大，分批处理
        let BATCH_SIZE = isCloudflare ? 30 : 100; // Cloudflare环境：每批30句，本地环境：每批100句
        let totalBatches = Math.ceil(textLines.length / BATCH_SIZE);
        
        if (isCloudflare && totalBatches > 1) {
          console.log(`[Cloudflare优化] 文件较大(${textLines.length}句)，将分批处理：${totalBatches}批，每批${BATCH_SIZE}句`);
        }
        
        // 在Cloudflare环境中，如果文件很大，进一步优化批大小
        if (isCloudflare && textLines.length > 100) {
          const optimizedBatchSize = Math.max(20, Math.floor(30 / Math.ceil(textLines.length / 50)));
          if (optimizedBatchSize < BATCH_SIZE) {
            console.log(`[Cloudflare深度优化] 文件很大(${textLines.length}句)，优化批大小：${BATCH_SIZE} -> ${optimizedBatchSize}`);
            BATCH_SIZE = optimizedBatchSize;
            totalBatches = Math.ceil(textLines.length / BATCH_SIZE);
          }
        }

        // 发送开始信号
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          type: 'start', 
          total: textLines.length,
          service: translationService 
        })}\n\n`));

        // First pass: translate all lines with batch processing for Cloudflare
        const startTime = Date.now();
        const CLOUDFLARE_TIMEOUT = 28000; // 28秒超时（为Cloudflare 30秒限制留出缓冲）
        
        // 简化批处理逻辑，避免索引混乱
        let batchCount = 0;
        
        console.log(`[DEBUG] 开始遍历文件，总共 ${lines.length} 行`);
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          console.log(`[DEBUG] 处理第 ${i + 1} 行: "${line}"`);
          
          // 跳过序号行、时间戳行和空行
          const trimmed = line.trim();
          const isNumber = /^\d+$/.test(trimmed);
          const isTimestamp = /^\d{2}:\d{2}:\d{2}/.test(trimmed);
          const isEmpty = trimmed === "";
          
          console.log(`[DEBUG] 第 ${i + 1} 行分析: 修剪后="${trimmed}", 是否数字=${isNumber}, 是否时间戳=${isTimestamp}, 是否空行=${isEmpty}`);
          
          if (isNumber || isTimestamp || isEmpty) {
            console.log(`[DEBUG] 第 ${i + 1} 行被跳过，直接添加到结果`);
            translatedLines.push(line);
          } else {
            // 翻译字幕文本
            translatedCount++;
            const progress = Math.round((translatedCount / textLines.length) * 100);
            
            console.log(`[DEBUG] 第 ${i + 1} 行开始翻译，当前进度: ${translatedCount}/${textLines.length} (${progress}%)`);
            
            // 检查是否需要开始新批次
            if (translatedCount % BATCH_SIZE === 1) {
              batchCount++;
              console.log(`[DEBUG] 开始新批次: 第 ${batchCount}/${totalBatches} 批`);
              if (isCloudflare && totalBatches > 1) {
                console.log(`[Cloudflare批处理] 开始处理第 ${batchCount}/${totalBatches} 批`);
              }
            }
            
            // 在Cloudflare环境中检查是否接近超时
            if (isCloudflare && translatedCount % BATCH_SIZE === 0) {
              const elapsedTime = Date.now() - startTime;
              if (elapsedTime > CLOUDFLARE_TIMEOUT) {
                console.log(`[Cloudflare超时保护] 已运行${elapsedTime}ms，接近30秒限制，提前进入重试阶段`);
                break;
              }
              
              // 每批完成后休息
              if (batchCount < totalBatches) {
                console.log(`[Cloudflare批处理] 第 ${batchCount} 批完成，休息100ms...`);
                await new Promise(resolve => setTimeout(resolve, 100));
              }
            }
            
            console.log(`[Translation Progress] ${progress}% (${translatedCount}/${textLines.length}) - Translating: "${line.substring(0, 50)}${line.length > 50 ? '...' : ''}"`);
            
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
              console.log(`[DEBUG] 第 ${i + 1} 行调用翻译API，目标语言: ${targetLang}, 服务: ${translationService}`);
              const translationStartTime = Date.now();
              const translatedLine = await translateText(line, targetLang, translationService);
              const translationTime = Date.now() - translationStartTime;
              
              console.log(`[DEBUG] 第 ${i + 1} 行翻译成功，耗时: ${translationTime}ms`);
              console.log(`[Translation Complete] Time: ${translationTime}ms, Original: "${line.substring(0, 30)}...", Translated: "${translatedLine.substring(0, 30)}..."`);
              
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
              console.error(`[DEBUG] 第 ${i + 1} 行翻译失败，错误详情:`, translateError);
              console.error(`[Translation Failed] Line ${translatedCount}: "${line.substring(0, 50)}..." - Error:`, translateError);
              const errorMessage = translateError instanceof Error ? translateError.message : 'Translation failed';
              
              // Store failed translation for retry
              failedTranslations.push({
                lineIndex: i,
                lineContent: line,
                textIndex: translatedCount
              });
              
              // Add placeholder for failed translation
              translatedLines.push(line); // Keep original text temporarily
              
              // Check for fatal errors (e.g., API key issues)
              if (errorMessage.includes('认证失败') || 
                  errorMessage.includes('API密钥') || 
                  errorMessage.includes('访问被拒绝') ||
                  errorMessage.includes('authentication') ||
                  errorMessage.includes('API key') ||
                  errorMessage.includes('access denied')) {
                console.log(`[Fatal Error] Configuration issue detected: ${errorMessage}`);
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                  type: 'fatal_error', 
                  error: errorMessage,
                  partialResult: translatedLines.join('\n')
                })}\n\n`));
                controller.close();
                return;
              }
              
              // 在Cloudflare环境中，如果是超时错误，提前进入重试阶段
              if (isCloudflare && (errorMessage.includes('超时') || errorMessage.includes('timeout') || errorMessage.includes('AbortError'))) {
                console.log(`[Cloudflare超时检测] 检测到超时错误，提前进入重试阶段`);
                break;
              }
              
              // Continue with next line without showing error
              console.log(`[Continuing] Skipping failed line, will retry later`);
            }
            
            // 添加延迟避免API限制 - 在Cloudflare环境中减少延迟
            const delay = isCloudflare ? 
              (translationService === 'openai' ? 50 : 25) : // Cloudflare环境：减少延迟
              (translationService === 'openai' ? 100 : 50);  // 本地环境：正常延迟
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }

        // Second pass: retry failed translations
        if (failedTranslations.length > 0) {
          console.log(`[Retry Phase] Attempting to translate ${failedTranslations.length} failed lines`);
          
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'retry_phase_start', 
            failureCount: failedTranslations.length,
            message: `Retrying ${failedTranslations.length} failed translations...`
          })}\n\n`));
          
          let retryCount = 0;
          let successfulRetries = 0;
          for (const failed of failedTranslations) {
            retryCount++;
            const retryProgress = Math.round((retryCount / failedTranslations.length) * 100);
            
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
              type: 'retry_progress', 
              progress: retryProgress,
              current: retryCount,
              total: failedTranslations.length,
              currentText: failed.lineContent.trim()
            })}\n\n`));
            
            try {
              // Wait longer before retry - 在Cloudflare环境中减少延迟
              const retryDelay = isCloudflare ? 500 : 1000;
              await new Promise(resolve => setTimeout(resolve, retryDelay));
              
              const translatedLine = await translateText(failed.lineContent, targetLang, translationService);
              translatedLines[failed.lineIndex] = translatedLine;
              successfulRetries++;
              
              console.log(`[Retry Success] Line ${failed.textIndex} translated successfully`);
              
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                type: 'retry_success', 
                original: failed.lineContent.trim(),
                translated: translatedLine.trim(),
                index: failed.textIndex,
                totalAttempts: 2
              })}\n\n`));
              
            } catch (retryError) {
              console.error(`[Retry Failed] Line ${failed.textIndex} still failed:`, retryError);
              
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                type: 'retry_failed', 
                text: failed.lineContent.trim(),
                finalError: retryError instanceof Error ? retryError.message : 'Retry failed'
              })}\n\n`));
              
              // Keep original text if retry also fails
            }
          }
          
          // Send retry phase complete message
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'retry_phase_complete', 
            retriedCount: failedTranslations.length,
            successfulRetries: successfulRetries
          })}\n\n`));
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
        console.error('[DEBUG] ===== 捕获到严重错误 =====');
        console.error('[DEBUG] 错误类型:', error instanceof Error ? error.constructor.name : typeof error);
        console.error('[DEBUG] 错误消息:', error instanceof Error ? error.message : String(error));
        console.error('[DEBUG] 错误堆栈:', error instanceof Error ? error.stack : '无堆栈信息');
        console.error('[DEBUG] 错误时间:', new Date().toISOString());
        
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

  console.log('[DEBUG] ===== 准备返回Response =====');
  console.log('[DEBUG] stream对象类型:', typeof stream);
  console.log('[DEBUG] stream对象:', stream);
  
  const response = new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
  
  console.log('[DEBUG] ===== Response创建完成，准备返回 =====');
  console.log('[DEBUG] response状态:', response.status);
  console.log('[DEBUG] response头部:', Object.fromEntries(response.headers.entries()));
  
  return response;
} 