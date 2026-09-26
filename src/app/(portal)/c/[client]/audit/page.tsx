import type { Metadata } from "next";
import { ChapterOverview } from "@/components/portal/ChapterOverview";
import { chapter } from "@/content/chapters";
import { requireClient } from "@/content/clients/registry";
import { publicIdentity } from "@/content/clients/types";
import { liveChapters } from "@/lib/rooms";

export const metadata: Metadata = { title: "Your audit" };

export default async function AuditPage({ params }: { params: Promise<{ client: string }> }) {
  const { client } = await params;
  const sys = requireClient(client);
  const written = (r: { sections: { body?: string[] }[] }) => r.sections.filter((s) => s.body?.length).length;
  const live = liveChapters(sys).filter((c) => c.id !== "home");
  const after = live[live.findIndex((c) => c.id === "audit") + 1];
  return (
    <ChapterOverview
      id="audit"
      identity={publicIdentity(sys.identity)}
      lead={chapter("audit").blurb}
      countLabel="Reports"
      next={after && { href: after.href, n: after.n + " \u2014 " + after.title, title: after.title, blurb: after.blurb }}
      rows={[
        {
          slug: "content-diagnostic",
          readKey: "audit/content-diagnostic",
          title: "Content diagnostic",
          line: sys.contentDiagnostic.intro,
          meta: written(sys.contentDiagnostic) + " of " + sys.contentDiagnostic.sections.length + " written",
        },
        {
          slug: "competitor-intelligence",
          readKey: "audit/competitor-intelligence",
          title: "Competitor intelligence",
          line: sys.competitorIntelligence.intro,
          meta: written(sys.competitorIntelligence) + " of " + sys.competitorIntelligence.sections.length + " written",
        },
      ]}
    />
  );
}
