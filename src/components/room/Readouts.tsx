"use client";

import { useEffect, useState } from "react";
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
      <span className="text-[color:var(--ink-mid)]">POS</span>{" "}
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
