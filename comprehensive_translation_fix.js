const fs = require('fs');

// 创建一个全面的英文到中文翻译映射
function createComprehensiveTranslations() {
  return {
    // Meta和Hero部分
    "Spanish SRT Translator - Translate Spanish Subtitles Online Free | SubTran": "西班牙语SRT翻译器 - 免费在线翻译西班牙语字幕 | SubTran",
    "Professional Spanish subtitle translator. Translate SRT files from Spanish to 30+ languages or translate any language to Spanish. Free online tool with AI-powered accuracy for all Spanish variants.": "专业西班牙语字幕翻译器。将SRT文件从西班牙语翻译成30多种语言，或将任何语言翻译成西班牙语。免费在线工具，为所有西班牙语变体提供AI驱动的准确性。",
    
    "Professional Spanish Subtitle Translator": "专业西班牙语字幕翻译器",
    "Transform your content for 500+ million Spanish speakers worldwide. Our AI-powered translator delivers culturally accurate Spanish subtitles with support for regional variations including Mexican, Argentinian, Colombian, and European Spanish.": "为全球5亿多西班牙语使用者转换您的内容。我们的AI驱动翻译器提供文化准确的西班牙语字幕，支持包括墨西哥、阿根廷、哥伦比亚和欧洲西班牙语在内的地区变体。",
    
    // Solutions部分
    "🌶️ Spanish Subtitle Solutions": "🌶️ 西班牙语字幕解决方案",
    "Bridge global markets with our advanced Spanish subtitle translation technology designed for the diverse Hispanic world.": "通过我们为多样化的西班牙语世界设计的先进西班牙语字幕翻译技术，连接全球市场。",
    
    "Regional Spanish Variants": "地区西班牙语变体",
    "Support for Mexican, Argentinian, Colombian, Peruvian, Venezuelan, Chilean, European Spanish and other regional variations with cultural nuances and local expressions.": "支持墨西哥、阿根廷、哥伦比亚、秘鲁、委内瑞拉、智利、欧洲西班牙语和其他地区变体，具有文化细节和当地表达。",
    
    "Bidirectional Translation": "双向翻译",
    "Translate from Spanish to 30+ languages or translate any language to Spanish with equal precision and cultural sensitivity.": "从西班牙语翻译到30多种语言，或将任何语言翻译成西班牙语，具有同等的精确性和文化敏感性。",
    
    "Cultural Adaptation": "文化适应",
    "AI engines trained on Hispanic culture, slang, idioms, and regional expressions to deliver translations that resonate with Spanish-speaking audiences.": "AI引擎经过西班牙文化、俚语、习语和地区表达的训练，提供与西班牙语观众产生共鸣的翻译。",
    
    "Business Content Focus": "商业内容焦点",
    "Specialized handling of corporate content, educational materials, marketing videos, and professional communications for Spanish-speaking markets.": "专门处理企业内容、教育材料、营销视频和西班牙语市场的专业通信。",
    
    // Features数组
    "🇲🇽 Mexican Spanish Localization": "🇲🇽 墨西哥西班牙语本地化",
    "🇦🇷 Argentinian Spanish Support": "🇦🇷 阿根廷西班牙语支持",
    "🇪🇸 European Spanish Variations": "🇪🇸 欧洲西班牙语变体",
    "🇨🇴 Colombian Spanish Dialects": "🇨🇴 哥伦比亚西班牙语方言",
    "📚 Educational Content Optimization": "📚 教育内容优化",
    "🎬 Entertainment Industry Standards": "🎬 娱乐行业标准",
    
    // Supported Languages
    "Spanish Translation Coverage": "西班牙语翻译覆盖",
    "Connect Spanish content with global audiences through comprehensive language support covering major world languages.": "通过覆盖主要世界语言的全面语言支持，将西班牙语内容与全球观众连接。",
    "Translate Spanish Subtitles To:": "将西班牙语字幕翻译为：",
    "Translate any of these languages to Spanish with the same regional sensitivity and cultural accuracy, supporting both Latin American and European Spanish variants.": "将这些语言中的任何一种翻译为西班牙语，具有相同的地区敏感性和文化准确性，支持拉丁美洲和欧洲西班牙语变体。",
    
    // Optimization
    "🌮 Spanish Language Optimization": "🌮 西班牙语语言优化",
    "Advanced processing specifically designed for the unique characteristics and regional complexities of Spanish language content.": "专门设计用于处理西班牙语语言内容的独特特征和地区复杂性的高级处理。",
    
    "Spanish Grammar Mastery": "西班牙语语法掌握",
    "Advanced handling of Spanish verb conjugations, gender agreement, subjunctive mood, and complex grammatical structures.": "高级处理西班牙语动词变位、性别一致、虚拟语气和复杂语法结构。",
    
    "Regional Dialect Support": "地区方言支持",
    "Intelligent recognition and translation of regional Spanish variants including Mexican, Argentinian, Colombian, and European Spanish dialects.": "智能识别和翻译地区西班牙语变体，包括墨西哥、阿根廷、哥伦比亚和欧洲西班牙语方言。",
    
    "Cultural Context Awareness": "文化背景意识",
    "AI trained on Hispanic cultural references, idioms, slang, and colloquialisms to provide authentic Spanish translations.": "AI经过西班牙文化引用、习语、俚语和口语的训练，提供真实的西班牙语翻译。",
    
    "Formal vs Informal Register": "正式与非正式语域",
    "Appropriate handling of tú/usted distinctions and formal/informal language registers based on content context.": "基于内容上下文，适当处理tú/usted区别和正式/非正式语言语域。",
    
    // Industries
    "Spanish Content Industries": "西班牙语内容行业",
    "Discover how Spanish content creators and international businesses leverage our Spanish subtitle translator across diverse sectors.": "发现西班牙语内容创作者和国际企业如何在不同行业中利用我们的西班牙语字幕翻译器。",
    
    "Entertainment and Media": "娱乐和媒体",
    "Netflix, Amazon Prime, and streaming platform content localization for Spanish-speaking markets": "Netflix、Amazon Prime和流媒体平台为西班牙语市场的内容本地化",
    "Hollywood and international film distribution with Spanish subtitles for theaters and home video": "好莱坞和国际电影发行，为影院和家庭视频提供西班牙语字幕",
    "TV series, documentaries, and broadcast content for Spanish television networks": "电视剧、纪录片和西班牙电视网络的广播内容",
    "YouTube creators expanding to Spanish-speaking audiences across Latin America and Spain": "YouTube创作者扩展到拉丁美洲和西班牙的西班牙语观众",
    
    "Education & Training": "教育和培训",
    "Online course platforms like Coursera, Udemy translating educational content to Spanish": "Coursera、Udemy等在线课程平台将教育内容翻译成西班牙语",
    "Corporate training materials for Spanish-speaking employees and international teams": "为西班牙语员工和国际团队的企业培训材料",
    "University lectures, research presentations, and academic content for Spanish institutions": "大学讲座、研究演示和西班牙机构的学术内容",
    "Language learning platforms creating Spanish content for global Spanish learners": "语言学习平台为全球西班牙语学习者创建西班牙语内容",
    
    "Business & Marketing": "商业和营销",
    "Product launches, promotional videos, and marketing campaigns for Latin American markets": "拉丁美洲市场的产品发布、宣传视频和营销活动",
    "CEO messages, company announcements, and internal communications for Spanish offices": "CEO消息、公司公告和西班牙办事处的内部沟通",
    "Sales presentations, product demos, and client communications in Spanish-speaking regions": "西班牙语地区的销售演示、产品演示和客户沟通",
    "Customer support videos, tutorials, and help content for Spanish-speaking users": "为西班牙语用户的客户支持视频、教程和帮助内容",
    
    "Technology & Software": "技术和软件",
    "SaaS companies creating Spanish tutorials, onboarding, and feature explanation videos": "SaaS公司创建西班牙语教程、入门和功能解释视频",
    "Mobile app developers localizing promotional and instructional content for Spanish markets": "移动应用开发者为西班牙市场本地化宣传和教学内容",
    "Game developers translating cutscenes, tutorials, and promotional content for Spanish gamers": "游戏开发者为西班牙语玩家翻译过场动画、教程和宣传内容",
    "Tech conferences, webinars, and technical presentations for Spanish-speaking developers": "为西班牙语开发者的技术会议、网络研讨会和技术演示",
    
    // Quality
    "🏆 Spanish Translation Excellence": "🏆 西班牙语翻译卓越",
    "Experience superior Spanish translation quality with our culturally-aware AI engines optimized for Hispanic markets.": "通过我们为西班牙市场优化的文化感知AI引擎，体验卓越的西班牙语翻译质量。",
    
    "🤖 Dual AI Engine Advantage": "🤖 双AI引擎优势",
    "Optimized for speed and broad Spanish dialect coverage, excellent for general content and regional variations across Latin America.": "针对速度和广泛的西班牙语方言覆盖进行优化，非常适合一般内容和拉丁美洲的地区变体。",
    "Advanced contextual understanding of Spanish culture, idioms, and business terminology for professional and creative content.": "对西班牙文化、习语和商业术语的高级上下文理解，适用于专业和创意内容。",
    
    "✅ Spanish-Specific Quality Checks": "✅ 西班牙语特定质量检查",
    "Gender agreement validation for Spanish nouns and adjectives": "西班牙语名词和形容词的性别一致性验证",
    "Verb conjugation accuracy across all Spanish tenses and moods": "所有西班牙语时态和语气的动词变位准确性",
    "Regional dialect consistency (Mexican vs European Spanish)": "地区方言一致性（墨西哥西班牙语与欧洲西班牙语）",
    "Cultural reference appropriateness for target Spanish market": "目标西班牙市场的文化引用适当性",
    "Formal/informal register consistency (tú/usted usage)": "正式/非正式语域一致性（tú/usted使用）",
    "Spanish punctuation and formatting standards compliance": "西班牙语标点符号和格式标准合规性",
    
    "📊 Accuracy Metrics": "📊 准确度指标",
    "98%+ accuracy for Spanish grammar and syntax": "西班牙语语法和句法准确率98%+",
    "95%+ cultural relevance score for Spanish idioms and expressions": "西班牙语习语和表达的文化相关性评分95%+",
    "99%+ timing preservation for Spanish subtitle formatting": "西班牙语字幕格式的时间保持99%+",
    "Regional dialect recognition accuracy: 94%+ for major Spanish variants": "地区方言识别准确率：主要西班牙语变体94%+",
    
    // Technical
    "⚡ Spanish Technical Specifications": "⚡ 西班牙语技术规格",
    "Built specifically to handle the technical requirements of Spanish subtitle translation with regional accuracy.": "专门构建以处理具有地区准确性的西班牙语字幕翻译的技术要求。",
    
    "⚡ Processing Capabilities": "⚡ 处理能力",
    "File Size: Up to 50MB per SRT file for large Spanish content projects": "文件大小：每个SRT文件最多50MB，适用于大型西班牙语内容项目",
    "Character Limit: 1M+ characters optimized for Spanish text expansion": "字符限制：为西班牙语文本扩展优化的100万+字符",
    "Processing Speed: 2-15 seconds for typical Spanish subtitle files": "处理速度：典型西班牙语字幕文件2-15秒",
    "Quality: Professional-grade Spanish translation with regional accuracy": "质量：具有地区准确性的专业级西班牙语翻译",
    
    "🚀 Advanced Features": "🚀 高级功能",
    "Spanish dialect auto-detection (Mexican, Argentinian, European)": "西班牙语方言自动检测（墨西哥、阿根廷、欧洲）",
    "Cultural context adaptation for Spanish-speaking regions": "西班牙语地区的文化背景适应",
    "Spanish grammar validation and correction": "西班牙语语法验证和纠正",
    "Regional slang and idiom recognition": "地区俚语和习语识别",
    "Formal/informal register auto-adjustment": "正式/非正式语域自动调整",
    "Spanish subtitle timing optimization": "西班牙语字幕时间优化",
    
    "🛡️ Quality Assurance": "🛡️ 质量保证",
    "Spanish linguistic accuracy validation": "西班牙语语言准确性验证",
    "Cultural appropriateness screening": "文化适当性筛选",
    "Regional dialect consistency checks": "地区方言一致性检查",
    "Spanish subtitle formatting verification": "西班牙语字幕格式验证",
    "Content safety and appropriateness review": "内容安全和适当性审查",
    
    // FAQ
    "❓ Spanish Subtitle Translation FAQ": "❓ 西班牙语字幕翻译常见问题",
    "Get answers to common questions about our Spanish subtitle translation service and regional capabilities.": "获得关于我们的西班牙语字幕翻译服务和地区能力的常见问题答案。",
    
    "Do you support different Spanish dialects?": "您支持不同的西班牙语方言吗？",
    "Yes! We support major Spanish variants including Mexican Spanish, Argentinian Spanish, Colombian Spanish, European Spanish, and other regional dialects. Our AI recognizes regional differences and adapts translations accordingly.": "是的！我们支持主要的西班牙语变体，包括墨西哥西班牙语、阿根廷西班牙语、哥伦比亚西班牙语、欧洲西班牙语和其他地区方言。我们的AI识别地区差异并相应地调整翻译。",
    
    "How accurate are Spanish translations?": "西班牙语翻译的准确性如何？",
    "Our Spanish translations achieve 98%+ accuracy for grammar and syntax, with 95%+ cultural relevance for Spanish idioms and expressions. We use AI engines specifically trained on Hispanic content.": "我们的西班牙语翻译在语法和句法方面达到98%+的准确率，在西班牙语习语和表达的文化相关性方面达到95%+。我们使用专门在西班牙语内容上训练的AI引擎。",
    
    "How do you handle Spanish cultural references?": "您如何处理西班牙语文化引用？",
    "Our AI is trained on extensive Spanish and Latin American cultural content, ensuring proper translation of idioms, cultural references, and regional expressions while maintaining cultural authenticity.": "我们的AI在广泛的西班牙和拉丁美洲文化内容上进行训练，确保正确翻译习语、文化引用和地区表达，同时保持文化真实性。",
    
    "Can you handle formal and informal Spanish?": "您能处理正式和非正式的西班牙语吗？",
    "Absolutely! Our system recognizes context and appropriately uses tú/usted distinctions, formal vs informal vocabulary, and professional vs casual language registers based on your content type.": "绝对可以！我们的系统识别上下文并根据您的内容类型适当使用tú/usted区别、正式与非正式词汇以及专业与休闲语言语域。",
    
    "Which Spanish-speaking regions do you support?": "您支持哪些西班牙语地区？",
    "We support Spanish for all major regions including Mexico, Argentina, Colombia, Spain, Peru, Venezuela, Chile, and other Spanish-speaking countries, with cultural and linguistic adaptations for each market.": "我们支持所有主要地区的西班牙语，包括墨西哥、阿根廷、哥伦比亚、西班牙、秘鲁、委内瑞拉、智利和其他西班牙语国家，为每个市场提供文化和语言适应。",
    
    "Is this suitable for business Spanish content?": "这适合商业西班牙语内容吗？",
    "Yes! Our tool excels at business Spanish, handling corporate terminology, formal communications, marketing content, and professional presentations with appropriate cultural sensitivity for your target market.": "是的！我们的工具在商业西班牙语方面表现出色，处理企业术语、正式沟通、营销内容和专业演示，为您的目标市场提供适当的文化敏感性。"
  };
}

// 递归翻译函数
function translateObject(obj, translations) {
  if (typeof obj === 'string') {
    return translations[obj] || obj;
  } else if (Array.isArray(obj)) {
    return obj.map(item => translateObject(item, translations));
  } else if (obj !== null && typeof obj === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = translateObject(value, translations);
    }
    return result;
  }
  return obj;
}

// 主函数
function main() {
  try {
    const zhPath = './src/lib/locales/zh.json';
    
    console.log('读取zh.json文件...');
    const zhData = JSON.parse(fs.readFileSync(zhPath, 'utf8'));
    
    console.log('创建翻译映射...');
    const translations = createComprehensiveTranslations();
    
    console.log('开始翻译spanishSubtitle部分...');
    if (zhData.spanishSubtitle) {
      zhData.spanishSubtitle = translateObject(zhData.spanishSubtitle, translations);
      console.log('✅ spanishSubtitle翻译完成');
    }
    
    console.log('写回文件...');
    fs.writeFileSync(zhPath, JSON.stringify(zhData, null, 2), 'utf8');
    
    console.log('🎉 zh.json西班牙语部分翻译完成！');
    
  } catch (error) {
    console.error('❌ 翻译过程中出错:', error.message);
  }
}

main();