'use client';

import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import { OutputFormat } from '@/lib/srt-generator';
import { useTranslationStore } from '@/store/translation-store';
import { cn } from '@/lib/utils';

export function OutputFormatSelector() {
  const t = useTranslations('output');
  const { outputFormat, setOutputFormat } = useTranslationStore();

  const formats: Array<{
    value: OutputFormat;
    label: string;
    description: string;
  }> = [
    {
      value: 'mono',
      label: t('monoSubtitle'),
      description: t('monoDescription'),
    },
    {
      value: 'bilingual',
      label: t('bilingualSubtitle'),
      description: t('bilingualDescription'),
    },
    {
      value: 'both',
      label: t('both'),
      description: t('bothDescription'),
    },
  ];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium mb-2">{t('title')}</label>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {formats.map((format) => (
          <button
            key={format.value}
            onClick={() => setOutputFormat(format.value)}
            className={cn(
              'relative border rounded-lg p-4 text-left transition-all hover:border-primary',
              outputFormat === format.value
                ? 'border-primary bg-primary/5'
                : 'border-border'
            )}
          >
            {outputFormat === format.value && (
              <div className="absolute top-2 right-2">
                <Check className="h-5 w-5 text-primary" />
              </div>
            )}

            <div className="font-medium mb-1">{format.label}</div>
            <div className="text-sm text-muted-foreground">
              {format.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
