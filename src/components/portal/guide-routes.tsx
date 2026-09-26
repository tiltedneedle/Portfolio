import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Guide } from "@/components/portal/Guide";
import { ChapterOverview } from "@/components/portal/ChapterOverview";
import { chapter } from "@/content/chapters";
import { findGuide, guidesFor, readingMinutes } from "@/content/system";
import { requireClient } from "@/content/clients/registry";
import { stillFor } from "@/lib/published";
import { liveChapters } from "@/lib/rooms";
import { chapters } from "@/content/chapters";
import { shortName } from "@/content/clients/types";

type GuideChapterId = "create" | "publish" | "analyse";

/** The front page of a universal chapter: its guides as rows. */
export function GuideChapter({ id, client }: { id: GuideChapterId; client?: string }) {
  const sys = client ? requireClient(client) : null;
  const who = sys ? shortName(sys.identity) : "";
  const rows = guidesFor(id).map((g) => {
    const notes = sys?.notes?.[g.chapter + "/" + g.slug]?.length ?? 0;
    return {
      slug: g.slug,
      title: g.title,
      line: g.kicker,
      meta: readingMinutes(g) + " min" + (notes ? " \u00B7 " + notes + (notes === 1 ? " note" : " notes") + " for " + who : ""),
      // The published index never reaches the browser, so the still is looked up here.
      still: g.poster ? stillFor(g.poster) : undefined,
      minutes: readingMinutes(g),
      readKey: g.chapter + "/" + g.slug,
    };
  });
  return <ChapterOverview id={id} rows={rows} lead={chapter(id).blurb} countLabel="Guides" next={nextRoom(id, sys)} />;
}

/** The room after this one, among the rooms this client actually has. */
function nextRoom(id: string, sys: { identity: { slug: string } } | null) {
  const live = sys ? liveChapters(sys as Parameters<typeof liveChapters>[0]) : chapters;
  const order = live.filter((c) => c.id !== "home");
  const i = order.findIndex((c) => c.id === id);
  const n = i >= 0 ? order[i + 1] : undefined;
  return n ? { href: n.href, n: n.n + " \u2014 " + n.title, title: n.title, blurb: n.blurb } : undefined;
}

export function GuidePage({ id, slug, client }: { id: GuideChapterId; slug: string; client: string }) {
  const g = findGuide(id, slug);
  if (!g) notFound();
  const sys = requireClient(client);
  return <Guide guide={g} notes={sys.notes?.[id + "/" + slug] ?? []} who={shortName(sys.identity)} client={client} />;
}

export function guideParams(id: GuideChapterId) {
  return guidesFor(id).map((g) => ({ slug: g.slug }));
}

export function guideMetadata(id: GuideChapterId, slug: string): Metadata {
  const g = findGuide(id, slug);
  return g ? { title: g.title } : {};
}
