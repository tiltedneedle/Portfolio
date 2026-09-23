import type { Metadata } from "next";
import { ChapterOverview } from "@/components/portal/ChapterOverview";
import { chapter } from "@/content/chapters";
import { competitorIntelligence, contentDiagnostic } from "@/content/client/audit";

export const metadata: Metadata = { title: "Your audit" };

export default function AuditPage() {
  return (
    <ChapterOverview
      id="audit"
      lead={chapter("audit").blurb}
      rows={[
        { slug: "content-diagnostic", title: "Content diagnostic", line: contentDiagnostic.intro, meta: contentDiagnostic.sections.length + " headings" },
        { slug: "competitor-intelligence", title: "Competitor intelligence", line: competitorIntelligence.intro, meta: competitorIntelligence.sections.length + " headings" },
      ]}
    />
  );
}
