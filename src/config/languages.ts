/**
 * 翻译语言配置
 * 这些是字幕翻译支持的语言（使用英文全称）
 * 用于语言对路由：/[locale]/[language-pair] (例如: /en/french-to-chinese)
 */

export const TRANSLATION_LANGUAGES = [
  'english',
  'chinese',
  'hindi',
  'spanish',
  'french',
  'arabic',
  'bengali',
  'portuguese',
  'russian',
  'urdu',
  'indonesian',
  'german',
  'japanese',
  'swahili',
  'marathi',
  'telugu',
  'turkish',
  'tamil',
  'vietnamese',
  'korean',
  'italian',
  'polish',
  'ukrainian',
  'malay',
  'thai',
  'dutch',
  'greek',
  'czech',
  'swedish',
  'romanian',
  'hungarian',
  'hebrew',
  'danish',
  'finnish',
  'norwegian',
  'slovak',
  'bulgarian',
  'croatian',
  'slovenian',
  'lithuanian',
  'latvian',
  'estonian',
  'persian',
  'filipino',
  'gujarati',
  'kannada',
  'burmese',
  'nepali',
  'sinhala',
  'kazakh',
] as const;

export type TranslationLanguage = (typeof TRANSLATION_LANGUAGES)[number];

/**
 * 翻译语言元数据
 */
export const LANGUAGE_DISPLAY_NAMES: Record<
  TranslationLanguage,
  {
    english: string; // 英文名称
    native: string; // 母语名称
    code: string; // ISO 639-1 代码（用于 OpenAI API）
  }
> = {
  english: { english: 'English', native: 'English', code: 'en' },
  chinese: { english: 'Chinese (Simplified)', native: '简体中文', code: 'zh' },
  hindi: { english: 'Hindi', native: 'हिन्दी', code: 'hi' },
  spanish: { english: 'Spanish', native: 'Español', code: 'es' },
  french: { english: 'French', native: 'Français', code: 'fr' },
  arabic: { english: 'Arabic', native: 'العربية', code: 'ar' },
  bengali: { english: 'Bengali', native: 'বাংলা', code: 'bn' },
  portuguese: { english: 'Portuguese', native: 'Português', code: 'pt' },
  russian: { english: 'Russian', native: 'Русский', code: 'ru' },
  urdu: { english: 'Urdu', native: 'اردو', code: 'ur' },
  indonesian: { english: 'Indonesian', native: 'Bahasa Indonesia', code: 'id' },
  german: { english: 'German', native: 'Deutsch', code: 'de' },
  japanese: { english: 'Japanese', native: '日本語', code: 'ja' },
  swahili: { english: 'Swahili', native: 'Kiswahili', code: 'sw' },
  marathi: { english: 'Marathi', native: 'मराठी', code: 'mr' },
  telugu: { english: 'Telugu', native: 'తెలుగు', code: 'te' },
  turkish: { english: 'Turkish', native: 'Türkçe', code: 'tr' },
  tamil: { english: 'Tamil', native: 'தமிழ்', code: 'ta' },
  vietnamese: { english: 'Vietnamese', native: 'Tiếng Việt', code: 'vi' },
  korean: { english: 'Korean', native: '한국어', code: 'ko' },
  italian: { english: 'Italian', native: 'Italiano', code: 'it' },
  polish: { english: 'Polish', native: 'Polski', code: 'pl' },
  ukrainian: { english: 'Ukrainian', native: 'Українська', code: 'uk' },
  malay: { english: 'Malay', native: 'Bahasa Melayu', code: 'ms' },
  thai: { english: 'Thai', native: 'ไทย', code: 'th' },
  dutch: { english: 'Dutch', native: 'Nederlands', code: 'nl' },
  greek: { english: 'Greek', native: 'Ελληνικά', code: 'el' },
  czech: { english: 'Czech', native: 'Čeština', code: 'cs' },
  swedish: { english: 'Swedish', native: 'Svenska', code: 'sv' },
  romanian: { english: 'Romanian', native: 'Română', code: 'ro' },
  hungarian: { english: 'Hungarian', native: 'Magyar', code: 'hu' },
  hebrew: { english: 'Hebrew', native: 'עברית', code: 'he' },
  danish: { english: 'Danish', native: 'Dansk', code: 'da' },
  finnish: { english: 'Finnish', native: 'Suomi', code: 'fi' },
  norwegian: { english: 'Norwegian', native: 'Norsk', code: 'no' },
  slovak: { english: 'Slovak', native: 'Slovenčina', code: 'sk' },
  bulgarian: { english: 'Bulgarian', native: 'Български', code: 'bg' },
  croatian: { english: 'Croatian', native: 'Hrvatski', code: 'hr' },
  slovenian: { english: 'Slovenian', native: 'Slovenščina', code: 'sl' },
  lithuanian: { english: 'Lithuanian', native: 'Lietuvių', code: 'lt' },
  latvian: { english: 'Latvian', native: 'Latviešu', code: 'lv' },
  estonian: { english: 'Estonian', native: 'Eesti', code: 'et' },
  persian: { english: 'Persian', native: 'فارسی', code: 'fa' },
  filipino: { english: 'Filipino', native: 'Filipino', code: 'fil' },
  gujarati: { english: 'Gujarati', native: 'ગુજરાતી', code: 'gu' },
  kannada: { english: 'Kannada', native: 'ಕನ್ನಡ', code: 'kn' },
  burmese: { english: 'Burmese', native: 'မြန်မာ', code: 'my' },
  nepali: { english: 'Nepali', native: 'नेपाली', code: 'ne' },
  sinhala: { english: 'Sinhala', native: 'සිංහල', code: 'si' },
  kazakh: { english: 'Kazakh', native: 'Қазақ', code: 'kk' },
};

/**
 * 验证翻译语言是否有效
 */
export function isValidTranslationLanguage(
  language: string
): language is TranslationLanguage {
  return TRANSLATION_LANGUAGES.includes(language as TranslationLanguage);
}

/**
 * 获取语言的 ISO 639-1 代码（用于 OpenAI API）
 */
export function getLanguageCode(language: TranslationLanguage): string {
  return LANGUAGE_DISPLAY_NAMES[language].code;
}

/**
 * 通过代码查找翻译语言
 */
export function findLanguageByCode(code: string): TranslationLanguage | null {
  const entry = Object.entries(LANGUAGE_DISPLAY_NAMES).find(
    ([, data]) => data.code === code
  );
  return entry ? (entry[0] as TranslationLanguage) : null;
}
