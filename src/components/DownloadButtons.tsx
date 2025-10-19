'use client';

import { useTranslations } from 'next-intl';
import { Download } from 'lucide-react';
import { Button } from './ui/button';
import { useTranslationStore } from '@/store/translation-store';
import {
  generateSubtitles,
  downloadSRT,
  generateFilename,
} from '@/lib/srt-generator';
import { getLanguageCode } from '@/config/languages';

export function DownloadButtons() {
  const t = useTranslations('common');
  const tSuccess = useTranslations('success');

  const {
    status,
    translatedEntries,
    outputFormat,
    filename,
    targetLanguage,
  } = useTranslationStore();

  if (status !== 'complete') return null;

  const handleDownload = () => {
    if (!targetLanguage) return;

    const subtitles = generateSubtitles(translatedEntries, outputFormat);
    const targetCode = getLanguageCode(targetLanguage);

    // 下载单语字幕
    if (subtitles.mono) {
      const monoFilename = generateFilename(filename, targetCode, 'mono');
      downloadSRT(subtitles.mono, monoFilename);
    }

    // 下载双语字幕
    if (subtitles.bilingual) {
      const bilingualFilename = generateFilename(
        filename,
        targetCode,
        'bilingual'
      );
      downloadSRT(subtitles.bilingual, bilingualFilename);
    }
  };

  return (
    <div className="border rounded-lg p-6 bg-green-50 dark:bg-green-950/20">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-green-900 dark:text-green-100 mb-1">
            {tSuccess('translationComplete')}
          </h3>
          <p className="text-sm text-green-700 dark:text-green-300">
            {tSuccess('downloadReady')}
          </p>
        </div>

        <Button onClick={handleDownload} className="gap-2">
          <Download className="h-4 w-4" />
          {t('download')}
        </Button>
      </div>
    </div>
  );
}
