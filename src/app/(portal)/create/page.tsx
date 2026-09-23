import type { Metadata } from "next";
import { GuideChapter } from "@/components/portal/guide-routes";

export const metadata: Metadata = { title: "Create" };

export default function CreatePage() {
  return <GuideChapter id="create" />;
}
