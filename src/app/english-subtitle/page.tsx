import { Metadata } from 'next';
import ServerPageTemplate from '@/components/ServerPageTemplate';
import { getPageConfig } from '@/lib/pageConfig';
import { headers } from 'next/headers';

// 获取用户语言偏好的函数
async function getUserLanguage(): Promise<string> {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || '';
  
  // 检查各种语言
  if (acceptLanguage.includes('zh')) {
    return 'zh';
  }
  if (acceptLanguage.includes('ja')) {
    return 'ja';
  }
  if (acceptLanguage.includes('fr')) {
    return 'fr';
  }
  if (acceptLanguage.includes('de')) {
    return 'de';
  }
  if (acceptLanguage.includes('es')) {
    return 'es';
  }
  if (acceptLanguage.includes('it')) {
    return 'it';
  }
  if (acceptLanguage.includes('ru')) {
    return 'ru';
  }
  // 默认返回英文
  return 'en';
}

// 多语言metadata配置
const metadataConfig = {
  en: {
    title: 'English Subtitle Translator - Free Online Translation Tool',
    description: 'Professional English subtitle translation service. Convert subtitles to English with AI-powered translation. Free, fast, and accurate SRT file translation.',
    keywords: 'english subtitle translation, srt to english, subtitle converter, ai translation, free subtitle translator',
    ogTitle: 'English Subtitle Translator - Free Online Translation Tool',
    ogDescription: 'Professional English subtitle translation service. Convert subtitles to English with AI-powered translation.',
    structuredDataName: 'English Subtitle Translator',
    structuredDataDescription: 'Professional English subtitle translation service. Convert subtitles to English with AI-powered translation.',
    featureList: [
      "Subtitle translation to English",
      "SRT file support", 
      "AI-powered translation",
      "Free online tool"
    ]
  },
  zh: {
    title: '英文字幕翻译工具 - 免费在线翻译字幕到英语',
    description: '专业的英文字幕翻译服务，支持多种语言翻译到英语。上传SRT字幕文件，AI智能翻译成英文字幕，完全免费使用。',
    keywords: '英文字幕翻译,翻译成英语,SRT英文翻译,字幕英语翻译,在线英文翻译,免费英语字幕',
    ogTitle: '英文字幕翻译工具 - 免费在线翻译字幕到英语',
    ogDescription: '专业的英文字幕翻译服务，支持多种语言翻译到英语。AI智能翻译，完全免费。',
    structuredDataName: '英文字幕翻译工具',
    structuredDataDescription: '专业的英文字幕翻译服务，支持多种语言翻译到英语。',
    featureList: [
      "字幕翻译至英文",
      "SRT文件支持",
      "AI智能翻译",
      "免费在线工具"
    ]
  },
  ja: {
    title: '英語字幕翻訳ツール - 無料オンライン字幕翻訳',
    description: 'プロフェッショナルな英語字幕翻訳サービス。AI技術で字幕を英語に翻訳。SRTファイル対応、無料、高速、正確。',
    keywords: '英語字幕翻訳,英語翻訳,SRT英語翻訳,字幕英語翻訳,オンライン英語翻訳,無料英語字幕',
    ogTitle: '英語字幕翻訳ツール - 無料オンライン字幕翻訳',
    ogDescription: 'プロフェッショナルな英語字幕翻訳サービス。AI技術で字幕を英語に翻訳。',
    structuredDataName: '英語字幕翻訳ツール',
    structuredDataDescription: 'プロフェッショナルな英語字幕翻訳サービス。AI技術で字幕を英語に翻訳。',
    featureList: [
      "英語字幕翻訳",
      "SRTファイル対応",
      "AI翻訳技術",
      "無料オンラインツール"
    ]
  },
  fr: {
    title: 'Traducteur de Sous-titres Anglais - Outil de Traduction Gratuit',
    description: 'Service professionnel de traduction de sous-titres anglais. Convertissez les sous-titres en anglais avec la traduction alimentée par l\'IA. Gratuit, rapide et précis.',
    keywords: 'traduction sous-titres anglais, srt vers anglais, convertisseur sous-titres, traduction ia, traducteur sous-titres gratuit',
    ogTitle: 'Traducteur de Sous-titres Anglais - Outil de Traduction Gratuit',
    ogDescription: 'Service professionnel de traduction de sous-titres anglais. Convertissez les sous-titres en anglais avec la traduction alimentée par l\'IA.',
    structuredDataName: 'Traducteur de Sous-titres Anglais',
    structuredDataDescription: 'Service professionnel de traduction de sous-titres anglais. Convertissez les sous-titres en anglais avec la traduction alimentée par l\'IA.',
    featureList: [
      "Traduction de sous-titres vers l'anglais",
      "Support de fichiers SRT",
      "Traduction alimentée par l'IA",
      "Outil en ligne gratuit"
    ]
  },
  de: {
    title: 'Englischer Untertitel-Übersetzer - Kostenloses Online-Übersetzungstool',
    description: 'Professioneller englischer Untertitel-Übersetzungsservice. Konvertieren Sie Untertitel ins Englische mit KI-gestützter Übersetzung. Kostenlos, schnell und genau.',
    keywords: 'englische untertitel übersetzung, srt zu englisch, untertitel konverter, ki übersetzung, kostenloser untertitel übersetzer',
    ogTitle: 'Englischer Untertitel-Übersetzer - Kostenloses Online-Übersetzungstool',
    ogDescription: 'Professioneller englischer Untertitel-Übersetzungsservice. Konvertieren Sie Untertitel ins Englische mit KI-gestützter Übersetzung.',
    structuredDataName: 'Englischer Untertitel-Übersetzer',
    structuredDataDescription: 'Professioneller englischer Untertitel-Übersetzungsservice. Konvertieren Sie Untertitel ins Englische mit KI-gestützter Übersetzung.',
    featureList: [
      "Untertitel-Übersetzung ins Englische",
      "SRT-Datei-Unterstützung",
      "KI-gestützte Übersetzung",
      "Kostenloses Online-Tool"
    ]
  },
  es: {
    title: 'Traductor de Subtítulos al Inglés - Herramienta de Traducción Gratuita',
    description: 'Servicio profesional de traducción de subtítulos al inglés. Convierte subtítulos al inglés con traducción impulsada por IA. Gratis, rápido y preciso.',
    keywords: 'traducción subtítulos inglés, srt a inglés, convertidor subtítulos, traducción ia, traductor subtítulos gratis',
    ogTitle: 'Traductor de Subtítulos al Inglés - Herramienta de Traducción Gratuita',
    ogDescription: 'Servicio profesional de traducción de subtítulos al inglés. Convierte subtítulos al inglés con traducción impulsada por IA.',
    structuredDataName: 'Traductor de Subtítulos al Inglés',
    structuredDataDescription: 'Servicio profesional de traducción de subtítulos al inglés. Convierte subtítulos al inglés con traducción impulsada por IA.',
    featureList: [
      "Traducción de subtítulos al inglés",
      "Soporte de archivos SRT",
      "Traducción impulsada por IA",
      "Herramienta en línea gratuita"
    ]
  },
  it: {
    title: 'Traduttore di Sottotitoli in Inglese - Strumento di Traduzione Gratuito',
    description: 'Servizio professionale di traduzione sottotitoli in inglese. Converti i sottotitoli in inglese con traduzione alimentata da IA. Gratuito, veloce e preciso.',
    keywords: 'traduzione sottotitoli inglese, srt in inglese, convertitore sottotitoli, traduzione ia, traduttore sottotitoli gratuito',
    ogTitle: 'Traduttore di Sottotitoli in Inglese - Strumento di Traduzione Gratuito',
    ogDescription: 'Servizio professionale di traduzione sottotitoli in inglese. Converti i sottotitoli in inglese con traduzione alimentata da IA.',
    structuredDataName: 'Traduttore di Sottotitoli in Inglese',
    structuredDataDescription: 'Servizio professionale di traduzione sottotitoli in inglese. Converti i sottotitoli in inglese con traduzione alimentata da IA.',
    featureList: [
      "Traduzione sottotitoli in inglese",
      "Supporto file SRT",
      "Traduzione alimentata da IA",
      "Strumento online gratuito"
    ]
  },
  ru: {
    title: 'Переводчик Субтитров на Английский - Бесплатный Онлайн Инструмент',
    description: 'Профессиональный сервис перевода субтитров на английский. Конвертируйте субтитры в английский с помощью ИИ-перевода. Бесплатно, быстро и точно.',
    keywords: 'перевод субтитров английский, srt в английский, конвертер субтитров, ии перевод, бесплатный переводчик субтитров',
    ogTitle: 'Переводчик Субтитров на Английский - Бесплатный Онлайн Инструмент',
    ogDescription: 'Профессиональный сервис перевода субтитров на английский. Конвертируйте субтитры в английский с помощью ИИ-перевода.',
    structuredDataName: 'Переводчик Субтитров на Английский',
    structuredDataDescription: 'Профессиональный сервис перевода субтитров на английский. Конвертируйте субтитры в английский с помощью ИИ-перевода.',
    featureList: [
      "Перевод субтитров на английский",
      "Поддержка файлов SRT",
      "ИИ-перевод",
      "Бесплатный онлайн инструмент"
    ]
  }
};

export async function generateMetadata(): Promise<Metadata> {
  const userLang = await getUserLanguage();
  const config = metadataConfig[userLang as keyof typeof metadataConfig];

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    alternates: {
      canonical: 'https://subtitletranslator.cc/english-subtitle',
      languages: {
        'en-US': 'https://subtitletranslator.cc/english-subtitle',
        'zh-CN': 'https://subtitletranslator.cc/chinese-subtitle',
      },
    },
    openGraph: {
      title: config.ogTitle,
      description: config.ogDescription,
      url: 'https://subtitletranslator.cc/english-subtitle',
      type: 'website',
      locale: userLang === 'zh' ? 'zh_CN' : userLang === 'ja' ? 'ja_JP' : userLang === 'fr' ? 'fr_FR' : userLang === 'de' ? 'de_DE' : userLang === 'es' ? 'es_ES' : userLang === 'it' ? 'it_IT' : userLang === 'ru' ? 'ru_RU' : 'en_US',
    },
  };
}

export default async function EnglishSubtitlePage() {
  const pageConfig = getPageConfig('englishSubtitle');
  const userLang = await getUserLanguage();
  const config = metadataConfig[userLang as keyof typeof metadataConfig];

  if (!pageConfig) {
    return <div>页面配置未找到 / Page configuration not found</div>;
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": config.structuredDataName,
            "description": config.structuredDataDescription,
            "url": "https://subtitletranslator.cc/english-subtitle",
            "applicationCategory": "Utility",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": config.featureList,
            "inLanguage": userLang === 'zh' ? 'zh-CN' : userLang === 'ja' ? 'ja-JP' : userLang === 'fr' ? 'fr-FR' : userLang === 'de' ? 'de-DE' : userLang === 'es' ? 'es-ES' : userLang === 'it' ? 'it-IT' : userLang === 'ru' ? 'ru-RU' : 'en-US'
          })
        }}
      />
      <ServerPageTemplate pageConfig={pageConfig} />
    </>
  );
} 