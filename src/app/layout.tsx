import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SiteHeader, Footer } from '@/components/site-header'

export const metadata: Metadata = {
  title: "FarmLink",
  description: "Direct from Farm to Market",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col"><SiteHeader />{children}<Footer /></body>
    </html>
  );
}
