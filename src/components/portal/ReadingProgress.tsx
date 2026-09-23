"use client";

import { useEffect, useRef } from "react";

/**
 * A hairline of tally red along the top edge that grows as the page is
 * read: the playhead for a written piece. Driven by a transform on a rAF
 * throttle, so it never touches layout.
 */
export function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (bar.current) bar.current.style.transform = "scaleX(" + p + ")";
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]">
      <div ref={bar} className="h-full w-full origin-left bg-[color:var(--tally)] shadow-[0_0_8px_var(--tally-glow)]" style={{ transform: "scaleX(0)" }} />
    </div>
  );
}
