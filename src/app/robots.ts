import type { MetadataRoute } from "next";

const BASE_URL = "https://tiltedneedle.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The form handler has nothing to index and shouldn't be crawled.
        disallow: ["/api/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
