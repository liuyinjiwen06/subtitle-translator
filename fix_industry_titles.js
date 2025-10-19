const fs = require('fs');

// 为每种语言定义行业标题翻译
const translations = {
  'ar': {
    'Spanish Content Industries': 'صناعات المحتوى الإسباني',
    'Portuguese Content Industries': 'صناعات المحتوى البرتغالي', 
    'French Content Industries': 'صناعات المحتوى الفرنسي'
  },
  'hi': {
    'Spanish Content Industries': 'स्पेनिश सामग्री उद्योग',
    'Portuguese Content Industries': 'पुर्तगाली सामग्री उद्योग',
    'French Content Industries': 'फ्रांसीसी सामग्री उद्योग'
  },
  'th': {
    'Spanish Content Industries': 'อุตสาหกรรมเนื้อหาสเปน',
    'Portuguese Content Industries': 'อุตสาหกรรมเนื้อหาโปรตุเกส',
    'French Content Industries': 'อุตสาหกรรมเนื้อหาฝรั่งเศส'
  },
  'vi': {
    'Spanish Content Industries': 'Ngành Nội dung Tiếng Tây Ban Nha',
    'Portuguese Content Industries': 'Ngành Nội dung Tiếng Bồ Đào Nha',
    'French Content Industries': 'Ngành Nội dung Tiếng Pháp'
  },
  'tr': {
    'Spanish Content Industries': 'İspanyol İçerik Endüstrileri',
    'Portuguese Content Industries': 'Portekiz İçerik Endüstrileri',
    'French Content Industries': 'Fransız İçerik Endüstrileri'
  },
  'pl': {
    'Spanish Content Industries': 'Hiszpańskie Branże Treści',
    'Portuguese Content Industries': 'Portugalskie Branże Treści',
    'French Content Industries': 'Francuskie Branże Treści'
  },
  'nl': {
    'Spanish Content Industries': 'Spaanse Content Industrieën',
    'Portuguese Content Industries': 'Portugese Content Industrieën',
    'French Content Industries': 'Franse Content Industrieën'
  },
  'sv': {
    'Spanish Content Industries': 'Spanska Innehållsindustrier',
    'Portuguese Content Industries': 'Portugisiska Innehållsindustrier',
    'French Content Industries': 'Franska Innehållsindustrier'
  }
};

function updateFile(lang, langTranslations) {
  try {
    const filePath = `./src/lib/locales/${lang}.json`;
    let content = fs.readFileSync(filePath, 'utf8');
    
    let updated = false;
    for (const [english, translated] of Object.entries(langTranslations)) {
      const before = content;
      content = content.replace(new RegExp(english, 'g'), translated);
      if (before !== content) {
        console.log(`✅ ${lang}: ${english} -> ${translated}`);
        updated = true;
      }
    }
    
    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${lang}:`, error.message);
  }
}

console.log('修复剩余语言文件的行业标题...');

for (const [lang, langTranslations] of Object.entries(translations)) {
  updateFile(lang, langTranslations);
}

console.log('\\n🎉 所有行业标题修复完成！');