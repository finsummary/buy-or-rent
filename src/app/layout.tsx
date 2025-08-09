import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { Suspense } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Buy vs Rent Calculator | BuyOrRent.io",
  description: "Make informed decisions about homeownership vs renting with our comprehensive calculator that compares the total cost of ownership.",
  keywords: "buy vs rent, mortgage calculator, real estate, property investment, homeownership, rental analysis",
  authors: [{ name: "BuyOrRent.io" }],
  creator: "BuyOrRent.io",
  publisher: "BuyOrRent.io",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: "Buy vs Rent Calculator | BuyOrRent.io",
    description: "Make informed decisions about homeownership vs renting",
    url: "/",
    siteName: "BuyOrRent.io",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BuyOrRent.io Calculator",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Buy vs Rent Calculator | BuyOrRent.io",
    description: "Make informed decisions about homeownership vs renting",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <Suspense>
          <GoogleAnalytics />
          {children}
        </Suspense>
      </body>
    </html>
  );
}
