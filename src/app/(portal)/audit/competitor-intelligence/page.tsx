import type { Metadata } from "next";
import { AuditReport } from "@/components/portal/AuditReport";
import { competitorIntelligence } from "@/content/client/audit";

export const metadata: Metadata = { title: "Competitor intelligence" };

export default function CompetitorIntelligencePage() {
  return (
    <AuditReport
      slug="competitor-intelligence"
      title="Competitor intelligence"
      intro={competitorIntelligence.intro}
      sections={competitorIntelligence.sections}
    />
  );
}
