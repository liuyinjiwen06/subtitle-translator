const fs = require('fs');

// 完整的翻译映射
const allTranslations = {
  zh: {
    // 所有需要翻译的英文内容到中文的映射
    
    // 葡萄牙语部分
    "Portuguese SRT Translator - Translate Portuguese Subtitles Online Free | SubTran": "葡萄牙语SRT翻译器 - 免费在线翻译葡萄牙语字幕 | SubTran",
    "Professional Portuguese subtitle translator. Translate SRT files from Portuguese to 30+ languages or translate any language to Portuguese. Free online tool with AI-powered accuracy for all Portuguese variants.": "专业葡萄牙语字幕翻译器。将SRT文件从葡萄牙语翻译成30多种语言，或将任何语言翻译成葡萄牙语。免费在线工具，为所有葡萄牙语变体提供AI驱动的准确性。",
    
    "Translate Portuguese Subtitles Instantly": "即时翻译葡萄牙语字幕",
    "Connect with 260+ million Portuguese speakers worldwide. Our specialized Portuguese SRT translator handles Brazilian Portuguese, European Portuguese, and African Portuguese variants with cultural authenticity and linguistic precision.": "与全球2.6亿多葡萄牙语使用者建立联系。我们专业的葡萄牙语SRT翻译器处理巴西葡萄牙语、欧洲葡萄牙语和非洲葡萄牙语变体，具有文化真实性和语言精确性。",
    
    "🇵🇹 Portuguese Subtitle Solutions": "🇵🇹 葡萄牙语字幕解决方案",
    "Bridge Brazilian, European, and African Portuguese markets with our advanced subtitle translation technology optimized for the linguistic diversity and cultural richness of the Portuguese-speaking world.": "通过我们针对葡萄牙语世界语言多样性和文化丰富性优化的先进字幕翻译技术，连接巴西、欧洲和非洲葡萄牙语市场。",
    
    "Brazilian Portuguese Excellence": "巴西葡萄牙语卓越",
    "Specialized handling of Brazilian Portuguese with local expressions, cultural references, and regional variations. Perfect for reaching the massive Brazilian market with authentic, culturally relevant content.": "专门处理具有当地表达、文化引用和地区变体的巴西葡萄牙语。完美适用于通过真实、文化相关的内容到达庞大的巴西市场。",
    
    "European Portuguese Precision": "欧洲葡萄牙语精确性",
    "Accurate European Portuguese translations that respect formal language structures, cultural nuances, and traditional expressions used in Portugal and other European Portuguese-speaking communities.": "准确的欧洲葡萄牙语翻译，尊重葡萄牙和其他欧洲葡萄牙语社区使用的正式语言结构、文化细节和传统表达。",
    
    "African Portuguese Markets": "非洲葡萄牙语市场",
    "Support for Portuguese variants in Angola, Mozambique, Cape Verde, Guinea-Bissau, and São Tomé and Príncipe with region-specific cultural and linguistic adaptations.": "支持安哥拉、莫桑比克、佛得角、几内亚比绍和圣多美和普林西比的葡萄牙语变体，具有地区特定的文化和语言适应。",
    
    "Global Portuguese Network": "全球葡萄牙语网络",
    "Connect with Portuguese-speaking communities worldwide including Macau, East Timor, and diaspora communities with culturally appropriate and linguistically accurate translations.": "与全球葡萄牙语社区建立联系，包括澳门、东帝汶和海外社区，提供文化适当和语言准确的翻译。",
    
    "🇧🇷 Brazilian Portuguese - Specialized for Brazilian market and culture": "🇧🇷 巴西葡萄牙语 - 专门针对巴西市场和文化",
    "🇵🇹 European Portuguese - Authentic Portugal Portuguese language": "🇵🇹 欧洲葡萄牙语 - 正宗的葡萄牙葡萄牙语",
    "🌍 African Variants - Support for Lusophone African countries": "🌍 非洲变体 - 支持葡语非洲国家",
    "⭐ Cultural Intelligence - Understands regional expressions and customs": "⭐ 文化智能 - 理解地区表达和习俗",
    
    "Portuguese Translation Coverage": "葡萄牙语翻译覆盖",
    "Connect Portuguese content with global audiences through comprehensive language support covering major international markets and regional Portuguese variations.": "通过覆盖主要国际市场和地区葡萄牙语变体的全面语言支持，将葡萄牙语内容与全球观众连接。",
    "Translate Portuguese Subtitles To:": "将葡萄牙语字幕翻译为：",
    "Translate any of these languages to Portuguese with regional preference settings for Brazil, Portugal, or other Portuguese-speaking markets with appropriate cultural adaptation.": "将这些语言中的任何一种翻译为葡萄牙语，为巴西、葡萄牙或其他葡萄牙语市场提供地区偏好设置，具有适当的文化适应。",
    
    "🎯 Portuguese Language Optimization": "🎯 葡萄牙语语言优化",
    "Advanced processing specifically designed for the grammatical complexity and cultural diversity of different regional Portuguese language content.": "专门设计用于处理不同地区葡萄牙语语言内容的语法复杂性和文化多样性的高级处理。",
    
    "Regional Variant Mastery": "地区变体掌握",
    "Intelligent handling of differences between Brazilian Portuguese, European Portuguese, and African Portuguese variants including vocabulary, pronunciation markers, and cultural references.": "智能处理巴西葡萄牙语、欧洲葡萄牙语和非洲葡萄牙语变体之间的差异，包括词汇、发音标记和文化引用。",
    
    "Grammar and Conjugation Excellence": "语法和变位卓越",
    "Advanced handling of Portuguese verb conjugations, subjunctive mood, formal/informal registers (você/tu), and complex grammatical structures that vary by region.": "高级处理葡萄牙语动词变位、虚拟语气、正式/非正式语域（você/tu）和因地区而异的复杂语法结构。",
    
    "Cultural Context Awareness": "文化背景意识",
    "AI trained on Portuguese cultural references, regional expressions, local customs, and colloquialisms from Brazil, Portugal, and Lusophone Africa to provide authentic translations.": "AI经过葡萄牙文化引用、地区表达、当地习俗和来自巴西、葡萄牙和葡语非洲的口语训练，提供真实翻译。",
    
    "Professional Portuguese": "专业葡萄牙语",
    "Specialized handling of business terminology, formal communications, and professional content with appropriate register and cultural sensitivity for different Portuguese markets.": "专门处理商业术语、正式通信和专业内容，为不同的葡萄牙语市场提供适当的语域和文化敏感性。",
    
    // 法语部分
    "French SRT Translator - Translate French Subtitles Online Free | SubTran": "法语SRT翻译器 - 免费在线翻译法语字幕 | SubTran",
    "Professional French subtitle translator. Translate SRT files from French to 30+ languages or translate any language to French. Free online tool with AI-powered accuracy for all French variants.": "专业法语字幕翻译器。将SRT文件从法语翻译成30多种语言，或将任何语言翻译成法语。免费在线工具，为所有法语变体提供AI驱动的准确性。",
    
    "Translate French Subtitles Instantly": "即时翻译法语字幕",
    "Transform French content for global audiences or bring international content to French-speaking markets. Our specialized French SRT translator handles metropolitan French, Canadian French, and African French variants with linguistic precision and cultural authenticity.": "为全球观众转换法语内容，或将国际内容带到法语市场。我们专业的法语SRT翻译器处理法国法语、加拿大法语和非洲法语变体，具有语言精确性和文化真实性。",
    
    "🇫🇷 French Subtitle Solutions": "🇫🇷 法语字幕解决方案",
    "Bridge French and international markets with our advanced French subtitle translation technology optimized for the elegance and cultural richness of the French language worldwide.": "通过我们针对全球法语语言的优雅和文化丰富性优化的先进法语字幕翻译技术，连接法语和国际市场。",
    
    "From French to Global Markets": "从法语到全球市场",
    "Expand your French content's international reach with translations that preserve the sophistication, cultural nuances, and linguistic beauty of French expression. Perfect for exporting French cinema, education, and cultural content worldwide.": "通过保持法语表达的精致、文化细节和语言美感的翻译，扩大您的法语内容的国际影响力。完美适用于向全世界出口法国电影、教育和文化内容。",
    
    "To French for Francophone Markets": "翻译为法语以适应法语市场",
    "Bring international content to the 300+ million French speakers across France, Canada, Belgium, Switzerland, and Francophone Africa with culturally adapted translations that respect French linguistic traditions.": "通过尊重法语语言传统的文化适应翻译，为法国、加拿大、比利时、瑞士和法语非洲的3亿多法语使用者带来国际内容。",
    
    "Regional French Mastery": "地区法语掌握",
    "Complete support for French variants including Metropolitan French (France), Quebec French (Canadian), Belgian French, Swiss French, and African French with region-specific cultural and linguistic adaptations.": "完全支持法语变体，包括法国法语、魁北克法语（加拿大）、比利时法语、瑞士法语和非洲法语，具有地区特定的文化和语言适应。",
    
    "Cultural & Linguistic Excellence": "文化和语言卓越",
    "Our AI understands French cultural references, formal register variations, subjunctive mood usage, and cultural concepts, ensuring translations that maintain the elegance and precision expected in French communication.": "我们的AI理解法语文化引用、正式语域变化、虚拟语气使用和文化概念，确保翻译保持法语交流中期望的优雅和精确性。",
    
    "🇫🇷 French Expertise - Specialized for French language elegance and precision": "🇫🇷 法语专长 - 专门针对法语的优雅和精确性",
    "🌍 Regional Variants - Support for all French-speaking regions worldwide": "🌍 地区变体 - 支持全球所有法语地区",
    "🧠 Cultural Intelligence - Understands French cultural context and formality": "🧠 文化智能 - 理解法语文化背景和正式性",
    "⭐ Premium Quality - Perfect for cinema, education, and business content": "⭐ 优质品质 - 完美适用于电影、教育和商业内容",
    
    "French Translation Coverage": "法语翻译覆盖",
    "Connect French content with global audiences through comprehensive language support covering major international markets.": "通过覆盖主要国际市场的全面语言支持，将法语内容与全球观众连接。",
    "Translate French Subtitles To:": "将法语字幕翻译为：",
    "Translate any of these languages to French with regional preference settings for France, Quebec, Belgium, or other French-speaking markets.": "将这些语言中的任何一种翻译为法语，为法国、魁北克、比利时或其他法语市场提供地区偏好设置。",
    
    "🎭 French Language Optimization": "🎭 法语语言优化",
    "Advanced processing specifically designed for the sophisticated grammar structure and cultural nuances of French language content.": "专门设计用于处理法语语言内容的精致语法结构和文化细节的高级处理。",
    
    "Formal Register and Politeness": "正式语域和礼貌",
    "Intelligent handling of French formality levels including vous/tu distinctions, subjunctive usage, and appropriate register matching for professional, academic, or casual content contexts.": "智能处理法语正式程度，包括vous/tu区别、虚拟语气使用，以及为专业、学术或休闲内容上下文进行适当的语域匹配。",
    
    "Literary and Cultural Expression": "文学和文化表达",
    "Specialized handling of French idioms, expressions, cultural references, and literary devices with culturally appropriate equivalency matching that preserves French sophistication and wit.": "专门处理法语习语、表达、文化引用和文学手法，采用文化适当的等价匹配，保持法语的精致和机智。",
    
    "Francophone Variant Handling": "法语变体处理",
    "Intelligent adaptation for specific French regions, understanding cultural preferences, local terminology, and regional sensitivities across France, Quebec, Belgium, Switzerland, and Africa.": "为特定法语地区进行智能适应，理解法国、魁北克、比利时、瑞士和非洲的文化偏好、当地术语和地区敏感性。",
    
    "Linguistic Precision and Grammar": "语言精确性和语法",
    "Advanced handling of complex French grammar including subjunctive structures, past participle agreement, and sophisticated sentence construction, maintaining linguistic accuracy in translations.": "高级处理复杂的法语语法，包括虚拟语气结构、过去分词一致和精致的句子结构，在翻译中保持语言准确性。",
    
    // 行业应用
    "Portuguese Content Industries": "葡萄牙语内容行业",
    "French Content Industries": "法语内容行业",
    "Cinema & Entertainment": "电影和娱乐",
    "Business & Education": "商业和教育",
    "Cultural & Media Content": "文化和媒体内容",
    "Digital & Technology": "数字和技术",
    
    // 质量部分
    "🏆 Portuguese Translation Excellence": "🏆 葡萄牙语翻译卓越",
    "🏆 French Translation Excellence": "🏆 法语翻译卓越",
    "Experience superior Portuguese translation quality with our culturally-aware AI engines optimized for the linguistic diversity of Portuguese-speaking markets.": "通过我们针对葡萄牙语市场语言多样性优化的文化感知AI引擎，体验卓越的葡萄牙语翻译质量。",
    "Experience superior French translation quality with our culturally-aware AI engines and linguistically precise quality assurance processes.": "通过我们的文化感知AI引擎和语言精确的质量保证流程，体验卓越的法语翻译质量。",
    
    // 技术规格
    "⚡ Portuguese Technical Specifications": "⚡ 葡萄牙语技术规格",
    "⚡ French Technical Specifications": "⚡ 法语技术规格",
    "Built specifically to handle the technical requirements of Portuguese subtitle translation with regional accuracy and cultural authenticity.": "专门构建以处理具有地区准确性和文化真实性的葡萄牙语字幕翻译的技术要求。",
    "Built specifically to handle the technical requirements of French subtitle translation with linguistic precision and cultural authenticity.": "专门构建以处理具有语言精确性和文化真实性的法语字幕翻译的技术要求。",
    
    // FAQ
    "❓ Portuguese Subtitle Translation FAQ": "❓ 葡萄牙语字幕翻译常见问题",
    "❓ French Subtitle Translation FAQ": "❓ 法语字幕翻译常见问题",
    "Get answers to common questions about our Portuguese subtitle translation service and regional capabilities.": "获得关于我们的葡萄牙语字幕翻译服务和地区能力的常见问题答案。",
    "Get answers to common questions about our French subtitle translation service and regional capabilities.": "获得关于我们的法语字幕翻译服务和地区能力的常见问题答案。"
  }
};

// 递归翻译函数
function translateObject(obj, translations) {
  if (typeof obj === 'string') {
    // 检查是否有完全匹配的翻译
    if (translations[obj]) {
      return translations[obj];
    }
    
    // 如果没有完全匹配，检查是否包含需要翻译的部分
    let result = obj;
    for (const [english, chinese] of Object.entries(translations)) {
      if (result.includes(english)) {
        result = result.replace(new RegExp(escapeRegExp(english), 'g'), chinese);
      }
    }
    return result;
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

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
}

// 主函数
function main() {
  try {
    const zhPath = './src/lib/locales/zh.json';
    
    console.log('读取zh.json文件...');
    const zhData = JSON.parse(fs.readFileSync(zhPath, 'utf8'));
    
    console.log('开始全面翻译...');
    const translations = allTranslations.zh;
    
    // 翻译所有sections
    ['spanishSubtitle', 'portugueseSubtitle', 'frenchSubtitle'].forEach(section => {
      if (zhData[section]) {
        console.log(`正在翻译 ${section}...`);
        zhData[section] = translateObject(zhData[section], translations);
        console.log(`✅ ${section} 翻译完成`);
      }
    });
    
    console.log('写回文件...');
    fs.writeFileSync(zhPath, JSON.stringify(zhData, null, 2), 'utf8');
    
    console.log('🎉 所有翻译完成！');
    
  } catch (error) {
    console.error('❌ 翻译过程中出错:', error.message);
  }
}

main();