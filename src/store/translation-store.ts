/**
 * Zustand 状态管理
 * 管理翻译流程的全局状态
 */

import { create } from 'zustand';
import { TranslationLanguage } from '@/config/languages';
import { SubtitleEntry } from '@/lib/srt-parser';
import { TranslatedEntry, OutputFormat } from '@/lib/srt-generator';

export type TranslationStatus =
  | 'idle' // 空闲
  | 'parsing' // 解析文件
  | 'translating' // 翻译中
  | 'generating' // 生成文件
  | 'complete' // 完成
  | 'error'; // 错误

export interface TranslationState {
  // 文件相关
  file: File | null;
  filename: string;
  originalEntries: SubtitleEntry[];
  translatedEntries: TranslatedEntry[];

  // 语言选择
  sourceLanguage: TranslationLanguage | null;
  targetLanguage: TranslationLanguage | null;

  // 输出格式
  outputFormat: OutputFormat;

  // 翻译进度
  status: TranslationStatus;
  progress: number; // 0-100
  currentIndex: number; // 当前翻译到第几条
  totalCount: number; // 总共多少条

  // 错误信息
  error: string | null;

  // Actions
  setFile: (file: File) => void;
  setOriginalEntries: (entries: SubtitleEntry[]) => void;
  setSourceLanguage: (lang: TranslationLanguage) => void;
  setTargetLanguage: (lang: TranslationLanguage) => void;
  setOutputFormat: (format: OutputFormat) => void;
  setStatus: (status: TranslationStatus) => void;
  setProgress: (progress: number) => void;
  setCurrentIndex: (index: number) => void;
  setError: (error: string | null) => void;
  updateTranslatedEntry: (index: number, translatedText: string) => void;
  reset: () => void;
}

const initialState = {
  file: null,
  filename: '',
  originalEntries: [],
  translatedEntries: [],
  sourceLanguage: null,
  targetLanguage: null,
  outputFormat: 'mono' as OutputFormat,
  status: 'idle' as TranslationStatus,
  progress: 0,
  currentIndex: 0,
  totalCount: 0,
  error: null,
};

export const useTranslationStore = create<TranslationState>((set, get) => ({
  ...initialState,

  setFile: (file) => {
    set({
      file,
      filename: file?.name || '',
      error: null,
    });
  },

  setOriginalEntries: (entries) => {
    set({
      originalEntries: entries,
      translatedEntries: entries.map((entry) => ({
        ...entry,
        translatedText: '', // 初始化为空
      })),
      totalCount: entries.length,
      currentIndex: 0,
      progress: 0,
    });
  },

  setSourceLanguage: (lang) => {
    set({ sourceLanguage: lang, error: null });
  },

  setTargetLanguage: (lang) => {
    set({ targetLanguage: lang, error: null });
  },

  setOutputFormat: (format) => {
    set({ outputFormat: format });
  },

  setStatus: (status) => {
    set({ status });
  },

  setProgress: (progress) => {
    set({ progress: Math.min(100, Math.max(0, progress)) });
  },

  setCurrentIndex: (index) => {
    const { totalCount } = get();
    set({
      currentIndex: index,
      progress: totalCount > 0 ? Math.round((index / totalCount) * 100) : 0,
    });
  },

  setError: (error) => {
    set({
      error,
      status: error ? 'error' : get().status,
    });
  },

  updateTranslatedEntry: (index, translatedText) => {
    set((state) => {
      const newEntries = [...state.translatedEntries];
      if (newEntries[index]) {
        newEntries[index] = {
          ...newEntries[index],
          translatedText,
        };
      }
      return { translatedEntries: newEntries };
    });
  },

  reset: () => {
    set(initialState);
  },
}));
