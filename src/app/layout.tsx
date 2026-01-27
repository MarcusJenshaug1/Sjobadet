import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Sjøbadet Badstue | Badstue i Tønsberg",
    template: "%s | Sjøbadet"
  },
  description: "Book badstue hos Sjøbadet. Avslappende og rolige badstuer på Tønsberg Brygge og Hjemseng Brygge.",
  metadataBase: new URL('https://sjobadet.no'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Sjøbadet Badstue | Badstue i Tønsberg",
    description: "Book badstue hos Sjøbadet. Avslappende og rolige badstuer på Tønsberg Brygge og Hjemseng Brygge.",
    url: 'https://sjobadet.no',
    siteName: 'Sjøbadet',
    locale: 'no_NO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Sjøbadet Badstue",
    description: "Book badstue hos Sjøbadet. Avslappende og rolige badstuer på Tønsberg Brygge og Hjemseng Brygge.",
    creator: '@sjobadet', // Assuming a handle or just generic
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import { TrackingProvider } from '@/components/analytics/TrackingProvider';
import { getSession } from "@/lib/auth";
import { AlertBar } from '@/components/layout/AlertBar';
import { SmartPrefetcher } from '@/components/layout/SmartPrefetcher';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let isAdmin = false;
  try {
    const session = await getSession();
    isAdmin = !!session;
  } catch (error) {
    console.error('Failed to get session in RootLayout:', error);
  }

  return (
    <html lang="no" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://mdmvybibiaxiezjycqgr.supabase.co" />
      </head>
      <body className={`${inter.className} ${outfit.className}`}>
        <ErrorBoundary>
          <TrackingProvider isAdmin={isAdmin}>
            <ScrollToTop />
            <SmartPrefetcher />
            {children}
          </TrackingProvider>
        </ErrorBoundary>
        <SpeedInsights />
      </body>
    </html>
  );
}
