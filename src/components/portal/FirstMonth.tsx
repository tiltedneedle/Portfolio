"use client";

import { CutLink } from "@/components/room/CutLink";
import type { Script } from "@/content/clients/types";
import { FilmedMark } from "@/components/portal/FilmedMark";
import { PrintButton } from "@/components/portal/PrintButton";
import { useClient } from "@/components/portal/ClientContext";
import { usePinned } from "@/lib/read";
import { monthSlots, type IdeaRef } from "@/lib/month";

/**
 * Your first month. The publishing strategy says one video every other
 * day from a bank of fifteen; this lays the client's own scripts onto
 * those days, in order, then the ideas pinned on this device, then the
 * rest of their hundred. No dates: day one is whenever the first video
 * goes out. The order lives in lib/month.ts, where it is tested.
 */
const DAYS = 30;
const pad = (n: number) => String(n).padStart(2, "0");

export function FirstMonth({ scripts, ideas }: { scripts: Script[]; ideas: IdeaRef[] }) {
  const me = useClient();
  const { pinned } = usePinned(me.slug);
  const written = scripts.filter((s) => s.body?.length);
  const slots = monthSlots(scripts, ideas, pinned, DAYS);
  const byDay = new Map(slots.map((s) => [s.day, s]));
  const filled = slots.filter((s) => s.kind !== "open").length;
  const fromShortlist = slots.filter((s) => s.kind === "idea" && s.pinned).length;
  if (filled === 0) return null;
  const days = Array.from({ length: DAYS }, (_, i) => i + 1);

  return (
    <section aria-label="Your first month" className="border-t border-[color:var(--rule)] pt-10">
      <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
        <div>
          <p className="mono">Your first month</p>
          <h2 className="display mt-3 text-[clamp(36px,4.6vw,72px)]">
            One every other day, <span className="em-serif">laid out.</span>
          </h2>
          <p className="mt-4 max-w-[44ch] text-[15px] leading-relaxed text-[color:var(--ink-mid)]">
            Day one is whenever the first video goes out. The scripts go first, in order; the rest of the posting days take ideas from your hundred, your
            shortlist first. Fifteen posts, the bank the strategy asks for.
          </p>
        </div>
        <p className="mono flex flex-wrap items-baseline gap-x-6 gap-y-1">
          <span className="text-[color:var(--ink)]">{written.length} scripts</span>
          <span>{filled - written.length} ideas</span>
          {fromShortlist > 0 && <span className="text-[color:var(--ink)]">{fromShortlist} pinned</span>}
          <span className="text-[color:var(--ink-mid)]">{slots.length - filled} open</span>
          <span className="no-print">
            <PrintButton label="Print the month" />
          </span>
        </p>
      </div>

      <ol className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5 md:gap-3" aria-label={DAYS + " days"}>
        {days.map((day) => {
          const s = byDay.get(day);
          if (!s) {
            return (
              <li key={day} className="hidden min-h-[64px] border border-[color:var(--rule)] p-3 md:block">
                <span className="mono text-[color:var(--ink-mid)]">Day {pad(day)}</span>
              </li>
            );
          }
          const inner = (
            <>
              <span className="mono flex items-center justify-between">
                <span>Day {pad(day)}</span>
                {s.kind === "script" ? (
                  <span className="flex items-center gap-1.5 text-[color:var(--ink)]">
                    <span className="lamp" aria-hidden="true" />
                    Script {pad(s.n)}
                  </span>
                ) : s.kind === "idea" ? (
                  <span className={s.pinned ? "flex items-center gap-1.5 text-[color:var(--ink)]" : "text-[color:var(--ink-mid)]"}>
                    {s.pinned && <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--ink)]" />}
                    {s.pillar} {pad(s.n)}
                    {s.pinned && <span className="sr-only">, pinned</span>}
                  </span>
                ) : (
                  <span className="text-[color:var(--ink-mid)]">Open</span>
                )}
              </span>
              {s.kind !== "open" ? (
                <>
                  <span className={"mt-3 block leading-snug " + (s.kind === "script" ? "text-[15px] text-[color:var(--ink)]" : "text-[14px] text-[color:var(--ink-soft)]")}>{s.title}</span>
                  {s.kind === "script" && <FilmedMark n={s.n} className="mt-2" />}
                </>
              ) : (
                <span className="em-serif mt-3 block text-[15px] text-[color:var(--ink-mid)]">Something from the bank.</span>
              )}
            </>
          );
          return (
            <li key={day} className={"min-h-[120px] border " + (s.kind === "script" ? "border-[color:var(--rule-strong)] bg-[color:var(--stage-2)]" : "border-[color:var(--rule)]")}>
              {s.kind !== "open" ? (
                <CutLink href={s.href} className="block h-full p-3 transition-colors hover:bg-[color:var(--stage-3)]" data-cursor="Open">
                  {inner}
                </CutLink>
              ) : (
                <div className="h-full p-3">{inner}</div>
              )}
            </li>
          );
        })}
      </ol>
      <p className="mono mt-4 text-[color:var(--ink-mid)]">Even days are for filming the next bank. On a phone only the posting days are shown.</p>
    </section>
  );
}
