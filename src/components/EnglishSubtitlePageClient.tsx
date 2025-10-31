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
import { UseCasesSection } from '@/components/UseCasesSection';
import { LinguisticExplanationSection } from '@/components/LinguisticExplanationSection';
import { Button } from '@/components/ui/button';
import { useTranslationStore } from '@/store/translation-store';
import { translateSubtitles } from '@/lib/translation-client';
import LanguageChanger from '@/components/LanguageChanger';

export function EnglishSubtitlePageClient() {
  const params = useParams();
  const currentLocale = (params?.locale as string) || 'en';
  const t = useTranslations('common');
  const tPage = useTranslations('englishSubtitle');
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
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* 语言切换器 - 右上角 */}
          <div className="flex justify-end mb-4">
            <LanguageChanger currentLocale={currentLocale} />
          </div>

          {/* 标题 - 包含 SRT 关键词 */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
              {tPage('hero.title')}
            </h1>
            <p className="text-xl text-gray-600">{tPage('hero.subtitle')}</p>
          </div>

          {/* 翻译功能区 */}
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
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
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

      {/* 文案内容区域 */}
      <div className="container mx-auto px-4 pb-12">
        {/* Use Cases Section */}
        <UseCasesSection />

        {/* Linguistic Explanation Section */}
        <LinguisticExplanationSection />

        {/* 原有的 Benefits, How to Use, FAQ sections */}
        <BenefitsSection />
        <HowToUseSection />
        <FAQSection />
      </div>
    </main>
  );
}
