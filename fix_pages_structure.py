#!/usr/bin/env python3
"""
Fix the pages structure in English JSON to match expected component access patterns.
This script copies hero data from root level to pages structure for consistency.
"""

import json
import os

def fix_english_pages_structure():
    en_file = "/Users/liuyinjiwen/Documents/coding/sub-trans4/src/lib/locales/en.json"
    
    print(f"Loading {en_file}...")
    with open(en_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Copy data from root level to pages structure
    if 'englishSubtitle' in data and 'pages' in data and 'englishSubtitle' in data['pages']:
        root_english = data['englishSubtitle']
        pages_english = data['pages']['englishSubtitle']
        
        # Copy hero structure
        if 'hero' in root_english:
            pages_english['hero'] = root_english['hero']
            print("✓ Copied hero structure to pages.englishSubtitle")
        
        # Copy other missing structures that pages might need
        for key in ['solutions', 'supportedLanguages', 'optimization', 'industries', 'quality', 'technical', 'faq']:
            if key in root_english:
                pages_english[key] = root_english[key]
                print(f"✓ Copied {key} structure to pages.englishSubtitle")
    
    # Do the same for other subtitle pages if they exist in root
    for page_type in ['chineseSubtitle', 'spanishSubtitle', 'portugueseSubtitle', 'frenchSubtitle']:
        if page_type in data and 'pages' in data and page_type in data['pages']:
            root_data = data[page_type]
            pages_data = data['pages'][page_type]
            
            # Copy hero structure (convert old format to new if needed)
            if 'hero' in root_data:
                pages_data['hero'] = root_data['hero']
                print(f"✓ Copied hero structure to pages.{page_type}")
            elif 'heroTitle' in root_data or 'heroSubtitle' in root_data:
                # Convert old format to new
                pages_data['hero'] = {
                    'headline': root_data.get('heroTitle', ''),
                    'subheadline': root_data.get('heroSubtitle', '')
                }
                print(f"✓ Converted and copied hero structure to pages.{page_type}")
            
            # Copy other structures
            for key in ['solutions', 'supportedLanguages', 'optimization', 'industries', 'quality', 'technical', 'faq']:
                if key in root_data:
                    pages_data[key] = root_data[key]
                    print(f"✓ Copied {key} structure to pages.{page_type}")
    
    # Save the updated file
    print(f"Saving updated {en_file}...")
    with open(en_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print("✅ English pages structure fix completed!")

if __name__ == "__main__":
    fix_english_pages_structure()