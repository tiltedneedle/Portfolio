import type { Metadata, Viewport } from "next";
import { organizationSchema, websiteSchema } from "@/lib/structured-data";
import "./globals.css";

// This site ships no webfonts, deliberately.
//
// The original loaded Inter (7 subsets, 212 KB in the build, 47 KB preloaded)
// and Cormorant Garamond (4 weights, ~37 KB preloaded) — and rendered neither.
// Both were wired up as CSS variables that nothing ever referenced, while the
// actual stack in globals.css is `-apple-system, BlinkMacSystemFont,
// "SF Pro Display", …`. Measured on the built page: of 527 text-bearing
// elements, zero resolved to Inter.
//
// So both are gone. The system stack is what the design was always rendering
// in, it needs no network at build or runtime, and it has no swap flash.
// If a real webfont is ever wanted, add it here AND put it in the stack.

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
    <html lang="en">
      <body className="antialiased">
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
