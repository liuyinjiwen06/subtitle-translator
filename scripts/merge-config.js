#!/usr/bin/env node

/**
 * 内容合并配置文件
 * 管理需要合并到翻译文件的具体文件列表
 */

const mergeConfig = {
  // 🎯 合并任务配置
  mergeTasks: {
    // 当前活跃的任务
    activeTask: 'spanish_pages', // 可以是任务名称或 'all'
    
    // 预定义的合并任务
    tasks: {
      // 西班牙语相关页面
      spanish_pages: {
        name: '西班牙语页面合并',
        description: '合并西班牙语、葡萄牙语、法语页面到翻译文件',
        enabled: true,
        items: [
          {
            contentFile: 'public/generated-content/spanish-subtitle-page.json',
            layoutFile: 'public/generated-content/layouts/spanish-layout.json',
            languageCode: 'spanish',
            targetLocales: ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'pt', 'it', 'ru'],
            priority: 1
          },
          {
            contentFile: 'public/generated-content/portuguese-subtitle-page.json',
            layoutFile: 'public/generated-content/layouts/portuguese-layout.json',
            languageCode: 'portuguese',
            targetLocales: ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'pt', 'it', 'ru'],
            priority: 2
          },
          {
            contentFile: 'public/generated-content/french-subtitle-page.json',
            layoutFile: 'public/generated-content/layouts/french-layout.json',
            languageCode: 'french',
            targetLocales: ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'pt', 'it', 'ru'],
            priority: 3
          }
        ]
      },
      
      // 所有语言页面
      all_pages: {
        name: '所有语言页面合并',
        description: '合并所有可用的语言页面到翻译文件',
        enabled: false,
        items: [
          {
            contentFile: 'public/generated-content/chinese-subtitle-page.json',
            layoutFile: 'public/generated-content/layouts/chinese-layout.json',
            languageCode: 'chinese',
            targetLocales: 'all', // 'all' 表示所有配置的目标语言
            priority: 1
          },
          {
            contentFile: 'public/generated-content/english-subtitle-page.json',
            layoutFile: 'public/generated-content/layouts/english-layout.json',
            languageCode: 'english',
            targetLocales: 'all',
            priority: 2
          },
          {
            contentFile: 'public/generated-content/spanish-subtitle-page.json',
            layoutFile: 'public/generated-content/layouts/spanish-layout.json',
            languageCode: 'spanish',
            targetLocales: 'all',
            priority: 3
          },
          {
            contentFile: 'public/generated-content/french-subtitle-page.json',
            layoutFile: 'public/generated-content/layouts/french-layout.json',
            languageCode: 'french',
            targetLocales: 'all',
            priority: 4
          },
          {
            contentFile: 'public/generated-content/portuguese-subtitle-page.json',
            layoutFile: 'public/generated-content/layouts/portuguese-layout.json',
            languageCode: 'portuguese',
            targetLocales: 'all',
            priority: 5
          }
        ]
      },
      
      // 自定义任务模板
      custom: {
        name: '自定义合并任务',
        description: '用户自定义的合并任务',
        enabled: false,
        items: [
          // 可以在这里添加自定义的合并项
          // {
          //   contentFile: 'public/generated-content/german-subtitle-page.json',
          //   layoutFile: 'public/generated-content/layouts/german-layout.json',
          //   languageCode: 'german',
          //   targetLocales: ['en', 'de'],
          //   priority: 1
          // }
        ]
      }
    }
  },

  // 🌍 默认目标语言列表
  defaultTargetLocales: [
    'en',  // 英语
    'zh',  // 中文
    'es',  // 西班牙语
    'fr',  // 法语
    'de',  // 德语
    'ja',  // 日语
    'ko',  // 韩语
    'pt',  // 葡萄牙语
    'it',  // 意大利语
    'ru',  // 俄语
    'ar',  // 阿拉伯语
    'hi',  // 印地语
    'th',  // 泰语
    'vi',  // 越南语
    'tr',  // 土耳其语
    'pl',  // 波兰语
    'nl',  // 荷兰语
    'sv'   // 瑞典语
  ],

  // 📁 文件路径配置
  paths: {
    generatedContentDir: 'public/generated-content',
    layoutsDir: 'public/generated-content/layouts',
    localesDir: 'src/lib/locales',
    backupDir: 'backups'
  },

  // ⚙️ 合并选项
  mergeOptions: {
    // 是否在合并前创建备份
    createBackup: true,
    
    // 是否跳过已存在的翻译
    skipExisting: false,
    
    // 是否显示详细日志
    verbose: true,
    
    // 是否在出错时继续处理其他项目
    continueOnError: true,
    
    // 批处理延迟（毫秒）
    batchDelay: 500,
    
    // 是否检查文件存在性
    checkFileExists: true
  }
};

// 🔧 配置工具函数
mergeConfig.getActiveTask = function() {
  const activeTaskName = this.mergeTasks.activeTask;
  
  if (activeTaskName === 'all') {
    // 返回所有启用的任务
    const allTasks = [];
    Object.entries(this.mergeTasks.tasks).forEach(([name, task]) => {
      if (task.enabled) {
        allTasks.push({ name, ...task });
      }
    });
    return allTasks;
  }
  
  const task = this.mergeTasks.tasks[activeTaskName];
  if (!task) {
    console.warn(`⚠️  任务 "${activeTaskName}" 不存在`);
    return null;
  }
  
  if (!task.enabled) {
    console.warn(`⚠️  任务 "${activeTaskName}" 未启用`);
    return null;
  }
  
  return { name: activeTaskName, ...task };
};

mergeConfig.getMergeItems = function(taskName = null) {
  taskName = taskName || this.mergeTasks.activeTask;
  
  if (taskName === 'all') {
    const allItems = [];
    Object.entries(this.mergeTasks.tasks).forEach(([name, task]) => {
      if (task.enabled) {
        task.items.forEach(item => {
          allItems.push({
            ...item,
            taskName: name,
            targetLocales: item.targetLocales === 'all' ? this.defaultTargetLocales : item.targetLocales
          });
        });
      }
    });
    
    // 按优先级排序
    return allItems.sort((a, b) => (a.priority || 999) - (b.priority || 999));
  }
  
  const task = this.mergeTasks.tasks[taskName];
  if (!task || !task.enabled) {
    return [];
  }
  
  return task.items.map(item => ({
    ...item,
    taskName,
    targetLocales: item.targetLocales === 'all' ? this.defaultTargetLocales : item.targetLocales
  })).sort((a, b) => (a.priority || 999) - (b.priority || 999));
};

mergeConfig.setActiveTask = function(taskName) {
  if (taskName !== 'all' && !this.mergeTasks.tasks[taskName]) {
    console.error(`❌ 任务 "${taskName}" 不存在`);
    return false;
  }
  
  this.mergeTasks.activeTask = taskName;
  console.log(`✅ 已切换到任务: ${taskName}`);
  return true;
};

mergeConfig.enableTask = function(taskName) {
  const task = this.mergeTasks.tasks[taskName];
  if (!task) {
    console.error(`❌ 任务 "${taskName}" 不存在`);
    return false;
  }
  
  task.enabled = true;
  console.log(`✅ 已启用任务: ${taskName}`);
  return true;
};

mergeConfig.disableTask = function(taskName) {
  const task = this.mergeTasks.tasks[taskName];
  if (!task) {
    console.error(`❌ 任务 "${taskName}" 不存在`);
    return false;
  }
  
  task.enabled = false;
  console.log(`⏸️  已禁用任务: ${taskName}`);
  return true;
};

mergeConfig.addCustomMergeItem = function(contentFile, layoutFile, languageCode, targetLocales, priority = 999) {
  const customTask = this.mergeTasks.tasks.custom;
  
  customTask.items.push({
    contentFile,
    layoutFile,
    languageCode,
    targetLocales: targetLocales || this.defaultTargetLocales,
    priority
  });
  
  customTask.enabled = true;
  console.log(`✅ 已添加自定义合并项: ${contentFile}`);
  return true;
};

// 导出配置
module.exports = mergeConfig;

// 如果直接运行此文件，显示配置信息
if (require.main === module) {
  console.log('🔧 内容合并配置信息:\n');
  
  console.log('🎯 当前活跃任务:', mergeConfig.mergeTasks.activeTask);
  
  console.log('\n📋 可用任务:');
  Object.entries(mergeConfig.mergeTasks.tasks).forEach(([name, task]) => {
    const status = task.enabled ? '✅ 启用' : '⏸️  禁用';
    console.log(`  ${name}: ${status}`);
    console.log(`    名称: ${task.name}`);
    console.log(`    描述: ${task.description}`);
    console.log(`    项目数: ${task.items.length}`);
  });
  
  console.log('\n🔄 当前合并项目:');
  const items = mergeConfig.getMergeItems();
  items.forEach((item, index) => {
    const targetLocales = Array.isArray(item.targetLocales) 
      ? item.targetLocales.join(', ') 
      : item.targetLocales;
    console.log(`  ${index + 1}. ${item.contentFile}`);
    console.log(`     布局文件: ${item.layoutFile || '无'}`);
    console.log(`     语言代码: ${item.languageCode}`);
    console.log(`     目标语言: [${targetLocales}]`);
    console.log(`     优先级: ${item.priority}`);
    console.log('');
  });
  
  console.log('📁 文件路径:');
  console.log(`  生成内容目录: ${mergeConfig.paths.generatedContentDir}`);
  console.log(`  翻译文件目录: ${mergeConfig.paths.localesDir}`);
  console.log(`  备份目录: ${mergeConfig.paths.backupDir}`);
  
  console.log('\n⚙️  合并选项:');
  console.log(`  创建备份: ${mergeConfig.mergeOptions.createBackup ? '是' : '否'}`);
  console.log(`  跳过已有翻译: ${mergeConfig.mergeOptions.skipExisting ? '是' : '否'}`);
  console.log(`  详细日志: ${mergeConfig.mergeOptions.verbose ? '是' : '否'}`);
  console.log(`  出错时继续: ${mergeConfig.mergeOptions.continueOnError ? '是' : '否'}`);
  console.log(`  检查文件存在: ${mergeConfig.mergeOptions.checkFileExists ? '是' : '否'}`);
} 