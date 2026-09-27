import { chapters, pageHref, type Chapter } from "@/content/chapters";
import type { AuditReport, ClientSystem } from "@/content/clients/types";
import type { ChapterId } from "@/content/types";

/**
 * Which of a client's personalised pages exist yet.
 *
 * The studio writes the audit, the hundred ideas and the twenty scripts for
 * each client. Until a page is written it is not on the website at all: not
 * in the nav, not on the home strip, not in the palette, not at the foot of
 * a guide. The system only ever shows a client what they have.
 *
 * Example content does not count. Examples exist to show the shape of the
 * finished page to whoever is filling it in, not to be read as the client's.
 */
export function writtenPages(sys: ClientSystem): Set<string> {
  const written = new Set<string>();
  const any = (r: AuditReport) => r.sections.some((s) => s.body?.length);
  if (any(sys.contentDiagnostic)) written.add("/audit/content-diagnostic");
  if (any(sys.competitorIntelligence)) written.add("/audit/competitor-intelligence");
  if (Object.values(sys.ideas).flat().some((i) => i.text && !i.example)) written.add("/content/ideas");
  if (sys.scripts.some((s) => s.body?.length && !s.example)) written.add("/content/scripts");
  return written;
}

/**
 * The chapters this client actually has: every universal room, and a
 * personalised room once one of its pages is written, carrying only the
 * pages that are.
 */
export function liveChapters(sys: ClientSystem): Chapter[] {
  const written = writtenPages(sys);
  const has = (c: Chapter) => c.pages.some((p) => written.has(pageHref(c.id, p.slug)));
  return chapters
    .filter((c) => !c.personalised || has(c))
    .map((c) => (c.personalised ? { ...c, pages: c.pages.filter((p) => written.has(pageHref(c.id, p.slug))) } : c));
}

/**
 * The room this client starts in: the first room after home that they have.
 * A client with nothing written starts in Create, not in an audit that is
 * not there yet.
 */
export function firstRoom(sys: ClientSystem): Chapter {
  const first = liveChapters(sys).find((c) => c.id !== "home");
  if (!first) throw new Error("A client with no rooms at all");
  return first;
}

/**
 * The room after this one, among the rooms this client has, for the cut at
 * the foot of a room. The last room has none, and a room the client does
 * not have is not a step on the way.
 */
export function roomAfter(id: ChapterId, sys?: ClientSystem) {
  const order = (sys ? liveChapters(sys) : chapters).filter((c) => c.id !== "home");
  const i = order.findIndex((c) => c.id === id);
  const next = i >= 0 ? order[i + 1] : undefined;
  return next ? { href: next.href, n: next.n + " \u2014 " + next.title, title: next.title, blurb: next.blurb } : undefined;
}

/** Every path the live chapters answer to, for filtering links into rooms that are not there. */
export function livePaths(live: Chapter[]): Set<string> {
  const out = new Set<string>(["/"]);
  for (const c of live) {
    if (c.id === "home") continue;
    out.add(c.href);
    for (const p of c.pages) out.add(pageHref(c.id, p.slug));
  }
  return out;
}
