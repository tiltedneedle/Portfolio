"use client";

import { useEffect, useRef, type CSSProperties } from "react";

/**
 * The studio's name, taken at its word: the letters of TILTED are needles.
 *
 * As the title lands they swing past upright and settle, one after another
 * (CSS: .tilt-l, needle-settle), and after that each one leans toward the
 * pointer, the way a gauge's needle leans toward a pull -- furthest when
 * the pointer is level with the word, not at all when it is far away. It
 * springs back upright when the pointer leaves the hero.
 *
 * The word is read once, whole: the visible letters are aria-hidden and a
 * screen reader gets the plain word. Pointer-led only where there is a fine
 * pointer to lead it, never under reduced motion, and the lean is written
 * straight to each letter's style, so moving the pointer re-renders nothing.
 */
const MAX = 9; // degrees at full lean
const SPAN = 260; // px from a letter at which the lean is full
const REACH = 900; // px beyond which the pointer has no pull at all

export function Tilt({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const word = ref.current;
    if (!word) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const letters = Array.from(word.querySelectorAll<HTMLElement>(".tilt-l"));
    const zone: HTMLElement | Window = word.closest("section") ?? window;
    let frame = 0;
    let px = 0;
    let py = 0;
    const lean = () => {
      frame = 0;
      // Every letter measured before any leans, so a frame lays out once.
      const feet = letters.map((l) => l.getBoundingClientRect());
      letters.forEach((l, i) => {
        const r = feet[i];
        // The pivot is the foot of the letter, where a needle is pinned.
        const dx = px - (r.left + r.width / 2);
        const dy = py - r.bottom;
        const pull = Math.max(0, 1 - Math.hypot(dx, dy * 1.4) / REACH);
        const a = Math.max(-1, Math.min(1, dx / SPAN)) * MAX * pull;
        l.style.setProperty("--tilt", a.toFixed(2) + "deg");
      });
    };
    const move = (e: Event) => {
      const p = e as PointerEvent;
      px = p.clientX;
      py = p.clientY;
      if (!frame) frame = requestAnimationFrame(lean);
    };
    const rest = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      for (const l of letters) l.style.setProperty("--tilt", "0deg");
    };
    zone.addEventListener("pointermove", move, { passive: true });
    zone.addEventListener("pointerleave", rest);
    return () => {
      zone.removeEventListener("pointermove", move);
      zone.removeEventListener("pointerleave", rest);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <span ref={ref} className="tilt">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {[...text].map((ch, k) => (
          <span key={k} className="tilt-l" style={{ "--k": k } as CSSProperties}>
            {ch}
          </span>
        ))}
      </span>
    </span>
  );
}
