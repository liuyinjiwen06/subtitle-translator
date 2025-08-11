import { NextRequest } from "next/server";

export const runtime = "edge";

// 完整的44种语言映射
const languageMap: { [key: string]: string } = {
  'zh': 'zh-cn', 'en': 'en', 'ja': 'ja', 'fr': 'fr', 'de': 'de',
  'es': 'es', 'ru': 'ru', 'it': 'it', 'ko': 'ko', 'ar': 'ar',
  'hi': 'hi', 'pt': 'pt', 'bn': 'bn', 'vi': 'vi', 'tr': 'tr',
  'pl': 'pl', 'nl': 'nl', 'th': 'th', 'sv': 'sv', 'da': 'da',
  'no': 'nb', 'fi': 'fi', 'el': 'el', 'cs': 'cs', 'hu': 'hu',
  'he': 'he', 'id': 'id', 'ms': 'ms', 'ro': 'ro', 'uk': 'uk',
  'bg': 'bg', 'hr': 'hr', 'sk': 'sk', 'sl': 'sl', 'et': 'et',
  'lv': 'lv', 'lt': 'lt', 'ta': 'ta', 'kn': 'kn', 'ml': 'ml', 'te': 'te'
};

// 语言名称映射
const languageNames: { [key: string]: string } = {
  'zh': 'Chinese', 'en': 'English', 'ja': 'Japanese', 'fr': 'French',
  'de': 'German', 'es': 'Spanish', 'ru': 'Russian', 'it': 'Italian',
  'ko': 'Korean', 'ar': 'Arabic', 'hi': 'Hindi', 'pt': 'Portuguese'
};

// 服务统计接口
interface ServiceStats {
  google: {
    success: number;
    failure: number;
    successRate: number;
    avgResponseTime: number;
    totalCalls: number;
  };
  openai: {
    success: number;
    failure: number;
    successRate: number;
    avgResponseTime: number;
    totalCalls: number;
  };
}

// 翻译任务接口
interface TranslationTask {
  index: number;
  originalText: string;
  type: 'subtitle' | 'timestamp' | 'number' | 'empty';
  isAlreadyTranslated: boolean;
  needsTranslation: boolean;
  textToTranslate: string;
  complexity: 'simple' | 'medium' | 'complex';
}

// 翻译结果接口
interface TranslationResult {
  index: number;
  originalText: string;
  translatedText: string;
  serviceUsed: string;
  responseTime: number;
  attempts: number;
  status: 'success' | 'failed' | 'fallback';
}

// 智能内容分析
function analyzeContent(lines: string[], targetLang: string) {
  const analyzedLines = lines.map((line, index) => ({
    index,
    originalText: line,
    type: classifyLineType(line),
    isAlreadyTranslated: isAlreadyTranslated(line, targetLang),
    needsTranslation: shouldTranslate(line, targetLang),
    textToTranslate: extractTextToTranslate(line),
    complexity: assessComplexity(line)
  }));

  const translationTasks = analyzedLines.filter(item => item.needsTranslation);
  
  return {
    totalLines: lines.length,
    translationTasks,
    alreadyTranslated: analyzedLines.filter(item => item.isAlreadyTranslated).length,
    estimatedTime: Math.ceil(translationTasks.length / 30) // 估计每分钟30句
  };
}

function classifyLineType(line: string): 'subtitle' | 'timestamp' | 'number' | 'empty' {
  const trimmed = line.trim();
  if (trimmed === '') return 'empty';
  if (/^\d+$/.test(trimmed)) return 'number';
  if (/^\d{2}:\d{2}:\d{2}/.test(trimmed)) return 'timestamp';
  return 'subtitle';
}

function isAlreadyTranslated(line: string, targetLang: string): boolean {
  // 检测双语格式：原文 | 译文
  if (line.includes(' | ')) {
    return true;
  }
  
  // 检测双语方括号格式：[原文] [译文] (必须有两个不同内容的方括号)
  const bracketMatches = line.match(/\[[^\]]+\]/g);
  if (bracketMatches && bracketMatches.length >= 2) {
    // 检查是否有至少两个不同内容的方括号
    const uniqueBrackets = [...new Set(bracketMatches)];
    if (uniqueBrackets.length >= 2) {
      return true;
    }
  }
  
  // 检测目标语言字符（仅当目标是中文时检测中文字符）
  if (targetLang === 'zh' && /[\u4e00-\u9fa5]/.test(line)) {
    return true;
  }
  
  return false;
}

function shouldTranslate(line: string, targetLang: string): boolean {
  const type = classifyLineType(line);
  if (type !== 'subtitle') return false;
  if (isAlreadyTranslated(line, targetLang)) return false;
  return true;
}

function extractTextToTranslate(line: string): string {
  // 如果包含 | 分隔符，只取第一部分
  if (line.includes(' | ')) {
    return line.split(' | ')[0].trim();
  }
  
  // 如果是双语方括号格式 [原文] [译文]，只提取第一个方括号内容
  const bracketMatches = line.match(/\[([^\]]+)\]/g);
  if (bracketMatches && bracketMatches.length >= 2) {
    const firstBracketContent = bracketMatches[0].match(/\[([^\]]+)\]/);
    if (firstBracketContent) {
      return firstBracketContent[1];
    }
  }
  
  // 对于单个方括号或没有方括号的情况，返回整行
  return line.trim();
}

function assessComplexity(text: string): 'simple' | 'medium' | 'complex' {
  const length = text.length;
  const wordCount = text.split(/\s+/).length;
  const hasSpecialChars = /[<>{}[\]@#$%^&*()]/.test(text);
  
  if (length < 20 && wordCount < 5 && !hasSpecialChars) return 'simple';
  if (length > 80 || wordCount > 15 || hasSpecialChars) return 'complex';
  return 'medium';
}

// Google翻译服务
async function translateWithGoogle(text: string, targetLang: string): Promise<{translation: string, responseTime: number}> {
  const startTime = Date.now();
  
  try {
    if (!text.trim()) return { translation: text, responseTime: 0 };

    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    if (!apiKey) {
      throw new Error('Google翻译服务暂时不可用');
    }

    const targetLangCode = languageMap[targetLang] || targetLang;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          target: targetLangCode,
          format: 'text'
        }),
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Google翻译失败: ${response.status}`);
    }

    const data = await response.json();
    const responseTime = Date.now() - startTime;
    
    return {
      translation: data.data.translations[0].translatedText,
      responseTime
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const enhancedError = new Error(errorMessage) as any;
    enhancedError.responseTime = responseTime;
    enhancedError.service = 'google';
    throw enhancedError;
  }
}

// OpenAI翻译服务
async function translateWithOpenAI(text: string, targetLang: string): Promise<{translation: string, responseTime: number}> {
  const startTime = Date.now();
  
  try {
    if (!text.trim()) return { translation: text, responseTime: 0 };

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI翻译服务暂时不可用');
    }

    const targetLanguage = languageNames[targetLang] || targetLang;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);
    
    const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com';
    const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        temperature: 0.1,
        max_tokens: Math.min(text.length * 2, 200),
        messages: [
          {
            role: 'system',
            content: `You are a professional subtitle translator. Translate the given subtitle text to ${targetLanguage}. Keep the translation natural and suitable for subtitles. Only return the translated text without any explanation.`
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
      throw new Error(`OpenAI翻译失败: ${response.status}`);
    }

    const data = await response.json();
    const responseTime = Date.now() - startTime;
    
    return {
      translation: data.choices[0].message.content.trim(),
      responseTime
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const enhancedError = new Error(errorMessage) as any;
    enhancedError.responseTime = responseTime;
    enhancedError.service = 'openai';
    throw enhancedError;
  }
}

// Cloudflare环境：简化服务选择，避免复杂计算
function selectBestService(task: TranslationTask, serviceStats: ServiceStats): string {
  // Cloudflare环境下固定使用Google，避免服务切换的复杂性
  return 'google';
}

// 更新服务统计
function updateServiceStats(serviceStats: ServiceStats, service: string, success: boolean, responseTime: number) {
  const stats = serviceStats[service as keyof ServiceStats];
  
  if (success) {
    stats.success++;
  } else {
    stats.failure++;
  }
  
  stats.totalCalls++;
  stats.successRate = stats.success / stats.totalCalls;
  
  // 计算平均响应时间 (移动平均)
  if (stats.avgResponseTime === 0) {
    stats.avgResponseTime = responseTime;
  } else {
    stats.avgResponseTime = (stats.avgResponseTime * 0.7) + (responseTime * 0.3);
  }
}

// Cloudflare优化：极简重试策略
async function smartTranslateWithRetry(
  task: TranslationTask, 
  targetLang: string,
  serviceStats: ServiceStats,
  maxAttempts: number = 1 // Cloudflare环境下只尝试1次，避免subrequest累积
): Promise<{translation: string, service: string, responseTime: number, attempts: number}> {
  
  // 只使用一个服务，避免服务切换导致的额外subrequest
  const primaryService = selectBestService(task, serviceStats);
  const orderedServices = [primaryService]; // 只使用主服务
  
  let totalAttempts = 0;
  let lastError: Error | null = null;

  for (const service of orderedServices) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      totalAttempts++;
      
      try {
        const result = service === 'google'
          ? await translateWithGoogle(task.textToTranslate, targetLang)
          : await translateWithOpenAI(task.textToTranslate, targetLang);
        
        updateServiceStats(serviceStats, service, true, result.responseTime);
        
        return {
          translation: result.translation,
          service,
          responseTime: result.responseTime,
          attempts: totalAttempts
        };
      } catch (error) {
        lastError = error as Error;
        const responseTime = (error as any).responseTime || 0;
        updateServiceStats(serviceStats, service, false, responseTime);
        
        // 网络错误或配置错误：立即切换服务
        const errorMessage = lastError.message.toLowerCase();
        if (errorMessage.includes('network') || 
            errorMessage.includes('timeout') || 
            errorMessage.includes('不可用') ||
            errorMessage.includes('认证失败')) {
          console.log(`[Service Switch] ${service} failed: ${lastError.message}`);
          break; // 跳出当前服务的重试循环，尝试下一个服务
        }
        
        // 其他错误：指数退避重试
        if (attempt < maxAttempts) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
  }
  
  // 所有服务都失败了
  const error = new Error(`所有翻译服务都失败了: ${lastError?.message}`) as any;
  error.attempts = totalAttempts;
  error.lastService = orderedServices[orderedServices.length - 1];
  throw error;
}

// 动态并发调整
function adjustConcurrentLevel(
  current: number, 
  results: TranslationResult[], 
  failures: any[]
): number {
  
  if (results.length === 0 && failures.length === 0) return current;
  
  const successRate = results.length / (results.length + failures.length);
  const avgResponseTime = results.length > 0 
    ? results.reduce((sum, r) => sum + r.responseTime, 0) / results.length 
    : 3000;
  
  // Cloudflare环境下保持串行处理，确保不超过subrequest限制
  return 1;
}

// 智能延迟
async function smartDelay(serviceStats: ServiceStats, concurrentLevel: number) {
  const avgResponseTime = Math.max(
    serviceStats.google.avgResponseTime,
    serviceStats.openai.avgResponseTime
  );
  
  // Cloudflare串行处理：最小延迟即可
  let delay = 50; // 串行处理下的基础延迟
  
  // 根据响应时间调整
  if (avgResponseTime > 2000) delay = 100;
  if (avgResponseTime > 4000) delay = 150;
  
  // 最大延迟限制
  delay = Math.min(delay, 300);
  
  await new Promise(resolve => setTimeout(resolve, delay));
}

// 主处理函数
export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // 解析请求
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const targetLang = formData.get("targetLang") as string;
        let preferredService = (formData.get("translationService") as string) || 'google';

        if (!file || !targetLang) {
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
          runtime: 'edge'
        })}\n\n`));

        // 检查服务可用性
        if (!process.env.GOOGLE_TRANSLATE_API_KEY && !process.env.OPENAI_API_KEY) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'error', 
            error: '翻译服务未配置：缺少API密钥' 
          })}\n\n`));
          controller.close();
          return;
        }

        // 自动切换服务如果首选服务不可用
        if (preferredService === 'google' && !process.env.GOOGLE_TRANSLATE_API_KEY) {
          preferredService = 'openai';
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'service_switch', 
            message: 'Google服务不可用，自动切换到OpenAI',
            from: 'google',
            to: 'openai'
          })}\n\n`));
        } else if (preferredService === 'openai' && !process.env.OPENAI_API_KEY) {
          preferredService = 'google';
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'service_switch', 
            message: 'OpenAI服务不可用，自动切换到Google',
            from: 'openai', 
            to: 'google'
          })}\n\n`));
        }

        // 阶段1：智能预处理分析
        const fileContent = await file.text();
        const lines = fileContent.split('\n');
        const analysis = analyzeContent(lines, targetLang);

        // 发送分析结果
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          type: 'analysis_complete',
          totalLines: analysis.totalLines,
          needTranslation: analysis.translationTasks.length,
          alreadyTranslated: analysis.alreadyTranslated,
          estimatedTime: analysis.estimatedTime
        })}\n\n`));

        if (analysis.translationTasks.length === 0) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'complete',
            result: lines.join('\n'),
            message: '文件已完全翻译，无需处理'
          })}\n\n`));
          controller.close();
          return;
        }

        // 初始化服务统计
        const serviceStats: ServiceStats = {
          google: { success: 0, failure: 0, successRate: 0, avgResponseTime: 0, totalCalls: 0 },
          openai: { success: 0, failure: 0, successRate: 0, avgResponseTime: 0, totalCalls: 0 }
        };

        // 阶段2：串行处理 (Cloudflare严格限制)
        // Cloudflare Workers限制：每个请求最多50个subrequest
        // 为确保绝对不超限，改为串行处理，只保留错误重试的并发
        const GROUP_SIZE = 20; // 更小的组大小
        let CONCURRENT_SIZE = 1; // 串行处理，确保不超过subrequest限制
        const totalGroups = Math.ceil(analysis.translationTasks.length / GROUP_SIZE);
        
        const allResults: TranslationResult[] = [];
        const allFailures: any[] = [];
        const processedLines = [...lines]; // 复制原始行数组

        // 发送开始信号
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          type: 'start', 
          total: analysis.translationTasks.length,
          totalGroups,
          initialConcurrentSize: CONCURRENT_SIZE
        })}\n\n`));

        // 分组处理
        for (let groupIndex = 0; groupIndex < totalGroups; groupIndex++) {
          const groupStart = groupIndex * GROUP_SIZE;
          const groupEnd = Math.min(groupStart + GROUP_SIZE, analysis.translationTasks.length);
          const currentGroup = analysis.translationTasks.slice(groupStart, groupEnd);

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'group_start',
            groupNumber: groupIndex + 1,
            totalGroups,
            groupSize: currentGroup.length,
            concurrentSize: CONCURRENT_SIZE
          })}\n\n`));

          // 组内并发处理
          const groupResults: TranslationResult[] = [];
          const groupFailures: any[] = [];

          // 将组分成并发批次
          for (let i = 0; i < currentGroup.length; i += CONCURRENT_SIZE) {
            const concurrentBatch = currentGroup.slice(i, i + CONCURRENT_SIZE);
            
            // 并发处理当前批次
            const batchPromises = concurrentBatch.map(async (task, batchIndex) => {
              const globalIndex = groupStart + i + batchIndex;
              
              try {
                // 发送翻译开始事件
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                  type: 'translation_start',
                  index: globalIndex,
                  text: task.textToTranslate.substring(0, 50) + (task.textToTranslate.length > 50 ? '...' : ''),
                  progress: Math.round((allResults.length / analysis.translationTasks.length) * 100)
                })}\n\n`));

                const result = await smartTranslateWithRetry(task, targetLang, serviceStats, 1);
                
                const successResult: TranslationResult = {
                  index: task.index,
                  originalText: task.originalText,
                  translatedText: result.translation,
                  serviceUsed: result.service,
                  responseTime: result.responseTime,
                  attempts: result.attempts,
                  status: 'success'
                };

                // 更新处理后的行
                processedLines[task.index] = result.translation;

                // 发送翻译成功事件
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                  type: 'translation_success',
                  index: globalIndex,
                  original: task.textToTranslate,
                  translated: result.translation,
                  service: result.service,
                  responseTime: result.responseTime,
                  attempts: result.attempts
                })}\n\n`));

                return { type: 'success', data: successResult };
                
              } catch (error) {
                const failureData = {
                  index: task.index,
                  originalText: task.originalText,
                  textToTranslate: task.textToTranslate,
                  error: error instanceof Error ? error.message : 'Unknown error',
                  attempts: (error as any).attempts || 1,
                  lastService: (error as any).lastService,
                  status: 'failed'
                };

                // 发送翻译失败事件
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                  type: 'translation_failure',
                  index: globalIndex,
                  text: task.textToTranslate,
                  error: failureData.error,
                  canContinue: true
                })}\n\n`));

                return { type: 'failure', data: failureData };
              }
            });

            // 等待当前并发批次完成
            const batchResults = await Promise.all(batchPromises);
            
            // 分类结果
            batchResults.forEach(result => {
              if (result.type === 'success') {
                groupResults.push(result.data);
                allResults.push(result.data);
              } else {
                groupFailures.push(result.data);
                allFailures.push(result.data);
              }
            });

            // 发送进度更新
            const currentProgress = Math.round((allResults.length / analysis.translationTasks.length) * 100);
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
              type: 'progress',
              progress: currentProgress,
              completed: allResults.length,
              total: analysis.translationTasks.length,
              currentGroup: groupIndex + 1,
              totalGroups,
              serviceStats: {
                google: {
                  successRate: Math.round(serviceStats.google.successRate * 100),
                  avgResponseTime: Math.round(serviceStats.google.avgResponseTime)
                },
                openai: {
                  successRate: Math.round(serviceStats.openai.successRate * 100),
                  avgResponseTime: Math.round(serviceStats.openai.avgResponseTime)
                }
              }
            })}\n\n`));

            // 批次间智能延迟
            if (i + CONCURRENT_SIZE < currentGroup.length) {
              await smartDelay(serviceStats, CONCURRENT_SIZE);
            }
          }

          // 组完成处理
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'group_complete',
            groupNumber: groupIndex + 1,
            totalGroups,
            groupSuccess: groupResults.length,
            groupFailures: groupFailures.length
          })}\n\n`));

          // 动态调整并发数
          const newConcurrentSize = adjustConcurrentLevel(CONCURRENT_SIZE, groupResults, groupFailures);
          if (newConcurrentSize !== CONCURRENT_SIZE) {
            CONCURRENT_SIZE = newConcurrentSize;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
              type: 'concurrent_adjusted',
              oldSize: CONCURRENT_SIZE,
              newSize: newConcurrentSize,
              reason: groupFailures.length > groupResults.length * 0.2 ? 'high_failure_rate' : 'performance_optimization'
            })}\n\n`));
          }

          // 定期自动保存
          if ((groupIndex + 1) % 2 === 0) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
              type: 'auto_save',
              savedLines: allResults.length,
              partialResult: processedLines.join('\n')
            })}\n\n`));
          }
        }

        // 阶段3：失败重试处理
        if (allFailures.length > 0) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'retry_phase_start',
            failureCount: allFailures.length
          })}\n\n`));

          const retryResults: TranslationResult[] = [];

          // Cloudflare环境：串行重试策略
          for (let i = 0; i < allFailures.length; i += 1) { // 串行重试
            const retryBatch = allFailures.slice(i, i + 1);
            
            const retryPromises = retryBatch.map(async (failedItem) => {
              try {
                // 等待更长时间再重试
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                const task: TranslationTask = {
                  index: failedItem.index,
                  originalText: failedItem.originalText,
                  type: 'subtitle',
                  isAlreadyTranslated: false,
                  needsTranslation: true,
                  textToTranslate: failedItem.textToTranslate,
                  complexity: assessComplexity(failedItem.textToTranslate)
                };

                const result = await smartTranslateWithRetry(task, targetLang, serviceStats, 1);
                
                const retryResult: TranslationResult = {
                  index: failedItem.index,
                  originalText: failedItem.originalText,
                  translatedText: result.translation,
                  serviceUsed: result.service,
                  responseTime: result.responseTime,
                  attempts: failedItem.attempts + result.attempts,
                  status: 'success'
                };

                // 更新处理后的行
                processedLines[failedItem.index] = result.translation;

                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                  type: 'retry_success',
                  index: failedItem.index,
                  original: failedItem.textToTranslate,
                  translated: result.translation,
                  totalAttempts: retryResult.attempts
                })}\n\n`));

                return retryResult;
              } catch (error) {
                // 最终失败：保留原文但加标记
                const fallbackResult: TranslationResult = {
                  index: failedItem.index,
                  originalText: failedItem.originalText,
                  translatedText: failedItem.originalText + ' [TRANSLATION_FAILED]',
                  serviceUsed: 'fallback',
                  responseTime: 0,
                  attempts: failedItem.attempts + 1,
                  status: 'fallback'
                };

                processedLines[failedItem.index] = fallbackResult.translatedText;

                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                  type: 'retry_failed',
                  index: failedItem.index,
                  text: failedItem.textToTranslate,
                  finalError: error instanceof Error ? error.message : 'Unknown error'
                })}\n\n`));

                return fallbackResult;
              }
            });

            const batchRetryResults = await Promise.all(retryPromises);
            retryResults.push(...batchRetryResults);
          }

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'retry_phase_complete',
            retriedCount: retryResults.length,
            successfulRetries: retryResults.filter(r => r.status === 'success').length
          })}\n\n`));
        }

        // 最终完成
        const finalResult = processedLines.join('\n');
        const totalSuccessful = allResults.length + (allFailures.length > 0 ? 
          allFailures.filter(f => processedLines[f.index] !== f.originalText + ' [TRANSLATION_FAILED]').length : 0);
        
        // 发送最终自动保存事件
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          type: 'auto_save',
          savedLines: totalSuccessful,
          partialResult: finalResult,
          isFinal: true
        })}\n\n`));
        
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          type: 'complete',
          result: finalResult,
          statistics: {
            totalLines: analysis.totalLines,
            translationTasks: analysis.translationTasks.length,
            successful: totalSuccessful,
            failed: analysis.translationTasks.length - totalSuccessful,
            alreadyTranslated: analysis.alreadyTranslated,
            successRate: Math.round((totalSuccessful / analysis.translationTasks.length) * 100),
            serviceUsage: {
              google: serviceStats.google.totalCalls,
              openai: serviceStats.openai.totalCalls
            }
          }
        })}\n\n`));

        controller.close();

      } catch (error) {
        console.error('Unified translation error:', error);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          type: 'error', 
          error: error instanceof Error ? error.message : 'Unknown error occurred'
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