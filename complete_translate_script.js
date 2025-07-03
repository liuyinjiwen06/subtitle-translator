const fs = require('fs');

// 完整的翻译映射
const translations = {
  'zh': {
    // English Subtitle 翻译
    'English SRT Translator - Translate English Subtitles Online Free | SubTran': '英语SRT翻译器 - 免费在线翻译英语字幕 | SubTran',
    'Professional English subtitle translator. Translate SRT files from English to 30+ languages or translate any language to English. Free online tool with AI-powered accuracy.': '专业英语字幕翻译器。将SRT文件从英语翻译成30多种语言，或将任何语言翻译成英语。免费在线工具，具有AI驱动的准确性。',
    'Translate English Subtitles Instantly': '即时翻译英语字幕',
    'Translate English subtitles to 30+ languages or convert any language to English with perfect accuracy. Our specialized English SRT translator ensures natural, context-aware translations for global content distribution.': '将英语字幕翻译成30多种语言，或将任何语言完美准确地转换为英语。我们专业的英语SRT翻译器确保为全球内容分发提供自然、上下文感知的翻译。',
    '🌟 English Subtitle Solutions': '🌟 英语字幕解决方案',
    'Master the global content market with our specialized English subtitle translation technology designed for content creators and businesses.': '通过我们专为内容创作者和企业设计的专业英语字幕翻译技术，掌控全球内容市场。',
    'From English to Global Markets': '从英语到全球市场',
    'Transform your English content for international audiences with translations that preserve the original tone, humor, and cultural nuances. Our English SRT translator is specifically optimized for English source material.': '通过保持原有语调、幽默和文化细节的翻译，为国际观众转换您的英语内容。我们的英语SRT翻译器专门针对英语源材料进行了优化。',
    'To English for Global Understanding': '翻译至英语以供全球理解',
    'Convert foreign language subtitles to English with exceptional accuracy. Perfect for importing international content, educational materials, or understanding foreign media.': '以卓越的准确性将外语字幕转换为英语。非常适合导入国际内容、教育材料或理解外国媒体。',
    'English Content Optimization': '英语内容优化',
    'Our AI recognizes English-specific elements like idioms, colloquialisms, cultural references, and technical terminology, ensuring translations that feel natural in the target language.': '我们的AI识别英语特有元素，如习语、口语、文化引用和技术术语，确保翻译在目标语言中感觉自然。',
    'Professional-Grade Results': '专业级结果',
    'Trusted by content creators, streaming platforms, and international businesses for high-quality English subtitle translation that meets professional standards.': '受到内容创作者、流媒体平台和国际企业的信任，提供符合专业标准的高质量英语字幕翻译。',
    
    // Chinese Subtitle 翻译
    'Chinese SRT Translator - Translate Chinese Subtitles Online Free | SubTran': '中文SRT翻译器 - 免费在线翻译中文字幕 | SubTran',
    'Professional Chinese subtitle translator. Translate SRT files from Chinese to 30+ languages or translate any language to Chinese. Free online tool with AI-powered accuracy for Simplified & Traditional Chinese.': '专业中文字幕翻译器。将SRT文件从中文翻译成30多种语言，或将任何语言翻译成中文。免费在线工具，为简体和繁体中文提供AI驱动的准确性。',
    'Professional Chinese Subtitle Translator': '专业中文字幕翻译器',
    'Translate Chinese subtitles to 30+ languages or convert any language to Chinese with perfect accuracy. Our specialized Chinese SRT translator handles both Simplified and Traditional Chinese with cultural nuance and linguistic precision.': '将中文字幕翻译成30多种语言，或将任何语言完美准确地转换为中文。我们专业的中文SRT翻译器处理简体和繁体中文，具有文化细节和语言精确性。',
    '🏮 Chinese Subtitle Solutions': '🏮 中文字幕解决方案',
    'Bridge Eastern and Western content markets with our advanced Chinese subtitle translation technology optimized for the complexities of Chinese language and culture.': '通过我们针对中文语言和文化复杂性优化的先进中文字幕翻译技术，连接东西方内容市场。',
    'From Chinese to Global Markets': '从中文到全球市场',
    'Expand your Chinese content\'s international reach with translations that preserve cultural context, linguistic subtleties, and regional expressions. Perfect for exporting Chinese entertainment, education, and business content worldwide.': '通过保持文化背景、语言细节和地区表达的翻译，扩大您的中文内容的国际影响力。完美适用于向全世界出口中国娱乐、教育和商业内容。',
    'To Chinese for Local Markets': '翻译为中文以适应本地市场',
    'Bring international content to Chinese-speaking audiences with culturally adapted translations. Ideal for streaming platforms, educational institutions, and businesses entering Chinese markets.': '通过文化适应的翻译，为中文观众带来国际内容。非常适合流媒体平台、教育机构和进入中国市场的企业。',
    'Simplified & Traditional Chinese Support': '简体和繁体中文支持',
    'Complete support for both 简体中文 (Simplified) and 繁體中文 (Traditional) Chinese, with automatic detection and cross-conversion capabilities for Hong Kong, Taiwan, and Mainland China markets.': '完全支持简体中文和繁體中文，具有自动检测和交叉转换功能，适用于香港、台湾和中国大陆市场。',
    'Cultural Adaptation Excellence': '文化适应卓越',
    'Our AI understands Chinese cultural references, idioms (成语), regional expressions, and formal/informal language patterns, ensuring translations that resonate authentically with target audiences.': '我们的AI理解中文文化引用、成语、地区表达和正式/非正式语言模式，确保翻译与目标观众产生真实共鸣。',
    
    // Spanish Subtitle 翻译
    'Spanish SRT Translator - Translate Spanish Subtitles Online Free | SubTran': '西班牙语SRT翻译器 - 免费在线翻译西班牙语字幕 | SubTran',
    'Professional Spanish subtitle translator. Translate SRT files from Spanish to 30+ languages or translate any language to Spanish. Free online tool with AI-powered accuracy for all Spanish variants.': '专业西班牙语字幕翻译器。将SRT文件从西班牙语翻译成30多种语言，或将任何语言翻译成西班牙语。免费在线工具，为所有西班牙语变体提供AI驱动的准确性。',
    'Professional Spanish Subtitle Translator': '专业西班牙语字幕翻译器',
    'Transform your content for 500+ million Spanish speakers worldwide. Our AI-powered translator delivers culturally accurate Spanish subtitles with support for regional variations including Mexican, Argentinian, Colombian, and European Spanish.': '为全球5亿多西班牙语使用者转换您的内容。我们的AI驱动翻译器提供文化准确的西班牙语字幕，支持包括墨西哥、阿根廷、哥伦比亚和欧洲西班牙语在内的地区变体。',
    '🌶️ Spanish Subtitle Solutions': '🌶️ 西班牙语字幕解决方案',
    'Bridge global markets with our advanced Spanish subtitle translation technology designed for the diverse Hispanic world.': '通过我们为多样化的西班牙语世界设计的先进西班牙语字幕翻译技术，连接全球市场。',
    'Regional Spanish Variants': '地区西班牙语变体',
    'Support for Mexican, Argentinian, Colombian, Peruvian, Venezuelan, Chilean, European Spanish and other regional variations with cultural nuances and local expressions.': '支持墨西哥、阿根廷、哥伦比亚、秘鲁、委内瑞拉、智利、欧洲西班牙语和其他地区变体，具有文化细节和当地表达。',
    'Bidirectional Translation': '双向翻译',
    'Translate from Spanish to 30+ languages or translate any language to Spanish with equal precision and cultural sensitivity.': '从西班牙语翻译到30多种语言，或将任何语言翻译成西班牙语，具有同等的精确性和文化敏感性。',
    'Cultural Adaptation': '文化适应',
    'AI engines trained on Hispanic culture, slang, idioms, and regional expressions to deliver translations that resonate with Spanish-speaking audiences.': 'AI引擎经过西班牙文化、俚语、习语和地区表达的训练，提供与西班牙语观众产生共鸣的翻译。',
    'Business Content Focus': '商业内容焦点',
    'Specialized handling of corporate content, educational materials, marketing videos, and professional communications for Spanish-speaking markets.': '专门处理企业内容、教育材料、营销视频和西班牙语市场的专业通信。',
    
    // Portuguese Subtitle 翻译
    'Portuguese SRT Translator - Translate Portuguese Subtitles Online Free | SubTran': '葡萄牙语SRT翻译器 - 免费在线翻译葡萄牙语字幕 | SubTran',
    'Professional Portuguese subtitle translator. Translate SRT files from Portuguese to 30+ languages or translate any language to Portuguese. Free online tool with AI-powered accuracy for all Portuguese variants.': '专业葡萄牙语字幕翻译器。将SRT文件从葡萄牙语翻译成30多种语言，或将任何语言翻译成葡萄牙语。免费在线工具，为所有葡萄牙语变体提供AI驱动的准确性。',
    'Translate Portuguese Subtitles Instantly': '即时翻译葡萄牙语字幕',
    'Connect with 260+ million Portuguese speakers worldwide. Our specialized Portuguese SRT translator handles Brazilian Portuguese, European Portuguese, and African Portuguese variants with cultural authenticity and linguistic precision.': '与全球2.6亿多葡萄牙语使用者建立联系。我们专业的葡萄牙语SRT翻译器处理巴西葡萄牙语、欧洲葡萄牙语和非洲葡萄牙语变体，具有文化真实性和语言精确性。',
    '🇵🇹 Portuguese Subtitle Solutions': '🇵🇹 葡萄牙语字幕解决方案',
    'Bridge Brazilian, European, and African Portuguese markets with our advanced subtitle translation technology optimized for the linguistic diversity and cultural richness of the Portuguese-speaking world.': '通过我们针对葡萄牙语世界语言多样性和文化丰富性优化的先进字幕翻译技术，连接巴西、欧洲和非洲葡萄牙语市场。',
    'Brazilian Portuguese Excellence': '巴西葡萄牙语卓越',
    'Specialized handling of Brazilian Portuguese with local expressions, cultural references, and regional variations. Perfect for reaching the massive Brazilian market with authentic, culturally relevant content.': '专门处理具有当地表达、文化引用和地区变体的巴西葡萄牙语。完美适用于通过真实、文化相关的内容到达庞大的巴西市场。',
    'European Portuguese Precision': '欧洲葡萄牙语精确性',
    'Accurate European Portuguese translations that respect formal language structures, cultural nuances, and traditional expressions used in Portugal and other European Portuguese-speaking communities.': '准确的欧洲葡萄牙语翻译，尊重葡萄牙和其他欧洲葡萄牙语社区使用的正式语言结构、文化细节和传统表达。',
    'African Portuguese Markets': '非洲葡萄牙语市场',
    'Support for Portuguese variants in Angola, Mozambique, Cape Verde, Guinea-Bissau, and São Tomé and Príncipe with region-specific cultural and linguistic adaptations.': '支持安哥拉、莫桑比克、佛得角、几内亚比绍和圣多美和普林西比的葡萄牙语变体，具有地区特定的文化和语言适应。',
    'Global Portuguese Network': '全球葡萄牙语网络',
    'Connect with Portuguese-speaking communities worldwide including Macau, East Timor, and diaspora communities with culturally appropriate and linguistically accurate translations.': '与全球葡萄牙语社区建立联系，包括澳门、东帝汶和海外社区，提供文化适当和语言准确的翻译。',
    
    // French Subtitle 翻译
    'French SRT Translator - Translate French Subtitles Online Free | SubTran': '法语SRT翻译器 - 免费在线翻译法语字幕 | SubTran',
    'Professional French subtitle translator. Translate SRT files from French to 30+ languages or translate any language to French. Free online tool with AI-powered accuracy for all French variants.': '专业法语字幕翻译器。将SRT文件从法语翻译成30多种语言，或将任何语言翻译成法语。免费在线工具，为所有法语变体提供AI驱动的准确性。',
    'Translate French Subtitles Instantly': '即时翻译法语字幕',
    'Transform French content for global audiences or bring international content to French-speaking markets. Our specialized French SRT translator handles metropolitan French, Canadian French, and African French variants with linguistic precision and cultural authenticity.': '为全球观众转换法语内容，或将国际内容带到法语市场。我们专业的法语SRT翻译器处理法国法语、加拿大法语和非洲法语变体，具有语言精确性和文化真实性。',
    '🇫🇷 French Subtitle Solutions': '🇫🇷 法语字幕解决方案',
    'Bridge French and international markets with our advanced French subtitle translation technology optimized for the elegance and cultural richness of the French language worldwide.': '通过我们针对全球法语语言的优雅和文化丰富性优化的先进法语字幕翻译技术，连接法语和国际市场。',
    'From French to Global Markets': '从法语到全球市场',
    'Expand your French content\'s international reach with translations that preserve the sophistication, cultural nuances, and linguistic beauty of French expression. Perfect for exporting French cinema, education, and cultural content worldwide.': '通过保持法语表达的精致、文化细节和语言美感的翻译，扩大您的法语内容的国际影响力。完美适用于向全世界出口法国电影、教育和文化内容。',
    'To French for Francophone Markets': '翻译为法语以适应法语市场',
    'Bring international content to the 300+ million French speakers across France, Canada, Belgium, Switzerland, and Francophone Africa with culturally adapted translations that respect French linguistic traditions.': '通过尊重法语语言传统的文化适应翻译，为法国、加拿大、比利时、瑞士和法语非洲的3亿多法语使用者带来国际内容。',
    'Regional French Mastery': '地区法语掌握',
    'Complete support for French variants including Metropolitan French (France), Quebec French (Canadian), Belgian French, Swiss French, and African French with region-specific cultural and linguistic adaptations.': '完全支持法语变体，包括法国法语、魁北克法语（加拿大）、比利时法语、瑞士法语和非洲法语，具有地区特定的文化和语言适应。',
    'Cultural & Linguistic Excellence': '文化和语言卓越',
    'Our AI understands French cultural references, formal register variations, subjunctive mood usage, and cultural concepts, ensuring translations that maintain the elegance and precision expected in French communication.': '我们的AI理解法语文化引用、正式语域变化、虚拟语气使用和文化概念，确保翻译保持法语交流中期望的优雅和精确性。',
    
    // 通用翻译
    '🌍 Supported Languages': '🌍 支持的语言',
    'Transform your English subtitles for global audiences with comprehensive language support covering major international markets.': '通过覆盖主要国际市场的全面语言支持，为全球观众转换您的英语字幕。',
    'Translate English Subtitles To:': '将英语字幕翻译为：',
    'Plus Reverse Translation:': '以及反向翻译：',
    'Chinese • Japanese • French • German • Spanish • Russian • Italian • Portuguese • Arabic • Hindi • Korean • Thai • Vietnamese • Turkish • Polish • Dutch • Swedish • Danish • Norwegian • Finnish • Czech • Hungarian • Romanian • Bulgarian • Croatian • Slovak • Slovenian • Estonian • Latvian • Lithuanian': '中文 • 日语 • 法语 • 德语 • 西班牙语 • 俄语 • 意大利语 • 葡萄牙语 • 阿拉伯语 • 印地语 • 韩语 • 泰语 • 越南语 • 土耳其语 • 波兰语 • 荷兰语 • 瑞典语 • 丹麦语 • 挪威语 • 芬兰语 • 捷克语 • 匈牙利语 • 罗马尼亚语 • 保加利亚语 • 克罗地亚语 • 斯洛伐克语 • 斯洛文尼亚语 • 爱沙尼亚语 • 拉脱维亚语 • 立陶宛语',
    'Translate any of these languages back to English with the same professional quality and cultural understanding.': '将这些语言中的任何一种翻译回英语，具有相同的专业质量和文化理解。',
    'Connect Chinese content with global audiences through comprehensive language support covering major international markets.': '通过覆盖主要国际市场的全面语言支持，将中文内容与全球观众连接。',
    'Translate Chinese Subtitles To:': '将中文字幕翻译为：',
    'English • Japanese • Korean • French • German • Spanish • Russian • Italian • Portuguese • Arabic • Hindi • Thai • Vietnamese • Turkish • Polish • Dutch • Swedish • Danish • Norwegian • Finnish • Czech • Hungarian • Romanian • Bulgarian • Croatian • Slovak • Slovenian • Estonian • Latvian • Lithuanian': '英语 • 日语 • 韩语 • 法语 • 德语 • 西班牙语 • 俄语 • 意大利语 • 葡萄牙语 • 阿拉伯语 • 印地语 • 泰语 • 越南语 • 土耳其语 • 波兰语 • 荷兰语 • 瑞典语 • 丹麦语 • 挪威语 • 芬兰语 • 捷克语 • 匈牙利语 • 罗马尼亚语 • 保加利亚语 • 克罗地亚语 • 斯洛伐克语 • 斯洛文尼亚语 • 爱沙尼亚语 • 拉脱维亚语 • 立陶宛语',
    'Translate any of these languages to Chinese (Simplified or Traditional) with the same cultural sensitivity and linguistic accuracy.': '将这些语言中的任何一种翻译为中文（简体或繁体），具有相同的文化敏感性和语言准确性。',
    'Connect Spanish content with global audiences through comprehensive language support covering major world languages.': '通过覆盖主要世界语言的全面语言支持，将西班牙语内容与全球观众连接。',
    'Translate Spanish Subtitles To:': '将西班牙语字幕翻译为：',
    'Translate any of these languages to Spanish with the same regional sensitivity and cultural accuracy, supporting both Latin American and European Spanish variants.': '将这些语言中的任何一种翻译为西班牙语，具有相同的地区敏感性和文化准确性，支持拉丁美洲和欧洲西班牙语变体。',
    'Connect Portuguese content with global audiences through comprehensive language support covering major international markets and regional Portuguese variations.': '通过覆盖主要国际市场和地区葡萄牙语变体的全面语言支持，将葡萄牙语内容与全球观众连接。',
    'Translate Portuguese Subtitles To:': '将葡萄牙语字幕翻译为：',
    'Translate any of these languages to Portuguese with regional preference settings for Brazil, Portugal, or other Portuguese-speaking markets with appropriate cultural adaptation.': '将这些语言中的任何一种翻译为葡萄牙语，为巴西、葡萄牙或其他葡萄牙语市场提供地区偏好设置，具有适当的文化适应。',
    'Connect French content with global audiences through comprehensive language support covering major international markets.': '通过覆盖主要国际市场的全面语言支持，将法语内容与全球观众连接。',
    'Translate French Subtitles To:': '将法语字幕翻译为：',
    'Translate any of these languages to French with regional preference settings for France, Quebec, Belgium, or other French-speaking markets.': '将这些语言中的任何一种翻译为法语，为法国、魁北克、比利时或其他法语市场提供地区偏好设置。',
    '🔧 English Content Optimization': '🔧 英语内容优化',
    'Advanced features specifically designed to handle the complexities and nuances of English language content.': '专门设计用于处理英语语言内容的复杂性和细节的高级功能。',
    'Cultural Context Recognition': '文化背景识别',
    'Our AI understands English cultural references, pop culture mentions, and regional expressions, ensuring translations that resonate with target audiences rather than literal word-for-word conversions.': '我们的AI理解英语文化引用、流行文化提及和地区表达，确保翻译与目标观众产生共鸣，而不是逐字逐句的字面转换。',
    'Technical English Handling': '技术英语处理',
    'Specialized processing for business English, academic English, technical documentation, and industry-specific terminology commonly found in professional English content.': '专门处理商务英语、学术英语、技术文档和专业英语内容中常见的行业特定术语。',
    'Tone Preservation': '语调保持',
    'Maintains the original tone whether it\'s casual YouTube content, formal business presentations, educational material, or entertainment media.': '保持原始语调，无论是休闲的YouTube内容、正式的商业演示、教育材料还是娱乐媒体。',
    'English Grammar Optimization': '英语语法优化',
    'Recognizes complex English grammar structures, passive voice, conditional statements, and converts them appropriately for target language grammar rules.': '识别复杂的英语语法结构、被动语态、条件句，并为目标语言语法规则进行适当转换。',
    '🀄 Chinese Language Optimization': '🀄 中文语言优化',
    'Advanced processing specifically designed for the unique characteristics and complexities of Chinese language content.': '专门设计用于处理中文语言内容的独特特征和复杂性的高级处理。',
    'Character Recognition & Context': '字符识别和上下文',
    'Advanced processing of Chinese characters with contextual understanding, handling homonyms, tone variations, and meaning disambiguation based on surrounding context.': '通过上下文理解对中文字符进行高级处理，处理同音词、声调变化，并基于周围上下文进行意义消歧。',
    'Idiom & Proverb Handling': '成语和谚语处理',
    'Specialized recognition and translation of Chinese idioms (成语), proverbs (谚语), and classical references with cultural equivalent matching rather than literal translation.': '专门识别和翻译中文成语、谚语和古典引用，采用文化等价匹配而不是字面翻译。',
    'Regional Variant Processing': '地区变体处理',
    'Intelligent handling of Mainland Chinese, Taiwanese, Hong Kong, and Singapore Chinese variants, including regional vocabulary, expressions, and cultural preferences.': '智能处理中国大陆、台湾、香港和新加坡的中文变体，包括地区词汇、表达和文化偏好。',
    'Formal & Informal Register': '正式和非正式语域',
    'Accurate detection and preservation of formal (书面语) versus informal (口语) language styles, ensuring appropriate tone matching in target languages.': '准确检测和保持正式（书面语）与非正式（口语）语言风格，确保在目标语言中进行适当的语调匹配。',
    '🌮 Spanish Language Optimization': '🌮 西班牙语语言优化',
    'Advanced processing specifically designed for the unique characteristics and regional complexities of Spanish language content.': '专门设计用于处理西班牙语语言内容的独特特征和地区复杂性的高级处理。',
    'Spanish Grammar Mastery': '西班牙语语法掌握',
    'Advanced handling of Spanish verb conjugations, gender agreements, subjunctive mood, and complex grammatical structures.': '高级处理西班牙语动词变位、性别一致、虚拟语气和复杂语法结构。',
    'Regional Dialect Support': '地区方言支持',
    'Intelligent recognition and translation of regional Spanish variants including Mexican, Argentinian, Colombian, and European Spanish dialects.': '智能识别和翻译地区西班牙语变体，包括墨西哥、阿根廷、哥伦比亚和欧洲西班牙语方言。',
    'Cultural Context Awareness': '文化背景意识',
    'AI trained on Hispanic cultural references, idioms, slang, and colloquialisms for authentic Spanish translations.': 'AI经过西班牙文化引用、习语、俚语和口语的训练，提供真实的西班牙语翻译。',
    'Formal vs Informal Register': '正式与非正式语域',
    'Appropriate handling of tú/usted distinctions and formal/informal language registers based on content context.': '基于内容上下文，适当处理tú/usted区别和正式/非正式语言语域。',
    '🎯 Portuguese Language Optimization': '🎯 葡萄牙语语言优化',
    'Advanced processing specifically designed for the grammatical complexity and cultural diversity of Portuguese language content across different regions.': '专门设计用于处理不同地区葡萄牙语语言内容的语法复杂性和文化多样性的高级处理。',
    'Regional Variant Mastery': '地区变体掌握',
    'Intelligent handling of differences between Brazilian Portuguese, European Portuguese, and African Portuguese variants including vocabulary, pronunciation markers, and cultural references.': '智能处理巴西葡萄牙语、欧洲葡萄牙语和非洲葡萄牙语变体之间的差异，包括词汇、发音标记和文化引用。',
    'Grammar & Conjugation Excellence': '语法和变位卓越',
    'Advanced processing of Portuguese verb conjugations, subjunctive mood, formal/informal registers (você/tu), and complex grammatical structures that vary across regions.': '高级处理葡萄牙语动词变位、虚拟语气、正式/非正式语域（você/tu）和因地区而异的复杂语法结构。',
    'Cultural Context Awareness': '文化背景意识',
    'AI trained on Portuguese cultural references, regional expressions, local customs, and colloquialisms from Brazil, Portugal, and Lusophone Africa for authentic translations.': 'AI经过葡萄牙文化引用、地区表达、当地习俗和来自巴西、葡萄牙和葡语非洲的口语训练，提供真实翻译。',
    'Professional Portuguese': '专业葡萄牙语',
    'Specialized handling of business terminology, formal communications, and professional content with appropriate register and cultural sensitivity for different Portuguese-speaking markets.': '专门处理商业术语、正式通信和专业内容，为不同的葡萄牙语市场提供适当的语域和文化敏感性。',
    '🎭 French Language Optimization': '🎭 法语语言优化',
    'Advanced processing specifically designed for the sophisticated grammar structure and cultural nuances of French language content.': '专门设计用于处理法语语言内容的精致语法结构和文化细节的高级处理。',
    'Formal Register & Politeness': '正式语域和礼貌',
    'Intelligent handling of French formality levels including vous/tu distinctions, subjunctive mood usage, and appropriate register matching for professional, academic, or casual content contexts.': '智能处理法语正式程度，包括vous/tu区别、虚拟语气使用，以及为专业、学术或休闲内容上下文进行适当的语域匹配。',
    'Literary & Cultural Expression': '文学和文化表达',
    'Specialized processing of French idioms, expressions, cultural references, and literary devices with culturally appropriate equivalent matching that preserves French sophistication and wit.': '专门处理法语习语、表达、文化引用和文学手法，采用文化适当的等价匹配，保持法语的精致和机智。',
    'Francophone Variant Processing': '法语变体处理',
    'Smart adaptation for specific French-speaking regions, understanding cultural preferences, local terminology, and regional sensitivities for France, Quebec, Belgium, Switzerland, and Africa.': '为特定法语地区进行智能适应，理解法国、魁北克、比利时、瑞士和非洲的文化偏好、当地术语和地区敏感性。',
    'Linguistic Precision & Grammar': '语言精确性和语法',
    'Advanced handling of complex French grammar including subjunctive constructions, past participle agreements, and sophisticated sentence structures that maintain linguistic accuracy in translations.': '高级处理复杂的法语语法，包括虚拟语气结构、过去分词一致和精致的句子结构，在翻译中保持语言准确性。',
    
    // 行业应用翻译
    '🏢 Industry Applications': '🏢 行业应用',
    'Discover how professionals across industries rely on our English subtitle translator for their content localization needs.': '了解各行业专业人士如何依赖我们的英语字幕翻译器满足他们的内容本地化需求。',
    'Content Creation & Streaming': '内容创作和流媒体',
    'YouTube Creators: Expand your English channel\'s reach to international audiences with professional subtitle translation that maintains your personality and brand voice.': 'YouTube创作者：通过保持您的个性和品牌声音的专业字幕翻译，将您的英语频道的影响力扩展到国际观众。',
    'Streaming Platforms: Professional-grade English subtitle translation for Netflix, Amazon Prime, and other platforms requiring high-quality localization.': '流媒体平台：为Netflix、Amazon Prime和其他需要高质量本地化的平台提供专业级英语字幕翻译。',
    'Business & Corporate': '商业和企业',
    'Training Videos: Translate English corporate training materials and onboarding content for international teams and global subsidiaries.': '培训视频：为国际团队和全球子公司翻译英语企业培训材料和入职内容。',
    'Marketing Content: Localize English promotional videos, product demos, and brand content for international markets with culturally appropriate translations.': '营销内容：为国际市场本地化英语促销视频、产品演示和品牌内容，提供文化适当的翻译。',
    'Education & E-Learning': '教育和在线学习',
    'Online Courses: Make English educational content accessible to global learners with accurate, pedagogically sound subtitle translations.': '在线课程：通过准确、教学合理的字幕翻译，使全球学习者能够访问英语教育内容。',
    'Academic Content: Translate English lectures, research presentations, and educational videos for international academic exchange.': '学术内容：为国际学术交流翻译英语讲座、研究演示和教育视频。',
    'Entertainment Industry': '娱乐行业',
    'Film & TV: Professional English subtitle translation for international distribution of English-language entertainment content.': '电影和电视：为英语娱乐内容的国际发行提供专业英语字幕翻译。',
    'Documentary Translation: Bring English documentaries to global audiences or translate international documentaries into English.': '纪录片翻译：将英语纪录片带给全球观众，或将国际纪录片翻译成英语。',
    'Discover how Chinese content creators and international businesses leverage our Chinese subtitle translator for market expansion.': '了解中国内容创作者和国际企业如何利用我们的中文字幕翻译器进行市场扩张。',
    'Entertainment & Media': '娱乐和媒体',
    'Chinese Drama & Film: Translate Chinese TV shows, movies, and web series for international streaming platforms with cultural authenticity.': '中国戏剧和电影：为国际流媒体平台翻译中国电视剧、电影和网络剧，具有文化真实性。',
    'Content Creators: Help Chinese YouTubers, Bilibili creators, and social media influencers reach global audiences while maintaining their unique voice.': '内容创作者：帮助中国YouTube用户、B站创作者和社交媒体影响者在保持独特声音的同时接触全球观众。',
    'Business & E-commerce': '商业和电子商务',
    'Corporate Training: Localize Chinese business content for international subsidiaries or translate global content for Chinese markets.': '企业培训：为国际子公司本地化中国商业内容，或为中国市场翻译全球内容。',
    'Product Marketing: Adapt marketing videos and product demonstrations between Chinese and international markets with cultural sensitivity.': '产品营销：在中国和国际市场之间适应营销视频和产品演示，具有文化敏感性。',
    'Education & Culture': '教育和文化',
    'Language Learning: Create bilingual educational content for Chinese language learners or Chinese students studying foreign languages.': '语言学习：为中文学习者或学习外语的中国学生创建双语教育内容。',
    'Cultural Exchange: Translate documentaries, lectures, and cultural content to promote understanding between Chinese and international communities.': '文化交流：翻译纪录片、讲座和文化内容，促进中国和国际社区之间的理解。',
    'Digital Content': '数字内容',
    'Live Streaming: Real-time subtitle translation for Chinese streamers expanding internationally or international content entering Chinese platforms.': '直播：为国际扩张的中国主播或进入中国平台的国际内容提供实时字幕翻译。',
    'Online Courses: Make Chinese MOOCs accessible globally or bring international education content to Chinese learners.': '在线课程：使中国MOOC全球可访问，或为中国学习者带来国际教育内容。',
    
    // 质量和准确性翻译
    '🏆 Quality & Accuracy': '🏆 质量和准确性',
    'Experience superior translation quality with our English-specialized AI engines and quality assurance processes.': '通过我们专门针对英语的AI引擎和质量保证流程，体验卓越的翻译质量。',
    '🤖 Dual AI Engine Advantage': '🤖 双AI引擎优势',
    'Google Translate for English: Optimized for English\'s complex grammar and extensive vocabulary, providing fast, reliable translations for standard content.': 'Google翻译英语版：针对英语复杂语法和广泛词汇进行优化，为标准内容提供快速、可靠的翻译。',
    'OpenAI for English: Advanced contextual understanding of English nuances, idioms, and cultural references, delivering human-like translation quality.': 'OpenAI英语版：对英语细节、习语和文化引用的高级上下文理解，提供类人翻译质量。',
    '✅ English-Specific Quality Checks': '✅ 英语特定质量检查',
    'Grammar Verification: Ensures target language grammar rules are properly applied': '语法验证：确保正确应用目标语言语法规则',
    'Cultural Adaptation: Adapts English cultural references for target audiences': '文化适应：为目标观众适应英语文化引用',
    'Terminology Consistency: Maintains consistent translation of technical terms': '术语一致性：保持技术术语的一致翻译',
    'Tone Matching: Preserves the original English tone and style': '语调匹配：保持原始英语语调和风格',
    '📊 Accuracy Metrics': '📊 准确度指标',
    '95%+ Accuracy for standard English content': '标准英语内容95%+准确率',
    'Context Recognition for 10,000+ English idioms and expressions': '10,000多个英语习语和表达的上下文识别',
    'Cultural Reference Database covering English-speaking regions': '覆盖英语地区的文化引用数据库',
    'Technical Terminology support for 50+ industries': '50多个行业的技术术语支持',
    
    // 技术规格翻译
    '⚡ Technical Specifications': '⚡ 技术规格',
    'Built specifically to handle the technical requirements of English subtitle translation with professional reliability.': '专门构建以处理英语字幕翻译的技术要求，具有专业可靠性。',
    '⚡ Processing Capabilities': '⚡ 处理能力',
    'File Size: Up to 10MB (typically 8-12 hours of content)': '文件大小：最多10MB（通常8-12小时内容）',
    'Format Support: Standard SRT format with full character support': '格式支持：标准SRT格式，完全字符支持',
    'Speed: 10-30 seconds processing time for most files': '速度：大多数文件10-30秒处理时间',
    'Quality: 95%+ accuracy with advanced AI engines': '质量：采用先进AI引擎95%+准确率',
    '🚀 Advanced Features': '🚀 高级功能',
    'Smart Context Recognition: Understands idioms, cultural references, and technical terminology': '智能上下文识别：理解习语、文化引用和技术术语',
    'Multiple Engine Options: Choose between Google Translate and OpenAI based on your content type': '多引擎选项：根据您的内容类型在Google翻译和OpenAI之间选择',
    'Tone Preservation: Maintains original style whether casual, formal, or technical': '语调保持：保持原始风格，无论是休闲、正式还是技术性的',
    'Regional Adaptation: Supports different English variants and target language preferences': '地区适应：支持不同的英语变体和目标语言偏好',
    '🛡️ Quality Assurance': '🛡️ 质量保证',
    'Smart Processing: Grammar, spelling, and formatting validation': '智能处理：语法、拼写和格式验证',
    'Cultural Adaptation: Automatic handling of cultural references and context': '文化适应：自动处理文化引用和上下文',
    'Consistency Checks: Terminology consistency across long documents': '一致性检查：长文档中的术语一致性',
    'Perfect Formatting: Maintains original SRT timing and structure': '完美格式：保持原始SRT时序和结构',
    
    // FAQ翻译
    '❓ Frequently Asked Questions': '❓ 常见问题',
    'Get answers to common questions about our English subtitle translation service.': '获取关于我们英语字幕翻译服务的常见问题答案。',
    'How accurate are the translations?': '翻译准确度如何？',
    'Our dual AI engines achieve 95%+ accuracy for standard content. Google Translate excels at speed and broad language support, while OpenAI provides more nuanced, contextually aware translations.': '我们的双AI引擎对标准内容达到95%+的准确率。Google翻译在速度和广泛语言支持方面表现出色，而OpenAI提供更细致、上下文感知的翻译。',
    'What\'s the maximum file size I can upload?': '我可以上传的最大文件大小是多少？',
    'You can upload SRT files up to 10MB, which typically contains 8-12 hours of subtitle content - perfect for full-length movies or comprehensive course materials.': '您可以上传最多10MB的SRT文件，通常包含8-12小时的字幕内容 - 完美适用于长篇电影或综合课程材料。',
    'How long does the translation process take?': '翻译过程需要多长时间？',
    'Most files are processed within 10-30 seconds, depending on file size and complexity. Our optimized servers ensure fast turnaround without compromising quality.': '大多数文件在10-30秒内处理完成，取决于文件大小和复杂性。我们优化的服务器确保快速周转而不妥协质量。',
    'Do you store my subtitle files?': '您会存储我的字幕文件吗？',
    'No, your files are automatically deleted after translation for complete privacy. We never store, share, or use your content for any other purpose.': '不，您的文件在翻译后自动删除以确保完全隐私。我们从不存储、共享或将您的内容用于任何其他目的。',
    'Can I translate the same file to multiple languages?': '我可以将同一文件翻译成多种语言吗？',
    'Yes, you can translate the same English subtitle file to as many different languages as needed. Each translation maintains the original timing and formatting.': '是的，您可以将同一英语字幕文件翻译成所需的任意多种不同语言。每个翻译都保持原始时序和格式。',
    'Which translation engine should I choose?': '我应该选择哪个翻译引擎？',
    'For speed and standard content, choose Google Translate. For creative content with idioms, humor, or cultural references, OpenAI typically provides more natural results.': '对于速度和标准内容，选择Google翻译。对于包含习语、幽默或文化引用的创意内容，OpenAI通常提供更自然的结果。'
  }
};

// 递归翻译函数
function translateValue(value, langCode) {
  if (typeof value === 'string') {
    return translations[langCode]?.[value] || value;
  } else if (Array.isArray(value)) {
    return value.map(item => translateValue(item, langCode));
  } else if (typeof value === 'object' && value !== null) {
    const result = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = translateValue(val, langCode);
    }
    return result;
  }
  return value;
}

// 主函数
function main() {
  try {
    console.log('开始完整翻译所有字幕页面内容...');
    
    // 读取英语源文件
    const enFilePath = '/Users/liuyinjiwen/Documents/coding/sub-trans4/src/lib/locales/en.json';
    const enContent = JSON.parse(fs.readFileSync(enFilePath, 'utf8'));
    
    console.log('找到源内容，开始翻译...');
    
    // 需要翻译的section列表
    const sectionsToTranslate = ['englishSubtitle', 'chineseSubtitle', 'spanishSubtitle', 'portugueseSubtitle', 'frenchSubtitle'];
    
    // 需要翻译的语言列表
    const targetLanguages = ['zh', 'es', 'fr', 'de', 'ja', 'ko', 'pt', 'ru', 'it', 'ar', 'hi', 'th', 'vi', 'tr', 'pl', 'nl', 'sv'];
    
    // 遍历所有目标语言
    for (const langCode of targetLanguages) {
      console.log(`正在翻译到 ${langCode}...`);
      
      const targetFilePath = `/Users/liuyinjiwen/Documents/coding/sub-trans4/src/lib/locales/${langCode}.json`;
      
      // 读取目标语言文件
      let targetContent = {};
      if (fs.existsSync(targetFilePath)) {
        targetContent = JSON.parse(fs.readFileSync(targetFilePath, 'utf8'));
      }
      
      // 翻译每个section
      for (const sectionName of sectionsToTranslate) {
        const sectionContent = enContent[sectionName];
        if (sectionContent) {
          console.log(`  - 翻译 ${sectionName}...`);
          const translatedContent = translateValue(sectionContent, langCode);
          targetContent[sectionName] = translatedContent;
        } else {
          console.log(`  - 警告: 未找到 ${sectionName} 内容`);
        }
      }
      
      // 写入文件
      fs.writeFileSync(targetFilePath, JSON.stringify(targetContent, null, 2), 'utf8');
      
      console.log(`✅ ${langCode} 翻译完成`);
    }
    
    console.log('🎉 所有语言翻译完成！');
    console.log(`翻译的sections: ${sectionsToTranslate.join(', ')}`);
    console.log(`翻译的语言: ${targetLanguages.join(', ')}`);
    
  } catch (error) {
    console.error('翻译过程中出现错误:', error);
  }
}

// 运行脚本
main();