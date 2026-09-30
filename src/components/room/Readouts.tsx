"use client";

import { useEffect, useRef, useState } from "react";
import { useClient } from "@/components/portal/ClientContext";
import { useRead } from "@/lib/read";
import { hhmm } from "@/lib/timecode";
import type { Clip } from "@/lib/sequence";

/**
 * Small instruments for the first frame: where this client stands in the
 * reel, and the two studio clocks. The clocks are filled by an effect so the
 * server never guesses a time and the client never has to correct one.
 *
 * There used to be a running timecode here, a requestAnimationFrame loop
 * counting how long you had been looking at the page. It measured staring,
 * not the system, and it was frozen at zero under reduced motion, which is
 * the state the accessibility pass measures. A readout should say something
 * true, so it now reads position in the reel.
 */

export function ReelPosition({ clips, className = "" }: { clips: Clip[]; className?: string }) {
  const me = useClient();
  const { read } = useRead(me.slug);
  // Whole clips only. The footer's timeline and this readout share one
  // estimator and one denominator, so the two can never disagree; a
  // mid-page position store would give the site two answers.
  const total = clips.reduce((n, c) => n + c.minutes, 0);
  const done = clips.reduce((n, c) => (read.has(c.readKey) ? n + c.minutes : n), 0);
  return (
    <span className={"mono " + className}>
      {/* aria-hidden, or the accessible name reads "POS Position: ...". */}
      <span aria-hidden="true" className="text-[color:var(--ink-mid)]">
        POS
      </span>{" "}
      <span aria-hidden="true" className="tc">
        {hhmm(done)}
        <span className="text-[color:var(--ink-mid)]"> / </span>
        {hhmm(total)}
      </span>
      <span className="sr-only">
        Position: {done} of {total} minutes read
      </span>
    </span>
  );
}

/** Runs fn when the page is idle (or soon, where it cannot say); returns a cancel. */
function whenIdle(fn: () => void) {
  if (typeof requestIdleCallback === "function") {
    const h = requestIdleCallback(fn, { timeout: 2000 });
    return () => cancelIdleCallback(h);
  }
  const h = setTimeout(fn, 300);
  return () => clearTimeout(h);
}

const ZONES = [
  { code: "LDN", tz: "Europe/London" },
  { code: "DXB", tz: "Asia/Dubai" },
];

/**
 * The studio's clocks. They start once they are on screen (a phone never
 * shows them) and the page has a moment to spare: the first Intl formatter
 * on a page loads the locale's data and the zones', 0.1 to 0.5s on a slow
 * phone, and as the page hydrated it held everything else up. Until then,
 * and without script, they read --:--.
 */
export function StudioClocks({ className = "" }: { className?: string }) {
  const [times, setTimes] = useState<string[]>(ZONES.map(() => "--:--"));
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    let tick: ReturnType<typeof setInterval> | undefined;
    let later = () => {};
    const start = () => {
      const fmts = ZONES.map(
        (z) => new Intl.DateTimeFormat("en-GB", { timeZone: z.tz, hour: "2-digit", minute: "2-digit", hour12: false })
      );
      const update = () => setTimes(fmts.map((f) => f.format(new Date())));
      update();
      tick = setInterval(update, 15000);
    };
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      later = whenIdle(start);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      later();
      clearInterval(tick);
    };
  }, []);
  return (
    <span ref={ref} className={"mono " + className}>
      {ZONES.map((z, i) => (
        <span key={z.code} className={i > 0 ? "ml-4" : ""}>
          {z.code} <span className="tc text-[color:var(--ink-soft)]">{times[i]}</span>
        </span>
      ))}
    </span>
  );
}
