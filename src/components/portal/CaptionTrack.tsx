"use client";

import { Fragment, useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";

type Box = { l: number; r: number; t: number; b: number };
type Word = { w: string; em: boolean; line: number };

/**
 * A statement read the way the work it is about is read: as a caption
 * track. Scrolling through it plays it. The words light as the read reaches
 * them, the words ahead wait dimmed, and one tally line -- the one thing on
 * the page that is "playing" -- runs under the line being read, from its
 * first letter to the read's exact point, and starts again at the head of
 * the next line when it wraps. The home page's objective reads this way,
 * and so does the rule every guide closes on.
 *
 * Several paragraphs read as one track: the read runs through the first
 * and on into the next. A paragraph may carry the brief's *emphasis*, which
 * is set the way Rich sets it (upright inside the italic).
 *
 * The read moves through the text at an even pace per letter, not per
 * word: a long word takes longer to cross than a short one, and the line
 * glides across the spaces between words rather than jumping from word to
 * word. --p is how far the scroll has carried the reader through the block,
 * 0 to 1; each word carries its own span of it (--a, where it starts, and
 * --w, one over its length), so the lighting is CSS (.cap-w) and the scroll
 * re-renders nothing. The line is placed by script from the words' own
 * boxes, measured once and again whenever the block reflows. Served whole:
 * before hydration, under reduced motion and in print every word is lit and
 * there is no line. A screen reader is given each paragraph once, plain.
 */
export function CaptionTrack({ lines, className = "", lineClassName = "" }: { lines: string[]; className?: string; lineClassName?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLSpanElement>(null);
  const boxes = useRef<Box[]>([]);
  const reduced = useReducedMotion();
  // From the block's top a little above the foot of the screen to its foot
  // a third of the way down: long enough to read along with.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.35"] });

  // The words, paragraph by paragraph, with *emphasis* marked and dropped.
  const words: Word[] = [];
  const plain: string[] = [];
  lines.forEach((text, li) => {
    let em = false;
    let out = "";
    for (const part of text.split(/(\*)/)) {
      if (part === "*") {
        em = !em;
        continue;
      }
      out += part;
      for (const w of part.split(/\s+/).filter(Boolean)) words.push({ w, em, line: li });
    }
    plain.push(out.replace(/\s+/g, " ").trim());
  });
  // Each word's share of the whole, spaces counted, as [start, end).
  const total = Math.max(1, words.reduce((s, x) => s + x.w.length, 0) + words.length - 1);
  const spans: { a: number; b: number }[] = [];
  let at = 0;
  for (const x of words) {
    const a = at / total;
    at += x.w.length;
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

  const key = lines.join("\n");
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      el.style.removeProperty("--p");
      if (line.current) line.current.style.opacity = "0";
      return;
    }
    // The words' boxes, relative to the block (their offsetParent),
    // measured whenever it reflows or a late font lands.
    const measure = () => {
      boxes.current = Array.from(el.querySelectorAll<HTMLElement>(".cap-w")).map((w) => ({
        l: w.offsetLeft,
        r: w.offsetLeft + w.offsetWidth,
        t: w.offsetTop,
        b: w.offsetTop + w.offsetHeight,
      }));
      place(scrollYProgress.get());
    };
    if (typeof ResizeObserver === "undefined") {
      measure();
      document.fonts?.addEventListener("loadingdone", measure);
      return () => document.fonts?.removeEventListener("loadingdone", measure);
    }
    // Measured by a ResizeObserver's calls, which come once the browser has
    // laid the block out itself: measured as the page hydrates, the words
    // forced a layout of the whole page. A late font can move the words
    // without resizing the block, so when one lands the observer is asked
    // to look again (observing afresh always reports). Not
    // document.fonts.ready: once the fonts are in, merely reading it lays
    // the whole page out on the spot.
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const again = () => {
      ro.unobserve(el);
      ro.observe(el);
    };
    document.fonts?.addEventListener("loadingdone", again);
    return () => {
      document.fonts?.removeEventListener("loadingdone", again);
      ro.disconnect();
    };
    // place reads only refs and the text-derived spans, which are stable for a given text.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, scrollYProgress, key]);

  let i = 0;
  return (
    <div ref={ref} className={"caption-track relative " + className}>
      {lines.map((_, li) => (
        <p key={li} className={lineClassName}>
          <span className="sr-only">{plain[li]}</span>
          <span aria-hidden="true">
            {words
              .filter((x) => x.line === li)
              .map((x, k) => {
                const n = i++;
                const style = { "--a": spans[n].a.toFixed(4), "--w": (1 / (spans[n].b - spans[n].a)).toFixed(3) } as CSSProperties;
                const word: ReactNode = x.em ? (
                  <em className="em-serif cap-w" style={style}>
                    {x.w}
                  </em>
                ) : (
                  <span className="cap-w" style={style}>
                    {x.w}
                  </span>
                );
                return (
                  <Fragment key={k}>
                    {k > 0 && " "}
                    {word}
                  </Fragment>
                );
              })}
          </span>
        </p>
      ))}
      <span ref={line} aria-hidden="true" className="cap-line" />
    </div>
  );
}
