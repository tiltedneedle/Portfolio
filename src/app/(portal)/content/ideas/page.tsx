import type { Metadata } from "next";
import { IdeasPillars } from "@/components/portal/IdeasPillars";
import { NextCut } from "@/components/portal/NextCut";
import { chapter, pageNumber } from "@/content/chapters";
import { clientShort } from "@/content/client/client";
import { pillars } from "@/content/client/ideas";

export const metadata: Metadata = { title: "100 viral content ideas" };

export default function IdeasPage() {
  const c = chapter("content");
  return (
    <article className="bg-[color:var(--stage)]">
      <header className="mx-auto max-w-[1600px] px-6 pb-14 pt-28 md:px-14 md:pt-36">
        <p className="mono flex flex-wrap items-center gap-x-4">
          <span>
            {c.n} &mdash; {c.title} <span className="text-[color:var(--ink-faint)]">/</span> {pageNumber("content", "ideas")}
          </span>
          <span className="flex items-center gap-2 text-[color:var(--ink)]">
            <span className="lamp" aria-hidden="true" />
            Written for {clientShort()}
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
        <IdeasPillars />
      </div>

      <NextCut chapter="content" slug="ideas" />
    </article>
  );
}
