/**
 * 翻译客户端
 * 负责调用 Cloudflare Workers API 进行翻译
 */

import { SubtitleEntry } from './srt-parser';
import { TranslatedEntry } from './srt-generator';
import { getLanguageCode, TranslationLanguage } from '@/config/languages';

interface TranslationResult {
  success: boolean;
  translatedText?: string;
  error?: string;
}

/**
 * 翻译单条字幕
 */
export async function translateSubtitle(
  text: string,
  sourceLanguage: TranslationLanguage,
  targetLanguage: TranslationLanguage
): Promise<TranslationResult> {
  // 使用 Next.js API 路由
  const apiURL = '/api/translate';

  try {
    const response = await fetch(apiURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        sourceLanguage: getLanguageCode(sourceLanguage),
        targetLanguage: getLanguageCode(targetLanguage),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || `HTTP ${response.status}`,
      };
    }

    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        error: data.error || 'Translation failed',
      };
    }

    return {
      success: true,
      translatedText: data.translatedText,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * 批量翻译字幕（带进度回调）
 */
export async function translateSubtitles(
  entries: SubtitleEntry[],
  sourceLanguage: TranslationLanguage,
  targetLanguage: TranslationLanguage,
  onProgress?: (current: number, total: number, translatedEntry: TranslatedEntry) => void
): Promise<{ success: boolean; entries?: TranslatedEntry[]; error?: string }> {
  const translatedEntries: TranslatedEntry[] = [];

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];

    // 翻译当前条目
    const result = await translateSubtitle(
      entry.text,
      sourceLanguage,
      targetLanguage
    );

    if (!result.success) {
      return {
        success: false,
        error: result.error || `Failed to translate entry ${i + 1}`,
      };
    }

    // 创建翻译后的条目
    const translatedEntry: TranslatedEntry = {
      ...entry,
      translatedText: result.translatedText || entry.text,
    };

    translatedEntries.push(translatedEntry);

    // 调用进度回调
    if (onProgress) {
      onProgress(i + 1, entries.length, translatedEntry);
    }

    // 添加小延迟，避免触发速率限制
    if (i < entries.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return {
    success: true,
    entries: translatedEntries,
  };
}
