#!/usr/bin/env python3
"""
Restore Chinese chineseSubtitle content from backup file and apply to current zh.json.
This ensures the Chinese subtitle page shows Chinese content.
"""

import json

def restore_chinese_content():
    zh_file = "/Users/liuyinjiwen/Documents/coding/sub-trans4/src/lib/locales/zh.json"
    backup_file = "/Users/liuyinjiwen/Documents/coding/sub-trans4/src/lib/locales/zh.json.backup"
    
    print(f"Loading backup file: {backup_file}")
    with open(backup_file, 'r', encoding='utf-8') as f:
        backup_data = json.load(f)
    
    print(f"Loading current file: {zh_file}")
    with open(zh_file, 'r', encoding='utf-8') as f:
        current_data = json.load(f)
    
    # Find chineseSubtitle in backup
    if 'chineseSubtitle' in backup_data:
        chinese_backup = backup_data['chineseSubtitle']
        print(f"✓ Found chineseSubtitle in backup with {len(chinese_backup)} keys")
        print(f"  Keys: {list(chinese_backup.keys())}")
        
        # Ensure pages structure exists in current data
        if 'pages' not in current_data:
            current_data['pages'] = {}
        
        # Copy the complete Chinese data to pages.chineseSubtitle
        current_data['pages']['chineseSubtitle'] = chinese_backup.copy()
        
        # Ensure hero structure is properly formatted
        if 'heroTitle' in chinese_backup or 'heroSubtitle' in chinese_backup:
            if 'hero' not in current_data['pages']['chineseSubtitle']:
                current_data['pages']['chineseSubtitle']['hero'] = {}
            
            hero = current_data['pages']['chineseSubtitle']['hero']
            hero['headline'] = chinese_backup.get('heroTitle', chinese_backup.get('hero', {}).get('headline', ''))
            hero['subheadline'] = chinese_backup.get('heroSubtitle', chinese_backup.get('hero', {}).get('subheadline', ''))
            
            print("✓ Updated hero structure with Chinese content")
        
        print("✓ Restored complete Chinese content to pages.chineseSubtitle")
        
        # Verify the restoration
        restored = current_data['pages']['chineseSubtitle']
        print(f"  Verification - Solutions title: {restored.get('solutions', {}).get('title', 'Missing')}")
        print(f"  Verification - Hero headline: {restored.get('hero', {}).get('headline', 'Missing')}")
        
    else:
        print("❌ No chineseSubtitle found in backup file")
        return
    
    # Save the updated file
    print(f"Saving updated file: {zh_file}")
    with open(zh_file, 'w', encoding='utf-8') as f:
        json.dump(current_data, f, ensure_ascii=False, indent=2)
    
    print("✅ Chinese content restoration completed!")

if __name__ == "__main__":
    restore_chinese_content()