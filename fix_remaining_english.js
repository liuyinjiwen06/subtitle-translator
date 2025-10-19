const fs = require('fs');

// 需要修复的中文翻译映射
const chineseTranslations = {
  // 通用翻译
  "Translate English Subtitles Instantly": "即时翻译英语字幕",
  "Translate English subtitles to 30+ languages or convert any language to English with perfect accuracy. Our specialized English SRT translator ensures natural, context-aware translations for global content distribution.": "将英语字幕翻译成30多种语言，或将任何语言完美准确地转换为英语。我们专业的英语SRT翻译器确保为全球内容分发提供自然、上下文感知的翻译。",
  
  "🌟 English Subtitle Solutions": "🌟 英语字幕解决方案",
  "Master the global content market with our specialized English subtitle translation technology designed for content creators and businesses.": "通过我们专为内容创作者和企业设计的专业英语字幕翻译技术，掌控全球内容市场。",
  
  "From English to Global Markets": "从英语到全球市场",
  "Transform your English content for international audiences with translations that preserve the original tone, humor, and cultural nuances. Our English SRT translator is specifically optimized for English source material.": "通过保持原有语调、幽默和文化细节的翻译，为国际观众转换您的英语内容。我们的英语SRT翻译器专门针对英语源材料进行了优化。",
  
  "To English for Global Understanding": "翻译至英语以供全球理解",
  "Convert foreign language subtitles to English with exceptional accuracy. Perfect for importing international content, educational materials, or understanding foreign media.": "以卓越的准确性将外语字幕转换为英语。非常适合导入国际内容、教育材料或理解外国媒体。",
  
  "English Content Optimization": "英语内容优化",
  "Our AI recognizes English-specific elements like idioms, colloquialisms, cultural references, and technical terminology, ensuring translations that feel natural in the target language.": "我们的AI识别英语特有元素，如习语、口语、文化引用和技术术语，确保翻译在目标语言中感觉自然。",
  
  "Professional-Grade Results": "专业级结果",
  "Trusted by content creators, streaming platforms, and international businesses for high-quality English subtitle translation that meets professional standards.": "受到内容创作者、流媒体平台和国际企业的信任，提供符合专业标准的高质量英语字幕翻译。",
  
  "✅ English Expertise - Optimized for English subtitle translation": "✅ 英语专长 - 专为英语字幕翻译优化",
  "📈 30 Languages - Translate to major world languages or from them to English": "📈 30种语言 - 翻译为主要世界语言或从这些语言翻译为英语",
  "🧠 Context-Aware AI - Understands idioms, slang, and cultural references": "🧠 上下文感知AI - 理解习语、俚语和文化引用",
  "⭐ Professional Quality - Perfect for YouTube, streaming, and business content": "⭐ 专业品质 - 完美适用于YouTube、流媒体和商业内容",
  
  "🌍 Supported Languages": "🌍 支持的语言",
  "Transform your English subtitles for global audiences with comprehensive language support covering major international markets.": "通过覆盖主要国际市场的全面语言支持，为全球观众转换您的英语字幕。",
  "Translate English Subtitles To:": "将英语字幕翻译为：",
  "Plus Reverse Translation:": "以及反向翻译：",
  "Translate any of these languages back to English with the same professional quality and cultural understanding.": "将这些语言中的任何一种翻译回英语，具有相同的专业质量和文化理解。",
  
  "🔧 English Content Optimization": "🔧 英语内容优化",
  "Advanced features specifically designed to handle the complexities and nuances of English language content.": "专门设计用于处理英语语言内容复杂性和细节的高级功能。",
  
  // Languages list
  "English • Spanish • French • German • Italian • Russian • Chinese • Japanese • Korean • Arabic • Hindi • Dutch • Swedish • Danish • Norwegian • Finnish • Polish • Czech • Hungarian • Romanian • Bulgarian • Croatian • Slovak • Slovenian • Estonian • Latvian • Lithuanian • Turkish • Thai • Vietnamese": "英语 • 西班牙语 • 法语 • 德语 • 意大利语 • 俄语 • 中文 • 日语 • 韩语 • 阿拉伯语 • 印地语 • 荷兰语 • 瑞典语 • 丹麦语 • 挪威语 • 芬兰语 • 波兰语 • 捷克语 • 匈牙利语 • 罗马尼亚语 • 保加利亚语 • 克罗地亚语 • 斯洛伐克语 • 斯洛文尼亚语 • 爱沙尼亚语 • 拉脱维亚语 • 立陶宛语 • 土耳其语 • 泰语 • 越南语",
  
  "English • Chinese • Japanese • French • German • Russian • Italian • Portuguese • Arabic • Hindi • Korean • Thai • Vietnamese • Turkish • Polish • Dutch • Swedish • Danish • Norwegian • Finnish • Czech • Hungarian • Romanian • Bulgarian • Croatian • Slovak • Slovenian • Estonian • Latvian • Lithuanian": "英语 • 中文 • 日语 • 法语 • 德语 • 俄语 • 意大利语 • 葡萄牙语 • 阿拉伯语 • 印地语 • 韩语 • 泰语 • 越南语 • 土耳其语 • 波兰语 • 荷兰语 • 瑞典语 • 丹麦语 • 挪威语 • 芬兰语 • 捷克语 • 匈牙利语 • 罗马尼亚语 • 保加利亚语 • 克罗地亚语 • 斯洛伐克语 • 斯洛文尼亚语 • 爱沙尼亚语 • 拉脱维亚语 • 立陶宛语",
  
  "English • Spanish • German • Italian • Portuguese • Russian • Chinese • Japanese • Korean • Arabic • Hindi • Dutch • Swedish • Danish • Norwegian • Finnish • Polish • Czech • Hungarian • Romanian • Bulgarian • Croatian • Slovak • Slovenian • Estonian • Latvian • Lithuanian • Turkish • Thai • Vietnamese": "英语 • 西班牙语 • 德语 • 意大利语 • 葡萄牙语 • 俄语 • 中文 • 日语 • 韩语 • 阿拉伯语 • 印地语 • 荷兰语 • 瑞典语 • 丹麦语 • 挪威语 • 芬兰语 • 波兰语 • 捷克语 • 匈牙利语 • 罗马尼亚语 • 保加利亚语 • 克罗地亚语 • 斯洛伐克语 • 斯洛文尼亚语 • 爱沙尼亚语 • 拉脱维亚语 • 立陶宛语 • 土耳其语 • 泰语 • 越南语"
};

try {
  // 读取中文文件
  const zhPath = './src/lib/locales/zh.json';
  let zhContent = fs.readFileSync(zhPath, 'utf8');
  
  console.log('开始修复中文文件中的英文内容...');
  
  // 逐项替换
  let replacedCount = 0;
  for (const [english, chinese] of Object.entries(chineseTranslations)) {
    const before = zhContent;
    // 使用全局替换
    zhContent = zhContent.replace(new RegExp(escapeRegExp(english), 'g'), chinese);
    if (before !== zhContent) {
      replacedCount++;
      console.log(`✅ 已替换: "${english.substring(0, 50)}..."`);
    }
  }
  
  // 写回文件
  fs.writeFileSync(zhPath, zhContent, 'utf8');
  
  console.log(`🎉 修复完成！共替换了 ${replacedCount} 个英文内容`);
  
} catch (error) {
  console.error('❌ 修复过程中出错:', error.message);
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}