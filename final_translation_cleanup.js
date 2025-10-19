const fs = require('fs');

// 最终清理的翻译映射
const finalTranslations = {
  // 行业标题
  "Spanish Content Industries": "西班牙语内容行业",
  "Portuguese Content Industries": "葡萄牙语内容行业", 
  "French Content Industries": "法语内容行业",
  
  // 其他可能遗漏的标题和内容
  "Cinema & Entertainment": "电影和娱乐",
  "Business & Education": "商业和教育",
  "Cultural & Media Content": "文化和媒体内容",
  "Digital & Technology": "数字和技术",
  "Entertainment and Media": "娱乐和媒体",
  "Education & Training": "教育和培训",
  "Business & Marketing": "商业和营销",
  "Technology & Software": "技术和软件",
  "Business & Commerce": "商业和贸易",
  
  // 常见的未翻译短语
  "Discover how Spanish content creators and international businesses leverage our Spanish subtitle translator across diverse sectors.": "发现西班牙语内容创作者和国际企业如何在不同行业中利用我们的西班牙语字幕翻译器。",
  "Discover how Portuguese content creators and international businesses leverage our Portuguese subtitle translator across diverse markets and sectors.": "发现葡萄牙语内容创作者和国际企业如何在不同市场和行业中利用我们的葡萄牙语字幕翻译器。",
  "Discover how French content creators and international businesses leverage our French subtitle translator for cultural exchange and market expansion.": "发现法语内容创作者和国际企业如何利用我们的法语字幕翻译器进行文化交流和市场扩展。",
  
  // 应用描述
  "Netflix, Amazon Prime, and streaming platform content localization for Spanish-speaking markets": "Netflix、Amazon Prime和流媒体平台为西班牙语市场的内容本地化",
  "Hollywood and international film distribution with Spanish subtitles for theaters and home video": "好莱坞和国际电影发行，为影院和家庭视频提供西班牙语字幕",
  "TV series, documentaries, and broadcast content for Spanish television networks": "电视剧、纪录片和西班牙电视网络的广播内容",
  "YouTube creators expanding to Spanish-speaking audiences across Latin America and Spain": "YouTube创作者扩展到拉丁美洲和西班牙的西班牙语观众",
  
  "Online course platforms like Coursera, Udemy translating educational content to Spanish": "Coursera、Udemy等在线课程平台将教育内容翻译成西班牙语",
  "Corporate training materials for Spanish-speaking employees and international teams": "为西班牙语员工和国际团队的企业培训材料",
  "University lectures, research presentations, and academic content for Spanish institutions": "大学讲座、研究演示和西班牙机构的学术内容",
  "Language learning platforms creating Spanish content for global Spanish learners": "语言学习平台为全球西班牙语学习者创建西班牙语内容",
  
  // 葡萄牙语应用
  "Brazilian Content: Translate Brazilian entertainment for international distribution and bring global content to Brazil with cultural authenticity.": "巴西内容：将巴西娱乐内容翻译用于国际发行，并以文化真实性将全球内容带到巴西。",
  "Streaming Platforms: Help Netflix, Amazon Prime, and other platforms localize content for Lusophone audiences across Brazil, Portugal, and Africa.": "流媒体平台：帮助Netflix、Amazon Prime和其他平台为巴西、葡萄牙和非洲的葡语观众本地化内容。",
  
  // 法语应用
  "French Film Export: Translate French cinema, documentaries, and artistic content for international film festivals and streaming platforms while preserving artistic integrity and cultural depth.": "法国电影出口：为国际电影节和流媒体平台翻译法国电影、纪录片和艺术内容，同时保持艺术完整性和文化深度。",
  "International Localization: Help global streaming services adapt content for French-speaking audiences with appropriate cultural sensitivity and linguistic sophistication.": "国际本地化：帮助全球流媒体服务为法语观众适应内容，具有适当的文化敏感性和语言精致性。",
  
  // 常见问题标题
  "Do you support different Spanish dialects?": "您支持不同的西班牙语方言吗？",
  "How accurate are Spanish translations?": "西班牙语翻译的准确性如何？",
  "How do you handle Spanish cultural references?": "您如何处理西班牙语文化引用？",
  "Can you handle formal and informal Spanish?": "您能处理正式和非正式的西班牙语吗？",
  "Which Spanish-speaking regions do you support?": "您支持哪些西班牙语地区？",
  "Is this suitable for business Spanish content?": "这适合商业西班牙语内容吗？",
  
  "Do you support both Brazilian and European Portuguese?": "您支持巴西葡萄牙语和欧洲葡萄牙语吗？",
  "What's the maximum file size for Portuguese subtitles?": "葡萄牙语字幕的最大文件大小是多少？",
  "How quickly are Portuguese subtitles translated?": "葡萄牙语字幕翻译速度有多快？",
  "Is my Portuguese content secure and private?": "我的葡萄牙语内容安全且私密吗？",
  "Can I specify which type of Portuguese for my translations?": "我可以为我的翻译指定哪种类型的葡萄牙语吗？",
  "Which translation engine works best for Portuguese content?": "哪种翻译引擎最适合葡萄牙语内容？",
  
  "Which French variants do you support?": "您支持哪些法语变体？",
  "What's the maximum file size for French subtitles?": "法语字幕的最大文件大小是多少？",
  "How quickly are French subtitles translated?": "法语字幕翻译速度有多快？",
  "Is my French content secure and private?": "我的法语内容安全且私密吗？",
  "Can I specify which type of French for my translations?": "我可以为我的翻译指定哪种类型的法语吗？",
  "Which translation engine works best for French content?": "哪种翻译引擎最适合法语内容？"
};

// 替换函数
function replaceInFile(filePath, translations) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let replacedCount = 0;
    
    for (const [english, chinese] of Object.entries(translations)) {
      const before = content;
      content = content.replace(new RegExp(escapeRegExp(english), 'g'), chinese);
      if (before !== content) {
        replacedCount++;
        console.log(`✅ 已替换: "${english.substring(0, 40)}..."`);
      }
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    return replacedCount;
  } catch (error) {
    console.error(`❌ 处理文件 ${filePath} 时出错:`, error.message);
    return 0;
  }
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
}

function main() {
  console.log('开始最终翻译清理...');
  
  const zhPath = './src/lib/locales/zh.json';
  const replacedCount = replaceInFile(zhPath, finalTranslations);
  
  console.log(`\\n🎉 最终清理完成！共替换了 ${replacedCount} 个英文内容`);
}

main();