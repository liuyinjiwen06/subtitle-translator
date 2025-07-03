import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://subtitletranslator.cc'),
  title: {
    default: 'Subtitle Translator - Free Online SRT Subtitle Translation',
    template: '%s | Subtitle Translator'
  },
  description: 'Free online subtitle translation tool, supports SRT format, AI intelligent translation, supports multiple languages. Professional subtitle translation service, simple and easy to use.',
  keywords: 'subtitle translation,SRT translation,online translation,subtitle conversion,AI translation,free translation',
  authors: [{ name: 'Subtitle Translator' }],
  creator: 'Subtitle Translator',
  publisher: 'Subtitle Translator',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['zh_CN', 'ja_JP'],
    url: 'https://subtitletranslator.cc',
    siteName: 'Subtitle Translator',
    title: 'Subtitle Translator - Free Online SRT Subtitle Translation',
    description: 'Free online subtitle translation tool, supports SRT format, AI intelligent translation, supports multiple languages.',
    images: [
      {
        url: '/icon.png',
        width: 800,
        height: 600,
        alt: 'Subtitle Translator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Subtitle Translator - Free Online SRT Subtitle Translation',
    description: 'Free online subtitle translation tool, supports SRT format, AI intelligent translation, supports multiple languages.',
    images: ['/icon.png'],
  },
  other: {
    'theme-color': '#2563eb',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className={inter.className} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
