import type { Metadata } from "next";
import { DM_Serif_Display, Inter, Syne } from "next/font/google";
import Navbar from "@/components/navigation/Navbar";
import "./globals.css";

const syne = Syne({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const dmSerifDisplay = DM_Serif_Display({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-ppmondwest",
  display: "swap",
});

const inter = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-af",
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
        className={`${dmSerifDisplay.variable} ${inter.variable} ${syne.variable} bg-warm-beige text-dark-charcoal font-af antialiased min-h-screen`}
      >
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
