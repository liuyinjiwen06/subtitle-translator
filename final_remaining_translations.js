const fs = require('fs');

// 最后剩余的翻译
const remainingTranslations = {
  "Business & Corporate": "商业和企业",
  "Education & E-Learning": "教育和电子学习", 
  "Entertainment Industry": "娱乐行业",
  "Entertainment & Media": "娱乐和媒体",
  "Business Terminology: Accurate translation of Portuguese business and technical terms": "商业术语：葡萄牙语商业和技术术语的准确翻译",
  "Business & Technical Precision for specialized content requiring professional Portuguese terminology": "专业内容的商业和技术精确性，需要专业的葡萄牙语术语",
  "Business Language Processing: Specialized handling of Portuguese business and technical terminology": "商业语言处理：专门处理葡萄牙语商业和技术术语",
  "AI Technology": "AI技术",
  
  // 其他可能的英文内容
  "Business & Marketing": "商业和营销",
  "Technology & Software": "技术和软件",
  "Business & Commerce": "商业和贸易",
  "Education & Training": "教育和培训",
  "Digital & Technology": "数字和技术",
  "Cinema & Entertainment": "电影和娱乐",
  "Cultural & Media Content": "文化和媒体内容",
  
  // 完整句子
  "Corporate Communications: Adapt business presentations, training materials, and corporate videos for Brazilian and European markets.": "企业沟通：为巴西和欧洲市场适应商业演示、培训材料和企业视频。",
  "E-commerce: Translate product videos, promotional content, and marketing materials for Lusophone online shoppers and digital commerce.": "电子商务：为葡语在线购物者和数字商务翻译产品视频、宣传内容和营销材料。",
  "Online Learning: Translate educational content for students across Brazil, Portugal, and Lusophone Africa with culturally appropriate examples.": "在线学习：为巴西、葡萄牙和葡语非洲的学生翻译教育内容，提供文化适当的例子。",
  "Professional Training: Adapt corporate training, certification programs, and skill development content for Lusophone professionals.": "专业培训：为葡语专业人士适应企业培训、认证项目和技能发展内容。",
  "Content Creators: Help Lusophone YouTubers and digital influencers reach international audiences while maintaining authentic cultural perspective.": "内容创作者：帮助葡语YouTube用户和数字影响者接触国际观众，同时保持真实的文化视角。",
  "Gaming Industry: Translate gaming content, live streams, and esports coverage for the growing gaming community, especially in Brazil.": "游戏行业：为不断增长的游戏社区翻译游戏内容、直播和电子竞技报道，特别是在巴西。",
  
  // 法语内容
  "Corporate Communications: Localize business presentations, training materials, and corporate videos for French-speaking markets or translate French business content for international expansion.": "企业沟通：为法语市场本地化商业演示、培训材料和企业视频，或为国际扩张翻译法语商业内容。",
  "Academic Content: Adapt educational materials, lectures, and research content between French and international academic communities with scholarly precision.": "学术内容：在法语和国际学术界之间以学术精确性适应教育材料、讲座和研究内容。",
  "Cultural Programming: Translate French cultural programs, art documentaries, and educational content to promote French culture globally or bring international perspectives to French audiences.": "文化节目：翻译法语文化节目、艺术纪录片和教育内容，以在全球推广法语文化或为法语观众带来国际视角。",
  "News & Journalism: Professional subtitle translation for French news content, interviews, and documentary programming requiring journalistic accuracy and cultural context.": "新闻和新闻业：为需要新闻准确性和文化背景的法语新闻内容、采访和纪录片节目提供专业字幕翻译。",
  "Content Creation: Help French-speaking YouTubers, content creators, and digital influencers reach international audiences while maintaining their authentic French voice and cultural perspective.": "内容创作：帮助法语YouTube用户、内容创作者和数字影响者接触国际观众，同时保持他们真实的法语声音和文化视角。",
  "E-learning Platforms: Translate online courses, webinars, and educational technology content for French-speaking learners or global French language education.": "电子学习平台：为法语学习者或全球法语教育翻译在线课程、网络研讨会和教育技术内容。"
};

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
}

function main() {
  try {
    const zhPath = './src/lib/locales/zh.json';
    let content = fs.readFileSync(zhPath, 'utf8');
    
    console.log('处理最后剩余的英文内容...');
    let replacedCount = 0;
    
    for (const [english, chinese] of Object.entries(remainingTranslations)) {
      const before = content;
      content = content.replace(new RegExp(escapeRegExp(english), 'g'), chinese);
      if (before !== content) {
        replacedCount++;
        console.log(`✅ 已替换: "${english.substring(0, 50)}..."`);
      }
    }
    
    fs.writeFileSync(zhPath, content, 'utf8');
    
    console.log(`\\n🎉 最终处理完成！共替换了 ${replacedCount} 个英文内容`);
    console.log('现在zh.json文件应该已经完全中文化了！');
    
  } catch (error) {
    console.error('❌ 处理过程中出错:', error.message);
  }
}

main();