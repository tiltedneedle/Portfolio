"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import { belowFold } from "@/lib/below-fold";

/**
 * A block rises a few pixels as it enters the viewport, once.
 *
 * The page is served at rest: nothing is hidden in the HTML. After
 * hydration, only blocks that are still below the fold are set to wait,
 * and an observer lets each one in as the reader reaches it. So the first
 * screen never fades in, a reader with JavaScript off sees everything,
 * and reduced motion is honoured before anything is hidden. Where the
 * fold is, is measured by one observer shared by every block
 * (lib/below-fold), not by each block reading the layout as it mounts.
 *
 * `as` lets the revealed element be the section or list item itself, where
 * a wrapping div would break the grid or the list it sits in.
 */
export function Reveal({
  children,
  className,
  as: Tag = "div",
  id,
  style,
  "aria-label": label,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "li" | "nav" | "figure";
  id?: string;
  style?: CSSProperties;
  "aria-label"?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    return belowFold(el, "0px 0px -60px 0px", {
      hold: () => el.classList.add("reveal-wait"),
      release: () => el.classList.add("reveal-in"),
    });
  }, []);

  const Element = Tag as ElementType;
  return (
    <Element ref={ref} className={className} id={id} style={style} aria-label={label}>
      {children}
    </Element>
  );
}
