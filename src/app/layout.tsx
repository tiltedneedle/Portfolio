import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { FilmGrain } from "@/components/FilmGrain";
import { organizationSchema, websiteSchema } from "@/lib/structured-data";
import "./globals.css";

// Two faces, both vendored as woff2 so the build needs no network.
//
// A previous revision declared webfonts and never referenced them: of 527
// text-bearing elements, zero resolved to Inter, because the stack in
// globals.css was still `-apple-system, …`. Both variables below ARE in that
// stack now — if you add a face here, put it in the stack too or it does
// nothing but cost bytes.
//
// The display face is Instrument Serif (SIL OFL). The reference site uses
// PP Migra, which is commercially licensed and not ours to ship.
const sans = localFont({
  src: "./fonts/inter-latin-var.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-sans",
  display: "swap",
  adjustFontFallback: "Arial",
});

const displaySerif = localFont({
  src: "./fonts/instrument-serif-italic.woff2",
  weight: "400",
  style: "italic",
  variable: "--font-display",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tiltedneedle.com"),
  title: "Tilted Needle | Built to Make Brands Go Viral",
  description:
    "A social media production company based in London and Dubai. 2B+ organic views. $250M+ revenue generated for clients.",
  authors: [{ name: "Tilted Needle" }],
  keywords: [
    "viral content",
    "short-form video",
    "social media marketing",
    "TikTok agency",
    "content creation",
    "brand growth",
    "video production",
    "influencer marketing",
  ],
  robots: "index, follow",
  openGraph: {
    title: "Tilted Needle | Built to Make Brands Go Viral",
    description:
      "A social media production company based in London and Dubai. 2B+ organic views. $250M+ revenue generated for clients.",
    url: "https://tiltedneedle.com",
    siteName: "Tilted Needle",
    locale: "en_GB",
    type: "website",
    // images come from src/app/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: "Tilted Needle | Built to Make Brands Go Viral",
    description:
      "A social media production company based in London and Dubai. 2B+ organic views. $250M+ revenue generated for clients.",
  },
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "256x256", type: "image/x-icon" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${displaySerif.variable}`}>
      <body className="antialiased">
        <FilmGrain />
        {children}
        <script
          type="application/ld+json"
          // Static, developer-authored JSON — no user input reaches this.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationSchema, websiteSchema]),
          }}
        />
      </body>
    </html>
  );
}
