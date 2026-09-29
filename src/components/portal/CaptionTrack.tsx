"use client";

import { Fragment, useEffect, useRef, type CSSProperties } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";

type Box = { l: number; r: number; t: number; b: number };

/**
 * A statement read the way the work it is about is read: as a caption
 * track. Scrolling through it plays it. The words light as the read reaches
 * them, the words ahead wait dimmed, and one tally line -- the one thing on
 * the page that is "playing" -- runs under the line being read, from its
 * first letter to the read's exact point, and starts again at the head of
 * the next line when it wraps.
 *
 * The read moves through the sentence at an even pace per letter, not per
 * word: a long word takes longer to cross than a short one, and the line
 * glides across the spaces between words rather than jumping from word to
 * word. (It used to jump, with a bar under each word that handed over to
 * the next, which showed two short bars at once.)
 *
 * --p is how far the scroll has carried the reader through the block, 0 to
 * 1; each word carries its own span of it (--a, where it starts, and --w,
 * one over its length), so the lighting is CSS (.cap-w) and the scroll
 * re-renders nothing. The line is placed by script from the words' own
 * boxes, measured once and again whenever the block reflows. Served whole:
 * before hydration, under reduced motion and in print every word is lit and
 * there is no line. A screen reader is given the sentence once, plain.
 */
export function CaptionTrack({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const line = useRef<HTMLSpanElement>(null);
  const boxes = useRef<Box[]>([]);
  const reduced = useReducedMotion();
  // From the block's top a little above the foot of the screen to its foot
  // a third of the way down: long enough to read along with.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.35"] });

  const words = text.split(/\s+/).filter(Boolean);
  // Each word's share of the sentence, spaces counted, as [start, end).
  const total = Math.max(1, words.reduce((s, w) => s + w.length, 0) + words.length - 1);
  const spans: { a: number; b: number }[] = [];
  let at = 0;
  for (const w of words) {
    const a = at / total;
    at += w.length;
    spans.push({ a, b: at / total });
    at += 1;
  }

  // Where the read is, drawn: the tally line from the head of the current
  // line of text to the read's exact point in it.
  const place = (p: number) => {
    const el = ref.current;
    const bar = line.current;
    const bx = boxes.current;
    if (!el || !bar) return;
    el.style.setProperty("--p", p.toFixed(4));
    if (p <= 0 || p >= 1 || bx.length !== spans.length) {
      bar.style.opacity = "0";
      return;
    }
    // The word the read is in, or the space after it.
    let k = spans.findIndex((s) => p < s.b);
    if (k < 0) k = spans.length - 1;
    const inWord = p >= spans[k].a;
    if (!inWord) k = Math.max(0, k - 1);
    const w = bx[k];
    let x: number;
    if (inWord) {
      x = w.l + ((p - spans[k].a) / (spans[k].b - spans[k].a)) * (w.r - w.l);
    } else {
      // Crossing a space: glide to the next word on the same line, or hold
      // at the line's end if the next word has wrapped.
      const next = bx[k + 1];
      const gap = spans[k + 1].a - spans[k].b;
      x = next && Math.abs(next.t - w.t) < 2 && gap > 0 ? w.r + ((p - spans[k].b) / gap) * (next.l - w.r) : w.r;
    }
    // The head of this line of text: the first word sharing its top.
    let j = k;
    while (j > 0 && Math.abs(bx[j - 1].t - w.t) < 2) j--;
    bar.style.left = bx[j].l + "px";
    bar.style.top = w.b + "px";
    bar.style.width = Math.max(0, x - bx[j].l) + "px";
    bar.style.opacity = "1";
  };

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!reduced) place(v);
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      el.style.removeProperty("--p");
      if (line.current) line.current.style.opacity = "0";
      return;
    }
    // The words' boxes, relative to the block (its offsetParent), measured
    // now and again whenever the block reflows or a late font lands.
    const measure = () => {
      boxes.current = Array.from(el.querySelectorAll<HTMLElement>(".cap-w")).map((w) => ({
        l: w.offsetLeft,
        r: w.offsetLeft + w.offsetWidth,
        t: w.offsetTop,
        b: w.offsetTop + w.offsetHeight,
      }));
      place(scrollYProgress.get());
    };
    measure();
    document.fonts?.ready.then(measure).catch(() => {});
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
    // place reads only refs and the text-derived spans, which are stable for a given text.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, scrollYProgress, text]);

  return (
    <p ref={ref} className={"caption-track relative " + className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <Fragment key={i}>
            {i > 0 && " "}
            <span className="cap-w" style={{ "--a": spans[i].a.toFixed(4), "--w": (1 / (spans[i].b - spans[i].a)).toFixed(3) } as CSSProperties}>
              {w}
            </span>
          </Fragment>
        ))}
      </span>
      <span ref={line} aria-hidden="true" className="cap-line" />
    </p>
  );
}
