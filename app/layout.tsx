import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";

import "./globals.css";

import BackgroundEffects from "@/components/background/BackgroundEffects";
import Navbar from "@/components/ui/layout/Navbar";
import MusicPlayerBar from "@/components/ui/music/MusicPlayerBar";
import { MusicPlayerProvider } from "@/components/ui/music/MusicPlayerProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Itoi Toi",
  description: "Itoi Toi fan website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} relative isolate min-h-screen`}
      >
        <BackgroundEffects />

        <MusicPlayerProvider>
          <div className="relative z-0 min-h-screen">
            <Navbar />

            {children}

            <MusicPlayerBar />
          </div>
        </MusicPlayerProvider>
      </body>
    </html>
  );
}