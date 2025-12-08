import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/navigation';
import FloatingQueue from '@/components/floating-queue';

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
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <Navigation />
          <main>{children}</main>
          <FloatingQueue />
        </div>
      </body>
    </html>
  );
}
