import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mercatino.ch — Annunci gratuiti in Svizzera",
    template: "%s | Mercatino.ch",
  },
  description:
    "Compra e vendi gratis vicino a te: auto, elettronica, mobili, abbigliamento e molto altro. Pubblicare un annuncio è gratuito al 100%, senza commissioni.",
  keywords: [
    "annunci gratuiti",
    "mercatino",
    "usato",
    "comprare",
    "vendere",
    "Svizzera",
    "Ticino",
  ],
  openGraph: {
    type: "website",
    locale: "it_CH",
    siteName: "Mercatino.ch",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-gray-50 font-sans text-gray-900">
        {ADSENSE_CLIENT && (
          <Script
            id="adsense-script"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <Header />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
