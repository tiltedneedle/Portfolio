"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE_OUT_EXPO } from "@/lib/design-tokens";

/**
 * Deal me one. When a filming day needs a start and a hundred ideas is too
 * many, one card, face up, chosen at random from the ones that are written.
 * Nothing is remembered; every deal is fresh.
 */
type Card = { pillar: string; n: number; text: string };

export function DealOne({ cards }: { cards: Card[] }) {
  const [dealt, setDealt] = useState<Card | null>(null);
  const [count, setCount] = useState(0);
  const reduced = useReducedMotion();
  if (cards.length === 0) return null;

  const deal = () => {
    let next = cards[Math.floor(Math.random() * cards.length)];
    if (cards.length > 1 && dealt && next.text === dealt.text) next = cards[(cards.indexOf(next) + 1) % cards.length];
    setDealt(next);
    setCount((c) => c + 1);
  };

  return (
    <div className="grid gap-8 border-y border-[color:var(--rule)] py-10 md:grid-cols-[1fr_minmax(0,520px)] md:items-center md:gap-16">
      <div>
        <p className="mono">Deal me one</p>
        <h2 className="display mt-3 text-[clamp(36px,4.6vw,72px)]">
          Too many? <span className="em-serif">Take one.</span>
        </h2>
        <p className="mt-4 max-w-[38ch] text-[15px] leading-relaxed text-[color:var(--ink-mid)]">
          One idea from the {cards.length} that are written, chosen at random. Film it this week.
        </p>
        <button type="button" onClick={deal} className="pill pill-solid mt-6 px-6 py-3 text-[15px]" data-cursor="Play">
          {dealt ? "Deal again" : "Deal"}
        </button>
      </div>
      <div className="relative aspect-[4/5] max-h-[380px] w-full max-w-[300px] justify-self-start md:justify-self-end">
        <AnimatePresence mode="wait">
          {dealt ? (
            <motion.div
              key={count}
              initial={reduced ? false : { opacity: 0, rotateY: -12, y: 10 }}
              animate={{ opacity: 1, rotateY: 0, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
              className="absolute inset-0 flex flex-col justify-between overflow-hidden border border-[color:var(--rule-strong)] bg-[color:var(--stage-2)] p-6"
              style={{ transformPerspective: 900 }}
            >
              <span aria-hidden="true" className="numeral pointer-events-none absolute -right-1 bottom-2 text-[120px] opacity-50">
                {String(dealt.n).padStart(2, "0")}
              </span>
              <p className="mono relative flex items-center justify-between">
                <span>
                  {dealt.pillar} {String(dealt.n).padStart(2, "0")}
                </span>
                <span className="flex items-center gap-2 text-[color:var(--ink)]">
                  <span className="lamp" aria-hidden="true" />
                  Dealt
                </span>
              </p>
              <p className="relative max-w-[18ch] text-[21px] leading-snug text-[color:var(--ink)] md:text-[23px]">{dealt.text}</p>
            </motion.div>
          ) : (
            <motion.div
              key="back"
              initial={false}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center border border-[color:var(--rule)] bg-[color:var(--stage-2)]"
              style={{
                backgroundImage: "repeating-linear-gradient(-45deg, transparent 0 14px, rgba(242,239,233,0.05) 14px 15px)",
              }}
            >
              <span className="mono text-[color:var(--ink-mid)]">Face down</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
