# Subtitle Translator

AI-powered subtitle translation tool supporting 50+ languages, built with Next.js 14 and Cloudflare Workers.

## 🎯 Features

- **50+ Languages**: Translate subtitles between 50 of the world's most spoken languages
- **AI-Powered**: Uses OpenAI GPT-3.5-turbo for accurate, context-aware translations
- **Multiple Output Formats**:
  - Monolingual (target language only)
  - Bilingual (source + target language)
  - Both formats simultaneously
- **20 UI Languages**: Interface available in 20 different languages
- **Privacy-First**: Files are processed locally in your browser, never stored on servers
- **Free to Use**: Up to 50 translations per day
- **Fast**: Process hundreds of subtitle entries in minutes

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: Zustand
- **Internationalization**: next-intl
- **Backend**: Cloudflare Workers
- **AI**: OpenAI API (GPT-3.5-turbo)
- **Deployment**: Cloudflare Pages + Workers

## 📂 Project Structure

```
subtitle-translator/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── [locale]/          # Internationalized routes
│   │   │   ├── page.tsx       # Main translator interface
│   │   │   └── layout.tsx     # Locale-specific layout
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui base components
│   │   ├── FileUploader.tsx  # File upload with drag-and-drop
│   │   ├── LanguageSelector.tsx  # Language picker with search
│   │   ├── TranslationProgress.tsx  # Real-time progress display
│   │   ├── OutputFormatSelector.tsx  # Format selection
│   │   └── DownloadButtons.tsx  # Download triggers
│   ├── lib/                   # Utility libraries
│   │   ├── srt-parser.ts     # SRT file parser
│   │   ├── srt-generator.ts  # SRT file generator
│   │   ├── translation-client.ts  # API client
│   │   └── utils.ts          # Common utilities
│   ├── store/                # Zustand stores
│   │   └── translation-store.ts  # Translation state management
│   ├── config/               # Configuration files
│   │   ├── languages.ts      # 50 translation languages
│   │   ├── ui-locales.ts     # 20 UI languages
│   │   └── language-pairs.ts # Language pair routing
│   ├── i18n.ts              # next-intl configuration
│   └── middleware.ts        # Internationalization middleware
├── workers/
│   └── translator.ts        # Cloudflare Worker (API proxy + rate limiting)
├── locales/                 # UI translation files
│   ├── en.json             # English (base)
│   ├── zh.json             # Chinese
│   └── ...                 # Other 18 languages
├── scripts/                # Utility scripts
│   └── translate-locales.ts  # Auto-translate UI strings
├── PROJECT.md              # Detailed project documentation
├── DEVELOPMENT.md          # Development guide
├── LANGUAGES.md            # Language configuration guide
└── TRANSLATION_TOOL.md     # Translation tool documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 18.17.0
- npm ≥ 9.0.0
- OpenAI API Key ([get one here](https://platform.openai.com/api-keys))
- Cloudflare account (free)

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd subtitle-translator
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local and add your OpenAI API key
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_WORKERS_URL=http://localhost:8787
```

4. **Set up Cloudflare Workers (for local development)**

```bash
# Copy the example file
cp .dev.vars.example .dev.vars

# Edit .dev.vars and add your OpenAI API key
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RATE_LIMIT_HOURLY=10
RATE_LIMIT_DAILY=50
```

5. **Run the development server**

```bash
# Terminal 1: Start Next.js
npm run dev

# Terminal 2: Start Cloudflare Workers
npm run dev:workers

# Or run both together
npm run dev:all
```

6. **Open your browser**

Navigate to [http://localhost:3000/en](http://localhost:3000/en)

## 📖 Usage

1. **Upload SRT File**: Drag and drop or browse for your .srt subtitle file (max 5MB)
2. **Select Languages**: Choose source and target languages from 50+ options
3. **Choose Output Format**:
   - Monolingual: Only translated subtitles
   - Bilingual: Source + translated subtitles (line by line)
   - Both: Get two separate files
4. **Click "Start Translation"**: Watch real-time progress
5. **Download**: Get your translated subtitle file(s)

## 🌍 Supported Languages

### UI Languages (20)
English, Chinese (Simplified), Spanish, French, German, Japanese, Korean, Portuguese, Russian, Arabic, Hindi, Italian, Turkish, Vietnamese, Thai, Polish, Dutch, Indonesian, Ukrainian, Swedish

### Translation Languages (50)
All UI languages plus Bengali, Urdu, Swahili, Marathi, Telugu, Tamil, Malay, Greek, Czech, Romanian, Hungarian, Hebrew, Danish, Finnish, Norwegian, Slovak, Bulgarian, Croatian, Slovenian, Lithuanian, Latvian, Estonian, Persian, Filipino, Gujarati, Kannada, Burmese, Nepali, Sinhala, Kazakh

See [LANGUAGES.md](LANGUAGES.md) for complete details.

## 🔧 Development

### Project Commands

```bash
# Development
npm run dev                 # Start Next.js dev server
npm run dev:workers        # Start Cloudflare Workers locally
npm run dev:all            # Start both (requires concurrently)

# Building
npm run build              # Build Next.js app
npm run build:workers      # Deploy Workers

# Code Quality
npm run lint               # Run ESLint
npm run lint:fix          # Auto-fix linting issues
npm run format            # Format with Prettier
npm run type-check        # TypeScript type checking

# Translation Tools
npm run translate:all      # Translate UI strings to all languages
npm run translate:check    # Check for missing translations
npm run translate:locale -- zh  # Translate specific language
```

### Adding a New UI Language

1. Add the language code to `src/config/ui-locales.ts`
2. Create `locales/{code}.json`
3. Run `npm run translate:locale -- {code}`
4. Review and manually correct machine translations

See [TRANSLATION_TOOL.md](TRANSLATION_TOOL.md) for details.

## 🚢 Deployment

### Deploy to Cloudflare

1. **Create a KV namespace** (for rate limiting)

```bash
npx wrangler kv:namespace create "RATE_LIMIT_KV"
```

2. **Update `wrangler.toml`** with the KV namespace ID

3. **Deploy Workers**

```bash
cd workers
npx wrangler deploy
```

4. **Set Workers environment variables** in Cloudflare Dashboard:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `RATE_LIMIT_HOURLY`: 10
   - `RATE_LIMIT_DAILY`: 50

5. **Deploy Next.js to Cloudflare Pages**

Connect your GitHub repo to Cloudflare Pages:
- Build command: `npm run build`
- Build output directory: `.next`
- Environment variable: `NEXT_PUBLIC_WORKERS_URL=https://translator.your-username.workers.dev`

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment instructions.

## 📝 Documentation

**📁 All documentation is in the [`docs/`](docs/) folder**

Quick links:
- [📋 Documentation Index](docs/INDEX.md) - Complete documentation guide
- [📖 Project Overview](docs/PROJECT.md) - Architecture, features, and progress
- [🛠️ Development Guide](docs/DEVELOPMENT.md) - Setup and development workflow
- [🌍 i18n Guide](docs/I18N_GUIDE.md) - Multi-language system (must-read!)
- [🚀 Deployment Guide](docs/DEPLOYMENT.md) - Deploy to Cloudflare
- [🎨 New Features](docs/NEW_SECTIONS_SUMMARY.md) - Benefits, How-to, FAQ sections

**Start here**: Read [docs/INDEX.md](docs/INDEX.md) for a complete documentation overview.

## 🔒 Security & Privacy

- **API Keys**: Stored securely in Cloudflare Workers environment variables
- **No File Storage**: All files are processed in-browser, never uploaded to servers
- **Rate Limiting**: 10 requests/hour, 50 requests/day per IP to prevent abuse
- **Input Validation**: File size (max 5MB) and format (.srt) validation

## 💰 Cost Estimation

Based on 100 translations/day:

| Service | Cost |
|---------|------|
| OpenAI API (GPT-3.5-turbo) | ~$6/month |
| Cloudflare Pages | Free |
| Cloudflare Workers | Free (within limits) |
| Cloudflare KV | Free (within limits) |
| **Total** | **$6-10/month** |

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

MIT License - see LICENSE file for details.

## 🐛 Issues & Support

- Report bugs: [GitHub Issues](https://github.com/your-username/subtitle-translator/issues)
- Documentation: See files in project root
- Contact: [your-email@example.com]

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Translation powered by [OpenAI](https://openai.com/)
- Hosted on [Cloudflare](https://cloudflare.com/)

---

**Made with ❤️ for the subtitle translation community**
