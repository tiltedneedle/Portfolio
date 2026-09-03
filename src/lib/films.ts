import { caseStudies, type CaseStudy } from "@/lib/case-studies-data";
import posters from "@/lib/posters.json";

/**
 * The six films, as the room addresses them: numbered, slugged, with a poster
 * when one has been extracted. Everything else is the case study as written.
 *
 * `posters.json` is produced by `scripts/posters.mjs` (ffmpeg, one frame per
 * film). A film without a poster shows its slate, the title card, until the
 * video reports a frame, so nothing ever loads from black.
 */
export type Film = CaseStudy & {
  slug: string;
  index: number; // 1-based, as printed on the slate
  poster?: string;
  duration?: number; // seconds, when known
};

const posterMap = posters as Record<string, { poster: string; duration: number }>;

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
  return { ...cs, slug, index: i + 1, poster: p?.poster, duration: p?.duration };
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
