#!/usr/bin/env python3
"""
Fix the Chinese pages structure by mapping Chinese root level data to pages.chineseSubtitle.
This ensures Chinese pages show Chinese content, not English content.
"""

import json

def fix_zh_pages_structure():
    zh_file = "/Users/liuyinjiwen/Documents/coding/sub-trans4/src/lib/locales/zh.json"
    
    print(f"Loading {zh_file}...")
    with open(zh_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Find Chinese chineseSubtitle data at root level
    if 'chineseSubtitle' in data:
        chinese_data = data['chineseSubtitle']
        print("✓ Found Chinese chineseSubtitle data at root level")
        print(f"  - Title: {chinese_data.get('title', 'Not found')}")
        print(f"  - Hero Title: {chinese_data.get('heroTitle', 'Not found')}")
        
        # Ensure pages structure exists
        if 'pages' not in data:
            data['pages'] = {}
        
        if 'chineseSubtitle' not in data['pages']:
            data['pages']['chineseSubtitle'] = {}
        
        # Map the Chinese data correctly
        pages_chinese = data['pages']['chineseSubtitle']
        
        # Convert heroTitle/heroSubtitle to hero.headline/hero.subheadline structure
        if 'heroTitle' in chinese_data or 'heroSubtitle' in chinese_data:
            pages_chinese['hero'] = {
                'headline': chinese_data.get('heroTitle', ''),
                'subheadline': chinese_data.get('heroSubtitle', '')
            }
            print("✓ Created hero structure from Chinese heroTitle/heroSubtitle")
        elif 'hero' in chinese_data:
            pages_chinese['hero'] = chinese_data['hero']
            print("✓ Copied existing hero structure from Chinese data")
        
        # Copy other sections from Chinese data
        for key in ['seo', 'benefits', 'solutions', 'supportedLanguages', 'optimization', 'industries', 'quality', 'technical', 'faq', 'useCases']:
            if key in chinese_data:
                pages_chinese[key] = chinese_data[key]
                print(f"✓ Copied Chinese {key} to pages.chineseSubtitle")
        
        # Set basic info
        pages_chinese['title'] = chinese_data.get('title', '专业中文字幕翻译器')
        pages_chinese['description'] = chinese_data.get('description', '使用AI技术翻译中文字幕')
        pages_chinese['targetLanguage'] = chinese_data.get('targetLanguage', '中文')
        
        print("✓ Updated pages.chineseSubtitle with Chinese content")
    else:
        print("❌ No chineseSubtitle found at root level")
    
    # Also check if we need to fix English subtitle data (should be Chinese interface with English content info)
    if 'englishSubtitle' in data:
        english_data = data['englishSubtitle']
        
        if 'pages' in data and 'englishSubtitle' in data['pages']:
            pages_english = data['pages']['englishSubtitle']
            
            # For Chinese interface, the English subtitle page should show Chinese interface text
            # but English content descriptions
            if 'hero' in english_data:
                pages_english['hero'] = english_data['hero']
                print("✓ Updated pages.englishSubtitle hero from Chinese root data")
            
            # Copy other English sections
            for key in ['solutions', 'supportedLanguages', 'optimization', 'industries', 'quality', 'technical', 'faq']:
                if key in english_data:
                    pages_english[key] = english_data[key]
                    print(f"✓ Updated pages.englishSubtitle.{key} from Chinese root data")
    
    # Save the updated file
    print(f"Saving updated {zh_file}...")
    with open(zh_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print("✅ Chinese pages structure fix completed!")

if __name__ == "__main__":
    fix_zh_pages_structure()