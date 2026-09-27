import { pageHref, pageNumber } from "@/content/chapters";
import { findGuide, minutesOf, readingMinutes } from "@/content/system";
import type { AuditReport, ClientSystem } from "@/content/clients/types";
import { liveChapters } from "@/lib/rooms";

/**
 * The whole system measured as one reel.
 *
 * Every page this client has, in the system's order, with how long it takes
 * to read. The footer draws it as a conformed timeline and the front page
 * reads a position out of it, and both are the same numbers: one estimator,
 * one denominator, so the two devices can never disagree.
 *
 * SERVER ONLY. This imports @/content/system, which is every word of all
 * thirteen guides. A "use client" module may take `Clip` from here with
 * `import type` (erased at compile time) but must never import the function,
 * or the guides land in the browser bundle.
 */
export type Clip = {
  href: string;
  title: string;
  n: string;
  minutes: number;
  chapterN: string;
  chapterTitle: string;
  /** The key the marks store uses for this page: "chapter/slug". */
  readKey: string;
};

export function sequence(sys: ClientSystem): Clip[] {
  const out: Clip[] = [];
  // Home's "pages" are hash anchors within one long page, not clips on a reel.
  for (const c of liveChapters(sys).filter((c) => c.id !== "home")) {
    for (const p of c.pages) {
      out.push({
        href: pageHref(c.id, p.slug),
        title: p.title,
        n: pageNumber(c.id, p.slug),
        minutes: pageMinutes(sys, c.id, p.slug),
        chapterN: c.n,
        chapterTitle: c.title,
        readKey: c.id + "/" + p.slug,
      });
    }
  }
  return out;
}

/** The reel's running time. */
export function total(clips: Clip[]): number {
  return clips.reduce((sum, c) => sum + c.minutes, 0);
}

/**
 * How long one page takes. A universal guide is measured by the same
 * function the guide itself prints; a personalised page is measured from
 * what has actually been written in it, so an audit with three headings
 * filled in is not timed as if it had fourteen.
 */
function pageMinutes(sys: ClientSystem, chapter: string, slug: string): number {
  const guide = findGuide(chapter as Parameters<typeof findGuide>[0], slug);
  if (guide) return readingMinutes(guide);
  const written = (r: AuditReport) => r.sections.filter((s) => s.body?.length);
  if (chapter === "audit" && slug === "content-diagnostic") return minutesOf(written(sys.contentDiagnostic));
  if (chapter === "audit" && slug === "competitor-intelligence") return minutesOf(written(sys.competitorIntelligence));
  if (chapter === "content" && slug === "ideas") return minutesOf(Object.values(sys.ideas).flat().filter((i) => i.text && !i.example));
  if (chapter === "content" && slug === "scripts") return minutesOf(sys.scripts.filter((s) => s.body?.length && !s.example));
  // Unreachable while every page is one of the above; the floor is the floor.
  return 2;
}
