"use client";

import { useSyncExternalStore } from "react";
import { CutLink } from "@/components/room/CutLink";
import { weekOf } from "@/lib/week";

/**
 * The call sheet for this week. One idea to film, one script to say, one
 * guide to read, one thing to do, chosen from what is written and rotated
 * by the week of the year, so the whole team sees the same sheet and it
 * changes on Monday. The date is only known in the browser (the page is
 * built once), so the server draws the frame and the browser fills it.
 * The week arithmetic lives in lib/week.ts, where it is tested.
 */
type Idea = { pillar: string; n: number; text: string };
type ScriptRef = { n: number; title: string };
type GuideRef = { href: string; title: string; chapter: string };

const noop = () => () => {};

const currentKey = () => weekOf(new Date()).key;

export function ThisWeek({ ideas, scripts, guides }: { ideas: Idea[]; scripts: ScriptRef[]; guides: GuideRef[] }) {
  const key = useSyncExternalStore(noop, currentKey, () => "");
  const w = key ? weekOf(new Date()) : null;
  const pick = <T,>(list: T[], salt: number) => (w && list.length ? list[(w.index + salt) % list.length] : null);
  const idea = pick(ideas, 0);
  const script = pick(scripts, 1);
  const guide = pick(guides, 2);
  const cells: { label: string; title: string; line?: string; href: string; cta: string }[] = [
    idea
      ? { label: "Film", title: idea.text, line: idea.pillar + " " + String(idea.n).padStart(2, "0"), href: "/content/ideas", cta: "All ideas" }
      : { label: "Film", title: "An idea from your hundred", line: "Once the ideas are written", href: "/content/ideas", cta: "Ideas" },
    script
      ? { label: "Say", title: script.title, line: "Script " + String(script.n).padStart(2, "0"), href: "/content/scripts/" + script.n, cta: "Open the script" }
      : { label: "Say", title: "A script from your twenty", line: "Once the scripts are written", href: "/content/scripts", cta: "Scripts" },
    guide
      ? { label: "Read", title: guide.title, line: guide.chapter, href: guide.href, cta: "Open the guide" }
      : { label: "Read", title: "One guide", line: "Create, publish, analyse", href: "/create", cta: "Create" },
    w?.monthEnd
      ? { label: "Do", title: "Run the monthly analytics process", line: "The month is nearly over", href: "/analyse/monthly-process", cta: "The process" }
      : { label: "Do", title: "Publish one every other day", line: "Four this week, across every platform", href: "/publish/strategy", cta: "The strategy" },
  ];

  return (
    <section className="border-t border-[color:var(--rule)] bg-[color:var(--stage-2)] py-20 md:py-28" aria-label="This week">
      <div className="mx-auto max-w-[1600px] px-6 md:px-14">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
          <p className="mono">
            Call sheet <span className="text-[color:var(--ink-mid)]">/</span> {w ? "Week " + w.week : "This week"}
            {w && (
              <>
                <span className="text-[color:var(--ink-mid)]"> / </span>
                {w.range}
              </>
            )}
          </p>
          <p className="mono text-[color:var(--ink-mid)]">Changes on Monday. Same sheet for the whole team.</p>
        </div>
        <h2 className="display mt-4 text-[clamp(40px,5.5vw,88px)]">
          This week, <span className="em-serif">four things.</span>
        </h2>
        <ol className="mt-10 grid border-t border-[color:var(--rule-strong)] md:grid-cols-4">
          {cells.map((c, i) => (
            <li key={c.label} className={"flex flex-col justify-between border-b border-[color:var(--rule)] py-6 md:border-b-0 md:py-8 " + (i > 0 ? "md:border-l md:border-[color:var(--rule)] md:pl-8" : "") + (i < 3 ? " md:pr-8" : "")}>
              <div>
                <p className="mono flex items-center justify-between">
                  <span className="text-[color:var(--ink)]">{c.label}</span>
                  <span className="text-[color:var(--ink-mid)]">{String(i + 1).padStart(2, "0")}</span>
                </p>
                <p className={"mt-4 leading-snug text-[color:var(--ink)] " + (c.title.length > 60 ? "text-[19px] md:text-[21px]" : "display text-[clamp(26px,2.4vw,34px)] leading-[0.95]")}>{c.title}</p>
                {c.line && <p className="mono mt-3 text-[color:var(--ink-mid)]">{c.line}</p>}
              </div>
              <CutLink href={c.href} className="slate-link mt-6 inline-block self-start" data-cursor="Cut">
                {c.cta} &#8599;
              </CutLink>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
