"use client";

import { useState } from "react";
import { Still } from "@/components/portal/Still";
import { Rail } from "@/components/portal/Rail";
import { EmbedModal } from "@/components/room/EmbedModal";
import { PLATFORM, embedFor, reel, reelTotal, viewsInWords, viewsLabel, type Reel } from "@/content/system/reel";

/**
 * From our clients' feeds: the studio's own results, on the client's home.
 * Each card is a still with the views it took; a tap plays the film in the
 * platform's own player, inside the lightbox. The same rail on every
 * client's home: the proof is the studio's, the system is theirs.
 */
export function Showreel() {
  const [open, setOpen] = useState<Reel | null>(null);
  const total = reelTotal();
  if (reel.length === 0) return null;
  return (
    <section className="border-t border-[color:var(--rule)] bg-[color:var(--stage)] py-20 md:py-28" aria-label="From our clients' feeds">
      <div className="mx-auto max-w-[1600px] px-6 md:px-14">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <div>
            <p className="mono">From our clients&rsquo; feeds</p>
            <h2 className="display mt-3 max-w-[16ch] text-[clamp(36px,4.6vw,72px)]">
              {reel.length} videos, <span className="em-serif">{viewsInWords(total)} views.</span>
            </h2>
            <p className="mt-4 max-w-[44ch] text-[15px] leading-relaxed text-[color:var(--ink-mid)]">
              The work this system is built from. Watch the first three seconds of each; the hook is the lesson.
            </p>
          </div>
        </div>
        <div className="mt-10">
          <Rail count={reel.length} label={viewsLabel(total) + " views"}>
            {reel.map((r) => (
              <li key={r.id} className="w-[min(220px,68vw)] md:w-[248px]">
                <button
                  type="button"
                  onClick={() => setOpen(r)}
                  className="group block w-full text-left"
                  aria-label={"Play " + r.client + ": " + r.title + ", " + viewsLabel(r.views) + " views on " + PLATFORM[r.platform]}
                  data-cursor="Play"
                >
                  <span className="well block border border-[color:var(--rule)] transition-colors duration-300 group-hover:border-[color:var(--rule-strong)]">
                    <Still src={r.thumb} className="absolute inset-0 h-full w-full object-cover" />
                    <span className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[rgba(0,0,0,0.78)] to-transparent" />
                    <span className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-3">
                      <span className="display text-[36px] leading-none text-[color:var(--ink)]">{viewsLabel(r.views)}</span>
                      <span className="mono flex items-center gap-2 pb-1 text-[color:var(--ink)]">
                        <span className="lamp-off" aria-hidden="true" />
                        Play
                      </span>
                    </span>
                  </span>
                  <span className="mt-3 block text-[15px] leading-snug text-[color:var(--ink)]">{r.client}</span>
                  <span className="mono mt-1 block text-[10px]">
                    {PLATFORM[r.platform]} &middot; @{r.handle}
                  </span>
                </button>
              </li>
            ))}
          </Rail>
        </div>
      </div>
      <EmbedModal src={open ? embedFor(open) : null} platform={open?.platform} title={open ? open.client + ": " + open.title : ""} open={!!open} onClose={() => setOpen(null)} />
    </section>
  );
}
