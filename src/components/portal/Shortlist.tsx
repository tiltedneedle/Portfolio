"use client";

import { CutLink } from "@/components/room/CutLink";
import { useClient } from "@/components/portal/ClientContext";
import { usePinned } from "@/lib/read";
import { askHref } from "@/lib/ask";

export type ShortlistItem = { k: string; pillar: string; pillarId: string; n: number; text: string };

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The ideas pinned on this device, in the order they were pinned: the
 * client's own cut of the hundred. The first month and the call sheet
 * take from it first. Nothing shows until something is pinned.
 */
export function Shortlist({ items }: { items: ShortlistItem[] }) {
  const me = useClient();
  const { pinned, toggle } = usePinned(me.slug);
  const byKey = new Map(items.map((i) => [i.k, i]));
  const list = Array.from(pinned)
    .map((k) => byKey.get(k))
    .filter((x): x is ShortlistItem => !!x);
  if (list.length === 0) return null;
  return (
    <section aria-label="Your shortlist" className="mb-24 border-t border-[color:var(--rule)] pt-10">
      <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
        <div>
          <p className="mono">Your shortlist</p>
          <h2 className="display mt-3 text-[clamp(36px,4.6vw,72px)]">
            {list.length === 1 ? "One idea" : list.length + " ideas"}, <span className="em-serif">your pick.</span>
          </h2>
          <p className="mt-4 max-w-[44ch] text-[15px] leading-relaxed text-[color:var(--ink-mid)]">
            Pinned on this device, in the order you pinned them. The first month fills its idea days from here first, and so does the call sheet.
          </p>
        </div>
        <CutLink href="/content/scripts" className="slate-link" data-cursor="Cut">
          See the month &#8599;
        </CutLink>
      </div>
      <ol className="mt-8 border-b border-[color:var(--rule)]">
        {list.map((i) => (
          <li key={i.k} className="grid gap-x-8 gap-y-2 border-t border-[color:var(--rule)] py-5 md:grid-cols-[16ch_1fr_auto] md:items-baseline">
            <a href={"#" + i.pillarId} className="mono text-[color:var(--ink-mid)] transition-colors hover:text-[color:var(--ink)]">
              {i.pillar} {pad(i.n)}
            </a>
            <span className="text-[17px] leading-snug text-[color:var(--ink)]">{i.text}</span>
            <span className="mono flex flex-wrap items-baseline gap-x-5">
              <a href={askHref(me, i.pillar + " " + pad(i.n), i.text)} className="slate-link" data-cursor="Ask">
                Ask for a script &#8599;
              </a>
              <button type="button" onClick={() => toggle(i.k)} className="slate-link" data-cursor="Unpin">
                Unpin
              </button>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
