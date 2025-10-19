#!/usr/bin/env python3
"""
Create complete Chinese chineseSubtitle content by combining structure from English
with Chinese translations where available.
"""

import json

def create_complete_chinese_content():
    zh_file = "/Users/liuyinjiwen/Documents/coding/sub-trans4/src/lib/locales/zh.json"
    en_file = "/Users/liuyinjiwen/Documents/coding/sub-trans4/src/lib/locales/en.json"
    
    print(f"Loading English file: {en_file}")
    with open(en_file, 'r', encoding='utf-8') as f:
        en_data = json.load(f)
    
    print(f"Loading Chinese file: {zh_file}")
    with open(zh_file, 'r', encoding='utf-8') as f:
        zh_data = json.load(f)
    
    # Get English chineseSubtitle structure as template
    if 'chineseSubtitle' in en_data:
        en_chinese_template = en_data['chineseSubtitle']
        print(f"✓ Found English chineseSubtitle template with {len(en_chinese_template)} keys")
    else:
        print("❌ No English chineseSubtitle template found")
        return
    
    # Ensure Chinese pages structure exists
    if 'pages' not in zh_data:
        zh_data['pages'] = {}
    
    # Create complete Chinese content
    zh_chinese = {}
    
    # Basic info in Chinese
    zh_chinese['title'] = "专业中文字幕翻译器"
    zh_chinese['description'] = "使用我们的AI驱动中文字幕翻译器，将您的内容转化为中国观众所需的语言。支持30多种语言，具备专业级的准确性。"
    
    # SEO info
    zh_chinese['seo'] = {
        "title": "中文字幕翻译器 - 免费在线工具 | 将字幕翻译成中文",
        "description": "专业的中文字幕翻译器，支持30多种语言。上传SRT文件，立即获取高质量的中文字幕。免费的AI驱动字幕翻译工具，提供准确的结果。",
        "keywords": "中文字幕翻译器，翻译字幕为中文，中文字幕翻译，SRT中文翻译器，在线中文字幕工具，免费中文字幕翻译器，AI中文翻译，视频中文字幕"
    }
    
    # Hero section
    zh_chinese['hero'] = {
        "headline": "专业中文字幕翻译器",
        "subheadline": "将任何语言的字幕转换为流畅的中文。我们的专业中文SRT翻译器确保自然、上下文感知的翻译，适用于全球内容分发。"
    }
    
    # Solutions section
    zh_chinese['solutions'] = {
        "title": "🏮 中文字幕解决方案",
        "subtitle": "利用我们先进的中文字幕翻译技术，连接东西方内容市场。",
        "items": {
            "fromChinese": {
                "icon": "🌍",
                "title": "从中文到全球市场",
                "description": "将中文内容转化为国际观众所需的语言，同时保持原有的语调、幽默和文化细节。我们的中文SRT翻译器专门针对中文源材料进行了优化。"
            },
            "toChinese": {
                "icon": "🔄",
                "title": "翻译为中文以实现全球理解",
                "description": "将外语字幕转换为准确的中文，非常适合引进国际内容、教育材料或理解外国媒体。"
            },
            "optimization": {
                "icon": "🎯",
                "title": "中文内容优化",
                "description": "我们的AI识别中文特有的元素，如惯用语、文化引用和技术术语，确保翻译在目标语言中感觉自然。"
            },
            "professional": {
                "icon": "💼",
                "title": "专业级结果",
                "description": "受到内容创作者、流媒体平台和国际企业的信赖，提供符合专业标准的高质量中文字幕翻译。"
            }
        },
        "features": [
            "✅ 中文专业化 - 针对中文字幕翻译进行优化",
            "📈 30种语言 - 翻译为主要世界语言或从中文翻译",
            "🧠 上下文感知AI - 理解惯用语、俚语和文化引用",
            "⭐ 专业质量 - 完美适用于YouTube、流媒体和商业内容"
        ]
    }
    
    # Supported Languages
    zh_chinese['supportedLanguages'] = {
        "title": "🌍 支持的语言",
        "subtitle": "通过全面的语言支持，将您的中文字幕转化为全球观众的内容，覆盖主要国际市场。",
        "fromChinese": "将中文字幕翻译为：",
        "toChinese": "以及反向翻译：",
        "description": "英语 • 日语 • 法语 • 德语 • 西班牙语 • 俄语 • 意大利语 • 葡萄牙语 • 阿拉伯语 • 印地语 • 韩语 • 泰语 • 越南语 • 土耳其语 • 波兰语 • 荷兰语 • 瑞典语 • 丹麦语 • 挪威语 • 芬兰语 • 捷克语 • 匈牙利语 • 罗马尼亚语 • 保加利亚语 • 克罗地亚语 • 斯洛伐克语 • 斯洛文尼亚语 • 爱沙尼亚语 • 拉脱维亚语 • 立陶宛语",
        "reverseNote": "将任何这些语言翻译回中文，具有相同的专业质量和文化理解。"
    }
    
    # Other sections with Chinese translations
    zh_chinese['optimization'] = {
        "title": "🀄 中文语言优化",
        "subtitle": "专门设计用于处理中文语言内容的复杂性和细节的高级功能。",
        "items": {
            "cultural": {
                "icon": "🌐",
                "title": "文化上下文识别",
                "description": "我们的AI理解中文文化引用、流行文化提及和地域表达，确保翻译能够与目标观众产生共鸣，而不是逐字翻译。"
            },
            "technical": {
                "icon": "⚙️",
                "title": "技术中文处理",
                "description": "专门处理商务中文、学术中文、技术文档和专业中文内容中常见的行业特定术语。"
            },
            "tone": {
                "icon": "🎭",
                "title": "语调保持",
                "description": "高级语调检测确保翻译保持原始中文内容的正式性、情感和风格特征。"
            },
            "characters": {
                "icon": "📝",
                "title": "简繁体处理",
                "description": "智能处理简体和繁体中文，确保适当的字符使用和地域适应性。"
            }
        }
    }
    
    # Add other required sections with placeholder Chinese content
    zh_chinese['industries'] = {
        "title": "🏢 行业应用",
        "subtitle": "了解专业人士如何在各行业中依赖我们的中文字幕翻译器。",
        "items": {
            "entertainment": {
                "icon": "🎬",
                "title": "娱乐与媒体",
                "applications": {
                    "streaming": "Netflix、Amazon Prime等流媒体平台的中文内容本地化",
                    "film": "好莱坞和国际电影的中文字幕分发",
                    "television": "电视剧、纪录片和中文电视网络的广播内容"
                }
            },
            "education": {
                "icon": "🎓", 
                "title": "教育与培训",
                "applications": {
                    "online": "在线课程平台如Coursera、Udemy将教育内容翻译为中文",
                    "corporate": "为中文员工和国际团队提供企业培训材料"
                }
            }
        }
    }
    
    zh_chinese['quality'] = {
        "title": "🏆 中文翻译卓越",
        "subtitle": "体验具有文化感知能力的AI引擎提供的卓越中文翻译质量。",
        "engines": {
            "title": "🤖 双AI引擎优势",
            "google": "专为中文内容优化，在处理技术内容和商务中文方面表现出色。",
            "openai": "对中文文化、习语和商务术语有深入的上下文理解，适用于专业和创意内容。"
        },
        "checks": {
            "title": "✅ 中文专业质量检查",
            "items": [
                "中文语法和语序验证",
                "文化引用适应性检查",
                "简繁体字符一致性验证",
                "专业术语准确性确认",
                "语调和正式性水平保持"
            ]
        },
        "metrics": {
            "title": "📊 准确性指标",
            "items": [
                "95%+ 中文语法准确率",
                "90%+ 文化上下文保持",
                "99%+ 字符编码正确性",
                "实时质量监控和报告"
            ]
        }
    }
    
    zh_chinese['technical'] = {
        "title": "⚡ 中文技术规格",
        "subtitle": "专门构建以处理中文字幕翻译的技术要求。",
        "processing": {
            "title": "⚡ 处理能力",
            "fileSize": "支持高达50MB的大型字幕文件",
            "character": "处理简体和繁体中文字符",
            "speed": "平均处理速度：每分钟500-1000行字幕",
            "quality": "99.9%的字符编码准确性"
        },
        "features": {
            "title": "🚀 高级功能",
            "items": [
                "自动简繁体转换",
                "中文语法优化",
                "文化上下文适应",
                "专业术语识别",
                "语调保持技术"
            ]
        },
        "assurance": {
            "title": "🛡️ 质量保证",
            "items": [
                "多层中文语法检查",
                "文化适应性验证",
                "字符编码完整性测试",
                "实时质量监控",
                "用户反馈集成系统"
            ]
        }
    }
    
    zh_chinese['faq'] = {
        "title": "❓ 常见问题",
        "subtitle": "获取关于我们中文字幕翻译服务常见问题的答案。",
        "items": {
            "format": {
                "question": "支持哪些中文字幕格式？",
                "answer": "我们支持所有标准SRT格式，并能处理简体和繁体中文字符。翻译后的文件保持原始时间戳和格式。"
            },
            "dialects": {
                "question": "是否支持不同的中文方言？",
                "answer": "我们的系统主要针对标准普通话（简体中文）和标准中文（繁体中文）进行优化。我们正在不断改进对地域变体的支持。"
            },
            "accuracy": {
                "question": "中文翻译的准确性如何？",
                "answer": "我们的AI引擎专门针对中文进行训练，在语法、文化上下文和技术术语方面达到95%+的准确率。"
            }
        }
    }
    
    # Apply to Chinese pages
    zh_data['pages']['chineseSubtitle'] = zh_chinese
    
    print("✓ Created complete Chinese chineseSubtitle content")
    print(f"  - Hero headline: {zh_chinese['hero']['headline']}")
    print(f"  - Solutions title: {zh_chinese['solutions']['title']}")
    print(f"  - Total sections: {len(zh_chinese)}")
    
    # Save the updated file
    print(f"Saving updated Chinese file: {zh_file}")
    with open(zh_file, 'w', encoding='utf-8') as f:
        json.dump(zh_data, f, ensure_ascii=False, indent=2)
    
    print("✅ Complete Chinese content creation finished!")

if __name__ == "__main__":
    create_complete_chinese_content()