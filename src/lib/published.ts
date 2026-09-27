import data from "@/lib/published.json";

/**
 * The studio's own index of published work, exported read-only from the ops
 * database (see RECOVERY.md). Every entry has a durable still: YouTube's own
 * 9:16 thumbnail for Shorts, or the studio's cached copy for the rest. Signed
 * Instagram and TikTok CDN stills were dropped at export because they expire.
 *
 * SERVER ONLY. Importing this pulls published.json in with it, so nothing
 * under a "use client" module may reach here, directly or through a chain.
 * The player URL a client component needs lives data-free in lib/embed.ts.
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

/** Newest post for a client, preferring a Short (embeddable, 9:16, own still). */
export function publishedFor(client?: string): Published | undefined {
  if (!client) return undefined;
  const mine = published.filter((p) => p.client === client && p.vertical);
  // EuroEyes publishes in German and English; the site is English.
  const english = mine.filter((p) => !/[äöüß]/i.test(p.title + p.subject));
  const pool = english.length ? english : mine;
  return pool.find((p) => p.platform === "youtube_shorts") ?? pool[0];
}

/** The durable still for a YouTube id: the studio's cached copy where there is one, else YouTube's own 9:16 frame. */
export function stillFor(videoId: string) {
  return published.find((p) => p.videoId === videoId)?.thumb || "https://i.ytimg.com/vi/" + videoId + "/oardefault.jpg";
}
