/**
 * SRT 字幕生成器
 * 生成单语或双语 SRT 文件
 */

import { SubtitleEntry } from './srt-parser';

export type OutputFormat = 'mono' | 'bilingual' | 'both';

export interface TranslatedEntry extends SubtitleEntry {
  translatedText: string; // 翻译后的文本
}

/**
 * 生成单语字幕（仅目标语言）
 * @param entries - 翻译后的字幕条目
 * @returns SRT 格式的字符串
 */
export function generateMonolingualSRT(
  entries: TranslatedEntry[]
): string {
  const lines: string[] = [];

  for (const entry of entries) {
    lines.push(
      String(entry.index),
      `${entry.startTime} --> ${entry.endTime}`,
      entry.translatedText,
      '' // 空行分隔
    );
  }

  return lines.join('\n');
}

/**
 * 生成双语字幕（源语言 + 目标语言）
 * 格式：
 * 1
 * 00:00:01,000 --> 00:00:03,000
 * Hello, how are you?
 * 你好，你好吗？
 *
 * @param entries - 翻译后的字幕条目
 * @returns SRT 格式的字符串
 */
export function generateBilingualSRT(
  entries: TranslatedEntry[]
): string {
  const lines: string[] = [];

  for (const entry of entries) {
    lines.push(
      String(entry.index),
      `${entry.startTime} --> ${entry.endTime}`,
      entry.text, // 原文
      entry.translatedText, // 译文
      '' // 空行分隔
    );
  }

  return lines.join('\n');
}

/**
 * 根据输出格式生成字幕文件
 * @param entries - 翻译后的字幕条目
 * @param format - 输出格式
 * @returns 单个或多个 SRT 文件内容
 */
export function generateSubtitles(
  entries: TranslatedEntry[],
  format: OutputFormat
): { mono?: string; bilingual?: string } {
  const result: { mono?: string; bilingual?: string } = {};

  if (format === 'mono' || format === 'both') {
    result.mono = generateMonolingualSRT(entries);
  }

  if (format === 'bilingual' || format === 'both') {
    result.bilingual = generateBilingualSRT(entries);
  }

  return result;
}

/**
 * 创建下载链接
 * @param content - 文件内容
 * @param filename - 文件名
 * @returns Blob URL
 */
export function createDownloadURL(
  content: string,
  filename: string
): { url: string; filename: string } {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  return { url, filename };
}

/**
 * 触发文件下载
 * @param content - 文件内容
 * @param filename - 文件名
 */
export function downloadSRT(content: string, filename: string): void {
  const { url, filename: fname } = createDownloadURL(content, filename);

  const link = document.createElement('a');
  link.href = url;
  link.download = fname;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // 释放 Blob URL
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * 生成建议的文件名
 * @param originalFilename - 原始文件名
 * @param targetLanguage - 目标语言
 * @param format - 输出格式
 * @returns 新文件名
 */
export function generateFilename(
  originalFilename: string,
  targetLanguage: string,
  format: 'mono' | 'bilingual'
): string {
  // 移除 .srt 扩展名
  const baseName = originalFilename.replace(/\.srt$/i, '');

  if (format === 'mono') {
    return `${baseName}_${targetLanguage}.srt`;
  } else {
    return `${baseName}_bilingual_${targetLanguage}.srt`;
  }
}
