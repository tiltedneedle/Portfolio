import type { Metadata } from "next";
import { GuideChapter } from "@/components/portal/guide-routes";

export const metadata: Metadata = { title: "Publish" };

export default function PublishPage() {
  return <GuideChapter id="publish" />;
}
