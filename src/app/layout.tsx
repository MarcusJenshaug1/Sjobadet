import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AlertBar } from '@/components/layout/AlertBar';
import { SpeedInsights } from '@vercel/speed-insights/next';

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
  const session = await getSession();
  const isAdmin = !!session;

  return (
    <html lang="no" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className={`${inter.className} ${outfit.className}`}>
        <TrackingProvider isAdmin={isAdmin}>
          {/* <AlertBar /> */}
          {children}
        </TrackingProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
