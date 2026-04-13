import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KaziRadar | Global Opportunity Intelligence",
  description: "Elite AI-powered scanner for Tech, Agriculture, and Fintech opportunities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} antialiased dark`}>
      <body className="bg-[#050b15] selection:bg-emerald-500/30">
        {children}
      </body>
    </html>
  );
}
