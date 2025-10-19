/**
 * SRT 字幕解析器
 * 解析 .srt 格式的字幕文件
 */

export interface SubtitleEntry {
  index: number; // 字幕序号
  startTime: string; // 开始时间 (HH:MM:SS,mmm)
  endTime: string; // 结束时间 (HH:MM:SS,mmm)
  text: string; // 字幕文本（可能多行）
}

export interface ParseResult {
  success: boolean;
  entries: SubtitleEntry[];
  error?: string;
}

/**
 * 验证时间戳格式（支持多种格式）
 * 支持的格式:
 * - HH:MM:SS,mmm (标准SRT格式)
 * - HH:MM:SS.mmm (WebVTT格式)
 * - HH:MM:SS (无毫秒)
 * - H:MM:SS,mmm (小时数可以是1位)
 */
function isValidTimestamp(timestamp: string): boolean {
  // 支持逗号或点号作为毫秒分隔符，毫秒可选
  const regex = /^\d{1,2}:\d{2}:\d{2}([.,]\d{1,3})?$/;
  return regex.test(timestamp);
}

/**
 * 标准化时间戳格式
 * 统一转换为 HH:MM:SS,mmm 格式
 */
function normalizeTimestamp(timestamp: string): string {
  // 替换点号为逗号
  let normalized = timestamp.replace('.', ',');

  // 如果没有毫秒，添加 ,000
  if (!normalized.includes(',')) {
    normalized += ',000';
  }

  // 确保毫秒是3位数
  const parts = normalized.split(',');
  if (parts[1] && parts[1].length < 3) {
    parts[1] = parts[1].padEnd(3, '0');
  }

  // 确保小时是2位数
  const timeParts = parts[0].split(':');
  if (timeParts[0].length === 1) {
    timeParts[0] = '0' + timeParts[0];
  }

  return timeParts.join(':') + (parts[1] ? ',' + parts[1] : ',000');
}

/**
 * 解析时间范围行
 * 格式: 00:00:01,000 --> 00:00:03,500
 * 也支持: 00:00:01.000 -> 00:00:03.500
 */
function parseTimeLine(line: string): { start: string; end: string } | null {
  // 支持 --> 或 -> 作为分隔符
  const parts = line.split(/-->|->/).map((s) => s.trim());
  if (parts.length !== 2) return null;

  const [start, end] = parts;
  if (!isValidTimestamp(start) || !isValidTimestamp(end)) {
    return null;
  }

  return {
    start: normalizeTimestamp(start),
    end: normalizeTimestamp(end)
  };
}

/**
 * 解析 SRT 文件内容
 * @param content - SRT 文件的文本内容
 * @returns 解析结果
 */
export function parseSRT(content: string): ParseResult {
  try {
    // 标准化换行符
    const normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // 按空行分割字幕块
    const blocks = normalized.split(/\n\n+/).filter((block) => block.trim());

    if (blocks.length === 0) {
      return {
        success: false,
        entries: [],
        error: 'No subtitle entries found in file',
      };
    }

    const entries: SubtitleEntry[] = [];
    const errors: string[] = [];

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const lines = block.split('\n').map((line) => line.trim()).filter(line => line);

      // 至少需要 3 行：序号、时间、文本
      if (lines.length < 3) {
        errors.push(`Block ${i + 1}: Too few lines (${lines.length})`);
        continue;
      }

      // 第一行：序号（可能包含BOM或其他字符）
      const indexLine = lines[0].replace(/^\uFEFF/, ''); // 移除BOM
      const index = parseInt(indexLine, 10);
      if (isNaN(index)) {
        errors.push(`Block ${i + 1}: Invalid index "${indexLine}"`);
        continue;
      }

      // 第二行：时间范围
      const timeLine = parseTimeLine(lines[1]);
      if (!timeLine) {
        errors.push(`Block ${i + 1}: Invalid time format "${lines[1]}"`);
        continue;
      }

      // 剩余行：字幕文本
      const text = lines.slice(2).join('\n');

      if (!text.trim()) {
        errors.push(`Block ${i + 1}: Empty subtitle text`);
        continue;
      }

      entries.push({
        index,
        startTime: timeLine.start,
        endTime: timeLine.end,
        text,
      });
    }

    if (entries.length === 0) {
      return {
        success: false,
        entries: [],
        error: `No valid subtitle entries found. Errors:\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? `\n... and ${errors.length - 5} more errors` : ''}`,
      };
    }

    // 按序号排序
    entries.sort((a, b) => a.index - b.index);

    return {
      success: true,
      entries,
    };
  } catch (error) {
    return {
      success: false,
      entries: [],
      error: error instanceof Error ? error.message : 'Unknown parsing error',
    };
  }
}

/**
 * 验证 SRT 文件格式
 * @param content - 文件内容
 * @returns 是否为有效的 SRT 格式
 */
export function isValidSRT(content: string): boolean {
  const result = parseSRT(content);
  return result.success && result.entries.length > 0;
}

/**
 * 从文件对象读取并解析 SRT
 * @param file - File 对象
 * @returns Promise<ParseResult>
 */
export async function parseSRTFile(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) {
        resolve({
          success: false,
          entries: [],
          error: 'Failed to read file content',
        });
        return;
      }

      resolve(parseSRT(content));
    };

    reader.onerror = () => {
      resolve({
        success: false,
        entries: [],
        error: 'Failed to read file',
      });
    };

    reader.readAsText(file, 'UTF-8');
  });
}
