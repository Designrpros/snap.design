import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/navigation/Navbar";
import "./globals.css";

const display = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-af",
  display: "swap",
});

const mono = JetBrains_Mono({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Snap.Design — Design Reference Gallery",
  description:
    "A curated library of design tokens from the world's best digital products. Stop building ugly UIs — give your agent a reference for what good looks like.",
  openGraph: {
    title: "Snap.Design — Design Reference Gallery",
    description:
      "A curated library of design tokens from the world's best digital products.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${inter.variable} ${mono.variable} bg-eggshell text-obsidian font-af antialiased min-h-screen`}
      >
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
