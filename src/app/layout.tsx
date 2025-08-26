import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { Suspense } from "react";
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Buy Or Rent Calculator",
  description: "A simple calculator to help you decide whether to buy or rent a home.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased flex flex-col",
          inter.variable
        )}
      >
        <Header />
        <div className="flex-grow">
          {children}
        </div>
        <Footer />
        <Suspense>
          <GoogleAnalytics />
        </Suspense>
      </body>
    </html>
  );
}
