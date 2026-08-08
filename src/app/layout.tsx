import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { organizationSchema, websiteSchema } from "@/lib/structured-data";
import "./globals.css";

// The original also loaded Cormorant Garamond in four weights and preloaded it
// (~37 KB, 20 @font-face blocks) without ever rendering a character in it.
// Dropped. Re-add here if a serif is ever actually used.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
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
    <html lang="en" className={inter.variable}>
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
