import type { Metadata } from "next";
import { ChapterOverview } from "@/components/portal/ChapterOverview";
import { chapter } from "@/content/chapters";
import { requireClient } from "@/content/clients/registry";
import { publicIdentity } from "@/content/clients/types";
import { roomAfter } from "@/lib/rooms";
import { sequence } from "@/lib/sequence";

export const metadata: Metadata = { title: "Your audit" };

export default async function AuditPage({ params }: { params: Promise<{ client: string }> }) {
  const { client } = await params;
  const sys = requireClient(client);
  const written = (r: { sections: { body?: string[] }[] }) => r.sections.filter((s) => s.body?.length).length;
  const after = roomAfter("audit", sys);
  // The same measurement the reel uses, so this room reads its own length
  // the way the three universal rooms already do.
  const mins = new Map(sequence(sys).map((c) => [c.readKey, c.minutes]));
  return (
    <ChapterOverview
      id="audit"
      identity={publicIdentity(sys.identity)}
      lead={chapter("audit").blurb}
      countLabel="Reports"
      next={after}
      rows={[
        {
          slug: "content-diagnostic",
          readKey: "audit/content-diagnostic",
          title: "Content diagnostic",
          minutes: mins.get("audit/content-diagnostic"),
          line: sys.contentDiagnostic.intro,
          meta: written(sys.contentDiagnostic) + " of " + sys.contentDiagnostic.sections.length + " written",
        },
        {
          slug: "competitor-intelligence",
          readKey: "audit/competitor-intelligence",
          title: "Competitor intelligence",
          minutes: mins.get("audit/competitor-intelligence"),
          line: sys.competitorIntelligence.intro,
          meta: written(sys.competitorIntelligence) + " of " + sys.competitorIntelligence.sections.length + " written",
        },
      ]}
    />
  );
}
