import type { Metadata } from "next";
import { GuideChapter } from "@/components/portal/guide-routes";

export const metadata: Metadata = { title: "Publish" };

export default async function PublishPage({ params }: { params: Promise<{ client: string }> }) {
  const { client } = await params;
  return <GuideChapter id="publish" client={client} />;
}
