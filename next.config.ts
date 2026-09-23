import type { NextConfig } from "next";

/**
 * Security headers, applied to every response.
 *
 * The content security policy is deliberately narrow: the site is static
 * pages, the studio's own fonts, YouTube's privacy-enhanced player, and two
 * image hosts (YouTube's stills and the studio's own cache). Inline scripts
 * and styles are allowed because Next emits both for static pages and the
 * motion library writes style attributes; nonces would force every page to
 * render dynamically for no gain on a site with no user-generated content.
 * Anything new that loads from elsewhere must be added here first, or it
 * will be blocked and show up in the browser console.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://i.ytimg.com https://tkmvuxjnfzbdpditvdbo.supabase.co",
  "font-src 'self'",
  "connect-src 'self'",
  "media-src 'self'",
  "frame-src https://www.youtube-nocookie.com",
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
