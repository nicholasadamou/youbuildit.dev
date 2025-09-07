import React from 'react';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Navbar from '@/components/Navbar';
import WebVitals from '@/components/WebVitals';
import { ThemeProvider } from '@/components/ThemeProvider';
import { defaultSiteMetadata } from '@/lib/og-metadata';
import { Analytics } from '@vercel/analytics/react';

const geistSans = localFont({
  src: '../public/fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: '../public/fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = defaultSiteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <WebVitals />
          <Navbar />
          <main className="bg-background text-foreground min-h-screen">
            {children}
          </main>
        </ThemeProvider>
        {/* Only render analytics in production or when deployment ID is available */}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  );
}
