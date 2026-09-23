import type { Metadata } from "next";
import { ChapterOverview } from "@/components/portal/ChapterOverview";
import { chapter } from "@/content/chapters";
import { requireClient } from "@/content/clients/registry";
import { publicIdentity } from "@/content/clients/types";

export const metadata: Metadata = { title: "Your audit" };

export default async function AuditPage({ params }: { params: Promise<{ client: string }> }) {
  const { client } = await params;
  const sys = requireClient(client);
  const written = (r: { sections: { body?: string[] }[] }) => r.sections.filter((s) => s.body?.length).length;
  return (
    <ChapterOverview
      id="audit"
      identity={publicIdentity(sys.identity)}
      lead={chapter("audit").blurb}
      rows={[
        {
          slug: "content-diagnostic",
          title: "Content diagnostic",
          line: sys.contentDiagnostic.intro,
          meta: written(sys.contentDiagnostic) + " of " + sys.contentDiagnostic.sections.length + " written",
        },
        {
          slug: "competitor-intelligence",
          title: "Competitor intelligence",
          line: sys.competitorIntelligence.intro,
          meta: written(sys.competitorIntelligence) + " of " + sys.competitorIntelligence.sections.length + " written",
        },
      ]}
    />
  );
}
