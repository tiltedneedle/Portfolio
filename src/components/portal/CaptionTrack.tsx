"use client";

import { Fragment, useEffect, useRef, type CSSProperties } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";

/**
 * A statement read the way the work it is about is read: as a caption
 * track. Scrolling through it plays it. Each word lights as the reader
 * reaches it, a tally bar runs under the word being read -- the one place
 * on the page that is "playing" -- and the words ahead wait, dimmed.
 *
 * One custom property, --p (how far the scroll has carried the reader
 * through the block, 0 to 1), drives every word in CSS (.cap-w), so the
 * scroll re-renders nothing. Served whole: before hydration, under reduced
 * motion and in print every word is lit and no bar shows. The sentence is
 * given to a screen reader once, plain; the lit words are decoration.
 */
export function CaptionTrack({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  // From the block's top a little above the foot of the screen to its foot
  // a third of the way down: long enough to read along with.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.35"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!reduced) ref.current?.style.setProperty("--p", v.toFixed(4));
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) el.style.removeProperty("--p");
    else el.style.setProperty("--p", scrollYProgress.get().toFixed(4));
  }, [reduced, scrollYProgress]);

  const words = text.split(/\s+/).filter(Boolean);
  return (
    <p ref={ref} className={"caption-track " + className} style={{ "--n": words.length } as CSSProperties}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <Fragment key={i}>
            {i > 0 && " "}
            <span className="cap-w" style={{ "--i": i } as CSSProperties}>
              {w}
            </span>
          </Fragment>
        ))}
      </span>
    </p>
  );
}
