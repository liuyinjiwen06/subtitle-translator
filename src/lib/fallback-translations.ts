// Fallback translations for critical errors
export const fallbackTranslations: Record<string, any> = {
  en: {
    homepage: {
      meta: {
        title: "Free SRT Translator - Translate Subtitle Files Online | SubTran",
        description: "Free online SRT translator to translate subtitle files instantly."
      },
      hero: {
        headline: "Translate SRT Subtitle Files Instantly",
        subheadline: "Professional subtitle translator supporting 30+ languages.",
        features: [
          "Free Forever - No hidden costs or subscriptions",
          "31 Languages - From English to Chinese, Spanish, French and more",
          "Two AI Engines - Choose between Google Translate and OpenAI",
          "Instant Download - Get your translated SRT file immediately"
        ]
      }
    },
    title: "SubTran - Free SRT Translator",
    description: "Free online SRT subtitle translator",
    app_name: "SubTran",
    app_description: "Free online SRT subtitle translator",
    upload: "Upload",
    select_language: "Select Language",
    select_translation_service: "Select Translation Service",
    translate: "Translate",
    translating: "Translating",
    translation_progress: "Translation Progress",
    download: "Download",
    file_selected: "File Selected",
    upload_or_drag_drop: "Upload or Drag & Drop",
    srt_files_only: "SRT files only",
    select_file: "Select File",
    target_language: "Target Language",
    translation_service: "Translation Service",
    please_upload_file_first: "Please upload a file first",
    translation_failed: "Translation failed",
    cannot_read_response: "Cannot read response",  
    please_select_srt_file: "Please select an SRT file",
    languages: {
      english: "English",
      chinese: "Chinese",
      japanese: "Japanese",
      french: "French",
      german: "German",
      spanish: "Spanish",
      russian: "Russian",
      italian: "Italian",
      portuguese: "Portuguese",
      arabic: "Arabic",
      hindi: "Hindi",
      korean: "Korean",
      thai: "Thai",
      vietnamese: "Vietnamese",
      turkish: "Turkish",
      polish: "Polish",
      dutch: "Dutch",
      swedish: "Swedish",
      danish: "Danish",
      norwegian: "Norwegian",
      finnish: "Finnish",
      czech: "Czech",
      hungarian: "Hungarian",
      romanian: "Romanian",
      bulgarian: "Bulgarian",
      croatian: "Croatian",
      slovak: "Slovak",
      slovenian: "Slovenian",
      estonian: "Estonian",
      latvian: "Latvian",
      lithuanian: "Lithuanian"
    },
    translation_services: {
      google: "Google Translate",
      openai: "OpenAI GPT"
    },
    seo: {
      keywords: "subtitle translator, SRT translator, free translation, subtitle converter"
    }
  }
};

// 提供一个安全的获取函数
export function getFallbackTranslation(locale: string = 'en'): any {
  return fallbackTranslations[locale] || fallbackTranslations.en;
}