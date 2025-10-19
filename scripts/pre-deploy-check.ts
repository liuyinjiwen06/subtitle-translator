/**
 * 部署前检查脚本
 * 检查所有必需的配置是否正确
 */

import * as fs from 'fs';
import * as path from 'path';

interface CheckResult {
  name: string;
  passed: boolean;
  message: string;
  suggestion?: string;
}

const checks: CheckResult[] = [];

function addCheck(
  name: string,
  passed: boolean,
  message: string,
  suggestion?: string
) {
  checks.push({ name, passed, message, suggestion });
}

console.log('🔍 开始部署前检查...\n');

// 1. 检查 package.json
console.log('1️⃣  检查 package.json...');
try {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8')
  );

  if (packageJson.scripts.build) {
    addCheck(
      'package.json - build script',
      true,
      '✅ build 脚本存在'
    );
  } else {
    addCheck(
      'package.json - build script',
      false,
      '❌ 缺少 build 脚本',
      '添加: "build": "next build"'
    );
  }

  if (packageJson.engines && packageJson.engines.node) {
    addCheck(
      'package.json - Node.js 版本',
      true,
      `✅ Node.js 版本要求: ${packageJson.engines.node}`
    );
  } else {
    addCheck(
      'package.json - Node.js 版本',
      false,
      '⚠️  未指定 Node.js 版本',
      '建议在 engines 中添加 node 版本要求'
    );
  }
} catch (error) {
  addCheck(
    'package.json',
    false,
    '❌ 无法读取 package.json',
    '确保文件存在且格式正确'
  );
}

// 2. 检查 wrangler.toml
console.log('2️⃣  检查 wrangler.toml...');
try {
  const wranglerToml = fs.readFileSync(
    path.join(process.cwd(), 'wrangler.toml'),
    'utf-8'
  );

  if (wranglerToml.includes('YOUR_KV_NAMESPACE_ID')) {
    addCheck(
      'wrangler.toml - KV namespace',
      false,
      '❌ KV namespace ID 仍是占位符',
      '运行: wrangler kv:namespace create "RATE_LIMIT_KV" 并更新 ID'
    );
  } else if (wranglerToml.includes('kv_namespaces')) {
    addCheck(
      'wrangler.toml - KV namespace',
      true,
      '✅ KV namespace 已配置'
    );
  } else {
    addCheck(
      'wrangler.toml - KV namespace',
      false,
      '❌ 未找到 KV namespace 配置',
      '添加 KV namespace 配置'
    );
  }

  if (wranglerToml.includes('name =')) {
    addCheck(
      'wrangler.toml - 项目名称',
      true,
      '✅ Workers 名称已配置'
    );
  } else {
    addCheck(
      'wrangler.toml - 项目名称',
      false,
      '❌ 未找到项目名称',
      '添加: name = "subtitle-translator"'
    );
  }
} catch (error) {
  addCheck(
    'wrangler.toml',
    false,
    '❌ 无法读取 wrangler.toml',
    '确保文件存在且未被 .gitignore 忽略'
  );
}

// 3. 检查 .gitignore
console.log('3️⃣  检查 .gitignore...');
try {
  const gitignore = fs.readFileSync(
    path.join(process.cwd(), '.gitignore'),
    'utf-8'
  );

  if (gitignore.includes('.env.local') || gitignore.includes('.env*.local')) {
    addCheck(
      '.gitignore - 环境变量文件',
      true,
      '✅ 环境变量文件已被忽略'
    );
  } else {
    addCheck(
      '.gitignore - 环境变量文件',
      false,
      '⚠️  .env.local 未被忽略',
      '添加 .env*.local 到 .gitignore'
    );
  }

  if (gitignore.includes('.dev.vars')) {
    addCheck(
      '.gitignore - Workers 环境变量',
      true,
      '✅ .dev.vars 已被忽略'
    );
  } else {
    addCheck(
      '.gitignore - Workers 环境变量',
      false,
      '⚠️  .dev.vars 未被忽略',
      '添加 .dev.vars 到 .gitignore'
    );
  }

  // 检查 wrangler.toml 是否被错误忽略
  if (gitignore.match(/^wrangler\.toml$/m)) {
    addCheck(
      '.gitignore - wrangler.toml',
      false,
      '❌ wrangler.toml 被忽略了！',
      '从 .gitignore 中移除 wrangler.toml'
    );
  } else {
    addCheck(
      '.gitignore - wrangler.toml',
      true,
      '✅ wrangler.toml 不会被忽略'
    );
  }
} catch (error) {
  addCheck(
    '.gitignore',
    false,
    '⚠️  无法读取 .gitignore',
    '创建 .gitignore 文件'
  );
}

// 4. 检查关键文件是否存在
console.log('4️⃣  检查关键文件...');
const criticalFiles = [
  'next.config.js',
  'tailwind.config.ts',
  'tsconfig.json',
  'workers/translator.ts',
  'src/app/[locale]/page.tsx',
  'src/components/FileUploader.tsx',
];

for (const file of criticalFiles) {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    addCheck(
      `文件存在 - ${file}`,
      true,
      `✅ ${file} 存在`
    );
  } else {
    addCheck(
      `文件存在 - ${file}`,
      false,
      `❌ ${file} 不存在`,
      '确保所有必需文件都已创建'
    );
  }
}

// 5. 检查环境变量模板
console.log('5️⃣  检查环境变量配置...');
try {
  const envExample = fs.readFileSync(
    path.join(process.cwd(), '.env.local'),
    'utf-8'
  );

  if (envExample.includes('OPENAI_API_KEY')) {
    addCheck(
      '环境变量 - OPENAI_API_KEY',
      true,
      '✅ OPENAI_API_KEY 在本地配置中存在'
    );
  } else {
    addCheck(
      '环境变量 - OPENAI_API_KEY',
      false,
      '⚠️  OPENAI_API_KEY 未配置',
      '在部署时使用 wrangler secret put OPENAI_API_KEY'
    );
  }

  if (envExample.includes('NEXT_PUBLIC_WORKERS_URL')) {
    const match = envExample.match(/NEXT_PUBLIC_WORKERS_URL=(.+)/);
    if (match && match[1].includes('localhost')) {
      addCheck(
        '环境变量 - NEXT_PUBLIC_WORKERS_URL',
        false,
        '⚠️  NEXT_PUBLIC_WORKERS_URL 仍指向 localhost',
        '部署时在 Cloudflare Pages 中设置正确的 Workers URL'
      );
    } else {
      addCheck(
        '环境变量 - NEXT_PUBLIC_WORKERS_URL',
        true,
        '✅ NEXT_PUBLIC_WORKERS_URL 已配置'
      );
    }
  }
} catch (error) {
  addCheck(
    '环境变量',
    false,
    '⚠️  .env.local 不存在（这是正常的，部署时在 Cloudflare 配置）',
    '记住在 Cloudflare Pages 中配置环境变量'
  );
}

// 6. 检查 TypeScript 配置
console.log('6️⃣  检查 TypeScript 配置...');
try {
  const tsconfig = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'tsconfig.json'), 'utf-8')
  );

  if (tsconfig.compilerOptions?.strict) {
    addCheck(
      'TypeScript - strict mode',
      true,
      '✅ strict mode 已启用'
    );
  } else {
    addCheck(
      'TypeScript - strict mode',
      false,
      '⚠️  strict mode 未启用',
      '建议启用 strict mode 以避免类型错误'
    );
  }
} catch (error) {
  addCheck(
    'TypeScript',
    false,
    '❌ 无法读取 tsconfig.json',
    '确保文件存在且格式正确'
  );
}

// 7. 检查是否有未提交的更改
console.log('7️⃣  检查 Git 状态...');
try {
  const { execSync } = require('child_process');

  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    addCheck(
      'Git - 仓库',
      true,
      '✅ Git 仓库已初始化'
    );

    try {
      const status = execSync('git status --porcelain', { encoding: 'utf-8' });
      if (status.trim()) {
        addCheck(
          'Git - 未提交的更改',
          false,
          '⚠️  有未提交的更改',
          '运行 git add . && git commit 提交更改'
        );
      } else {
        addCheck(
          'Git - 未提交的更改',
          true,
          '✅ 没有未提交的更改'
        );
      }
    } catch (error) {
      addCheck(
        'Git - 未提交的更改',
        false,
        '⚠️  无法检查 Git 状态'
      );
    }
  } catch (error) {
    addCheck(
      'Git - 仓库',
      false,
      '❌ Git 仓库未初始化',
      '运行 git init && git add . && git commit -m "Initial commit"'
    );
  }
} catch (error) {
  addCheck(
    'Git',
    false,
    '⚠️  无法执行 Git 命令'
  );
}

// 输出结果
console.log('\n' + '='.repeat(60));
console.log('📊 检查结果汇总');
console.log('='.repeat(60) + '\n');

const passed = checks.filter((c) => c.passed).length;
const failed = checks.filter((c) => !c.passed).length;

checks.forEach((check) => {
  console.log(check.message);
  if (!check.passed && check.suggestion) {
    console.log(`   💡 建议: ${check.suggestion}`);
  }
});

console.log('\n' + '='.repeat(60));
console.log(`✅ 通过: ${passed}`);
console.log(`❌ 失败/警告: ${failed}`);
console.log('='.repeat(60) + '\n');

if (failed > 0) {
  console.log('⚠️  存在一些问题需要解决。请查看上面的建议。\n');
  console.log('📖 详细的部署指南请查看 DEPLOYMENT.md\n');
  process.exit(1);
} else {
  console.log('🎉 所有检查通过！可以开始部署了。\n');
  console.log('下一步：');
  console.log('1. 创建 KV namespace: wrangler kv:namespace create "RATE_LIMIT_KV"');
  console.log('2. 更新 wrangler.toml 中的 KV ID');
  console.log('3. 配置 Workers 密钥: wrangler secret put OPENAI_API_KEY');
  console.log('4. 部署 Workers: npm run build:workers');
  console.log('5. 推送到 GitHub: git push');
  console.log('6. 在 Cloudflare Pages 中连接仓库并配置环境变量\n');
  console.log('📖 详细步骤请查看 DEPLOYMENT.md\n');
  process.exit(0);
}
