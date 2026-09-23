import type { Metadata } from "next";
import { ChapterOverview } from "@/components/portal/ChapterOverview";
import { chapter } from "@/content/chapters";
import { requireClient } from "@/content/clients/registry";
import { publicIdentity } from "@/content/clients/types";

export const metadata: Metadata = { title: "Your content" };

export default async function ContentPage({ params }: { params: Promise<{ client: string }> }) {
  const { client } = await params;
  const sys = requireClient(client);
  const ideaLists = Object.values(sys.ideas);
  const ideaCount = ideaLists.reduce((s, list) => s + list.length, 0);
  const ideasWritten = ideaLists.reduce((s, list) => s + list.filter((i) => i.text).length, 0);
  const scriptsWritten = sys.scripts.filter((s) => s.body?.length).length;
  return (
    <ChapterOverview
      id="content"
      identity={publicIdentity(sys.identity)}
      lead={chapter("content").blurb}
      rows={[
        {
          slug: "ideas",
          title: "100 viral content ideas",
          line: "Four pillars, twenty-five ideas each: authority, education, entertainment, personal. The foundation of your content output.",
          meta: ideasWritten + " of " + ideaCount + " written",
        },
        {
          slug: "scripts",
          title: "20 personalised scripts",
          line: "Twenty complete videos written specifically for your business. Open the script. Film it. Execute.",
          meta: scriptsWritten + " of " + sys.scripts.length + " written",
        },
      ]}
    />
  );
}
