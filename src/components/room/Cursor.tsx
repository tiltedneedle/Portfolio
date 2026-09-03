"use client";

import { useEffect, useRef } from "react";

/**
 * The cursor is a playhead. On fine pointers the arrow is replaced by a small
 * ring; over anything with `data-cursor="…"` the ring collapses to a tally dot
 * and the word appears beside it (PLAY, OPEN, CUT). Over ordinary links the
 * ring simply grows.
 *
 * Positioned by writing a transform directly in a pointer handler, with no
 * React state and no framer, so it costs nothing on the main thread and never
 * lags. Touch devices and reduced-motion users keep the native cursor.
 */
export function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = root.current;
    if (!fine || reduced || !el) return;

    const html = document.documentElement;
    html.classList.add("has-cursor");
    el.style.opacity = "0";

    const move = (e: PointerEvent) => {
      el.style.transform = "translate3d(" + e.clientX + "px," + e.clientY + "px,0)";
      el.style.opacity = "1";
    };

    const over = (e: PointerEvent) => {
      const t = e.target as Element | null;
      // An iframe (the scheduler) swallows pointer events; rather than freeze
      // the ring at its edge, hand the native cursor back inside it.
      if (t?.tagName === "IFRAME") {
        el.style.opacity = "0";
        return;
      }
      el.style.opacity = "1";
      const named = t?.closest("[data-cursor]") as HTMLElement | null;
      if (named) {
        el.dataset.mode = "label";
        if (label.current) label.current.textContent = named.dataset.cursor ?? "";
        return;
      }
      const link = t?.closest("a, button, [role=button], input, textarea, select, label");
      el.dataset.mode = link ? "link" : "";
    };

    const leave = () => {
      el.style.opacity = "0";
    };
    const enter = () => {
      el.style.opacity = "1";
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    document.documentElement.addEventListener("pointerenter", enter);
    return () => {
      html.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.removeEventListener("pointerenter", enter);
    };
  }, []);

  return (
    <div ref={root} className="cursor" aria-hidden="true" style={{ opacity: 0 }}>
      <span className="cursor-ring" />
      <span ref={label} className="cursor-label" />
    </div>
  );
}
