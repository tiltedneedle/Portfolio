import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { FilmGrain } from "@/components/FilmGrain";
import { TopMark } from "@/components/room/TopMark";
import { Cursor } from "@/components/room/Cursor";
import { CutOverlay } from "@/components/room/CutOverlay";
import { client } from "@/content/client/client";
import "./globals.css";

// Four faces, all vendored as woff2 so the build needs no network, all SIL OFL.
// Each declares a `--font-*-face` variable; globals.css maps those into the
// Tailwind theme. Swapping a licensed face in later is a one-file change here.
const sans = localFont({
  src: "./fonts/instrument-sans-var.woff2",
  weight: "400 700",
  style: "normal",
  variable: "--font-sans-face",
  display: "swap",
  adjustFontFallback: "Arial",
});

const display = localFont({
  src: "./fonts/big-shoulders-display-var.woff2",
  weight: "300 900",
  style: "normal",
  variable: "--font-display-face",
  display: "swap",
  adjustFontFallback: "Arial",
});

const serif = localFont({
  src: "./fonts/instrument-serif-italic.woff2",
  weight: "400",
  style: "italic",
  variable: "--font-serif-face",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

const mono = localFont({
  src: "./fonts/jetbrains-mono-var.woff2",
  weight: "400 700",
  style: "normal",
  variable: "--font-mono-face",
  display: "swap",
  adjustFontFallback: "Arial",
});

const NAME = client.name + " × Tilted Needle";

// A private system for one client: nothing here is for search engines.
export const metadata: Metadata = {
  title: { default: NAME, template: "%s · " + NAME },
  description: "Your complete viral content system.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "256x256", type: "image/x-icon" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0b0b0c",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${serif.variable} ${mono.variable}`}>
      <body className="antialiased">
        <FilmGrain />
        {children}
        <TopMark />
        <Cursor />
        <CutOverlay />
      </body>
    </html>
  );
}
