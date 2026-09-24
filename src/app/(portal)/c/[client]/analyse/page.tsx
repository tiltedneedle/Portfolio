import type { Metadata } from "next";
import { GuideChapter } from "@/components/portal/guide-routes";

export const metadata: Metadata = { title: "Analyse" };

export default async function AnalysePage({ params }: { params: Promise<{ client: string }> }) {
  const { client } = await params;
  return <GuideChapter id="analyse" client={client} />;
}
