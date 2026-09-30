"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { m, useAnimationFrame, useInView, useMotionValue, useReducedMotion } from "framer-motion";

/**
 * Two playheads for the home page, each doing what an edit does.
 *
 * At rest -- before hydration, with no script, off screen, or for a reader
 * who asked for stillness -- both show their content complete: every beat
 * lit, every station the same. The motion only ever runs on top of a page
 * that already reads.
 */

const HOLD = 950; // a beat on screen, ms
const LAST = 1700; // "Then repeat." holds longer: the turn of the loop

/**
 * The approach's running order, played: a tally playhead steps down the
 * beats and lights each in turn; on "Then repeat." the ring turns and it
 * starts again from the top.
 */
export function RunningOrder({ beats }: { beats: string[] }) {
  const list = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(list, { amount: 0.4 });
  const [on, setOn] = useState<number | null>(null);
  const [mark, setMark] = useState<{ top: number; height: number } | null>(null);

  useEffect(() => {
    if (reduced || !inView) return;
    let i = 0;
    let timer = 0;
    const step = () => {
      setOn(i);
      // The beats only: the playhead is itself the list's first child while
      // it is showing, and counting it put the mark one row off.
      const row = list.current?.querySelectorAll<HTMLElement>(":scope > li")[i];
      if (row) setMark({ top: row.offsetTop, height: row.offsetHeight });
      const hold = i === beats.length - 1 ? LAST : HOLD;
      i = (i + 1) % beats.length;
      timer = window.setTimeout(step, hold);
    };
    step();
    return () => {
      window.clearTimeout(timer);
      // Off screen the list goes back to rest: every beat lit, no playhead.
      setOn(null);
      setMark(null);
    };
  }, [reduced, inView, beats.length]);

  return (
    <ol ref={list} className="relative md:pt-1">
      {mark && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-4 w-[2px] bg-[color:var(--tally)] shadow-[0_0_10px_var(--tally-glow)] transition-[top,height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:-left-6"
          style={{ top: mark.top, height: mark.height }}
        />
      )}
      {beats.map((b, i) => {
        // The last beat is not a sixth step, it is the instruction to run the
        // five again, so it carries the loop mark, not a number.
        const loops = i === beats.length - 1;
        const dim = on !== null && on !== i;
        return (
          <li
            key={b}
            className="grid grid-cols-[3.5ch_1fr] items-baseline gap-x-5 border-t border-[color:var(--rule)] py-3 last:border-b last:border-[color:var(--rule)] md:gap-x-8 md:py-4"
          >
            <span aria-hidden="true" className={"mono inline-block text-[color:var(--ink-mid)] " + (loops && on === i ? "repeat-turn text-[color:var(--tally)]" : on === i ? "text-[color:var(--tally)]" : "")}>
              {loops ? "↻" : String(i + 1).padStart(2, "0")}
            </span>
            <span
              className={
                "display leading-[0.95] transition-[color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] " +
                (loops ? "text-[clamp(28px,3.8vw,52px)] " : "text-[clamp(32px,4.6vw,64px)] ") +
                (dim ? "text-[color:var(--ink-mid)]" : loops && on === null ? "text-[color:var(--ink-soft)]" : "text-[color:var(--ink)]") +
                (on === i ? " translate-x-2" : "")
              }
            >
              {b}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * The loop, running: a light travels the five stations of "how to use the
 * system", lighting each as it arrives, then rides the dashed arc from the
 * last back to the first. Drawn over the rail in Loop.tsx, whose station
 * marks carry data-station; the arc is the same curve as its SVG path
 * (M 900 72 C 900 0 100 0 100 72 in a 1000-wide box), so the light rides
 * exactly on the dashes.
 */
const HOP = 0.62; // seconds between two stations
const REST = 0.5; // seconds held at each
const ARC = 1.7; // seconds for the ride home
const RAIL = 72; // px from the top of the drawing to the rail line

export function LoopRunner({ stations = 5 }: { stations?: number }) {
  const box = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(box as RefObject<HTMLDivElement>, { amount: 0.3 });
  const left = useMotionValue("10%");
  const top = useMotionValue(RAIL);
  const opacity = useMotionValue(0);
  const t = useRef(0);
  const lit = useRef(-1);

  const hops = stations - 1;
  const period = hops * (HOP + REST) + REST + ARC;
  const at = (k: number) => 10 + (80 * k) / hops; // station k's centre, % of the width

  const light = (k: number) => {
    if (lit.current === k) return;
    lit.current = k;
    const marks = box.current?.parentElement?.querySelectorAll<HTMLElement>("[data-station]");
    marks?.forEach((m, j) => m.classList.toggle("is-lit", j === k));
  };

  useEffect(() => {
    if (!reduced && inView) return;
    // At rest: no light, no lit station.
    opacity.set(0);
    lit.current = -1;
    box.current?.parentElement?.querySelectorAll<HTMLElement>("[data-station]").forEach((m) => m.classList.remove("is-lit"));
  }, [reduced, inView, opacity]);

  useAnimationFrame((_, delta) => {
    if (reduced || !inView) return;
    opacity.set(1);
    t.current = (t.current + Math.min(delta, 64) / 1000) % period;
    let s = t.current;
    // Along the rail: rest, hop, rest, hop ... to the last station.
    for (let k = 0; k < hops; k++) {
      if (s < REST) {
        left.set(at(k) + "%");
        top.set(RAIL);
        return light(k);
      }
      s -= REST;
      if (s < HOP) {
        const e = 1 - Math.pow(1 - s / HOP, 3); // ease out: arrive, not stop dead
        left.set(at(k) + ((at(k + 1) - at(k)) * e) + "%");
        top.set(RAIL);
        return light(-1);
      }
      s -= HOP;
    }
    if (s < REST) {
      left.set(at(hops) + "%");
      top.set(RAIL);
      return light(hops);
    }
    s -= REST;
    // Home along the arc: the SVG's own cubic, sampled.
    const u = Math.min(1, s / ARC);
    const e = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
    const m = 1 - e;
    const x = m * m * m * 90 + 3 * m * m * e * 90 + 3 * m * e * e * 10 + e * e * e * 10;
    const y = m * m * m * RAIL + 3 * m * m * e * 0 + 3 * m * e * e * 0 + e * e * e * RAIL;
    left.set(x + "%");
    top.set(y);
    light(-1);
  });

  return (
    <div ref={box} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[80px]">
      <m.span
        className="absolute h-[11px] w-[11px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--tally)] shadow-[0_0_14px_3px_var(--tally-glow)]"
        style={{ left, top, opacity }}
      />
    </div>
  );
}
