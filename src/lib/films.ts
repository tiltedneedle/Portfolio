import { caseStudies, type CaseStudy } from "@/lib/case-studies-data";
import posters from "@/lib/posters.json";
import picksData from "@/lib/published-picks.json";
import type { Published } from "@/lib/published";

// A handful of picks from the published index, chosen at export time, so the
// home page never carries the full 600-entry index (the library does).
const picks = picksData as unknown as Record<string, Published | null>;
function publishedFor(client?: string): Published | undefined {
  return client ? (picks[client] ?? undefined) : undefined;
}

/**
 * The six films, as the room addresses them: numbered, slugged, with a poster
 * and, where the studio's published index has one, an embeddable public cut.
 *
 * The original files lived on a CloudFront host that no longer exists (see
 * RECOVERY.md), so a film's picture now comes from the studio's own index of
 * published posts: a durable still for the poster, and a YouTube Short to
 * play when the client has one. A film whose client is not in the index shows
 * its slate, the title card, so nothing ever loads from black.
 *
 * `posters.json` (from `scripts/posters.mjs`) still wins when it exists: that
 * is the path back to self-hosted files once they are recovered.
 */
export type Film = CaseStudy & {
  slug: string;
  index: number; // 1-based, as printed on the slate
  poster?: string;
  duration?: number; // seconds, when known
  /** YouTube video id of the published cut, when there is one to embed. */
  embedId?: string;
  /** The published post the still and embed come from. */
  post?: Published;
};

const posterMap = posters as Record<string, { poster: string; duration: number }>;

// The host every original file pointed at. It has no DNS record any more, so
// a URL on it is treated as no URL: no fetch, no slot, straight to the slate.
const DEAD_HOST = "d6lso8oygmnu9.cloudfront.net";

// Which published client each case study's picture comes from.
const CLIENT_OF: Record<string, string> = {
  "Steve Varsano": "The Jet Business",
  "Noor Charchafchi": "Noor Charchafchi",
  "Alexis Gauthier": "Alexis Gauthier",
  EuroEyes: "EuroEyes",
  "Frankie Mardell": "Frankie Mardell",
  Rastah: "Rastah",
};

export function slugify(s: string) {
  let out = "";
  let dash = false;
  for (const ch of s.toLowerCase()) {
    const ok = (ch >= "a" && ch <= "z") || (ch >= "0" && ch <= "9");
    if (ok) {
      out += ch;
      dash = false;
    } else if (!dash && out.length > 0) {
      out += "-";
      dash = true;
    }
  }
  return out.endsWith("-") ? out.slice(0, -1) : out;
}

export const films: Film[] = caseStudies.map((cs, i) => {
  const slug = slugify(cs.title);
  const p = posterMap[slug];
  const post = publishedFor(CLIENT_OF[cs.client]);
  const videoUrl = cs.videoUrl.includes(DEAD_HOST) ? "" : cs.videoUrl;
  return {
    ...cs,
    videoUrl,
    slug,
    index: i + 1,
    poster: p?.poster ?? post?.thumb,
    duration: p?.duration,
    embedId: post?.videoId ?? undefined,
    post,
  };
});

export function filmBySlug(slug: string) {
  return films.find((f) => f.slug === slug);
}

export function nextFilm(f: Film) {
  return films[f.index % films.length];
}

export function pad2(n: number) {
  return n < 10 ? "0" + n : String(n);
}

/** SMPTE-style timecode from seconds, 25 fps. */
export function timecode(seconds: number, fps = 25) {
  const s = Math.max(0, seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  const f = Math.floor((s - Math.floor(s)) * fps);
  return pad2(h) + ":" + pad2(m) + ":" + pad2(sec) + ":" + pad2(f);
}
