'use client';

import { useTranslations } from 'next-intl';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Progress } from './ui/progress';
import { useTranslationStore } from '@/store/translation-store';

export function TranslationProgress() {
  const t = useTranslations('progress');
  const tSuccess = useTranslations('success');

  const { status, progress, currentIndex, totalCount, error } =
    useTranslationStore();

  if (status === 'idle') return null;

  return (
    <div className="w-full border rounded-lg p-6 space-y-4">
      {/* 状态标题 */}
      <div className="flex items-center gap-3">
        {status === 'parsing' && (
          <>
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="font-medium">{t('parsing')}</span>
          </>
        )}

        {status === 'translating' && (
          <>
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="font-medium">
              {t('translating', { current: currentIndex, total: totalCount })}
            </span>
          </>
        )}

        {status === 'generating' && (
          <>
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="font-medium">{t('generating')}</span>
          </>
        )}

        {status === 'complete' && (
          <>
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span className="font-medium text-green-600">
              {tSuccess('translationComplete')}
            </span>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="h-5 w-5 text-destructive" />
            <span className="font-medium text-destructive">
              {error || 'An error occurred'}
            </span>
          </>
        )}
      </div>

      {/* 进度条 */}
      {(status === 'parsing' ||
        status === 'translating' ||
        status === 'generating') && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-muted-foreground text-right">
            {progress}%
          </p>
        </div>
      )}

      {/* 详细信息 */}
      {status === 'translating' && totalCount > 0 && (
        <p className="text-sm text-muted-foreground">
          Processing {currentIndex} of {totalCount} subtitle entries...
        </p>
      )}
    </div>
  );
}
