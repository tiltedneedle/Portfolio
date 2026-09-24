import type { Metadata } from "next";
import { ScriptsRail } from "@/components/portal/ScriptsRail";
import { NextCut } from "@/components/portal/NextCut";
import { DealOne } from "@/components/portal/DealOne";
import { FirstMonth } from "@/components/portal/FirstMonth";
import { pillars } from "@/content/system/pillars";
import { chapter, pageNumber } from "@/content/chapters";
import { requireClient } from "@/content/clients/registry";
import { shortName } from "@/content/clients/types";

export const metadata: Metadata = { title: "20 personalised scripts" };

export default async function ScriptsPage({ params }: { params: Promise<{ client: string }> }) {
  const { client } = await params;
  const sys = requireClient(client);
  const c = chapter("content");
  const cards = sys.scripts.filter((s) => s.body?.length).map((s) => ({ pillar: "Script", n: s.n, text: s.title, href: "/content/scripts/" + s.n }));
  const ideas = pillars.flatMap((p) => sys.ideas[p.id].map((idea, i) => ({ pillar: p.title, n: i + 1, text: idea.text })).filter((x) => x.text));
  return (
    <article className="bg-[color:var(--stage)]">
      <header className="mx-auto max-w-[1600px] px-6 pb-14 pt-28 md:px-14 md:pt-36">
        <p className="mono flex flex-wrap items-center gap-x-4">
          <span>
            {c.n} &mdash; {c.title} <span className="text-[color:var(--ink-mid)]">/</span> {pageNumber("content", "scripts")}
          </span>
          <span className="flex items-center gap-2 text-[color:var(--ink)]">
            <span className="lamp" aria-hidden="true" />
            Written for {shortName(sys.identity)}
          </span>
        </p>
        <h1 className="display mt-6 max-w-[10ch] text-[clamp(52px,8.5vw,140px)]">20 personalised scripts</h1>
        <p className="em-serif mt-6 max-w-[40ch] text-[clamp(22px,2.6vw,34px)] leading-[1.25] text-[color:var(--ink-soft)]">
          Twenty complete videos written specifically for your business. Open the script. Film it. Execute.
        </p>
      </header>

      <div className="mx-auto max-w-[1600px] px-6 pb-24 pt-8 md:px-14 md:pt-12">
        <ScriptsRail scripts={sys.scripts} />
        <div className="mt-24">
          <FirstMonth scripts={sys.scripts} ideas={ideas} />
        </div>
        {cards.length > 1 && (
          <div className="mt-24">
            <DealOne
              cards={cards}
              kicker="Film one today"
              heading={
                <>
                  Not sure which? <span className="em-serif">Deal.</span>
                </>
              }
              noun="script"
              after="Open it, read it once, and roll."
            />
          </div>
        )}
      </div>

      <NextCut chapter="content" slug="scripts" />
    </article>
  );
}
