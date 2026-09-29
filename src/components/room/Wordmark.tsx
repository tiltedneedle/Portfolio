"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/**
 * The animated wordmark. Every few seconds a stitch runs through the name:
 * letter by letter, each glyph tips into a tilted needle stroke and settles
 * back, left to right, while the figure leans into the run. It is the mark's
 * own idea (a tilted needle) rather than a borrowed one, and it is pure CSS,
 * so it stays crisp at any size and freezes under reduced motion.
 *
 * Accessible name is the plain text; the per-letter spans are decoration.
 *
 * The stitch is struck from here, once every seven seconds while the page
 * is showing (.is-stitching, globals.css), and between stitches nothing on
 * the mark animates. It had run as seven-second CSS loops, 38 of them,
 * which idled 94% of the time and kept every letter on a layer of its own
 * on every page. Under reduced motion it is never struck.
 */
const NAME = "TILTED NEEDLE";
const EVERY_MS = 7000;
// The last letter starts 12 x 60ms in and takes 0.42s; the lean takes 0.98s.
const RUN_MS = 1250;

export function Wordmark({ size = 15, mark = 22 }: { size?: number; mark?: number }) {
  const letters = NAME.split("");
  const root = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let off: ReturnType<typeof setTimeout> | undefined;
    const stitch = () => {
      if (document.hidden) return;
      el.classList.add("is-stitching");
      clearTimeout(off);
      off = setTimeout(() => el.classList.remove("is-stitching"), RUN_MS);
    };
    const first = setTimeout(stitch, 140);
    const every = setInterval(stitch, EVERY_MS);
    return () => {
      clearTimeout(first);
      clearInterval(every);
      clearTimeout(off);
      el.classList.remove("is-stitching");
    };
  }, []);
  return (
    <span ref={root} className="wm inline-flex items-center gap-3" role="img" aria-label="Tilted Needle">
      {/* The stylesheet lets the height follow the width; saying so keeps next/image quiet. */}
      <Image src="/white-logo.png" alt="" width={mark} height={mark} className="wm-mark object-contain" style={{ height: "auto" }} />
      <span aria-hidden="true" className="wm-text display font-bold tracking-[0.08em] text-[color:var(--ink)]" style={{ fontSize: size }}>
        {letters.map((ch, i) => (
          <span key={i} className="wm-l" style={{ ["--i" as string]: i }}>
            {ch === " " ? (
              <span className="inline-block w-[0.35em]" />
            ) : (
              <>
                <span className="wm-a">{ch}</span>
                <span className="wm-b">/</span>
              </>
            )}
          </span>
        ))}
      </span>
    </span>
  );
}
