import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Guide } from "@/components/portal/Guide";
import { ChapterOverview } from "@/components/portal/ChapterOverview";
import { chapter } from "@/content/chapters";
import { findGuide, guidesFor, readingMinutes } from "@/content/system";

type GuideChapterId = "create" | "publish" | "analyse";

/** The front page of a universal chapter: its guides as rows. */
export function GuideChapter({ id }: { id: GuideChapterId }) {
  const rows = guidesFor(id).map((g) => ({ slug: g.slug, title: g.title, line: g.kicker, meta: readingMinutes(g) + " min", poster: g.poster, readKey: g.chapter + "/" + g.slug }));
  return <ChapterOverview id={id} rows={rows} lead={chapter(id).blurb} />;
}

export function GuidePage({ id, slug }: { id: GuideChapterId; slug: string }) {
  const g = findGuide(id, slug);
  if (!g) notFound();
  return <Guide guide={g} />;
}

export function guideParams(id: GuideChapterId) {
  return guidesFor(id).map((g) => ({ slug: g.slug }));
}

export function guideMetadata(id: GuideChapterId, slug: string): Metadata {
  const g = findGuide(id, slug);
  return g ? { title: g.title } : {};
}
