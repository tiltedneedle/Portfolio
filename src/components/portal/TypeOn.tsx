"use client";

import { useEffect, useRef, useState } from "react";

const STEP = 2; // characters a tick
const TICK = 22; // ms a tick

/**
 * A line that is still being written, typed out behind a tally caret as it
 * comes on -- the same hand as the home page's "Still being written" list.
 * Used where the studio has promised a page and not yet written it: what the
 * page will cover types itself while the reader looks.
 *
 * Served whole; held back only when it is still below the fold after
 * hydration, never under reduced motion. The rest of the line is laid out
 * but unseen while it types, so nothing reflows, and a screen reader is
 * given the line whole, once.
 */
export function TypeOn({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  // null: whole. Otherwise how much is out, and whether the typing has begun.
  const [at, setAt] = useState<{ n: number; go: boolean } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !text) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setAt({ n: 0, go: false });
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        setAt({ n: 0, go: true });
      },
      { rootMargin: "0px 0px -15% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [text]);

  useEffect(() => {
    if (!at || !at.go) return;
    const t = setTimeout(() => setAt(at.n >= text.length ? null : { n: Math.min(text.length, at.n + STEP), go: true }), at.n >= text.length ? 600 : TICK);
    return () => clearTimeout(t);
  }, [at, text]);

  if (!at)
    return (
      <span ref={ref} className="type-on">
        {text}
      </span>
    );
  return (
    <span ref={ref} className="type-on">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.slice(0, at.n)}
        <span className="type-caret" />
        <span className="invisible">{text.slice(at.n)}</span>
      </span>
    </span>
  );
}
