import type { Metadata } from "next";
import { Inter } from "next/font/google";
import PWARegister from "@/components/shared/PWARegister";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Habitify",
  description: "An offline-first habit tracker built by Afolayan Timileyin",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
  <link rel="manifest" href="/manifest.json" />
</head>
      <body className="min-h-full flex flex-col">
        <PWARegister />
        {children}
      </body>
    </html>
  );
}
