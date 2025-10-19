import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Subtitle Translator - AI-Powered SRT Translation',
  description: 'Translate SRT subtitles to 50+ languages using advanced AI technology. Fast, accurate, and free.',
  keywords: 'subtitle translation, SRT translator, AI translation, video subtitles',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
