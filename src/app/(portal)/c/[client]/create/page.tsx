import type { Metadata } from "next";
import { GuideChapter } from "@/components/portal/guide-routes";

export const metadata: Metadata = { title: "Create" };

export default async function CreatePage({ params }: { params: Promise<{ client: string }> }) {
  const { client } = await params;
  return <GuideChapter id="create" client={client} />;
}
