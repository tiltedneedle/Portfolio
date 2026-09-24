"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * A search box that types what people search for, one query after another.
 * The queries are also printed beneath as chips, so the list is complete
 * before hydration. Under reduced motion each query appears whole and the
 * caret holds still (the CSS handles the caret).
 *
 * Nothing about the first render depends on the reduced-motion setting:
 * the server and the client must paint the same box, or React throws the
 * tree away and starts again.
 */
export function Typewriter({ title, queries }: { title?: string; queries: string[] }) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [len, setLen] = useState(0);
  const [live, setLive] = useState(false);
  const box = useRef<HTMLDivElement>(null);

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
    if (box.current) io.observe(box.current);
    return () => {
      io.disconnect();
      if (start) clearTimeout(start);
    };
  }, []);

  useEffect(() => {
    if (!live || queries.length === 0) return;
    const q = queries[i % queries.length];
    let t: ReturnType<typeof setTimeout>;
    if (len < q.length) t = setTimeout(() => setLen(reduced ? q.length : len + 1), reduced ? 0 : 38 + Math.random() * 40);
    else
      t = setTimeout(
        () => {
          setLen(0);
          setI((x) => x + 1);
        },
        reduced ? 2400 : 1700
      );
    return () => clearTimeout(t);
  }, [live, i, len, queries, reduced]);

  const q = queries[i % queries.length] ?? "";
  const shown = q.slice(0, len);

  return (
    <div ref={box} data-typewriter="">
      {title && <p className="mono mb-4">{title}</p>}
      <div className="flex items-center gap-4 border border-[color:var(--rule-strong)] bg-[color:var(--stage-2)] px-5 py-4" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink-mid)" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <span className="min-h-[1.5em] text-[19px] text-[color:var(--ink)] md:text-[23px]">
          {shown}
          <span className="tw-caret ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[0.2em] bg-[color:var(--ink)]" />
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
