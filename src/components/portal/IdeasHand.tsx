import type { CSSProperties } from "react";
import type { Idea, Pillar } from "@/content/clients/types";
import { pillars } from "@/content/system/pillars";

const pad = (i: number) => String(i + 1).padStart(2, "0");

/**
 * The hundred, as a hand of cards: the first written idea from each pillar,
 * fanned beside the title and dealt in one after another as the page
 * opens. The page already deals (DealOne, face down), so its header holds
 * the deck. Decoration over what the pillars below say in full, so it is
 * hidden from a screen reader; wide screens only, where the title leaves
 * the room for it. No written ideas, no hand.
 */
export function IdeasHand({ ideas }: { ideas: Record<Pillar, Idea[]> }) {
  const hand = pillars
    .map((p) => {
      const i = ideas[p.id].findIndex((idea) => idea.text);
      return i < 0 ? null : { pillar: p.title, n: pad(i), text: ideas[p.id][i].text ?? "" };
    })
    .filter((c): c is NonNullable<typeof c> => !!c);
  if (!hand.length) return null;
  return (
    <div aria-hidden="true" className="hand no-print relative hidden h-[330px] w-[520px] shrink-0 xl:block">
      {hand.map((c, i) => {
        // Evenly about the middle, outer cards turned further and set lower,
        // so however many there are they read as a hand held up. Sized so
        // the fan, spread for the hover, still ends inside the page margin:
        // at 1440 a wider one ran 27px past the screen and scrolled it.
        const o = i - (hand.length - 1) / 2;
        const style = { "--i": i, "--r": o * 8 + "deg", "--x": o * 84 + "px", "--y": o * o * 8 + "px" } as CSSProperties;
        return (
          <div
            key={c.pillar}
            className="hand-card absolute bottom-6 left-1/2 flex aspect-[4/5] w-[184px] flex-col justify-between overflow-hidden border border-[color:var(--rule-strong)] bg-[color:var(--stage-2)] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.55)]"
            style={style}
          >
            <span className="numeral pointer-events-none absolute -right-1 bottom-1 text-[88px] opacity-50" data-n={c.n} />
            <p className="mono relative text-[10px]">
              {c.pillar} {c.n}
            </p>
            <p className="relative line-clamp-4 text-[14px] leading-snug text-[color:var(--ink)]">{c.text}</p>
          </div>
        );
      })}
    </div>
  );
}
