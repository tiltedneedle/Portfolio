import type { Metadata } from "next";
import { IdeasPillars } from "@/components/portal/IdeasPillars";
import { DealOne } from "@/components/portal/DealOne";
import { NextCut } from "@/components/portal/NextCut";
import { chapter, pageNumber } from "@/content/chapters";
import { requireClient } from "@/content/clients/registry";
import { publicIdentity, shortName } from "@/content/clients/types";
import { pillars } from "@/content/system/pillars";

export const metadata: Metadata = { title: "100 viral content ideas" };

export default async function IdeasPage({ params }: { params: Promise<{ client: string }> }) {
  const { client } = await params;
  const sys = requireClient(client);
  const identity = publicIdentity(sys.identity);
  const c = chapter("content");
  const cards = pillars.flatMap((p) => sys.ideas[p.id].map((idea, i) => ({ pillar: p.title, n: i + 1, text: idea.text || "" })).filter((x) => x.text));
  return (
    <article className="bg-[color:var(--stage)]">
      <header className="mx-auto max-w-[1600px] px-6 pb-14 pt-28 md:px-14 md:pt-36">
        <p className="mono flex flex-wrap items-center gap-x-4">
          <span>
            {c.n} &mdash; {c.title} <span className="text-[color:var(--ink-faint)]">/</span> {pageNumber("content", "ideas")}
          </span>
          <span className="flex items-center gap-2 text-[color:var(--ink)]">
            <span className="lamp" aria-hidden="true" />
            Written for {shortName(identity)}
          </span>
        </p>
        <h1 className="display mt-6 max-w-[10ch] text-[clamp(52px,8.5vw,140px)]">100 viral content ideas</h1>
        <p className="em-serif mt-6 max-w-[40ch] text-[clamp(22px,2.6vw,34px)] leading-[1.25] text-[color:var(--ink-soft)]">
          One hundred content concepts built across four core content pillars. Use these ideas as the foundation of your content output.
        </p>
        <ul className="mono mt-12 flex flex-wrap gap-x-8 gap-y-3">
          {pillars.map((p, i) => (
            <li key={p.id}>
              <a href={"#" + p.id} className="hover:text-[color:var(--ink)]">
                <span className="text-[color:var(--ink-faint)]">{String(i + 1).padStart(2, "0")}</span> {p.title}
              </a>
            </li>
          ))}
        </ul>
      </header>

      <div className="mx-auto max-w-[1600px] px-6 pb-24 pt-8 md:px-14 md:pt-12">
        <IdeasPillars ideas={sys.ideas} identity={identity} />
        <div className="mt-24">
          <DealOne cards={cards} />
        </div>
      </div>

      <NextCut chapter="content" slug="ideas" />
    </article>
  );
}
