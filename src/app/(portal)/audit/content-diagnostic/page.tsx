import type { Metadata } from "next";
import { AuditReport } from "@/components/portal/AuditReport";
import { contentDiagnostic } from "@/content/client/audit";

export const metadata: Metadata = { title: "Content diagnostic" };

export default function ContentDiagnosticPage() {
  return <AuditReport slug="content-diagnostic" title="Content diagnostic" intro={contentDiagnostic.intro} sections={contentDiagnostic.sections} />;
}
