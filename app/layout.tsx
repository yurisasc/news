import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import type React from "react";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Obluda | Today's Scenery of the End",
  description:
    "The monster has no name, only a hunger for truth. It consumes the chaos of global affairs to deliver pure, nameless clarity. Read what remains.",
  icons: {
    icon: [
      {
        url: "/favicon-32x32.png",
        type: "image/png",
      },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Obluda | Today’s Scenery of the End",
    description:
      "The monster has no name, only a hunger for truth. It consumes the chaos of global affairs to deliver pure, nameless clarity. Read what remains.",
    url: siteUrl,
    siteName: "Obluda",
    images: [
      {
        url: `${siteUrl}/og_image.png`,
        width: 1200,
        height: 630,
        alt: "Obluda – Today’s Scenery of the End",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Obluda | Today’s Scenery of the End",
    description:
      "The monster has no name, only a hunger for truth. It consumes the chaos of global affairs to deliver pure, nameless clarity. Read what remains.",
    images: [`${siteUrl}/og_image.png`],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
