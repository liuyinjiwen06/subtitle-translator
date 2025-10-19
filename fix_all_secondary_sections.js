const fs = require('fs');

// 翻訳マッピング for each language
const translations = {
  es: {
    // Portuguese content in Spanish file
    "Portuguese SRT Translator - Translate Portuguese Subtitles Online Free | SubTran": "Traductor SRT Portugués - Traduce Subtítulos Portugueses en Línea Gratis | SubTran",
    "Professional Portuguese subtitle translator. Translate SRT files from Portuguese to 30+ languages or translate any language to Portuguese. Free online tool with AI-powered accuracy for all Portuguese variants.": "Traductor profesional de subtítulos portugueses. Traduce archivos SRT del portugués a más de 30 idiomas o traduce cualquier idioma al portugués. Herramienta en línea gratuita con precisión impulsada por IA para todas las variantes del portugués.",
    "Translate Portuguese Subtitles Instantly": "Traduce Subtítulos Portugueses al Instante",
    "Connect with 260+ million Portuguese speakers worldwide. Our specialized Portuguese SRT translator handles Brazilian Portuguese, European Portuguese, and African Portuguese variants with cultural authenticity and linguistic precision.": "Conecta con más de 260 millones de hablantes de portugués en todo el mundo. Nuestro traductor SRT portugués especializado maneja variantes del portugués brasileño, europeo y africano con autenticidad cultural y precisión lingüística.",
    "🇵🇹 Portuguese Subtitle Solutions": "🇵🇹 Soluciones de Subtítulos Portugueses",
    "Bridge Brazilian, European, and African Portuguese markets with our advanced subtitle translation technology optimized for the linguistic diversity and cultural richness of the Portuguese-speaking world.": "Conecta los mercados portugués brasileño, europeo y africano con nuestra tecnología avanzada de traducción de subtítulos optimizada para la diversidad lingüística y riqueza cultural del mundo de habla portuguesa.",
    "Brazilian Portuguese Excellence": "Excelencia del Portugués Brasileño",
    "European Portuguese Precision": "Precisión del Portugués Europeo",
    "African Portuguese Markets": "Mercados del Portugués Africano",
    "Global Portuguese Network": "Red Global Portuguesa",
    "Specialized handling of Brazilian Portuguese with local expressions, cultural references, and regional variations. Perfect for reaching the massive Brazilian market with authentic, culturally relevant content.": "Manejo especializado del portugués brasileño con expresiones locales, referencias culturales y variaciones regionales. Perfecto para alcanzar el masivo mercado brasileño con contenido auténtico y culturalmente relevante.",
    "Accurate European Portuguese translations that respect formal language structures, cultural nuances, and traditional expressions used in Portugal and other European Portuguese-speaking communities.": "Traducciones precisas del portugués europeo que respetan las estructuras formales del idioma, matices culturales y expresiones tradicionales utilizadas en Portugal y otras comunidades europeas de habla portuguesa.",
    "Support for Portuguese variants in Angola, Mozambique, Cape Verde, Guinea-Bissau, and São Tomé and Príncipe with region-specific cultural and linguistic adaptations.": "Soporte para variantes portuguesas en Angola, Mozambique, Cabo Verde, Guinea-Bissau y Santo Tomé y Príncipe con adaptaciones culturales y lingüísticas específicas de la región.",
    "Connect with Portuguese-speaking communities worldwide including Macau, East Timor, and diaspora communities with culturally appropriate and linguistically accurate translations.": "Conecta con comunidades de habla portuguesa en todo el mundo incluyendo Macao, Timor Oriental y comunidades de la diáspora con traducciones culturalmente apropiadas y lingüísticamente precisas.",

    // French content in Spanish file  
    "French SRT Translator - Translate French Subtitles Online Free | SubTran": "Traductor SRT Francés - Traduce Subtítulos Franceses en Línea Gratis | SubTran",
    "Professional French subtitle translator. Translate SRT files from French to 30+ languages or translate any language to French. Free online tool with AI-powered accuracy for all French variants.": "Traductor profesional de subtítulos franceses. Traduce archivos SRT del francés a más de 30 idiomas o traduce cualquier idioma al francés. Herramienta en línea gratuita con precisión impulsada por IA para todas las variantes del francés.",
    "Translate French Subtitles Instantly": "Traduce Subtítulos Franceses al Instante",
    "Transform French content for global audiences or bring international content to French-speaking markets. Our specialized French SRT translator handles metropolitan French, Canadian French, and African French variants with linguistic precision and cultural authenticity.": "Transforma contenido francés para audiencias globales o lleva contenido internacional a mercados de habla francesa. Nuestro traductor SRT francés especializado maneja variantes del francés metropolitano, canadiense y africano con precisión lingüística y autenticidad cultural.",
    "🇫🇷 French Subtitle Solutions": "🇫🇷 Soluciones de Subtítulos Franceses",
    "Bridge French and international markets with our advanced French subtitle translation technology optimized for the elegance and cultural richness of the French language worldwide.": "Conecta los mercados francés e internacional con nuestra tecnología avanzada de traducción de subtítulos franceses optimizada para la elegancia y riqueza cultural del idioma francés en todo el mundo."
  },

  fr: {
    // Spanish content in French file
    "Spanish SRT Translator - Translate Spanish Subtitles Online Free | SubTran": "Traducteur SRT Espagnol - Traduire les Sous-titres Espagnols en Ligne Gratuitement | SubTran",
    "Professional Spanish subtitle translator. Translate SRT files from Spanish to 30+ languages or translate any language to Spanish. Free online tool with AI-powered accuracy for all Spanish variants.": "Traducteur professionnel de sous-titres espagnols. Traduisez les fichiers SRT de l'espagnol vers plus de 30 langues ou traduisez n'importe quelle langue vers l'espagnol. Outil en ligne gratuit avec une précision alimentée par l'IA pour toutes les variantes espagnoles.",
    "Professional Spanish Subtitle Translator": "Traducteur Professionnel de Sous-titres Espagnols",
    "Transform your content for 500+ million Spanish speakers worldwide. Our AI-powered translator delivers culturally accurate Spanish subtitles with support for regional variations including Mexican, Argentinian, Colombian, and European Spanish.": "Transformez votre contenu pour plus de 500 millions d'hispanophones dans le monde. Notre traducteur alimenté par l'IA fournit des sous-titres espagnols culturellement précis avec un support pour les variations régionales incluant l'espagnol mexicain, argentin, colombien et européen.",
    "🌶️ Spanish Subtitle Solutions": "🌶️ Solutions de Sous-titres Espagnols",
    "Bridge global markets with our advanced Spanish subtitle translation technology designed for the diverse Hispanic world.": "Connectez les marchés mondiaux avec notre technologie avancée de traduction de sous-titres espagnols conçue pour le monde hispanique diversifié.",
    "Regional Spanish Variants": "Variantes Régionales Espagnoles",
    "Bidirectional Translation": "Traduction Bidirectionnelle",
    "Cultural Adaptation": "Adaptation Culturelle",
    "Business Content Focus": "Focus sur le Contenu Commercial",
    "Support for Mexican, Argentinian, Colombian, Peruvian, Venezuelan, Chilean, European Spanish and other regional variations with cultural nuances and local expressions.": "Support pour l'espagnol mexicain, argentin, colombien, péruvien, vénézuélien, chilien, européen et autres variations régionales avec des nuances culturelles et des expressions locales.",
    "Translate from Spanish to 30+ languages or translate any language to Spanish with equal precision and cultural sensitivity.": "Traduisez de l'espagnol vers plus de 30 langues ou traduisez n'importe quelle langue vers l'espagnol avec une précision égale et une sensibilité culturelle.",
    "AI engines trained on Hispanic culture, slang, idioms, and regional expressions to deliver translations that resonate with Spanish-speaking audiences.": "Moteurs d'IA formés sur la culture hispanique, l'argot, les idiomes et les expressions régionales pour fournir des traductions qui résonnent avec les audiences hispanophones.",
    "Specialized handling of corporate content, educational materials, marketing videos, and professional communications for Spanish-speaking markets.": "Gestion spécialisée du contenu d'entreprise, du matériel éducatif, des vidéos marketing et des communications professionnelles pour les marchés hispanophones.",
    "🌍 Spanish Translation Coverage": "🌍 Couverture de Traduction Espagnole",
    "Connect Spanish content with global audiences through comprehensive language support covering major world languages.": "Connectez le contenu espagnol avec des audiences mondiales grâce à un support linguistique complet couvrant les principales langues mondiales.",
    "Translate Spanish Subtitles To:": "Traduire les Sous-titres Espagnols Vers :",
    "Plus Reverse Translation:": "Plus Traduction Inverse :"
  },

  pt: {
    // Spanish content in Portuguese file
    "Spanish SRT Translator - Translate Spanish Subtitles Online Free | SubTran": "Tradutor SRT Espanhol - Traduzir Legendas Espanholas Online Grátis | SubTran",
    "Professional Spanish subtitle translator. Translate SRT files from Spanish to 30+ languages or translate any language to Spanish. Free online tool with AI-powered accuracy for all Spanish variants.": "Tradutor profissional de legendas espanholas. Traduza arquivos SRT do espanhol para mais de 30 idiomas ou traduza qualquer idioma para o espanhol. Ferramenta online gratuita com precisão alimentada por IA para todas as variantes espanholas.",
    "Professional Spanish Subtitle Translator": "Tradutor Profissional de Legendas Espanholas",
    "Transform your content for 500+ million Spanish speakers worldwide. Our AI-powered translator delivers culturally accurate Spanish subtitles with support for regional variations including Mexican, Argentinian, Colombian, and European Spanish.": "Transforme seu conteúdo para mais de 500 milhões de falantes de espanhol em todo o mundo. Nosso tradutor alimentado por IA oferece legendas espanholas culturalmente precisas com suporte para variações regionais incluindo espanhol mexicano, argentino, colombiano e europeu.",
    "🌶️ Spanish Subtitle Solutions": "🌶️ Soluções de Legendas Espanholas",
    "Bridge global markets with our advanced Spanish subtitle translation technology designed for the diverse Hispanic world.": "Una mercados globais com nossa tecnologia avançada de tradução de legendas espanholas projetada para o diverso mundo hispânico.",
    "Regional Spanish Variants": "Variantes Regionais Espanholas",
    "Bidirectional Translation": "Tradução Bidirecional",
    "Cultural Adaptation": "Adaptação Cultural",
    "Business Content Focus": "Foco em Conteúdo Empresarial",
    "Support for Mexican, Argentinian, Colombian, Peruvian, Venezuelan, Chilean, European Spanish and other regional variations with cultural nuances and local expressions.": "Suporte para espanhol mexicano, argentino, colombiano, peruano, venezuelano, chileno, europeu e outras variações regionais com nuances culturais e expressões locais.",
    "Translate from Spanish to 30+ languages or translate any language to Spanish with equal precision and cultural sensitivity.": "Traduza do espanhol para mais de 30 idiomas ou traduza qualquer idioma para o espanhol com igual precisão e sensibilidade cultural.",
    "AI engines trained on Hispanic culture, slang, idioms, and regional expressions to deliver translations that resonate with Spanish-speaking audiences.": "Motores de IA treinados na cultura hispânica, gírias, idiomas e expressões regionais para entregar traduções que ressoam com audiências de língua espanhola.",
    "Specialized handling of corporate content, educational materials, marketing videos, and professional communications for Spanish-speaking markets.": "Manuseio especializado de conteúdo corporativo, materiais educacionais, vídeos de marketing e comunicações profissionais para mercados de língua espanhola.",
    "🌍 Spanish Translation Coverage": "🌍 Cobertura de Tradução Espanhola",
    "Connect Spanish content with global audiences through comprehensive language support covering major world languages.": "Conecte conteúdo espanhol com audiências globais através de suporte linguístico abrangente cobrindo as principais línguas mundiais.",
    "Translate Spanish Subtitles To:": "Traduzir Legendas Espanholas Para:",
    "Plus Reverse Translation:": "Mais Tradução Reversa:"
  }
};

function translateFile(lang) {
  try {
    const filePath = `./src/lib/locales/${lang}.json`;
    let content = fs.readFileSync(filePath, 'utf8');
    
    console.log(`\n翻訳中: ${lang}.json...`);
    
    let replacedCount = 0;
    const langTranslations = translations[lang];
    
    // 英語から対象言語への翻訳
    for (const [english, translated] of Object.entries(langTranslations)) {
      const before = content;
      content = content.replace(new RegExp(escapeRegExp(english), 'g'), translated);
      if (before !== content) {
        replacedCount++;
        console.log(`✅ 翻訳済み (${lang}): "${english.substring(0, 50)}..."`);
      }
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    
    console.log(`🎉 ${lang}.json翻訳完了！${replacedCount}個の英文を翻訳しました。`);
    
  } catch (error) {
    console.error(`❌ ${lang}.jsonエラー:`, error.message);
  }
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 全ての言語ファイルを翻訳
console.log('二次ページセクションの英語コンテンツを翻訳中...');
translateFile('es');
translateFile('fr');
translateFile('pt');

console.log('\n🎉 全ての言語ファイルの翻訳が完了しました！');