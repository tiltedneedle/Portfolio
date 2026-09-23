import type { MetadataRoute } from "next";

// A private system for one client. Nothing here is for search engines.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
