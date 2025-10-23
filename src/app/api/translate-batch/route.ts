// 批量翻译API - 处理大文件时分批进行
import { NextRequest, NextResponse } from "next/server";


const BATCH_SIZE = 20; // 每批翻译20行
const BATCH_TIMEOUT = 20000; // 每批20秒超时

export async function POST(request: NextRequest) {
  try {
    const { 
      content, 
      targetLang, 
      translationService = 'google',
      batchIndex = 0,
      totalBatches = 1 
    } = await request.json();

    if (!content || !targetLang) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // 解析SRT内容
    const lines = content.split('\n');
    const textLines = lines.filter((line: string, index: number) => {
      const trimmed = line.trim();
      return trimmed !== "" && 
             !/^\d+$/.test(trimmed) && 
             !/^\d{2}:\d{2}:\d{2}/.test(trimmed);
    });

    // 计算批次
    const totalTextLines = textLines.length;
    const actualTotalBatches = Math.ceil(totalTextLines / BATCH_SIZE);
    
    // 获取当前批次的行
    const startIndex = batchIndex * BATCH_SIZE;
    const endIndex = Math.min(startIndex + BATCH_SIZE, totalTextLines);
    const batchLines = textLines.slice(startIndex, endIndex);

    console.log(`[Batch Translation] Batch ${batchIndex + 1}/${actualTotalBatches}, Lines ${startIndex + 1}-${endIndex} of ${totalTextLines}`);

    // 翻译当前批次
    const translatedBatch = [];
    for (const line of batchLines) {
      try {
        // 这里调用现有的翻译函数
        const response = await fetch(new URL('/api/translate', request.url), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: line,
            targetLang,
            translationService
          }),
          signal: AbortSignal.timeout(BATCH_TIMEOUT)
        });

        if (!response.ok) {
          throw new Error(`Translation failed: ${response.statusText}`);
        }

        const result = await response.json();
        translatedBatch.push(result.translatedText);
      } catch (error) {
        console.error(`[Batch Translation Error] Line: "${line.substring(0, 50)}..."`, error);
        // 失败时保留原文
        translatedBatch.push(line);
      }
    }

    return NextResponse.json({
      success: true,
      batchIndex,
      totalBatches: actualTotalBatches,
      translatedLines: translatedBatch,
      startIndex,
      endIndex,
      isComplete: endIndex >= totalTextLines
    });

  } catch (error) {
    console.error('[Batch Translation Error]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Translation failed" },
      { status: 500 }
    );
  }
}