/**
 * 语言对配置
 * 用于生成语言对页面：/[locale]/[language-pair]
 */

import {
  TRANSLATION_LANGUAGES,
  TranslationLanguage,
} from './languages';

/**
 * 语言对类型
 */
export interface LanguagePair {
  source: TranslationLanguage;
  target: TranslationLanguage;
  slug: string; // URL slug: "french-to-chinese"
}

/**
 * 生成所有可能的语言对
 * 不包括相同语言的翻译（如 english-to-english）
 * 总数：50 × 49 = 2,450 个语言对
 */
export function generateAllLanguagePairs(): LanguagePair[] {
  const pairs: LanguagePair[] = [];

  for (const source of TRANSLATION_LANGUAGES) {
    for (const target of TRANSLATION_LANGUAGES) {
      if (source !== target) {
        pairs.push({
          source,
          target,
          slug: `${source}-to-${target}`,
        });
      }
    }
  }

  return pairs;
}

/**
 * 从 URL slug 解析语言对
 * @param slug - 例如: "french-to-chinese"
 * @returns 语言对对象或 null（如果无效）
 */
export function parseLanguagePairSlug(
  slug: string
): LanguagePair | null {
  const match = slug.match(/^(\w+)-to-(\w+)$/);
  if (!match) return null;

  const [, source, target] = match;

  const isSourceValid = TRANSLATION_LANGUAGES.includes(
    source as TranslationLanguage
  );
  const isTargetValid = TRANSLATION_LANGUAGES.includes(
    target as TranslationLanguage
  );

  if (!isSourceValid || !isTargetValid) {
    return null;
  }

  if (source === target) {
    return null; // 不允许相同语言翻译
  }

  return {
    source: source as TranslationLanguage,
    target: target as TranslationLanguage,
    slug,
  };
}

/**
 * 创建语言对 slug
 */
export function createLanguagePairSlug(
  source: TranslationLanguage,
  target: TranslationLanguage
): string {
  return `${source}-to-${target}`;
}

/**
 * 验证语言对 slug 是否有效
 */
export function isValidLanguagePairSlug(slug: string): boolean {
  return parseLanguagePairSlug(slug) !== null;
}

/**
 * 获取流行的语言对（用于预渲染）
 * 这些是最常用的翻译组合
 */
export const POPULAR_LANGUAGE_PAIRS: LanguagePair[] = [
  // 英语相关
  { source: 'english', target: 'chinese', slug: 'english-to-chinese' },
  { source: 'english', target: 'spanish', slug: 'english-to-spanish' },
  { source: 'english', target: 'french', slug: 'english-to-french' },
  { source: 'english', target: 'german', slug: 'english-to-german' },
  { source: 'english', target: 'japanese', slug: 'english-to-japanese' },
  { source: 'english', target: 'korean', slug: 'english-to-korean' },
  { source: 'english', target: 'portuguese', slug: 'english-to-portuguese' },
  { source: 'english', target: 'russian', slug: 'english-to-russian' },
  { source: 'english', target: 'arabic', slug: 'english-to-arabic' },
  { source: 'english', target: 'hindi', slug: 'english-to-hindi' },

  // 中文相关
  { source: 'chinese', target: 'english', slug: 'chinese-to-english' },
  { source: 'chinese', target: 'japanese', slug: 'chinese-to-japanese' },
  { source: 'chinese', target: 'korean', slug: 'chinese-to-korean' },

  // 西班牙语相关
  { source: 'spanish', target: 'english', slug: 'spanish-to-english' },
  { source: 'spanish', target: 'portuguese', slug: 'spanish-to-portuguese' },

  // 法语相关
  { source: 'french', target: 'english', slug: 'french-to-english' },
  { source: 'french', target: 'spanish', slug: 'french-to-spanish' },

  // 德语相关
  { source: 'german', target: 'english', slug: 'german-to-english' },

  // 日语相关
  { source: 'japanese', target: 'english', slug: 'japanese-to-english' },
  { source: 'japanese', target: 'chinese', slug: 'japanese-to-chinese' },

  // 韩语相关
  { source: 'korean', target: 'english', slug: 'korean-to-english' },
  { source: 'korean', target: 'chinese', slug: 'korean-to-chinese' },
];
