import type { Metadata } from "next";
import { GuideChapter } from "@/components/portal/guide-routes";

export const metadata: Metadata = { title: "Analyse" };

export default function AnalysePage() {
  return <GuideChapter id="analyse" />;
}
