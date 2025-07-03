#!/usr/bin/env python3
"""
Fix zh.json by replacing English content in pages.spanishSubtitle with proper Chinese translations.
"""

import json

def fix_zh_spanish_content():
    zh_file = "/Users/liuyinjiwen/Documents/coding/sub-trans4/src/lib/locales/zh.json"
    
    print(f"Loading {zh_file}...")
    with open(zh_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Ensure pages structure exists
    if 'pages' not in data:
        data['pages'] = {}
    
    # Create proper Chinese content for Spanish subtitle page
    zh_spanish = {
        "title": "专业西班牙语字幕翻译器",
        "description": "使用我们的AI驱动西班牙语字幕翻译器，将您的内容转化为全球5亿多西班牙语使用者所需的语言。支持地区变体，具备专业级的准确性。",
        "seo": {
            "title": "西班牙语字幕翻译器 - 免费在线工具 | 将字幕翻译为西班牙语",
            "description": "专业的西班牙语字幕翻译器，支持30多种语言。上传SRT文件，立即获取高质量的西班牙语字幕。免费的AI驱动字幕翻译工具，支持地区变体。",
            "keywords": "西班牙语字幕翻译器，翻译字幕为西班牙语，西班牙语字幕翻译，SRT西班牙语翻译器，在线西班牙语字幕工具，免费西班牙语字幕翻译器，AI西班牙语翻译，视频西班牙语字幕"
        },
        "hero": {
            "headline": "专业西班牙语字幕翻译器",
            "subheadline": "为全球5亿多西班牙语使用者转换您的内容。我们的AI驱动翻译器提供文化准确的西班牙语字幕，支持墨西哥语、阿根廷语、哥伦比亚语和欧洲西班牙语等地区变体。"
        },
        "solutions": {
            "title": "🌶️ 西班牙语字幕解决方案",
            "subtitle": "利用我们为多元化西班牙语世界设计的先进西班牙语字幕翻译技术，连接全球市场。",
            "items": {
                "regional": {
                    "icon": "🗺️",
                    "title": "地区西班牙语变体",
                    "description": "支持墨西哥语、阿根廷语、哥伦比亚语、秘鲁语、委内瑞拉语、智利语、欧洲西班牙语和其他地区变体，包含文化细节和本地表达方式。"
                },
                "bidirectional": {
                    "icon": "↔️",
                    "title": "双向翻译",
                    "description": "将西班牙语翻译为30多种语言，或将任何语言翻译为西班牙语，具有同等的精确度和文化敏感性。"
                },
                "cultural": {
                    "icon": "🎭",
                    "title": "文化适应",
                    "description": "AI引擎在西班牙语文化、俚语、惯用语和地区表达方面接受训练，提供与西班牙语观众产生共鸣的翻译。"
                },
                "business": {
                    "icon": "💼",
                    "title": "商业内容专注",
                    "description": "专门处理企业内容、教育材料、营销视频和面向西班牙语市场的专业沟通。"
                }
            },
            "features": [
                "🇲🇽 墨西哥西班牙语本地化",
                "🇦🇷 阿根廷西班牙语支持",
                "🇪🇸 欧洲西班牙语变体",
                "🇨🇴 哥伦比亚西班牙语方言",
                "📚 教育内容优化",
                "🎬 娱乐行业标准"
            ]
        },
        "supportedLanguages": {
            "title": "🌍 西班牙语翻译覆盖",
            "subtitle": "通过涵盖主要世界语言的全面语言支持，将西班牙语内容与全球观众连接。",
            "fromSpanish": "将西班牙语字幕翻译为：",
            "description": "英语 • 中文 • 日语 • 法语 • 德语 • 俄语 • 意大利语 • 葡萄牙语 • 阿拉伯语 • 印地语 • 韩语 • 泰语 • 越南语 • 土耳其语 • 波兰语 • 荷兰语 • 瑞典语 • 丹麦语 • 挪威语 • 芬兰语 • 捷克语 • 匈牙利语 • 罗马尼亚语 • 保加利亚语 • 克罗地亚语 • 斯洛伐克语 • 斯洛文尼亚语 • 爱沙尼亚语 • 拉脱维亚语 • 立陶宛语",
            "toSpanish": "以及反向翻译：",
            "reverseNote": "将任何这些语言翻译为西班牙语，具有相同的地区敏感性和文化准确性，支持拉丁美洲和欧洲西班牙语变体。"
        },
        "optimization": {
            "title": "🌮 西班牙语语言优化",
            "subtitle": "专门设计用于处理西班牙语语言内容的独特特征和地区复杂性的高级处理。",
            "items": {
                "grammar": {
                    "icon": "📚",
                    "title": "西班牙语语法掌握",
                    "description": "高级处理西班牙语动词变位、性别一致、虚拟语气和复杂语法结构。"
                },
                "regional": {
                    "icon": "🗺️",
                    "title": "地区方言支持",
                    "description": "智能识别和翻译地区西班牙语变体，包括墨西哥语、阿根廷语、哥伦比亚语和欧洲西班牙语方言。"
                },
                "cultural": {
                    "icon": "🎪",
                    "title": "文化上下文感知",
                    "description": "AI在西班牙语文化引用、惯用语、俚语和口语方面接受训练，提供真实的西班牙语翻译。"
                },
                "formal": {
                    "icon": "🏛️",
                    "title": "正式与非正式语域",
                    "description": "基于内容上下文适当处理tú/usted区别和正式/非正式语言语域。"
                }
            }
        },
        "industries": {
            "title": "🏢 西班牙语内容行业",
            "subtitle": "了解西班牙语内容创作者和国际企业如何在各个领域利用我们的西班牙语字幕翻译器。",
            "items": {
                "entertainment": {
                    "icon": "🎬",
                    "title": "娱乐与媒体",
                    "applications": {
                        "streaming": "Netflix、Amazon Prime和流媒体平台为西班牙语市场进行内容本地化",
                        "film": "好莱坞和国际电影发行，为影院和家庭视频提供西班牙语字幕",
                        "television": "电视剧、纪录片和西班牙语电视网络的广播内容",
                        "youtube": "YouTube创作者向拉丁美洲和西班牙的西班牙语观众扩展"
                    }
                },
                "education": {
                    "icon": "🎓",
                    "title": "教育与培训",
                    "applications": {
                        "online": "在线课程平台如Coursera、Udemy将教育内容翻译为西班牙语",
                        "corporate": "为西班牙语员工和国际团队提供企业培训材料",
                        "academic": "大学讲座、研究演示和西班牙语机构的学术内容",
                        "language": "语言学习平台为全球西班牙语学习者创建西班牙语内容"
                    }
                },
                "business": {
                    "icon": "💼",
                    "title": "商业与营销",
                    "applications": {
                        "marketing": "拉丁美洲市场的产品发布、宣传视频和营销活动",
                        "corporate": "西班牙语办公室的CEO信息、公司公告和内部沟通",
                        "sales": "西班牙语地区的销售演示、产品演示和客户沟通",
                        "customer": "为西班牙语用户提供客户支持视频、教程和帮助内容"
                    }
                },
                "technology": {
                    "icon": "💻",
                    "title": "技术与软件",
                    "applications": {
                        "saas": "SaaS公司创建西班牙语教程、入门指导和功能说明视频",
                        "mobile": "移动应用开发者为西班牙语市场本地化宣传和教学内容",
                        "gaming": "游戏开发者为西班牙语玩家翻译过场动画、教程和宣传内容",
                        "tech": "技术会议、网络研讨会和面向西班牙语开发者的技术演示"
                    }
                }
            }
        },
        "quality": {
            "title": "🏆 西班牙语翻译卓越",
            "subtitle": "体验具有文化感知能力的AI引擎提供的卓越西班牙语翻译质量，专为西班牙语市场优化。",
            "engines": {
                "title": "🤖 双AI引擎优势",
                "google": "针对速度和广泛的西班牙语方言覆盖进行优化，适用于一般内容和拉丁美洲的地区变体。",
                "openai": "对西班牙语文化、惯用语和商业术语有深入的上下文理解，适用于专业和创意内容。"
            },
            "checks": {
                "title": "✅ 西班牙语专业质量检查",
                "items": [
                    "西班牙语名词和形容词的性别一致性验证",
                    "所有西班牙语时态和语态的动词变位准确性",
                    "地区方言一致性（墨西哥语vs欧洲西班牙语）",
                    "目标西班牙语市场的文化引用适宜性",
                    "正式/非正式语域一致性（tú/usted使用）",
                    "西班牙语标点和格式标准合规性"
                ]
            },
            "metrics": {
                "title": "📊 准确性指标",
                "items": [
                    "西班牙语语法和句法准确率98%+",
                    "西班牙语惯用语和表达的文化相关性得分95%+",
                    "西班牙语字幕格式的时间保持99%+",
                    "主要西班牙语变体的地区方言识别准确率：94%+"
                ]
            }
        },
        "technical": {
            "title": "⚡ 西班牙语技术规格",
            "subtitle": "专门构建以处理西班牙语字幕翻译的技术要求，具备地区准确性。",
            "processing": {
                "title": "⚡ 处理能力",
                "fileSize": "文件大小：每个SRT文件最大50MB，适用于大型西班牙语内容项目",
                "character": "字符限制：100万+字符，针对西班牙语文本扩展进行优化",
                "speed": "处理速度：典型西班牙语字幕文件2-15秒",
                "quality": "质量：具有地区准确性的专业级西班牙语翻译"
            },
            "features": {
                "title": "🚀 高级功能",
                "items": [
                    "西班牙语方言自动检测（墨西哥语、阿根廷语、欧洲语）",
                    "西班牙语地区的文化上下文适应",
                    "西班牙语语法验证和纠正",
                    "地区俚语和惯用语识别",
                    "正式/非正式语域自动调整",
                    "西班牙语字幕时间优化"
                ]
            },
            "assurance": {
                "title": "🛡️ 质量保证",
                "items": [
                    "西班牙语语言准确性验证",
                    "文化适宜性筛选",
                    "地区方言一致性检查",
                    "西班牙语字幕格式验证",
                    "内容安全和适宜性审查"
                ]
            }
        },
        "faq": {
            "title": "❓ 西班牙语字幕翻译常见问题",
            "subtitle": "获取关于我们西班牙语字幕翻译服务和地区能力的常见问题答案。",
            "items": {
                "dialects": {
                    "question": "您支持不同的西班牙语方言吗？",
                    "answer": "是的！我们支持主要的西班牙语变体，包括墨西哥西班牙语、阿根廷西班牙语、哥伦比亚西班牙语、欧洲西班牙语和其他地区方言。我们的AI识别地区差异并相应地调整翻译。"
                },
                "accuracy": {
                    "question": "西班牙语翻译的准确性如何？",
                    "answer": "我们的西班牙语翻译在语法和句法方面达到98%+的准确性，在西班牙语惯用语和表达方面达到95%+的文化相关性。我们使用专门在西班牙语内容上训练的AI引擎。"
                },
                "cultural": {
                    "question": "您如何处理西班牙语文化引用？",
                    "answer": "我们的AI在广泛的西班牙语和拉丁美洲文化内容上接受训练，确保正确翻译惯用语、文化引用和地区表达，同时保持文化真实性。"
                },
                "formal": {
                    "question": "您能处理正式和非正式的西班牙语吗？",
                    "answer": "当然！我们的系统识别上下文并适当使用tú/usted区别、正式vs非正式词汇，以及基于内容类型的专业vs休闲语言语域。"
                },
                "regions": {
                    "question": "您支持哪些西班牙语地区？",
                    "answer": "我们支持所有主要地区的西班牙语，包括墨西哥、阿根廷、哥伦比亚、西班牙、秘鲁、委内瑞拉、智利和其他西班牙语国家，并为每个市场提供文化和语言适应。"
                },
                "business": {
                    "question": "这适合商务西班牙语内容吗？",
                    "answer": "是的！我们的工具在商务西班牙语方面表现出色，处理企业术语、正式沟通、营销内容和专业演示，为您的目标市场提供适当的文化敏感性。"
                }
            }
        }
    }
    
    # Replace the English content with Chinese content
    data['pages']['spanishSubtitle'] = zh_spanish
    
    print("✓ Created complete Chinese translation for pages.spanishSubtitle")
    print(f"  - Hero headline: {zh_spanish['hero']['headline']}")
    print(f"  - Solutions title: {zh_spanish['solutions']['title']}")
    print(f"  - Total sections: {len(zh_spanish)}")
    
    # Save the updated file
    print(f"Saving updated Chinese file: {zh_file}")
    with open(zh_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print("✅ Chinese Spanish subtitle content creation completed!")

if __name__ == "__main__":
    fix_zh_spanish_content()