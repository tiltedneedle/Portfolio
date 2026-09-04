import data from "@/lib/published.json";

/**
 * The studio's own index of published work, exported read-only from the ops
 * database (see RECOVERY.md). Every entry has a durable still: YouTube's own
 * 9:16 thumbnail for Shorts, or the studio's cached copy for the rest. Signed
 * Instagram and TikTok CDN stills were dropped at export because they expire.
 */
export type Published = {
  id: string;
  client: string;
  title: string;
  subject: string;
  platform: "youtube" | "youtube_shorts" | "instagram" | "tiktok";
  handle: string;
  url: string;
  videoId: string | null;
  thumb: string;
  /** false only for long-form YouTube, which is 16:9. */
  vertical: boolean;
  posted: string;
};

export const published = data as Published[];

export const PLATFORM_LABEL: Record<Published["platform"], string> = {
  youtube: "YouTube",
  youtube_shorts: "YouTube Shorts",
  instagram: "Instagram",
  tiktok: "TikTok",
};

/** Newest post for a client, preferring a Short (embeddable, 9:16, own still). */
export function publishedFor(client?: string): Published | undefined {
  if (!client) return undefined;
  const mine = published.filter((p) => p.client === client && p.vertical);
  // EuroEyes publishes in German and English; the site is English.
  const english = mine.filter((p) => !/[äöüß]/i.test(p.title + p.subject));
  const pool = english.length ? english : mine;
  return pool.find((p) => p.platform === "youtube_shorts") ?? pool[0];
}

export function embedUrl(videoId: string) {
  return (
    "https://www.youtube-nocookie.com/embed/" +
    videoId +
    "?rel=0&modestbranding=1&playsinline=1&color=white&autoplay=1"
  );
}
