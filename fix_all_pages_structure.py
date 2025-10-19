#!/usr/bin/env python3
"""
Fix the pages structure in all language JSON files to match expected component access patterns.
This script ensures all subtitle page data is properly accessible under pages.{pageType}.
"""

import json
import os
import glob

def fix_pages_structure_for_file(filepath):
    print(f"Processing {filepath}...")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    modified = False
    
    # Ensure pages section exists
    if 'pages' not in data:
        data['pages'] = {}
        modified = True
    
    # Page types to check
    page_types = ['chineseSubtitle', 'englishSubtitle', 'spanishSubtitle', 'portugueseSubtitle', 'frenchSubtitle']
    
    for page_type in page_types:
        if page_type in data:  # If root level data exists
            root_data = data[page_type]
            
            # Ensure pages section for this page type exists
            if page_type not in data['pages']:
                data['pages'][page_type] = {}
                modified = True
            
            pages_data = data['pages'][page_type]
            
            # Copy/convert hero structure
            if 'hero' in root_data:
                pages_data['hero'] = root_data['hero']
                modified = True
                print(f"  ✓ Copied hero structure to pages.{page_type}")
            elif 'heroTitle' in root_data or 'heroSubtitle' in root_data:
                # Convert old format to new
                pages_data['hero'] = {
                    'headline': root_data.get('heroTitle', ''),
                    'subheadline': root_data.get('heroSubtitle', '')
                }
                modified = True
                print(f"  ✓ Converted hero structure to pages.{page_type}")
            
            # Copy other sections that pages might need
            sections_to_copy = ['solutions', 'supportedLanguages', 'optimization', 'industries', 'quality', 'technical', 'faq']
            for section in sections_to_copy:
                if section in root_data and section not in pages_data:
                    pages_data[section] = root_data[section]
                    modified = True
                    print(f"  ✓ Copied {section} to pages.{page_type}")
    
    # Save if modified
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"  ✅ Updated {filepath}")
    else:
        print(f"  ℹ️  No changes needed for {filepath}")

def fix_all_language_files():
    locales_dir = "/Users/liuyinjiwen/Documents/coding/sub-trans4/src/lib/locales"
    json_files = glob.glob(os.path.join(locales_dir, "*.json"))
    
    # Filter out backup files
    json_files = [f for f in json_files if not f.endswith('.backup')]
    
    print(f"Found {len(json_files)} language files to process...")
    
    for json_file in json_files:
        fix_pages_structure_for_file(json_file)
    
    print("\\n✅ All language files processed!")

if __name__ == "__main__":
    fix_all_language_files()