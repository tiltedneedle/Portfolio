"use client";

import { useEffect, useState } from "react";

/**
 * The rail beside a guide: every section, with the lamp on the one being
 * read. It follows the reader with an IntersectionObserver, and each row is
 * a real anchor so the keyboard can use it too. Sections the reader has
 * scrolled past get a tick for the rest of the visit; nothing is stored.
 * Below the large breakpoint it folds into a cue sheet at the top of the
 * page.
 */
export function GuideRail({ items }: { items: { id: string; n?: string; title: string }[] }) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");
  const [read, setRead] = useState<string>("");

  useEffect(() => {
    const els = items.map((it) => document.getElementById(it.id)).filter((el): el is HTMLElement => !!el);
    if (!els.length) return;
    // The section whose top is nearest the reading line (a third down the
    // viewport) is the one being read.
    const pick = () => {
      const line = window.innerHeight * 0.33;
      let best = els[0];
      let bestDist = Infinity;
      const passed: string[] = [];
      for (const el of els) {
        const top = el.getBoundingClientRect().top;
        const dist = top <= line ? line - top : (top - line) * 4;
        if (dist < bestDist) {
          bestDist = dist;
          best = el;
        }
        // Read once its whole height has gone past the reading line.
        if (el.getBoundingClientRect().bottom < line) passed.push(el.id);
      }
      setActive((prev) => (prev === best.id ? prev : best.id));
      // Kept as a joined string so an unchanged set never re-renders.
      setRead((prev) => {
        const seen = new Set(prev ? prev.split(" ") : []);
        for (const id of passed) seen.add(id);
        const next = Array.from(seen).join(" ");
        return next === prev ? prev : next;
      });
    };
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        pick();
      });
    };
    pick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  const list = (
    <ol className="flex flex-col">
      {items.map((it) => {
        const on = it.id === active;
        const done = !on && read.split(" ").includes(it.id);
        return (
          <li key={it.id}>
            <a
              href={"#" + it.id}
              className={
                "flex items-baseline gap-3 border-t border-[color:var(--rule)] py-2.5 text-[13px] leading-snug transition-colors duration-300 " +
                (on ? "text-[color:var(--ink)]" : "text-[color:var(--ink-mid)] hover:text-[color:var(--ink)]")
              }
              aria-current={on ? "location" : undefined}
            >
              <span className="flex w-[2ch] shrink-0 items-center gap-2" aria-hidden="true">
                {done ? <span className="mono text-[10px] leading-none text-[color:var(--ink-faint)]">&#10003;</span> : <span className={on ? "lamp" : "lamp-off"} />}
              </span>
              <span className="mono w-[3ch] shrink-0 text-[color:var(--ink-faint)]">{it.n ?? "—"}</span>
              <span>{it.title}</span>
            </a>
          </li>
        );
      })}
    </ol>
  );

  return (
    <>
      {/* wide: a sticky rail */}
      <aside className="hidden lg:block">
        <div className="sticky top-28">
          <p className="mono mb-3">On this page</p>
          {list}
        </div>
      </aside>
      {/* narrow: a cue sheet */}
      <details className="mb-10 border border-[color:var(--rule)] p-4 lg:hidden">
        <summary className="mono cursor-pointer list-none text-[color:var(--ink)]">
          On this page <span className="text-[color:var(--ink-faint)]">/ {items.length}</span>
        </summary>
        <div className="mt-4">{list}</div>
      </details>
    </>
  );
}
