"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * A rail: content that slides sideways. Native scrolling with snap points,
 * so a trackpad, a finger, a wheel with shift, and the two arrows all work;
 * a mono counter reads which card is first in view.
 */
export function Rail({ children, count, label }: { children: ReactNode; count: number; label?: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const [first, setFirst] = useState(0);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const left = el.scrollLeft;
      const kids = Array.from(el.children) as HTMLElement[];
      let i = 0;
      for (let k = 0; k < kids.length; k++) {
        if (kids[k].offsetLeft - el.offsetLeft >= left - 8) {
          i = k;
          break;
        }
        i = k;
      }
      setFirst(i);
      setAtEnd(left + el.clientWidth >= el.scrollWidth - 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const by = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <div>
      <div className="mono mb-4 flex items-center justify-between">
        <span>{label}</span>
        <span className="flex items-center gap-5">
          <span>
            {String(first + 1).padStart(2, "0")} <span className="text-[color:var(--ink-mid)]">/</span> {String(count).padStart(2, "0")}
          </span>
          <button type="button" onClick={() => by(-1)} className="slate-link disabled:opacity-30" aria-label="Scroll back" disabled={first === 0}>
            &larr;
          </button>
          <button type="button" onClick={() => by(1)} className="slate-link disabled:opacity-30" aria-label="Scroll forward" disabled={atEnd}>
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
