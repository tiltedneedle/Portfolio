import type { MetadataRoute } from "next";
import { servicesList } from "@/lib/services-data";
import { films } from "@/lib/films";

const BASE_URL = "https://tiltedneedle.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }> = [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "/services", changeFrequency: "monthly", priority: 0.9 },
    { path: "/portfolio", changeFrequency: "weekly", priority: 0.8 },
    { path: "/careers", changeFrequency: "weekly", priority: 0.7 },
    { path: "/book-demo", changeFrequency: "monthly", priority: 0.7 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
  ];

  const lastModified = new Date();

  return [
    ...staticRoutes.map((route) => ({
      url: `${BASE_URL}${route.path}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...servicesList.map((service) => ({
      url: `${BASE_URL}/services/${service.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...films.map((film) => ({
      url: `${BASE_URL}/film/${film.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
