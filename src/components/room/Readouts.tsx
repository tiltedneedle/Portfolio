"use client";

import { useEffect, useRef, useState } from "react";
import { timecode } from "@/lib/films";

/**
 * Small live instruments used around the room: a running timecode and the
 * two studio clocks. Both are filled by effects so the server never guesses
 * a time and the client never has to correct one.
 */

export function RunningTimecode({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      if (ref.current) ref.current.textContent = timecode((performance.now() - start) / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <span ref={ref} className={"tc " + className}>
      00:00:00:00
    </span>
  );
}

const ZONES = [
  { code: "LDN", tz: "Europe/London" },
  { code: "DXB", tz: "Asia/Dubai" },
];

export function StudioClocks({ className = "" }: { className?: string }) {
  const [times, setTimes] = useState<string[]>(ZONES.map(() => "--:--"));
  useEffect(() => {
    const fmts = ZONES.map(
      (z) => new Intl.DateTimeFormat("en-GB", { timeZone: z.tz, hour: "2-digit", minute: "2-digit", hour12: false })
    );
    const update = () => setTimes(fmts.map((f) => f.format(new Date())));
    update();
    const id = setInterval(update, 15000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className={"mono " + className}>
      {ZONES.map((z, i) => (
        <span key={z.code} className={i > 0 ? "ml-4" : ""}>
          {z.code} <span className="tc text-[color:var(--ink-soft)]">{times[i]}</span>
        </span>
      ))}
    </span>
  );
}
