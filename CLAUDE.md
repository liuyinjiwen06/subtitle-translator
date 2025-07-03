# Sub-Trans4 - Subtitle Translation Application

## Project Overview

Sub-Trans4 is a multilingual subtitle translation web application built with Next.js 15, supporting 38+ target languages and 16+ interface languages. The application provides free AI-powered subtitle translation with support for Google Cloud Translate and OpenAI translation services.

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Runtime**: Edge Runtime (Cloudflare Pages compatible)
- **Styling**: Tailwind CSS
- **Internationalization**: Custom i18n implementation with server-side rendering
- **Translation Services**: Google Cloud Translate API, OpenAI API
- **Deployment**: Cloudflare Pages with dynamic routing

### Key Features
- Real-time subtitle translation with streaming progress
- Multi-service translation (Google/OpenAI) with fallbacks
- 38+ target languages for subtitle translation
- 16+ interface languages with complete localization
- SEO-optimized language-specific landing pages
- Drag & drop SRT file upload
- Edge Runtime deployment compatibility

## File Structure

### Core Application Files
```
src/
├── app/
│   ├── layout.tsx                 # Root layout with metadata
│   ├── page.tsx                   # Root redirect to /en
│   ├── [locale]/
│   │   ├── layout.tsx            # Locale-specific layout with metadata
│   │   ├── page.tsx              # Main homepage for each locale
│   │   └── *-subtitle/page.tsx   # Language-specific landing pages
│   └── api/
│       ├── translate/route.ts     # Main translation API endpoint
│       └── translate-stream/route.ts # Streaming translation API
├── components/
│   ├── HomePage.tsx              # Main homepage component
│   ├── SubtitleTranslator.tsx    # Core translation functionality
│   ├── LanguageChanger.tsx       # Interface language switcher
│   ├── UniversalLanguagePage.tsx # Generic language page template
│   └── ClientNavigation.tsx      # Client-side navigation component
└── lib/
    ├── server-i18n.ts           # Server-side i18n implementation
    ├── locales/                 # Translation files (16+ languages)
    └── pageConfig.ts            # Page configuration utilities
```

### Configuration Files
- `i18nConfig.ts` - Internationalization configuration
- `middleware.ts` - Locale detection and routing
- `next.config.ts` - Next.js configuration for Cloudflare Pages
- `package.json` - Dependencies and build scripts

## Development Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Build for Cloudflare Pages (static export)
npm run build:cloudflare
npm run build:static

# Cloudflare Pages build
npm run pages:build

# Linting
npm run lint
npm run lint:fix
```

## Translation System

### Server-side i18n (`src/lib/server-i18n.ts`)
- Cached translation loading with Map-based storage
- Dynamic locale detection and fallback to English
- Page-specific configuration generation
- Error handling with detailed logging

### Translation Files Structure (`src/lib/locales/`)
Each locale file contains:
- SEO metadata (title, description, keywords)
- UI elements and messages
- Feature descriptions with icons
- Industry use cases
- FAQ sections
- Language-specific content for landing pages

### API Translation (`src/app/api/translate/route.ts`)
- Edge Runtime compatible
- Streaming responses for real-time progress
- Multiple provider support (Google Cloud, OpenAI)
- SRT file parsing and validation
- Language detection capabilities
- Comprehensive error handling

## Routing Strategy

### Locale-based Routing
- Default: `/` redirects to `/en`
- Localized: `/{locale}` for each supported language
- Language pages: `/{locale}/{language}-subtitle`

### Middleware Logic (`middleware.ts`)
- Automatic locale detection from Accept-Language headers
- Cookie-based locale persistence
- Legacy URL format redirects
- Static asset bypassing

## Component Architecture

### Core Components

#### HomePage (`src/components/HomePage.tsx`)
- Primary landing page for each locale
- Dynamic content from translation files
- Structured data for SEO
- Language-specific page navigation

#### SubtitleTranslator (`src/components/SubtitleTranslator.tsx`)
- File upload with drag & drop support
- Translation service selection
- Target language picker (38+ languages)
- Real-time progress tracking
- Download functionality

#### LanguageChanger (`src/components/LanguageChanger.tsx`)
- Interface language switcher
- Flag icons for visual identification
- Proper URL routing with locale preservation

## Deployment

### Cloudflare Pages Configuration
- Edge Runtime compatibility
- Static file optimization
- Environment variable management
- Custom build commands for Pages

### Build Optimization
- ESLint and TypeScript error bypassing for deployment
- Image optimization disabled for static export
- Webpack cache disabled for smaller builds

## Identified Redundancies

### Potentially Unused Files
1. **`src/components/UniversalLanguagePage.tsx`** - Complex component that may overlap with existing language-specific pages
2. **`src/components/ClientPageTemplate.tsx`** - Similar functionality to HomePage component
3. **`src/components/PageTemplate.tsx`** - May be superseded by newer template components
4. **`src/components/ServerPageTemplate.tsx`** - Possible architectural remnant
5. **`styles/globals.css`** - Duplicate of `src/app/globals.css`

### Backup and Generated Files
- **`backups/`** directory contains numerous .json.backup files that could be archived
- **`out/`** directory contains build output that should be in .gitignore
- **`src/lib/locales/zh.json.backup`** - Backup file in main codebase
- **`public/generated-content/`** and **`src/new/`** - Possible legacy generated content

### Legacy Configuration
- **`next-i18next.config.js`** - Unused configuration for different i18n library
- **`src/components/HomePage.tsx.bak`** - Backup file in main codebase

## Recommendations

### Immediate Cleanup
1. Remove or archive unused component files
2. Move backup files out of main codebase
3. Add `out/` directory to .gitignore
4. Consolidate duplicate CSS files
5. Remove legacy configuration files

### Code Organization
1. Audit translation file usage to identify unnecessary content
2. Consider splitting large translation files by feature area
3. Consolidate page template approaches into single pattern
4. Document component usage to prevent future redundancy

### Performance Optimization
1. Implement translation file lazy loading
2. Consider component code splitting for language-specific pages
3. Optimize image assets and implement proper caching strategies

## Environment Variables

The application expects the following environment variables:
- Translation service API keys (Google Cloud, OpenAI)
- Custom environment variables as defined in next.config.ts

## Recent i18n Fixes (December 2024)

### Issue Resolved: Translation Files Structure Mismatch
**Problem**: All locale files except `en.json` were using a flat structure, while the application expected nested structure with `homepage.meta`, `homepage.hero`, etc. This caused multilingual content to not display properly.

**Solution**: Restructured all 15 non-English locale files to match the nested format:
- Added `homepage.meta` section with title and description
- Added `homepage.hero` section with headline, subheadline, and features array  
- Preserved all existing flat structure keys for backward compatibility

**Files Fixed**:
- Key languages: `zh.json`, `fr.json`, `es.json`, `de.json`, `ja.json`, `pt.json`, `it.json`, `ru.json`
- Additional languages: `ko.json`, `ar.json`, `hi.json`, `nl.json`, `pl.json`, `th.json`, `tr.json`, `vi.json`, `sv.json`

**Result**: Multilingual interface now displays properly with localized titles, descriptions, and hero content across all 16 supported languages.

## Notes

This is a well-structured multilingual application with comprehensive i18n support. The recent i18n structure fixes resolved the critical translation display issue, ensuring all languages now work properly. The application successfully supports both static and dynamic deployment scenarios while maintaining strong SEO characteristics across all locales.