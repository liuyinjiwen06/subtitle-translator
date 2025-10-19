'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { Button } from './ui/button';
import {
  TRANSLATION_LANGUAGES,
  LANGUAGE_DISPLAY_NAMES,
  TranslationLanguage,
} from '@/config/languages';
import { cn } from '@/lib/utils';

interface LanguageSelectorProps {
  value: TranslationLanguage | null;
  onChange: (language: TranslationLanguage) => void;
  type: 'source' | 'target'; // 类型：源语言或目标语言
  excludeLanguage?: TranslationLanguage | null; // 排除某个语言（避免源和目标相同）
}

export function LanguageSelector({
  value,
  onChange,
  type,
  excludeLanguage,
}: LanguageSelectorProps) {
  const t = useTranslations('language');
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 过滤语言列表
  const filteredLanguages = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return TRANSLATION_LANGUAGES.filter((lang) => {
      // 排除特定语言
      if (excludeLanguage && lang === excludeLanguage) {
        return false;
      }

      // 搜索匹配
      const displayName = LANGUAGE_DISPLAY_NAMES[lang];
      return (
        displayName.english.toLowerCase().includes(query) ||
        displayName.native.toLowerCase().includes(query) ||
        lang.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, excludeLanguage]);

  const selectedLanguage = value
    ? LANGUAGE_DISPLAY_NAMES[value]
    : null;

  const handleSelect = (lang: TranslationLanguage) => {
    onChange(lang);
    setIsOpen(false);
    setSearchQuery('');
  };

  const label = type === 'source' ? t('source') : t('target');

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-2">{label}</label>

      <Button
        variant="outline"
        role="combobox"
        aria-expanded={isOpen}
        className="w-full justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedLanguage ? (
          <span>
            {selectedLanguage.native} ({selectedLanguage.english})
          </span>
        ) : (
          <span className="text-muted-foreground">
            {t('selectPlaceholder')}
          </span>
        )}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg">
          {/* 搜索框 */}
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* 语言列表 */}
          <div className="max-h-80 overflow-y-auto p-1">
            {filteredLanguages.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No languages found
              </div>
            ) : (
              filteredLanguages.map((lang) => {
                const displayName = LANGUAGE_DISPLAY_NAMES[lang];
                const isSelected = value === lang;

                return (
                  <button
                    key={lang}
                    onClick={() => handleSelect(lang)}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-accent',
                      isSelected && 'bg-accent'
                    )}
                  >
                    <Check
                      className={cn(
                        'h-4 w-4',
                        isSelected ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <span className="flex-1 text-left">
                      <span className="font-medium">{displayName.native}</span>
                      <span className="text-muted-foreground ml-2">
                        {displayName.english}
                      </span>
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 点击外部关闭下拉菜单 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsOpen(false);
            setSearchQuery('');
          }}
        />
      )}
    </div>
  );
}
