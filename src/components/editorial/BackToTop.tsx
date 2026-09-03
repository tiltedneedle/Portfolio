"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/** Fixed circular up-arrow, bottom right, appearing once the page has scrolled. */
export function BackToTop() {
  const [shown, setShown] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      setShown(window.scrollY > 600);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })}
      aria-label="Back to top"
      className={
        "fixed bottom-7 right-7 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-[0_8px_30px_rgba(0,0,0,0.18)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 " +
        (shown ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-3")
      }
    >
      <span aria-hidden="true" className="text-[22px] leading-none">&#8593;</span>
    </button>
  );
}
