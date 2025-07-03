const fs = require('fs');

// 所有语言的features翻译
const featuresTranslations = {
  'zh': [
    "✅ 英语专长 - 专为英语字幕翻译优化",
    "📈 30种语言 - 翻译为主要世界语言或从这些语言翻译为英语", 
    "🧠 上下文感知AI - 理解习语、俚语和文化引用",
    "⭐ 专业品质 - 完美适用于YouTube、流媒体和商业内容"
  ],
  'es': [
    "✅ Experiencia en Inglés - Optimizado para traducción de subtítulos en inglés",
    "📈 30 Idiomas - Traduce a los principales idiomas del mundo o de ellos al inglés",
    "🧠 IA Consciente del Contexto - Entiende modismos, jerga y referencias culturales",
    "⭐ Calidad Profesional - Perfecto para YouTube, streaming y contenido empresarial"
  ],
  'fr': [
    "✅ Expertise Anglaise - Optimisé pour la traduction de sous-titres anglais",
    "📈 30 Langues - Traduit vers les principales langues mondiales ou d'elles vers l'anglais",
    "🧠 IA Contextuelle - Comprend les idiomes, l'argot et les références culturelles",
    "⭐ Qualité Professionnelle - Parfait pour YouTube, streaming et contenu commercial"
  ],
  'de': [
    "✅ Englisch-Expertise - Optimiert für englische Untertitelübersetzung",
    "📈 30 Sprachen - Übersetze in wichtige Weltsprachen oder von ihnen ins Englische",
    "🧠 Kontextbewusste KI - Versteht Redewendungen, Slang und kulturelle Referenzen",
    "⭐ Professionelle Qualität - Perfekt für YouTube, Streaming und Geschäftsinhalte"
  ],
  'ja': [
    "✅ 英語専門知識 - 英語字幕翻訳に最適化",
    "📈 30言語 - 主要な世界言語に翻訳、または英語に翻訳",
    "🧠 文脈認識AI - イディオム、スラング、文化的言及を理解",
    "⭐ プロ品質 - YouTube、ストリーミング、ビジネスコンテンツに最適"
  ],
  'ko': [
    "✅ 영어 전문성 - 영어 자막 번역에 최적화",
    "📈 30개 언어 - 주요 세계 언어로 번역하거나 영어로 번역",
    "🧠 맥락 인식 AI - 관용구, 속어, 문화적 참조 이해",
    "⭐ 전문 품질 - YouTube, 스트리밍, 비즈니스 콘텐츠에 완벽"
  ],
  'pt': [
    "✅ Expertise em Inglês - Otimizado para tradução de legendas em inglês",
    "📈 30 Idiomas - Traduz para as principais línguas mundiais ou delas para o inglês",
    "🧠 IA Consciente do Contexto - Entende idiomas, gírias e referências culturais",
    "⭐ Qualidade Profissional - Perfeito para YouTube, streaming e conteúdo empresarial"
  ],
  'ru': [
    "✅ Экспертиза Английского - Оптимизировано для перевода английских субтитров",
    "📈 30 Языков - Переводит на основные мировые языки или с них на английский",
    "🧠 Контекстно-Осведомленный ИИ - Понимает идиомы, сленг и культурные ссылки",
    "⭐ Профессиональное Качество - Идеально для YouTube, стриминга и бизнес-контента"
  ],
  'it': [
    "✅ Competenza Inglese - Ottimizzato per la traduzione di sottotitoli inglesi",
    "📈 30 Lingue - Traduce nelle principali lingue mondiali o da esse all'inglese",
    "🧠 IA Consapevole del Contesto - Comprende idiomi, gergo e riferimenti culturali",
    "⭐ Qualità Professionale - Perfetto per YouTube, streaming e contenuti aziendali"
  ],
  'ar': [
    "✅ خبرة الإنجليزية - محسّن لترجمة الترجمات الإنجليزية",
    "📈 30 لغة - يترجم إلى اللغات العالمية الرئيسية أو منها إلى الإنجليزية",
    "🧠 ذكاء اصطناعي واعي للسياق - يفهم التعابير والعامية والمراجع الثقافية",
    "⭐ جودة احترافية - مثالي لـ YouTube والبث والمحتوى التجاري"
  ],
  'hi': [
    "✅ अंग्रेजी विशेषज्ञता - अंग्रेजी उपशीर्षक अनुवाद के लिए अनुकूलित",
    "📈 30 भाषाएं - प्रमुख विश्व भाषाओं में या उनसे अंग्रेजी में अनुवाद करें",
    "🧠 संदर्भ-जागरूक AI - मुहावरे, स्लैंग और सांस्कृतिक संदर्भ समझता है",
    "⭐ पेशेवर गुणवत्ता - YouTube, स्ट्रीमिंग और व्यावसायिक सामग्री के लिए उत्तम"
  ],
  'th': [
    "✅ ความเชี่ยวชาญภาษาอังกฤษ - เหมาะสำหรับการแปลซับไตเติ้ลภาษาอังกฤษ",
    "📈 30 ภาษา - แปลเป็นภาษาหลักของโลกหรือจากภาษาเหล่านั้นเป็นภาษาอังกฤษ",
    "🧠 AI ที่รู้บริบท - เข้าใจสำนวน สแลง และการอ้างอิงทางวัฒนธรรม",
    "⭐ คุณภาพระดับมืออาชีพ - เหมาะสำหรับ YouTube สตรีมมิ่ง และเนื้อหาธุรกิจ"
  ],
  'vi': [
    "✅ Chuyên Môn Tiếng Anh - Được tối ưu hóa cho dịch phụ đề tiếng Anh",
    "📈 30 Ngôn Ngữ - Dịch sang các ngôn ngữ chính trên thế giới hoặc từ chúng sang tiếng Anh",
    "🧠 AI Nhận Thức Ngữ Cảnh - Hiểu thành ngữ, tiếng lóng và tham chiếu văn hóa",
    "⭐ Chất Lượng Chuyên Nghiệp - Hoàn hảo cho YouTube, streaming và nội dung kinh doanh"
  ],
  'tr': [
    "✅ İngilizce Uzmanlığı - İngilizce altyazı çevirisi için optimize edilmiş",
    "📈 30 Dil - Başlıca dünya dillerine veya onlardan İngilizceye çevir",
    "🧠 Bağlam Bilinçli AI - Deyimleri, argoyı ve kültürel referansları anlar",
    "⭐ Profesyonel Kalite - YouTube, yayın ve iş içeriği için mükemmel"
  ],
  'pl': [
    "✅ Ekspertyza w Języku Angielskim - Zoptymalizowane do tłumaczenia napisów angielskich",
    "📈 30 Języków - Tłumaczy na główne języki świata lub z nich na angielski",
    "🧠 AI Świadome Kontekstu - Rozumie idiomy, slang i odniesienia kulturowe",
    "⭐ Jakość Profesjonalna - Idealne dla YouTube, streamingu i treści biznesowych"
  ],
  'nl': [
    "✅ Engelse Expertise - Geoptimaliseerd voor Engelse ondertitelvertaling",
    "📈 30 Talen - Vertaal naar belangrijke wereldtalen of van hen naar het Engels",
    "🧠 Context-Bewuste AI - Begrijpt idiomen, slang en culturele verwijzingen",
    "⭐ Professionele Kwaliteit - Perfect voor YouTube, streaming en zakelijke content"
  ],
  'sv': [
    "✅ Engelsk Expertis - Optimerad för engelsk undertextöversättning",
    "📈 30 Språk - Översätt till stora världsspråk eller från dem till engelska",
    "🧠 Kontextmedveten AI - Förstår idiom, slang och kulturella referenser",
    "⭐ Professionell Kvalitet - Perfekt för YouTube, streaming och företagsinnehåll"
  ]
};

// 原始英文features
const originalEnglishFeatures = [
  "✅ English Expertise - Optimized for English subtitle translation",
  "📈 30 Languages - Translate to major world languages or from them to English", 
  "🧠 Context-Aware AI - Understands idioms, slang, and cultural references",
  "⭐ Professional Quality - Perfect for YouTube, streaming, and business content"
];

// 处理所有语言文件
const languages = Object.keys(featuresTranslations);

languages.forEach(lang => {
  try {
    const filePath = `./src/lib/locales/${lang}.json`;
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️ 文件不存在: ${filePath}`);
      return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    console.log(`\\n正在处理 ${lang}.json...`);
    
    // 替换每个features项
    let hasChanges = false;
    originalEnglishFeatures.forEach((englishFeature, index) => {
      const translatedFeature = featuresTranslations[lang][index];
      if (content.includes(englishFeature)) {
        content = content.replace(new RegExp(escapeRegExp(englishFeature), 'g'), translatedFeature);
        console.log(`✅ 已替换: "${englishFeature.substring(0, 30)}..."`);
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ ${lang}.json 更新完成`);
    } else {
      console.log(`ℹ️ ${lang}.json 无需更新`);
    }
    
  } catch (error) {
    console.error(`❌ 处理 ${lang}.json 时出错:`, error.message);
  }
});

console.log('\\n🎉 所有语言文件的features翻译修复完成！');

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
}