import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ScrollToTop } from '@/components/layout/ScrollToTop';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sjøbadet Badstue | Badstue i Tønsberg",
  description: "Book badstue hos Sjøbadet. Avslappende og rolige badstuer på Tønsberg Brygge og Hjemseng Brygge.",
};

import { TrackingProvider } from '@/components/analytics/TrackingProvider';
import { getSession } from "@/lib/auth";

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
      <body className={`${inter.className} ${outfit.className}`}>
        <TrackingProvider isAdmin={isAdmin}>
          <ScrollToTop />
          {/* <AlertBar /> */}
          {children}
        </TrackingProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
