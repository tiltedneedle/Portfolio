"use client";

import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Rich } from "@/components/portal/Rich";

/**
 * Flashcards. The front is an opening line; the back names the hook it
 * uses. Tap to turn. Nothing is scored and nothing is stored: the drill is
 * the point.
 */
export function Flashcards({ title, items, note }: { title?: string; items: { front: string; back: string }[]; note?: string }) {
  const [turned, setTurned] = useState<Set<number>>(() => new Set());
  const reduced = useReducedMotion();
  const turn = (i: number) =>
    setTurned((s) => {
      const next = new Set(s);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  const all = turned.size === items.length;
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-4">
        {title && <p className="mono">{title}</p>}
        <button
          type="button"
          onClick={() => setTurned(all ? new Set() : new Set(items.map((_, i) => i)))}
          className="slate-link text-[12px]"
        >
          {all ? "Turn all back" : "Turn all"}
        </button>
      </div>
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => {
          const on = turned.has(i);
          return (
            <li key={it.front} className="flashcard" style={{ perspective: 1200 }}>
              <button
                type="button"
                onClick={() => turn(i)}
                aria-pressed={on}
                aria-label={on ? "Turn back to the opening line" : "Turn over to see the hook"}
                data-cursor={on ? "Back" : "Turn"}
                className="relative block aspect-[5/4] w-full text-left"
                style={{
                  transformStyle: "preserve-3d",
                  transition: reduced ? "none" : "transform 0.55s cubic-bezier(0.16,1,0.3,1)",
                  transform: on ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                <span className="absolute inset-0 flex flex-col justify-between border border-[color:var(--rule)] bg-[color:var(--stage-2)] p-5" style={{ backfaceVisibility: "hidden" }}>
                  <span className="mono flex justify-between">
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-[color:var(--ink-mid)]">Opening</span>
                  </span>
                  <span className="spoken em-serif text-[19px] leading-snug text-[color:var(--ink)] md:text-[21px]">
                    <Rich text={it.front} />
                  </span>
                </span>
                <span
                  className="absolute inset-0 flex flex-col justify-between border border-[color:var(--rule-strong)] bg-[color:var(--stage-3)] p-5"
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  <span className="mono flex justify-between">
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex items-center gap-2 text-[color:var(--ink)]">
                      <span className="lamp" aria-hidden="true" />
                      The hook
                    </span>
                  </span>
                  <span className="display text-[clamp(24px,2.4vw,32px)] leading-[0.95] text-[color:var(--ink)]">{it.back}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      {note && (
        <p className="em-serif mt-5 text-[17px] text-[color:var(--ink-mid)]">
          <Rich text={note} />
        </p>
      )}
    </div>
  );
}
