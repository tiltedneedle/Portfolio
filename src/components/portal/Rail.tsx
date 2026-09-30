"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * A rail: content that slides sideways. Native scrolling with snap points,
 * so a trackpad, a finger, a wheel with shift, and the two arrows all work;
 * a mono counter reads which card is first in view.
 */
export function Rail({ children, count, label }: { children: ReactNode; count: number; label?: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const [first, setFirst] = useState(0);
  const reduced = useReducedMotion();
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      // Everything is measured before anything is written: a write between
      // two reads makes the browser work the page out again, once a card.
      const left = el.scrollLeft;
      const width = el.clientWidth;
      const end = el.scrollWidth;
      const kids = Array.from(el.children) as HTMLElement[];
      const home = el.offsetLeft;
      const cards = kids.map((kid) => ({ at: kid.offsetLeft - home, w: kid.offsetWidth }));
      let i = 0;
      for (let k = 0; k < cards.length; k++) {
        i = k;
        if (cards[k].at >= left - 8) break;
      }
      setFirst(i);
      setAtEnd(left + width >= end - 4);
      // Depth: where each card's middle sits across the rail (-1 left edge,
      // 0 middle, 1 right edge), for its numeral to move against it
      // (.rail > li .numeral). Never under reduced motion.
      if (reduced) return;
      const mid = left + width / 2;
      kids.forEach((kid, k) => kid.style.setProperty("--par", ((cards[k].at + cards[k].w / 2 - mid) / width).toFixed(3)));
    };
    // The first measure is a ResizeObserver's first call, which comes once
    // the browser has laid the rail out itself; measured as the page
    // hydrates, it forced a layout of the whole page.
    const ro = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    if (ro) ro.observe(el);
    else update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      ro?.disconnect();
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [reduced]);

  const by = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    // The arrows are the one motion on a rail; stillness turns it into a jump.
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <div>
      <div className="mono mb-4 flex items-center justify-between">
        <span>{label}</span>
        <span className="flex items-center gap-5">
          <span>
            {String(first + 1).padStart(2, "0")} <span className="text-[color:var(--ink-mid)]">/</span> {String(count).padStart(2, "0")}
          </span>
          {/* A 40px target around a 16px arrow; the negative margin keeps the row as it was. */}
          <button type="button" onClick={() => by(-1)} className="slate-link -m-3 inline-flex h-10 w-10 items-center justify-center disabled:opacity-30" aria-label="Scroll back" disabled={first === 0}>
            &larr;
          </button>
          <button type="button" onClick={() => by(1)} className="slate-link -m-3 inline-flex h-10 w-10 items-center justify-center disabled:opacity-30" aria-label="Scroll forward" disabled={atEnd}>
            &rarr;
          </button>
        </span>
      </div>
      {/* A scrollable region has to be reachable from the keyboard; arrow keys then scroll it. */}
      <ul ref={ref} tabIndex={0} aria-label={label} className="rail -mx-6 gap-4 px-6 pb-2 scroll-px-6 outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--rule-strong)] md:-mx-14 md:px-14 md:scroll-px-14">
        {children}
      </ul>
    </div>
  );
}
