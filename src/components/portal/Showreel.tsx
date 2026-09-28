"use client";

import { useState } from "react";
import { Still } from "@/components/portal/Still";
import { Rail } from "@/components/portal/Rail";
import { Odometer } from "@/components/portal/Odometer";
import { EmbedModal } from "@/components/room/EmbedModal";
import { PLATFORM, STUDIO_VIEWS, embedFor, reel, reelTotal, viewsLabel, type Reel } from "@/content/system/reel";
import { numberWord, ordinalWord } from "@/lib/words";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * From our clients' feeds: the studio's own results, on the client's home.
 *
 * It opens on the whole of the work -- over five billion organic views,
 * set in full and counted in -- and then narrows to the proof you can
 * press play on: the top performers, ranked, with the best of them, the
 * nine together and the ninth read out, because "even the ninth did 2.5M"
 * says more about the method than the first one does.
 *
 * Each card is a still with the views it took and its rank; a tap plays
 * the film in the platform's own player, inside the lightbox. The same
 * section on every client's home: the proof is the studio's, the system is
 * theirs.
 */
export function Showreel() {
  const [open, setOpen] = useState<Reel | null>(null);
  if (reel.length === 0) return null;
  const total = reelTotal();
  // Ranked by what they did, whatever order the data file lists them in,
  // so "No. 1" can never be a claim the numbers do not back.
  const ranked = [...reel].sort((a, b) => b.views - a.views);
  const best = ranked[0];
  const last = ranked[ranked.length - 1];
  const n = ranked.length;
  const facts = [
    { k: "The best of them", v: viewsLabel(best.views), who: best.client },
    { k: "The top " + numberWord(n) + " together", v: viewsLabel(total), who: "Between them" },
    { k: "Even the " + ordinalWord(n), v: viewsLabel(last.views), who: last.client },
  ];
  return (
    <section className="border-t border-[color:var(--rule)] bg-[color:var(--stage)] py-20 md:py-28" aria-label="From our clients' feeds">
      <div className="mx-auto max-w-[1600px] px-6 md:px-14">
        <p className="mono">From our clients&rsquo; feeds</p>
        <h2 className="mt-5">
          <span className="sr-only">Over five billion organic views.</span>
          {/* Sized to fill the measure: the figure and its plus are 6.16em
              wide in this face, so 13vw fits inside the gutters at every
              width from 360 to 1920 and the 232px cap holds it inside the
              1600px column. Measured, not guessed: 995px at 176px. */}
          <span aria-hidden="true" className="display flex items-start text-[clamp(44px,13vw,232px)] leading-none text-[color:var(--ink)]">
            <Odometer value={STUDIO_VIEWS} />
            <span className="odo-sep text-[color:var(--ink-mid)]">+</span>
          </span>
          <span aria-hidden="true" className="em-serif mt-1 block text-[clamp(34px,6.2vw,108px)] leading-[1] text-[color:var(--ink-soft)]">
            organic views.
          </span>
        </h2>

        <div className="mt-12 grid gap-10 border-t border-[color:var(--rule)] pt-10 md:mt-16 md:grid-cols-12 md:gap-x-14 md:pt-12">
          <div className="md:col-span-5">
            <p className="display text-[clamp(30px,3vw,46px)] leading-[0.95] text-[color:var(--ink)]">
              These are the <span className="em-serif">top performers.</span>
            </p>
            <p className="measure mt-5 text-[16px] leading-relaxed text-[color:var(--ink-soft)]">
              {cap(numberWord(n))} videos from our clients&rsquo; feeds, {viewsLabel(total)} views between them: the work this system is built from.
              Watch the first three seconds of each; the hook is the lesson.
            </p>
          </div>
          <dl className="grid grid-cols-3 gap-x-5 gap-y-6 border-[color:var(--rule)] md:col-span-7 md:gap-x-10 md:border-l md:pl-12">
            {facts.map((f) => (
              <div key={f.k} className="flex flex-col">
                <dt className="mono text-[color:var(--ink-mid)]">{f.k}</dt>
                <dd className="display mt-3 text-[clamp(30px,3.6vw,60px)] leading-none text-[color:var(--ink)]">{f.v}</dd>
                <dd className="mt-2 text-[13px] leading-snug text-[color:var(--ink-mid)]">{f.who}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-14 md:mt-16">
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
                  <span className="well block border border-[color:var(--rule)] transition-colors duration-300 group-hover:border-[color:var(--rule-strong)]">
                    <Still src={r.thumb} sizes="248px" className="object-cover" />
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
        </div>
      </div>
      <EmbedModal src={open ? embedFor(open) : null} platform={open?.platform} title={open ? open.client + ": " + open.title : ""} open={!!open} onClose={() => setOpen(null)} />
    </section>
  );
}
