"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * A block rises a few pixels as it enters the viewport, once.
 *
 * The page is served at rest: nothing is hidden in the HTML. After
 * hydration, only blocks that are still below the fold are set to wait,
 * and an observer lets each one in as the reader reaches it. So the first
 * screen never fades in, a reader with JavaScript off sees everything,
 * and reduced motion is honoured before anything is hidden.
 */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Already on screen, or above it: leave it be.
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    el.classList.add("reveal-wait");
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        el.classList.add("reveal-in");
        io.disconnect();
      },
      { rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
