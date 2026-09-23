import type { Metadata } from "next";
import { ChapterOverview } from "@/components/portal/ChapterOverview";
import { chapter } from "@/content/chapters";
import { ideas } from "@/content/client/ideas";
import { scripts } from "@/content/client/scripts";

export const metadata: Metadata = { title: "Your content" };

export default function ContentPage() {
  const ideaCount = Object.values(ideas).reduce((s, list) => s + list.length, 0);
  return (
    <ChapterOverview
      id="content"
      lead={chapter("content").blurb}
      rows={[
        {
          slug: "ideas",
          title: "100 viral content ideas",
          line: "Four pillars, twenty-five ideas each: authority, education, entertainment, personal. The foundation of your content output.",
          meta: ideaCount + " ideas",
        },
        {
          slug: "scripts",
          title: "20 personalised scripts",
          line: "Twenty complete videos written specifically for your business. Open the script. Film it. Execute.",
          meta: scripts.length + " scripts",
        },
      ]}
    />
  );
}
