import type { NextConfig } from "next";

// Stamped once per build and inlined into the browser bundle: the palette's
// index URL carries it, so an hour of caching never answers a new deploy
// with the previous one's words.
const build = Date.now().toString(36);
const dev = process.env.NODE_ENV === "development";

/**
 * A production deployment must have a door, and a strong one. Without
 * PORTAL_SECRET the site serves the template to anyone, every guide in it,
 * with nothing to say so; with PORTAL_DEMO the demo's code, printed in the
 * README of a public repo, opens a room; and a short secret can be guessed
 * offline by anyone holding one valid cookie of their own, then used to
 * sign a cookie for another client. So a Vercel production build refuses
 * all three: the deploy fails where it is seen, and the last good one stays
 * up. Local `next start` and CI are not Vercel production and keep their
 * open door and demo.
 */
if (process.env.VERCEL_ENV === "production") {
  const secret = process.env.PORTAL_SECRET ?? "";
  const refuse = (why: string) => {
    throw new Error("Refusing to build for production: " + why + " See README, The door.");
  };
  if (!secret) refuse("PORTAL_SECRET is not set, which would open the door to everyone.");
  if (secret.length < 32) refuse("PORTAL_SECRET is shorter than 32 characters; use a long random string (the README shows how to make one).");
  if (process.env.PORTAL_DEMO === "1") refuse("PORTAL_DEMO is set, which opens the demo room to its published code.");
}

/**
 * Security headers, applied to every response.
 *
 * The content security policy is deliberately narrow: the site is static
 * pages, the studio's own fonts, YouTube's privacy-enhanced player, the
 * TikTok and Instagram players for the showreel, and two image hosts
 * (YouTube's stills and the studio's own cache; the reel's stills are local). Inline scripts
 * and styles are allowed because Next emits both for static pages and the
 * motion library writes style attributes; nonces would force every page to
 * render dynamically for no gain on a site with no user-generated content.
 * Anything new that loads from elsewhere must be added here first, or it
 * will be blocked and show up in the browser console.
 */
const csp = [
  "default-src 'self'",
  // React's development tooling evals; production stays strict.
  "script-src 'self' 'unsafe-inline'" + (dev ? " 'unsafe-eval'" : ""),
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://i.ytimg.com https://tkmvuxjnfzbdpditvdbo.supabase.co",
  "font-src 'self'",
  "connect-src 'self'",
  "media-src 'self'",
  "frame-src https://www.youtube-nocookie.com https://www.tiktok.com https://www.instagram.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // A private room: even a leaked link is not to be indexed.
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_BUILD: build },
  // No "X-Powered-By: Next.js" on every response: it tells a visitor nothing
  // they need and an attacker which exploits to try.
  poweredByHeader: false,
  images: {
    remotePatterns: [
      // stills for the published work: YouTube's, and the studio's own cache
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "tkmvuxjnfzbdpditvdbo.supabase.co" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
