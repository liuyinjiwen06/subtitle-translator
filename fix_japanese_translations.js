const fs = require('fs');

// 日语翻译映射
const japaneseTranslations = {
  // Supported Languages
  "🌍 Supported Languages": "🌍 対応言語",
  "Transform your English subtitles for global audiences with comprehensive language support covering major international markets.": "主要な国際市場をカバーする包括的な言語サポートで、グローバル視聴者向けに英語字幕を変換します。",
  "Translate English Subtitles To:": "英語字幕の翻訳先：",
  "Plus Reverse Translation:": "および逆翻訳：",
  "Chinese • Japanese • French • German • Spanish • Russian • Italian • Portuguese • Arabic • Hindi • Korean • Thai • Vietnamese • Turkish • Polish • Dutch • Swedish • Danish • Norwegian • Finnish • Czech • Hungarian • Romanian • Bulgarian • Croatian • Slovak • Slovenian • Estonian • Latvian • Lithuanian": "中国語 • 日本語 • フランス語 • ドイツ語 • スペイン語 • ロシア語 • イタリア語 • ポルトガル語 • アラビア語 • ヒンディー語 • 韓国語 • タイ語 • ベトナム語 • トルコ語 • ポーランド語 • オランダ語 • スウェーデン語 • デンマーク語 • ノルウェー語 • フィンランド語 • チェコ語 • ハンガリー語 • ルーマニア語 • ブルガリア語 • クロアチア語 • スロバキア語 • スロベニア語 • エストニア語 • ラトビア語 • リトアニア語",
  "Translate any of these languages back to English with the same professional quality and cultural understanding.": "これらの言語のいずれかを、同じプロフェッショナルな品質と文化的理解で英語に翻訳し直すことができます。",

  // Optimization
  "🔧 English Content Optimization": "🔧 英語コンテンツ最適化",
  "Advanced features specifically designed to handle the complexities and nuances of English language content.": "英語コンテンツの複雑さとニュアンスを処理するために特別に設計された高度な機能。",
  "Cultural Context Recognition": "文化的文脈認識",
  "Our AI understands English cultural references, pop culture mentions, and regional expressions, ensuring translations that resonate with target audiences rather than literal word-for-word conversions.": "私たちのAIは、英語の文化的言及、ポップカルチャーの言及、地域的表現を理解し、直訳ではなく対象読者に響く翻訳を確保します。",
  "Technical English Handling": "専門英語の処理",
  "Specialized processing for business English, academic English, technical documentation, and industry-specific terminology commonly found in professional English content.": "プロフェッショナルな英語コンテンツによく見られるビジネス英語、学術英語、技術文書、業界固有の専門用語の専門的処理。",
  "Tone Preservation": "トーン保持",
  "Maintains the original tone whether it's casual YouTube content, formal business presentations, educational material, or entertainment media.": "カジュアルなYouTubeコンテンツ、正式なビジネスプレゼンテーション、教育材料、エンターテイメントメディアのいずれであっても、元のトーンを維持します。",
  "English Grammar Optimization": "英語文法最適化",
  "Recognizes complex English grammar structures, passive voice, conditional statements, and converts them appropriately for target language grammar rules.": "複雑な英語文法構造、受動態、条件文を認識し、ターゲット言語の文法ルールに適切に変換します。",

  // Industries
  "🏢 Industry Applications": "🏢 業界アプリケーション",
  "Discover how professionals across industries rely on our English subtitle translator for their content localization needs.": "さまざまな業界の専門家が、コンテンツローカライゼーションのニーズに私たちの英語字幕翻訳ツールをどのように活用しているかをご覧ください。",
  "Content Creation & Streaming": "コンテンツ制作・ストリーミング",
  "YouTube Creators: Expand your English channel's reach to international audiences with professional subtitle translation that maintains your personality and brand voice.": "YouTubeクリエイター：あなたの個性とブランドボイスを維持したプロフェッショナルな字幕翻訳で、英語チャンネルのリーチを国際的な視聴者に拡張します。",
  "Streaming Platforms: Professional-grade English subtitle translation for Netflix, Amazon Prime, and other platforms requiring high-quality localization.": "ストリーミングプラットフォーム：Netflix、Amazon Prime、その他の高品質ローカライゼーションを必要とするプラットフォーム向けのプロフェッショナルグレード英語字幕翻訳。",
  "Business & Corporate": "ビジネス・企業",
  "Training Videos: Translate English corporate training materials and onboarding content for international teams and global subsidiaries.": "トレーニングビデオ：国際チームやグローバル子会社向けの英語企業研修資料とオンボーディングコンテンツを翻訳。",
  "Marketing Content: Localize English promotional videos, product demos, and brand content for international markets with culturally appropriate translations.": "マーケティングコンテンツ：文化的に適切な翻訳で、国際市場向けの英語プロモーションビデオ、製品デモ、ブランドコンテンツをローカライズ。",
  "Education & E-Learning": "教育・eラーニング",
  "Online Courses: Make English educational content accessible to global learners with accurate, pedagogically sound subtitle translations.": "オンラインコース：正確で教育学的に適切な字幕翻訳で、英語教育コンテンツをグローバル学習者にアクセス可能にします。",
  "Academic Content: Translate English lectures, research presentations, and educational videos for international academic exchange.": "学術コンテンツ：国際学術交流のための英語講義、研究発表、教育ビデオを翻訳。",
  "Entertainment Industry": "エンターテイメント業界",
  "Film & TV: Professional English subtitle translation for international distribution of English-language entertainment content.": "映画・テレビ：英語エンターテイメントコンテンツの国際配信のためのプロフェッショナル英語字幕翻訳。",
  "Documentary Translation: Bring English documentaries to global audiences or translate international documentaries into English.": "ドキュメンタリー翻訳：英語ドキュメンタリーをグローバル視聴者に届けたり、国際ドキュメンタリーを英語に翻訳。",

  // Quality
  "🏆 Quality & Accuracy": "🏆 品質・精度",
  "Experience superior translation quality with our English-specialized AI engines and quality assurance processes.": "英語特化型AIエンジンと品質保証プロセスで優れた翻訳品質を体験してください。",
  "🤖 Dual AI Engine Advantage": "🤖 デュアルAIエンジンの利点",
  "Google Translate for English: Optimized for English's complex grammar and extensive vocabulary, providing fast, reliable translations for standard content.": "Google Translate for English：英語の複雑な文法と豊富な語彙に最適化され、標準コンテンツに高速で信頼性の高い翻訳を提供。",
  "OpenAI for English: Advanced contextual understanding of English nuances, idioms, and cultural references, delivering human-like translation quality.": "OpenAI for English：英語のニュアンス、イディオム、文化的言及の高度な文脈理解で、人間のような翻訳品質を提供。",
  "✅ English-Specific Quality Checks": "✅ 英語特化型品質チェック",
  "Grammar Verification: Ensures target language grammar rules are properly applied": "文法検証：ターゲット言語の文法ルールが適切に適用されることを確保",
  "Cultural Adaptation: Adapts English cultural references for target audiences": "文化的適応：ターゲット読者向けに英語の文化的言及を適応",
  "Terminology Consistency: Maintains consistent translation of technical terms": "専門用語の一貫性：技術用語の一貫した翻訳を維持",
  "Tone Matching: Preserves the original English tone and style": "トーンマッチング：元の英語のトーンとスタイルを保持",
  "📊 Accuracy Metrics": "📊 精度指標",
  "95%+ Accuracy for standard English content": "標準英語コンテンツで95%以上の精度",
  "Context Recognition for 10,000+ English idioms and expressions": "10,000以上の英語イディオムと表現の文脈認識",
  "Cultural Reference Database covering English-speaking regions": "英語圏をカバーする文化的言及データベース",
  "Technical Terminology support for 50+ industries": "50以上の業界の専門用語サポート",

  // Technical
  "⚡ Technical Specifications": "⚡ 技術仕様",
  "Built specifically to handle the technical requirements of English subtitle translation with professional reliability.": "プロフェッショナルな信頼性で英語字幕翻訳の技術的要件を処理するために特別に構築。",
  "⚡ Processing Capabilities": "⚡ 処理能力",
  "File Size: Up to 10MB (typically 8-12 hours of content)": "ファイルサイズ：最大10MB（通常8-12時間のコンテンツ）",
  "Format Support: Standard SRT format with full character support": "フォーマットサポート：完全な文字サポートを持つ標準SRTフォーマット",
  "Speed: 10-30 seconds processing time for most files": "速度：ほとんどのファイルで10-30秒の処理時間",
  "Quality: 95%+ accuracy with advanced AI engines": "品質：高度なAIエンジンで95%以上の精度",
  "🚀 Advanced Features": "🚀 高度な機能",
  "Smart Context Recognition: Understands idioms, cultural references, and technical terminology": "スマート文脈認識：イディオム、文化的言及、専門用語を理解",
  "Multiple Engine Options: Choose between Google Translate and OpenAI based on your content type": "複数エンジンオプション：コンテンツタイプに基づいてGoogle TranslateとOpenAIから選択",
  "Tone Preservation: Maintains original style whether casual, formal, or technical": "トーン保持：カジュアル、フォーマル、技術的のいずれのスタイルでも元のスタイルを維持",
  "Regional Adaptation: Supports different English variants and target language preferences": "地域適応：異なる英語バリアントとターゲット言語の好みをサポート",
  "🛡️ Quality Assurance": "🛡️ 品質保証",
  "Smart Processing: Grammar, spelling, and formatting validation": "スマート処理：文法、スペル、フォーマット検証",
  "Cultural Adaptation: Automatic handling of cultural references and context": "文化的適応：文化的言及と文脈の自動処理",
  "Consistency Checks: Terminology consistency across long documents": "一貫性チェック：長文書全体の専門用語の一貫性",
  "Perfect Formatting: Maintains original SRT timing and structure": "完璧なフォーマット：元のSRTタイミングと構造を維持",

  // FAQ
  "❓ Frequently Asked Questions": "❓ よくある質問",
  "Get answers to common questions about our English subtitle translation service.": "英語字幕翻訳サービスに関するよくある質問への回答を得る。",
  "How accurate are the translations?": "翻訳の精度はどの程度ですか？",
  "Our dual AI engines achieve 95%+ accuracy for standard content. Google Translate excels at speed and broad language support, while OpenAI provides more nuanced, contextually aware translations.": "デュアルAIエンジンは標準コンテンツで95%以上の精度を達成。Google Translateは速度と幅広い言語サポートに優れ、OpenAIはより微妙で文脈を理解した翻訳を提供します。",
  "What's the maximum file size I can upload?": "アップロードできる最大ファイルサイズは？",
  "You can upload SRT files up to 10MB, which typically contains 8-12 hours of subtitle content - perfect for full-length movies or comprehensive course materials.": "最大10MBのSRTファイルをアップロードでき、通常8-12時間の字幕コンテンツを含みます - 長編映画や包括的なコース資料に最適です。",
  "How long does the translation process take?": "翻訳プロセスにはどのくらい時間がかかりますか？",
  "Most files are processed within 10-30 seconds, depending on file size and complexity. Our optimized servers ensure fast turnaround without compromising quality.": "ファイルサイズと複雑さに応じて、ほとんどのファイルは10-30秒以内に処理されます。最適化されたサーバーが品質を妥協することなく高速ターンアラウンドを確保します。",
  "Do you store my subtitle files?": "字幕ファイルを保存しますか？",
  "No, your files are automatically deleted after translation for complete privacy. We never store, share, or use your content for any other purpose.": "いいえ、完全なプライバシーのために翻訳後にファイルは自動的に削除されます。コンテンツを他の目的で保存、共有、使用することはありません。",
  "Can I translate the same file to multiple languages?": "同じファイルを複数の言語に翻訳できますか？",
  "Yes, you can translate the same English subtitle file to as many different languages as needed. Each translation maintains the original timing and formatting.": "はい、同じ英語字幕ファイルを必要な数だけ異なる言語に翻訳できます。各翻訳は元のタイミングとフォーマットを維持します。",
  "Which translation engine should I choose?": "どの翻訳エンジンを選ぶべきですか？",
  "For speed and standard content, choose Google Translate. For creative content with idioms, humor, or cultural references, OpenAI typically provides more natural results.": "速度と標準コンテンツには、Google Translateを選択してください。イディオム、ユーモア、文化的言及を含むクリエイティブコンテンツには、OpenAIが通常より自然な結果を提供します。"
};

// 中国語部分の翻訳
const chineseTranslations = {
  "Chinese SRT Translator - Translate Chinese Subtitles Online Free | SubTran": "中国語SRT翻訳ツール - 中国語字幕をオンラインで無料翻訳 | SubTran",
  "Professional Chinese subtitle translator. Translate SRT files from Chinese to 30+ languages or translate any language to Chinese. Free online tool with AI-powered accuracy for Simplified & Traditional Chinese.": "プロフェッショナルな中国語字幕翻訳ツール。中国語から30以上の言語へ、または任意の言語から中国語へSRTファイルを翻訳。簡体字・繁体字中国語でAI駆動の精度を持つ無料オンラインツール。",
  "Professional Chinese Subtitle Translator": "プロフェッショナル中国語字幕翻訳ツール",
  "Translate Chinese subtitles to 30+ languages or convert any language to Chinese with perfect accuracy. Our specialized Chinese SRT translator handles both Simplified and Traditional Chinese with cultural nuance and linguistic precision.": "中国語字幕を30以上の言語に翻訳、または任意の言語から中国語に完璧な精度で変換。私たちの専門的な中国語SRT翻訳ツールは、文化的ニュアンスと言語的精度で簡体字・繁体字両方の中国語を処理します。",
  "🏮 Chinese Subtitle Solutions": "🏮 中国語字幕ソリューション",
  "Bridge Eastern and Western content markets with our advanced Chinese subtitle translation technology optimized for the complexities of Chinese language and culture.": "中国語と文化の複雑さに最適化された高度な中国語字幕翻訳技術で、東西のコンテンツ市場を橋渡しします。"
};

function translateFile() {
  try {
    const filePath = './src/lib/locales/ja.json';
    let content = fs.readFileSync(filePath, 'utf8');
    
    console.log('日本語ファイルの英文コンテンツを翻訳中...');
    
    let replacedCount = 0;
    
    // 英語部分の翻訳
    for (const [english, japanese] of Object.entries(japaneseTranslations)) {
      const before = content;
      content = content.replace(new RegExp(escapeRegExp(english), 'g'), japanese);
      if (before !== content) {
        replacedCount++;
        console.log(`✅ 翻訳済み: "${english.substring(0, 50)}..."`);
      }
    }
    
    // 中国語部分の翻訳
    for (const [english, japanese] of Object.entries(chineseTranslations)) {
      const before = content;
      content = content.replace(new RegExp(escapeRegExp(english), 'g'), japanese);
      if (before !== content) {
        replacedCount++;
        console.log(`✅ 翻訳済み: "${english.substring(0, 50)}..."`);
      }
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    
    console.log(`\\n🎉 日本語翻訳完了！${replacedCount}個の英文を翻訳しました。`);
    
  } catch (error) {
    console.error('❌ エラー:', error.message);
  }
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
}

translateFile();