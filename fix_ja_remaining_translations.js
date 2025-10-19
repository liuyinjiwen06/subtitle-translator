const fs = require('fs');

// 日本語翻訳マッピング - ユーザーの指示に従い、混合コンテンツをそのまま保持
const japaneseTranslations = {
  // Spanish Subtitle section titles - preserve mixed content exactly
  "Spanish SRT Translator - Translate Spanish Subtitles Online Free |中国語SRT翻訳ツール - 中国語字幕をオンラインで無料翻訳 | SubTran": "スペイン語SRT翻訳ツール - スペイン語字幕をオンラインで無料翻訳 |中国語SRT翻訳ツール - 中国語字幕をオンラインで無料翻訳 | SubTran",
  "Professional Spanish subtitle translator. Translate SRT files from Spanish to 30+ languages or translate any language to Spanish. Free online tool with AI-powered accuracy for all Spanish variants.": "プロフェッショナルなスペイン語字幕翻訳ツール。スペイン語から30以上の言語へ、または任意の言語からスペイン語へSRTファイルを翻訳。すべてのスペイン語バリエーションに対応したAI駆動の精度を持つ無料オンラインツール。",
  
  // Portuguese Subtitle section titles - preserve mixed content exactly  
  "Portuguese SRT Translator - Translate Portuguese Subtitles Online Free |中国語SRT翻訳ツール - 中国語字幕をオンラインで無料翻訳 | SubTran": "ポルトガル語SRT翻訳ツール - ポルトガル語字幕をオンラインで無料翻訳 |中国語SRT翻訳ツール - 中国語字幕をオンラインで無料翻訳 | SubTran",
  "Professional Portuguese subtitle translator. Translate SRT files from Portuguese to 30+ languages or translate any language to Portuguese. Free online tool with AI-powered accuracy for all Portuguese variants.": "プロフェッショナルなポルトガル語字幕翻訳ツール。ポルトガル語から30以上の言語へ、または任意の言語からポルトガル語へSRTファイルを翻訳。すべてのポルトガル語バリエーションに対応したAI駆動の精度を持つ無料オンラインツール。",
  
  // French Subtitle section titles - preserve mixed content exactly
  "French SRT Translator - Translate French Subtitles Online Free |中国語SRT翻訳ツール - 中国語字幕をオンラインで無料翻訳 | SubTran": "フランス語SRT翻訳ツール - フランス語字幕をオンラインで無料翻訳 |中国語SRT翻訳ツール - 中国語字幕をオンラインで無料翻訳 | SubTran",
  "Professional French subtitle translator. Translate SRT files from French to 30+ languages or translate any language to French. Free online tool with AI-powered accuracy for all French variants.": "プロフェッショナルなフランス語字幕翻訳ツール。フランス語から30以上の言語へ、または任意の言語からフランス語へSRTファイルを翻訳。すべてのフランス語バリエーションに対応したAI駆動の精度を持つ無料オンラインツール。",

  // Hero sections
  "Professional Spanish Subtitle Translator": "プロフェッショナルなスペイン語字幕翻訳ツール",
  "Transform your content for 500+ million Spanish speakers worldwide. Our AI-powered translator delivers culturally accurate Spanish subtitles with support for regional variations including Mexican, Argentinian, Colombian, and European Spanish.": "世界中の5億人以上のスペイン語話者向けにコンテンツを変換。私たちのAI駆動翻訳ツールは、メキシコ、アルゼンチン、コロンビア、ヨーロッパのスペイン語を含む地域的なバリエーションをサポートし、文化的に正確なスペイン語字幕を提供します。",
  
  "Translate Portuguese Subtitles Instantly": "ポルトガル語字幕を瞬時に翻訳",
  "Connect with 260+ million Portuguese speakers worldwide. Our specialized Portuguese SRT translator handles Brazilian Portuguese, European Portuguese, and African Portuguese variants with cultural authenticity and linguistic precision.": "世界中の2億6000万人以上のポルトガル語話者とつながる。私たちの専門的なポルトガル語SRT翻訳ツールは、文化的な真正性と言語的な精度でブラジルポルトガル語、ヨーロッパポルトガル語、アフリカポルトガル語のバリエーションを処理します。",
  
  "Translate French Subtitles Instantly": "フランス語字幕を瞬時に翻訳",
  "Transform French content for global audiences or bring international content to French-speaking markets. Our specialized French SRT translator handles metropolitan French, Canadian French, and African French variants with linguistic precision and cultural authenticity.": "フランス語コンテンツをグローバルな視聴者向けに変換、または国際的なコンテンツをフランス語圏市場に提供。私たちの専門的なフランス語SRT翻訳ツールは、言語的精度と文化的真正性でメトロポリタンフランス語、カナダフランス語、アフリカフランス語のバリエーションを処理します。",

  // Solutions sections
  "🌶️ Spanish Subtitle Solutions": "🌶️ スペイン語字幕ソリューション",
  "Bridge global markets with our advanced Spanish subtitle translation technology designed for the diverse Hispanic world.": "多様なヒスパニック世界のために設計された高度なスペイン語字幕翻訳技術で、グローバル市場を橋渡しします。",
  
  "🇵🇹 Portuguese Subtitle Solutions": "🇵🇹 ポルトガル語字幕ソリューション", 
  "Bridge Brazilian, European, and African Portuguese markets with our advanced subtitle translation technology optimized for the linguistic diversity and cultural richness of the Portuguese-speaking world.": "ポルトガル語圏の言語的多様性と文化的豊かさに最適化された高度な字幕翻訳技術で、ブラジル、ヨーロッパ、アフリカのポルトガル語市場を橋渡しします。",
  
  "🇫🇷 French Subtitle Solutions": "🇫🇷 フランス語字幕ソリューション",
  "Bridge French and international markets with our advanced French subtitle translation technology optimized for the elegance and cultural richness of the French language worldwide.": "世界中のフランス語の優雅さと文化的豊かさに最適化された高度なフランス語字幕翻訳技術で、フランスと国際市場を橋渡しします。",

  // Common section titles
  "Regional Spanish Variants": "地域別スペイン語バリエーション",
  "Bidirectional Translation": "双方向翻訳",
  "Cultural Adaptation": "文化的適応",
  "Business Content Focus": "ビジネスコンテンツフォーカス",
  
  "Brazilian Portuguese Excellence": "ブラジルポルトガル語エクセレンス",
  "European Portuguese Precision": "ヨーロッパポルトガル語精度",
  "African Portuguese Markets": "アフリカポルトガル語市場",
  "Global Portuguese Network": "グローバルポルトガル語ネットワーク",
  
  "From French to Global Markets": "フランス語からグローバル市場へ",
  "To French for Francophone Markets": "フランコフォン市場向けフランス語へ",
  "Regional French Mastery": "地域別フランス語マスタリー",
  "Cultural & Linguistic Excellence": "文化的・言語的エクセレンス",

  // Supported Languages sections
  "🌍 Spanish Translation Coverage": "🌍 スペイン語翻訳カバレッジ",
  "Connect Spanish content with global audiences through comprehensive language support covering major world languages.": "主要な世界言語をカバーする包括的な言語サポートを通じて、スペイン語コンテンツをグローバル視聴者とつなげます。",
  "Translate Spanish Subtitles To:": "スペイン語字幕の翻訳先：",
  "Translate any of these languages to Spanish with the same regional sensitivity and cultural accuracy, supporting both Latin American and European Spanish variants.": "これらの言語のいずれかを、ラテンアメリカとヨーロッパのスペイン語バリエーションの両方をサポートして、同じ地域的感度と文化的正確性でスペイン語に翻訳します。",
  
  "🌍 Portuguese Translation Coverage": "🌍 ポルトガル語翻訳カバレッジ",
  "Connect Portuguese content with global audiences through comprehensive language support covering major international markets and regional Portuguese variations.": "主要な国際市場と地域別ポルトガル語バリエーションをカバーする包括的な言語サポートを通じて、ポルトガル語コンテンツをグローバル視聴者とつなげます。",
  "Translate Portuguese Subtitles To:": "ポルトガル語字幕の翻訳先：",
  "Translate any of these languages to Portuguese with regional preference settings for Brazil, Portugal, or other Portuguese-speaking markets with appropriate cultural adaptation.": "これらの言語のいずれかを、適切な文化的適応とともに、ブラジル、ポルトガル、またはその他のポルトガル語圏市場の地域設定でポルトガル語に翻訳します。",
  
  "🌍 French Translation Coverage": "🌍 フランス語翻訳カバレッジ",
  "Connect French content with global audiences through comprehensive language support covering major international markets.": "主要な国際市場をカバーする包括的な言語サポートを通じて、フランス語コンテンツをグローバル視聴者とつなげます。",
  "Translate French Subtitles To:": "フランス語字幕の翻訳先：",
  "Translate any of these languages to French with regional preference settings for France, Quebec, Belgium, or other French-speaking markets.": "これらの言語のいずれかを、フランス、ケベック、ベルギー、またはその他のフランス語圏市場の地域設定でフランス語に翻訳します。",

  // Industry sections (just translate the title, keeping the rest as is)
  "Discover how professionals across industries rely on our Spanish subtitle translator for their content localization needs.": "さまざまな業界の専門家が、コンテンツローカライゼーションのニーズに私たちのスペイン語字幕翻訳ツールをどのように活用しているかをご覧ください。",
  "Discover how Portuguese content creators and international businesses leverage our Portuguese subtitle translator across diverse markets and sectors.": "ポルトガル語コンテンツクリエイターと国際企業が、多様な市場とセクターで私たちのポルトガル語字幕翻訳ツールをどのように活用しているかをご覧ください。",
  "Discover how French content creators and international businesses leverage our French subtitle translator for cultural exchange and market expansion.": "フランス語コンテンツクリエイターと国際企業が、文化交流と市場拡大のために私たちのフランス語字幕翻訳ツールをどのように活用しているかをご覧ください。",

  // Common processing text
  "Entertainment & Media": "エンターテイメント・メディア",
  "Business & Commerce": "ビジネス・商業",
  "Education & Training": "教育・トレーニング",
  "Digital & Technology": "デジタル・テクノロジー",
  "Business & Marketing": "ビジネス・マーケティング", 
  "Cinema & Entertainment": "シネマ・エンターテイメント",
  "Business & Education": "ビジネス・教育",
  "Cultural & Media Content": "文化・メディアコンテンツ",

  // Quality and technical sections
  "Experience superior Spanish translation quality with our culturally-aware AI engines optimized for Hispanic markets.": "ヒスパニック市場に最適化された文化的に認識するAIエンジンで、優れたスペイン語翻訳品質を体験してください。",
  "Experience superior Portuguese translation quality with our culturally-aware AI engines optimized for the linguistic diversity of Portuguese-speaking markets.": "ポルトガル語圏市場の言語的多様性に最適化された文化的に認識するAIエンジンで、優れたポルトガル語翻訳品質を体験してください。",
  "Experience superior French translation quality with our culturally-aware AI engines and linguistically precise quality assurance processes.": "文化的に認識するAIエンジンと言語的に精密な品質保証プロセスで、優れたフランス語翻訳品質を体験してください。",

  // FAQ sections
  "Get answers to common questions about our Spanish subtitle translation service and regional capabilities.": "私たちのスペイン語字幕翻訳サービスと地域別機能に関するよくある質問への回答を得る。",
  "Get answers to common questions about our Portuguese subtitle translation service and regional capabilities.": "私たちのポルトガル語字幕翻訳サービスと地域別機能に関するよくある質問への回答を得る。",
  "Get answers to common questions about our French subtitle translation service and regional capabilities.": "私たちのフランス語字幕翻訳サービスと地域別機能に関するよくある質問への回答を得る。",

  // Common feature descriptions - translate long English content to Japanese
  "Support for Mexican, Argentinian, Colombian, Peruvian, Venezuelan, Chilean, European Spanish and other regional variations with cultural nuances and local expressions.": "文化的ニュアンスと地域表現を含むメキシコ、アルゼンチン、コロンビア、ペルー、ベネズエラ、チリ、ヨーロッパスペイン語およびその他の地域バリエーションのサポート。",
  "Translate from Spanish to 30+ languages or translate any language to Spanish with equal precision and cultural sensitivity.": "スペイン語から30以上の言語への翻訳、または任意の言語からスペイン語への翻訳を、同等の精度と文化的感度で実行。",
  "AI engines trained on Hispanic culture, slang, idioms, and regional expressions to deliver translations that resonate with Spanish-speaking audiences.": "スペイン語話者の視聴者に響く翻訳を提供するために、ヒスパニック文化、スラング、イディオム、地域表現で訓練されたAIエンジン。",
  "Specialized handling of corporate content, educational materials, marketing videos, and professional communications for Spanish-speaking markets.": "スペイン語圏市場向けの企業コンテンツ、教育材料、マーケティングビデオ、プロフェッショナルコミュニケーションの専門的処理。",

  "Specialized handling of Brazilian Portuguese with local expressions, cultural references, and regional variations. Perfect for reaching the massive Brazilian market with authentic, culturally relevant content.": "地域表現、文化的言及、地域バリエーションを含むブラジルポルトガル語の専門的処理。本格的で文化的に関連するコンテンツで巨大なブラジル市場にリーチするのに最適。",
  "Accurate European Portuguese translations that respect formal language structures, cultural nuances, and traditional expressions used in Portugal and other European Portuguese-speaking communities.": "ポルトガルおよびその他のヨーロッパポルトガル語話者コミュニティで使用される正式な言語構造、文化的ニュアンス、伝統的表現を尊重する正確なヨーロッパポルトガル語翻訳。",
  "Support for Portuguese variants in Angola, Mozambique, Cape Verde, Guinea-Bissau, and São Tomé and Príncipe with region-specific cultural and linguistic adaptations.": "地域固有の文化的・言語的適応を含む、アンゴラ、モザンビーク、カーボベルデ、ギニアビサウ、サントメ・プリンシペのポルトガル語バリエーションのサポート。",
  "Connect with Portuguese-speaking communities worldwide including Macau, East Timor, and diaspora communities with culturally appropriate and linguistically accurate translations.": "マカオ、東ティモール、ディアスポラコミュニティを含む世界中のポルトガル語話者コミュニティと、文化的に適切で言語的に正確な翻訳でつながる。",

  "Expand your French content's international reach with translations that preserve the sophistication, cultural nuances, and linguistic beauty of French expression. Perfect for exporting French cinema, education, and cultural content worldwide.": "フランス表現の洗練性、文化的ニュアンス、言語的美しさを保持する翻訳で、フランス語コンテンツの国際的リーチを拡大。フランス映画、教育、文化コンテンツの世界輸出に最適。",
  "Bring international content to the 300+ million French speakers across France, Canada, Belgium, Switzerland, and Francophone Africa with culturally adapted translations that respect French linguistic traditions.": "フランス、カナダ、ベルギー、スイス、フランコフォンアフリカの3億人以上のフランス語話者に、フランス語の言語的伝統を尊重する文化的に適応した翻訳で国際コンテンツを提供。",
  "Complete support for French variants including Metropolitan French (France), Quebec French (Canadian), Belgian French, Swiss French, and African French with region-specific cultural and linguistic adaptations.": "地域固有の文化的・言語的適応を含む、メトロポリタンフランス語（フランス）、ケベックフランス語（カナダ）、ベルギーフランス語、スイスフランス語、アフリカフランス語を含むフランス語バリエーションの完全サポート。",
  "Our AI understands French cultural references, formal register variations, subjunctive mood usage, and cultural concepts, ensuring translations that maintain the elegance and precision expected in French communication.": "私たちのAIはフランス語の文化的言及、正式なレジスターバリエーション、接続法の使用、文化的概念を理解し、フランス語コミュニケーションで期待される優雅さと精度を維持する翻訳を確保します。"
};

function translateJapaneseFile() {
  try {
    const filePath = './src/lib/locales/ja.json';
    let content = fs.readFileSync(filePath, 'utf8');
    
    console.log('日本語ファイルの残りの英語コンテンツを翻訳中...');
    
    let replacedCount = 0;
    
    // 英語から日本語への翻訳
    for (const [english, japanese] of Object.entries(japaneseTranslations)) {
      const before = content;
      content = content.replace(new RegExp(escapeRegExp(english), 'g'), japanese);
      if (before !== content) {
        replacedCount++;
        console.log(`✅ 翻訳済み: "${english.substring(0, 60)}..."`);
      }
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    
    console.log(`\n🎉 日本語翻訳完了！${replacedCount}個の英文を翻訳しました。`);
    console.log('注意：ユーザーの指示に従い、"中国語SRT翻訳ツール"のような混合コンテンツはそのまま保持しました。');
    
  } catch (error) {
    console.error('❌ エラー:', error.message);
  }
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

translateJapaneseFile();