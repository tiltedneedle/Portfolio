import type { Metadata } from "next";
import { AuditReport } from "@/components/portal/AuditReport";
import { requireClient } from "@/content/clients/registry";
import { publicIdentity } from "@/content/clients/types";

export const metadata: Metadata = { title: "Content diagnostic" };

export default async function ContentDiagnosticPage({ params }: { params: Promise<{ client: string }> }) {
  const { client } = await params;
  const sys = requireClient(client);
  return <AuditReport slug="content-diagnostic" title="Content diagnostic" report={sys.contentDiagnostic} identity={publicIdentity(sys.identity)} />;
}
