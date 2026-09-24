"use client";

import { useClient } from "@/components/portal/ClientContext";
import { useFilmed } from "@/lib/read";

/**
 * The foot of a script: mark it filmed. The mark lives on this device and
 * shows on the rail, in the first month, on the call sheet and in the home
 * readout, so the scripts room reads as a production board.
 */
export function FilmedToggle({ n }: { n: number }) {
  const me = useClient();
  const { filmed, toggle } = useFilmed(me.slug);
  const k = String(n);
  const done = filmed.has(k);
  return (
    <div className="no-print border-t border-[color:var(--rule)] bg-[color:var(--stage)]">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-6 px-6 py-8 md:px-14">
        <p className="mono flex items-center gap-2">
          {done ? (
            <>
              <span aria-hidden="true" className="pop inline-block h-2 w-2 rounded-full bg-[color:var(--ink)]" />
              <span className="text-[color:var(--ink)]">Filmed</span>
              <span className="text-[color:var(--ink-mid)]">on this device</span>
            </>
          ) : (
            <>
              <span className="lamp-off" aria-hidden="true" />
              In the can?
            </>
          )}
        </p>
        <button type="button" onClick={() => toggle(k)} aria-pressed={done} className={done ? "slate-link" : "pill pill-outline px-6 py-2.5 text-[14px]"} data-cursor={done ? "Undo" : "Mark"}>
          {done ? "Unmark" : "Mark as filmed"}
        </button>
      </div>
    </div>
  );
}
