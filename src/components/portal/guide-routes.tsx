import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Guide } from "@/components/portal/Guide";
import { ChapterOverview } from "@/components/portal/ChapterOverview";
import { chapter } from "@/content/chapters";
import { findGuide, guidesFor, readingMinutes } from "@/content/system";
import { requireClient } from "@/content/clients/registry";
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
      poster: g.poster,
      readKey: g.chapter + "/" + g.slug,
    };
  });
  return <ChapterOverview id={id} rows={rows} lead={chapter(id).blurb} />;
}

export function GuidePage({ id, slug, client }: { id: GuideChapterId; slug: string; client: string }) {
  const g = findGuide(id, slug);
  if (!g) notFound();
  const sys = requireClient(client);
  return <Guide guide={g} notes={sys.notes?.[id + "/" + slug] ?? []} who={shortName(sys.identity)} />;
}

export function guideParams(id: GuideChapterId) {
  return guidesFor(id).map((g) => ({ slug: g.slug }));
}

export function guideMetadata(id: GuideChapterId, slug: string): Metadata {
  const g = findGuide(id, slug);
  return g ? { title: g.title } : {};
}
