#!/usr/bin/env node

/**
 * 准备 Cloudflare Pages Advanced Mode 输出
 * 将 OpenNext 生成的 worker.js 和 assets 转换为 Pages 格式
 */

const fs = require('fs');
const path = require('path');

const OPEN_NEXT_DIR = path.join(process.cwd(), '.open-next');
const WORKER_FILE = path.join(OPEN_NEXT_DIR, 'worker.js');
const ASSETS_DIR = path.join(OPEN_NEXT_DIR, 'assets');
const OUTPUT_DIR = path.join(OPEN_NEXT_DIR, 'worker');
const WORKER_OUTPUT = path.join(OUTPUT_DIR, '_worker.js');

// 需要复制到输出目录的其他目录（_worker.js 的依赖）
const REQUIRED_DIRS = [
  'cloudflare',
  'middleware',
  '.build',
  'server-functions',
  'cache'
];

console.log('📦 Preparing Cloudflare Pages output...');

// 检查源文件是否存在
if (!fs.existsSync(WORKER_FILE)) {
  console.error('❌ Error: worker.js not found at', WORKER_FILE);
  process.exit(1);
}

if (!fs.existsSync(ASSETS_DIR)) {
  console.error('❌ Error: assets directory not found at', ASSETS_DIR);
  process.exit(1);
}

// 创建输出目录
if (fs.existsSync(OUTPUT_DIR)) {
  console.log('🗑️  Cleaning existing output directory...');
  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
}
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// 辅助函数：递归复制目录
function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

// 复制 worker.js 为 _worker.js (Pages Advanced Mode 要求)
console.log('📄 Copying worker.js to _worker.js...');
fs.copyFileSync(WORKER_FILE, WORKER_OUTPUT);

// 复制所有静态资源到输出目录
console.log('📁 Copying static assets...');
copyRecursive(ASSETS_DIR, OUTPUT_DIR);

// 复制 _worker.js 依赖的目录
console.log('📦 Copying worker dependencies...');
for (const dir of REQUIRED_DIRS) {
  const srcDir = path.join(OPEN_NEXT_DIR, dir);
  const destDir = path.join(OUTPUT_DIR, dir);

  if (fs.existsSync(srcDir)) {
    console.log(`   - Copying ${dir}/...`);
    copyRecursive(srcDir, destDir);
  } else {
    console.warn(`   ⚠️  Warning: ${dir}/ not found, skipping`);
  }
}

// 验证输出
const outputFiles = fs.readdirSync(OUTPUT_DIR);
console.log('✅ Output directory prepared with', outputFiles.length, 'items');
console.log('📋 Key files:');
console.log('   - _worker.js:', fs.existsSync(WORKER_OUTPUT) ? '✓' : '✗');
console.log('   - _next/:', fs.existsSync(path.join(OUTPUT_DIR, '_next')) ? '✓' : '✗');
console.log('   - favicon.ico:', fs.existsSync(path.join(OUTPUT_DIR, 'favicon.ico')) ? '✓' : '✗');

console.log('\n🎉 Cloudflare Pages output ready at:', OUTPUT_DIR);
