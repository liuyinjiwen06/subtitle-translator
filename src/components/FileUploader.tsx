'use client';

import { useCallback, useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Upload, X, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { useTranslationStore } from '@/store/translation-store';
import { parseSRTFile } from '@/lib/srt-parser';
import { formatFileSize } from '@/lib/utils';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function FileUploader() {
  const t = useTranslations('upload');
  const tError = useTranslations('errors');

  const { file, setFile, setOriginalEntries, setError, setStatus } =
    useTranslationStore();

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (selectedFile: File | null) => {
      if (!selectedFile) return;

      // 验证文件类型
      if (!selectedFile.name.toLowerCase().endsWith('.srt')) {
        setError(tError('invalidFile'));
        return;
      }

      // 验证文件大小
      if (selectedFile.size > MAX_FILE_SIZE) {
        setError(tError('fileTooLarge'));
        return;
      }

      // 设置文件
      setFile(selectedFile);
      setStatus('parsing');
      setError(null);

      // 解析 SRT 文件
      const result = await parseSRTFile(selectedFile);

      if (!result.success) {
        setError(result.error || tError('invalidFile'));
        setStatus('error');
        return;
      }

      // 保存解析结果
      setOriginalEntries(result.entries);
      setStatus('idle');
    },
    [setFile, setOriginalEntries, setError, setStatus, tError]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files[0];
      handleFile(droppedFile);
    },
    [handleFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      handleFile(selectedFile || null);
      // Reset the input value so the same file can be selected again
      if (e.target) {
        e.target.value = '';
      }
    },
    [handleFile]
  );

  const handleBrowseClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRemove = useCallback(() => {
    setFile(null);
    setOriginalEntries([]);
    setError(null);
    setStatus('idle');
  }, [setFile, setOriginalEntries, setError, setStatus]);

  return (
    <div className="w-full">
      {!file ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />

          <p className="text-lg font-medium mb-2">{t('dragDrop')}</p>

          <p className="text-sm text-muted-foreground mb-4">{t('or')}</p>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".srt"
              className="hidden"
              onChange={handleFileInput}
            />
            <Button
              variant="outline"
              type="button"
              onClick={handleBrowseClick}
            >
              {t('browse')}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-4">{t('maxSize')}</p>
          <p className="text-xs text-muted-foreground">
            {t('formatSupport')}
          </p>
        </div>
      ) : (
        <div className="border rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(file.size)}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            title={t('remove')}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
