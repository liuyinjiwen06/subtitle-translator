'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { FileUploader } from '@/components/FileUploader';
import { LanguageSelector } from '@/components/LanguageSelector';
import { OutputFormatSelector } from '@/components/OutputFormatSelector';
import { TranslationProgress } from '@/components/TranslationProgress';
import { DownloadButtons } from '@/components/DownloadButtons';
import { BenefitsSection } from '@/components/BenefitsSection';
import { HowToUseSection } from '@/components/HowToUseSection';
import { FAQSection } from '@/components/FAQSection';
import { Button } from '@/components/ui/button';
import { useTranslationStore } from '@/store/translation-store';
import { translateSubtitles } from '@/lib/translation-client';
import LanguageChanger from '@/components/LanguageChanger';

export default function HomePage() {
  const params = useParams();
  const currentLocale = (params?.locale as string) || 'en';
  const t = useTranslations('common');
  const tSteps = useTranslations('steps');
  const tFileInfo = useTranslations('fileInfo');
  const tError = useTranslations('errors');

  const {
    file,
    originalEntries,
    sourceLanguage,
    targetLanguage,
    status,
    error,
    setSourceLanguage,
    setTargetLanguage,
    setStatus,
    setCurrentIndex,
    setError,
    updateTranslatedEntry,
  } = useTranslationStore();

  // 开始翻译
  const handleStartTranslation = async () => {
    // 验证
    if (!file) {
      setError(tError('noFileSelected'));
      return;
    }

    if (!sourceLanguage || !targetLanguage) {
      setError(tError('noFileSelected'));
      return;
    }

    if (sourceLanguage === targetLanguage) {
      setError(tError('sameLanguage'));
      return;
    }

    if (originalEntries.length === 0) {
      setError(tError('invalidFile'));
      return;
    }

    // 开始翻译
    setStatus('translating');
    setError(null);

    const result = await translateSubtitles(
      originalEntries,
      sourceLanguage,
      targetLanguage,
      (current, total, translatedEntry) => {
        // 更新进度
        setCurrentIndex(current);
        updateTranslatedEntry(current - 1, translatedEntry.translatedText);
      }
    );

    if (!result.success) {
      setError(result.error || tError('apiError'));
      setStatus('error');
      return;
    }

    // 翻译完成
    setStatus('complete');
  };

  const canTranslate =
    file &&
    originalEntries.length > 0 &&
    sourceLanguage &&
    targetLanguage &&
    sourceLanguage !== targetLanguage &&
    status !== 'translating';

  return (
    <main className="flex-1 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* 语言切换器 - 右上角 */}
          <div className="flex justify-end mb-4">
            <LanguageChanger currentLocale={currentLocale} />
          </div>

          {/* 标题 */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {t('title')}
            </h1>
            <p className="text-xl text-gray-600">{t('description')}</p>
          </div>

          {/* 主要内容 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
            {/* 错误提示 */}
            {error && status === 'error' && (
            <div className="border border-destructive/50 rounded-lg p-4 bg-destructive/10">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="h-5 w-5 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-destructive mb-1">{tError('title')}</h3>
                  <p className="text-sm text-destructive/90 whitespace-pre-wrap">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="mt-2 text-sm underline text-destructive hover:no-underline"
                  >
                    {t('dismiss')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 步骤 1: 上传文件 */}
          <div>
            <h2 className="text-lg font-semibold mb-4">
              {tSteps('step1')}: {tSteps('uploadFile')}
            </h2>
            <FileUploader />
          </div>

          {/* 步骤 2: 选择语言 */}
          {file && originalEntries.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">
                {tSteps('step2')}: {tSteps('selectLanguages')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LanguageSelector
                  type="source"
                  value={sourceLanguage}
                  onChange={setSourceLanguage}
                  excludeLanguage={targetLanguage}
                />
                <LanguageSelector
                  type="target"
                  value={targetLanguage}
                  onChange={setTargetLanguage}
                  excludeLanguage={sourceLanguage}
                />
              </div>
            </div>
          )}

          {/* 步骤 3: 选择输出格式 */}
          {sourceLanguage && targetLanguage && (
            <div>
              <h2 className="text-lg font-semibold mb-4">
                {tSteps('step3')}: {tSteps('selectFormat')}
              </h2>
              <OutputFormatSelector />
            </div>
          )}

          {/* 开始翻译按钮 */}
          {canTranslate && status !== 'complete' && (
            <div className="flex justify-center pt-4">
              <Button
                size="lg"
                onClick={handleStartTranslation}
                disabled={!canTranslate}
              >
                {t('translate')}
              </Button>
            </div>
          )}

          {/* 翻译进度 */}
          <TranslationProgress />

          {/* 下载按钮 */}
          <DownloadButtons />

          {/* 文件信息 */}
          {file && originalEntries.length > 0 && (
            <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
              <p>
                {tFileInfo('fileName')}: <span className="font-medium">{file.name}</span>
              </p>
              <p>
                {tFileInfo('subtitleCount')}:{' '}
                <span className="font-medium">{originalEntries.length}</span>
              </p>
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Information Sections */}
      <div className="container mx-auto px-4 pb-12">
        <BenefitsSection />
        <HowToUseSection />
        <FAQSection />
      </div>
    </main>
  );
}
