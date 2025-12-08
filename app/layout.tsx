import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/navigation';
import FloatingQueue from '@/components/floating-queue';
import ThemeProvider from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MediaDown - Advanced Media Downloader',
  description: 'Download media from any platform with our hybrid backend system',
  keywords: ['media downloader', 'video downloader', 'youtube downloader', 'hybrid backend'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 light:from-gray-50 light:via-purple-50 light:to-blue-50">
            <Navigation />
            <main>{children}</main>
            <FloatingQueue />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
