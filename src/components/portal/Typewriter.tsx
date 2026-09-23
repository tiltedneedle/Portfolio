"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * A search box that types what people search for, one query after another.
 * The queries are also printed beneath as chips, so the list is complete
 * before hydration and under reduced motion, where the box shows them in
 * turn without the typing.
 */
export function Typewriter({ title, queries }: { title?: string; queries: string[] }) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [len, setLen] = useState(0);
  const [live, setLive] = useState(false);

  useEffect(() => {
    // Nothing moves until the page is in front of someone.
    let start: ReturnType<typeof setTimeout> | null = null;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          start = setTimeout(() => setLive(true), 300);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    const el = document.getElementById("typewriter");
    if (el) io.observe(el);
    return () => {
      io.disconnect();
      if (start) clearTimeout(start);
    };
  }, []);

  useEffect(() => {
    if (!live || queries.length === 0) return;
    const q = queries[i % queries.length];
    if (reduced) {
      const t = setTimeout(() => setI((x) => x + 1), 2400);
      return () => clearTimeout(t);
    }
    let t: ReturnType<typeof setTimeout>;
    if (len < q.length) t = setTimeout(() => setLen(len + 1), 38 + Math.random() * 40);
    else
      t = setTimeout(() => {
        setLen(0);
        setI((x) => x + 1);
      }, 1700);
    return () => clearTimeout(t);
  }, [live, i, len, queries, reduced]);

  const q = queries[i % queries.length] ?? "";
  const shown = reduced ? q : q.slice(0, len);

  return (
    <div id="typewriter">
      {title && <p className="mono mb-4">{title}</p>}
      <div className="flex items-center gap-4 border border-[color:var(--rule-strong)] bg-[color:var(--stage-2)] px-5 py-4" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink-mid)" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <span className="min-h-[1.5em] text-[19px] text-[color:var(--ink)] md:text-[23px]">
          {shown}
          <span className={"ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[0.2em] bg-[color:var(--ink)] " + (reduced ? "" : "tw-caret")} />
        </span>
      </div>
      <ul className="mt-4 flex flex-wrap gap-2">
        {queries.map((x, k) => (
          <li key={x} className={"chip transition-colors " + (live && k === i % queries.length ? "text-[color:var(--ink)]" : "")}>
            {x}
          </li>
        ))}
      </ul>
    </div>
  );
}
