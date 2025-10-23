import { NextRequest, NextResponse } from "next/server";


// 语言代码映射
const languageMap: { [key: string]: string } = {
  'zh': 'zh-cn',
  'en': 'en',
  'ja': 'ja',
  'fr': 'fr',
  'de': 'de',
  'es': 'es',
  'ru': 'ru',
  'it': 'it',
  'ko': 'ko',
  'ar': 'ar',
  'hi': 'hi',
  'pt': 'pt',
  'bn': 'bn',
  'vi': 'vi',
  'tr': 'tr',
  'pl': 'pl',
  'nl': 'nl',
  'th': 'th',
  'sv': 'sv',
  'da': 'da',
  'no': 'nb',
  'fi': 'fi',
  'el': 'el',
  'cs': 'cs',
  'hu': 'hu',
  'he': 'he',
  'id': 'id',
  'ms': 'ms',
  'ro': 'ro',
  'uk': 'uk',
  'bg': 'bg',
  'hr': 'hr',
  'sk': 'sk',
  'ta': 'ta',
  'kn': 'kn',
  'ml': 'ml',
  'te': 'te'
};

// 检测行是否已经包含目标语言翻译
function isAlreadyTranslated(line: string, targetLang: string): boolean {
  // 检查常见的双语字幕格式
  // 格式1: 原文\n译文
  // 格式2: 原文 | 译文
  // 格式3: [原文] [译文]
  
  // 简单检测：如果行中包含 | 或 [] 或有两行文本，可能已翻译
  if (line.includes(' | ') || (line.includes('[') && line.includes(']'))) {
    return true;
  }
  
  // 检测是否包含目标语言的字符
  // 这里需要根据目标语言做更精确的判断
  if (targetLang === 'zh' && /[\u4e00-\u9fa5]/.test(line)) {
    // 如果目标语言是中文，且已包含中文字符
    return true;
  }
  
  return false;
}

// 提取需要翻译的部分
function extractTextToTranslate(line: string): string {
  // 如果包含 | 分隔符，只取第一部分
  if (line.includes(' | ')) {
    return line.split(' | ')[0].trim();
  }
  
  // 如果包含 [] 格式，提取第一个方括号内的内容
  const bracketMatch = line.match(/\[([^\]]+)\]/);
  if (bracketMatch) {
    return bracketMatch[1];
  }
  
  // 否则返回整行
  return line;
}

// 翻译函数（从原文件复制）
async function translateWithGoogle(text: string, targetLang: string): Promise<string> {
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!apiKey) {
    throw new Error('Google翻译服务暂时不可用');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          target: languageMap[targetLang] || targetLang,
          format: 'text'
        }),
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`翻译失败: ${response.status}`);
    }

    const data = await response.json();
    return data.data.translations[0].translatedText;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function translateWithOpenAI(text: string, targetLang: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI翻译服务暂时不可用');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);
  
  const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com';
  const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

  try {
    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        temperature: 0.1,
        max_tokens: 200,
        messages: [
          {
            role: 'system',
            content: `You are a professional subtitle translator. Translate the given subtitle text to ${targetLang}. Keep the translation natural and suitable for subtitles. Only return the translated text without any explanation.`
          },
          {
            role: 'user',
            content: text
          }
        ]
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`翻译失败: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      let currentBatch = 0;
      let totalBatches = 1;
      const BATCH_SIZE = 50; // 每批50行，对于100行的文件会分成2批
      const SAVE_INTERVAL = 10; // 每10行保存一次
      
      try {
        const body = await request.json();
        const { 
          content, 
          targetLang, 
          translationService = 'google',
          skipTranslated = true,  // 是否跳过已翻译内容
          batchMode = 'auto'  // auto: 自动分批, manual: 手动控制, off: 不分批
        } = body;

        if (!content || !targetLang) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'error', 
            error: 'Missing required parameters' 
          })}\n\n`));
          controller.close();
          return;
        }

        // 发送环境状态
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          type: 'env_status',
          googleConfigured: !!process.env.GOOGLE_TRANSLATE_API_KEY,
          openaiConfigured: !!process.env.OPENAI_API_KEY,
          service: translationService
        })}\n\n`));

        // 解析SRT文件
        const lines = content.split('\n');
        const translatedLines: string[] = [];
        const failedTranslations: any[] = [];
        
        // 找出需要翻译的文本行
        const textLines = lines.map((line: string, index: number) => ({
          index,
          text: line,
          needsTranslation: line.trim() !== "" && 
                           !/^\d+$/.test(line.trim()) && 
                           !/^\d{2}:\d{2}:\d{2}/.test(line) &&
                           (!skipTranslated || !isAlreadyTranslated(line, targetLang))
        })).filter((item: any) => item.needsTranslation);

        // 计算批次
        if (batchMode === 'auto' && textLines.length > 100) {
          totalBatches = Math.ceil(textLines.length / BATCH_SIZE);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'batch_info',
            totalLines: textLines.length,
            batchSize: BATCH_SIZE,
            totalBatches: totalBatches,
            message: `File contains ${textLines.length} lines. Will process in ${totalBatches} batches.`
          })}\n\n`));
        }

        let translatedCount = 0;
        let savedCount = 0;

        // 发送开始信号
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          type: 'start', 
          total: textLines.length,
          service: translationService,
          batchMode: totalBatches > 1
        })}\n\n`));

        // 翻译处理
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const textLineInfo = textLines.find((t: any) => t.index === i);
          
          if (!textLineInfo) {
            // 不需要翻译的行（时间戳、序号、空行或已翻译）
            translatedLines.push(line);
            continue;
          }

          // 检查是否开始新批次（仅用于进度显示）
          if (batchMode === 'auto' && totalBatches > 1) {
            const currentLineBatch = Math.floor(translatedCount / BATCH_SIZE);
            if (currentLineBatch > currentBatch) {
              currentBatch = currentLineBatch;
              
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                type: 'batch_progress',
                batchNumber: currentBatch + 1,
                totalBatches: totalBatches,
                translatedCount: translatedCount,
                message: `Processing batch ${currentBatch + 1}/${totalBatches}...`
              })}\n\n`));
            }
          }

          // 翻译文本
          translatedCount++;
          const progress = Math.round((translatedCount / textLines.length) * 100);
          
          // 发送进度更新
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'progress', 
            progress: progress,
            current: translatedCount,
            total: textLines.length,
            currentText: line.trim(),
            batch: totalBatches > 1 ? `${currentBatch + 1}/${totalBatches}` : null
          })}\n\n`));
          
          try {
            // 提取需要翻译的部分
            const textToTranslate = skipTranslated ? extractTextToTranslate(line) : line;
            
            // 执行翻译
            const translatedText = translationService === 'openai' 
              ? await translateWithOpenAI(textToTranslate, targetLang)
              : await translateWithGoogle(textToTranslate, targetLang);
            
            // 如果原文已有翻译格式，保持格式
            let finalLine = translatedText;
            if (skipTranslated && line !== textToTranslate) {
              // 保持原有格式，只替换翻译部分
              if (line.includes(' | ')) {
                finalLine = `${textToTranslate} | ${translatedText}`;
              } else {
                finalLine = translatedText;
              }
            }
            
            translatedLines.push(finalLine);
            
            // 发送单条翻译结果
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
              type: 'translated', 
              original: line.trim(),
              translated: finalLine.trim(),
              index: translatedCount
            })}\n\n`));
            
            // 定期保存进度
            if (translatedCount % SAVE_INTERVAL === 0) {
              savedCount = translatedCount;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                type: 'auto_save',
                savedCount: savedCount,
                partialResult: translatedLines.join('\n'),
                message: `Auto-saved at ${savedCount} translations`
              })}\n\n`));
            }
            
          } catch (error) {
            console.error(`Translation failed for line ${i}:`, error);
            
            // 记录失败的翻译
            failedTranslations.push({
              lineIndex: i,
              lineContent: line,
              error: error instanceof Error ? error.message : 'Unknown error'
            });
            
            // 保留原文
            translatedLines.push(line);
            
            // 发送错误信息
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
              type: 'translation_error',
              line: line,
              error: error instanceof Error ? error.message : 'Translation failed',
              canContinue: true
            })}\n\n`));
          }
          
          // 添加延迟避免API限制
          await new Promise(resolve => setTimeout(resolve, 50));
        }

        // 发送完成信号
        const finalResult = translatedLines.join('\n');
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          type: 'complete',
          result: finalResult,
          totalTranslated: translatedCount,
          totalFailed: failedTranslations.length,
          failedLines: failedTranslations,
          isPartial: false
        })}\n\n`));
        
      } catch (error) {
        console.error('Translation stream error:', error);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          type: 'error', 
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        })}\n\n`));
      } finally {
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