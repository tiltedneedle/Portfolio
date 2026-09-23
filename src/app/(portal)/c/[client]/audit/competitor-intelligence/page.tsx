import type { Metadata } from "next";
import { AuditReport } from "@/components/portal/AuditReport";
import { requireClient } from "@/content/clients/registry";
import { publicIdentity } from "@/content/clients/types";

export const metadata: Metadata = { title: "Competitor intelligence" };

export default async function CompetitorIntelligencePage({ params }: { params: Promise<{ client: string }> }) {
  const { client } = await params;
  const sys = requireClient(client);
  return (
    <AuditReport slug="competitor-intelligence" title="Competitor intelligence" report={sys.competitorIntelligence} identity={publicIdentity(sys.identity)} />
  );
}
