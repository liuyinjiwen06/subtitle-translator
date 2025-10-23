const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/lib/locales');
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json') && !f.includes('.backup'));

files.forEach(file => {
  const locale = file.replace('.json', '');
  const jsonPath = path.join(localesDir, file);
  const tsPath = path.join(localesDir, `${locale}.ts`);

  const content = fs.readFileSync(jsonPath, 'utf8');
  const data = JSON.parse(content);

  const tsContent = `// Auto-generated from ${locale}.json
export default ${JSON.stringify(data, null, 2)} as const;
`;

  fs.writeFileSync(tsPath, tsContent);
  console.log(`✅ Converted ${locale}.json to ${locale}.ts`);
});

console.log(`\n✨ Converted ${files.length} locale files to TypeScript modules`);
