"use client";

import { useState, type CSSProperties } from "react";
import { Still } from "@/components/portal/Still";
import { Rail } from "@/components/portal/Rail";
import { Odometer } from "@/components/portal/Odometer";
import { Reveal } from "@/components/portal/Reveal";
import { EmbedModal } from "@/components/room/EmbedModal";
import { PLATFORM, STUDIO_VIEWS, embedFor, reel, reelTotal, viewsLabel, type Reel } from "@/content/system/reel";
import { numberWord } from "@/lib/words";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * From our clients' feeds: the studio's own results, on the client's home.
 *
 * One header, two halves read left to right: the whole of the work -- over
 * five billion organic views, set in full and counted in on its reels --
 * and then what you can press play on, the top performers. The per-video
 * facts that used to sit between them are gone at the user's call: the
 * cards already carry each film's views and client, so the row only said
 * them twice.
 *
 * Each card is a still with the views it took and its rank; a tap plays
 * the film in the platform's own player, inside the lightbox. The same
 * section on every client's home: the proof is the studio's, the system is
 * theirs.
 *
 * As the rail comes on, the cards power on one after another like a wall
 * of monitors (.reel-on: a bright line, then the picture opening from it).
 */
export function Showreel() {
  const [open, setOpen] = useState<Reel | null>(null);
  if (reel.length === 0) return null;
  const total = reelTotal();
  // Ranked by what they did, whatever order the data file lists them in,
  // so "No. 1" can never be a claim the numbers do not back.
  const ranked = [...reel].sort((a, b) => b.views - a.views);
  const n = ranked.length;
  return (
    <section className="border-t border-[color:var(--rule)] bg-[color:var(--stage)] py-20 md:py-28" aria-label="From our clients' feeds">
      <div className="mx-auto max-w-[1600px] px-6 md:px-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-x-12">
          <div className="lg:col-span-7">
            <p className="mono">From our clients&rsquo; feeds</p>
            <h2 className="mt-5">
              <span className="sr-only">Over five billion organic views.</span>
              {/* A headline, not a wall. The figure and its plus are 6.16em
                  wide in this face (measured: 995px at 176px), so at 7vw it
                  is 43% of the screen and sits inside its seven columns at
                  every width; the 120px cap keeps it there past 1600. */}
              <span aria-hidden="true" className="display flex items-start text-[clamp(40px,7vw,120px)] leading-none text-[color:var(--ink)]">
                <Odometer value={STUDIO_VIEWS} />
                <span className="odo-sep text-[color:var(--ink-mid)]">+</span>
              </span>
              <span aria-hidden="true" className="em-serif mt-1 block text-[clamp(28px,3.6vw,62px)] leading-[1] text-[color:var(--ink-soft)]">
                organic views.
              </span>
            </h2>
          </div>

          {/* The turn from the whole to the nine, across a hairline, its
              foot level with the foot of the figure. */}
          <div className="border-[color:var(--rule)] lg:col-span-5 lg:border-l lg:pb-2 lg:pl-12">
            <p className="display text-[clamp(28px,2.6vw,42px)] leading-[0.95] text-[color:var(--ink)]">
              These are the <span className="em-serif">top performers.</span>
            </p>
            <p className="mt-4 max-w-[44ch] text-[16px] leading-relaxed text-[color:var(--ink-soft)] [text-wrap:pretty]">
              {cap(numberWord(n))} videos from our clients&rsquo; feeds, {viewsLabel(total)} views between them: the work this system is built from.
              Watch the first three seconds of each; the hook is the lesson.
            </p>
          </div>
        </div>

        <Reveal className="mt-14 md:mt-16">
          <Rail count={n} label={"Top " + numberWord(n) + " · " + viewsLabel(total) + " views"}>
            {ranked.map((r, i) => {
              // A restricted film opens on the platform; the rest play here.
              const Card = r.restricted ? "a" : "button";
              const cardProps = r.restricted
                ? { href: r.url, target: "_blank", rel: "noopener noreferrer" }
                : { type: "button" as const, onClick: () => setOpen(r) };
              return (
              <li key={r.id} className="w-[min(220px,68vw)] md:w-[248px]">
                <Card
                  {...cardProps}
                  className="group block w-full text-left"
                  aria-label={"Number " + (i + 1) + ". " + (r.restricted ? "Watch on " + PLATFORM[r.platform] + ": " : "Play ") + r.client + ": " + r.title + ", " + viewsLabel(r.views) + " views on " + PLATFORM[r.platform]}
                  data-cursor={r.restricted ? "Open" : "Play"}
                >
                  <span
                    className="reel-on well block border border-[color:var(--rule)] transition-colors duration-300 group-hover:border-[color:var(--rule-strong)]"
                    style={{ "--i": i } as CSSProperties}
                  >
                    <Still src={r.thumb} sizes="248px" className="first3-push object-cover" />
                    {/* The first three seconds, made literal: on hover a playhead
                        runs the foot of the clip for exactly three seconds and a
                        counter reads them off. The section's own instruction. */}
                    <span aria-hidden="true" className="first3" />
                    <span aria-hidden="true" className="first3-tc mono absolute right-3 top-3 flex items-center gap-1.5 bg-[rgba(11,11,12,0.8)] px-2 py-1 text-[color:var(--ink)] backdrop-blur-sm">
                      <span className="lamp lamp-live" />
                    </span>
                    {/* The rank, on its own plate so it reads over any frame. */}
                    <span aria-hidden="true" className="mono absolute left-3 top-3 bg-[rgba(11,11,12,0.8)] px-2 py-1 text-[color:var(--ink)] backdrop-blur-sm">
                      No. {i + 1}
                    </span>
                    <span className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[rgba(0,0,0,0.78)] to-transparent" />
                    <span className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-3">
                      <span className="display text-[36px] leading-none text-[color:var(--ink)]">{viewsLabel(r.views)}</span>
                      <span className="mono flex items-center gap-2 pb-1 text-[color:var(--ink)]">
                        <span className="lamp-off" aria-hidden="true" />
                        {r.restricted ? "Watch on " + PLATFORM[r.platform] : "Play"}
                      </span>
                    </span>
                  </span>
                  <span className="mt-3 block text-[15px] leading-snug text-[color:var(--ink)]">{r.client}</span>
                  <span className="mono mt-1 block text-[10px]">
                    {PLATFORM[r.platform]} &middot; @{r.handle}
                    {r.restricted && <span className="text-[color:var(--ink-mid)]"> &middot; opens on {PLATFORM[r.platform]}</span>}
                  </span>
                </Card>
              </li>
              );
            })}
          </Rail>
        </Reveal>
      </div>
      <EmbedModal src={open ? embedFor(open) : null} platform={open?.platform} title={open ? open.client + ": " + open.title : ""} open={!!open} onClose={() => setOpen(null)} />
    </section>
  );
}
